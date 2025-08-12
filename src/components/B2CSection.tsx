'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Check, Star, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function B2CSection() {
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
    <section className="py-20 px-6 bg-black bg-opacity-20">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Maîtrisez votre voix avec notre <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">formation individuelle</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            12 modules complets pour transformer votre prise de parole en public et devenir un orateur confiant
          </p>

          {/* Video Preview */}
          <div className="relative bg-gray-800 rounded-xl overflow-hidden mb-12 max-w-2xl mx-auto">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative bg-gray-800 bg-opacity-50 rounded-xl p-6 border-2 ${
                selectedPlan === plan.id ? plan.border : 'border-gray-700'
              } hover:border-gray-600 transition-all hover:transform hover:scale-105`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs px-4 py-1 rounded-full font-bold">
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
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="mb-8">
            <p className="text-gray-400 text-lg mb-4">
              Rejoignez <span className="text-yellow-400 font-bold">10,000+</span> speakers qui ont transformé leur voix
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.9/5</span>
              </div>
              <span>•</span>
              <span>+1000 avis</span>
              <span>•</span>
              <span>Garantie 30 jours</span>
            </div>
          </div>
          
          <Link 
            href="/login" 
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-semibold py-4 px-8 rounded-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <Zap className="w-5 h-5" />
            <span>Je suis un particulier</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
