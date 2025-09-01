import { cn } from "./utils";

// Responsive breakpoint utilities
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Mobile-first responsive classes
export const responsiveClasses = {
  // Container classes
  container: "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  containerTight: "w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",

  // Grid classes
  gridResponsive:
    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8",
  gridShowcase:
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6",

  // Text classes
  headingLarge:
    "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight",
  headingMedium:
    "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight",
  headingSmall: "text-xl sm:text-2xl md:text-3xl font-bold leading-tight",
  bodyLarge: "text-lg sm:text-xl md:text-2xl leading-relaxed",
  bodyMedium: "text-base sm:text-lg md:text-xl leading-relaxed",

  // Spacing classes
  paddingSection: "py-12 sm:py-16 md:py-20 lg:py-24",
  paddingCard: "p-4 sm:p-6 md:p-8",
  marginSection: "mb-8 sm:mb-12 md:mb-16",

  // Flex classes
  flexResponsive: "flex flex-col sm:flex-row gap-4 sm:gap-6",
  flexCenter: "flex items-center justify-center",

  // Button classes
  buttonLarge:
    "px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-lg",
  buttonMedium:
    "px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold rounded-lg",
};

// Responsive image classes
export const imageClasses = {
  responsive: "w-full h-auto object-cover",
  showcase: "w-full h-48 sm:h-56 md:h-64 object-cover",
  hero: "w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] object-cover",
};

// Mobile-specific utilities
export const mobileUtils = {
  hideOnMobile: "hidden sm:block",
  hideOnDesktop: "block sm:hidden",
  mobileOnly: "sm:hidden",
  desktopOnly: "hidden sm:block",
};

// Touch-friendly button sizes
export const touchTargets = {
  minimum: "min-h-[44px] min-w-[44px]", // Apple's recommended minimum
  comfortable: "min-h-[48px] min-w-[48px]", // Material Design recommendation
  large: "min-h-[56px] min-w-[56px]", // For primary actions
};

// Helper function to create responsive classes
export const createResponsiveClass = (
  baseClass: string,
  responsive: Record<string, string>,
) => {
  const classes = [baseClass];

  Object.entries(responsive).forEach(([breakpoint, value]) => {
    if (breakpoint === "base") {
      classes[0] = value;
    } else {
      classes.push(`${breakpoint}:${value}`);
    }
  });

  return cn(classes);
};

// Animation classes for mobile performance
export const animationClasses = {
  // Reduced motion for mobile
  reduceMotion: "motion-reduce:transform-none motion-reduce:transition-none",

  // Touch-friendly hover states
  touchHover:
    "hover:scale-105 active:scale-95 transition-transform duration-200",

  // Performance-optimized animations
  performant: "transform-gpu will-change-transform",
};

export default {
  breakpoints,
  responsiveClasses,
  imageClasses,
  mobileUtils,
  touchTargets,
  createResponsiveClass,
  animationClasses,
};
