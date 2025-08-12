'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Search, Filter, Grid, List } from 'lucide-react';
import ModuleCard, { Module } from './ModuleCard';

interface Domain {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  moduleCount: number;
  color: string;
}

interface ModulesListProps {
  domain: Domain;
  modules: Module[];
  onBack: () => void;
  onCreateModule: () => void;
  onEditModule: (module: Module) => void;
  onDeleteModule: (moduleId: string) => void;
  onViewModule: (module: Module) => void;
}

export default function ModulesList({ 
  domain, 
  modules, 
  onBack, 
  onCreateModule, 
  onEditModule, 
  onDeleteModule, 
  onViewModule 
}: ModulesListProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${domain.color} flex items-center justify-center`}>
              <domain.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{domain.name}</h2>
              <p className="text-gray-400">{domain.description}</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={onCreateModule}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Créer un module</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-yellow-400">{modules.length}</div>
            <div className="text-sm text-gray-400">Modules</div>
          </div>
          <div>
            <div className="text-xl font-bold text-cyan-400">
              {modules.reduce((total, module) => total + module.studentsCount, 0)}
            </div>
            <div className="text-sm text-gray-400">Étudiants</div>
          </div>
          <div>
            <div className="text-xl font-bold text-green-400">
              {(modules.reduce((total, module) => total + module.rating, 0) / modules.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-400">Note moyenne</div>
          </div>
          <div>
            <div className="text-xl font-bold text-purple-400">
              {modules.reduce((total, module) => total + module.duration, 0)}
            </div>
            <div className="text-sm text-gray-400">Minutes total</div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      {modules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              onEdit={onEditModule}
              onDelete={onDeleteModule}
              onView={onViewModule}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Aucun module trouvé</h3>
          <p className="text-gray-400 mb-6">
            Commencez par créer votre premier module pour ce domaine
          </p>
          <button
            onClick={onCreateModule}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Créer le premier module</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
