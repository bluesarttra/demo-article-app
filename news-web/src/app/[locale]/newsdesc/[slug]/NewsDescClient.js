'use client';

import { LocaleSwitcher } from '@/components';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { getStrapiMediaURL } from '@/lib/api';
import { formatDate } from '@/lib/day';
import ShareBar from '@/components/ShareBar';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useArticles } from '@/hooks/useArticles';
import ArticlesCard from '@/components/ArticlesCard';
import ScrollShareBar from '@/components/ScrollShareBar';


export default function NewsDescClient({ article }) {
  // Locale management
  const locale = useLocale();
  const t = useTranslations('HomePage');
  const router = useRouter();

  // Gallery popup state
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Mobile gallery navigation state
  const [currentMobileImageIndex, setCurrentMobileImageIndex] = useState(0);
  
  // Mobile related articles navigation state
  const [currentRelatedArticleIndex, setCurrentRelatedArticleIndex] = useState(0);
  
  // Scroll share bar visibility state
  const [showScrollShareBar, setShowScrollShareBar] = useState(false);
  
  // Fetch all articles for the related articles section
  const { articles: allArticles, loading: articlesLoading, error: articlesError } = useArticles({
    pagination: { page: 1, pageSize: 6 },
    locale: locale
  });

  // Scroll detection for showing/hiding scroll share bar
  useEffect(() => {
    const handleScroll = () => {
      // Find the main article title (not the one in scroll share bar)
      const mainTitleElement = document.querySelector('main h1');
      const shareBarElement = document.querySelector('.share-bar');
      
      if (mainTitleElement && shareBarElement) {
        const titleRect = mainTitleElement.getBoundingClientRect();
        const shareBarRect = shareBarElement.getBoundingClientRect();
        
        // Show scroll share bar when both title and share bar are out of view
        const isTitleOutOfView = titleRect.bottom < 0;
        const isShareBarOutOfView = shareBarRect.bottom < 0;
        
        setShowScrollShareBar(isTitleOutOfView && isShareBarOutOfView);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper function to check if content is HTML
  const isHtml = (s) => /<\/?[a-z][\s\S]*>/i.test(s);

  // Function to get translated category name
  const getTranslatedCategoryName = (categoryName) => {
    const categoryMap = {
      'Health': t('healthbt'),
      'Geography': t('geographybt'),
      'Events & Updates': t('eventbt'),
      'Innovation': locale === 'th' ? 'นวัตกรรม' : 'Innovation',
      // Add more category mappings as needed
    };
    return categoryMap[categoryName] || categoryName;
  };

  // Get category name (handle both object and string formats)
  const categoryName = typeof article.category === 'object' 
    ? article.category?.name 
    : article.category;

  const articleImage = article.cover?.url ? getStrapiMediaURL(article.cover.url) : null;

  // Handle back button with locale-aware navigation
  const handleBackClick = () => {
    router.push(`/${locale}/newslist`);
  };

  const handleCategoryClick = (e) => {
    e.stopPropagation(); // Prevent the article click from firing
    if (categoryName) {
      // Navigate back to news list with category filter using translated name
      const translatedCategoryName = getTranslatedCategoryName(categoryName);
      router.push(`/${locale}/newslist?category=${encodeURIComponent(translatedCategoryName)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
        {/* Header with back button and locale switcher */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <button 
              onClick={handleBackClick}
              className="flex items-center text-[#D7A048] hover:text-[#E8B97B] transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {locale === 'th' ? 'กลับไปดูข่าว' : 'Back to News'}
            </button>
            
          </div>
        </header>

        {/* Main Article Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Article Header Section */}
          <div className="mb-8">
            {/* Category Tag */}
            <div className="mb-4">
              <span 
              onClick={handleCategoryClick}
              className="inline-block bg-white border border-gray-200 text-[#D7A048] px-4 py-2 rounded-full text-[16px] font-normal cursor-pointer hover:bg-[#D7A048] hover:text-white hover:border-[#D7A048] transition-all duration-200">
                {getTranslatedCategoryName(typeof article.category === 'object' ? article.category.name : article.category || 'Innovation')}
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
                  ? formatDate(article.publishedAt, locale, 'D MMM YYYY')
                  : formatDate(new Date(), locale, 'D MMM YYYY')
                }
              </div>

              {/* Share Section */}
              <ShareBar 
                url={typeof window !== 'undefined' ? window.location.href : ''}
                title={article?.title}
                className="share-bar"
              />
            </div>
          </div>

          {/* Hero Image */}
          <div className="mb-8">
            {articleImage ? (
              <div className="relative w-full aspect-[3/2] overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={articleImage}
                  alt={article.title || (locale === 'th' ? 'รูปภาพบทความ' : 'Article image')}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full aspect-[3/2] bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg shadow-lg flex items-center justify-center">
                <span className="text-white text-xl font-semibold">
                  {locale === 'th' ? 'ไม่มีรูปภาพ' : 'No Image Available'}
                </span>
              </div>
            )}
          </div>

        {/* Article Details Content */}
        {article.details && (
          <section className="mt-12">
            <div
              className="
        text-lg
        prose prose-lg max-w-none text-gray-900
        prose-headings:font-semibold prose-headings:text-gray-900
        prose-strong:text-gray-900
        prose-p:text-gray-900
        prose-li:text-gray-900
        whitespace-pre-wrap
      "
            >
              {isHtml(article.details) ? (
                <div dangerouslySetInnerHTML={{ __html: article.details }} />
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="mb-2" {...props} />
                    ),
                  }}
                >
                  {article.details}
                </ReactMarkdown>
                      )}
                    </div>
          </section>
        )}


         {/* Article Gallery */}
         {article.gallery && article.gallery.length > 0 && (
           <section className="mt-12">
             {/* Mobile: Show current image */}
             <div className="block sm:hidden">
               {article.gallery.length > 0 && (() => {
                 const currentFile = article.gallery[currentMobileImageIndex];
                 const fileUrl = currentFile?.url || currentFile?.attributes?.url;
                 const fileName = currentFile?.name || currentFile?.attributes?.name || `Gallery image ${currentMobileImageIndex + 1}`;
                 const altText = currentFile?.alternativeText || currentFile?.attributes?.alternativeText || fileName;

                 if (!fileUrl) return null;

                 return (
                   <div className="relative">
                     <div
                       className="rounded-2xl overflow-hidden shadow-lg cursor-pointer group transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                       onClick={() => {
                         setSelectedImage({
                           url: getStrapiMediaURL(fileUrl),
                           alt: altText,
                           name: fileName
                         });
                         setCurrentImageIndex(currentMobileImageIndex);
                       }}
                     >
                       <img
                         src={getStrapiMediaURL(fileUrl)}
                         alt={altText}
                         className="block w-full aspect-[4/3] object-cover transition-all duration-300 group-hover:brightness-110"
                         onError={(e) => {
                           console.error('Gallery image failed to load:', fileUrl);
                           e.target.style.display = 'none';
                         }}
                       />
                       {/* Hover overlay */}
                       <div 
                         className="absolute inset-0 transition-all duration-300 flex items-center justify-center"
                         style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
                         onMouseEnter={(e) => {
                           e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                         }}
                         onMouseLeave={(e) => {
                           e.target.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                         }}
                       >
                         <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                           </svg>
                         </div>
                       </div>
                     </div>

                        </div>
                      );
               })()}
             </div>

             {/* Desktop: Show grid */}
             <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-8">
              {article.gallery.map((file, index) => {
                            // Handle different file structure possibilities
                            const fileUrl = file?.url || file?.attributes?.url;
                const fileName = file?.name || file?.attributes?.name || `Gallery image ${index + 1}`;
                            const altText = file?.alternativeText || file?.attributes?.alternativeText || fileName;
                            
                            if (!fileUrl) {
                  console.warn('No URL found for gallery file:', file);
                              return null;
                            }
                            
                            return (
                  <div
                    key={index}
                    className="rounded-2xl overflow-hidden shadow-lg cursor-pointer group transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                     onClick={() => {
                       setSelectedImage({
                         url: getStrapiMediaURL(fileUrl),
                         alt: altText,
                         name: fileName
                       });
                       setCurrentImageIndex(index);
                     }}
                  >
                    <div className="relative">
                                <img 
                                  src={getStrapiMediaURL(fileUrl)}
                                  alt={altText}
                      className="block w-full aspect-[4/3] object-cover transition-all duration-300 group-hover:brightness-110"
                                  onError={(e) => {
                    console.error('Gallery image failed to load:', fileUrl);
                                    e.target.style.display = 'none';
                                  }}
                                />
                  {/* Hover overlay */}
                  <div 
                    className="absolute inset-0 transition-all duration-300 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                    }}
                  >
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                  </div>
                                </div>
                                </div>
                              </div>
                            );
                          }).filter(Boolean)}
                        </div>

             {/* Navigation arrows below gallery - Desktop only */}
             {article.gallery.length > 1 && (
               <div className="flex justify-end items-center gap-4 mt-6 hidden sm:flex">
                 {/* Left arrow */}
                 <button
                   className="w-14 h-14 bg-transparent border-2 border-gray-400 rounded-full flex items-center justify-center text-gray-400 opacity-30 cursor-not-allowed"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                   </svg>
                 </button>

                 {/* Right arrow */}
                 <button
                   className="w-14 h-14 bg-transparent border-2 border-gray-400 rounded-full flex items-center justify-center text-gray-400 opacity-30 cursor-not-allowed"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                 </button>
                      </div>
             )}

             {/* Navigation arrows below gallery - Mobile only */}
             {article.gallery.length > 1 && (
               <div className="flex items-center gap-4 mt-6 sm:hidden">
                 {/* Progress bar */}
                 <div className="flex-1 bg-gray-200 rounded-full h-2">
                   <div 
                     className="bg-[#D7A048] h-2 rounded-full transition-all duration-300" 
                     style={{ width: `${((currentMobileImageIndex + 1) / article.gallery.length) * 100}%` }}
                   ></div>
                </div>

                 {/* Left arrow */}
                 <button
                   onClick={() => {
                     if (currentMobileImageIndex > 0) {
                       setCurrentMobileImageIndex(currentMobileImageIndex - 1);
                     }
                   }}
                   className={`w-14 h-14 bg-transparent border-2 rounded-full flex items-center justify-center text-gray-400 transition-all ${
                     currentMobileImageIndex > 0 
                       ? 'border-[#D7A048] hover:bg-[#D7A048] cursor-pointer' 
                       : 'border-gray-400 opacity-30 cursor-not-allowed'
                   }`}
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                   </svg>
                 </button>

                 {/* Right arrow */}
                 <button
                   onClick={() => {
                     if (currentMobileImageIndex < article.gallery.length - 1) {
                       setCurrentMobileImageIndex(currentMobileImageIndex + 1);
                     }
                   }}
                   className={`w-14 h-14 bg-transparent border-2 rounded-full flex items-center justify-center text-gray-400 transition-all ${
                     currentMobileImageIndex < article.gallery.length - 1 
                       ? 'border-[#D7A048] hover:bg-[#D7A048] cursor-pointer' 
                       : 'border-gray-400 opacity-30 cursor-not-allowed'
                   }`}
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                 </button>
            </div>
          )}

             {/* Back to news list link */}
             <div className="pt-14 mt-8 flex items-center gap-2">
               <a
                 href={`/${locale}/newslist`}
                 className="inline-flex items-center text-[#D7A048] underline"
               >
                 <span className="font-medium">
                   {locale === 'th' ? 'รายการข่าว' : 'News List'}
                 </span>
               </a>
               <span className="text-[#D7A048] text-sm">•</span>
               <p className="text-sm text-gray-600">
               {article.title.length > 50 ? article.title.substring(0, 50) + '...' : article.title}
               </p>
             </div>
           </section>
         )}

      </main>

      {/* Related Articles Section - Separate Container */}
      <section className="py-16 pt-20">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {locale === 'th' ? 'บทความที่เกี่ยวข้อง' : 'Related Articles'}
            </h2>
            
            {articlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
              </div>
            ) : allArticles?.length > 0 ? (
              <>
                {/* Mobile: Show single article with water drops */}
                <div className="block md:hidden">
                  {(() => {
                    const filteredArticles = allArticles
                      .filter(relatedArticle => relatedArticle.id !== article.id)
                      .slice(0, 6);
                    
                    if (filteredArticles.length === 0) return null;
                    
                    const currentArticle = filteredArticles[currentRelatedArticleIndex];
                    
                    return (
                      <div>
                        <ArticlesCard
                          key={currentArticle.id}
                          article={currentArticle}
                          index={currentRelatedArticleIndex}
                          locale={locale}
                        />
                        
                        {/* Water drop indicators */}
                        {filteredArticles.length > 1 && (
                          <div className="flex justify-center gap-1 mt-6">
                            {filteredArticles.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentRelatedArticleIndex(index)}
                                className="p-1"
                                aria-label={`Go to article ${index + 1}`}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  className={`w-4 h-6 transition-colors ${
                                    index === currentRelatedArticleIndex
                                      ? "text-[#D7A048]"
                                      : "text-gray-400 cursor-pointer"
                                  }`}
                                  fill="currentColor"
                                >
                                  <path d="M12 2s-6 7.2-6 11.2C6 17.4 8.7 20 12 20s6-2.6 6-6.8C18 9.2 12 2 12 2z" />
                                </svg>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Desktop: Show grid */}
                <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {allArticles
                    .filter(relatedArticle => relatedArticle.id !== article.id) // Exclude current article
                    .slice(0, 6) // Show max 6 articles
                    .map((relatedArticle, index) => (
                      <ArticlesCard
                        key={relatedArticle.id}
                        article={relatedArticle}
                        index={index}
                        locale={locale}
                      />
              ))}
            </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {locale === 'th' ? 'ไม่พบบทความที่เกี่ยวข้อง' : 'No related articles found'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

       {/* Image Popup Modal */}
       {selectedImage && (
         <div
           className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
           onClick={() => setSelectedImage(null)}
         >
           <div className="relative w-full h-full flex items-center justify-center">
             {/* Close button */}
             <button
               onClick={() => setSelectedImage(null)}
               className="absolute top-4 right-4 z-10 w-10 h-10 bg-transparent rounded-lg flex items-center justify-center text-white hover:bg-white hover:border-white hover:text-[#D7A048] transition-all"
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>

             {/* Left arrow - Desktop only */}
             {article.gallery && article.gallery.length > 1 && (
               <button
                 onClick={(e) => {
                   if (currentImageIndex > 0) {
                     e.stopPropagation();
                     const prevIndex = currentImageIndex - 1;
                     const prevFile = article.gallery[prevIndex];
                     const prevFileUrl = prevFile?.url || prevFile?.attributes?.url;
                     const prevFileName = prevFile?.name || prevFile?.attributes?.name || `Gallery image ${prevIndex + 1}`;
                     const prevAltText = prevFile?.alternativeText || prevFile?.attributes?.alternativeText || prevFileName;
                     
                     setSelectedImage({
                       url: getStrapiMediaURL(prevFileUrl),
                       alt: prevAltText,
                       name: prevFileName
                     });
                     setCurrentImageIndex(prevIndex);
                   }
                 }}
                 className={`absolute left-4 z-10 w-14 h-14 bg-transparent border-2 border-white rounded-full flex items-center justify-center text-white transition-all group hidden sm:flex ${
                   currentImageIndex > 0 
                     ? 'hover:bg-[#D7A048] hover:border-white hover:w-15 hover:h-15 cursor-pointer' 
                     : 'opacity-30 cursor-not-allowed'
                 }`}
               >
                 <svg className="w-6 h-6 group-hover:w-7 group-hover:h-7 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                 </svg>
               </button>
             )}

             {/* Right arrow - Desktop only */}
             {article.gallery && article.gallery.length > 1 && (
               <button
                 onClick={(e) => {
                   if (currentImageIndex < article.gallery.length - 1) {
                     e.stopPropagation();
                     const nextIndex = currentImageIndex + 1;
                     const nextFile = article.gallery[nextIndex];
                     const nextFileUrl = nextFile?.url || nextFile?.attributes?.url;
                     const nextFileName = nextFile?.name || nextFile?.attributes?.name || `Gallery image ${nextIndex + 1}`;
                     const nextAltText = nextFile?.alternativeText || nextFile?.attributes?.alternativeText || nextFileName;
                     
                     setSelectedImage({
                       url: getStrapiMediaURL(nextFileUrl),
                       alt: nextAltText,
                       name: nextFileName
                     });
                     setCurrentImageIndex(nextIndex);
                   }
                 }}
                 className={`absolute right-4 z-10 w-14 h-14 bg-transparent border-2 border-white rounded-full flex items-center justify-center text-white transition-all group hidden sm:flex ${
                   currentImageIndex < article.gallery.length - 1 
                     ? 'hover:bg-[#D7A048] hover:border-white hover:w-15 hover:h-15 cursor-pointer' 
                     : 'opacity-30 cursor-not-allowed'
                 }`}
               >
                 <svg className="w-6 h-6 group-hover:w-7 group-hover:h-7 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                 </svg>
               </button>
             )}

             {/* Image */}
             <div className="w-full max-w-2xl aspect-[3/2] bg-gray-800 rounded-lg overflow-hidden mx-16">
               <img
                 src={selectedImage.url}
                 alt={selectedImage.alt}
                 className="w-full h-full object-cover"
                 onClick={(e) => e.stopPropagation()}
               />
                      </div>

             {/* Image indicator */}
             {article.gallery && article.gallery.length > 1 && (
               <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 translate-y-1/2 rounded-full px-6 py-3" style={{ background: 'rgba(32, 57, 76, .8)' }}>
                 <p className="text-white text-base font-medium">
                   {currentImageIndex + 1}/{article.gallery.length}
                 </p>
                    </div>
             )}

             {/* Mobile navigation arrows - below pagination */}
             {article.gallery && article.gallery.length > 1 && (
               <div className="absolute bottom-22 left-4 right-4 flex items-center justify-between sm:hidden">
                 {/* Left arrow */}
                 <button
                   onClick={(e) => {
                     if (currentImageIndex > 0) {
                       e.stopPropagation();
                       const prevIndex = currentImageIndex - 1;
                       const prevFile = article.gallery[prevIndex];
                       const prevFileUrl = prevFile?.url || prevFile?.attributes?.url;
                       const prevFileName = prevFile?.name || prevFile?.attributes?.name || `Gallery image ${prevIndex + 1}`;
                       const prevAltText = prevFile?.alternativeText || prevFile?.attributes?.alternativeText || prevFileName;
                       
                       setSelectedImage({
                         url: getStrapiMediaURL(prevFileUrl),
                         alt: prevAltText,
                         name: prevFileName
                       });
                       setCurrentImageIndex(prevIndex);
                     }
                   }}
                   className={`w-12 h-12 bg-transparent border-2 border-white rounded-full flex items-center justify-center text-white transition-all ${
                     currentImageIndex > 0 
                       ? 'cursor-pointer' 
                       : 'opacity-30 cursor-not-allowed'
                   }`}
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                   </svg>
                 </button>

                 {/* Right arrow */}
                 <button
                   onClick={(e) => {
                     if (currentImageIndex < article.gallery.length - 1) {
                       e.stopPropagation();
                       const nextIndex = currentImageIndex + 1;
                       const nextFile = article.gallery[nextIndex];
                       const nextFileUrl = nextFile?.url || nextFile?.attributes?.url;
                       const nextFileName = nextFile?.name || nextFile?.attributes?.name || `Gallery image ${nextIndex + 1}`;
                       const nextAltText = nextFile?.alternativeText || nextFile?.attributes?.alternativeText || nextFileName;
                       
                       setSelectedImage({
                         url: getStrapiMediaURL(nextFileUrl),
                         alt: nextAltText,
                         name: nextFileName
                       });
                       setCurrentImageIndex(nextIndex);
                     }
                   }}
                   className={`w-12 h-12 bg-transparent border-2 border-white rounded-full flex items-center justify-center text-white transition-all ${
                     currentImageIndex < article.gallery.length - 1 
                       ? 'cursor-pointer' 
                       : 'opacity-30 cursor-not-allowed'
                   }`}
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                   </svg>
                 </button>
                  </div>
             )}
              </div>
            </div>
          )}

        {/* Scroll Share Bar */}
        {showScrollShareBar && (
          <ScrollShareBar
            url={typeof window !== 'undefined' ? window.location.href : ''}
            title={article?.title}
          />
        )}
      </div>
  );
}

