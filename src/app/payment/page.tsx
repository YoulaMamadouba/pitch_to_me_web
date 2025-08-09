'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Shield, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentPage() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });

  const currencies = [
    { code: 'USD', symbol: '$', amount: '299' },
    { code: 'EUR', symbol: '€', amount: '279' },
    { code: 'XOF', symbol: '', amount: '175k' }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, Amex',
      icon: CreditCard,
      color: 'bg-blue-600'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: CreditCard,
      color: 'bg-blue-500'
    },
    {
      id: 'mobile',
      name: 'Mobile Money',
      description: 'Orange Money, MTN, Moov',
      icon: CreditCard,
      color: 'bg-green-600'
    }
  ];

  const handlePayment = () => {
    // Rediriger vers la page d'onboarding
    window.location.href = '/onboarding';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-black bg-opacity-20 backdrop-blur-sm border-b border-gray-700">
        <Link href="/signup" className="text-white hover:text-yellow-400 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="text-lg font-bold text-white">Payment</div>
        <div className="bg-green-600 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
          SECURE
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
          {/* Payment Card */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600 shadow-2xl">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-8 h-1 bg-yellow-400 rounded-full"></div>
              <div className="w-8 h-1 bg-yellow-400 rounded-full"></div>
              <div className="w-8 h-1 bg-yellow-400 rounded-full"></div>
            </div>
            <p className="text-center text-gray-400 text-sm mb-8">Step 3 of 3</p>

            {/* Order Summary */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-black font-semibold">Premium VR Training</h3>
                  <div className="bg-black text-yellow-400 text-xs px-2 py-1 rounded font-bold">
                    PREMIUM
                  </div>
                </div>
                <p className="text-gray-800 text-sm mb-3">12 modules + VR environments + AI coaching</p>
                <div className="flex items-center justify-between">
                  <span className="text-black font-medium">Total</span>
                  <span className="text-2xl font-bold text-black">$299.00</span>
                </div>
              </div>
            </div>

            {/* Currency Selection */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-3">Select Currency</h3>
              <div className="grid grid-cols-3 gap-2">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => setSelectedCurrency(currency.code)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      selectedCurrency === currency.code
                        ? 'bg-gray-700 border border-yellow-400'
                        : 'bg-gray-700 border border-gray-600'
                    }`}
                  >
                    <div className="text-white font-medium">{currency.code}</div>
                    <div className={`text-sm ${selectedCurrency === currency.code ? 'text-yellow-400' : 'text-gray-400'}`}>
                      {currency.symbol}{currency.amount}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-4">Payment Method</h3>
              
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`mb-3 rounded-xl p-4 transition-all ${
                    selectedPaymentMethod === method.id
                      ? 'bg-gray-700 border border-yellow-400'
                      : 'bg-gray-700 border border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center`}>
                        <method.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{method.name}</h4>
                        <p className="text-gray-400 text-sm">{method.description}</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${
                      selectedPaymentMethod === method.id
                        ? 'bg-yellow-400'
                        : 'border-2 border-gray-600'
                    }`}></div>
                  </div>
                  
                  {selectedPaymentMethod === method.id && method.id === 'card' && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardData.number}
                        onChange={(e) => setCardData({...cardData, number: e.target.value})}
                        className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                          className="bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                          className="bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === method.id && method.id === 'mobile' && (
                    <div className="grid grid-cols-3 gap-2">
                      <button className="bg-orange-600 text-white py-2 px-3 rounded text-xs font-medium">
                        Orange Money
                      </button>
                      <button className="bg-yellow-600 text-white py-2 px-3 rounded text-xs font-medium">
                        MTN Money
                      </button>
                      <button className="bg-blue-600 text-white py-2 px-3 rounded text-xs font-medium">
                        Moov Money
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Security Info */}
            <div className="mb-8">
              <div className="bg-green-900 bg-opacity-30 border border-green-600 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-green-400" />
                  <div>
                    <h4 className="text-green-400 font-medium">Secure Payment</h4>
                    <p className="text-gray-300 text-sm">256-bit SSL encryption • PCI DSS compliant</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Payment */}
            <div className="mt-8">
              <button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-4 rounded-xl mb-4 hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg shadow-yellow-400/25"
              >
                Complete Payment - $299.00
              </button>
              
              <div className="text-center">
                <p className="text-gray-400 text-xs">
                  By completing this purchase, you agree to our 
                  <span className="text-yellow-400 underline"> Terms of Service</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
