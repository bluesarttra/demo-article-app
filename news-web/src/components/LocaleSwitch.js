'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { usePathname, useRouter } from '../../i18n/navigation';
import { useTranslations, useLocale as useNextIntlLocale } from 'next-intl';

/**
 * LocaleSwitch Component
 * 
 * A dropdown component that allows users to switch between different locales/languages.
 * Uses next-intl routing for proper locale switching with URL updates.
 * 
 * @param {string} className - Additional CSS classes for styling
 * @param {object} props - Additional props passed to the component
 */
const LocaleSwitch = ({ 
  className = "",
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations('LocaleSwitcher');
  
  // Get locale from next-intl
  const currentLocale = useNextIntlLocale();

  // Available locales with their display names and flags
  const locales = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'th', name: 'Thai', flag: '🇹🇭' }
  ];

  const currentLocaleData = locales.find(locale => locale.code === currentLocale) || locales[0];

  const handleLocaleSelect = (localeCode) => {
    if (localeCode !== currentLocale) {
      startTransition(() => {
        router.replace(pathname, { locale: localeCode });
      });
    }
    setIsOpen(false);
  };


  // Prevent body scroll when modal is open on mobile only
  useEffect(() => {
    // Only prevent scrolling on mobile (below sm breakpoint)
    const isMobile = window.innerWidth < 640; // sm breakpoint is 640px
    
    if (isOpen && isMobile) {
      // Store current scroll position
      const scrollY = window.scrollY;
      // Prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else if (!isOpen && isMobile) {
      // Restore scrolling
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      // Restore scroll position
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    // Cleanup on unmount
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Close dropdown when clicking outside (desktop only)
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
        disabled={isPending}
        className={`flex items-center justify-between w-full space-x-2 px-4 py-2 bg-white border border-[#D7A048] rounded-lg shadow-sm h-12 ${
          isPending ? 'opacity-30 cursor-not-allowed' : ''
        }`}
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

      {/* Desktop Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50 overflow-hidden hidden sm:block">
          {locales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => handleLocaleSelect(locale.code)}
              disabled={isPending}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 transition-colors duration-200 ${
                locale.code === currentLocale 
                  ? 'bg-[#D7A048] text-white' 
                  : 'bg-white text-gray-700'
              } ${isPending ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <span className="text-lg">{locale.flag}</span>
              <span className="text-sm font-medium">{locale.name}</span>
              {locale.code === currentLocale && (
                <svg className="w-4 h-4 ml-auto text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>  
              )}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Modal */}
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 z-40 sm:hidden" 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-lg sm:hidden transform transition-transform duration-300 ease-out animate-[slideUp_0.3s_ease-out_forwards]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Language</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4">
              <ul className="space-y-2">
                {locales.map((locale) => (
                  <li
                    key={locale.code}
                    onClick={() => handleLocaleSelect(locale.code)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                      locale.code === currentLocale 
                        ? 'bg-[#D7A048] text-white' 
                        : 'hover:bg-gray-100 text-gray-900'
                    } ${isPending ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-lg">{locale.flag}</span>
                    <span className="text-sm font-medium">{locale.name}</span>
                    {locale.code === currentLocale && (
                      <svg className="w-4 h-4 ml-auto text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LocaleSwitch;