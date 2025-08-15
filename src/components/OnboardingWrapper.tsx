'use client';

import OnboardingPage from '@/app/onboarding/page';

interface OnboardingWrapperProps {
  onComplete?: () => void;
}

export default function OnboardingWrapper({ onComplete }: OnboardingWrapperProps) {
  return <OnboardingPage onComplete={onComplete} />;
}
