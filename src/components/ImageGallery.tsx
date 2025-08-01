import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ImageCard from "./ImageCard";
import { preloadCriticalImagesAdvanced, addCloudinaryPreconnectAdvanced } from "@/lib/utils";

interface Image {
  src: string;
  alt: string;
  title?: string;
  category?: string;
  height?: number;
  width?: number;
}

interface ImageGalleryProps {
  images: Image[];
  columns?: number;
}

const ImageGallery = ({ images, columns = 3 }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [columnCount, setColumnCount] = useState(columns);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [visibleChunks, setVisibleChunks] = useState(1);
  const chunkSize = 10; // Increased chunk size for better initial load
  const loadingRef = useRef<HTMLDivElement>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Record<string, boolean>>({});

  // Reset visible chunks when images change (e.g., when filtering)
  useEffect(() => {
    setVisibleChunks(1);
  }, [images]);

  // ULTRA-AGGRESSIVE performance optimizations: enhanced preconnect and preload
  useEffect(() => {
    // Add enhanced Cloudinary preconnect with DNS prefetch for faster resolution
    addCloudinaryPreconnectAdvanced();
    
    // Preload first 8 images (above the fold) with ultra-aggressive settings
    const criticalImages = images.slice(0, Math.min(8, images.length)).map(img => img.src);
    
    if (criticalImages.length > 0) {
      // Use advanced preloading with high priority for critical images
      preloadCriticalImagesAdvanced(criticalImages, 'high');
      
      // Preload next batch with medium priority after a short delay
      const nextBatch = images.slice(8, 16).map(img => img.src);
      if (nextBatch.length > 0) {
        setTimeout(() => {
          preloadCriticalImagesAdvanced(nextBatch, 'medium');
        }, 1000);
      }
    }
  }, [images]);

  // Adjust columns based on viewport width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumnCount(1);
      } else if (width < 768) {
        setColumnCount(2);
      } else if (width < 1024) {
        setColumnCount(3);
      } else if (width < 1280) {
        setColumnCount(4);
      } else {
        setColumnCount(columns);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [columns]);

  // Memoize expensive calculations first - MUST be before useEffect that uses them
  const memoizedImageCount = useMemo(() => images.length, [images.length]);
  const memoizedChunkCount = useMemo(() => Math.ceil(memoizedImageCount / chunkSize), [memoizedImageCount, chunkSize]);

  // Progressive loading with optimized scroll performance and proper cleanup
  useEffect(() => {
    // Use useRef to persist timeout across renders and prevent memory leaks
    let loadingTimeout: number | undefined;
    
    const loadMoreImages = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        // Only load more if we haven't loaded all images yet
        if (visibleChunks * chunkSize < memoizedImageCount) {
          // Clear any pending load to prevent excessive calls during fast scroll
          if (loadingTimeout) {
            window.clearTimeout(loadingTimeout);
            loadingTimeout = undefined;
          }
          
          loadingTimeout = window.setTimeout(() => {
            setVisibleChunks(prev => Math.min(prev + 1, Math.ceil(images.length / chunkSize)));
            loadingTimeout = undefined;
          }, 150); // Reduced delay for better responsiveness
        }
      }
    };

    const observer = new IntersectionObserver(loadMoreImages, {
      rootMargin: '400px', // Reduced from 800px for better scroll performance
      threshold: 0.1 // Increased threshold to reduce sensitivity
    });

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      // Proper cleanup to prevent memory leaks
      if (loadingTimeout) {
        window.clearTimeout(loadingTimeout);
        loadingTimeout = undefined;
      }
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
      observer.disconnect(); // Ensure observer is fully cleaned up
    };
  }, [visibleChunks, memoizedImageCount, chunkSize]);

  // Get visible images for current chunk with memoization
  const visibleImages = useMemo(() => {
    return images.slice(0, visibleChunks * chunkSize);
  }, [images, visibleChunks, chunkSize]);

  // Preload next and previous images when lightbox is open
  useEffect(() => {
    if (selectedImage && selectedIndex >= 0) {
      const nextIndex = (selectedIndex + 1) % images.length;
      const prevIndex = (selectedIndex - 1 + images.length) % images.length;
      
      // Mark these images as needing preloading
      setPreloadedImages(prev => ({
        ...prev,
        [images[nextIndex].src]: true,
        [images[prevIndex].src]: true
      }));
      
      // Preload next and previous images
      const nextImg = new Image();
      nextImg.src = images[nextIndex].src;
      
      const prevImg = new Image();
      prevImg.src = images[prevIndex].src;
    }
  }, [selectedImage, selectedIndex, images]);

  const openLightbox = useCallback((image: Image, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    setIsLightboxOpen(true);
    // Disable scroll when lightbox is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setIsLightboxOpen(false);
    // Re-enable scroll when lightbox is closed
    document.body.style.overflow = '';
  }, []);

  const navigateImage = useCallback((direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' 
      ? (selectedIndex + 1) % images.length
      : (selectedIndex - 1 + images.length) % images.length;
    
    setSelectedImage(images[newIndex]);
    setSelectedIndex(newIndex);
  }, [selectedIndex, images]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (e.key === 'ArrowRight') {
        navigateImage('next');
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, navigateImage, closeLightbox]);

  // Stable masonry layout - prioritizes UX stability over perfect column balance
  // ONLY recalculates on major layout changes to prevent jarring reorganization
  const columnizedImages = useMemo(() => {
    if (columnCount <= 0 || visibleImages.length === 0) return [];
    
    // Simple, stable column distribution with minimal rebalancing
    const cols: Image[][] = Array.from({ length: columnCount }, () => []);
    const colHeights: number[] = Array(columnCount).fill(0);
    
    // Simple approach: Distribute images to shortest column (classic masonry)
    visibleImages.forEach((image, index) => {
      // For first batch, use round-robin for even start
      if (index < columnCount) {
        cols[index].push(image);
        colHeights[index] += 1.2; // Standard estimated height
        return;
      }
      
      // Find shortest column and add image there
      const shortestColumnIndex = colHeights.indexOf(Math.min(...colHeights));
      cols[shortestColumnIndex].push(image);
      
      // Simple height estimation based on position pattern
      const heightVariation = [1.0, 1.3, 0.9, 1.1, 1.4, 0.8, 1.2, 1.1];
      const estimatedHeight = heightVariation[index % heightVariation.length];
      colHeights[shortestColumnIndex] += estimatedHeight;
    });
    
    return cols;
  }, [columnCount, Math.floor(visibleImages.length / 10)]); // MUCH less frequent recalculation

  // Animation classes for gallery items
  const getAnimationDelay = (columnIndex: number, imageIndex: number) => {
    const delay = columnIndex * 50 + imageIndex * 30;
    return `${delay}ms`;
  };

  return (
    <>
      {/* Gallery grid with improved animation and balanced column heights */}
      <div 
        ref={galleryRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
        style={{ 
          opacity: images.length > 0 ? 1 : 0, 
          transition: 'opacity 0.5s ease',
          alignItems: 'start' // Ensure columns start at the same level
        }}
      >
        {columnizedImages.map((column, columnIndex) => (
          <div 
            key={`column-${columnIndex}`} 
            className="flex flex-col space-y-3"
            style={{
              // Reduced transitions during scroll for better performance
              transition: 'transform 0.2s ease-out',
              minHeight: '200px', // Prevent collapse during rebalancing
              willChange: 'auto' // Optimize for scroll performance
            }}
          >
            {column.map((image, imageIndex) => {
              // Calculate the global index
              const globalIndex = visibleImages.indexOf(image);
              
              return (
                <div 
                  key={`${image.src}-${imageIndex}`}
                  className="animate-fade-in"
                  style={{ 
                    animationDelay: getAnimationDelay(columnIndex, imageIndex),
                  }}
                >
                  <ImageCard
                    src={image.src}
                    alt={image.alt}
                    title={image.title}
                    category={image.category}
                    onClick={() => openLightbox(image, globalIndex)}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Show loading indicator for more images */}
      {visibleImages.length < memoizedImageCount && (
        <div ref={loadingRef} className="flex justify-center py-8">
          <div className="animate-pulse flex space-x-4">
            <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
            <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
            <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      )}

      {/* No results message when filtering returns empty */}
      {images.length === 0 && (
        <div className="text-center py-16">
          <p className="text-portfolio-muted text-lg">No images found in this category.</p>
          <p className="text-portfolio-muted mt-2">Try selecting a different filter.</p>
        </div>
      )}

      {/* Enhanced lightbox with preloading and smooth transitions */}
      <Dialog open={isLightboxOpen} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-none">
          {selectedImage && (
            <div className="flex flex-col h-full relative">
              <DialogClose className="absolute top-2 right-2 z-10 bg-black/50 rounded-full p-2 text-white hover:bg-black hover:text-white transition-colors">
                <X className="h-6 w-6" />
              </DialogClose>
              
              <div className="relative h-[80vh] w-full flex items-center justify-center">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-2 z-10 bg-black/50 rounded-full p-2 text-white hover:bg-black hover:text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-h-full max-w-full object-contain animate-fade-in"
                  style={{ maxHeight: '80vh' }}
                />
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-2 z-10 bg-black/50 rounded-full p-2 text-white hover:bg-black hover:text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
              
              {(selectedImage.title || selectedImage.category) && (
                <div className="p-4 bg-black text-white">
                  {selectedImage.category && (
                    <span className="inline-block rounded bg-white/20 px-2 py-1 text-xs text-white mb-1">
                      {selectedImage.category}
                    </span>
                  )}
                  {selectedImage.title && (
                    <h3 className="text-white text-lg font-medium">
                      {selectedImage.title}
                    </h3>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(ImageGallery);