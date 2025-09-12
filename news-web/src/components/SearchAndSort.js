'use client';

import { SearchInput, SortBox, LocaleSwitcher } from './index';

/**
 * SearchAndSort Component
 * 
 * A container component that aligns SearchInput and SortBox with the specified design:
 * - display: flex
 * - padding: 0 64px
 * - justify-content: space-between
 * - align-items: flex-start
 * - align-self: stretch
 * 
 * @param {Array} sortOptions - Array of sort options for the SortBox
 * @param {string} sortValue - Currently selected sort value
 * @param {function} onSortChange - Callback when sort selection changes
 * @param {function} onSearch - Callback when search is triggered
 * @param {string} searchPlaceholder - Placeholder text for search input
 * @param {string} sortPlaceholder - Placeholder text for sort box
 * @param {string} currentLocale - Currently selected locale
 * @param {function} onLocaleChange - Callback when locale changes
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props passed to the container div
 */
const SearchAndSort = ({ 
  sortOptions = [],
  sortValue = "",
  onSortChange,
  onSearch,
  searchPlaceholder = "Search...",
  sortPlaceholder = "Sort by...",
  currentLocale = "en",
  onLocaleChange,
  className = "",
  ...props 
}) => {
  return (
    <div 
      className={`flex flex-col lg:flex-row gap-4 lg:gap-0 lg:justify-between items-stretch lg:items-center self-stretch ${className}`}
      {...props}
    >
      {/* Search Input */}
      <div className="flex-1 max-w-full lg:max-w-2xl">
        <SearchInput 
          placeholder={searchPlaceholder}
          onSearch={onSearch}
          className="w-full"
        />
      </div>

      {/* Sort Box and Locale Switcher */}
      <div className="flex flex-row items-center w-full gap-3 lg:w-auto lg:ml-4">
        <SortBox 
          options={sortOptions}
          value={sortValue}
          onChange={onSortChange}
          placeholder={sortPlaceholder}
        />
        <LocaleSwitcher 
          currentLocale={currentLocale}
          onLocaleChange={onLocaleChange}
          className="z-50"
        />
      </div>
    </div>
  );
};

export default SearchAndSort;
