'use client';

import { useEffect } from 'react';
import PaymentPage from '@/app/payment/page';

interface PaymentWrapperProps {
  onComplete?: () => void;
}

export default function PaymentWrapper({ onComplete }: PaymentWrapperProps) {
  useEffect(() => {
    // Si onComplete est fourni, l'appeler après un délai pour simuler la complétion
    if (onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000); // 3 secondes de délai

      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return <PaymentPage />;
}
