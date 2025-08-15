'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingPage from '@/app/onboarding/page';

interface OnboardingWrapperProps {
  onComplete?: () => void;
}

export default function OnboardingWrapper({ onComplete }: OnboardingWrapperProps) {
  const router = useRouter();

  useEffect(() => {
    // Si onComplete est fourni, l'appeler après un délai pour simuler la complétion
    if (onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000); // 3 secondes de délai

      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return <OnboardingPage />;
}
