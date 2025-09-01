import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props { onFinish: () => void }

const CinematicIntroOverlay = ({ onFinish }: Props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinish, 400);
    }, 1800);
    return () => clearTimeout(t);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[90] bg-black overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className="absolute inset-0 bg-gradient-to-br from-black via-charcoal to-black" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.img
              src="/favicon.svg"
              alt="Logo"
              className="w-28 h-28 rounded-xl drop-shadow-[0_0_30px_rgba(230,177,126,0.2)]"
              initial={{ rotate: -8, filter: "blur(4px)" }}
              animate={{ rotate: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-beige/40"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicIntroOverlay;
