'use client';

import { motion } from 'framer-motion';
import { Building, Users, Target, TrendingUp, Briefcase, Globe, Zap, Award } from 'lucide-react';

interface Domain {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  moduleCount: number;
  color: string;
}

interface DomainsListProps {
  moduleType: 'b2b' | 'b2c';
  onDomainSelect: (domain: Domain) => void;
  onCreateModule: () => void;
}

const b2bDomains: Domain[] = [
  {
    id: 'commercial',
    name: 'Commercial',
    description: 'Techniques de vente et négociation',
    icon: Target,
    moduleCount: 8,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Stratégies marketing et communication',
    icon: TrendingUp,
    moduleCount: 6,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'rh',
    name: 'Ressources Humaines',
    description: 'Gestion des équipes et recrutement',
    icon: Users,
    moduleCount: 5,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Présentations financières et reporting',
    icon: TrendingUp,
    moduleCount: 4,
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 'management',
    name: 'Management',
    description: 'Leadership et gestion de projet',
    icon: Award,
    moduleCount: 7,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'international',
    name: 'International',
    description: 'Business international et export',
    icon: Globe,
    moduleCount: 3,
    color: 'from-indigo-500 to-indigo-600'
  }
];

const b2cDomains: Domain[] = [
  {
    id: 'personal-development',
    name: 'Développement Personnel',
    description: 'Confiance en soi et communication',
    icon: Zap,
    moduleCount: 10,
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'career',
    name: 'Carrière',
    description: 'Entretiens et évolution professionnelle',
    icon: Briefcase,
    moduleCount: 6,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'public-speaking',
    name: 'Prise de Parole',
    description: 'Présentations et discours publics',
    icon: Users,
    moduleCount: 8,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'networking',
    name: 'Networking',
    description: 'Réseautage et relations professionnelles',
    icon: Globe,
    moduleCount: 4,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneuriat',
    description: 'Création d\'entreprise et pitch',
    icon: Building,
    moduleCount: 5,
    color: 'from-red-500 to-red-600'
  }
];

export default function DomainsList({ moduleType, onDomainSelect, onCreateModule }: DomainsListProps) {
  const domains = moduleType === 'b2b' ? b2bDomains : b2cDomains;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Domaines {moduleType.toUpperCase()}
          </h2>
          <p className="text-gray-400">
            Sélectionnez un domaine pour voir les modules disponibles
          </p>
        </div>
        <button
          onClick={onCreateModule}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Building className="w-5 h-5" />
          <span>Créer un module {moduleType.toUpperCase()}</span>
        </button>
      </div>

      {/* Domains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain, index) => (
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-400/30 transition-all cursor-pointer group"
            onClick={() => onDomainSelect(domain)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${domain.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <domain.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-400">{domain.moduleCount}</span>
                <div className="text-xs text-gray-500">modules</div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
              {domain.name}
            </h3>
            
            <p className="text-gray-400 text-sm mb-4">
              {domain.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-xs text-yellow-400 font-medium">Cliquer pour voir</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-700 group-hover:bg-yellow-400 transition-colors flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-400 group-hover:bg-black rounded-full transition-colors"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-400">{domains.length}</div>
            <div className="text-sm text-gray-400">Domaines</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400">
              {domains.reduce((total, domain) => total + domain.moduleCount, 0)}
            </div>
            <div className="text-sm text-gray-400">Modules total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">98%</div>
            <div className="text-sm text-gray-400">Taux de réussite</div>
          </div>
        </div>
      </div>
    </div>
  );
}
