'use client';

import { useSignup } from '@/contexts/SignupContext';
import { Check } from 'lucide-react';

export default function SignupProgressIndicator() {
  const { currentStep } = useSignup();

  const steps = [
    { id: 'form', label: 'Inscription', completed: currentStep !== 'form' },
    { id: 'otp', label: 'Vérification', completed: ['payment', 'onboarding', 'dashboard'].includes(currentStep) },
    { id: 'payment', label: 'Paiement', completed: ['onboarding', 'dashboard'].includes(currentStep) },
    { id: 'onboarding', label: 'Configuration', completed: currentStep === 'dashboard' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-gray-900/90 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
              step.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : index === currentStepIndex
                ? 'bg-yellow-400 border-yellow-400 text-black'
                : 'bg-gray-700 border-gray-600 text-gray-400'
            }`}>
              {step.completed ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                step.completed ? 'bg-green-500' : 'bg-gray-600'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
