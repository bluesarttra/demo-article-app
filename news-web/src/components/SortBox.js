'use client';

import { useState } from 'react';

/**
 * SortBox Component
 * 
 * A sort selection component built with Tailwind CSS that matches the specified design:
 * - display: flex
 * - padding: 8px 16px
 * - align-items: center
 * - gap: 4px
 * 
 * @param {Array} options - Array of sort options with {value, label} structure
 * @param {string} value - Currently selected value
 * @param {function} onChange - Callback function when selection changes
 * @param {string} placeholder - Placeholder text for the select
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props passed to the container div
 */
const SortBox = ({ 
  options = [],
  value = "",
  onChange,
  placeholder = "Sort by...",
  className = "",
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const handleOptionClick = (optionValue) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    if (onChange) {
      onChange(optionValue);
    }
  };

  const selectedOption = options.find(option => option.value === selectedValue);

  return (
    <div 
      className={`flex px-4 py-2 items-center gap-1 ${className}`}
      {...props}
    >
      {/* Sort Label */}
      <span className="text-sm text-gray-600 font-medium">Sort:</span>
      
      {/* Custom Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px] h-10"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="text-left">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <ul className="py-1 text-sm text-gray-900" role="listbox">
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedValue === option.value ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                  role="option"
                  aria-selected={selectedValue === option.value}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SortBox;
