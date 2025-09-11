'use client';

import { useState, useEffect } from 'react';

/**
 * LocaleSwitcher Component
 * 
 * A dropdown component that allows users to switch between different locales/languages.
 * Updates the current locale state and triggers a callback when changed.
 * 
 * @param {string} currentLocale - The currently selected locale (e.g., 'en', 'th')
 * @param {function} onLocaleChange - Callback function called when locale changes
 * @param {string} className - Additional CSS classes for styling
 * @param {object} props - Additional props passed to the component
 */
const LocaleSwitcher = ({ 
  currentLocale = 'en', 
  onLocaleChange, 
  className = "",
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Available locales with their display names and flags
  const locales = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'th', name: 'Thai', flag: '🇹🇭' }
  ];

  const currentLocaleData = locales.find(locale => locale.code === currentLocale) || locales[0];

  const handleLocaleSelect = (localeCode) => {
    if (localeCode !== currentLocale && onLocaleChange) {
      onLocaleChange(localeCode);
    }
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.locale-switcher')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative locale-switcher ${className}`} {...props}>
      {/* Current Locale Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-lg">{currentLocaleData.flag}</span>
        <span className="text-sm font-medium text-gray-700">{currentLocaleData.name}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {locales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => handleLocaleSelect(locale.code)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                locale.code === currentLocale 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{locale.flag}</span>
              <span className="text-sm font-medium">{locale.name}</span>
              {locale.code === currentLocale && (
                <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocaleSwitcher;
