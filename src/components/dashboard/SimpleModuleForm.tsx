'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Edit } from 'lucide-react';
import { ModuleFolder } from './ModuleFolder';

export interface SimpleModuleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (module: Omit<ModuleFolder, 'id' | 'lessonCount' | 'totalDuration' | 'studentsCount' | 'rating' | 'isLocked' | 'isCompleted' | 'progress' | 'tags' | 'createdAt'>) => void;
  moduleType?: 'b2b' | 'b2c';
  initialData?: Partial<ModuleFolder>;
  isEditing?: boolean;
}

const colorOptions = [
  { name: 'Bleu', value: 'from-blue-500 to-purple-600' },
  { name: 'Vert', value: 'from-green-500 to-emerald-600' },
  { name: 'Rouge', value: 'from-red-500 to-pink-600' },
  { name: 'Jaune', value: 'from-yellow-500 to-orange-600' },
  { name: 'Violet', value: 'from-purple-500 to-indigo-600' },
  { name: 'Cyan', value: 'from-teal-500 to-cyan-600' },
  { name: 'Rose', value: 'from-pink-500 to-rose-600' },
  { name: 'Indigo', value: 'from-indigo-500 to-blue-600' }
];

export default function SimpleModuleForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  moduleType = 'b2b',
  initialData,
  isEditing = false 
}: SimpleModuleFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    difficulty: initialData?.difficulty || 'easy' as 'easy' | 'intermediate' | 'advanced',
    color: initialData?.color || 'from-blue-500 to-purple-600'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        difficulty: 'easy',
        color: 'from-blue-500 to-purple-600'
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      difficulty: 'easy',
      color: 'from-blue-500 to-purple-600'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? 'Modifier le module' : `Ajouter un module ${moduleType.toUpperCase()}`}
            </h2>
            <p className="text-gray-400 mt-1">
              {isEditing ? 'Modifiez les informations du module' : 'Remplissez les informations pour créer un nouveau module'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Titre du module *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 transition-all"
              placeholder="Ex: Techniques de vente avancées"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 transition-all resize-none"
              placeholder="Décrivez le contenu, les objectifs et les compétences que ce module permettra d'acquérir..."
              required
            />
          </div>

          {/* Difficulté et Couleur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Difficulté */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Niveau de difficulté
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'intermediate' | 'advanced' })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 transition-all"
              >
                <option value="easy">Facile - Débutant</option>
                <option value="intermediate">Intermédiaire - Confirmé</option>
                <option value="advanced">Avancé - Expert</option>
              </select>
            </div>

            {/* Couleur */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Couleur du module
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color.value} border-2 transition-all hover:scale-105 ${
                      formData.color === color.value ? 'border-yellow-400 shadow-lg' : 'border-transparent hover:border-white/20'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Informations automatiques</h4>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
              <div>
                <span className="font-medium">Leçons :</span> 0 (à ajouter après création)
              </div>
              <div>
                <span className="font-medium">Durée :</span> 0 min (calculée automatiquement)
              </div>
              <div>
                <span className="font-medium">Étudiants :</span> 0 (mis à jour automatiquement)
              </div>
              <div>
                <span className="font-medium">Note :</span> 0.0 (basée sur les avis)
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700/50">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!formData.title || !formData.description}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isEditing ? (
                <>
                  <Edit className="w-4 h-4" />
                  <span>Modifier le module</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Créer le module</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
