'use client';

import { motion } from 'framer-motion';
import { Play, Clock, CheckCircle, Lock, Eye, Download, BookOpen, Video } from 'lucide-react';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'exercise';
  duration: number; // en minutes
  isCompleted: boolean;
  isLocked: boolean;
  isWatched: boolean;
  videoUrl?: string;
  documentUrl?: string;
  thumbnail?: string;
  tags: string[];
  createdAt: string;
  order: number;
}

interface LessonCardProps {
  lesson: Lesson;
  onClick: (lesson: Lesson) => void;
  isActive?: boolean;
}

export default function LessonCard({ lesson, onClick, isActive = false }: LessonCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'document': return BookOpen;
      case 'quiz': return Eye;
      case 'exercise': return Download;
      default: return Play;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'document': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'quiz': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'exercise': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Vidéo';
      case 'document': return 'Document';
      case 'quiz': return 'Quiz';
      case 'exercise': return 'Exercice';
      default: return type;
    }
  };

  const Icon = getTypeIcon(lesson.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4, scale: 1.01 }}
      onClick={() => onClick(lesson)}
      className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border transition-all cursor-pointer group overflow-hidden ${
        isActive 
          ? 'border-yellow-400/50 bg-yellow-400/10' 
          : 'border-gray-700/50 hover:border-yellow-400/30'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start space-x-4">
          {/* Numéro de leçon et icône */}
          <div className="flex flex-col items-center space-y-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              lesson.isCompleted 
                ? 'bg-green-500 text-white' 
                : lesson.isLocked 
                  ? 'bg-gray-600 text-gray-300' 
                  : 'bg-yellow-500 text-black'
            }`}>
              {lesson.isCompleted ? (
                <CheckCircle className="w-4 h-4" />
              ) : lesson.isLocked ? (
                <Lock className="w-4 h-4" />
              ) : (
                lesson.order
              )}
            </div>
            
            {!lesson.isLocked && !lesson.isCompleted && (
              <div className="w-0.5 h-8 bg-gray-600"></div>
            )}
          </div>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`text-lg font-semibold line-clamp-2 ${
                lesson.isCompleted 
                  ? 'text-green-400' 
                  : lesson.isLocked 
                    ? 'text-gray-500' 
                    : 'text-white group-hover:text-yellow-400'
              } transition-colors`}>
                {lesson.title}
              </h3>
              
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ml-2 flex-shrink-0 ${getTypeColor(lesson.type)}`}>
                {getTypeLabel(lesson.type)}
              </div>
            </div>

            <p className={`text-sm mb-3 line-clamp-2 ${
              lesson.isLocked ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {lesson.description}
            </p>

            {/* Meta informations */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{lesson.duration} min</span>
                </div>
                
                {lesson.isWatched && !lesson.isLocked && (
                  <div className="flex items-center space-x-1 text-blue-400">
                    <Eye className="w-4 h-4" />
                    <span>Vue</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {lesson.thumbnail && (
                  <div className="w-12 h-8 bg-gray-700 rounded overflow-hidden">
                    <img 
                      src={lesson.thumbnail} 
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  lesson.isLocked 
                    ? 'bg-gray-600' 
                    : lesson.isCompleted 
                      ? 'bg-green-500' 
                      : 'bg-gray-700/50 group-hover:bg-yellow-500'
                }`}>
                  {lesson.isLocked ? (
                    <Lock className="w-4 h-4 text-gray-400" />
                  ) : lesson.isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            {lesson.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {lesson.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/50"
                  >
                    {tag}
                  </span>
                ))}
                {lesson.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full border border-gray-600/50">
                    +{lesson.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

