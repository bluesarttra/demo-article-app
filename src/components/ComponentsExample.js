'use client';

import { SearchInput, Banner } from './index';

const ComponentsExample = () => {
  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  return (
    <div>
      {/* Banner with Search Input */}
      <Banner className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold mb-4">Find Your Perfect Content</h1>
          <p className="text-xl mb-8">Search through thousands of articles and resources</p>
          
          {/* Search Input in the center of the banner */}
          <div className="flex justify-center">
            <SearchInput 
              placeholder="Search articles, topics, or keywords..." 
              onSearch={handleSearch}
              className="w-full max-w-2xl"
            />
          </div>
          
          <div className="flex justify-center space-x-4 mt-6">
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Categories
            </button>
            <button className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              View All Articles
            </button>
          </div>
        </div>
      </Banner>

      {/* Additional content below banner */}
      <div className="p-8 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Latest News</h3>
            <p className="text-gray-600">Stay updated with the latest developments</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Popular Topics</h3>
            <p className="text-gray-600">Explore trending topics and discussions</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Expert Insights</h3>
            <p className="text-gray-600">Get insights from industry experts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentsExample;
