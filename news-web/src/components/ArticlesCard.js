'use client';

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
  ...props 
}) => {
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

  const handleClick = () => {
    window.location.href = `/newsdesc/${article.slug}`;
  };

  return (
    <article 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${className}`}
      onClick={handleClick}
      {...props}
    >
      {articleImage ? (
        <div 
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${articleImage})` }}
        ></div>
      ) : (
        <div className={`h-48 bg-gradient-to-r ${gradientColors[index % gradientColors.length]}`}></div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 transition-colors text-black hover:text-blue-600">
          {article.title}
        </h3>
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
};

export default ArticlesCard;
