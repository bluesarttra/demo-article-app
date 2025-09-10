'use client';

import { useState } from 'react';
import { SearchInput, Banner, SearchAndSort, TagsCapsule } from '../components';
import { useArticles, useSearch, useArticlesWithSort } from '../hooks/useArticles';
import { getStrapiMediaURL } from '../lib/api';

export default function Home() {
  const [sortValue, setSortValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Fetch articles with sorting functionality
  const { articles, loading: articlesLoading, error: articlesError } = useArticlesWithSort(sortValue, searchQuery);

  // Search functionality
  const { articles: searchResults, loading: searchLoading } = useSearch(searchQuery);

  const handleSearch = (searchTerm) => {
    setSearchQuery(searchTerm);
    console.log('Searching for:', searchTerm);
  };

  const handleSortChange = (value) => {
    setSortValue(value);
    console.log('Sorting by:', value);
  };

  const handleTagChange = (tagValue) => {
    setSelectedTag(tagValue);
    console.log('Filtering by tag:', tagValue);
  };

  const sortOptions = [
    { value: '', label: 'Default Sort' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const tagOptions = [
    { value: '', label: 'All' },
    { value: 'Health', label: 'Health' },
    { value: 'Geography', label: 'Geography' },
    { value: 'Events & Updates', label: 'Events & Updates' },
  ];

  // Filter articles based on selected tag
  const filterArticlesByTag = (articlesList) => {
    if (!selectedTag) return articlesList; // Show all articles if no tag selected
    
    return articlesList?.filter(article => {
      // Check if article tags contain the selected tag (case-insensitive)
      const articleTags = article.tags?.toLowerCase() || '';
      const selectedTagLower = selectedTag.toLowerCase();
      
      // Debug logging
      if (selectedTag === 'Events & Updates') {
        console.log('Debug - Article tags:', article.tags);
        console.log('Debug - Article tags (lowercase):', articleTags);
        console.log('Debug - Selected tag (lowercase):', selectedTagLower);
      }
      
      // First try exact match
      if (articleTags === selectedTagLower) return true;
      
      // Then try splitting by commas and check for exact matches
      const tagArray = articleTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (tagArray.some(tag => tag === selectedTagLower)) return true;
      
      // Finally try partial matching for compound tags like "Events & Updates"
      return tagArray.some(tag => tag.includes(selectedTagLower));
    }) || [];
  };

  // Get the first article for banner background
  const featuredArticle = articles?.[0];
  const bannerImage = featuredArticle?.cover?.url 
    ? getStrapiMediaURL(featuredArticle.cover.url)
    : null;

  // Use search results if searching, otherwise use sorted articles, then apply tag filter
  const baseArticles = searchQuery ? searchResults : articles;
  const displayArticles = filterArticlesByTag(baseArticles);
  const isLoading = searchQuery ? searchLoading : articlesLoading;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner with Search */}
      <Banner 
        backgroundImage={bannerImage}
        className={`text-white ${!bannerImage ? 'bg-gradient-to-br from-blue-600 to-purple-700' : ''}`}
      >
        <div className="text-center space-y-6">
          {featuredArticle ? (
            <>
              <h1 className="text-5xl font-bold mb-4">{featuredArticle.title}</h1>
              <p className="text-xl mb-8">{featuredArticle.description}</p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-bold mb-4">Stay Informed</h1>
              <p className="text-xl mb-8">Discover the latest news, insights, and stories from around the world</p>
            </>
          )}
          
          {/* Search Input in the center of the banner */}
          <div className="flex justify-center">
            <SearchInput 
              placeholder="Search for news, topics, or keywords..." 
              onSearch={handleSearch}
              className="w-full max-w-2xl"
            />
          </div>
          
          <div className="flex justify-center space-x-4 mt-6">
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Categories
            </button>
            <button className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Latest News
            </button>
          </div>
        </div>
      </Banner>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Sort Controls */}
        <section className="mb-8">
          <SearchAndSort 
            sortOptions={sortOptions}
            sortValue={sortValue}
            onSortChange={handleSortChange}
            onSearch={handleSearch}
            searchPlaceholder="Search articles, topics, or keywords..."
            sortPlaceholder="Sort by..."
          />
        </section>

        {/* Tags Filter */}
        <section className="mb-12">
          <TagsCapsule 
            tags={tagOptions}
            selectedTag={selectedTag}
            onTagChange={handleTagChange}
            articles={articles}
          />
        </section>

        {/* Featured Articles Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : selectedTag 
                  ? `Articles tagged "${selectedTag}"` 
                  : 'Featured Articles'
              }
            </h2>
            <div className="text-sm text-gray-600">
              {sortValue && !searchQuery && (
                <span>Sorted by: {sortOptions.find(opt => opt.value === sortValue)?.label}</span>
              )}
              {selectedTag && !searchQuery && (
                <span className="ml-2">
                  {displayArticles.length} article{displayArticles.length !== 1 ? 's' : ''} found
                </span>
              )}
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : articlesError ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error loading articles: {articlesError}</p>
              <p className="text-gray-500">Make sure Strapi is running on http://localhost:1337</p>
            </div>
          ) : displayArticles?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayArticles.map((article, index) => {
                const articleImage = article.cover?.url 
                  ? getStrapiMediaURL(article.cover.url)
                  : null;
                
                const gradientColors = [
                  'from-blue-400 to-blue-600',
                  'from-green-400 to-green-600', 
                  'from-purple-400 to-purple-600',
                  'from-red-400 to-red-600',
                  'from-yellow-400 to-yellow-600',
                  'from-indigo-400 to-indigo-600'
                ];
                
                return (
                  <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {articleImage ? (
                      <div 
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${articleImage})` }}
                      ></div>
                    ) : (
                      <div className={`h-48 bg-gradient-to-r ${gradientColors[index % gradientColors.length]}`}></div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                      <p className="text-gray-600 mb-4">{article.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-600 font-medium">
                          {article.tags || 'No tags'}
                        </span>
                        <span className="text-gray-500">
                          {article.author?.name || 'Unknown Author'}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {selectedTag 
                  ? `No articles found with tag "${selectedTag}".` 
                  : searchQuery 
                    ? `No articles found for "${searchQuery}".` 
                    : 'No articles found.'
                }
              </p>
              {selectedTag && (
                <button 
                  onClick={() => setSelectedTag('')}
                  className="mt-4 text-blue-600 hover:text-blue-800 underline"
                >
                  Clear tag filter
                </button>
              )}
            </div>
          )}
        </section>

        {/* Categories Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-6 rounded-lg text-center hover:bg-blue-100 transition-colors cursor-pointer">
              <div className="text-2xl mb-2">🌍</div>
              <h3 className="font-semibold text-blue-900">World News</h3>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center hover:bg-green-100 transition-colors cursor-pointer">
              <div className="text-2xl mb-2">💻</div>
              <h3 className="font-semibold text-green-900">Technology</h3>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center hover:bg-purple-100 transition-colors cursor-pointer">
              <div className="text-2xl mb-2">💼</div>
              <h3 className="font-semibold text-purple-900">Business</h3>
            </div>
            <div className="bg-red-50 p-6 rounded-lg text-center hover:bg-red-100 transition-colors cursor-pointer">
              <div className="text-2xl mb-2">⚽</div>
              <h3 className="font-semibold text-red-900">Sports</h3>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6">Get the latest news delivered to your inbox</p>
          <div className="flex justify-center max-w-md mx-auto">
            <SearchInput 
              placeholder="Enter your email address..." 
              onSearch={(email) => console.log('Newsletter signup:', email)}
              className="w-full"
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">News Web</h3>
              <p className="text-gray-400">Your trusted source for the latest news and information.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">World News</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Technology</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Business</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sports</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 News Web. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
