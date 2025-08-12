'use client';

import Link from 'next/link';
import { Play, User, Building, ChevronUp, CheckCircle, UserPlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function Hero() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Fermer le drawer quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setIsDrawerOpen(false);
      }
    };

    if (isDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Empêcher le scroll du body quand le drawer est ouvert
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  return (
    <div className="relative h-screen overflow-hidden flex flex-col">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full" style={{ top: '-40%', height: '140%' }}>
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&h=1500&fit=crop&crop=top" 
            alt="Professional speaker" 
            className="w-full h-full object-cover object-top opacity-90"
            style={{ objectPosition: '50% 35%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span 
              className="relative inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Transform Your Voice
            </motion.span>
            <br />
            <motion.span 
              className="animated-title relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 100 }}
            >
              Into Power
            </motion.span>
          </motion.h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Master the art of persuasion with AI-powered training, VR experiences, and a global community of speakers.
          </p>

          {/* CTA Buttons with Play Button Above */}
          <div className="flex flex-col items-center">
            {/* Play Button */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="mb-8"
            >
              <div className="relative w-16 h-16">
                <button className="w-full h-full bg-yellow-400 bg-opacity-90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 group absolute inset-0">
                  <Play className="w-6 h-6 text-black ml-0.5 group-hover:scale-110 transition-transform" fill="currentColor" />
                  <div className="absolute inset-0 rounded-full border-4 border-yellow-300 opacity-0 group-hover:opacity-100 animate-ping-slow"></div>
                </button>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xs mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Link 
                  href="/login" 
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-2 px-4 rounded-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 text-xs"
                >
                  <User className="w-5 h-5" />
                  <span>Je suis un particulier</span>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <button 
                  onClick={() => setIsDrawerOpen(true)}
                  className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-semibold py-2 px-4 rounded-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 text-xs group"
                >
                  <Building className="w-5 h-5" />
                  <span>Je suis une entreprise</span>
                  <ChevronUp className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-1" />
                </button>
              </motion.div>
            </div>

            {/* Enhanced Scroll Indicator - Right after buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-4"
            >
              <div className="relative w-6 h-12 mx-auto">
                <motion.div
                  className="absolute w-1 h-8 bg-yellow-400 rounded-full left-1/2 -translate-x-1/2"
                  animate={{
                    y: [0, 10],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="absolute bottom-0 left-1/2 w-2 h-2 -translate-x-1/2 bg-yellow-400 rounded-full opacity-70"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Styled Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              ref={drawerRef}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200,
                duration: 0.5 
              }}
              className="fixed bottom-0 left-0 right-0 z-50"
            >
              {/* Drawer Background with same design as hero */}
              <div className="relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1920&h=1500&fit=crop&crop=top" 
                    alt="Professional speaker" 
                    className="w-full h-full object-cover object-top opacity-90"
                    style={{ objectPosition: '50% 35%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60"></div>
                </div>

                {/* Drawer Content */}
                <div className="relative z-10 p-6 pb-8">
                  {/* Close Button */}
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Title */}
                  <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      Choisissez votre parcours
                    </h2>
                    <p className="text-gray-300 text-lg">
                      Découvrez nos solutions adaptées à votre entreprise
                    </p>
                  </div>

                  {/* Options */}
                  <div className="max-w-2xl mx-auto space-y-4">
                    {/* Option 1: Vous êtes client */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Link 
                        href="/login"
                        onClick={() => setIsDrawerOpen(false)}
                        className="block group"
                      >
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-6 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-[1.02]">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300">
                              <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <div className="flex-1 text-left">
                              <h3 className="text-xl font-semibold text-white mb-1">Vous êtes client ?</h3>
                              <p className="text-gray-300">Accédez à votre espace personnel et continuez votre formation</p>
                            </div>
                            <div className="w-3 h-3 bg-green-500 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>

                    {/* Option 2: Vous n'êtes pas client */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Link 
                        href="/entreprise-request"
                        onClick={() => setIsDrawerOpen(false)}
                        className="block group"
                      >
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-6 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-[1.02]">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300">
                              <UserPlus className="w-8 h-8 text-blue-400" />
                            </div>
                            <div className="flex-1 text-left">
                              <h3 className="text-xl font-semibold text-white mb-1">Vous n'êtes pas client ?</h3>
                              <p className="text-gray-300">Demandez un devis personnalisé pour votre entreprise</p>
                            </div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </div>

                  {/* Bottom Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 pt-6 border-t border-white border-opacity-20"
                  >
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-yellow-400">500+</div>
                        <div className="text-sm text-gray-400">Entreprises satisfaites</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-cyan-400">24h</div>
                        <div className="text-sm text-gray-400">Délai de réponse</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">98%</div>
                        <div className="text-sm text-gray-400">Taux de réussite</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


