'use client';

import { useState } from 'react';
import { SearchInput, Banner, SortBox } from './index';

const AllComponentsExample = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortValue, setSortValue] = useState('');

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const handleSearch = (term) => {
    setSearchTerm(term);
    console.log('Searching for:', term);
  };

  const handleSort = (value) => {
    setSortValue(value);
    console.log('Sorting by:', value);
  };

  return (
    <div>
      {/* Hero Banner with Search */}
      <Banner className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold mb-4">All Components Demo</h1>
          <p className="text-lg mb-8">Search, sort, and explore with our custom components</p>
          
          <div className="flex justify-center">
            <SearchInput 
              placeholder="Search for content..." 
              onSearch={handleSearch}
              className="w-full max-w-xl"
            />
          </div>
        </div>
      </Banner>

      {/* Main Content with SortBox */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Controls Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Controls</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <SortBox 
              options={sortOptions}
              value={sortValue}
              onChange={handleSort}
              placeholder="Sort by..."
            />
            <div className="text-sm text-gray-600">
              Showing results for: <span className="font-semibold">{searchTerm || 'All content'}</span>
            </div>
          </div>
        </div>

        {/* Sample Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Sample Article {item}</h3>
              <p className="text-gray-600 text-sm mb-3">
                This is a sample article to demonstrate the components working together.
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Category: News</span>
                <span>2 hours ago</span>
              </div>
            </div>
          ))}
        </div>

        {/* Search Results Summary */}
        {(searchTerm || sortValue) && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Active Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Search: "{searchTerm}"
                </span>
              )}
              {sortValue && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Sort: {sortOptions.find(opt => opt.value === sortValue)?.label}
                </span>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllComponentsExample;
