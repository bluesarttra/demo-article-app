'use client';

import { useState, useEffect } from 'react';
import { LocaleSwitcher } from '../../../components';
import { useLocale } from '../../../hooks/useLocale';
import { getStrapiMediaURL } from '../../../lib/api';
import { generateArticleStructuredData } from '../../../lib/seo';

export default function NewsDescClient({ slug }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Locale management
  const { locale, setLocale } = useLocale();

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) {
        setError('No article slug provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('filters[slug][$eq]', slug);
        params.append('populate', '*');
        params.append('locale', locale);
        
        const response = await fetch(`http://localhost:1337/api/articles?${params}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
          setError('Article not found');
          setLoading(false);
          return;
        }
        
        let article = data.data[0];
        
        // Handle localization - if current locale doesn't match article locale, try to find localized version
        if (article.locale !== locale && article.localizations) {
          const localizedArticle = article.localizations.find(loc => loc.locale === locale);
          if (localizedArticle) {
            // Merge localized content with original article data (keep relations like cover, author, category)
            article = {
              ...article,
              ...localizedArticle,
              cover: article.cover,
              author: article.author,
              category: article.category,
              blocks: article.blocks,
            };
          }
        }
        
        setArticle(article);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, locale]);

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
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Go Back
          </button>
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
  const structuredData = generateArticleStructuredData(article);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
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
              <div className="relative w-full aspect-[3/2] overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={articleImage}
                  alt={article.title || 'Article image'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full aspect-[3/2] bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg shadow-lg flex items-center justify-center">
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

          {/* Article Blocks (Dynamic Content) */}
          {article.blocks && article.blocks.length > 0 && (
            <div className="mt-12">
              {article.blocks.map((block, index) => (
                <div key={index} className="text-gray-700 mb-8">
                  {block.__component === 'shared.rich-text' && (
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: block.body }}
                    />
                  )}
                  
                  {block.__component === 'shared.media' && (
                    <div className="my-8">
                      {block.file?.url && (
                        <img 
                          src={getStrapiMediaURL(block.file.url)}
                          alt={block.file.alternativeText || 'Article media'}
                          className="w-full rounded-lg shadow-lg"
                        />
                      )}
                    </div>
                  )}
                  
                  {block.__component === 'shared.quote' && (
                    <blockquote className="border-l-4 border-blue-500 pl-6 py-4 bg-gray-50 rounded-r-lg my-8">
                      <p className="text-lg italic text-gray-700 mb-2">{block.body}</p>
                      {block.author && (
                        <cite className="text-sm text-gray-600">— {block.author}</cite>
                      )}
                    </blockquote>
                  )}
                  
                  {block.__component === 'shared.slider' && (
                    <div className="my-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {block.files?.map((file, fileIndex) => (
                          <img 
                            key={fileIndex}
                            src={getStrapiMediaURL(file.url)}
                            alt={file.alternativeText || 'Slider image'}
                            className="w-full rounded-lg shadow-lg"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Article Meta Information */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {article.author && (
                <div className="flex items-center">
                  <span className="font-medium">By:</span>
                  <span className="ml-1">{article.author.name}</span>
                </div>
              )}
              
              {article.publishedAt && (
                <div className="flex items-center">
                  <span className="font-medium">Published:</span>
                  <span className="ml-1">
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
              
              {article.category && (
                <div className="flex items-center">
                  <span className="font-medium">Category:</span>
                  <span className="ml-1">{article.category.name}</span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
