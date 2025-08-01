import { useState, useEffect, memo } from "react";
import { createUltraFastObserver } from "@/lib/utils";

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
  const [hasBeenInView, setHasBeenInView] = useState(false); // 🔥 NEW: Persistent loading state
  const [aspectRatio, setAspectRatio] = useState(1); // Default to square

  // 🔥 OPTIMIZED: Only generate URLs when actually needed
  const shouldLoad = hasBeenInView || isInView; // Once loaded, stay loaded

  /**
   * Preload the image once it's in view, and determine aspect ratio with performance tracking.
   */
  useEffect(() => {
    if (!shouldLoad) return;

    // 🔥 OPTIMIZED: Simple, efficient image loading
    const img = new Image();
    img.src = src; // Use original source - simpler and faster

    img.onload = () => {
      setAspectRatio(img.height / img.width);
      setIsLoaded(true);
      // 🔥 OPTIMIZED: Removed performance tracking overhead
    };

    img.onerror = () => {
      // 🔥 OPTIMIZED: Silent fail - no console spam
      // Fallback to original source if optimized version fails
      if (img.src !== src) {
        img.src = src;
      }
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, shouldLoad]);

  /**
   * Use ultra-aggressive Intersection Observer for fast scrolling scenarios.
   * Once triggered, images stay loaded for smooth scrolling experience.
   */
  useEffect(() => {
    const observer = createUltraFastObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setHasBeenInView(true); // 🔥 NEW: Mark as permanently loaded
          // Don't disconnect! Keep observer alive for smooth scrolling
          // observer.disconnect(); // ❌ REMOVED: This was causing reload issues
        }
      },
      {
        rootMargin: "1500px", // 🔥 ULTRA-AGGRESSIVE: Huge margin for fast scrolling
        threshold: 0 // 🔥 MAXIMUM SENSITIVITY: Detect as soon as any pixel appears
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
        // 🔥 UNIFIED MOVEMENT: Reduce transitions for smoother unified scrolling
        transition: "opacity 0.2s ease", // Only opacity, faster transition
        opacity: shouldLoad ? 1 : 0,
      }}
    >
      <div className="absolute inset-0 w-full h-full">
        {shouldLoad && (
          <>
            {/* 🔥 SIMPLIFIED: Single optimized image - no overcomplicated responsive generation */}
            <img
              src={src} // Direct source - simpler and more reliable
              alt={alt}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
              style={{
                opacity: isLoaded ? 1 : 0,
              }}
              onLoad={() => setIsLoaded(true)}
              loading="lazy"
              decoding="async"
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
      {shouldLoad && (title || category) && (
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
