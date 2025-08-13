'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useSimpleTranslations } from '@/hooks/useSimpleTranslations';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: 'fr' | 'en') => void;
  t: (key: string, params?: Record<string, any>) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { language, changeLanguage, isLoaded } = useLanguage();
  const { t, isLoading } = useSimpleTranslations(language as any, isLoaded);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
}
