'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building, Users, Zap, Check, Star, Play, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function B2BPage() {
  const [selectedPlan, setSelectedPlan] = useState<'sme' | 'mid-market' | 'enterprise'>('sme');
  const [showVideo, setShowVideo] = useState(false);

  const modules = [
    {
      id: 1,
      title: 'Sales Pitch',
      description: 'Master persuasion',
      icon: (
        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
        </svg>
      ),
      color: 'bg-yellow-400'
    },
    {
      id: 2,
      title: 'Objection Handling',
      description: 'Turn no into yes',
      icon: (
        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/>
        </svg>
      ),
      color: 'bg-cyan-400'
    },
    {
      id: 3,
      title: 'Client Relations',
      description: 'Build trust',
      icon: (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
        </svg>
      ),
      color: 'bg-purple-400'
    },
    {
      id: 4,
      title: 'Closing Deals',
      description: 'Seal the deal',
      icon: (
        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      color: 'bg-green-400'
    },
    {
      id: 5,
      title: 'Negotiation',
      description: 'Win-win strategies',
      icon: (
        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z"/>
        </svg>
      ),
      color: 'bg-pink-400'
    },
    {
      id: 6,
      title: 'Product Demo',
      description: 'Showcase features',
      icon: (
        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"/>
        </svg>
      ),
      color: 'bg-indigo-400'
    }
  ];

  const plans = [
    {
      id: 'sme',
      name: 'SME (1-50 employees)',
      description: 'Perfect for growing teams',
      price: '99',
      period: 'per user/month',
      features: [
        'Up to 50 users',
        'Basic AI coaching',
        'Standard modules',
        'Email support',
        'Progress tracking'
      ],
      gradient: 'from-gray-700 to-gray-800',
      border: 'border-gray-600 hover:border-cyan-400',
      textColor: 'text-gray-300'
    },
    {
      id: 'mid-market',
      name: 'Mid-Market (51-500)',
      description: 'Scalable solutions',
      price: '79',
      period: 'per user/month',
      features: [
        'Up to 200 users',
        'Advanced AI coaching',
        'VR training modules',
        'Priority support',
        'Custom analytics',
        'Team management'
      ],
      gradient: 'from-gray-700 to-gray-800',
      border: 'border-gray-600 hover:border-cyan-400',
      textColor: 'text-gray-300'
    },
    {
      id: 'enterprise',
      name: 'Enterprise (500+)',
      description: 'Custom enterprise solutions',
      price: 'Custom',
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-white hover:text-yellow-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold">Business Solutions</h1>
          <button className="text-white hover:text-yellow-400 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-4 pt-16 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Video Section - Moved to top */}
          <section className="mb-6 rounded-xl overflow-hidden shadow-xl">
            <div className="relative bg-gray-800">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop" 
                alt="Business training" 
                className="w-full h-48 md:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button 
                  onClick={() => setShowVideo(true)}
                  className="w-14 h-14 bg-cyan-400/80 hover:bg-cyan-400 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                  <Play className="w-6 h-6 text-black ml-0.5" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 bg-cyan-400 text-black text-xs px-3 py-1 rounded-full font-semibold">
                ENTERPRISE SOLUTION
              </div>
            </div>
          </section>

          {/* Hero Section - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <h1 className="text-2xl font-bold text-white mb-1">Empower Your Sales Team</h1>
            <p className="text-gray-300 text-sm">6 specialized modules for commercial excellence</p>
          </motion.div>

          {/* Company Size Selection - Horizontal Cards */}
          <section className="mb-8">
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider text-gray-400">Select Your Company Size</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedPlan(plan.id as any)}
                  className={`p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                    selectedPlan === plan.id 
                      ? 'bg-gradient-to-br from-cyan-400/90 to-cyan-500/90 text-black shadow-lg shadow-cyan-500/20' 
                      : 'bg-gray-800/50 border border-gray-700 hover:border-cyan-400/50 hover:bg-gray-800/70'
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm md:text-base">{plan.name.split(' (')[0]}</h4>
                      <p className="text-xs opacity-80 mt-1">{plan.description}</p>
                    </div>
                    <div className="mt-3 text-right">
                      <div className="font-bold text-lg">
                        {plan.price === 'Custom' ? 'Custom' : `$${plan.price}`}
                      </div>
                      {plan.price !== 'Custom' && (
                        <div className="text-xs opacity-70">per user/month</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Training Modules - Centered Grid */}
          <section className="mb-8">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider text-gray-400 text-center">Commercial Modules</h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {modules.map((module) => (
                <motion.div 
                  key={module.id}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-cyan-400/50 transition-all cursor-pointer group w-[calc(50%-0.75rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1rem)] min-w-[140px] max-w-[180px]"
                >
                  <div className={`w-10 h-10 ${module.color} rounded-lg flex items-center justify-center mb-2 mx-auto group-hover:opacity-90`}>
                    {React.cloneElement(module.icon, { className: 'w-5 h-5' })}
                  </div>
                  <h4 className="text-white text-sm font-medium text-center truncate">{module.title}</h4>
                  <p className="text-gray-400 text-xs text-center line-clamp-2">{module.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Accès rapide */}
          <section className="mb-8">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider text-gray-400 text-center">Accès rapide</h3>
            <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
              {/* Carte Presentation Builder */}
              <Link href="/presentation-builder" className="w-full sm:w-auto">
                <motion.div 
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gradient-to-br from-yellow-300 to-amber-400 rounded-lg p-4 border border-amber-300/50 hover:border-amber-400 transition-all cursor-pointer group w-full sm:min-w-[280px] max-w-[300px] h-full"
                >
                  <div className="flex items-center h-full">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h4 className="text-black text-base font-medium truncate">Presentation Builder</h4>
                        <span className="ml-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">NOUVEAU</span>
                      </div>
                      <p className="text-gray-800 text-sm truncate">Créez des présentations percutantes</p>
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* Carte Leaderboard */}
              <Link href="/leaderboard" className="w-full sm:w-auto">
                <motion.div 
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg p-4 border border-purple-300/50 hover:border-purple-400 transition-all cursor-pointer group w-full sm:min-w-[280px] max-w-[300px] h-full"
                >
                  <div className="flex items-center h-full">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h4 className="text-white text-base font-medium truncate">Classement</h4>
                        <span className="ml-2 bg-white/30 text-white text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">NOUVEAU</span>
                      </div>
                      <p className="text-white/90 text-sm truncate">Découvrez le classement des meilleurs</p>
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* Carte Company Analytics */}
              <Link href="/company-analytics" className="w-full sm:w-auto">
                <motion.div 
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg p-4 border border-blue-300/50 hover:border-blue-400 transition-all cursor-pointer group w-full sm:min-w-[280px] max-w-[300px] h-full"
                >
                  <div className="flex items-center h-full">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h4 className="text-white text-base font-medium truncate">Analytics Entreprise</h4>
                        <span className="ml-2 bg-white/30 text-white text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">NOUVEAU</span>
                      </div>
                      <p className="text-white/90 text-sm truncate">Suivez les performances de votre équipe</p>
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* Carte Team Management */}
              <Link href="/team-management" className="w-full sm:w-auto">
                <motion.div 
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg p-4 border border-pink-300/50 hover:border-pink-400 transition-all cursor-pointer group w-full sm:min-w-[280px] max-w-[300px] h-full"
                >
                  <div className="flex items-center h-full">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h4 className="text-white text-base font-medium truncate">Team Management</h4>
                        <span className="ml-2 bg-white/30 text-white text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">NOUVEAU</span>
                      </div>
                      <p className="text-white/90 text-sm truncate">Gérez votre équipe efficacement</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>
          </section>

          {/* CTA Section - Compact Buttons */}
          <section className="mt-10">
            <div className="flex flex-wrap justify-center gap-4 max-w-md mx-auto">
              <button className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-medium text-sm px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all whitespace-nowrap">
                Request Demo
              </button>
              
              <button className="border border-gray-600 text-white text-sm px-6 py-2 rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap">
                Schedule Call
              </button>
            </div>
            
            <div className="text-center pt-4">
              <p className="text-gray-400 text-xs">Trusted by 500+ companies worldwide</p>
            </div>
          </section>

          {/* Video Modal */}
          <AnimatePresence>
            {showVideo && (
              <motion.div 
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowVideo(false)}
              >
                <motion.div 
                  className="relative w-full max-w-3xl bg-gray-900 rounded-xl overflow-hidden"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="aspect-video bg-black">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                      title="Pitch to Me Business Demo"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <button 
                    onClick={() => setShowVideo(false)}
                    className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
