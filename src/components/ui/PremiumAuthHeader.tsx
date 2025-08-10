'use client';

import Link from 'next/link';
import { Mic, ChevronDown, Globe, Sun, Moon, Sparkles, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PremiumAuthHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants with proper typing
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        type: 'tween' as const
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: -10 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring' as const, 
        stiffness: 300, 
        damping: 24 
      } 
    }
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring' as const, stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/90 backdrop-blur-md border-b border-gray-700/50 shadow-xl' 
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with animation */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' as const }}
            className="flex-shrink-0 flex items-center"
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300 group-hover:duration-200"></div>
                <div className="relative w-9 h-9 bg-black rounded-full flex items-center justify-center border border-yellow-400/30 group-hover:border-yellow-400/50 transition-colors">
                  <Mic className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-400">
                Pitch to Me
              </span>
              <span className="ml-2 px-2 py-0.5 text-xs bg-gradient-to-r from-yellow-600 to-amber-700 text-white rounded-full border border-yellow-500/30 flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                PREMIUM
              </span>
            </Link>
          </motion.div>

          {/* Navigation Desktop */}
          <motion.nav 
            className="hidden md:flex items-center space-x-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {['Features', 'Pricing', 'About', 'Contact'].map((link) => (
              <motion.div key={link} variants={item}>
                <Link 
                  href={`/${link.toLowerCase()}`} 
                  className="relative text-gray-300 hover:text-white px-3 py-2 text-sm font-medium group transition-colors"
                >
                  {link}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Right side */}
          <motion.div 
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-1 bg-black/30 rounded-full px-3 py-1.5 border border-gray-700/50">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-xs font-medium text-green-400">SECURE</span>
            </div>
            
            <div className="h-6 w-px bg-gray-700 mx-1"></div>
            
            <Link 
              href="/login" 
              className="text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="relative overflow-hidden group bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-yellow-500/20 transition-all"
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatedMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </motion.header>
  );
}

// Separate animated mobile menu component
function AnimatedMenu({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const menuVariants = {
    open: { 
      height: 'auto',
      opacity: 1,
      transition: { 
        type: 'spring' as const,
        damping: 25,
        stiffness: 300
      }
    },
    closed: { 
      height: 0,
      opacity: 0,
      transition: { 
        type: 'spring' as const,
        damping: 25,
        stiffness: 300
      }
    }
  };

  const itemVariants = {
    open: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring' as const,
        stiffness: 300,
        damping: 24
      }
    },
    closed: { 
      y: -20, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className={`md:hidden bg-gradient-to-b from-black/95 to-gray-900/95 backdrop-blur-md overflow-hidden ${isOpen ? 'block' : 'hidden'}`}
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={menuVariants}
    >
      <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
        {['Features', 'Pricing', 'About', 'Contact'].map((link) => (
          <motion.div key={link} variants={itemVariants}>
            <Link 
              href={`/${link.toLowerCase()}`}
              onClick={onClose}
              className="block px-3 py-3 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white rounded-md transition-colors"
            >
              {link}
            </Link>
          </motion.div>
        ))}
        
        <motion.div className="pt-2 space-y-3 px-3" variants={itemVariants}>
          <Link 
            href="/login" 
            onClick={onClose}
            className="block w-full text-center text-white bg-white/10 px-4 py-3 rounded-lg text-base font-medium hover:bg-white/20 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/signup" 
            onClick={onClose}
            className="block w-full text-center bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-4 py-3 rounded-lg text-base font-semibold hover:shadow-lg hover:shadow-yellow-500/20 transition-all"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
