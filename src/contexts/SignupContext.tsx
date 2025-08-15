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
      // Préparer les données utilisateur
      const userData: CreateUserData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        country: formData.country,
        role: 'individual' // Par défaut, les nouveaux inscrits sont des 'individual'
      };

      // Créer l'utilisateur via le service (sans connexion automatique)
      const { user, error } = await AuthService.createUserWithoutSignIn(userData);

      if (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      return { error };
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
