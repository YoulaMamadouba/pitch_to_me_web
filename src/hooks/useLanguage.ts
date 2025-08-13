'use client';

import { useState, useEffect } from 'react';

export type Language = 'fr' | 'en';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('fr');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Récupérer la langue depuis localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    
    if (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) {
      console.log('Loading saved language:', savedLanguage);
      setLanguage(savedLanguage);
    } else {
      // Par défaut en français
      console.log('Setting default language to French');
      setLanguage('fr');
      localStorage.setItem('language', 'fr');
    }
    
    setIsLoaded(true);
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    console.log('Changing language from', language, 'to', newLanguage);
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    console.log('Language changed successfully to:', newLanguage);
  };

  return {
    language,
    changeLanguage,
    isLoaded
  };
}
