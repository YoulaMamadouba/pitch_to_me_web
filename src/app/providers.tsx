'use client';

import { useEffect, useState } from 'react';
import { ModulesProvider } from '@/contexts/ModulesContext';
import { CompaniesProvider } from '@/contexts/CompaniesContext';
import { StudentsProvider } from '@/contexts/StudentsContext';
import { ActivityDomainsProvider } from '@/contexts/ActivityDomainsContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SignupProvider } from '@/contexts/SignupContext';
import PitchLoader from '@/components/ui/PitchLoader';
import PasswordChangeGuard from '@/components/PasswordChangeGuard';
import { Mic } from 'lucide-react';
import { LessonsProvider } from '@/contexts/LessonsContext';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [minDelayDone, setMinDelayDone] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure the loader stays on screen long enough to enjoy the animations
  useEffect(() => {
    const t = setTimeout(() => setMinDelayDone(true), 300); // réduit pour accélérer l'accès
    return () => clearTimeout(t);
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <ModulesProvider>
          <ActivityDomainsProvider>
            <LessonsProvider>
              <CompaniesProvider>
                <StudentsProvider>
                <SignupProvider>
                  {/* Global loader uses the same icon and brand color as the header */}
                  <PitchLoader
                    loading={!mounted || !minDelayDone}
                    icon={<Mic className="w-12 h-12" />}
                    siteName="Pitch to Me"
                    brandColorClass="text-yellow-400"
                  />
                  <PasswordChangeGuard>
                    {children}
                  </PasswordChangeGuard>
                </SignupProvider>
              </StudentsProvider>
            </CompaniesProvider>
            </LessonsProvider>
          </ActivityDomainsProvider>
        </ModulesProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
