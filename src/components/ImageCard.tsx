
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

  // Preload the image with a small version first when in view
  const imageSrc = isInView ? src : '';
  
  // Create low quality placeholder URL by adding sizing parameters
  const thumbSrc = isInView ? src + '&auto=format&fit=crop&w=100&q=10' : '';

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      id={`image-${src.replace(/[^\w]/g, '-')}`}
      className={`group relative overflow-hidden cursor-pointer transition-opacity duration-500 ${
        isInView ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClick}
    >
      <div className="relative w-full bg-gray-100">
        {isInView && (
          <>
            {/* Low quality placeholder */}
            <img
              src={thumbSrc}
              alt=""
              aria-hidden="true"
              className={`w-full object-cover absolute inset-0 ${isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              loading="lazy"
            />
            
            {/* Main image */}
            <img
              src={imageSrc}
              alt={alt}
              className={`w-full object-cover transition-opacity duration-500 ${
                isLoaded ? "opacity-100" : "opacity-0"
              } group-hover:scale-110 group-hover:brightness-110`}
              onLoad={handleLoad}
              loading="lazy"
              style={{ backgroundColor: '#f3f4f6' }}
            />
          </>
        )}
      </div>

      {isInView && (title || category) && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {category && (
            <span className="inline-block rounded bg-white/20 px-2 py-1 text-xs text-white mb-1 backdrop-blur-sm">
              {category}
            </span>
          )}
          {title && (
            <h3 className="text-white text-sm font-medium leading-tight">
              {title}
            </h3>
          )}
        </div>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ImageCard);
