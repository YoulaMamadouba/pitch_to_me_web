'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building, Users, Zap, Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function B2BPage() {
  const [selectedPlan, setSelectedPlan] = useState<'sme' | 'mid-market' | 'enterprise'>('sme');

  const plans = [
    {
      id: 'sme',
      name: 'SME',
      description: 'Small to Medium Enterprises',
      price: '299',
      period: 'per month',
      features: [
        'Up to 50 users',
        'Basic AI coaching',
        'Standard modules',
        'Email support',
        'Progress tracking'
      ],
      gradient: 'from-gray-700 to-gray-800',
      border: 'border-gray-700'
    },
    {
      id: 'mid-market',
      name: 'Mid-Market',
      description: 'Growing Companies',
      price: '799',
      period: 'per month',
      features: [
        'Up to 200 users',
        'Advanced AI coaching',
        'VR training modules',
        'Priority support',
        'Custom analytics',
        'Team management'
      ],
      gradient: 'from-cyan-400 to-cyan-500',
      border: 'border-cyan-400',
      badge: 'POPULAR'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Large Organizations',
      price: '1999',
      period: 'per month',
      features: [
        'Unlimited users',
        'Custom AI coaching',
        'Full VR experience',
        '24/7 support',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated account manager'
      ],
      gradient: 'from-yellow-400 to-yellow-500',
      border: 'border-yellow-400',
      badge: 'ENTERPRISE'
    }
  ];

  const modules = [
    {
      title: 'Coaching Commercial',
      description: 'Formation spécialisée pour les équipes commerciales',
      icon: Users,
      color: 'from-blue-400 to-blue-500'
    },
    {
      title: 'Objection Handling',
      description: 'Maîtrisez l\'art de gérer les objections',
      icon: Zap,
      color: 'from-purple-400 to-purple-500'
    },
    {
      title: 'Présentation Executive',
      description: 'Présentations de niveau C-suite',
      icon: Star,
      color: 'from-yellow-400 to-yellow-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-black bg-opacity-20 backdrop-blur-sm border-b border-gray-700">
        <Link href="/" className="text-white hover:text-yellow-400 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="text-lg font-bold text-white">Business Solutions</div>
        <div className="w-6"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pt-20 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Solutions Entreprises
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Transformez vos équipes avec notre plateforme de formation à la prise de parole
            </p>
          </motion.div>

          {/* Business Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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
                    <div className={`bg-gradient-to-r ${plan.gradient} text-black text-xs px-4 py-1 rounded-full font-bold`}>
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
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedPlan(plan.id as 'sme' | 'mid-market' | 'enterprise')}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    plan.id === 'enterprise'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-lg hover:scale-105'
                      : plan.id === 'mid-market'
                      ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-black hover:shadow-lg hover:scale-105'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Sélectionné' : `Choisir ${plan.name}`}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Modules Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Modules Proposés
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <div key={module.title} className="bg-gray-800 bg-opacity-50 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all">
                  <div className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-full flex items-center justify-center mb-4`}>
                    <module.icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{module.title}</h3>
                  <p className="text-gray-400">{module.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center"
          >
            <div className="bg-gray-800 bg-opacity-50 p-8 rounded-xl border border-gray-700 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Prêt à transformer votre équipe ?
              </h3>
              <p className="text-gray-300 mb-6">
                Demandez une démonstration personnalisée et découvrez comment Pitch to Me peut améliorer les compétences de communication de votre équipe.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-semibold py-4 px-8 rounded-xl hover:shadow-2xl transition-all hover:scale-105"
              >
                <Building className="w-5 h-5" />
                <span>Demander une démo</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

