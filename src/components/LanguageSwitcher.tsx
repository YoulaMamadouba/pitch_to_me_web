'use client';

import { useLanguageContext } from '@/contexts/LanguageContext';
import Image from 'next/image';

export default function LanguageSwitcher() {
  const { language, changeLanguage, isLoading } = useLanguageContext();

  const languages = [
    {
      code: 'fr' as const,
      flag: 'https://flagcdn.com/w40/fr.png',
      alt: 'Drapeau français',
      name: 'Français'
    },
    {
      code: 'en' as const,
      flag: 'https://flagcdn.com/w40/gb.png',
      alt: 'Drapeau anglais',
      name: 'English'
    }
  ];

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          disabled={isLoading}
          className={`
            relative w-8 h-8 rounded-full border transition-all duration-200
            hover:scale-105 hover:border-white
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            ${language === lang.code 
              ? 'ring-2 ring-blue-400 border-white' 
              : 'border-white/20'
            }
          `}
          title={isLoading ? 'Chargement...' : lang.name}
        >
          <Image
            src={lang.flag}
            alt={lang.alt}
            width={32}
            height={32}
            className="rounded-full object-cover w-full h-full"
          />
        </button>
      ))}
    </div>
  );
}
