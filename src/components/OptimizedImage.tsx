import { useState, useCallback } from "react";

import { getOptimizedImageSrc, getSrcSet } from "../lib/performance";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  quality?: number;
  sizes?: string;
  fetchPriority?: "high" | "low" | "auto";
  placeholder?: boolean;
}

const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  quality = 75,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  fetchPriority = "auto",
  placeholder = true,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  // Placeholder for better UX
  const placeholderSrc = `data:image/svg+xml;base64,${btoa(
    `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1a1a1a"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle" dy=".3em">Loading...</text>
    </svg>`,
  )}`;

  if (hasError) {
    return (
      <div
        className={`bg-gray-800 flex items-center justify-center text-gray-400 text-sm ${className}`}
        style={{ width: width || "100%", height: height || "auto" }}
      >
        Failed to load image
      </div>
    );
  }

  const srcSet = getSrcSet(src, [360, 640, 768, 1024, 1280], quality);
  const optimized = getOptimizedImageSrc(src, 1024, quality);

  // React < 18.3 may not recognize fetchPriority; pass lowercase custom attribute
  const extraImgAttrs: Record<string, any> = {};
  if (fetchPriority && fetchPriority !== 'auto') {
    extraImgAttrs.fetchpriority = fetchPriority;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {placeholder && !isLoaded && (
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
          aria-hidden="true"
        />
      )}
      <picture>
        {/* Prefer AVIF / WebP when CDN supports */}
        <source type="image/avif" srcSet={srcSet.replaceAll('format=webp', 'format=avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet} sizes={sizes} />
        <img
          src={optimized}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-150 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          decoding="async"
          style={{
            contentVisibility: "auto",
            containIntrinsicSize: `${width || 400}px ${height || 300}px`,
          }}
          {...extraImgAttrs}
        />
      </picture>
    </div>
  );
};

export default OptimizedImage;
