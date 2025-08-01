import { useState, useEffect, memo } from "react";
import { optimizeImageUrl, generateUltraResponsiveSrcSet, generateUltraPlaceholder, trackImagePerformance, createUltraFastObserver } from "@/lib/utils";

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

  // FIXED: Optimized image sources with conservative settings for reliability
  const thumbSrc = isInView ? generateUltraPlaceholder(src) : "";
  const mainSrc = isInView ? optimizeImageUrl(src, 800, 85, true) : ""; // Conservative quality for reliability
  const responsiveImages = generateUltraResponsiveSrcSet(src, true);

  /**
   * Preload the image once it's in view, and determine aspect ratio with performance tracking.
   */
  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();
    const img = new Image();
    img.src = mainSrc || src;

    img.onload = () => {
      setAspectRatio(img.height / img.width);
      setIsLoaded(true);
      
      // Track performance for optimization insights
      trackImagePerformance(src, startTime);
    };

    img.onerror = () => {
      console.warn('Image failed to load:', src);
      // Fallback to original source if optimized version fails
      if (img.src !== src) {
        img.src = src;
      }
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, isInView, mainSrc]);

  /**
   * Use optimized Intersection Observer to detect when the element is in view.
   */
  useEffect(() => {
    const observer = createUltraFastObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "300px", // Balanced loading distance for smooth scrolling
        threshold: 0.05 // Slightly higher threshold for better performance
      }
    );

    // Create a stable ID from the src
    const elementId = `image-${src.replace(/[^\w]/g, "-")}`;
    let currentElement = document.getElementById(elementId);

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      // Proper cleanup - get element again to ensure it exists
      const cleanupElement = document.getElementById(elementId);
      if (cleanupElement) {
        observer.unobserve(cleanupElement);
      }
      observer.disconnect(); // Ensure observer is fully cleaned up
    };
  }, [src]);

  return (
    <div
      id={`image-${src.replace(/[^\w]/g, "-")}`}
      className="group relative overflow-hidden cursor-pointer rounded-sm shadow-sm bg-gray-100"
      onClick={onClick}
      style={{
        // Reserve vertical space using the aspect ratio
        paddingBottom: `${aspectRatio * 100}%`,
        transition: "transform 0.3s ease, opacity 0.5s ease",
        opacity: isInView ? 1 : 0,
      }}
    >
      <div className="absolute inset-0 w-full h-full">
        {isInView && (
          <>
            {/* Ultra-low quality placeholder */}
            <img
              src={thumbSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
              style={{ opacity: isLoaded ? 0 : 1, filter: "blur(8px)" }}
              loading="lazy"
            />

            {/* Ultra-optimized main image with enhanced responsive support */}
            <img
              src={mainSrc}
              srcSet={responsiveImages.srcSet || undefined}
              sizes={responsiveImages.sizes || undefined}
              alt={alt}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: "scale(1.0)",
                filter: "brightness(1)",
              }}
              onLoad={() => setIsLoaded(true)}
              loading="lazy"
              decoding="async"
              fetchpriority="high"
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
          className="
            absolute bottom-0 left-0 right-0 
            bg-gradient-to-t from-black/70 to-transparent 
            p-4 translate-y-full opacity-0 
            transition-all duration-300 
            group-hover:translate-y-0 
            group-hover:opacity-100
          "
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

      {/* Decorative hover effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%)",
          transform: "scale(1.5)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default memo(ImageCard);
