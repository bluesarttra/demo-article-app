'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LocaleSwitcher } from '../../../components';
import { useLocale } from '../../../hooks/useLocale';
import { getStrapiMediaURL } from '../../../lib/api';

export default function NewsDesc() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const articleSlug = params.slug;
  
  // Locale management
  const { locale, setLocale } = useLocale();

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleSlug) {
        setError('No article slug provided');
        setLoading(false);
        return;
      }

        try {
          setLoading(true);
          // Use the list endpoint with slug filter and locale parameter
          const params = new URLSearchParams();
          params.append('filters[slug][$eq]', articleSlug);
          params.append('populate', '*');
          params.append('locale', locale); // Add locale parameter
          const response = await fetch(`http://localhost:1337/api/articles?${params}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          // Check if Strapi returned an error
          if (data.error) {
            throw new Error(data.error.message || 'Article not found');
          }
          
          if (!data.data || data.data.length === 0) {
            throw new Error('Article not found');
          }

          let article = data.data[0];
          
          // If the article locale doesn't match the requested locale, 
          // check if there's a localization available
          if (article.locale !== locale && article.localizations) {
            const localizedArticle = article.localizations.find(loc => loc.locale === locale);
            if (localizedArticle) {
              // Merge the localized content with the original article's media and other data
              article = {
                ...article,
                ...localizedArticle,
                cover: article.cover, // Keep original cover
                author: article.author, // Keep original author
                category: article.category, // Keep original category
                blocks: article.blocks, // Keep original blocks
              };
            }
          }

          setArticle(article); // Get the first (and should be only) article
      } catch (err) {
        setError(err.message);
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleSlug, locale]); // Add locale to dependencies

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading article: {error}</p>
          <p className="text-gray-500">Make sure Strapi is running on http://localhost:1337</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Article not found</p>
        </div>
      </div>
    );
  }

  const articleImage = article.cover?.url ? getStrapiMediaURL(article.cover.url) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header with back button */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to News
          </button>
          <LocaleSwitcher 
            currentLocale={locale}
            onLocaleChange={setLocale}
            className="z-50"
          />
        </div>
      </header>

      {/* Main Article Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Category Tag */}
        <div className="mb-6">
          <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
            {article.tags || 'News'}
          </span>
        </div>

        {/* Article Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
          {article.title}
        </h1>

        {/* Hero Image */}
        <div className="mb-8">
          {articleImage ? (
            <div 
              className="w-full h-96 md:h-[500px] bg-cover bg-center rounded-lg shadow-lg"
              style={{ backgroundImage: `url(${articleImage})` }}
            ></div>
          ) : (
            <div className="w-full h-96 md:h-[500px] bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg shadow-lg flex items-center justify-center">
              <span className="text-white text-xl font-semibold">No Image Available</span>
            </div>
          )}
        </div>

        {/* Article Description */}
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {article.description || 'No description available for this article.'}
          </div>
        </div>

        {/* Author Information */}
        {article.author && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                <span className="text-gray-600 font-semibold">
                  {article.author.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {article.author.name || 'Unknown Author'}
                </h3>
                <p className="text-gray-600 text-sm">Author</p>
              </div>
            </div>
          </div>
        )}

        {/* Additional Article Content */}
        {article.blocks && article.blocks.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Article Content</h2>
            <div className="prose prose-lg max-w-none">
              {article.blocks.map((block, index) => (
                <div key={index} className="mb-6">
                  {block.__component === 'shared.rich-text' && (
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: block.body }}
                    />
                  )}
                  {block.__component === 'shared.media' && block.file && (
                    <div className="my-6">
                      <img 
                        src={getStrapiMediaURL(block.file.url)} 
                        alt={block.file.alternativeText || 'Article image'}
                        className="w-full rounded-lg shadow-md"
                      />
                    </div>
                  )}
                  {block.__component === 'shared.quote' && (
                    <blockquote className="border-l-4 border-blue-500 pl-6 py-4 bg-gray-50 rounded-r-lg">
                      <p className="text-lg italic text-gray-700 mb-2">"{block.body}"</p>
                      {block.author && (
                        <cite className="text-sm text-gray-600">— {block.author}</cite>
                      )}
                    </blockquote>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
