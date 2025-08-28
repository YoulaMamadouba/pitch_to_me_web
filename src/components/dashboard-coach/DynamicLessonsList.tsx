'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Play, 
  Clock, 
  FileText, 
  Video, 
  File, 
  Edit, 
  Trash2, 
  Eye,
  Loader2,
  AlertCircle,
  Lock,
  Unlock,
  GripVertical,
  CheckCircle,
  Circle
} from 'lucide-react';
import { Lesson, getLessonsByModule, createLesson, updateLesson, deleteLesson, reorderLessons } from '@/lib/lessonService';
import { Module } from '@/lib/moduleService';

interface DynamicLessonsListProps {
  module: Module;
  onBack: () => void;
  onCreateLesson: () => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lessonId: string) => void;
  onViewLesson: (lesson: Lesson) => void;
}

export default function DynamicLessonsList({ 
  module, 
  onBack, 
  onCreateLesson, 
  onEditLesson, 
  onDeleteLesson, 
  onViewLesson 
}: DynamicLessonsListProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLessonsByModule(module.id);
        setLessons(data);
      } catch (err) {
        console.error('Erreur lors du chargement des leçons:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des leçons');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [module.id]);

  const handleDeleteLesson = async (lessonId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?')) {
      try {
        await onDeleteLesson(lessonId);
        // Rafraîchir la liste
        setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
      } catch (error) {
        console.error('Erreur lors de la suppression de la leçon:', error);
      }
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'pdf':
        return <File className="w-4 h-4" />;
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />;
      case 'exercise':
        return <Circle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getContentTypeColor = (contentType: string) => {
    switch (contentType) {
      case 'video':
        return 'text-red-400';
      case 'pdf':
        return 'text-blue-400';
      case 'text':
        return 'text-green-400';
      case 'quiz':
        return 'text-purple-400';
      case 'exercise':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
          <span className="text-gray-400">Chargement des leçons...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Erreur de chargement</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au module</span>
          </button>
        </div>
        <button
          onClick={onCreateLesson}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Créer une leçon</span>
        </button>
      </div>

      {/* Module Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{module.title}</h2>
            <p className="text-gray-400 mb-4">{module.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span className="flex items-center space-x-1">
                <Play className="w-4 h-4" />
                <span>{lessons.length} leçons</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{module.duree_estimee} min</span>
              </span>
              <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                {module.niveau_difficulte || 'Intermédiaire'}
              </span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {module.title.charAt(0)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Lessons List */}
      {lessons.length > 0 ? (
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex items-center space-x-2 text-gray-400 mt-1">
                      <GripVertical className="w-4 h-4" />
                      <span className="text-sm font-medium">#{lesson.order_index}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                          {lesson.title}
                        </h3>
                        <div className={`flex items-center space-x-1 ${getContentTypeColor(lesson.content_type)}`}>
                          {getContentTypeIcon(lesson.content_type)}
                          <span className="text-xs capitalize">{lesson.content_type}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lesson.is_locked 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {lesson.is_locked ? (
                            <span className="flex items-center space-x-1">
                              <Lock className="w-3 h-3" />
                              <span>Verrouillé</span>
                            </span>
                          ) : (
                            <span className="flex items-center space-x-1">
                              <Unlock className="w-3 h-3" />
                              <span>Déverrouillé</span>
                            </span>
                          )}
                        </span>
                      </div>
                      
                      {lesson.description && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {lesson.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{lesson.duration_minutes} min</span>
                        </span>
                        {lesson.content_url && (
                          <span className="flex items-center space-x-1">
                            <File className="w-4 h-4" />
                            <span>Ressource jointe</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onViewLesson(lesson)}
                      className="flex items-center space-x-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Voir</span>
                    </button>
                    <button
                      onClick={() => onEditLesson(lesson)}
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-sm">Modifier</span>
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Aucune leçon trouvée</h3>
          <p className="text-gray-400 mb-4">
            Aucune leçon n'est disponible pour ce module.
          </p>
          <button
            onClick={onCreateLesson}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            Créer la première leçon
          </button>
        </motion.div>
      )}

      {/* Bottom Stats */}
      {lessons.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400">{lessons.length}</div>
              <div className="text-sm text-gray-400">Leçons Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {lessons.reduce((total, lesson) => total + lesson.duration_minutes, 0)}
              </div>
              <div className="text-sm text-gray-400">Durée Totale (min)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {lessons.filter(lesson => !lesson.is_locked).length}
              </div>
              <div className="text-sm text-gray-400">Leçons Déverrouillées</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {lessons.filter(lesson => lesson.content_url).length}
              </div>
              <div className="text-sm text-gray-400">Avec Ressources</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
