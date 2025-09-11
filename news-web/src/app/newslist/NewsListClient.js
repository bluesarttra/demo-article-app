'use client';

import { useState, useEffect } from 'react';
import { SearchInput, Banner, SearchAndSort, TagsCapsule, ArticlesCard, LocaleSwitcher } from '../../components';
import { useArticles, useSearch, useArticlesWithSort, useCategories } from '../../hooks/useArticles';
import { useLocale } from '../../hooks/useLocale';
import { getStrapiMediaURL } from '../../lib/api';

export default function NewsListClient() {
  const [sortValue, setSortValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Locale management
  const { locale, setLocale } = useLocale();

  // Fetch articles with sorting functionality
  const { articles, loading: articlesLoading, error: articlesError } = useArticlesWithSort(sortValue, searchQuery, locale);
  
  // Fetch categories
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories(locale);

  // Search functionality
  const { articles: searchResults, loading: searchLoading } = useSearch(searchQuery, locale);

  const handleSearch = (searchTerm) => {
    setSearchQuery(searchTerm);
  };

  const handleSortChange = (value) => {
    setSortValue(value);
  };

  const handleTagChange = (tagValue) => {
    setSelectedTag(tagValue);
  };

  const sortOptions = [
    { value: '', label: 'Default Sort' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
    { value: 'popular', label: 'Most Popular' }
  ];

  // Create tag options from categories, with "All" as the first option
  const tagOptions = [
    { value: '', label: 'All' },
    ...categories.map(category => ({
      value: category.name || category.title || category.id,
      label: category.name || category.title || `Category ${category.id}`
    }))
  ];

  // Filter articles based on selected category
  const filterArticlesByTag = (articlesList) => {
    if (!selectedTag) return articlesList; // Show all articles if no tag selected
    
    return articlesList?.filter(article => {
      // Check if article category matches the selected category
      const articleCategory = article.category;
      const selectedCategory = selectedTag;
      
      
      // Check if article has a category and if it matches the selected category
      if (articleCategory) {
        // Handle both object and string category formats
        const categoryName = typeof articleCategory === 'object' 
          ? articleCategory.name || articleCategory.title 
          : articleCategory;
        
        return categoryName === selectedCategory;
      }
      
      return false;
    }) || [];
  };

  // Get articles with images for slider
  const articlesWithImages = articles?.filter(article => {
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
          className={`text-white transition-all duration-1000 relative ${!bannerImage ? 'bg-gradient-to-br from-blue-600 to-purple-700' : ''}`}
        >
          {/* Content positioned in lower left - responsive */}
          <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-auto md:max-w-2xl">
            {/* Semi-transparent overlay behind text */}
            <div className="rounded-lg">
              {/* Category tag */}
              <div className="mb-3 md:mb-4">
                <span 
                style={{ backgroundColor: '#D7A048' }}
                className="inline-block text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium uppercase tracking-wide">
                  {currentArticle?.tags || 'Sustainability'}
                </span>
              </div>
              
              {/* Date */}
              <div className="mb-2 md:mb-3">
                <span className="text-gray-200 text-xs md:text-sm">
                  {currentArticle?.publishedAt 
                    ? new Date(currentArticle.publishedAt).toLocaleDateString('en-US', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })
                    : '23 July 2025'
                  }
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 leading-tight">
                {currentArticle?.title || 'Pioneering Sustainability Lubricants'}
              </h1>
              
              {/* Read More Button */}
              <button 
                onClick={() => currentArticle && (window.location.href = `/newsdesc/${currentArticle.slug}`)}
                style={{ backgroundColor: '#D7A048' }}
                className="inline-flex items-center text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium transition-colors duration-200"
              >
                <span className="mr-2">+</span>
                Read More
              </button>
            </div>
          </div>
        </Banner>

        {/* Slider Controls */}
        {articlesWithImages.length > 1 && (
          <>
            {/* Previous/Next Buttons - responsive */}
            <button
              onClick={() => setCurrentSlide((prev) => prev === 0 ? articlesWithImages.length - 1 : prev - 1)}
              className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 md:p-3 rounded-full hover:bg-opacity-70 transition-all"
            >
              <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % articlesWithImages.length)}
              className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 md:p-3 rounded-full hover:bg-opacity-70 transition-all"
            >
              <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Slider Indicators - responsive */}
            <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-2">
              {articlesWithImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
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
