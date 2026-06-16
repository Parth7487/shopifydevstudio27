import { motion } from "framer-motion";
import { memo } from "react";

const pageVariants = {
  initial: { 
    x: "100%", 
    opacity: 0.9 
  },
  animate: { 
    x: 0, 
    opacity: 1 
  },
  exit: { 
    x: "-100%", 
    opacity: 0.9 
  }
};

const pageTransition = {
  type: "tween",
  ease: [0.16, 1, 0.3, 1], // Premium easeOutExpo curve for smooth deceleration
  duration: 0.55
};

const PageTransition = memo(({ children }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={pageTransition}
    className="w-full min-h-screen overflow-x-hidden"
  >
    {children}
  </motion.div>
));

PageTransition.displayName = "PageTransition";

export default PageTransition;

