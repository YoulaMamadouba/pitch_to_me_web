'use client';

import { motion } from 'framer-motion';
import { Play, Clock, Star, Users, Edit, Trash2, Eye } from 'lucide-react';

export interface Module {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  theme: string;
  domain: string;
  offerType?: string;
  activityDomain?: string;
  difficulty: 'easy' | 'intermediate' | 'advanced';
  duration: number; // en minutes
  tags: string[];
  rating: number;
  studentsCount: number;
  createdAt: string;
}

interface ModuleCardProps {
  module: Module;
  onEdit?: (module: Module) => void;
  onDelete?: (moduleId: string) => void;
  onView?: (module: Module) => void;
}

export default function ModuleCard({ module, onEdit, onDelete, onView }: ModuleCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Facile';
      case 'intermediate':
        return 'Intermédiaire';
      case 'advanced':
        return 'Avancé';
      default:
        return difficulty;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all group overflow-hidden"
    >
      {/* Video Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(module);
              }}
              className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-yellow-500 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(module);
              }}
              className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(module.id);
              }}
              className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Difficulty Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(module.difficulty)}`}>
          {getDifficultyLabel(module.difficulty)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors line-clamp-2">
            {module.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {module.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{module.duration} min</span>
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

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {module.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/50"
            >
              {tag}
            </span>
          ))}
          {module.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full border border-gray-600/50">
              +{module.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="text-xs text-gray-500">
            Créé le {new Date(module.createdAt).toLocaleDateString('fr-FR')}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">{module.domain}</span>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
            <span className="text-xs text-gray-400">{module.theme}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
