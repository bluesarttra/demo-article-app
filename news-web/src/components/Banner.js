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
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props passed to the container div
 */
const Banner = ({ 
  children, 
  backgroundImage,
  className = "",
  ...props 
}) => {
  const backgroundStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : {};

  return (
    <div 
      className={`w-full h-[400px] md:h-[500px] lg:h-[720px] flex-shrink-0 relative ${className}`}
      style={backgroundStyle}
      {...props}
    >
      {/* Overlay for better text readability when using background image */}
      {backgroundImage && (
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
