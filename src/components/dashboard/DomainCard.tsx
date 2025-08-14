'use client';

import { motion } from 'framer-motion';
import { Plus, Folder, Users, Clock } from 'lucide-react';

export interface Domain {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  moduleCount: number;
  color: string;
  totalLessons?: number;
  totalDuration?: number;
  studentsCount?: number;
}

interface DomainCardProps {
  domain: Domain;
  onClick: (domain: Domain) => void;
}

export default function DomainCard({ domain, onClick }: DomainCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={() => onClick(domain)}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all cursor-pointer group overflow-hidden"
    >
      <div className="p-6">
        {/* Header avec icône et stats */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${domain.color} flex items-center justify-center`}>
            <domain.icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-400">{domain.moduleCount}</div>
            <div className="text-xs text-gray-400">modules</div>
          </div>
        </div>
        
        {/* Titre et description */}
        <h3 className="text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors mb-2">
          {domain.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {domain.description}
        </p>
        
        {/* Stats supplémentaires */}
        <div className="flex items-center justify-between mb-4">
          {domain.totalLessons && (
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Folder className="w-3 h-3" />
              <span>{domain.totalLessons} leçons</span>
            </div>
          )}
          {domain.totalDuration && (
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{domain.totalDuration}h</span>
            </div>
          )}
          {domain.studentsCount && (
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Users className="w-3 h-3" />
              <span>{domain.studentsCount}</span>
            </div>
          )}
        </div>
        
        {/* Footer avec action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span>Voir les modules</span>
          </div>
          <div className="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center group-hover:bg-yellow-500 transition-colors">
            <Plus className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

