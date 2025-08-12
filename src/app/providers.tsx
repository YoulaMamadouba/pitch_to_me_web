'use client';

import { useEffect, useState } from 'react';
import { ModulesProvider } from '@/contexts/ModulesContext';

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
    <ModulesProvider>
      {children}
    </ModulesProvider>
  );
}
