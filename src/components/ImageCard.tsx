import { memo } from "react";

interface ImageCardProps {
  src: string;
  alt: string;
  title?: string;
  category?: string;
  onClick?: () => void;
}

const ImageCard = memo(({ src, alt, title, category, onClick }: ImageCardProps) => {
  return (
    <div
      className="group relative overflow-hidden rounded-lg cursor-pointer hover:opacity-90"
      onClick={onClick}
      style={{ willChange: 'opacity' }}
    >
      {/* Ultra-simple image - no animations, no filters */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full h-auto object-cover"
      />
      
      {/* Simplified overlay - only shows on hover */}
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
