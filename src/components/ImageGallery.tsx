import {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  useMemo,
} from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import ImageCard from "./ImageCard";

/**
 * Interfaces
 */
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

/**
 * A responsive, lazy-loaded, chunked masonry gallery with a lightbox.
 */
const ImageGallery = ({ images, columns = 3 }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [columnCount, setColumnCount] = useState(columns);
  const [visibleChunks, setVisibleChunks] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Increase or decrease chunkSize for controlling how many images load at once.
  // A smaller chunkSize means images load more gradually (but more network requests).
  // A larger chunkSize means fewer requests but bigger jumps in loaded content.
  const chunkSize = 6;

  const loadingRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  /**
   * Preload next and previous images when lightbox is open.
   * This helps ensure near-instant navigation in the lightbox.
   */
  useEffect(() => {
    if (selectedImage && selectedIndex >= 0) {
      const nextIndex = (selectedIndex + 1) % images.length;
      const prevIndex = (selectedIndex - 1 + images.length) % images.length;

      // Preload next and previous images
      const nextImg = new window.Image();
      nextImg.src = images[nextIndex].src;

      const prevImg = new window.Image();
      prevImg.src = images[prevIndex].src;
    }
  }, [selectedImage, selectedIndex, images]);

  /**
   * Reset visible chunks when images change (e.g., user filtered images).
   */
  useEffect(() => {
    setVisibleChunks(1);
  }, [images]);

  /**
   * Throttle the resize handler to avoid excessive recalculations.
   * This helps performance if users resize their browser frequently.
   */
  const handleResize = useCallback(() => {
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
  }, [columns]);

  useEffect(() => {
    // Initial calculation
    handleResize();

    // A small performance optimization: throttle the resize event
    let resizeTimer: number | null = null;
    const onResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        handleResize();
        resizeTimer = null;
      }, 150);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [handleResize]);

  /**
   * Progressive loading: Use an IntersectionObserver on the loadingRef
   * to load more chunks as the user scrolls down.
   */
  useEffect(() => {
    const loadMoreImages = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        // Only load more if we haven't loaded all images
        if (visibleChunks * chunkSize < images.length) {
          // Short delay to simulate "infinite scroll" effect more smoothly
          setTimeout(() => {
            setVisibleChunks((prev) =>
              Math.min(prev + 1, Math.ceil(images.length / chunkSize))
            );
          }, 150);
        }
      }
    };

    const observer = new IntersectionObserver(loadMoreImages, {
      // Increase rootMargin to start loading images earlier
      rootMargin: "500px",
      threshold: 0.01,
    });

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [visibleChunks, images.length]);

  /**
   * Return only the images that should be visible so far, based on current chunk.
   */
  const visibleImages = useMemo(() => {
    return images.slice(0, visibleChunks * chunkSize);
  }, [images, visibleChunks, chunkSize]);

  /**
   * Open/close the lightbox
   */
  const openLightbox = useCallback((image: Image, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    setIsLightboxOpen(true);

    // Disable page scroll behind the lightbox
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setIsLightboxOpen(false);

    // Re-enable page scroll
    document.body.style.overflow = "";
  }, []);

  /**
   * Navigate to next/previous image in the lightbox.
   */
  const navigateImage = useCallback(
    (direction: "next" | "prev") => {
      const newIndex =
        direction === "next"
          ? (selectedIndex + 1) % images.length
          : (selectedIndex - 1 + images.length) % images.length;

      setSelectedImage(images[newIndex]);
      setSelectedIndex(newIndex);
    },
    [selectedIndex, images]
  );

  /**
   * Keyboard navigation for the lightbox (arrow keys, Escape).
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === "ArrowRight") {
        navigateImage("next");
      } else if (e.key === "ArrowLeft") {
        navigateImage("prev");
      } else if (e.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, navigateImage, closeLightbox]);

  /**
   * Organize images into columns for a masonry layout.
   */
  const columnizedImages = useMemo(() => {
    if (columnCount <= 0) return [];
    const cols: Image[][] = Array.from({ length: columnCount }, () => []);
    visibleImages.forEach((img, i) => {
      cols[i % columnCount].push(img);
    });
    return cols;
  }, [columnCount, visibleImages]);

  /**
   * Simple animation delay function for fade-in
   */
  const getAnimationDelay = (columnIndex: number, imageIndex: number) => {
    // Stagger the fade-in animation slightly by column & index
    const delay = columnIndex * 50 + imageIndex * 30;
    return `${delay}ms`;
  };

  return (
    <>
      {/* Gallery grid */}
      <div
        ref={galleryRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
        style={{
          opacity: images.length > 0 ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        {columnizedImages.map((column, columnIndex) => (
          <div key={`column-${columnIndex}`} className="flex flex-col space-y-2">
            {column.map((image, imageIndex) => {
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

      {/* Loading indicator when there are more images to show */}
      {visibleImages.length < images.length && (
        <div ref={loadingRef} className="flex justify-center py-8">
          <div className="animate-pulse flex space-x-4">
            <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
            <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
            <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      )}

      {/* No results message */}
      {images.length === 0 && (
        <div className="text-center py-16">
          <p className="text-portfolio-muted text-lg">
            No images found in this category.
          </p>
          <p className="text-portfolio-muted mt-2">
            Try selecting a different filter.
          </p>
        </div>
      )}

      {/* Lightbox Dialog */}
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
                    navigateImage("prev");
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
                  style={{ maxHeight: "80vh" }}
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("next");
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
