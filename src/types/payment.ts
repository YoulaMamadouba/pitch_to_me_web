export interface StripeCheckoutRequest {
  amount: number;
  currency: 'USD' | 'EUR' | 'XOF';
  plan: 'standard' | 'premium';
  userId: string;
}

export interface StripeCheckoutResponse {
  sessionId: string;
  url: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  amount: number;
  currency: 'USD' | 'EUR' | 'XOF';
  status: 'pending' | 'completed' | 'failed';
  plan: 'standard' | 'premium';
  created_at: string;
}

export interface PaymentAmounts {
  USD: number;
  EUR: number;
  XOF: number;
}

export const PAYMENT_AMOUNTS: PaymentAmounts = {
  USD: 29900, // $299.00 en centimes
  EUR: 27900, // €279.00 en centimes
  XOF: 17500000, // 175,000 FCFA en centimes
};

export const getAmountInCents = (currency: keyof PaymentAmounts, customAmount?: number): number => {
  if (customAmount !== undefined) {
    // Si c'est déjà en centimes, retourner tel quel
    if (customAmount > 1000) {
      return customAmount;
    }
    // Sinon convertir en centimes
    return Math.round(customAmount * 100);
  }
  return PAYMENT_AMOUNTS[currency];
};

export const formatAmount = (amount: number, currency: keyof PaymentAmounts): string => {
  const symbols = {
    USD: '$',
    EUR: '€',
    XOF: 'FCFA',
  };
  
  const displayAmount = amount / 100; // Convertir de centimes
  
  if (currency === 'XOF') {
    return `${displayAmount.toLocaleString()} ${symbols[currency]}`;
  }
  
  return `${symbols[currency]}${displayAmount.toFixed(2)}`;
};
