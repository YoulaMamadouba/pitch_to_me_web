'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Save, 
  Loader2,
  AlertCircle,
  Upload,
  Link as LinkIcon
} from 'lucide-react';
import { Module, CreateModuleData } from '@/lib/moduleService';
import { ActivityDomain } from '@/lib/activityDomainService';
import { useActivityDomains } from '@/contexts/ActivityDomainsContext';

interface DynamicModuleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (moduleData: CreateModuleData) => Promise<void>;
  moduleType: 'b2b' | 'b2c';
  editingModule?: Module | null;
}

export default function DynamicModuleForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  moduleType,
  editingModule 
}: DynamicModuleFormProps) {
  const { domains } = useActivityDomains();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateModuleData>({
    title: '',
    description: '',
    video_url: '',
    theme: '',
    domain_metier: '',
    type_offre: '',
    niveau_difficulte: 'intermediaire',
    duree_estimee: 30,
    mots_cles: '',
    locked: false,
    video_id: '',
    type: moduleType,
    activity_domain_id: ''
  });

  // Filtrer les domaines par type avec useMemo pour éviter les re-rendus
  const availableDomains = useMemo(() => 
    domains.filter(domain => domain.type === moduleType), 
    [domains, moduleType]
  );

  useEffect(() => {
    if (editingModule) {
      setFormData({
        title: editingModule.title,
        description: editingModule.description,
        video_url: editingModule.video_url || '',
        theme: editingModule.theme || '',
        domain_metier: editingModule.domain_metier || '',
        type_offre: editingModule.type_offre || '',
        niveau_difficulte: editingModule.niveau_difficulte || 'intermediaire',
        duree_estimee: editingModule.duree_estimee,
        mots_cles: editingModule.mots_cles || '',
        locked: editingModule.locked,
        video_id: editingModule.video_id || '',
        type: editingModule.type,
        activity_domain_id: editingModule.activity_domain_id || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        video_url: '',
        theme: '',
        domain_metier: '',
        type_offre: '',
        niveau_difficulte: 'intermediaire',
        duree_estimee: 30,
        mots_cles: '',
        locked: false,
        video_id: '',
        type: moduleType,
        activity_domain_id: availableDomains.length > 0 ? availableDomains[0].id : ''
      });
    }
  }, [editingModule, moduleType, domains]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde du module');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            {editingModule ? 'Modifier le module' : 'Créer un nouveau module'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Titre du module *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                placeholder="Ex: Techniques de vente avancées"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Domaine d'activité *
              </label>
              <select
                value={formData.activity_domain_id}
                onChange={(e) => setFormData(prev => ({ ...prev, activity_domain_id: e.target.value }))}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="">Sélectionner un domaine</option>
                {availableDomains.map((domain) => (
                  <option key={domain.id} value={domain.id}>
                    {domain.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
              placeholder="Description détaillée du module..."
            />
          </div>

          {/* Configuration technique */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Niveau de difficulté
              </label>
              <select
                value={formData.niveau_difficulte}
                onChange={(e) => setFormData(prev => ({ ...prev, niveau_difficulte: e.target.value as any }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="debutant">Débutant</option>
                <option value="intermediaire">Intermédiaire</option>
                <option value="avance">Avancé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Durée estimée (minutes) *
              </label>
              <input
                type="number"
                value={formData.duree_estimee}
                onChange={(e) => setFormData(prev => ({ ...prev, duree_estimee: parseInt(e.target.value) || 0 }))}
                required
                min="1"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Statut
              </label>
              <select
                value={formData.locked ? 'locked' : 'unlocked'}
                onChange={(e) => setFormData(prev => ({ ...prev, locked: e.target.value === 'locked' }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="unlocked">Déverrouillé</option>
                <option value="locked">Verrouillé</option>
              </select>
            </div>
          </div>

          {/* Contenu multimédia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL de la vidéo
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  className="w-full px-3 py-2 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ID de la vidéo
              </label>
              <input
                type="text"
                value={formData.video_id}
                onChange={(e) => setFormData(prev => ({ ...prev, video_id: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                placeholder="ID de la vidéo (optionnel)"
              />
            </div>
          </div>

          {/* Métadonnées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Thème
              </label>
              <input
                type="text"
                value={formData.theme}
                onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                placeholder="Ex: Négociation commerciale"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type d'offre
              </label>
              <input
                type="text"
                value={formData.type_offre}
                onChange={(e) => setFormData(prev => ({ ...prev, type_offre: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                placeholder="Ex: commercial, management, rh"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mots-clés
            </label>
            <textarea
              value={formData.mots_cles}
              onChange={(e) => setFormData(prev => ({ ...prev, mots_cles: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
              placeholder="Mots-clés séparés par des virgules..."
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sauvegarde...</span>
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
    </div>
  );
}
