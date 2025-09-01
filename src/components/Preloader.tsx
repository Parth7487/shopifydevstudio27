import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [progress, setProgress] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let animationFrame: number;
    const startTime = Date.now();
    const duration = 900;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(69, Math.max(1, (elapsed / duration) * 69));

      setProgress(newProgress);

      if (newProgress >= 69) {
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(onComplete, 200);
        }, 100); // Reduced from 400ms to 100ms
      } else {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          exit={{
            opacity: 0,
            scale: 1.01,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Subtle background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-black via-charcoal/30 to-black subtle-grain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />

          {/* Minimal grid pattern */}
          <motion.div
            className="absolute inset-0 opacity-[0.01]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.01 }}
            transition={{ duration: 2 }}
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `linear-gradient(rgba(242,242,242,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,242,0.05) 1px, transparent 1px)`,
                backgroundSize: "80px 80px",
              }}
            />
          </motion.div>

          <div className="text-center relative z-10">
            {/* Elegant logo mark */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative">
                {/* Logo (same as favicon) */}
                <motion.div
                  className="w-20 h-20 mx-auto mb-8 relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-full h-full rounded-lg" aria-hidden="true" focusable="false">
                    <defs>
                      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="#E6B17E"/>
                        <stop offset="100%" stopColor="#D09A6C"/>
                      </linearGradient>
                    </defs>
                    <rect width="512" height="512" rx="112" fill="#0A0A0A"/>
                    <rect x="86" y="86" width="340" height="340" rx="36" fill="none" stroke="url(#g)" strokeWidth="12"/>
                    <path d="M176 148 A80 70 0 0 1 336 148" fill="none" stroke="url(#g)" strokeWidth="18" strokeLinecap="round"/>
                    <path d="M176 148 v22" fill="none" stroke="url(#g)" strokeWidth="18" strokeLinecap="round"/>
                    <path d="M336 148 v22" fill="none" stroke="url(#g)" strokeWidth="18" strokeLinecap="round"/>
                    <text x="256" y="270" textAnchor="middle" dominantBaseline="middle" fill="#E6B17E" fontFamily="Inter, system-ui, -apple-system, Arial, sans-serif" fontSize="210" fontWeight="700">S</text>
                  </svg>

                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    animate={{
                      boxShadow: ["0 0 0 0 rgba(230,177,126,0.0)", "0 0 0 10px rgba(230,177,126,0.08)", "0 0 0 0 rgba(230,177,126,0.0)"],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>

                {/* Studio name */}
                <motion.h1
                  className="text-2xl font-light text-gray-100 tracking-wide"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  SHOPIFY DEV STUDIO
                </motion.h1>
                <motion.p
                  className="text-sm text-gray-400 font-light tracking-widest mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  PREMIUM THEME DEVELOPMENT
                </motion.p>
              </div>
            </motion.div>

            {/* Elegant progress display */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <motion.div
                className="text-4xl font-light text-beige mb-3 font-mono tabular-nums"
                key={Math.floor(progress)}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {Math.floor(progress).toString().padStart(2, "0")}%
              </motion.div>
            </motion.div>

            {/* Minimal progress bar */}
            <div className="w-64 h-px bg-gray-700 mx-auto mb-8 overflow-hidden">
              <motion.div
                className="h-full bg-beige"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              />
            </div>

            {/* Loading status */}
            <motion.p
              className="text-gray-500 text-xs font-light tracking-wider"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              LOADING EXPERIENCE
            </motion.p>
          </div>

          {/* Minimal corner accents */}
          {[
            { position: "top-8 left-8" },
            { position: "top-8 right-8" },
            { position: "bottom-8 left-8" },
            { position: "bottom-8 right-8" },
          ].map((corner, index) => (
            <motion.div
              key={index}
              className={`absolute ${corner.position} w-16 h-16`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
            >
              <div className="w-full h-full border-l border-t border-beige/20" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
