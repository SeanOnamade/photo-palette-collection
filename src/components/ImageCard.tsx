
import { useState, useEffect } from "react";

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
        // Lower threshold to trigger earlier (0.01 instead of 0.1)
        threshold: 0.01,
        // Adding rootMargin to load images before they enter the viewport
        rootMargin: "300px"
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

  return (
    <div 
      id={`image-${src.replace(/[^\w]/g, '-')}`}
      className={`group relative overflow-hidden rounded-md transition-all duration-500 cursor-pointer ${
        isInView ? "opacity-100" : "opacity-0 translate-y-4"
      }`}
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div 
          className={`absolute inset-0 bg-gray-100 ${isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        />
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover transition-all duration-700 ${
            isLoaded ? "scale-100 blur-0" : "scale-105 blur-md"
          } group-hover:scale-105`}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      {(title || category) && (
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

export default ImageCard;
