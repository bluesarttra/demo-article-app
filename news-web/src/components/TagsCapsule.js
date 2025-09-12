'use client';

/**
 * TagsCapsule Component
 * 
 * A tags filter component built with Tailwind CSS that matches the specified design:
 * - display: flex
 * - padding: 0 64px
 * - align-items: center
 * - gap: 8px
 * - align-self: stretch
 * 
 * @param {Array} tags - Array of tag options with {value, label} structure
 * @param {string} selectedTag - Currently selected tag value
 * @param {function} onTagChange - Callback function when tag selection changes
 * @param {Array} articles - Array of articles for counting (optional)
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props passed to the container div
 */
const TagsCapsule = ({ 
  tags = [],
  selectedTag = '',
  onTagChange,
  articles = [],
  className = "",
  ...props 
}) => {
  const handleTagClick = (tagValue) => {
    if (onTagChange) {
      onTagChange(tagValue);
    }
  };

  // Helper function to count articles for a specific category
  const getTagCount = (tagValue) => {
    if (!tagValue || !articles.length) return 0;
    
    return articles.filter(article => {
      const articleCategory = article.category;
      
      if (articleCategory) {
        // Handle category relation object
        if (typeof articleCategory === 'object') {
          // Check if the category name matches the tag value
          return articleCategory.name === tagValue || 
                 articleCategory.title === tagValue ||
                 articleCategory.id === tagValue;
        }
        // Handle string category format (fallback)
        return articleCategory === tagValue;
      }
      
      return false;
    }).length;
  };

  return (
    <div 
      className={`flex flex-wrap items-center gap-4 self-stretch ${className}`}
      {...props}
    >
      {tags.map((tag) => (
        <button
          key={tag.value}
          onClick={() => handleTagClick(tag.value)}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base font-medium transition-all duration-200 border flex-shrink-0`}
          style={{
            backgroundColor: selectedTag === tag.value ? '#FFFFFF' : '#FFFFFF', // เทาอ่อน
            borderColor: selectedTag === tag.value ? '#D7A048' : '#D1D5DB',
            color: selectedTag === tag.value ? '#D7A048' : 'black', // border color: highlight or gray-300
            borderWidth: '2px',
            borderStyle: 'solid'
          }}
        >
          <span className="whitespace-nowrap">{tag.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TagsCapsule;
