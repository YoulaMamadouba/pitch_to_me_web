'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Company } from '@/components/dashboard-coach/CompanyCard';

interface CompaniesContextType {
  companies: Company[];
  addCompany: (company: Company) => void;
  updateCompany: (companyId: string, updates: Partial<Company>) => void;
  deleteCompany: (companyId: string) => void;
  getCompanyById: (id: string) => Company | undefined;
}

const CompaniesContext = createContext<CompaniesContextType | undefined>(undefined);

// Données de démonstration
const initialCompanies: Company[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    logo: '',
    industry: 'Technologies de l\'information',
    employeeCount: 150,
    hrName: 'Marie Dupont',
    hrEmail: 'marie.dupont@techcorp.com',
    hrPhone: '+33 1 23 45 67 89',
    modules: ['Techniques de vente avancées', 'Présentation de projet efficace', 'Management d\'équipe'],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Innovation Marketing',
    logo: '',
    industry: 'Marketing et communication',
    employeeCount: 85,
    hrName: 'Sophie Martin',
    hrEmail: 'sophie.martin@innovation-marketing.com',
    hrPhone: '+33 1 98 76 54 32',
    modules: ['Stratégies marketing', 'Communication digitale', 'Présentation de projet efficace'],
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Global Finance Group',
    logo: '',
    industry: 'Services financiers',
    employeeCount: 320,
    hrName: 'Pierre Dubois',
    hrEmail: 'pierre.dubois@globalfinance.com',
    hrPhone: '+33 1 45 67 89 12',
    modules: ['Présentation financière', 'Management d\'équipe', 'Négociation commerciale'],
    createdAt: '2024-01-10'
  }
];

export function CompaniesProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);

  const addCompany = (company: Company) => {
    setCompanies(prev => [...prev, company]);
  };

  const updateCompany = (companyId: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(company => 
      company.id === companyId ? { ...company, ...updates } : company
    ));
  };

  const deleteCompany = (companyId: string) => {
    setCompanies(prev => prev.filter(company => company.id !== companyId));
  };

  const getCompanyById = (id: string) => {
    return companies.find(company => company.id === id);
  };

  return (
    <CompaniesContext.Provider value={{
      companies,
      addCompany,
      updateCompany,
      deleteCompany,
      getCompanyById
    }}>
      {children}
    </CompaniesContext.Provider>
  );
}

export function useCompanies() {
  const context = useContext(CompaniesContext);
  if (context === undefined) {
    throw new Error('useCompanies must be used within a CompaniesProvider');
  }
  return context;
}
