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

  /**
   * Preload the image once it's in view, and determine aspect ratio.
   */
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setAspectRatio(img.height / img.width);
      setIsLoaded(true);
    };

    return () => {
      img.onload = null;
    };
  }, [src, isInView]);

  /**
   * Use Intersection Observer to detect when the element is in view.
   */
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
        rootMargin: "800px", // Start loading images well before they're visible
      }
    );

    // Create a stable ID from the src
    const elementId = `image-${src.replace(/[^\w]/g, "-")}`;
    const currentElement = document.getElementById(elementId);

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [src]);

  /**
   * For now, we simply return the original URL. 
   * If you want true local image resizing/compression,
   * you'd need a build step or a server to generate smaller images.
   */
  const generateOptimizedImageUrl = (url: string, _width: number, _quality: number): string => {
    // For local images, we can't convert format on the fly without a server or external service.
    return url;
  };

  // Low-quality placeholder
  const thumbSrc = isInView ? generateOptimizedImageUrl(src, 10, 5) : "";

  // Main image
  const mainSrc = isInView ? generateOptimizedImageUrl(src, 600, 80) : "";

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
            {/* Low-quality placeholder */}
            <img
              src={thumbSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              style={{ opacity: isLoaded ? 0 : 1, filter: "blur(10px)" }}
              loading="lazy"
            />

            {/* Main image */}
            <img
              src={mainSrc}
              alt={alt}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: "scale(1.0)",
                filter: "brightness(1)",
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
