import Link from 'next/link';
import { ArrowLeft, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthPageHeaderProps {
  pageTitle: string;
}

export default function AuthPageHeader({ pageTitle }: AuthPageHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-black/20 backdrop-blur-sm border-b border-gray-700">
      <Link 
        href="/" 
        className="text-white hover:text-yellow-400 transition-colors"
        aria-label="Retour à l'accueil"
      >
        <ArrowLeft className="w-6 h-6" />
      </Link>
      
      <div className="flex items-center space-x-2">
        <Mic className="w-5 h-5 text-yellow-400" />
        <span className="text-lg font-bold text-white">Pitch to Me</span>
      </div>
      
      <div className="text-white font-medium">
        {pageTitle}
      </div>
    </div>
  );
}
