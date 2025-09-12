'use client';

import { useRouter } from 'next/navigation';
import { getStrapiMediaURL } from '../lib/api';

/**
 * ArticlesCard Component
 * 
 * A reusable article card component that displays article information
 * with image, title, description, tags, and author.
 * 
 * @param {Object} article - Article data object
 * @param {number} index - Index of the article in the list (for gradient colors)
 * @param {string} className - Additional CSS classes
 * @param {Object} props - Additional props passed to the article element
 */
const ArticlesCard = ({
  article,
  index = 0,
  className = "",
  onCategoryClick,
  ...props
}) => {
  const router = useRouter();

  if (!article) return null;

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

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/newsdesc/${article.slug}`);
  };

  const handleCardClick = () => {
    router.push(`/newsdesc/${article.slug}`);
  };

  const handleCategoryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCategoryClick && article.category) {
      const categoryName = typeof article.category === 'object' 
        ? article.category.name || article.category.title 
        : article.category;
      onCategoryClick(categoryName);
    }
  };

  return (
    <article
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${className}`}
      onClick={handleCardClick}
      {...props}
    >
      {articleImage ? (
        <div className="relative w-full aspect-[3/2] overflow-hidden">
          <img
            src={articleImage}
            alt={article.title || 'Article image'}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          {article.category && (
            <span
              onClick={handleCategoryClick}
              className="
               absolute top-3 left-3 z-10
               inline-flex items-center
               px-6 py-2 rounded-full text-base
               cursor-pointer
         
               /* พื้นหลังโปร่งใส + เบลอ */
               bg-slate-900/30 text-white
               backdrop-blur-md
               hover:bg-white hover:text-[#D7A048] hover:border-2 hover:border-[#D7A048]

               /* font-size */
               text-[15px]
               font-light
             "
            >
              {typeof article.category === 'object' ? article.category.name || article.category.title : article.category}
            </span>
          )}
        </div>

      ) : (
        <div className={`w-full aspect-[3/2] bg-gradient-to-r ${gradientColors[index % gradientColors.length]}`}></div>
      )}
      <div className="p-4 md:p-6">
        <span className="text-[#D7A048] text-base md:text-lg block mb-2 font-normal">
          {article?.publishedAt
            ? new Date(article.publishedAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
            : '23 July 2025'
          }
        </span>
        <h3 className="text-lg md:text-xl font-semibold mb-2 transition-colors text-black overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: '3.5rem' }}>
          {article.title}
        </h3>
        <div style={{ height: '2rem' }}></div>
        <button
          onClick={handleClick}
          className="flex items-center space-x-3 group"
        >
          {/* วงกลม + */}
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#D7A048] text-white text-lg font-light transition-transform duration-200 group-hover:scale-110">
            +
          </span>

          {/* ข้อความ */}
          <span className="text-[#D7A048] font-semibold text-lg group-hover:underline text-[14px]">
            Explore More
          </span>
        </button>
      </div>
    </article>
  );
};

export default ArticlesCard;
