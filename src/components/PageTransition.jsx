import { motion } from "framer-motion";
import { memo } from "react";

// Smoothest possible: Fade + Micro Scale — used by Linear, Vercel, Stripe, Apple
// The 3% scale is subliminal — you feel the depth without consciously seeing movement
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.97,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: "blur(2px)",
  },
};

const pageTransition = {
  type: "tween",
  ease: [0.22, 1, 0.36, 1], // easeOutQuint — decelerates like silk
  duration: 0.45,
};

const exitTransition = {
  type: "tween",
  ease: [0.4, 0, 1, 1], // easeIn — snappy exit, doesn't linger
  duration: 0.2,
};

const PageTransition = memo(({ children }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={pageTransition}
    style={{ willChange: "opacity, transform" }}
    className="w-full min-h-screen overflow-x-hidden"
  >
    {children}
  </motion.div>
));

PageTransition.displayName = "PageTransition";

export default PageTransition;
