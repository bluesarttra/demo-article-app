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
        // Handle both object and string category formats
        const categoryName = typeof articleCategory === 'object' 
          ? articleCategory.name || articleCategory.title 
          : articleCategory;
        
        return categoryName === tagValue;
      }
      
      return false;
    }).length;
  };

  return (
    <div 
      className={`flex px-16 items-center gap-2 self-stretch ${className}`}
      {...props}
    >
      {tags.map((tag) => (
        <button
          key={tag.value}
          onClick={() => handleTagClick(tag.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border`}
          style={{
            backgroundColor: selectedTag === tag.value ? '#EDD3AB' : '#F3F4F6', // เทาอ่อน
            borderColor: selectedTag === tag.value ? '#D7A048' : '#D1D5DB',
            color: selectedTag === tag.value ? '#854700' : 'black', // border color: highlight or gray-300
            borderWidth: '2px',
            borderStyle: 'solid'
          }}
        >
          {tag.label}
          {tag.value && articles.length > 0 && (
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs`} style={{
              backgroundColor: selectedTag === tag.value ? '#D7A048' : '#c4c4c4', // เทาอ่อน
              color: selectedTag === tag.value ? 'white' : 'black' // สีตัวอักษร
            }}>
              {getTagCount(tag.value)}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TagsCapsule;
