
import { useState, useEffect, memo } from "react";

interface ImageCardProps {
  src: string;
  alt: string;
  title?: string;
  category?: string;
  onClick?: () => void;
}

const ImageCard = ({ src, alt, title, category, onClick }: ImageCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1); // Default to square
  
  // Preload the image and determine aspect ratio
  useEffect(() => {
    if (!isInView) return;
    
    // Create a new image to preload and get dimensions
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      // Set aspect ratio from the image
      setAspectRatio(img.height / img.width);
      setIsLoaded(true);
    };
    
    return () => {
      img.onload = null;
    };
  }, [src, isInView]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.01,
        rootMargin: "500px" // Increased for better preloading
      }
    );
    
    const currentElement = document.getElementById(`image-${src.replace(/[^\w]/g, '-')}`);
    if (currentElement) {
      observer.observe(currentElement);
    }
    
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [src]);

  // Generate optimized image URLs with appropriate sizing
  const generateOptimizedImageUrl = (url: string, width: number, quality: number): string => {
    // If Unsplash image, use their optimization parameters
    if (url.includes('unsplash.com')) {
      return `${url}?w=${width}&q=${quality}&auto=format&fit=crop`;
    }
    return url;
  };

  // Create thumbnail URL for low-quality placeholder
  const thumbSrc = isInView ? generateOptimizedImageUrl(src, 20, 10) : '';
  
  // Main image URL with appropriate size based on viewport
  const mainSrc = isInView ? generateOptimizedImageUrl(src, 800, 75) : '';

  return (
    <div 
      id={`image-${src.replace(/[^\w]/g, '-')}`}
      className="group relative overflow-hidden cursor-pointer rounded-sm shadow-sm"
      onClick={onClick}
      style={{ 
        paddingBottom: `${aspectRatio * 100}%`,
        backgroundColor: '#f3f4f6',
        transition: 'transform 0.3s ease, opacity 0.5s ease',
        opacity: isInView ? 1 : 0
      }}
    >
      <div className="absolute inset-0 w-full h-full">
        {isInView && (
          <>
            {/* Low quality placeholder */}
            <img
              src={thumbSrc}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover absolute inset-0 transition-opacity duration-300"
              style={{ opacity: isLoaded ? 0 : 1, filter: 'blur(10px)' }}
              loading="lazy"
            />
            
            {/* Main image */}
            <img
              src={mainSrc}
              alt={alt}
              className="w-full h-full object-cover transition-all duration-300"
              style={{ 
                opacity: isLoaded ? 1 : 0,
                transform: 'scale(1.0)',
                filter: 'brightness(1)',
              }}
              onLoad={() => setIsLoaded(true)}
              loading="lazy"
            />
            
            {/* Overlay for hover effect */}
            <div 
              className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              aria-hidden="true"
            />
          </>
        )}
      </div>

      {/* Image info overlay */}
      {isInView && (title || category) && (
        <div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 
                    translate-y-full opacity-0 transition-all duration-300 
                    group-hover:translate-y-0 group-hover:opacity-100"
        >
          {category && (
            <span className="inline-block rounded bg-white/20 px-2 py-1 text-xs text-white mb-1 backdrop-blur-sm">
              {category}
            </span>
          )}
          {title && (
            <h3 className="text-white text-sm font-medium leading-tight line-clamp-2">
              {title}
            </h3>
          )}
        </div>
      )}

      {/* Hover effect - will be applied via CSS */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%)',
          transform: 'scale(1.5)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(ImageCard);
