'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchInput, Banner, SearchAndSort, TagsCapsule, ArticlesCard, LocaleSwitcher } from '../../../components';
import { useArticles, useSearch, useArticlesWithSort, useCategories } from '../../../hooks/useArticles';
import { useLocale } from 'next-intl';
import { getStrapiMediaURL } from '../../../lib/api';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/day';

export default function NewsListClient() {
  const [sortValue, setSortValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const  t  = useTranslations('HomePage');

  // Locale management
  const locale = useLocale();

  // Function to get translated category name (reverse mapping)
  const getOriginalCategoryName = (translatedName) => {
    const categoryMap = {
      [t('healthbt')]: 'Health',
      [t('geographybt')]: 'Geography', 
      [t('eventbt')]: 'Events & Updates',
      'นวัตกรรม': 'Innovation',
      'Innovation': 'Innovation',
      // Add more mappings as needed
    };
    return categoryMap[translatedName] || translatedName;
  };

  // Fetch articles with sorting functionality
  const { articles, loading: articlesLoading, error: articlesError } = useArticlesWithSort(sortValue, searchQuery, locale);

  // Fetch categories
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories(locale);

  // Search functionality
  const { articles: searchResults, loading: searchLoading } = useSearch(searchQuery, locale);

  // Handle category filter from URL query parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      // Convert translated category name back to original name for filtering
      const originalCategoryName = getOriginalCategoryName(categoryParam);
      setSelectedTag(originalCategoryName);
    }
  }, [searchParams, t]);

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
    { value: '', label: t('sort1') },
    { value: 'newest', label: t('sort2') },
    { value: 'oldest', label: t('sort3') },
    { value: 'title-asc', label: t('sort4') },
    { value: 'title-desc', label: t('sort5') },
    { value: 'popular', label: t('mostpop') }
  ];

  // Function to get translated category name
  const getTranslatedCategoryName = (categoryName) => {
    const categoryMap = {
      'Health': t('healthbt'),
      'Geography': t('geographybt'),
      'Events & Updates': t('eventbt'),
      // Add more category mappings as needed
    };
    return categoryMap[categoryName] || categoryName;
  };

  // Create tag options from categories, with "All" as the first option
  const tagOptions = [
    { value: '', label: t('allbt') },
    ...categories.map(category => ({
      value: category.name || category.title || category.id,
      label: getTranslatedCategoryName(category.name || category.title) || `Category ${category.id}`
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
        // Handle category relation object
        if (typeof articleCategory === 'object') {
          // Check if the category name, title, or id matches the selected category
          return articleCategory.name === selectedCategory ||
            articleCategory.title === selectedCategory ||
            articleCategory.id === selectedCategory;
        }
        // Handle string category format (fallback)
        return articleCategory === selectedCategory;
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
  const bannerImages = articlesWithImages.map(article =>
    article.cover?.url ? getStrapiMediaURL(article.cover.url) : null
  ).filter(Boolean);

  // Use search results if searching, otherwise use sorted articles, then apply tag filter
  const baseArticles = searchQuery ? searchResults : articles;
  const displayArticles = filterArticlesByTag(baseArticles);
  const isLoading = searchQuery ? searchLoading : articlesLoading;

  // Handle banner explore more click
  const handleBannerExploreClick = () => {
    if (currentArticle?.slug) {
      // Use locale-aware navigation
      router.push(`/${locale}/newsdesc/${currentArticle.slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner with Slider */}
      <div className="relative">
        <Banner
          images={bannerImages}
          currentSlide={currentSlide}
          className={`text-white relative ${bannerImages.length === 0 ? 'bg-gradient-to-br from-blue-600 to-purple-700' : ''}`}
        >
          {/* Content positioned in lower left - responsive */}
          <div className="absolute inset-x-0 bottom-22 md:bottom-6 lg:bottom-8">
            {/* container กลาง + ระยะซ้ายขวาแบบเดียวกับ main */}
            <div className="mx-auto w-full px-4 md:px-8 lg:px-16 max-w-7xl">
              {/* (ถ้าต้องการจำกัดความกว้างข้อความ) */}
              <div className="max-w-3xl">
                {/* Category tag */}
                <div className="mb-1 sm:mb-2">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      const categoryName = currentArticle?.category?.name || 'Sustainability';
                      const translatedCategoryName = getTranslatedCategoryName(categoryName);
                      router.push(`/${locale}/newslist?category=${encodeURIComponent(translatedCategoryName)}`);
                    }}
                    className="inline-block text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium tracking-wide bg-slate-900/30 backdrop-blur-md hover:bg-white hover:text-[#D7A048] hover:border-2 hover:border-[#D7A048] cursor-pointer transition-all duration-200">
                    {getTranslatedCategoryName(currentArticle?.category?.name || 'Sustainability')}
                  </span>
                </div>

                {/* Date */}
                <div className="mb-1 sm:mb-2">
                <span className="text-gray-200 text-base sm:text-lg">
                  {currentArticle?.publishedAt
                    ? formatDate(currentArticle.publishedAt, locale, 'D MMM YYYY')
                    : formatDate(new Date(), locale, 'D MMM YYYY')}
                </span>
                </div>

                {/* Title */}
                <h1 className="text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 leading-tight text-[#D7A048]">
                  {currentArticle?.title || 'Pioneering Sustainability Lubricants'}
                </h1>

                {/* CTA */}
                <button 
                  onClick={handleBannerExploreClick}
                  className="inline-flex items-center gap-2 sm:gap-3 whitespace-nowrap cursor-pointer group"
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full bg-[#D7A048] group-hover:bg-[#E8B97B] text-white text-xs sm:text-sm md:text-lg font-light transition-all duration-300">
                    <span className="group-hover:rotate-180 transition-transform duration-300">+</span>
                  </span>
                  <span className="text-[#D7A048] font-semibold text-sm sm:text-base md:text-lg">{t('readmore')}</span>
                </button>
              </div>
            </div>
          </div>
        </Banner>

        {/* Slider Controls */}
        {articlesWithImages.length > 1 && (
          <>
            {/* Previous/Next Buttons - responsive */}
            <button
              onClick={() => {
                if (currentSlide > 0) {
                  setCurrentSlide(currentSlide - 1);
                }
              }}
              className={`absolute left-2 md:left-4 bottom-6 lg:bottom-1/6 transform -translate-y-1/2 bg-[#D7A048] text-white p-2 md:p-3 rounded-full transition-all z-10 ${currentSlide === 0
                ? 'opacity-30 cursor-not-allowed'
                : 'bg-opacity-50 hover:bg-opacity-70 cursor-pointer'
                }`}
            >
              <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={() => {
                if (currentSlide < articlesWithImages.length - 1) {
                  setCurrentSlide(currentSlide + 1);
                }
              }}
              className={`absolute right-2 md:right-4 bottom-6 lg:bottom-1/6 transform -translate-y-1/2 bg-[#D7A048] text-white p-2 md:p-3 rounded-full transition-all z-10 ${currentSlide === articlesWithImages.length - 1
                ? 'opacity-30 cursor-not-allowed'
                : 'bg-opacity-50 hover:bg-opacity-70 cursor-pointer'
                }`}
            >
              <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Slider Indicators - droplet & clickable */}
            <div className="absolute bottom-6 md:bottom-5 left-1/2 -translate-x-1/2 flex gap-0.5 z-20">
              {articlesWithImages.map((_, index) => {
                const isActive = index === currentSlide;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className="p-0.5"
                  >
                    {/* svg water droplet*/}
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-4 h-6 md:w-5 md:h-7 transition-colors
            ${isActive
                          ? "text-[#D7A048]"
                          : "text-gray-400 cursor-pointer"
                        }`}
                      fill="currentColor"
                    >
                      {/* svg water droplet*/}
                      <path d="M12 2s-6 7.2-6 11.2C6 17.4 8.7 20 12 20s6-2.6 6-6.8C18 9.2 12 2 12 2z" />
                    </svg>
                  </button>
                );
              })}
            </div>

          </>
        )}
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="grid grid-cols-12 gap-y-8">
          {/* Search + Sort + Locale */}
          <div className="col-span-12">
            <SearchAndSort
              sortOptions={sortOptions}
              sortValue={sortValue}
              onSortChange={handleSortChange}
              onSearch={handleSearch}
     
            />
          </div>

          {/* Tags */}
          <div className="col-span-12">
            <TagsCapsule
              tags={tagOptions}
              selectedTag={selectedTag}
              onTagChange={handleTagChange}
              articles={articles}
            />
          </div>

          {/* Featured header + meta */}
          <div className="col-span-12">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {sortValue && !searchQuery && (
                  <span>Sorted by: {sortOptions.find(opt => opt.value === sortValue)?.label}</span>
                )}
                {selectedTag && !searchQuery && (
                  <span className="ml-2">
                    {displayArticles.length === 0 
                      ? t('noarticlesfound')
                      : `${displayArticles.length} ${displayArticles.length === 1 ? t('articlefound') : t('articlesfound')}`
                    }
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Grid บทความ */}
          <div className="col-span-12">
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
                    onCategoryClick={handleTagChange}
                    locale={locale}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {selectedTag
                    ? `${t('noarticleswithtag')} "${selectedTag}".`
                    : searchQuery
                      ? `${t('noarticlesforsearch')} "${searchQuery}".`
                      : t('noarticlesfound')
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
          </div>
        </div>

        {/* Pagination */}
        {displayArticles?.length > 0 && (
          <div className="col-span-12 mt-12">
            <div className="flex justify-between sm:justify-center items-center gap-4">
              {/* Previous Button */}
              <button
                className="text-gray-400 text-sm font-medium cursor-not-allowed"
                disabled
              >
                Prev
              </button>

              {/* Current Page */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 border border-gray-900 rounded flex items-center justify-center">
                  <span className="text-gray-900 text-sm font-medium">1</span>
                </div>
                <span className="text-gray-900 text-sm">of 1</span>
              </div>

              {/* Next Button */}
              <button
                className="text-gray-400 text-sm font-medium cursor-not-allowed"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

