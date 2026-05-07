import { useState, useMemo, useEffect, useCallback, memo, useRef } from "react";
import ImageCard from "./ImageCard";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { optimizeImageUrl } from "@/lib/utils";

interface Image {
  src: string;
  aspectRatio?: number; // width / height — used by shortest-column-first masonry
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
  const [lightboxLoading, setLightboxLoading] = useState(false);
  const [columnCount, setColumnCount] = useState(columns);
  const [visibleCount, setVisibleCount] = useState(12);
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
          setVisibleCount(prev => Math.min(prev + 12, images.length));
        }
      },
      { 
        rootMargin: '200px', // Reduced: don't aggressively pre-fetch huge images
        threshold: 0.01
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, images.length]);

  // Preload the first 4 critical images — use the optimized Cloudinary thumbnail URL,
  // not the raw src, to avoid preloading 35 MB local files
  useEffect(() => {
    if (images.length === 0) return;

    const criticalImages = images.slice(0, 4);
    const links: HTMLLinkElement[] = criticalImages.map((img) => {
      const optimizedHref = img.src.includes("cloudinary.com")
        ? img.src.replace("/upload/", "/upload/w_700,q_65,f_auto/")
        : img.src;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = optimizedHref;
      link.fetchPriority = "high";
      document.head.appendChild(link);
      return link;
    });

    return () => {
      links.forEach((link) => link.remove());
    };
  }, [images]);

  // Pre-compute index map once so per-card lookup is O(1) instead of O(n)
  const srcToIndex = useMemo(() => {
    const map = new Map<string, number>();
    images.forEach((img, i) => map.set(img.src, i));
    return map;
  }, [images]);

  // Only show visible images for better initial load
  const visibleImages = useMemo(() => {
    return images.slice(0, visibleCount);
  }, [images, visibleCount]);

  // Shortest-column-first masonry: each image goes to the column with the least
  // accumulated height so far. Relative height = 1 / aspectRatio (all columns
  // share the same width). Falls back to 1.0 (square) when ratio is unknown.
  const columnizedImages = useMemo(() => {
    const cols: Image[][] = Array.from({ length: columnCount }, () => []);
    const heights = new Array<number>(columnCount).fill(0);

    for (const image of visibleImages) {
      const shortest = heights.indexOf(Math.min(...heights));
      cols[shortest].push(image);
      heights[shortest] += 1 / (image.aspectRatio ?? 1.0);
    }

    return cols;
  }, [visibleImages, columnCount]);

  // Preload a Cloudinary image at lightbox resolution into the browser cache
  const preloadLightboxImage = useCallback((image: Image) => {
    const src = image.src.includes("cloudinary.com")
      ? image.src.replace("/upload/", "/upload/w_1920,q_85,f_auto/")
      : image.src;
    const img = new window.Image();
    img.src = src;
  }, []);

  const openLightbox = useCallback((image: Image, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    setLightboxLoading(true);
    document.body.style.overflow = "hidden";
    // Preload neighbours immediately
    if (images[index + 1]) preloadLightboxImage(images[index + 1]);
    if (images[index - 1]) preloadLightboxImage(images[index - 1]);
  }, [images, preloadLightboxImage]);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setSelectedIndex(-1);
    setLightboxLoading(false);
    document.body.style.overflow = "";
  }, []);

  const navigateImage = useCallback((direction: "next" | "prev") => {
    const newIndex = direction === "next"
      ? (selectedIndex + 1) % images.length
      : (selectedIndex - 1 + images.length) % images.length;

    setSelectedImage(images[newIndex]);
    setSelectedIndex(newIndex);
    setLightboxLoading(true);
    // Preload the image after the one we're navigating to
    const lookaheadIndex = direction === "next"
      ? (newIndex + 1) % images.length
      : (newIndex - 1 + images.length) % images.length;
    preloadLightboxImage(images[lookaheadIndex]);
  }, [selectedIndex, images, preloadLightboxImage]);

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
                const globalIndex = srcToIndex.get(image.src) ?? imageIndex;
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
                  onClick={(e) => { e.stopPropagation(); navigateImage("prev"); }}
                  className="absolute left-2 z-10 bg-black/50 rounded-full p-2 text-white hover:bg-black transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                {/* Spinner shown while next image is loading */}
                {lightboxLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}

                <img
                  key={selectedImage.src}
                  src={selectedImage.src.includes("cloudinary.com")
                    ? selectedImage.src.replace("/upload/", "/upload/w_1920,q_85,f_auto/")
                    : selectedImage.src
                  }
                  alt={selectedImage.alt}
                  onLoad={() => setLightboxLoading(false)}
                  className="max-h-full max-w-full object-contain transition-opacity duration-300"
                  style={{ opacity: lightboxLoading ? 0 : 1 }}
                />

                <button
                  onClick={(e) => { e.stopPropagation(); navigateImage("next"); }}
                  className="absolute right-2 z-10 bg-black/50 rounded-full p-2 text-white hover:bg-black transition-colors"
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
