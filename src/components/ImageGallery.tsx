
import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ImageCard from "./ImageCard";

interface Image {
  src: string;
  alt: string;
  title?: string;
  category?: string;
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
  const chunkSize = 6; // Smaller chunks for smoother loading
  const loadingRef = useRef<HTMLDivElement>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Preload next and previous images when lightbox is open
  useEffect(() => {
    if (selectedImage && selectedIndex >= 0) {
      const nextIndex = (selectedIndex + 1) % images.length;
      const prevIndex = (selectedIndex - 1 + images.length) % images.length;
      
      // Preload next and previous images
      const nextImg = new Image();
      nextImg.src = images[nextIndex].src;
      
      const prevImg = new Image();
      prevImg.src = images[prevIndex].src;
    }
  }, [selectedImage, selectedIndex, images]);

  // Reset visible chunks when images change (e.g., when filtering)
  useEffect(() => {
    setVisibleChunks(1);
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

  // Progressive loading of more chunks as user scrolls
  useEffect(() => {
    // Use Intersection Observer for better performance
    const loadMoreImages = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        // Only load more if we haven't loaded all images yet
        if (visibleChunks * chunkSize < images.length) {
          setTimeout(() => {
            setVisibleChunks(prev => Math.min(prev + 1, Math.ceil(images.length / chunkSize)));
          }, 300); // Smaller delay for better UX
        }
      }
    };

    const observer = new IntersectionObserver(loadMoreImages, {
      rootMargin: '300px',
      threshold: 0.1
    });

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [visibleChunks, images.length, chunkSize]);

  // Get visible images for current chunk
  const visibleImages = useMemo(() => {
    return images.slice(0, visibleChunks * chunkSize);
  }, [images, visibleChunks, chunkSize]);

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

  // Organize images into columns for masonry layout
  const columnizedImages = useMemo(() => {
    if (columnCount <= 0) return [];
    
    const cols: Image[][] = Array.from({ length: columnCount }, () => []);
    
    visibleImages.forEach((image, i) => {
      // Distribute images evenly across columns
      cols[i % columnCount].push(image);
    });
    
    return cols;
  }, [columnCount, visibleImages]);

  // Animation classes for gallery items
  const getAnimationDelay = (columnIndex: number, imageIndex: number) => {
    const delay = columnIndex * 50 + imageIndex * 30;
    return `${delay}ms`;
  };

  return (
    <>
      {/* Gallery grid with improved animation and layout */}
      <div 
        ref={galleryRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
        style={{ opacity: images.length > 0 ? 1 : 0, transition: 'opacity 0.5s ease' }}
      >
        {columnizedImages.map((column, columnIndex) => (
          <div key={`column-${columnIndex}`} className="flex flex-col space-y-2">
            {column.map((image, imageIndex) => {
              // Calculate the global index
              const globalIndex = visibleImages.indexOf(image);
              return (
                <div 
                  key={`${image.src}-${imageIndex}`}
                  className="animate-fade-in"
                  style={{ animationDelay: getAnimationDelay(columnIndex, imageIndex) }}
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
      {visibleImages.length < images.length && (
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
