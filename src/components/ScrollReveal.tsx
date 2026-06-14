import { motion } from "framer-motion";
import { memo } from "react";

const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] // Custom out-expo curve
    }
  }
};

const ScrollReveal = memo(({ children, className = "" }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={revealVariants}
    className={className}
  >
    {children}
  </motion.div>
));

ScrollReveal.displayName = "ScrollReveal";

export default ScrollReveal;
export { ScrollReveal };
