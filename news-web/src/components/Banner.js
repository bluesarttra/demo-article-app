'use client';

/**
 * Banner Component
 * 
 * A banner component built with Tailwind CSS that matches the specified design:
 * - display: flex
 * - width: 1440px
 * - height: 720px
 * - justify-content: center
 * - align-items: center
 * - flex-shrink: 0
 * 
 * @param {React.ReactNode} children - Content to display inside the banner
 * @param {string} backgroundImage - URL for background image
 * @param {Array} images - Array of images for slider
 * @param {number} currentSlide - Current slide index
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props passed to the container div
 */
const Banner = ({ 
  children, 
  backgroundImage,
  images = [],
  currentSlide = 0,
  className = "",
  ...props 
}) => {
  // Use images array if provided, otherwise fall back to single backgroundImage
  const displayImages = images.length > 0 ? images : (backgroundImage ? [backgroundImage] : []);
  
  const backgroundStyle = !displayImages.length ? {} : {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div 
      className={`w-full h-[400px] md:h-[500px] lg:h-[720px] flex-shrink-0 relative overflow-hidden ${className}`}
      style={backgroundStyle}
      {...props}
    >
      {/* Image slider with slide right animation */}
      {displayImages.length > 0 && (
       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
                index === currentSlide 
                  ? 'translate-x-0' 
                  : index < currentSlide 
                    ? '-translate-x-full' 
                    : 'translate-x-full'
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          ))}
        </div>
      )}
      
      {/* Overlay for better text readability when using background image */}
      {displayImages.length > 0 && (
        <div className="absolute inset-0"></div>
      )}
      
      {/* Content container - children now handle their own positioning */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default Banner;
