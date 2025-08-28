'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Users, 
  Target, 
  Plus, 
  TrendingUp, 
  BarChart3, 
  Globe, 
  Briefcase,
  Shield,
  Factory,
  Car,
  Plane,
  Heart,
  GraduationCap,
  ShoppingBag,
  Wrench,
  Leaf,
  Zap,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useActivityDomains } from '@/contexts/ActivityDomainsContext';
import { useModules } from '@/contexts/ModulesContext';
import { ActivityDomain } from '@/lib/activityDomainService';
import DomainCard from '../dashboard/DomainCard';

// Mapping des icônes par nom
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  BarChart3,
  Wrench,
  Shield,
  Factory,
  Car,
  Plane,
  Heart,
  GraduationCap,
  ShoppingBag,
  Zap,
  Leaf,
  Briefcase,
  Users,
  Target,
  TrendingUp,
  Globe,
  Building
};

interface DynamicDomainsListProps {
  moduleType: 'b2b' | 'b2c';
  onDomainSelect: (domain: ActivityDomain) => void;
  onCreateModule: () => void;
}

export default function DynamicDomainsList({ moduleType, onDomainSelect, onCreateModule }: DynamicDomainsListProps) {
  const { domains, loading, error, refreshDomains, createDomain } = useActivityDomains();
  const { modules } = useModules();
  const [showDomainForm, setShowDomainForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'from-blue-500 to-blue-600',
    icon_name: 'Building'
  });

  // Filtrer les domaines par type avec useMemo pour éviter les re-rendus
  const filteredDomains = useMemo(() => 
    domains.filter(domain => domain.type === moduleType), 
    [domains, moduleType]
  );
  
  // Calculer dynamiquement le nombre de modules par domaine
  const domainsWithModuleCount = useMemo(() => 
    filteredDomains.map(domain => ({
      ...domain,
      moduleCount: modules.filter(module => module.activity_domain_id === domain.id).length
    })),
    [filteredDomains, modules]
  );
  
  const totalModules = useMemo(() => 
    domainsWithModuleCount.reduce((total, domain) => total + domain.moduleCount, 0),
    [domainsWithModuleCount]
  );

  const handleCreateDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDomain({
        ...formData,
        type: moduleType
      });
      setShowDomainForm(false);
      setFormData({ name: '', description: '', color: 'from-blue-500 to-blue-600', icon_name: 'Building' });
    } catch (error) {
      console.error('Erreur lors de la création du domaine:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
          <span className="text-gray-400">Chargement des domaines d'activité...</span>
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
            onClick={refreshDomains}
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
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Domaines {moduleType === 'b2b' ? 'Métiers' : 'd\'Activité'} {moduleType.toUpperCase()}
          </h2>
          <p className="text-gray-400">
            {filteredDomains.length} domaine{filteredDomains.length > 1 ? 's' : ''} disponible{filteredDomains.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowDomainForm(true)}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Créer un domaine</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{filteredDomains.length}</div>
              <div className="text-sm text-gray-400">
                {moduleType === 'b2b' ? 'Domaines Métiers' : 'Domaines d\'Activité'}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{totalModules}</div>
              <div className="text-sm text-gray-400">Modules Total</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {filteredDomains.length > 0 ? Math.round(totalModules / filteredDomains.length) : 0}
              </div>
              <div className="text-sm text-gray-400">Moyenne par Domaine</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Domains Grid */}
      {domainsWithModuleCount.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domainsWithModuleCount.map((domain, index) => {
            const IconComponent = iconMap[domain.icon_name] || Building;
            
            return (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DomainCard
                  domain={{
                    id: domain.id,
                    name: domain.name,
                    description: domain.description,
                    icon: IconComponent,
                    moduleCount: domain.moduleCount,
                    totalLessons: domain.totalLessons || 0,
                    totalDuration: domain.totalDuration || 0,
                    studentsCount: domain.studentsCount || 0,
                    color: domain.color
                  }}
                  onClick={() => onDomainSelect(domain)}
                />
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Building className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Aucun domaine trouvé</h3>
          <p className="text-gray-400 mb-4">
            {moduleType === 'b2b' 
              ? 'Aucun domaine métier n\'est disponible pour le moment.'
              : 'Aucun domaine d\'activité n\'est disponible pour le moment.'
            }
          </p>
          <button
            onClick={() => setShowDomainForm(true)}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            Créer le premier domaine
          </button>
        </motion.div>
      )}

      {/* Bottom Stats */}
      {filteredDomains.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400">{filteredDomains.length}</div>
              <div className="text-sm text-gray-400">
                {moduleType === 'b2b' ? 'Domaines Métiers' : 'Domaines d\'Activité'}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{totalModules}</div>
              <div className="text-sm text-gray-400">Modules Disponibles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {filteredDomains.length > 0 ? Math.round(totalModules / filteredDomains.length) : 0}
              </div>
              <div className="text-sm text-gray-400">Moyenne par Domaine</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {moduleType === 'b2b' ? 'Professionnels' : 'Individuels'}
              </div>
              <div className="text-sm text-gray-400">Public Cible</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Formulaire de création de domaine */}
      {showDomainForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Créer un nouveau domaine</h3>
              <button
                onClick={() => setShowDomainForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateDomain}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom du domaine
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                    placeholder="Ex: Technologies de l'information"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                    placeholder="Description du domaine d'activité..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Couleur du thème
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="from-blue-500 to-blue-600">Bleu</option>
                    <option value="from-green-500 to-green-600">Vert</option>
                    <option value="from-purple-500 to-purple-600">Violet</option>
                    <option value="from-red-500 to-red-600">Rouge</option>
                    <option value="from-yellow-500 to-yellow-600">Jaune</option>
                    <option value="from-pink-500 to-pink-600">Rose</option>
                    <option value="from-indigo-500 to-indigo-600">Indigo</option>
                    <option value="from-cyan-500 to-cyan-600">Cyan</option>
                    <option value="from-emerald-500 to-emerald-600">Émeraude</option>
                    <option value="from-violet-500 to-violet-600">Violet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Icône
                  </label>
                  <select
                    value={formData.icon_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon_name: e.target.value }))}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="Building">Building</option>
                    <option value="Users">Users</option>
                    <option value="Target">Target</option>
                    <option value="TrendingUp">TrendingUp</option>
                    <option value="BarChart3">BarChart3</option>
                    <option value="Globe">Globe</option>
                    <option value="Briefcase">Briefcase</option>
                    <option value="Shield">Shield</option>
                    <option value="Factory">Factory</option>
                    <option value="Car">Car</option>
                    <option value="Plane">Plane</option>
                    <option value="Heart">Heart</option>
                    <option value="GraduationCap">GraduationCap</option>
                    <option value="ShoppingBag">ShoppingBag</option>
                    <option value="Wrench">Wrench</option>
                    <option value="Leaf">Leaf</option>
                    <option value="Zap">Zap</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDomainForm(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    Créer le domaine
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
