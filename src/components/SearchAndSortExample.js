'use client';

import { useState } from 'react';
import { SearchAndSort } from './index';

const SearchAndSortExample = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortValue, setSortValue] = useState('');

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'trending', label: 'Trending' }
  ];

  const handleSearch = (term) => {
    setSearchTerm(term);
    console.log('Searching for:', term);
  };

  const handleSortChange = (value) => {
    setSortValue(value);
    console.log('Sorting by:', value);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>SearchAndSort Component Examples</h2>
      
      {/* Basic SearchAndSort */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Basic SearchAndSort Layout:</h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          <SearchAndSort 
            sortOptions={sortOptions}
            sortValue={sortValue}
            onSortChange={handleSortChange}
            onSearch={handleSearch}
            searchPlaceholder="Search articles..."
            sortPlaceholder="Sort by..."
          />
        </div>
      </div>

      {/* SearchAndSort with different styling */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Custom Styled SearchAndSort:</h3>
        <div className="bg-blue-50 p-6 rounded-lg">
          <SearchAndSort 
            sortOptions={sortOptions}
            sortValue={sortValue}
            onSortChange={handleSortChange}
            onSearch={handleSearch}
            searchPlaceholder="Find content..."
            sortPlaceholder="Filter by..."
            className="bg-white p-4 rounded-lg shadow-sm"
          />
        </div>
      </div>

      {/* SearchAndSort in a banner context */}
      <div style={{ marginBottom: '30px' }}>
        <h3>SearchAndSort in Banner Context:</h3>
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg">
          <div className="mb-4">
            <h4 className="text-xl font-bold mb-2">Search and Filter Content</h4>
            <p className="text-purple-100">Use the search and sort controls below to find exactly what you're looking for.</p>
          </div>
          <SearchAndSort 
            sortOptions={sortOptions}
            sortValue={sortValue}
            onSortChange={handleSortChange}
            onSearch={handleSearch}
            searchPlaceholder="Search in purple theme..."
            sortPlaceholder="Sort options..."
            className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-2"
          />
        </div>
      </div>

      {/* Responsive SearchAndSort */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Responsive SearchAndSort:</h3>
        <div className="bg-gray-100 p-6 rounded-lg">
          <SearchAndSort 
            sortOptions={sortOptions}
            sortValue={sortValue}
            onSortChange={handleSortChange}
            onSearch={handleSearch}
            searchPlaceholder="Responsive search..."
            sortPlaceholder="Responsive sort..."
            className="flex-col sm:flex-row gap-4 sm:gap-0"
          />
        </div>
      </div>

      {/* Current state display */}
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h4 className="font-semibold mb-2">Current State:</h4>
        <div className="space-y-1 text-sm">
          <p><strong>Search Term:</strong> {searchTerm || 'None'}</p>
          <p><strong>Sort Value:</strong> {sortValue || 'None'}</p>
          <p><strong>Selected Sort Label:</strong> {sortOptions.find(opt => opt.value === sortValue)?.label || 'None'}</p>
        </div>
      </div>
    </div>
  );
};

export default SearchAndSortExample;
