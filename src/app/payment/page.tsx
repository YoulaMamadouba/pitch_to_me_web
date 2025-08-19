'use client';
import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Shield, 
  Check, 
  Loader2, 
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import AuthPageHeader from '@/components/ui/AuthPageHeader';
import { useSignup } from '@/contexts/SignupContext';
import { getAmountInCents } from '@/types/payment';

export default function PaymentPage() {
  const { formData } = useSignup();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Vérifier que nous avons les données du formulaire d'inscription
  useEffect(() => {
    if (!formData || !formData.email) {
      console.log('🔧 Données d\'inscription manquantes, redirection vers /signup');
      window.location.href = '/signup';
      return;
    }
  }, [formData]);

  const currencies = [
    { code: 'USD', symbol: '$', amount: '299' },
    { code: 'EUR', symbol: '€', amount: '279' },
    { code: 'XOF', symbol: 'FCFA', amount: '175 000' }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Carte bancaire',
      description: 'Visa, Mastercard, Amex',
      icon: CreditCard,
      color: 'from-blue-600 to-blue-700',
      iconColor: 'text-blue-500'
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      if (!formData || !formData.email) {
        throw new Error('Données d\'inscription manquantes');
      }
      
      const amount = getAmountInCents(selectedCurrency as 'USD' | 'EUR' | 'XOF');
      const plan = 'premium';

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: selectedCurrency,
          plan,
          userData: formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la session de paiement');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
    } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      alert(`Erreur lors du paiement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      <AuthPageHeader pageTitle="Paiement" />
      
      <div className="flex-1 flex items-center justify-center p-4 pt-16">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 shadow-xl">
              <div className="px-6 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-yellow-400" />
                    <div className="text-sm font-medium text-white">Paiement sécurisé</div>
                  </div>
                  <div className="flex items-center space-x-1 bg-green-600/90 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                    <Shield className="w-3 h-3" />
                    <span>SÉCURISÉ</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6 relative">
                  {['Inscription', 'Paiement', 'Confirmation'].map((step, index) => (
                    <div key={index} className="flex flex-col items-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index < 2 ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400'
                      }`}>
                        {index < 2 ? <Check className="w-4 h-4" /> : index + 1}
                      </div>
                      <span className="mt-1 text-xs text-gray-400">{step}</span>
                    </div>
                  ))}
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-700 -z-10">
                    <div className="w-2/3 h-full bg-yellow-500"></div>
                  </div>
                </div>
              </div>

            <div className="px-6 pt-2 pb-4 border-b border-gray-700">
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-black font-bold">Formation Premium VR</h3>
                    <p className="text-gray-800 text-sm">12 modules + environnements VR + coaching IA</p>
                  </div>
                  <div className="bg-black/20 text-black text-xs px-2 py-1 rounded font-bold">
                    PREMIUM
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-yellow-300/30">
                  <span className="text-black font-medium">Total</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-black">
                      {currencies.find(c => c.code === selectedCurrency)?.symbol}
                      {currencies.find(c => c.code === selectedCurrency)?.amount}
                      {selectedCurrency === 'XOF' ? ' FCFA' : ''}
                    </div>
                    <div className="text-xs text-gray-700">
                      {selectedCurrency !== 'XOF' && 'TVA incluse'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-white font-medium mb-4">Moyen de paiement</h3>
              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <motion.div 
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          selectedPaymentMethod === method.id
                            ? 'border-yellow-400 bg-yellow-400/10'
                            : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center mr-3`}>
                            <Icon className={`w-5 h-5 ${method.iconColor || 'text-white'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-white">{method.name}</div>
                            <div className="text-xs text-gray-400">{method.description}</div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPaymentMethod === method.id 
                              ? 'border-yellow-400 bg-yellow-400' 
                              : 'border-gray-600'
                          }`}>
                            {selectedPaymentMethod === method.id && (
                              <Check className="w-3 h-3 text-black" />
                            )}
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Devise</h3>
                <div className="grid grid-cols-3 gap-2">
                  {currencies.map((currency) => (
                    <motion.div
                      key={currency.code}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        onClick={() => setSelectedCurrency(currency.code)}
                        className={`w-full py-2 px-1 rounded-lg border transition-colors text-sm ${
                          selectedCurrency === currency.code
                            ? 'border-yellow-400 bg-yellow-400/10 text-white'
                            : 'border-gray-700 text-gray-300 hover:border-gray-600 bg-gray-800/50'
                        }`}
                      >
                        <span className="block font-medium">{currency.code}</span>
                        <span className="text-xs">
                          {currency.symbol} {currency.amount}
                        </span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={handlePayment}
                disabled={isProcessing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-4 px-6 rounded-xl mt-6 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-yellow-400/20"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Traitement...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Payer {currencies.find(c => c.code === selectedCurrency)?.symbol}
                    {currencies.find(c => c.code === selectedCurrency)?.amount}
                    {selectedCurrency === 'XOF' ? ' FCFA' : ''}
                  </div>
                )}
              </motion.button>

              <div className="mt-4 flex items-center justify-center text-xs text-gray-400">
                <Shield className="w-4 h-4 mr-1 text-green-400" />
                <span>Paiement 100% sécurisé et crypté</span>
              </div>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
