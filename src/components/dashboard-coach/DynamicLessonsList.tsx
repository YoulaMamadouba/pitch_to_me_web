'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Play, 
  Clock, 
  Edit, 
  Trash2, 
  Video,
  FileText,
  CheckCircle,
  Lock
} from 'lucide-react';
import { useLessons } from '@/contexts/LessonsContext';
import { Module } from '@/lib/moduleService';
import { Lesson, CreateLessonData } from '@/lib/lessonService';
import DynamicLessonForm from './DynamicLessonForm';

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
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [moduleStats, setModuleStats] = useState<{
    lessonCount: number;
    totalDuration: number;
  }>({ lessonCount: 0, totalDuration: 0 });

  const { getLessonsForModule, getModuleStats, refreshLessons } = useLessons();

  // Charger les leçons du module
  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [lessonsData, statsData] = await Promise.all([
          getLessonsForModule(module.id),
          getModuleStats(module.id)
        ]);
        
        setLessons(lessonsData);
        setModuleStats(statsData);
      } catch (err) {
        console.error('Erreur lors du chargement des leçons:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des leçons');
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [module.id, getLessonsForModule, getModuleStats]);

  const handleCreateLesson = () => {
    setEditingLesson(null);
    setShowLessonForm(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setShowLessonForm(true);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette leçon ?')) {
      try {
        onDeleteLesson(lessonId);
        // Recharger les leçons
        const updatedLessons = await getLessonsForModule(module.id);
        setLessons(updatedLessons);
        
        // Mettre à jour les statistiques
        const updatedStats = await getModuleStats(module.id);
        setModuleStats(updatedStats);
      } catch (err) {
        console.error('Erreur lors de la suppression de la leçon:', err);
      }
    }
  };

  const handleLessonSubmit = async (lessonData: CreateLessonData) => {
    try {
      if (editingLesson) {
        await onEditLesson(editingLesson);
      } else {
        await onCreateLesson();
      }
      
      setShowLessonForm(false);
      setEditingLesson(null);
      
      // Recharger les leçons
      const updatedLessons = await getLessonsForModule(module.id);
      setLessons(updatedLessons);
      
      // Mettre à jour les statistiques
      const updatedStats = await getModuleStats(module.id);
      setModuleStats(updatedStats);
    } catch (error) {
      console.error('Erreur lors de la soumission de la leçon:', error);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const getVideoId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
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
          onClick={handleCreateLesson}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Créer une leçon</span>
        </button>
      </div>

      {/* Module Info */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <Video className="w-8 h-8 text-yellow-400" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">{module.title}</h1>
            <p className="text-gray-400 mb-4">{module.description}</p>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{moduleStats.lessonCount} leçons</span>
              </div>
              <div className="flex items-center space-x-2">
                <Play className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{formatDuration(moduleStats.totalDuration)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">Niveau {module.niveau_difficulte}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Leçons du module</h2>
          <span className="text-gray-400 text-sm">
            {lessons.length} leçon{lessons.length > 1 ? 's' : ''}
          </span>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500/30 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Aucune leçon</h3>
            <p className="text-gray-400 mb-6">
              Ce module n'a pas encore de leçons. Créez la première leçon pour commencer.
            </p>
            <button
              onClick={handleCreateLesson}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Créer la première leçon
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-400/30 transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <span className="text-yellow-400 font-bold text-sm">{lesson.order_number}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{lesson.title}</h3>
                        {lesson.description && (
                          <p className="text-gray-400 text-sm mb-3">{lesson.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm">
                          {lesson.duration && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-300">{formatDuration(lesson.duration)}</span>
                            </div>
                          )}
                          {lesson.video_url && (
                            <div className="flex items-center space-x-1">
                              <Video className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-300">Vidéo incluse</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onViewLesson(lesson)}
                          className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                          title="Voir la leçon"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditLesson(lesson)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                          title="Modifier la leçon"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Supprimer la leçon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lesson Form Modal */}
      <DynamicLessonForm
        isOpen={showLessonForm}
        onClose={() => {
          setShowLessonForm(false);
          setEditingLesson(null);
        }}
        onSubmit={handleLessonSubmit}
        moduleId={module.id}
        editingLesson={editingLesson}
        nextOrderNumber={lessons.length + 1}
      />
    </div>
  );
}
