'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ActivityDomain, 
  CreateActivityDomainData,
  getAllActivityDomains,
  getActivityDomainsByType,
  createActivityDomain,
  updateActivityDomain,
  deleteActivityDomain,
  getActivityDomainStats
} from '@/lib/activityDomainService';

interface ActivityDomainsContextType {
  domains: ActivityDomain[];
  loading: boolean;
  error: string | null;
  refreshDomains: () => Promise<void>;
  createDomain: (domainData: CreateActivityDomainData) => Promise<ActivityDomain>;
  updateDomain: (id: string, updates: Partial<CreateActivityDomainData>) => Promise<ActivityDomain>;
  deleteDomain: (id: string) => Promise<void>;
  getDomainsByType: (type: 'b2b' | 'b2c') => ActivityDomain[];
  getDomainStats: (domainId: string) => Promise<{
    moduleCount: number;
    totalLessons: number;
    totalDuration: number;
    studentsCount: number;
  }>;
}

const ActivityDomainsContext = createContext<ActivityDomainsContextType | undefined>(undefined);

export function ActivityDomainsProvider({ children }: { children: ReactNode }) {
  const [domains, setDomains] = useState<ActivityDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllActivityDomains();
      setDomains(data);
    } catch (err) {
      console.error('Erreur lors du chargement des domaines d\'activité:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des domaines');
    } finally {
      setLoading(false);
    }
  };

  const refreshDomains = async () => {
    await fetchDomains();
  };

  const createDomain = async (domainData: CreateActivityDomainData): Promise<ActivityDomain> => {
    try {
      const newDomain = await createActivityDomain(domainData);
      setDomains(prev => [...prev, newDomain]);
      return newDomain;
    } catch (err) {
      console.error('Erreur lors de la création du domaine:', err);
      throw err;
    }
  };

  const updateDomain = async (id: string, updates: Partial<CreateActivityDomainData>): Promise<ActivityDomain> => {
    try {
      const updatedDomain = await updateActivityDomain(id, updates);
      setDomains(prev => prev.map(domain => 
        domain.id === id ? updatedDomain : domain
      ));
      return updatedDomain;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du domaine:', err);
      throw err;
    }
  };

  const deleteDomain = async (id: string): Promise<void> => {
    try {
      await deleteActivityDomain(id);
      setDomains(prev => prev.filter(domain => domain.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du domaine:', err);
      throw err;
    }
  };

  const getDomainsByType = (type: 'b2b' | 'b2c'): ActivityDomain[] => {
    return domains.filter(domain => domain.type === type);
  };

  const getDomainStats = async (domainId: string) => {
    try {
      return await getActivityDomainStats(domainId);
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques du domaine:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  return (
    <ActivityDomainsContext.Provider value={{
      domains,
      loading,
      error,
      refreshDomains,
      createDomain,
      updateDomain,
      deleteDomain,
      getDomainsByType,
      getDomainStats
    }}>
      {children}
    </ActivityDomainsContext.Provider>
  );
}

export function useActivityDomains() {
  const context = useContext(ActivityDomainsContext);
  if (context === undefined) {
    throw new Error('useActivityDomains must be used within an ActivityDomainsProvider');
  }
  return context;
}
