'use client';

import { SearchInput, SortBox } from './index';

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
 * {function} onSortChange - Callback when sort selection changes
 * {function} onSearch - Callback when search is triggered
 * {string} searchPlaceholder - Placeholder text for search input
 * {string} sortPlaceholder - Placeholder text for sort box
 * {string} className - Additional CSS classes
 * {object} props - Additional props passed to the container div
 */
const SearchAndSort = ({ 
  sortOptions = [],
  sortValue = "",
  onSortChange,
  onSearch,
  searchPlaceholder = "Search...",
  sortPlaceholder = "Sort by...",
  className = "",
  ...props 
}) => {
  return (
    <div 
      className={`flex px-16 justify-between items-center self-stretch ${className}`}
      {...props}
    >
      {/* Search Input */}
      <div className="flex-1 max-w-2xl">
        <SearchInput 
          placeholder={searchPlaceholder}
          onSearch={onSearch}
          className="w-full"
        />
      </div>

      {/* Sort Box */}
      <div className="ml-4 flex items-center">
        <SortBox 
          options={sortOptions}
          value={sortValue}
          onChange={onSortChange}
          placeholder={sortPlaceholder}
        />
      </div>
    </div>
  );
};

export default SearchAndSort;
