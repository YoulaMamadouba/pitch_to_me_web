'use client';

import { motion } from 'framer-motion';
import { Folder, Play, Clock, Users, Star, Lock, CheckCircle } from 'lucide-react';

export interface ModuleFolder {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  totalDuration: number;
  studentsCount: number;
  rating: number;
  difficulty: 'easy' | 'intermediate' | 'advanced';
  isLocked: boolean;
  isCompleted: boolean;
  progress: number;
  color: string;
  tags: string[];
  createdAt: string;
}

interface ModuleFolderProps {
  module: ModuleFolder;
  onClick: (module: ModuleFolder) => void;
}

export default function ModuleFolder({ module, onClick }: ModuleFolderProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Facile';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return difficulty;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={() => onClick(module)}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all cursor-pointer group overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center relative`}>
            <Folder className="w-6 h-6 text-white" />
            {module.isCompleted && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
            {module.isLocked && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
                <Lock className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-400">{module.lessonCount}</div>
            <div className="text-xs text-gray-400">leçons</div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors mb-2 line-clamp-2">
          {module.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {module.description}
        </p>

        {!module.isLocked && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>Progression</span>
              <span>{module.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  module.isCompleted ? 'bg-green-400' : 'bg-yellow-400'
                }`} 
                style={{ width: `${module.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{Math.round(module.totalDuration / 60)}h {module.totalDuration % 60}min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{module.studentsCount}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-yellow-400 font-medium">{module.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            {module.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/50"
              >
                {tag}
              </span>
            ))}
            {module.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full border border-gray-600/50">
                +{module.tags.length - 2}
              </span>
            )}
          </div>
          
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(module.difficulty)}`}>
            {getDifficultyLabel(module.difficulty)}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span>
              {module.isLocked ? 'Module verrouillé' : module.isCompleted ? 'Module terminé' : 'Voir les leçons'}
            </span>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            module.isLocked 
              ? 'bg-gray-600' 
              : module.isCompleted 
                ? 'bg-green-500' 
                : 'bg-gray-700/50 group-hover:bg-yellow-500'
          }`}>
            {module.isLocked ? (
              <Lock className="w-4 h-4 text-gray-400" />
            ) : module.isCompleted ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors ml-0.5" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
