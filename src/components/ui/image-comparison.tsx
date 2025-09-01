import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ImageComparisonProps {
  children: React.ReactNode;
  className?: string;
}

interface ImageComparisonImageProps {
  src: string;
  alt: string;
  side: "before" | "after";
  className?: string;
}

interface ImageComparisonSliderProps {
  className?: string;
}

const ImageComparison = React.forwardRef<HTMLDivElement, ImageComparisonProps>(
  ({ children, className, ...props }, ref) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback(() => {
      setIsDragging(true);
    }, []);

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    const handleMouseMove = useCallback(
      (e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;

        setSliderPosition(Math.min(Math.max(percentage, 0), 100));
      },
      [isDragging],
    );

    const handleTouchMove = useCallback(
      (e: React.TouchEvent) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const percentage = (x / rect.width) * 100;

        setSliderPosition(Math.min(Math.max(percentage, 0), 100));
      },
      [isDragging],
    );

    return (
      <div
        ref={containerRef}
        className={cn("relative overflow-hidden select-none", className)}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              sliderPosition,
              onMouseDown:
                child.type === ImageComparisonSlider
                  ? handleMouseDown
                  : undefined,
              onTouchStart:
                child.type === ImageComparisonSlider
                  ? handleMouseDown
                  : undefined,
            } as any);
          }
          return child;
        })}
      </div>
    );
  },
);

const ImageComparisonImage = React.forwardRef<
  HTMLImageElement,
  ImageComparisonImageProps & { sliderPosition?: number }
>(({ src, alt, side, className, sliderPosition = 50, ...props }, ref) => {
  const clipPath =
    side === "before"
      ? `inset(0 ${100 - sliderPosition}% 0 0)`
      : `inset(0 0 0 ${sliderPosition}%)`;

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn("absolute inset-0 w-full h-full object-cover", className)}
      style={{ clipPath }}
      draggable={false}
      {...props}
    />
  );
});

const ImageComparisonSlider = React.forwardRef<
  HTMLDivElement,
  ImageComparisonSliderProps & {
    sliderPosition?: number;
    onMouseDown?: () => void;
    onTouchStart?: () => void;
  }
>(
  (
    { className, sliderPosition = 50, onMouseDown, onTouchStart, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-10 shadow-lg",
          "before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2",
          "before:w-8 before:h-8 before:bg-white before:rounded-full before:shadow-lg",
          "before:flex before:items-center before:justify-center",
          "hover:before:scale-110 transition-transform",
          className,
        )}
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        {...props}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
          <div className="w-3 h-3 flex items-center justify-center">
            <div className="w-1 h-1 bg-gray-400 rounded-full mx-0.5"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full mx-0.5"></div>
          </div>
        </div>
      </div>
    );
  },
);

ImageComparison.displayName = "ImageComparison";
ImageComparisonImage.displayName = "ImageComparisonImage";
ImageComparisonSlider.displayName = "ImageComparisonSlider";

export { ImageComparison, ImageComparisonImage, ImageComparisonSlider };
