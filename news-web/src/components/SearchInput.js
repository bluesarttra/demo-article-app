'use client';

import { useState } from 'react';

/**
 * SearchInput Component
 * 
 * A search input component built with Tailwind CSS that matches the specified design:
 * - display: flex
 * - width: 528px
 * - padding: 8px 16px
 * - align-items: center
 * - gap: 4px
 * - border-radius: 4px
 * - border: 1px solid gray
 * 
 * @param {string} placeholder - Placeholder text for the input
 * @param {function} onSearch - Callback function when search is triggered
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props passed to the container div
 */
const SearchInput = ({ 
  placeholder = "Search...", 
  onSearch, 
  className = "",
  ...props 
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchValue);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <div 
      className={`flex w-[528px] px-4 py-2 items-center gap-1 rounded border border-gray-300 bg-white focus-within:border-gray-400 transition-colors h-10 ${className}`} 
      {...props}
    >
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        aria-label="Search input"
        className="flex-1 border-none outline-none bg-transparent text-sm text-gray-900 placeholder-gray-500"
      />
      <button 
        type="button"
        onClick={handleSearchClick}
        aria-label="Search"
        className="w-4 h-4 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>
    </div>
  );
};

export default SearchInput;
