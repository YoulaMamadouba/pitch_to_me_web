'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  Video,
  Clock,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Lesson, CreateLessonData } from '@/lib/lessonService';

interface DynamicLessonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lessonData: CreateLessonData) => Promise<void>;
  moduleId: string;
  editingLesson: Lesson | null;
  nextOrderNumber: number;
}

export default function DynamicLessonForm({
  isOpen,
  onClose,
  onSubmit,
  moduleId,
  editingLesson,
  nextOrderNumber
}: DynamicLessonFormProps) {
  const [formData, setFormData] = useState<CreateLessonData>({
    module_id: moduleId,
    title: '',
    description: '',
    order_number: nextOrderNumber,
    video_url: '',
    duration: undefined,
    order_index: nextOrderNumber
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingLesson) {
      setFormData({
        module_id: moduleId,
        title: editingLesson.title,
        description: editingLesson.description || '',
        order_number: editingLesson.order_number,
        video_url: editingLesson.video_url || '',
        duration: editingLesson.duration || undefined,
        order_index: editingLesson.order_index
      });
    } else {
      setFormData({
        module_id: moduleId,
        title: '',
        description: '',
        order_number: nextOrderNumber,
        video_url: '',
        duration: undefined,
        order_index: nextOrderNumber
      });
    }
  }, [editingLesson, moduleId, nextOrderNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Le titre de la leçon est requis');
      return;
    }

    if (!formData.order_number || formData.order_number < 1) {
      setError('Le numéro d\'ordre doit être supérieur à 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la leçon:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde de la leçon');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateLessonData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (error) {
      setError(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-gray-900 rounded-xl border border-gray-700/50 shadow-2xl my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {editingLesson ? 'Modifier la leçon' : 'Créer une nouvelle leçon'}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {editingLesson ? 'Modifiez les détails de la leçon' : 'Ajoutez une nouvelle leçon au module'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-96 overflow-y-auto">
              {error && (
                <div className="bg-red-900/50 border border-red-500/30 rounded-lg p-4 flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-400">{error}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Titre de la leçon *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-colors"
                  placeholder="Ex: Introduction aux techniques de vente"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-colors resize-none"
                  placeholder="Description détaillée de la leçon..."
                />
              </div>

              {/* Order Number */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Numéro d'ordre *
                </label>
                <input
                  type="number"
                  value={formData.order_number}
                  onChange={(e) => handleInputChange('order_number', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-colors"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Durée (minutes)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.duration || ''}
                    onChange={(e) => handleInputChange('duration', e.target.value ? parseInt(e.target.value) : undefined)}
                    min="1"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-colors"
                    placeholder="30"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL de la vidéo
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => handleInputChange('video_url', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-colors"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Video className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Supporte YouTube, Vimeo et autres plateformes vidéo
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-700/50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-400 hover:text-white font-medium rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  Annuler
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Sauvegarde...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingLesson ? 'Modifier la leçon' : 'Créer la leçon'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
