'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  ArrowRight, 
  Download, 
  Play, 
  Users, 
  Trophy,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id');
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
      
      // Vérifier le paiement et créer l'utilisateur si nécessaire
      const verifyPayment = async () => {
        try {
          console.log('🔍 Vérification du paiement...');
          
          const response = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId: sessionIdParam }),
          });

          const data = await response.json();

          if (response.ok) {
            console.log('✅ Paiement vérifié:', data);
            
            // Attendre 3 secondes puis rediriger vers l'onboarding
            setTimeout(() => {
              router.push('/onboarding');
            }, 3000);
          } else {
            console.error('❌ Erreur lors de la vérification:', data.error);
            // En cas d'erreur, rediriger vers la page d'annulation
            setTimeout(() => {
              router.push('/cancel');
            }, 3000);
          }
        } catch (error) {
          console.error('❌ Erreur lors de la vérification du paiement:', error);
          // En cas d'erreur, rediriger vers la page d'annulation
          setTimeout(() => {
            router.push('/cancel');
          }, 3000);
        }
      };

      verifyPayment();
    } else {
      // Pas de session ID, rediriger vers l'accueil
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }
    
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-xl font-bold text-white">Pitch To Me</h1>
            </div>
            <div className="text-sm text-gray-400">
              Session: {sessionId?.slice(-8)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>

            {/* Success Message */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-white mb-4"
            >
              Paiement réussi !
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-300 mb-8"
            >
              Bienvenue dans votre formation Premium VR ! Votre accès est maintenant actif.
            </motion.p>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">12 Modules</h3>
                <p className="text-gray-400 text-sm">
                  Contenu complet pour maîtriser l'art du pitch
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Environnements VR</h3>
                <p className="text-gray-400 text-sm">
                  Pratique immersive en réalité virtuelle
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Coaching IA</h3>
                <p className="text-gray-400 text-sm">
                  Accompagnement personnalisé par intelligence artificielle
                </p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-3 px-8 rounded-xl flex items-center space-x-2"
                >
                  <span>Commencer ma formation</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-8 rounded-xl flex items-center space-x-2 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Télécharger le guide</span>
              </motion.button>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700"
            >
              <h3 className="text-white font-semibold mb-3">Prochaines étapes</h3>
              <div className="text-left space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-xs font-bold">1</span>
                  </div>
                  <span>Complétez votre profil utilisateur</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-xs font-bold">2</span>
                  </div>
                  <span>Passez l'évaluation initiale</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-xs font-bold">3</span>
                  </div>
                  <span>Commencez votre premier module</span>
                </div>
              </div>
            </motion.div>

            {/* Support Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-400 text-sm">
                Besoin d'aide ? Contactez notre équipe support à{' '}
                <a href="mailto:support@pitchtome.com" className="text-yellow-400 hover:text-yellow-300">
                  support@pitchtome.com
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
