'use client';

import { useSignup } from '@/contexts/SignupContext';
import { useState } from 'react';

export default function SignupTestPanel() {
  const { currentStep, setCurrentStep, resetSignup } = useSignup();
  const [isVisible, setIsVisible] = useState(false);

  const steps = ['form', 'otp', 'payment', 'onboarding', 'dashboard'];

  const handleStepChange = (step: string) => {
    setCurrentStep(step as any);
  };

  const handleReset = () => {
    resetSignup();
  };

  const handleSimulateCompleteFlow = async () => {
    resetSignup();
    
    // Simuler le flux complet
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentStep(step as any);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium shadow-lg z-50"
      >
        Test Signup Flow
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl z-50 max-w-xs">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-medium">Test Panel</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 mb-3">
        <p className="text-gray-300 text-sm">Current Step: <span className="text-yellow-400 font-medium">{currentStep}</span></p>
        
        <div className="space-y-1">
          {steps.map((step) => (
            <button
              key={step}
              onClick={() => handleStepChange(step)}
              className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                currentStep === step
                  ? 'bg-yellow-400 text-black font-medium'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {step}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={handleReset}
          className="w-full bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
        >
          Reset
        </button>
        
        <button
          onClick={handleSimulateCompleteFlow}
          className="w-full bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
        >
          Simulate Complete Flow
        </button>
      </div>
    </div>
  );
}
