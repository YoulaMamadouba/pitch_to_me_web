'use client';

import Link from 'next/link';
import { Play, User, Building } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden flex flex-col">
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Transform Your Voice Into{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              Power
            </span>
          </h1>
          
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
                  href="/b2c" 
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-3 px-6 rounded-xl glow-effect hover:shadow-2xl transition-all flex items-center justify-center space-x-2 text-sm"
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
                <Link 
                  href="/b2b" 
                  className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-semibold py-3 px-6 rounded-xl neon-glow hover:shadow-2xl transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <Building className="w-5 h-5" />
                  <span>Je suis une entreprise</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-8 h-14">
            <motion.div
              className="absolute w-1 h-10 bg-yellow-400 rounded-full left-1/2 -translate-x-1/2"
              animate={{
                y: [0, 15],
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
    </section>
  );
}

