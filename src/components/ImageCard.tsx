import { memo, useState } from "react";

interface ImageCardProps {
  src: string;
  alt: string;
  title?: string;
  category?: string;
  onClick?: () => void;
  priority?: boolean;
}

const isCloudinary = (url: string) => url.includes("cloudinary.com");

const ImageCard = memo(({ src, alt, title, category, onClick, priority = false }: ImageCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const cloudinary = isCloudinary(src);

  // Tiny blur placeholder only for Cloudinary images (20px, ~1KB)
  const blurSrc = cloudinary
    ? src.replace("/upload/", "/upload/w_20,h_20,q_10,e_blur:1000,f_auto/")
    : null;

  // Optimized sharp version: Cloudinary gets resized thumbnail, local gets the file as-is
  const sharpSrc = cloudinary
    ? src.replace("/upload/", "/upload/w_700,q_65,f_auto/")
    : src;

  return (
    <div
      className="group relative overflow-hidden rounded-lg cursor-pointer hover:opacity-90"
      onClick={onClick}
      style={{
        willChange: "opacity",
        contain: "layout style paint",
        // Dark bg shows while image is downloading (especially for large local files)
        backgroundColor: "#1a1a1a",
      }}
    >
      {/* Cloudinary-only: tiny blurred placeholder fades out when sharp loads */}
      {blurSrc && !isLoaded && (
        <img
          src={blurSrc}
          alt=""
          aria-hidden="true"
          className="w-full h-auto object-cover"
          style={{
            filter: "blur(20px)",
            transform: "scale(1.1)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Main image */}
      <img
        src={sharpSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setIsLoaded(true)}
        className="w-full h-auto object-cover"
        style={{
          display: "block",
          opacity: isLoaded ? 1 : cloudinary ? 0 : 1,
          transition: "opacity 0.5s ease-out",
        }}
      />

      {(title || category) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4">
          <div>
            {category && (
              <span className="inline-block rounded bg-white/20 px-2 py-1 text-xs text-white mb-1">
                {category}
              </span>
            )}
            {title && (
              <h3 className="text-white text-sm font-medium">{title}</h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

ImageCard.displayName = "ImageCard";

export default ImageCard;
