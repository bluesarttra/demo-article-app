'use client';

import { getStrapiMediaURL } from '../lib/api';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { formatDate } from '../lib/day';

/**
 * ArticlesCard Component
 * 
 * A reusable article card component that displays article information
 * with image, title, description, tags, and author.
 * 
 * @param {Object} article - Article data object
 * @param {number} index - Index of the article in the list (for gradient colors)
 * @param {string} className - Additional CSS classes
 * @param {Function} onCategoryClick - Callback function for category/tag clicks
 * @param {string} locale - Current locale for navigation
 * @param {Object} props - Additional props passed to the article element
 */
const ArticlesCard = ({
  article,
  index = 0,
  className = "",
  onCategoryClick,
  locale = 'en',
  ...props
}) => {
  if (!article) return null;

  const t = useTranslations('HomePage');
  const router = useRouter();

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

  // Get category name (handle both object and string formats)
  const categoryName = typeof article.category === 'object'
    ? article.category?.name
    : article.category;

  const articleImage = article.cover?.url
    ? getStrapiMediaURL(article.cover.url)
    : null;


  const handleClick = () => {
    window.location.href = `/${locale}/newsdesc/${article.slug}`;
  };

  const handleCategoryClick = (e) => {
    e.stopPropagation(); // Prevent the article click from firing
    if (categoryName) {
      // Get translated category name for URL
      const translatedCategoryName = getTranslatedCategoryName(categoryName);
      // Navigate to news list with category filter
      router.push(`/${locale}/newslist?category=${encodeURIComponent(translatedCategoryName)}`);
    }
  };

  return (
    <article
      className={`bg-white rounded-lg overflow-hidden transition-all duration-300 cursor-pointer relative h-full flex flex-col group border-b border-gray-200 ${className}`}
      onClick={handleClick}
      {...props}
    >
      {/* Category Capsule in top left */}
      {categoryName && (
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
              {getTranslatedCategoryName(categoryName)}
            </span>
      )}

      {articleImage ? (
        <div className="relative overflow-hidden aspect-[4/3] w-full">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundImage: `url(${articleImage})` }}
          >
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            {/* Hover overlay effect */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
          </div>
        </div>
      ) : (
        <div className={`relative overflow-hidden aspect-[3/4] w-full bg-gradient-to-r ${gradientColors[index % gradientColors.length]}`}>
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          {/* Hover overlay effect */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
        </div>
      )}

      <div className="p-6 flex flex-col justify-between flex-1">
        {/* Date */}
        <div className="mb-2">
          <span className="text-[#D7A048] text-base font-light">
            {article.publishedAt
              ? formatDate(article.publishedAt, locale, 'D MMM YYYY')
              : formatDate(new Date(), locale, 'D MMM YYYY')}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-4 transition-colors text-black line-clamp-2">
          {article.title}
        </h3>

        <div style={{ height: '2rem' }}></div>
        <button onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
          className="flex items-center space-x-3 group"
        >
          {/* วงกลม + */}
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#D7A048] group-hover:bg-[#E8B97B] text-white text-lg font-light transition-transform duration-200 group-hover:rotate-180">
            +
          </span>

          {/* ข้อความ */}
          <span className="text-[#D7A048] font-semibold text-lg text-[14px]">
            {t('readmore')}
          </span>
        </button>
      </div>
    </article>
  );
};

export default ArticlesCard;
