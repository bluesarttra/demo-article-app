'use client';

import { useState, useEffect } from 'react';
import { SearchInput, Banner, SearchAndSort, TagsCapsule, ArticlesCard, LocaleSwitcher } from '../../components';
import { useArticles, useSearch, useArticlesWithSort } from '../../hooks/useArticles';
import { useLocale } from '../../hooks/useLocale';
import { getStrapiMediaURL } from '../../lib/api';

export default function NewsList() {
  const [sortValue, setSortValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Locale management
  const { locale, setLocale } = useLocale();

  // Fetch articles with sorting functionality
  const { articles, loading: articlesLoading, error: articlesError } = useArticlesWithSort(sortValue, searchQuery, locale);
  

  // Search functionality
  const { articles: searchResults, loading: searchLoading } = useSearch(searchQuery, locale);

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

  // Get articles with images for slider
  const articlesWithImages = articles?.filter(article => {
    console.log('Checking article:', article.title, 'Cover:', article.cover);
    return article.cover && article.cover.url;
  }) || [];
  
  // Auto-advance slider
  useEffect(() => {
    if (articlesWithImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % articlesWithImages.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [articlesWithImages.length]);

  const currentArticle = articlesWithImages[currentSlide] || articles?.[0];
  const bannerImage = currentArticle?.cover?.url 
    ? getStrapiMediaURL(currentArticle.cover.url)
    : null;

  // Debug logging
  console.log('Articles with images:', articlesWithImages.length);
  console.log('Current slide:', currentSlide);
  console.log('Current article:', currentArticle?.title);
  console.log('Banner image URL:', bannerImage);

  // Use search results if searching, otherwise use sorted articles, then apply tag filter
  const baseArticles = searchQuery ? searchResults : articles;
  const displayArticles = filterArticlesByTag(baseArticles);
  const isLoading = searchQuery ? searchLoading : articlesLoading;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner with Slider */}
      <div className="relative">
        <Banner 
          backgroundImage={bannerImage}
          className={`text-white transition-all duration-1000 ${!bannerImage ? 'bg-gradient-to-br from-blue-600 to-purple-700' : ''}`}
        >
          <div className="text-center space-y-6">
            {currentArticle ? (
              <>
                <h1 className="text-5xl font-bold mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.55)' }}>{currentArticle.title}</h1>
                <p className="text-xl mb-8" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.55)' }}>{currentArticle.description}</p>
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

        {/* Slider Controls */}
        {articlesWithImages.length > 1 && (
          <>
            {/* Previous/Next Buttons */}
            <button
              onClick={() => setCurrentSlide((prev) => prev === 0 ? articlesWithImages.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % articlesWithImages.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Slider Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {articlesWithImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-white' 
                      : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

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
            currentLocale={locale}
            onLocaleChange={setLocale}
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
              {displayArticles.map((article, index) => (
                <ArticlesCard 
                  key={article.id} 
                  article={article} 
                  index={index}
                />
              ))}
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

      </main>
    </div>
  );
}
