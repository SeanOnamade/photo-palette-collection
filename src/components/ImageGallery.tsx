
import { useState } from "react";
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

  const getColumnClass = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
  };

  return (
    <>
      <div className={`grid ${getColumnClass()} gap-4 md:gap-6`}>
        {images.map((image, index) => (
          <ImageCard
            key={`${image.src}-${index}`}
            src={image.src}
            alt={image.alt}
            title={image.title}
            category={image.category}
            onClick={() => setSelectedImage(image)}
          />
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
