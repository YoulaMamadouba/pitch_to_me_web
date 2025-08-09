'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Globe, Menu, X, Mic } from 'lucide-react';

interface HeaderProps {
  showLanguageSelector?: boolean;
  showAuthButtons?: boolean;
}

export default function Header({ showLanguageSelector = true, showAuthButtons = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('FR');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-black border-b border-gray-800">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2 group">
        <div className="w-8 h-8 relative">
          <Mic className="w-full h-full text-yellow-400 group-hover:scale-110 transition-transform" />
        </div>
        <span className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
          Pitch to Me
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {showLanguageSelector && (
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-white" />
            <button 
              className="text-xs text-white bg-gray-700 px-2 py-1 rounded hover:bg-gray-600 transition-colors"
              onClick={() => setLanguage(language === 'FR' ? 'EN' : 'FR')}
            >
              {language}
            </button>
          </div>
        )}
        
        {showAuthButtons && (
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-white hover:text-yellow-400 transition-colors"
            >
              Connexion
            </Link>
            <Link 
              href="/signup" 
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Inscription
            </Link>
          </div>
        )}
      </nav>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black bg-opacity-95 backdrop-blur-sm md:hidden border-b border-gray-700">
          <div className="flex flex-col space-y-4 p-4">
            {showLanguageSelector && (
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-white" />
                <button 
                  className="text-xs text-white bg-gray-700 px-2 py-1 rounded"
                  onClick={() => setLanguage(language === 'FR' ? 'EN' : 'FR')}
                >
                  {language}
                </button>
              </div>
            )}
            
            {showAuthButtons && (
              <div className="flex flex-col space-y-2">
                <Link 
                  href="/login" 
                  className="text-white hover:text-yellow-400 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-lg font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

