"use client";

import { LocaleSwitcher, SearchInput, SortBox } from "./index";


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

      {/* Sort Box and Locale Switcher */}
      <div className="ml-4 flex items-center gap-3">
        <SortBox
          options={sortOptions}
          value={sortValue}
          onChange={onSortChange}
          placeholder={sortPlaceholder}
        />
        <LocaleSwitcher className="z-50" 
        currentLocale={currentLocale}
        onLocaleChange={onLocaleChange}
        />
      </div>
    </div>
  );
};

export default SearchAndSort;
