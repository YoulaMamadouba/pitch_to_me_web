'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Module, 
  CreateModuleData,
  getAllModules,
  getModulesByType,
  getModulesByActivityDomain,
  createModule,
  updateModule,
  deleteModule,
  getModuleStats
} from '@/lib/moduleService';

interface ModulesContextType {
  modules: Module[];
  loading: boolean;
  error: string | null;
  refreshModules: () => Promise<void>;
  createModule: (moduleData: CreateModuleData) => Promise<Module>;
  updateModule: (id: string, updates: Partial<CreateModuleData>) => Promise<Module>;
  deleteModule: (id: string) => Promise<void>;
  getModulesByType: (type: 'b2b' | 'b2c') => Promise<Module[]>;
  getModulesByDomain: (domainId: string) => Promise<Module[]>;
  getModuleStats: (moduleId: string) => Promise<{
    lessonCount: number;
    studentsCount: number;
    averageRating: number;
  }>;
}

const ModulesContext = createContext<ModulesContextType | undefined>(undefined);

export function ModulesProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllModules();
      setModules(data);
    } catch (err) {
      console.error('Erreur lors du chargement des modules:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des modules');
    } finally {
      setLoading(false);
    }
  };

  const refreshModules = async () => {
    await fetchModules();
  };

  const createModuleHandler = async (moduleData: CreateModuleData): Promise<Module> => {
    try {
      console.log('=== DÉBUT createModuleHandler ===');
      console.log('Données reçues dans le contexte:', moduleData);
      
      const newModule = await createModule(moduleData);
      
      console.log('Module créé avec succès:', newModule);
      setModules(prev => [...prev, newModule]);
      
      console.log('=== FIN createModuleHandler ===');
      return newModule;
    } catch (err) {
      console.error('=== ERREUR dans createModuleHandler ===');
      console.error('Erreur complète:', err);
      console.error('Type d\'erreur:', typeof err);
      console.error('Message d\'erreur:', err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Stack trace:', err instanceof Error ? err.stack : 'Pas de stack trace');
      throw err;
    }
  };

  const updateModuleHandler = async (id: string, updates: Partial<CreateModuleData>): Promise<Module> => {
    try {
      const updatedModule = await updateModule(id, updates);
    setModules(prev => prev.map(module => 
        module.id === id ? updatedModule : module
      ));
      return updatedModule;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du module:', err);
      throw err;
    }
  };

  const deleteModuleHandler = async (id: string): Promise<void> => {
    try {
      await deleteModule(id);
      setModules(prev => prev.filter(module => module.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du module:', err);
      throw err;
    }
  };

  const getModulesByTypeHandler = async (type: 'b2b' | 'b2c'): Promise<Module[]> => {
    try {
      return await getModulesByType(type);
    } catch (err) {
      console.error('Erreur lors de la récupération des modules par type:', err);
      throw err;
    }
  };

  const getModulesByDomainHandler = async (domainId: string): Promise<Module[]> => {
    try {
      return await getModulesByActivityDomain(domainId);
    } catch (err) {
      console.error('Erreur lors de la récupération des modules par domaine:', err);
      throw err;
    }
  };

  const getModuleStatsHandler = async (moduleId: string) => {
    try {
      return await getModuleStats(moduleId);
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques du module:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <ModulesContext.Provider value={{
      modules,
      loading,
      error,
      refreshModules,
      createModule: createModuleHandler,
      updateModule: updateModuleHandler,
      deleteModule: deleteModuleHandler,
      getModulesByType: getModulesByTypeHandler,
      getModulesByDomain: getModulesByDomainHandler,
      getModuleStats: getModuleStatsHandler
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
