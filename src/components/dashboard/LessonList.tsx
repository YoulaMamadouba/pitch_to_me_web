'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Lock, CheckCircle, Clock, BookOpen, FileText, Zap, BarChart2, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CoachModule, BaseLesson, LessonStatus, LessonType } from '@/types';

interface LessonListProps {
  module: CoachModule;
  onBack: () => void;
  onLessonSelect: (lesson: BaseLesson) => void;
}

export default function LessonList({ module, onBack, onLessonSelect }: LessonListProps) {
  const router = useRouter();

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4 text-blue-400" />;
      case 'reading':
        return <BookOpen className="w-4 h-4 text-green-400" />;
      case 'quiz':
        return <FileText className="w-4 h-4 text-purple-400" />;
      case 'exercise':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: LessonStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'locked':
        return <Lock className="w-4 h-4 text-red-400" />;
      case 'unlocked':
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: LessonStatus) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in-progress':
        return 'En cours';
      case 'locked':
        return 'Verrouillé';
      case 'unlocked':
        return 'Déverrouillé';
      default:
        return '';
    }
  };

  const handleLessonClick = (lesson: BaseLesson) => {
    if (lesson.status === 'locked') return;
    onLessonSelect(lesson);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux modules</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            {module.lessons?.filter(l => l.status === 'completed').length || 0} sur {module.lessons?.length || 0} leçons complétées
          </div>
          <div className="h-8 w-px bg-gray-700" />
          <div className="text-sm text-gray-400">
            Durée totale : {module.duration} min
          </div>
        </div>
      </div>

      {/* Titre et description du module */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-2">{module.title}</h2>
        <p className="text-gray-400 mb-4">{module.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <BarChart2 className="w-4 h-4 text-yellow-400" />
            <span>Difficulté: {module.difficulty}</span>
          </div>
          <div className="h-4 w-px bg-gray-700" />
          <div className="flex items-center space-x-1">
            <Award className="w-4 h-4 text-yellow-400" />
            <span>Note: {module.rating}/5</span>
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progression</span>
          <span>{Math.round(module.progress || 0)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full" 
            style={{ width: `${module.progress || 0}%` }}
          />
        </div>
      </div>

      {/* Liste des leçons */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white mb-4">Leçons ({module.lessons?.length || 0})</h3>
        
        {module.lessons?.length ? (
          <div className="space-y-2">
            {module.lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleLessonClick(lesson)}
                className={`p-4 rounded-lg border ${
                  lesson.status === 'locked'
                    ? 'border-gray-700 bg-gray-800/50 cursor-not-allowed'
                    : 'border-gray-700 bg-gray-800/30 hover:bg-gray-700/30 cursor-pointer transition-colors'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    lesson.status === 'completed' 
                      ? 'bg-green-400/10' 
                      : lesson.status === 'in-progress'
                      ? 'bg-yellow-400/10'
                      : 'bg-gray-700/50'
                  }`}>
                    {getLessonIcon(lesson.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-medium truncate ${
                        lesson.status === 'locked' ? 'text-gray-500' : 'text-white'
                      }`}>
                        {lesson.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">{lesson.duration} min</span>
                        {getStatusIcon(lesson.status)}
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-1 space-x-2">
                      <span className={`text-xs ${
                        lesson.status === 'completed' 
                          ? 'text-green-400' 
                          : lesson.status === 'in-progress'
                          ? 'text-yellow-400'
                          : 'text-gray-500'
                      }`}>
                        {getStatusText(lesson.status)}
                      </span>
                      
                      {lesson.status !== 'locked' && (
                        <div className="w-16 bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-yellow-400 h-1.5 rounded-full" 
                            style={{ width: `${lesson.status === 'completed' ? 100 : 50}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
            <p className="text-gray-400">Aucune leçon disponible pour ce module.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
