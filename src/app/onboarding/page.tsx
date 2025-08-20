'use client';

import { useEffect, useState } from 'react';
import { Check, Play, Volume2, BookOpen, Award } from 'lucide-react';
import AuthPageHeader from '@/components/ui/AuthPageHeader';
import { useRouter } from 'next/navigation';

interface OnboardingPageProps {
  onComplete?: () => void;
}

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    console.log('🔧 OnboardingPage monté avec onComplete:', !!onComplete);
    
    // Check if we're coming from a successful payment
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('payment') === 'success') {
      setShowSuccess(true);
      
      // Store the session ID for later use
      const sessionId = searchParams.get('session_id');
      if (sessionId) {
        localStorage.setItem('stripe_session_id', sessionId);
      }
    }
  }, [onComplete, router]);

  // Navigation handler
  const handleContinue = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('🔧 handleContinue appelé !');
    console.log('🔧 onComplete existe ?', !!onComplete);
    console.log('🔧 isMounted ?', isMounted);
    
    if (!isMounted) return;
    
    try {
      // Mark onboarding as completed in local storage
      localStorage.setItem('onboardingCompleted', 'true');
      
      // If we have an onComplete callback, use it
      if (onComplete) {
        console.log('🔧 Appel de onComplete depuis OnboardingPage');
        onComplete();
        return;
      }
      
      console.log('🔧 Redirection vers le dashboard');
      
      // Store in session that we're coming from onboarding
      sessionStorage.setItem('fromOnboarding', 'true');
      
      // Redirect to dashboard with a flag to show success message
      router.push('/dashboard?onboarding=complete');
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Fallback to dashboard even if there's an error
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      {/* Header */}
      <AuthPageHeader pageTitle="Onboarding" />
      
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
            <Check className="w-5 h-5" />
            <span>Paiement réussi ! Complétez votre onboarding pour commencer.</span>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto pt-10 pb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700/50 mt-6">
            {/* Header with progress */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700 pt-12">
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((step) => (
                  <div 
                    key={step}
                    className={`w-2 h-2 rounded-full ${step <= 2 ? 'bg-yellow-400' : 'bg-gray-600'}`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-400">Étape 2 sur 4</div>
              <button className="text-sm text-gray-400 hover:text-white">Passer</button>
            </div>

            <div className="p-6 md:p-8">
              {/* AI Avatar Welcome */}
              <div className="text-center max-w-md mx-auto">
                <div className="relative inline-block mb-6">
                  <div className="relative w-32 h-32 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                      alt="Coach IA"
                      className="w-28 h-28 rounded-full object-cover border-4 border-white"
                    />
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-400 rounded-full flex items-center justify-center border-2 border-gray-900">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Bienvenue sur votre parcours !</h2>
                <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
                  Je suis Alex, votre coach de prise de parole en public IA. Je vais vous guider à travers 12 modules pour maîtriser l'art de la persuasion.
                </p>

                {/* Video Message */}
                <div className="bg-gray-700/50 rounded-xl p-4 mb-8 hover:bg-gray-700/70 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex-shrink-0 flex items-center justify-center">
                      <Play className="w-4 h-4 text-black ml-0.5" fill="currentColor" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">Message de bienvenue personnalisé</h3>
                      <p className="text-gray-400 text-xs">2:30 min • Cliquez pour lire</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-1">
                    <div className="bg-yellow-400 h-1 rounded-full w-1/3"></div>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-white mb-4">Commençons</h3>
                
                <div className="space-y-3 mb-8">
                  {/* Completed Item */}
                  <div className="bg-gray-800/50 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex-shrink-0 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">Compte créé</h4>
                          <p className="text-gray-400 text-xs">Profil complété</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current Item */}
                  <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex-shrink-0 flex items-center justify-center">
                          <Volume2 className="w-3 h-3 text-black" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">Enregistrer une vidéo de motivation</h4>
                          <p className="text-gray-300 text-xs">Partagez-nous vos objectifs</p>
                        </div>
                      </div>
                      <button className="bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-medium px-3 py-1 rounded-lg transition-colors">
                        Enregistrer
                      </button>
                    </div>
                  </div>

                  {/* Pending Items */}
                  <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 opacity-70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center">
                          <Check className="w-3 h-3 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="text-gray-400 font-medium">Accepter les CGU</h4>
                          <p className="text-gray-500 text-xs">Lisez nos conditions</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 opacity-70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center">
                          <BookOpen className="w-3 h-3 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="text-gray-400 font-medium">Commencer le Module 1</h4>
                          <p className="text-gray-500 text-xs">Débutez votre apprentissage</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Features */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Ce que vous allez maîtriser</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: <Volume2 className="w-4 h-4" />, title: 'Voix', color: 'from-yellow-400 to-amber-500' },
                      { icon: <Award className="w-4 h-4" />, title: 'Confiance', color: 'from-cyan-400 to-cyan-500' },
                      { icon: <Check className="w-4 h-4" />, title: 'Persuasion', color: 'from-purple-400 to-purple-500' }
                    ].map((feature, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-3 text-center hover:bg-gray-700/50 transition-colors">
                        <div className={`w-8 h-8 bg-gradient-to-r ${feature.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                          {feature.icon}
                        </div>
                        <p className="text-white text-xs font-medium">{feature.title}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <button 
                    onClick={handleContinue}
                    className="inline-block w-full max-w-xs mx-auto bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95"
                  >
                    Continuer la configuration
                  </button>
                  <p className="text-gray-400 text-xs mt-2">Moins de 2 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-yellow-400/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-400/10 rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
}
