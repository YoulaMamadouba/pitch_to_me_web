'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Play, 
  Clock, 
  Star, 
  Users, 
  Edit, 
  Trash2, 
  Eye,
  Loader2,
  AlertCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { Module } from '@/lib/moduleService';
import { ActivityDomain } from '@/lib/activityDomainService';
import { getModulesByActivityDomain, getModuleStats } from '@/lib/moduleService';

interface DynamicModulesListProps {
  domain: ActivityDomain;
  onBack: () => void;
  onCreateModule: () => void;
  onEditModule: (module: Module) => void;
  onDeleteModule: (moduleId: string) => void;
  onViewModule: (module: Module) => void;
}

export default function DynamicModulesList({ 
  domain, 
  onBack, 
  onCreateModule, 
  onEditModule, 
  onDeleteModule, 
  onViewModule 
}: DynamicModulesListProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getModulesByActivityDomain(domain.id);
        
        // Enrichir les modules avec les statistiques
        const enrichedModules = await Promise.all(
          data.map(async (module) => {
            try {
              const stats = await getModuleStats(module.id);
              return {
                ...module,
                lessonCount: stats.lessonCount,
                studentsCount: stats.studentsCount,
                averageRating: stats.averageRating
              };
            } catch (error) {
              console.error('Erreur lors de la récupération des stats du module:', error);
              return {
                ...module,
                lessonCount: 0,
                studentsCount: 0,
                averageRating: 0
              };
            }
          })
        );
        
        setModules(enrichedModules);
      } catch (err) {
        console.error('Erreur lors du chargement des modules:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des modules');
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [domain.id]);

  const handleDeleteModule = async (moduleId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
      try {
        await onDeleteModule(moduleId);
        // Rafraîchir la liste
        setModules(prev => prev.filter(module => module.id !== moduleId));
      } catch (error) {
        console.error('Erreur lors de la suppression du module:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
          <span className="text-gray-400">Chargement des modules...</span>
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
            <span>Retour aux domaines</span>
          </button>
        </div>
        <button
          onClick={onCreateModule}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Créer un module</span>
        </button>
      </div>

      {/* Domain Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{domain.name}</h2>
            <p className="text-gray-400 mb-4">{domain.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{modules.length} modules</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{domain.totalDuration || 0} min</span>
              </span>
              <span className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>{domain.studentsCount || 0} étudiants</span>
              </span>
            </div>
          </div>
          <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${domain.color} flex items-center justify-center`}>
            <span className="text-white font-bold text-lg">
              {domain.name.charAt(0)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Modules Grid */}
      {modules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all group"
            >
              {/* Module Header */}
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors mb-2">
                      {module.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                      {module.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        module.locked 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {module.locked ? (
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
                      <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                        {module.niveau_difficulte || 'Intermédiaire'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Module Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Play className="w-4 h-4" />
                      <span>{module.lessonCount || 0} leçons</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{module.duree_estimee} min</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{module.studentsCount || 0}</span>
                  </div>
                </div>
              </div>

              {/* Video Preview */}
              {module.video_url && (
                <div className="px-6 pb-4">
                  <div className="relative w-full h-32 bg-gray-900 rounded-lg overflow-hidden">
                    <iframe
                      src={module.video_url.replace('watch?v=', 'embed/')}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={module.title}
                    />
                  </div>
                </div>
              )}

              {/* Module Actions */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewModule(module)}
                      className="flex items-center space-x-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">Voir</span>
                    </button>
                    <button
                      onClick={() => onEditModule(module)}
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="text-sm">Modifier</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteModule(module.id)}
                    className="flex items-center space-x-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Supprimer</span>
                  </button>
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
          <h3 className="text-lg font-semibold text-white mb-2">Aucun module trouvé</h3>
          <p className="text-gray-400 mb-4">
            Aucun module n'est disponible pour ce domaine d'activité.
          </p>
          <button
            onClick={onCreateModule}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            Créer le premier module
          </button>
        </motion.div>
      )}

      {/* Bottom Stats */}
      {modules.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400">{modules.length}</div>
              <div className="text-sm text-gray-400">Modules Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {modules.reduce((total, module) => total + (module.lessonCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-400">Leçons Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {modules.reduce((total, module) => total + module.duree_estimee, 0)}
              </div>
              <div className="text-sm text-gray-400">Durée Totale (min)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {modules.reduce((total, module) => total + (module.studentsCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-400">Étudiants Total</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
