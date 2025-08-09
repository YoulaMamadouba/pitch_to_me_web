'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Check, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function B2CPage() {
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'premium'>('standard');

  const plans = [
    {
      id: 'standard',
      name: 'Standard Training',
      description: 'Interactive web experience',
      price: '99',
      period: 'one-time',
      features: [
        '12 comprehensive modules',
        'AI voice analysis',
        'Community access',
        'Progress tracking',
        'Basic feedback'
      ],
      gradient: 'from-gray-700 to-gray-800',
      border: 'border-gray-700'
    },
    {
      id: 'premium',
      name: 'VR Immersive',
      description: 'Virtual reality experience',
      price: '299',
      period: 'one-time',
      features: [
        'Everything in Standard',
        'VR practice environments',
        'Real-time feedback',
        '1-on-1 coaching sessions',
        'Advanced analytics'
      ],
      gradient: 'from-yellow-400 to-yellow-500',
      border: 'border-yellow-400',
      badge: 'PREMIUM'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-black bg-opacity-20 backdrop-blur-sm border-b border-gray-700">
        <Link href="/" className="text-white hover:text-yellow-400 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="text-lg font-bold text-white">Individual Training</div>
        <div className="w-6"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pt-20 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Master Your Voice
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              12 comprehensive modules to transform your public speaking
            </p>

            {/* Video Preview */}
            <div className="relative bg-gray-800 rounded-xl overflow-hidden mb-8 max-w-2xl mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop" 
                alt="Training preview" 
                className="w-full h-48 md:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <button className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                </button>
              </div>
              <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                LIVE
              </div>
            </div>
          </motion.div>

          {/* Training Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative bg-gray-800 bg-opacity-50 rounded-xl p-6 border-2 ${
                  selectedPlan === plan.id ? plan.border : 'border-gray-700'
                } hover:border-gray-600 transition-all`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs px-4 py-1 rounded-full font-bold premium-badge">
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-white">${plan.price}</div>
                  <div className="text-sm text-gray-400">{plan.period}</div>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedPlan(plan.id as 'standard' | 'premium')}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    plan.id === 'premium'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-lg hover:scale-105'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Sélectionné' : `Choisir ${plan.name}`}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <div className="mb-6">
              <p className="text-gray-400 text-lg">
                Rejoignez <span className="text-yellow-400 font-bold">10,000+</span> speakers qui ont transformé leur voix
              </p>
            </div>
            
            <Link 
              href="/signup" 
              className={`inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-semibold py-4 px-8 rounded-xl hover:shadow-2xl transition-all hover:scale-105`}
            >
              <Zap className="w-5 h-5" />
              <span>Commencer l'essai gratuit</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

