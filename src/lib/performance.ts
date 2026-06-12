// Performance utilities for better loading speeds

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload fonts
  const fontUrls = [
    // Add any custom fonts here if used
  ];

  fontUrls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = url;
    link.as = "font";
    link.type = "font/woff2";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  });
};

// Lazy load non-critical components
export const lazyLoadComponent = (importFn: () => Promise<any>) => {
  return importFn();
};

// Optimize bundle loading
export const prefetchRoute = (routePath: string) => {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = routePath;
  document.head.appendChild(link);
};

// Memory cleanup utility
export const cleanupUnusedResources = () => {
  // Clean up any unused event listeners or intervals
  if (typeof window !== "undefined") {
    // Force garbage collection hint (only works in dev mode)
    if (import.meta.env.DEV && "gc" in window) {
      (window as any).gc();
    }
  }
};

// Optimize images for different viewport sizes
export const getOptimizedImageSrc = (
  baseSrc: string,
  width: number,
  quality = 75,
  desiredFormat?: "webp" | "avif",
) => {
  try {
    const url = new URL(
      baseSrc,
      typeof window !== "undefined" ? window.location.href : "https://local",
    );

    // Unsplash: width, quality, and format via fm
    if (url.hostname.includes("images.unsplash.com")) {
      url.searchParams.set("w", String(width));
      url.searchParams.set("q", String(Math.min(Math.max(quality, 30), 90)));
      if (desiredFormat) url.searchParams.set("fm", desiredFormat);
      return url.toString();
    }

    // Builder.io CDN: ensure width and optional format
    if (url.hostname.includes("cdn.builder.io")) {
      url.searchParams.set("width", String(width));
      url.searchParams.set(
        "quality",
        String(Math.min(Math.max(quality, 30), 90)),
      );
      if (desiredFormat) url.searchParams.set("format", desiredFormat);
      return url.toString();
    }

    // Cloudinary CDN: replace transformations with optimized width/quality/format
    if (url.hostname.includes("res.cloudinary.com")) {
      const parts = baseSrc.split("/upload/");
      if (parts.length > 1) {
        const afterUpload = parts[1];
        // Check if there are existing transformations
        const hasTransformations = afterUpload.includes("/") && !afterUpload.startsWith("v");
        const remainingPath = hasTransformations 
          ? afterUpload.substring(afterUpload.indexOf("/") + 1)
          : afterUpload;
        
        const q = Math.min(Math.max(quality, 30), 90);
        const f = desiredFormat || "auto";
        const newTransform = `w_${width},q_${q},f_${f}`;
        return `${parts[0]}/upload/${newTransform}/${remainingPath}`;
      }
    }

    return baseSrc;
  } catch {
    return baseSrc;
  }
};

export const getSrcSet = (
  baseSrc: string,
  widths = [360, 640, 768, 1024, 1280],
  quality = 75,
  desiredFormat?: "webp" | "avif",
) => {
  return widths
    .map(
      (w) =>
        `${getOptimizedImageSrc(baseSrc, w, quality, desiredFormat)} ${w}w`,
    )
    .join(", ");
};

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Debounce utility for scroll events
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for resize events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Detect if device is mobile
export const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 768px)").matches ||
    navigator.userAgent.toLowerCase().includes("mobile") ||
    navigator.userAgent.toLowerCase().includes("android")
  );
};

// Get optimized image quality based on device and connection
export const getAdaptiveImageQuality = () => {
  if (typeof window === "undefined") return 75;

  const isMobile = isMobileDevice();
  if (!isMobile) return 75;

  // Reduce quality on 4G/5G for faster loading
  if ("connection" in navigator) {
    const conn = (navigator as any).connection;
    if (conn && conn.effectiveType) {
      if (conn.effectiveType === "4g") return 70;
      if (conn.effectiveType === "3g") return 60;
      if (conn.effectiveType === "2g" || conn.effectiveType === "slow-2g") {
        return 50;
      }
    }
  }

  return 70; // Default for mobile
};

// Optimize animations based on device capability
export const shouldReduceAnimations = () => {
  if (typeof window === "undefined") return false;

  // Reduce if user prefers reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }

  // Reduce on low-end mobile devices
  if (isMobileDevice()) {
    // Check for GPU capability
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    if (!gl) return true; // No WebGL support = likely low-end device
  }

  return false;
};

export default {
  preloadCriticalResources,
  lazyLoadComponent,
  prefetchRoute,
  cleanupUnusedResources,
  getOptimizedImageSrc,
  getSrcSet,
  prefersReducedMotion,
  isMobileDevice,
  getAdaptiveImageQuality,
  shouldReduceAnimations,
  debounce,
  throttle,
};
