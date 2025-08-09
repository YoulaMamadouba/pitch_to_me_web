'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Play, User, Target, Zap, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 0,
      title: 'Bienvenue sur Pitch to Me',
      description: 'Je suis Alex, votre coach IA personnel. Je vais vous accompagner dans votre parcours de formation.',
      icon: User,
      color: 'from-blue-400 to-blue-500'
    },
    {
      id: 1,
      title: 'Définir vos objectifs',
      description: 'Quel type de prise de parole souhaitez-vous maîtriser ?',
      icon: Target,
      color: 'from-green-400 to-green-500'
    },
    {
      id: 2,
      title: 'Évaluer votre niveau',
      description: 'Passons un petit test pour adapter votre parcours de formation.',
      icon: Zap,
      color: 'from-yellow-400 to-yellow-500'
    },
    {
      id: 3,
      title: 'Planifier votre formation',
      description: 'Créons ensemble votre plan d\'apprentissage personnalisé.',
      icon: Award,
      color: 'from-purple-400 to-purple-500'
    }
  ];

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    if (stepId < steps.length - 1) {
      setCurrentStep(stepId + 1);
    } else {
      // Rediriger vers le dashboard après completion
      window.location.href = '/dashboard';
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-black bg-opacity-20 backdrop-blur-sm border-b border-gray-700">
        <div className="text-lg font-bold text-white">Onboarding</div>
        <div className="bg-yellow-600 text-black text-xs px-2 py-1 rounded font-bold">
          STEP {currentStep + 1}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Onboarding Card */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600 shadow-2xl">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Onboarding</h2>
                <span className="text-gray-400">{currentStep + 1} / {steps.length}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Steps Indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      completedSteps.includes(step.id)
                        ? 'bg-gradient-to-r from-green-400 to-green-500'
                        : currentStep === step.id
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                        : 'bg-gray-700'
                    }`}>
                      {completedSteps.includes(step.id) ? (
                        <Check className="w-5 h-5 text-black" />
                      ) : (
                        <step.icon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 mx-2 ${
                        completedSteps.includes(step.id) ? 'bg-green-400' : 'bg-gray-700'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Current Step Content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className={`w-24 h-24 bg-gradient-to-r ${currentStepData.color} rounded-full mx-auto mb-6 flex items-center justify-center`}>
                <currentStepData.icon className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{currentStepData.title}</h3>
              <p className="text-gray-300 text-lg">{currentStepData.description}</p>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => handleStepComplete(currentStep)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-3 px-8 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Continuer</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <Link
                  href="/dashboard"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-3 px-8 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Commencer l'apprentissage</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

