'use client';

import { SignupProvider } from '@/contexts/SignupContext';
import SignupFlow from '@/components/SignupFlow';

export default function SignupPage() {
  return (
    <SignupProvider>
      <SignupFlow />
    </SignupProvider>
  );
}

