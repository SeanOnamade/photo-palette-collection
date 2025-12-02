import { memo, useState, useEffect } from "react";

interface ImageCardProps {
  src: string;
  alt: string;
  title?: string;
  category?: string;
  onClick?: () => void;
  priority?: boolean; // For above-the-fold images
}

const ImageCard = memo(({ src, alt, title, category, onClick, priority = false }: ImageCardProps) => {
  const [isSharpLoaded, setIsSharpLoaded] = useState(false);
  
  // Generate ultra-tiny blur placeholder (20px, loads in ~100ms)
  const blurSrc = src.includes('cloudinary.com')
    ? src.replace('/upload/', '/upload/w_20,h_20,q_10,e_blur:1000,f_auto/')
    : src;
  
  // Generate optimized thumbnail (700px for better performance)
  const sharpSrc = src.includes('cloudinary.com')
    ? src.replace('/upload/', '/upload/w_700,q_65,f_auto/') // Reduced quality & size for smoother scrolling
    : src;

  return (
    <div
      className="group relative overflow-hidden rounded-lg cursor-pointer hover:opacity-90"
      onClick={onClick}
      style={{ 
        willChange: 'opacity',
        contain: 'layout style paint' // Performance hint for browser
      }}
    >
      {/* Blur placeholder - loads instantly */}
      <img
        src={blurSrc}
        alt=""
        aria-hidden="true"
        className="w-full h-auto object-cover absolute inset-0"
        style={{
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
          opacity: isSharpLoaded ? 0 : 1,
          transition: 'opacity 0.3s ease-out',
          pointerEvents: 'none' // Prevent interaction with blur layer
        }}
      />
      
      {/* Sharp image - fades in when ready */}
      <img
        src={sharpSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setIsSharpLoaded(true)}
        className="w-full h-auto object-cover relative"
        style={{
          opacity: isSharpLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-out'
        }}
      />
      
      {/* Simplified overlay - only shows on hover */}
      {(title || category) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
          <div>
            {category && (
              <span className="inline-block rounded bg-white/20 px-2 py-1 text-xs text-white mb-1">
                {category}
              </span>
            )}
            {title && (
              <h3 className="text-white text-sm font-medium">{title}</h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

ImageCard.displayName = "ImageCard";

export default ImageCard;
