'use client';

import { motion } from 'framer-motion';
import { 
  XCircle, 
  ArrowLeft, 
  RefreshCw, 
  HelpCircle, 
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">P</span>
              </div>
              <h1 className="text-xl font-bold text-white">Pitch To Me</h1>
            </div>
            <div className="text-sm text-gray-400">
              Paiement annulé
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
            {/* Cancel Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-6"
            >
              <XCircle className="w-12 h-12 text-white" />
            </motion.div>

            {/* Cancel Message */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-white mb-4"
            >
              Paiement annulé
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-300 mb-8"
            >
              Votre paiement a été annulé. Aucun montant n'a été débité de votre compte.
            </motion.p>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8"
            >
              <h3 className="text-white font-semibold mb-4">Que s'est-il passé ?</h3>
              <div className="text-left space-y-3 text-sm text-gray-300">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Vous avez fermé la page de paiement avant de finaliser</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Vous avez cliqué sur "Annuler" pendant le processus</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Une erreur technique s'est produite</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-3 px-8 rounded-xl flex items-center space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Réessayer l'inscription</span>
                </motion.button>
              </Link>

              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-8 rounded-xl flex items-center space-x-2 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Retour à l'accueil</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Support Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="bg-gray-800/30 rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 mr-2 text-yellow-400" />
                Besoin d'aide ?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-medium mb-1">Email</h4>
                  <a 
                    href="mailto:support@pitchtome.com" 
                    className="text-yellow-400 hover:text-yellow-300 text-sm"
                  >
                    support@pitchtome.com
                  </a>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-medium mb-1">Téléphone</h4>
                  <a 
                    href="tel:+33123456789" 
                    className="text-yellow-400 hover:text-yellow-300 text-sm"
                  >
                    +33 1 23 45 67 89
                  </a>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-white font-medium mb-1">Chat</h4>
                  <button className="text-yellow-400 hover:text-yellow-300 text-sm">
                    Chat en ligne
                  </button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-300 text-sm">
                  <strong>Conseil :</strong> Si vous rencontrez des difficultés avec le paiement, 
                  essayez de vider le cache de votre navigateur ou utilisez un mode de paiement différent.
                </p>
              </div>
            </motion.div>

            {/* FAQ Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-6 text-center"
            >
              <Link href="/faq" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                Consultez notre FAQ pour plus d'informations
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
