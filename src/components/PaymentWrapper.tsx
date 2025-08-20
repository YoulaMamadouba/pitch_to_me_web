'use client';

import PaymentPage from '@/app/payment/page';

interface PaymentWrapperProps {
  onComplete?: () => void;
}

export default function PaymentWrapper({ onComplete }: PaymentWrapperProps) {
  return <PaymentPage />;
}
