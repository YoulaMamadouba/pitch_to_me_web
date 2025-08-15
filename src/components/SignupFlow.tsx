'use client';

import { useEffect } from 'react';
import { useSignup } from '@/contexts/SignupContext';
import SignupForm from './SignupForm';
import EnhancedOtpModal from './ui/EnhancedOtpModal';
import PaymentWrapper from './PaymentWrapper';
import OnboardingWrapper from './OnboardingWrapper';
import SignupProgressIndicator from './SignupProgressIndicator';
import SignupTestPanel from './SignupTestPanel';
import Notification from './ui/Notification';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupFlow() {
  const { currentStep, formData, setFormData, setOtpVerified, setPaymentCompleted, setOnboardingCompleted, isOnboardingCompleted, setCurrentStep, nextStep, createUser } = useSignup();
  const router = useRouter();
  const { signIn, user } = useAuth();
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    isVisible: boolean;
  }>({
    type: 'info',
    message: '',
    isVisible: false
  });

  // Redirection automatique vers le dashboard si l'inscription est complète
  useEffect(() => {
    if (currentStep === 'dashboard') {
      // Seulement rediriger si l'onboarding est complété
      if (isOnboardingCompleted) {
        router.push('/dashboard');
      }
    }
  }, [currentStep, router, isOnboardingCompleted]);

  // Empêcher l'accès direct au dashboard si l'utilisateur n'a pas complété le flux
  useEffect(() => {
    // Si l'utilisateur est connecté mais qu'on n'est pas à l'étape dashboard
    // et que l'onboarding n'est pas complété, rediriger vers le formulaire
    if (user && currentStep !== 'dashboard' && !isOnboardingCompleted) {
      setCurrentStep('form');
    }
  }, [user, currentStep, isOnboardingCompleted, setCurrentStep]);

  const handleFormSubmit = async (data: any) => {
    setFormData(data);
    
    // Créer l'utilisateur dans la base de données
    const { error } = await createUser(data);
    
    if (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      setNotification({
        type: 'error',
        message: 'Erreur lors de la création du compte. Veuillez réessayer.',
        isVisible: true
      });
      return;
    }
    
    // Afficher une notification de succès
    setNotification({
      type: 'success',
      message: 'Compte créé avec succès ! Veuillez vérifier votre téléphone.',
      isVisible: true
    });
    
    // Si la création réussit, passer à l'étape suivante
    nextStep();
  };

  const handleOtpVerify = (code: string) => {
    // Simuler la vérification OTP
    if (code === '123456') {
      setOtpVerified(true);
      nextStep();
    }
  };

  const handleOtpResend = () => {
    console.log('Renvoyer le code OTP...');
  };

  const handlePaymentComplete = () => {
    setPaymentCompleted(true);
    nextStep();
  };

  const handleOnboardingComplete = async () => {
    setOnboardingCompleted(true);
    
    // Connecter l'utilisateur avec les données du formulaire
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error('Erreur lors de la connexion:', error);
        setNotification({
          type: 'error',
          message: 'Erreur lors de la connexion. Veuillez vous connecter manuellement.',
          isVisible: true
        });
        // Rediriger vers la page de login en cas d'erreur
        router.push('/login');
        return;
      }
      
      // Si la connexion réussit, passer à l'étape dashboard
      nextStep();
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setNotification({
        type: 'error',
        message: 'Erreur lors de la connexion. Veuillez vous connecter manuellement.',
        isVisible: true
      });
      router.push('/login');
    }
  };

  return (
    <>
      {/* Notification */}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
      
      {/* Indicateur de progression global */}
      {currentStep !== 'form' && <SignupProgressIndicator />}
      
      {/* Panneau de test (en développement) */}
      <SignupTestPanel />
      
      {/* Rendu conditionnel basé sur l'étape actuelle */}
      {(() => {
        switch (currentStep) {
          case 'form':
            return <SignupForm onSubmit={handleFormSubmit} />;
          
          case 'otp':
            return (
              <EnhancedOtpModal
                isOpen={true}
                onClose={() => {}} // Pas de fermeture possible à cette étape
                phoneNumber={formData.phone || '+33 6 12 34 56 78'}
                onVerify={handleOtpVerify}
                onResendCode={handleOtpResend}
              />
            );
          
          case 'payment':
            return <PaymentWrapper onComplete={handlePaymentComplete} />;
          
          case 'onboarding':
            return <OnboardingWrapper onComplete={handleOnboardingComplete} />;
          
          default:
            return <SignupForm onSubmit={handleFormSubmit} />;
        }
      })()}
    </>
  );
}
