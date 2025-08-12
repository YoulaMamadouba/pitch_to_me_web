'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Video, Tag, Clock, BookOpen } from 'lucide-react';
import { Module } from './ModuleCard';

interface ModuleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (moduleData: Partial<Module>) => void;
  moduleType: 'b2b' | 'b2c';
  editingModule?: Module | null;
  domains: Array<{ id: string; name: string }>;
}

export default function ModuleForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  moduleType, 
  editingModule, 
  domains 
}: ModuleFormProps) {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    videoUrl: string;
    theme: string;
    domain: string;
    offerType: string;
    difficulty: 'easy' | 'intermediate' | 'advanced';
    duration: number;
    tags: string;
  }>({
    title: '',
    description: '',
    videoUrl: '',
    theme: '',
    domain: '',
    offerType: '',
    difficulty: 'intermediate',
    duration: 30,
    tags: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingModule) {
      setFormData({
        title: editingModule.title,
        description: editingModule.description,
        videoUrl: editingModule.videoUrl,
        theme: editingModule.theme,
        domain: editingModule.domain,
        offerType: editingModule.activityDomain || '',
        difficulty: editingModule.difficulty,
        duration: editingModule.duration,
        tags: editingModule.tags.join(', ')
      });
    } else {
      setFormData({
        title: '',
        description: '',
        videoUrl: '',
        theme: '',
        domain: '',
        offerType: '',
        difficulty: 'intermediate',
        duration: 30,
        tags: ''
      });
    }
  }, [editingModule, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const moduleData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        moduleType,
        activityDomain: formData.offerType // On mappe offerType vers activityDomain
      };

      await onSubmit(moduleData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du module:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Types d'offre (qui sont en fait les domaines d'activité)
  const offerTypes = [
    { value: 'commercial', label: 'Commercial' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'rh', label: 'Ressources Humaines' },
    { value: 'finance', label: 'Finance' },
    { value: 'management', label: 'Management' },
    { value: 'international', label: 'International' },
    { value: 'autres', label: 'Autres' }
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {editingModule ? 'Modifier le module' : 'Créer un nouveau module'}
              </h2>
              <p className="text-sm text-gray-400">
                {moduleType.toUpperCase()} - {editingModule ? 'Modification' : 'Création'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Titre du module *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Ex: Techniques de vente avancées"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Décrivez le contenu et les objectifs de ce module..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL de la vidéo *
            </label>
            <div className="relative">
              <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Thème *
              </label>
              <input
                type="text"
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ex: Négociation commerciale"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Domaine métier *
              </label>
              <select
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Sélectionnez un domaine</option>
                {domains.map((domain) => (
                  <option key={domain.id} value={domain.name}>
                    {domain.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type d'offre *
              </label>
              <select
                name="offerType"
                value={formData.offerType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Sélectionnez un type d'offre</option>
                {offerTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Niveau de difficulté *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="easy">Facile</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Durée estimée (minutes) *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="480"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="30"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mots-clés
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="vente, négociation, commercial, techniques (séparés par des virgules)"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Séparez les mots-clés par des virgules
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-600/50 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{editingModule ? 'Modifier' : 'Créer'} le module</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
