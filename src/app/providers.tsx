'use client';

import { useEffect, useState } from 'react';
import { ModulesProvider } from '@/contexts/ModulesContext';
import { CompaniesProvider } from '@/contexts/CompaniesContext';
import { StudentsProvider } from '@/contexts/StudentsContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until we're on the client to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <LanguageProvider>
      <ModulesProvider>
        <CompaniesProvider>
          <StudentsProvider>
            {children}
          </StudentsProvider>
        </CompaniesProvider>
      </ModulesProvider>
    </LanguageProvider>
  );
}
