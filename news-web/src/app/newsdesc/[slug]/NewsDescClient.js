'use client';

import { LocaleSwitcher } from '../../../components';
import { useLocale } from '../../../hooks/useLocale';
import { getStrapiMediaURL } from '../../../lib/api';

export default function NewsDescClient({ article }) {
  // Locale management
  const { locale, setLocale } = useLocale();

  const articleImage = article.cover?.url ? getStrapiMediaURL(article.cover.url) : null;

  return (
    <div className="min-h-screen bg-white">
        {/* Header with back button */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center text-[#D7A048]"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to News
            </button>
          </div>
        </header>

        {/* Main Article Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Article Header Section */}
          <div className="mb-8">
            {/* Category Tag */}
            <div className="mb-4">
              <span className="inline-block bg-white border border-gray-200 text-[#D7A048] px-4 py-2 rounded-full text-[16px] font-normal">
                {typeof article.category === 'object' ? article.category.name : article.category || 'Innovation'}
              </span>
            </div>

            {/* Article Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Separator Line */}
            <div className="w-full h-px bg-gray-200 mb-6"></div>

            {/* Date and Share Section */}
            <div className="flex justify-between items-center">
              {/* Date */}
              <div className="text-[#D7A048] text-lg font-normal">
                {article.publishedAt 
                  ? new Date(article.publishedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })
                  : '12 Sep 2025'
                }
              </div>

              {/* Share Section */}
              <div className="flex items-center gap-3">
                <span className="text-gray-700 text-sm font-normal">Share:</span>
                <div className="flex items-center gap-2">
                  {/* Link Icon */}
                  <button className="w-8 h-8 bg-[#D7A048] rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </button>

                  {/* Facebook Icon */}
                  <button className="w-8 h-8 bg-[#D7A048] rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>

                  {/* X (Twitter) Icon */}
                  <button className="w-8 h-8 bg-[#D7A048] rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </button>

                  {/* LINE Icon */}
                  <button className="w-8 h-8 bg-[#D7A048] rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .63.285.63.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

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

          {/* Article Slider */}
          {article.slider && article.slider.files && article.slider.files.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {article.slider.files.map((file, index) => (
                  <div key={index} className="relative overflow-hidden rounded-lg shadow-lg">
                    <img 
                      src={getStrapiMediaURL(file.url)}
                      alt={file.alternativeText || `Gallery image ${index + 1}`}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
  );
}

