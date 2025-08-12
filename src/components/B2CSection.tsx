'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Check, Star, Zap, ArrowRight, Sparkles, Crown, Target, Zap as ZapIcon, Eye, EyeOff, Video } from 'lucide-react';
import { motion } from 'framer-motion';

export default function B2CSection() {
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'premium'>('standard');
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

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
      border: 'border-gray-700',
      icon: Target,
      color: 'text-blue-400'
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
      badge: 'PREMIUM',
      icon: Video,
      color: 'text-black'
    }
  ];

  return (
    <section className="py-20 px-6 bg-black bg-opacity-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Maîtrisez votre voix avec notre{' '}
            <span className="text-yellow-400">
              formation individuelle
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
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

        {/* Enhanced Training Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredPlan(plan.id)}
              onHoverEnd={() => setHoveredPlan(null)}
              className={`relative group cursor-pointer`}
            >
              <motion.div
                className={`relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border-2 ${
                  selectedPlan === plan.id ? plan.border : 'border-gray-700/50'
                } hover:border-gray-600 transition-all duration-500 overflow-hidden`}
                whileHover={{ 
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon and Premium Badge Row */}
                <div className="flex justify-between items-start mb-6">
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <plan.icon className={`w-8 h-8 ${plan.color}`} />
                  </motion.div>
                  
                  {plan.badge && (
                    <motion.div 
                      className="z-10 -mt-2 -mr-1"
                      initial={{ scale: 0, rotate: -15 }}
                      animate={{ 
                        scale: [0, 1.2, 1],
                        rotate: [-15, 5, 0],
                      }}
                      transition={{ 
                        duration: 0.6,
                        delay: 0.3 + index * 0.2,
                        times: [0, 0.8, 1]
                      }}
                    >
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs px-4 py-2 rounded-full font-bold shadow-lg border-2 border-yellow-300 flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        <span>{plan.badge}</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-white mb-1">${plan.price}</div>
                  <div className="text-sm text-gray-400">{plan.period}</div>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div 
                      key={featureIndex} 
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.2 + featureIndex * 0.1 }}
                    >
                      <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-400" />
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={() => setSelectedPlan(plan.id as 'standard' | 'premium')}
                  className={`w-full py-4 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
                    plan.id === 'premium'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-2xl hover:shadow-yellow-500/25'
                      : 'bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">
                    {selectedPlan === plan.id ? 'Sélectionné' : `Choisir ${plan.name}`}
                  </span>
                  {hoveredPlan === plan.id && (
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="mb-8">
            <motion.p 
              className="text-gray-400 text-lg mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
            >
              Rejoignez <span className="text-yellow-400 font-bold">10,000+</span> speakers qui ont transformé leur voix
            </motion.p>
            
            <motion.div 
              className="flex items-center justify-center space-x-6 text-sm text-gray-500 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="flex items-center space-x-1"
                whileHover={{ scale: 1.05 }}
              >
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.9/5</span>
              </motion.div>
              <span>•</span>
              <motion.span whileHover={{ scale: 1.05 }}>+1000 avis</motion.span>
              <span>•</span>
              <motion.span whileHover={{ scale: 1.05 }}>Garantie 30 jours</motion.span>
            </motion.div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/login" 
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-semibold py-5 px-10 rounded-2xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
            >
              <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-lg">Je suis un particulier</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
