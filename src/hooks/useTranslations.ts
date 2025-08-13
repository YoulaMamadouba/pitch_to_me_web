'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from './useLanguage';

export function useTranslations() {
  const { language, isLoaded } = useLanguage();
  const [translations, setTranslations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    const loadTranslations = async () => {
      console.log('Loading translations for language:', language);
      setIsLoading(true);
      try {
        const response = await fetch(`/locales/${language}.json?v=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Loaded translations for', language, ':', data);
          setTranslations(data);
        } else {
          console.error('Failed to load translations for', language);
        }
      } catch (error) {
        console.error('Error loading translations for', language, ':', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language, isLoaded]);

  const t = (key: string, params?: Record<string, any>) => {
    if (!translations || isLoading) return key;

    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value === 'string' && params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] || match;
      });
    }

    return value || key;
  };

  return {
    t,
    isLoading,
    language
  };
}
