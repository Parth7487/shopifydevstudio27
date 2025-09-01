import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, MotionConfig } from "framer-motion";

// Optimized hook for faster scroll reveal animations
export const useScrollReveal = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1, margin: "100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return { ref, controls };
};

// Optimized scroll reveal variants for immediate visibility
export const scrollRevealVariants = {
  hidden: {
    opacity: 0,
    y: 20, // Reduced from 30 to 20
    scale: 0.98, // Closer to 1 for less GPU work
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2, // Reduced from 0.3 to 0.2
      ease: "easeOut",
      staggerChildren: 0.02, // Reduced from 0.05 to 0.02
    },
  },
};

export const fadeInUpVariants = {
  hidden: {
    opacity: 0,
    y: 15, // Reduced from 20 to 15
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2, // Reduced from 0.3 to 0.2
      ease: "easeOut",
    },
  },
};

export const slideInFromLeftVariants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export const slideInFromRightVariants = {
  hidden: {
    opacity: 0,
    x: 100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export const scaleInVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Ultra-fast stagger container for immediate visibility
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.01, // Minimal stagger for instant feel
      delayChildren: 0, // No delay
    },
  },
};

// Ultra-performance-optimized motion config
export const MotionPerformanceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <MotionConfig
    reducedMotion="user"
    transition={{
      duration: 0.25, // Reduced from 0.4 to 0.25
      ease: "easeOut", // Simpler easing
    }}
  >
    {children}
  </MotionConfig>
);
