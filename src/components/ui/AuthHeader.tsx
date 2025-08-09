import Link from 'next/link';
import Image from 'next/image';
import { Mic, ChevronDown, Globe, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AuthHeader() {
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/90 backdrop-blur-md border-b border-gray-800' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 relative">
                <Mic className="w-full h-full text-yellow-400 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                Pitch to Me
              </span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8
             ">
            <Link href="/features" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
              <Globe className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <div className="h-6 w-px bg-gray-700 mx-2"></div>
            <Link 
              href="/login" 
              className="text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-300 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none"
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
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-gray-900/95 backdrop-blur-md`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/features" className="text-gray-300 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Features
          </Link>
          <Link href="/pricing" className="text-gray-300 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Pricing
          </Link>
          <Link href="/about" className="text-gray-300 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-300 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
            Contact
          </Link>
          <div className="pt-4 pb-2 border-t border-gray-800">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-300 text-sm">Language</span>
              <button className="flex items-center text-gray-300 hover:text-white">
                <Globe className="w-5 h-5 mr-1" />
                <span className="text-sm">English</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-gray-300 text-sm">Theme</span>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center text-gray-300 hover:text-white"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400 mr-1" />
                ) : (
                  <Moon className="w-5 h-5 mr-1" />
                )}
                <span className="text-sm">{darkMode ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>
          </div>
          <div className="pt-2 space-y-2">
            <Link 
              href="/login" 
              className="w-full block text-center text-white bg-white/10 px-4 py-2 rounded-lg text-base font-medium hover:bg-white/20 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="w-full block text-center bg-yellow-400 text-black px-4 py-2 rounded-lg text-base font-medium hover:bg-yellow-300 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
