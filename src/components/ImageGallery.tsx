
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  const [columnCount, setColumnCount] = useState(columns);
  const galleryRef = useRef<HTMLDivElement>(null);

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

  // Organize images into columns for masonry layout
  const columnizedImages = () => {
    if (columnCount <= 0) return [];
    
    const cols: Image[][] = Array.from({ length: columnCount }, () => []);
    
    images.forEach((image, i) => {
      cols[i % columnCount].push(image);
    });
    
    return cols;
  };

  return (
    <>
      <div 
        ref={galleryRef}
        className="flex gap-1"
      >
        {columnizedImages().map((column, columnIndex) => (
          <div key={`column-${columnIndex}`} className="flex-1 flex flex-col gap-1">
            {column.map((image, imageIndex) => (
              <ImageCard
                key={`${image.src}-${imageIndex}`}
                src={image.src}
                alt={image.alt}
                title={image.title}
                category={image.category}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-screen-lg p-0 bg-black border-none">
          {selectedImage && (
            <div className="flex flex-col">
              <div className="relative h-[80vh] w-full">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="h-full w-full object-contain animate-image-fade-in"
                />
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

export default ImageGallery;
