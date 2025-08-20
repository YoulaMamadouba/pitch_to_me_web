'use client';

import { useEffect } from 'react';
import { useSignup } from '@/contexts/SignupContext';
import SignupForm from './SignupForm';
import EnhancedOtpModal from './ui/EnhancedOtpModal';
import PaymentWrapper from './PaymentWrapper';
import OnboardingWrapper from './OnboardingWrapper';

import Notification from './ui/Notification';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiCall } from '@/lib/apiUtils';

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
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);

  // Redirection automatique vers le dashboard si l'inscription est complète
  useEffect(() => {
    console.log('🔧 useEffect dashboard - currentStep:', currentStep, 'isOnboardingCompleted:', isOnboardingCompleted);
    if (currentStep === 'dashboard') {
      // Seulement rediriger si l'onboarding est complété
      if (isOnboardingCompleted) {
        console.log('🔧 Redirection vers /dashboard car onboarding complété');
        router.push('/dashboard');
      } else {
        console.log('🔧 Onboarding pas encore complété, pas de redirection');
      }
    }
  }, [currentStep, router, isOnboardingCompleted]);

  // Réinitialiser l'état de vérification OTP seulement si on revient au formulaire
  useEffect(() => {
    if (currentStep === 'form') {
      setIsOtpVerifying(false);
    }
  }, [currentStep]);

  // Empêcher l'accès direct au dashboard si l'utilisateur n'a pas complété le flux
  // DÉSACTIVÉ temporairement pour déboguer
  /*
  useEffect(() => {
    // Si l'utilisateur est connecté mais qu'on n'est pas à l'étape dashboard
    // et que l'onboarding n'est pas complété, rediriger vers le formulaire
    if (user && currentStep !== 'dashboard' && !isOnboardingCompleted) {
      console.log('useEffect: Remise à form car utilisateur connecté');
      setCurrentStep('form');
    }
  }, [user, currentStep, isOnboardingCompleted, setCurrentStep]);
  */

  const handleFormSubmit = async (data: any) => {
    setFormData(data);
    
    // Envoyer l'OTP par email avant de passer à l'étape suivante
    const result = await apiCall('/api/send-otp-email', {
      method: 'POST',
      body: JSON.stringify({ 
        email: data.email, 
        name: data.name 
      }),
    });

    if (result.success) {
      console.log('Code OTP envoyé avec succès');
      nextStep();
    } else {
      console.error('Erreur lors de l\'envoi du code OTP:', result.error);
      setNotification({
        type: 'error',
        message: 'Erreur lors de l\'envoi du code de vérification. Veuillez réessayer.',
        isVisible: true
      });
    }
  };

  const handleOtpVerify = async (code: string) => {
    // Empêcher les appels multiples
    if (isOtpVerifying) {
      console.log('🔍 Vérification OTP déjà en cours, ignoré');
      return;
    }

    console.log('🔍 OTP vérifié avec succès par le modal, passage à l\'étape suivante');
    setIsOtpVerifying(true);
    setOtpVerified(true);
    
    // Passer immédiatement à l'étape suivante
    setTimeout(() => {
      console.log('🔧 Passage à l\'étape suivante après OTP');
      nextStep();
    }, 100);
  };

  const handleOtpResend = async () => {
    const result = await apiCall('/api/send-otp-email', {
      method: 'POST',
      body: JSON.stringify({ 
        email: formData.email, 
        name: formData.name 
      }),
    });

    if (result.success) {
      console.log('Code OTP renvoyé avec succès');
    } else {
      console.error('Erreur lors du renvoi du code OTP:', result.error);
    }
  };

  const handlePaymentComplete = () => {
    setPaymentCompleted(true);
    nextStep();
  };

  const handleOnboardingComplete = async () => {
    console.log('=== handleOnboardingComplete appelé ===');
    console.log('FormData:', formData);
    console.log('FormData keys:', Object.keys(formData));
    console.log('createUser function exists:', !!createUser);
    
    setOnboardingCompleted(true);
    
    // Créer l'utilisateur dans la base de données à la fin de l'onboarding
    console.log('🔧 Création de l\'utilisateur...');
    const result = await createUser(formData);
    const error = result?.error;
    const user = (result as any)?.user;
    
    if (error) {
      console.error('❌ Erreur lors de la création de l\'utilisateur:', error);
      setNotification({
        type: 'error',
        message: `Erreur lors de la création du compte: ${error}`,
        isVisible: true
      });
      return;
    }
    
    console.log('✅ Utilisateur créé avec succès:', user);
    console.log('🔧 Tentative de connexion...');
    
    // Connecter l'utilisateur avec les données du formulaire
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        console.error('❌ Erreur lors de la connexion:', error);
        setNotification({
          type: 'error',
          message: 'Erreur lors de la connexion. Veuillez vous connecter manuellement.',
          isVisible: true
        });
        // Rediriger vers la page de login en cas d'erreur
        router.push('/login');
        return;
      }
      
      console.log('✅ Connexion réussie, passage au dashboard...');
      // Si la connexion réussit, passer à l'étape dashboard
      nextStep();
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
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
                email={formData.email}
                onVerify={handleOtpVerify}
                onResendCode={handleOtpResend}
              />
            );
          
          case 'payment':
            return <PaymentWrapper onComplete={handlePaymentComplete} />;
          
          case 'onboarding':
            console.log('🔧 Rendu OnboardingWrapper avec handleOnboardingComplete:', !!handleOnboardingComplete);
            return <OnboardingWrapper onComplete={handleOnboardingComplete} />;
          
          default:
            return <SignupForm onSubmit={handleFormSubmit} />;
        }
      })()}
    </>
  );
}
