'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CreditCard, 
  Shield, 
  Check, 
  Loader2, 
  Lock, 
  AlertCircle,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import AuthPageHeader from '@/components/ui/AuthPageHeader';

export default function PaymentPage() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });

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
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Paiement sécurisé PayPal',
      icon: (props: any) => (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.08c2.883 0 4.204.2 5.095.936.321.27.618.713.86 1.327.236.612.398 1.34.48 2.192.04.42.06.84.06 1.26 0 .65-.02 1.29-.06 1.89h.9c1.2 0 2.1.25 2.7.75.6.5.9 1.25.9 2.25s-.3 1.75-.9 2.35c-.6.6-1.5.9-2.7.9h-.9c.24.9.36 1.86.36 2.85 0 1.43-.24 2.68-.72 3.77-.48 1.09-1.14 1.95-1.98 2.58-.84.63-1.8 1.05-2.88 1.26-1.08.21-2.22.32-3.42.32H7.5a.8.8 0 0 1-.79-.67l-.63-4.9z" />
        </svg>
      ),
      color: 'from-blue-400 to-blue-600',
      iconColor: 'text-blue-400'
    },
    {
      id: 'mobile',
      name: 'Mobile Money',
      description: 'Orange Money, MTN, Moov',
      icon: (props: any) => (
        <svg {...props} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      iconColor: 'text-green-500'
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulation de traitement
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Rediriger vers la page d'onboarding
    window.location.href = '/onboarding';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      {/* Header Premium */}
      <AuthPageHeader pageTitle="Paiement" />
      
      <div className="flex-1 flex items-center justify-center p-4 pt-16">
        <div className="w-full max-w-md">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            {/* Payment Card */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 shadow-xl">
              {/* Progress Steps */}
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


            {/* Order Summary */}
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

            {/* Payment Methods */}
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

              {/* Currency Selection */}
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

              {/* Card Form (only shown when card is selected) */}
              <AnimatePresence>
                {selectedPaymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 mt-4 pt-4 border-t border-gray-700">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Numéro de carte
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full bg-gray-700/50 border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:bg-gray-700/80 transition-colors"
                          />
                          <div className="absolute right-3 top-3 flex space-x-1">
                            <div className="w-6 h-4 bg-gray-600 rounded-sm"></div>
                            <div className="w-6 h-4 bg-gray-500 rounded-sm"></div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Date d'expiration
                          </label>
                          <input
                            type="text"
                            placeholder="MM/AA"
                            className="w-full bg-gray-700/50 border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:bg-gray-700/80 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            CVV
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="•••"
                              className="w-full bg-gray-700/50 border-2 border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:bg-gray-700/80 transition-colors"
                            />
                            <div className="absolute right-3 top-3">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-gray-400">
                                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="currentColor"/>
                                <path d="M22 12C22 11 21 7 12 7C3 7 2 11 2 12C2 13 3 17 12 17C21 17 22 13 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Mobile Money Options (only shown when mobile is selected) */}
              {selectedPaymentMethod === 'mobile' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 mt-4 pt-4 border-t border-gray-700">
                    <h4 className="text-white font-medium">Sélectionnez votre opérateur</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <button className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-1 rounded-lg text-xs font-medium transition-colors">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-1">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-orange-600" fill="currentColor">
                              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"/>
                              <path d="M12 6a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z"/>
                            </svg>
                          </div>
                          <span>Orange</span>
                        </div>
                      </button>
                      <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-1 rounded-lg text-xs font-medium transition-colors">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-1">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-yellow-600" fill="currentColor">
                              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"/>
                              <path d="M12 6a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z"/>
                            </svg>
                          </div>
                          <span>MTN</span>
                        </div>
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-1 rounded-lg text-xs font-medium transition-colors">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-1">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600" fill="currentColor">
                              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"/>
                              <path d="M12 6a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z"/>
                            </svg>
                          </div>
                          <span>Moov</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payment Button */}
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

              {/* Security Info */}
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
