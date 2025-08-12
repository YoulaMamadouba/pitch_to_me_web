'use client';

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
  Zap
} from 'lucide-react';

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

// Domaines métiers pour B2B
const b2bDomains: Domain[] = [
  {
    id: 'banque',
    name: 'Banque & Finance',
    description: 'Modules spécialisés pour les professionnels du secteur bancaire et financier',
    icon: BarChart3,
    moduleCount: 12,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'minier',
    name: 'Mines & Énergie',
    description: 'Formation pour les secteurs miniers, pétroliers et énergétiques',
    icon: Wrench,
    moduleCount: 8,
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'gouvernement',
    name: 'Gouvernement & Public',
    description: 'Modules adaptés aux fonctionnaires et employés du secteur public',
    icon: Shield,
    moduleCount: 15,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'industrie',
    name: 'Industrie & Manufacture',
    description: 'Formation pour les secteurs industriels et manufacturiers',
    icon: Factory,
    moduleCount: 10,
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: 'automobile',
    name: 'Automobile & Transport',
    description: 'Modules pour les professionnels de l\'automobile et du transport',
    icon: Car,
    moduleCount: 7,
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'aerospatial',
    name: 'Aérospatial & Aviation',
    description: 'Formation spécialisée pour l\'industrie aérospatiale',
    icon: Plane,
    moduleCount: 6,
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'sante',
    name: 'Santé & Médical',
    description: 'Modules pour les professionnels de la santé et du médical',
    icon: Heart,
    moduleCount: 14,
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'education',
    name: 'Éducation & Formation',
    description: 'Formation pour les acteurs du secteur éducatif',
    icon: GraduationCap,
    moduleCount: 9,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'retail',
    name: 'Commerce & Retail',
    description: 'Modules pour les professionnels du commerce et de la distribution',
    icon: ShoppingBag,
    moduleCount: 11,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'technologie',
    name: 'Technologie & IT',
    description: 'Formation pour les professionnels de la technologie',
    icon: Zap,
    moduleCount: 18,
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'environnement',
    name: 'Environnement & Développement Durable',
    description: 'Modules pour les secteurs environnementaux et durables',
    icon: Leaf,
    moduleCount: 5,
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 'consulting',
    name: 'Consulting & Services',
    description: 'Formation pour les consultants et prestataires de services',
    icon: Briefcase,
    moduleCount: 13,
    color: 'from-violet-500 to-violet-600'
  }
];

// Domaines d'activités pour B2C (inchangés)
const b2cDomains: Domain[] = [
  {
    id: 'personal-development',
    name: 'Développement Personnel',
    description: 'Modules pour améliorer la confiance en soi et les compétences personnelles',
    icon: Users,
    moduleCount: 8,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'career',
    name: 'Carrière & Emploi',
    description: 'Formation pour réussir sa carrière professionnelle',
    icon: Target,
    moduleCount: 12,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'public-speaking',
    name: 'Prise de Parole',
    description: 'Modules pour maîtriser l\'art de la communication orale',
    icon: TrendingUp,
    moduleCount: 6,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'networking',
    name: 'Networking & Relations',
    description: 'Formation pour développer son réseau professionnel',
    icon: Globe,
    moduleCount: 4,
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneuriat',
    description: 'Modules pour créer et développer son entreprise',
    icon: Building,
    moduleCount: 10,
    color: 'from-red-500 to-red-600'
  }
];

export default function DomainsList({ moduleType, onDomainSelect, onCreateModule }: DomainsListProps) {
  const domains = moduleType === 'b2b' ? b2bDomains : b2cDomains;
  const totalModules = domains.reduce((total, domain) => total + domain.moduleCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Domaines {moduleType === 'b2b' ? 'Métiers' : 'd\'Activité'} {moduleType.toUpperCase()}
          </h2>
          <p className="text-gray-400">
            {moduleType === 'b2b' 
              ? 'Sélectionnez un domaine métier pour voir les modules disponibles'
              : 'Choisissez un domaine d\'activité pour vos formations personnelles'
            }
          </p>
        </div>
        <button
          onClick={onCreateModule}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Créer un module {moduleType.toUpperCase()}</span>
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
              <div className="text-2xl font-bold text-white">{domains.length}</div>
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
                {Math.round(totalModules / domains.length)}
              </div>
              <div className="text-sm text-gray-400">Moyenne par Domaine</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Domains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain, index) => (
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => onDomainSelect(domain)}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-yellow-400/30 transition-all cursor-pointer group overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${domain.color} flex items-center justify-center`}>
                  <domain.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-400">{domain.moduleCount}</div>
                  <div className="text-xs text-gray-400">modules</div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors mb-2">
                {domain.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {domain.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Cliquer pour voir</span>
                </div>
                <div className="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center group-hover:bg-yellow-500 transition-colors">
                  <Plus className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-400">{domains.length}</div>
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
              {Math.round(totalModules / domains.length)}
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
    </div>
  );
}
