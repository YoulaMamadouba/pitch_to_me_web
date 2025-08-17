'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthService, CreateUserData } from '@/lib/authService';

export type SignupStep = 'form' | 'otp' | 'payment' | 'onboarding' | 'dashboard';

interface SignupContextType {
  currentStep: SignupStep;
  formData: any;
  otpCode: string;
  isOtpVerified: boolean;
  isPaymentCompleted: boolean;
  isOnboardingCompleted: boolean;
  setCurrentStep: (step: SignupStep) => void;
  setFormData: (data: any) => void;
  setOtpCode: (code: string) => void;
  setOtpVerified: (verified: boolean) => void;
  setPaymentCompleted: (completed: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  nextStep: () => void;
  resetSignup: () => void;
  createUser: (formData: any) => Promise<{ error: any }>;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<SignupStep>('form');
  const [formData, setFormData] = useState({});
  const [otpCode, setOtpCode] = useState('');
  const [isOtpVerified, setOtpVerified] = useState(false);
  const [isPaymentCompleted, setPaymentCompleted] = useState(false);
  const [isOnboardingCompleted, setOnboardingCompleted] = useState(false);

  const nextStep = () => {
    const steps: SignupStep[] = ['form', 'otp', 'payment', 'onboarding', 'dashboard'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const resetSignup = () => {
    setCurrentStep('form');
    setFormData({});
    setOtpCode('');
    setOtpVerified(false);
    setPaymentCompleted(false);
    setOnboardingCompleted(false);
  };

  const createUser = async (formData: any) => {
    try {
      console.log('🔧 Création d\'utilisateur via API:', formData);

      // Appeler l'API route pour créer l'utilisateur
      const response = await fetch('/api/create-individual-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          country: formData.country,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Erreur API création utilisateur:', result.error);
        return { error: result.error };
      }

      console.log('✅ Utilisateur créé avec succès via API:', result.user);
      return { error: null, user: result.user };
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'utilisateur:', error);
      return { error: 'Erreur de connexion au serveur' };
    }
  };

  const value: SignupContextType = {
    currentStep,
    formData,
    otpCode,
    isOtpVerified,
    isPaymentCompleted,
    isOnboardingCompleted,
    setCurrentStep,
    setFormData,
    setOtpCode,
    setOtpVerified,
    setPaymentCompleted,
    setOnboardingCompleted,
    nextStep,
    resetSignup,
    createUser,
  };

  return (
    <SignupContext.Provider value={value}>
      {children}
    </SignupContext.Provider>
  );
}

export function useSignup() {
  const context = useContext(SignupContext);
  if (context === undefined) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
}
