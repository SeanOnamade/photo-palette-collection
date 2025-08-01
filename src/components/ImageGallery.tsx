import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ImageCard from "./ImageCard";
import { 
  preloadCriticalImagesAdvanced, 
  addCloudinaryPreconnectAdvanced,
  preloadImageDimensionsBatch,
  calculateOptimalMasonryColumns,
  optimizeImageUrl 
} from "@/lib/utils";

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
  const [dimensionsLoaded, setDimensionsLoaded] = useState<Record<string, boolean>>({});

  // Reset visible chunks when images change (e.g., when filtering)
  useEffect(() => {
    setVisibleChunks(1);
  }, [images]);

  // 🎯 SPIKE FIX: Smart dimension preloading for better masonry layout
  useEffect(() => {
    // Add enhanced Cloudinary preconnect with DNS prefetch for faster resolution
    addCloudinaryPreconnectAdvanced();
    
    // Preload first 8 images (above the fold) with critical priority
    const criticalImages = images.slice(0, Math.min(8, images.length)).map(img => img.src);
    
    if (criticalImages.length > 0) {
      // Use advanced preloading with high priority for critical images
      preloadCriticalImagesAdvanced(criticalImages, 'high');
      
      // START DIMENSION PRELOADING: Load dimensions for first 20 images immediately
      const firstBatchImages = images.slice(0, 20).map(img => img.src);
      preloadImageDimensionsBatch(firstBatchImages, 5, (loaded, total) => {
        // Track progress for better UX (optional)
        if (loaded % 5 === 0) { // Log every 5 images
          console.log(`📐 Loaded dimensions for ${loaded}/${total} images`);
        }
        
        // Update state to trigger masonry recalculation when dimensions are available
        setDimensionsLoaded(prev => ({
          ...prev,
          [`batch_${Math.floor(loaded/5)}`]: true
        }));
      }).catch(console.warn);
      
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
            
            // Load dimensions for new chunk
            const newChunkStart = visibleChunks * chunkSize;
            const newChunkEnd = Math.min(newChunkStart + chunkSize, images.length);
            const newChunkImages = images.slice(newChunkStart, newChunkEnd).map(img => img.src);
            
            if (newChunkImages.length > 0) {
              preloadImageDimensionsBatch(newChunkImages, 3).catch(console.warn);
            }
          }, 50); // 🔥 ULTRA-FAST: Minimal delay for rapid chunk loading during fast scrolling
        }
      }
    };

    const observer = new IntersectionObserver(loadMoreImages, {
      rootMargin: '1200px', // 🔥 INCREASED: Much larger margin for fast scrolling chunk loading
      threshold: 0.05 // 🔥 REDUCED: More sensitive to detect need for more images sooner
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
      
      // Preload next and previous images with optimization
      const nextImg = new Image();
      nextImg.src = optimizeImageUrl(images[nextIndex].src, 1600, 90);
      
      const prevImg = new Image();
      prevImg.src = optimizeImageUrl(images[prevIndex].src, 1600, 90);
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

  // 🎯 SPIKE-FIXING: Smart masonry layout using real dimensions when available
  const columnizedImages = useMemo(() => {
    // Use the enhanced calculator that leverages cached dimensions
    return calculateOptimalMasonryColumns(visibleImages, columnCount, true);
  }, [columnCount, visibleImages.length, dimensionsLoaded]); // Recalculate when dimensions load

  // 🔥 UNIFIED MOVEMENT: Remove staggered delays for smooth unified scrolling
  const getAnimationDelay = (columnIndex: number, imageIndex: number) => {
    // For smooth unified movement during scroll, minimize animation delays
    return '0ms'; // All items animate together for unified column movement
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
              // 🔥 UNIFIED MOVEMENT: Remove column transitions for synchronized scrolling
              // transition: 'transform 0.2s ease-out', // REMOVED: Caused staggered movement
              minHeight: '200px', // Prevent collapse during rebalancing
              willChange: 'transform' // 🔥 OPTIMIZED: Hint browser for smooth scrolling
            }}
          >
            {column.map((image, imageIndex) => {
              // Calculate the global index
              const globalIndex = visibleImages.indexOf(image);
              
              return (
                <div 
                  key={`${image.src}-${imageIndex}`}
                  // 🔥 UNIFIED MOVEMENT: Remove fade-in animation for synchronized scrolling
                  // className="animate-fade-in" // REMOVED: Caused staggered movement
                  style={{ 
                    // animationDelay: getAnimationDelay(columnIndex, imageIndex), // Already returns '0ms'
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
                  src={optimizeImageUrl(selectedImage.src, 1600, 90)}
                  alt={selectedImage.alt}
                  className="max-h-full max-w-full object-contain"
                  loading="eager"
                  fetchpriority="high"
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