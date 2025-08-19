'use client';

import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  Bell, 
  Settings as SettingsIcon,
  ChevronRight
} from 'lucide-react';

interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  {
    id: 'profile',
    label: 'Profil',
    icon: User,
    description: 'Gérer vos informations personnelles'
  },
  {
    id: 'security',
    label: 'Sécurité',
    icon: Lock,
    description: 'Mot de passe et sécurité du compte'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Préférences de notifications'
  },
  {
    id: 'preferences',
    label: 'Préférences',
    icon: SettingsIcon,
    description: 'Paramètres généraux de l\'application'
  }
];

export const SettingsTabs = ({ activeTab, onTabChange }: SettingsTabsProps) => {
  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <h2 className="text-lg font-bold text-white mb-4">Paramètres</h2>
      
      <div className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full p-4 rounded-lg transition-all duration-200 text-left ${
                isActive 
                  ? 'bg-yellow-500/10 border border-yellow-500/20' 
                  : 'bg-gray-700/50 hover:bg-gray-700 border border-transparent'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isActive ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-gray-300'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${
                      isActive ? 'text-yellow-400' : 'text-white'
                    }`}>
                      {tab.label}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {tab.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-yellow-400' : 'text-gray-400'
                }`} />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

