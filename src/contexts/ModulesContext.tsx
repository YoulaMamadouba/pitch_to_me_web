'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Module } from '@/components/dashboard/ModuleCard';

interface ModulesContextType {
  modules: Module[];
  addModule: (module: Module) => void;
  updateModule: (moduleId: string, updates: Partial<Module>) => void;
  deleteModule: (moduleId: string) => void;
  getModulesByDomain: (domain: string) => Module[];
  getModulesByType: (type: 'b2b' | 'b2c') => Module[];
}

const ModulesContext = createContext<ModulesContextType | undefined>(undefined);

// Données de démonstration
const initialModules: Module[] = [
  {
    id: '1',
    title: 'Techniques de vente avancées',
    description: 'Maîtrisez les techniques de vente les plus efficaces pour maximiser vos résultats commerciaux.',
    videoUrl: 'https://www.youtube.com/watch?v=example1',
    theme: 'Négociation commerciale',
    domain: 'Banque & Finance',
    offerType: 'commercial',
    activityDomain: 'commercial',
    difficulty: 'advanced',
    duration: 45,
    tags: ['vente', 'négociation', 'commercial', 'techniques'],
    rating: 4.8,
    studentsCount: 156,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Présentation de projet efficace',
    description: 'Apprenez à présenter vos projets de manière claire et convaincante.',
    videoUrl: 'https://www.youtube.com/watch?v=example2',
    theme: 'Présentation',
    domain: 'Gouvernement & Public',
    offerType: 'management',
    activityDomain: 'management',
    difficulty: 'intermediate',
    duration: 30,
    tags: ['présentation', 'projet', 'management', 'communication'],
    rating: 4.6,
    studentsCount: 89,
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    title: 'Confiance en soi pour les entretiens',
    description: 'Développez votre confiance en soi pour réussir vos entretiens professionnels.',
    videoUrl: 'https://www.youtube.com/watch?v=example3',
    theme: 'Développement personnel',
    domain: 'Développement Personnel',
    offerType: 'rh',
    activityDomain: 'rh',
    difficulty: 'easy',
    duration: 25,
    tags: ['confiance', 'entretien', 'développement', 'personnel'],
    rating: 4.9,
    studentsCount: 234,
    createdAt: '2024-01-10'
  }
];

export function ModulesProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<Module[]>(initialModules);

  const addModule = (module: Module) => {
    setModules(prev => [...prev, module]);
  };

  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, ...updates } : module
    ));
  };

  const deleteModule = (moduleId: string) => {
    setModules(prev => prev.filter(module => module.id !== moduleId));
  };

  const getModulesByDomain = (domain: string) => {
    return modules.filter(module => module.domain === domain);
  };

  const getModulesByType = (type: 'b2b' | 'b2c') => {
    // Logique pour filtrer par type B2B ou B2C basée sur les domaines
    const b2bDomains = [
      'Banque & Finance', 'Mines & Énergie', 'Gouvernement & Public', 
      'Industrie & Manufacture', 'Automobile & Transport', 'Aérospatial & Aviation',
      'Santé & Médical', 'Éducation & Formation', 'Commerce & Retail',
      'Technologie & IT', 'Environnement & Développement Durable', 'Consulting & Services'
    ];
    const b2cDomains = ['Développement Personnel', 'Carrière & Emploi', 'Prise de Parole', 'Networking & Relations', 'Entrepreneuriat'];
    
    const targetDomains = type === 'b2b' ? b2bDomains : b2cDomains;
    return modules.filter(module => targetDomains.includes(module.domain));
  };

  return (
    <ModulesContext.Provider value={{
      modules,
      addModule,
      updateModule,
      deleteModule,
      getModulesByDomain,
      getModulesByType
    }}>
      {children}
    </ModulesContext.Provider>
  );
}

export function useModules() {
  const context = useContext(ModulesContext);
  if (context === undefined) {
    throw new Error('useModules must be used within a ModulesProvider');
  }
  return context;
}
