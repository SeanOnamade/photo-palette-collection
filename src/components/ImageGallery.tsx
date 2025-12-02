import { useState, useMemo, useEffect, useCallback, memo, useRef } from "react";
import ImageCard from "./ImageCard";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { optimizeImageUrl } from "@/lib/utils";

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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [columnCount, setColumnCount] = useState(columns);
  const [visibleCount, setVisibleCount] = useState(24); // Reduced to 24 for smoother scrolling
  const loadMoreRef = useRef<HTMLDivElement>(null);

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

  // Simple progressive loading - load more in batches with better throttling
  useEffect(() => {
    if (visibleCount >= images.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Load 20 images at a time (reduced from 30)
          setVisibleCount(prev => Math.min(prev + 20, images.length));
        }
      },
      { 
        rootMargin: '600px', // Reduced from 800px to prevent premature loading
        threshold: 0.01 // Only trigger when actually near
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, images.length]);

  // Preload first batch of images for instant display
  useEffect(() => {
    if (images.length === 0) return;
    
    // Preload only first 4 critical images (reduced from 8)
    const criticalImages = images.slice(0, 4);
    criticalImages.forEach((img, index) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.src;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
    });
    
    return () => {
      // Cleanup preload links when component unmounts
      document.querySelectorAll('link[rel="preload"][as="image"]').forEach(link => {
        if (criticalImages.some(img => img.src === link.getAttribute('href'))) {
          link.remove();
        }
      });
    };
  }, [images]);

  // Only show visible images for better initial load
  const visibleImages = useMemo(() => {
    return images.slice(0, visibleCount);
  }, [images, visibleCount]);

  // Simple masonry layout - distribute visible images evenly across columns
  const columnizedImages = useMemo(() => {
    const cols: Image[][] = Array.from({ length: columnCount }, () => []);
    
    // Simple round-robin distribution
    visibleImages.forEach((image, index) => {
      cols[index % columnCount].push(image);
    });
    
    return cols;
  }, [visibleImages, columnCount]);

  const openLightbox = useCallback((image: Image, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setSelectedIndex(-1);
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

  return (
    <>
      {/* Simple gallery grid with progressive loading */}
      <div className="w-full">
        <div className="flex gap-4 items-start">
          {columnizedImages.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className="flex-1 flex flex-col gap-4"
            >
              {column.map((image, imageIndex) => {
                const globalIndex = images.findIndex(img => img.src === image.src);
                // Mark first 4 images as priority for instant loading
                const isPriority = globalIndex < 4;
                return (
                  <ImageCard
                    key={`${image.src}-${imageIndex}`}
                    src={image.src}
                    alt={image.alt}
                    title={image.title}
                    category={image.category}
                    onClick={() => openLightbox(image, globalIndex)}
                    priority={isPriority}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Loading trigger - simple and clean */}
        {visibleCount < images.length && (
          <div ref={loadMoreRef} className="w-full py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}
      </div>

      {/* No results message */}
      {images.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No images found.</p>
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={closeLightbox}>
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
                  src={selectedImage.src.includes('cloudinary.com') 
                    ? selectedImage.src.replace('/upload/', '/upload/w_1920,q_85,f_auto/')
                    : selectedImage.src
                  }
                  alt={selectedImage.alt}
                  className="max-h-full max-w-full object-contain"
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

export default memo(ImageGallery);
