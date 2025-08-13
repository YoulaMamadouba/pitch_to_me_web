'use client';

import { useEffect, useState } from 'react';
import { ModulesProvider } from '@/contexts/ModulesContext';
import { CompaniesProvider } from '@/contexts/CompaniesContext';
import { StudentsProvider } from '@/contexts/StudentsContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import PitchLoader from '@/components/ui/PitchLoader';
import { Mic } from 'lucide-react';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [minDelayDone, setMinDelayDone] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure the loader stays on screen long enough to enjoy the animations
  useEffect(() => {
    const t = setTimeout(() => setMinDelayDone(true), 1600); // adjust duration to taste
    return () => clearTimeout(t);
  }, []);

  return (
    <LanguageProvider>
      <ModulesProvider>
        <CompaniesProvider>
          <StudentsProvider>
            {/* Global loader uses the same icon and brand color as the header */}
            <PitchLoader
              loading={!mounted || !minDelayDone}
              icon={<Mic className="w-12 h-12" />}
              siteName="Pitch to Me"
              brandColorClass="text-yellow-400"
            />
            {children}
          </StudentsProvider>
        </CompaniesProvider>
      </ModulesProvider>
    </LanguageProvider>
  );
}
