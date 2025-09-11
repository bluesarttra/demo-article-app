'use client';

import { useState, useEffect } from 'react';

/**
 * useLocale Hook
 * 
 * A custom hook that manages locale state with localStorage persistence.
 * Provides current locale and a function to change locale.
 * 
 * @param {string} defaultLocale - The default locale to use (defaults to 'en')
 * @returns {object} - { locale, setLocale, isLoading }
 */
export function useLocale(defaultLocale = 'en') {
  const [locale, setLocaleState] = useState(defaultLocale);
  const [isLoading, setIsLoading] = useState(true);

  // Load locale from localStorage on mount
  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem('news-app-locale');
      if (savedLocale) {
        setLocaleState(savedLocale);
      }
    } catch (error) {
      console.warn('Failed to load locale from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save locale to localStorage when it changes
  const setLocale = (newLocale) => {
    try {
      setLocaleState(newLocale);
      localStorage.setItem('news-app-locale', newLocale);
      
      // Dispatch custom event for other components to listen to
      window.dispatchEvent(new CustomEvent('localeChanged', { 
        detail: { locale: newLocale } 
      }));
    } catch (error) {
      console.warn('Failed to save locale to localStorage:', error);
    }
  };

  return { locale, setLocale, isLoading };
}

/**
 * useLocaleChange Hook
 * 
 * A hook that listens for locale changes and executes a callback.
 * Useful for components that need to react to locale changes.
 * 
 * @param {function} callback - Function to call when locale changes
 * @param {array} deps - Dependencies array for the callback
 */
export function useLocaleChange(callback, deps = []) {
  useEffect(() => {
    const handleLocaleChange = (event) => {
      callback(event.detail.locale);
    };

    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, deps);
}
