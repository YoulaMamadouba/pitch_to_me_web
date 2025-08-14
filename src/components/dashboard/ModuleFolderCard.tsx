'use client';

import { motion } from 'framer-motion';
import { Folder, Lock, Unlock, CheckCircle, Clock, Play } from 'lucide-react';
import { CoachModule, LessonStatus } from '@/types';

interface ModuleFolderCardProps {
  module: CoachModule;
  onClick: () => void;
}

export default function ModuleFolderCard({ module, onClick }: ModuleFolderCardProps) {
  const getStatusIcon = (status: LessonStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'locked':
        return <Lock className="w-4 h-4 text-red-400" />;
      case 'unlocked':
        return <Play className="w-4 h-4 text-blue-400" />;
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

  const isLocked = module.status === 'locked';
  const completedLessons = module.lessons?.filter(l => l.status === 'completed').length || 0;
  const totalLessons = module.lessons?.length || 0;
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border ${
        isLocked 
          ? 'border-gray-700 bg-gray-800/30 cursor-not-allowed' 
          : 'border-gray-700 bg-gray-800/30 hover:bg-gray-700/30 cursor-pointer'
      } transition-all`}
    >
      {/* En-tête du dossier */}
      <div className={`p-4 pb-2 ${isLocked ? 'opacity-60' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <Folder className={`w-5 h-5 ${
                isLocked ? 'text-gray-500' : 'text-yellow-400'
              }`} />
              <h3 className={`text-sm font-medium truncate ${
                isLocked ? 'text-gray-400' : 'text-white'
              }`}>
                {module.title}
              </h3>
            </div>
            
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
              {module.description}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              module.difficulty === 'easy' 
                ? 'bg-green-900/30 text-green-400' 
                : module.difficulty === 'intermediate'
                ? 'bg-yellow-900/30 text-yellow-400'
                : 'bg-red-900/30 text-red-400'
            }`}>
              {module.difficulty === 'easy' 
                ? 'Débutant' 
                : module.difficulty === 'intermediate' 
                ? 'Intermédiaire' 
                : 'Avancé'}
            </span>
            
            {module.status && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                module.status === 'completed' 
                  ? 'bg-green-900/30 text-green-400' 
                  : module.status === 'in-progress'
                  ? 'bg-yellow-900/30 text-yellow-400'
                  : 'bg-gray-800/50 text-gray-400'
              }`}>
                {getStatusText(module.status)}
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span>{totalLessons} leçons</span>
            <span>•</span>
            <span>{module.duration} min</span>
          </div>
          
          {module.rating > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-xs font-medium text-yellow-400">{module.rating.toFixed(1)}</span>
              <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {/* Barre de progression */}
      <div className="px-4 pb-3">
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-1.5 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{progress}% complété</span>
          <span>{completedLessons}/{totalLessons} leçons</span>
        </div>
      </div>
      
      {/* Badge de statut */}
      {module.status && (
        <div className="absolute top-3 right-3">
          <div className={`p-1.5 rounded-full ${
            module.status === 'completed' 
              ? 'bg-green-400/10' 
              : module.status === 'in-progress'
              ? 'bg-yellow-400/10'
              : 'bg-gray-700/50'
          }`}>
            {getStatusIcon(module.status)}
          </div>
        </div>
      )}
      
      {/* Overlay verrouillé */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Lock className="w-6 h-6 text-gray-400" />
        </div>
      )}
    </motion.div>
  );
}
