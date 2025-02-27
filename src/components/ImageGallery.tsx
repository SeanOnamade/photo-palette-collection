
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
  const chunkSize = 10; // Number of images to load per chunk

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
    const handleScroll = () => {
      if (!galleryRef.current) return;
      
      const bottom = galleryRef.current.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      
      // If we're approaching the bottom of the currently loaded images, load more
      if (bottom < windowHeight * 2) {
        setVisibleChunks(prev => Math.min(prev + 1, Math.ceil(images.length / chunkSize)));
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [images.length]);

  // Initial load of first chunk
  useEffect(() => {
    setVisibleChunks(1);
  }, []);

  // Get visible images for current chunk
  const visibleImages = useMemo(() => {
    return images.slice(0, visibleChunks * chunkSize);
  }, [images, visibleChunks, chunkSize]);

  const openLightbox = useCallback((image: Image, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
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
        setSelectedImage(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, navigateImage]);

  // Organize images into columns for masonry layout
  const columnizedImages = useMemo(() => {
    if (columnCount <= 0) return [];
    
    const cols: Image[][] = Array.from({ length: columnCount }, () => []);
    
    visibleImages.forEach((image, i) => {
      cols[i % columnCount].push(image);
    });
    
    return cols;
  }, [columnCount, visibleImages]);

  return (
    <>
      <div 
        ref={galleryRef}
        className="flex gap-1"
      >
        {columnizedImages.map((column, columnIndex) => (
          <div key={`column-${columnIndex}`} className="flex-1 flex flex-col gap-1">
            {column.map((image, imageIndex) => {
              // Calculate the global index
              const globalIndex = columnIndex + (imageIndex * columnCount);
              return (
                <ImageCard
                  key={`${image.src}-${imageIndex}`}
                  src={image.src}
                  alt={image.alt}
                  title={image.title}
                  category={image.category}
                  onClick={() => openLightbox(image, globalIndex)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Show loading indicator for more images */}
      {visibleImages.length < images.length && (
        <div className="flex justify-center py-8">
          <div className="animate-pulse flex space-x-4">
            <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
            <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
            <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      )}

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black border-none">
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
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-h-full max-w-full object-contain animate-image-fade-in"
                />
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-2 z-10 bg-black/50 rounded-full p-2 text-white hover:bg-black hover:text-white transition-colors"
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
