import { useRef, useState, useEffect, lazy, Suspense } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../hooks/useSettings";

const LazySplashCursor = lazy(() =>
  import("../ui/splash-cursor").then((m) => ({ default: m.SplashCursor })),
);
const LiteSplashCursor = lazy(() =>
  import("../SplashCursor").then((m) => ({ default: m.default })),
);
import CalendlyModal from "./CalendlyModal";

const ElegantHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { settings } = useSettings();
  const enableSplashCursor = settings?.footer?.enable_splash_cursor ?? false;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const isInView = useInView(containerRef, { once: true });
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [useLiteCursor, setUseLiteCursor] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

    // Detect WebGL support
    let webglSupported = false;
    try {
      const test = document.createElement("canvas");
      webglSupported = !!(
        (test.getContext("webgl2") as any) ||
        test.getContext("webgl") ||
        test.getContext("experimental-webgl")
      );
    } catch {
      webglSupported = false;
    }

    // Decide which cursor to use: lite for mobile/coarse pointer/no WebGL
    setUseLiteCursor(isMobile || !hasFinePointer || !webglSupported);

    let idleId: any;
    const enable = () => setShowCursor(true);
    if ((window as any).requestIdleCallback) {
      idleId = (window as any).requestIdleCallback(enable, { timeout: 1200 });
    } else {
      idleId = setTimeout(enable, 600);
    }
    return () => {
      if (
        (window as any).cancelIdleCallback &&
        idleId &&
        typeof idleId !== "number"
      ) {
        (window as any).cancelIdleCallback(idleId);
      } else if (typeof idleId === "number") {
        clearTimeout(idleId);
      }
    };
  }, []);

  // Smooth scroll-based transforms
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), {
    stiffness: 100,
    damping: 30,
  });
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.8], [1, 0]), {
    stiffness: 100,
    damping: 30,
  });
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.8], [1, 0.95]), {
    stiffness: 100,
    damping: 30,
  });

  // Background parallax glow Y transforms
  const glowY1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const glowY2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const smoothGlowY1 = useSpring(glowY1, { stiffness: 80, damping: 25 });
  const smoothGlowY2 = useSpring(glowY2, { stiffness: 80, damping: 25 });

  // Staggered reveal variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.4,
      }
    }
  };

  const wordVariants = {
    hidden: { y: "115%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } // Custom out-expo
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const isMobile = window.innerWidth < 768;
      element.scrollIntoView({ behavior: isMobile ? "auto" : "smooth" });
    }
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden gpu-accelerated motion-safe"
      style={{
        y,
        opacity,
        scale,
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
    >
      {/* Elegant background */}
      <div className="absolute inset-0 subtle-grain" style={{ background: "linear-gradient(135deg, var(--theme-bg) 0%, var(--theme-bg-subtle) 100%)" }} />

      {/* Fluid cursor effect with graceful fallback */}
      <div className="absolute inset-0 z-0 gpu-accelerated pointer-events-none">
        {enableSplashCursor && showCursor && (
          <Suspense fallback={null}>
            {useLiteCursor ? (
              <LiteSplashCursor
                DENSITY_DISSIPATION={2.2}
                VELOCITY_DISSIPATION={1.8}
                SPLAT_FORCE={3000}
                SPLAT_RADIUS={0.1}
                COLOR_UPDATE_SPEED={6}
              />
            ) : (
              <LazySplashCursor
                SIM_RESOLUTION={64}
                DYE_RESOLUTION={256}
                PRESSURE_ITERATIONS={8}
                DENSITY_DISSIPATION={3.5}
                VELOCITY_DISSIPATION={2.0}
                SPLAT_FORCE={3000}
                SPLAT_RADIUS={0.1}
                COLOR_UPDATE_SPEED={7}
              />
            )}
          </Suspense>
        )}
      </div>

      {/* Subtle ambient background */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 4 }}
      >
        <motion.div
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
          style={{
            y: smoothGlowY1,
            background:
              "radial-gradient(circle, rgba(230,177,126,0.1) 0%, transparent 70%)",
            willChange: "transform",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full"
          style={{
            y: smoothGlowY2,
            background:
              "radial-gradient(circle, rgba(209,169,122,0.08) 0%, transparent 70%)",
            willChange: "transform",
          }}
        />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto mobile-safe-padding text-center">
        {/* Main headline with elegant reveal */}
        <div className="mb-8 sm:mb-12 select-none overflow-hidden">
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="fluid-h1 font-extrabold leading-[0.9] tracking-tight theme-text mb-6 sm:mb-8"
          >
            <span className="block overflow-hidden relative pb-1">
              <motion.span variants={wordVariants} className="block">
                We Bring
              </motion.span>
            </span>
            <span className="block overflow-hidden relative pb-1 text-beige">
              <motion.span variants={wordVariants} className="block">
                Shopify Dreams
              </motion.span>
            </span>
            <span className="block overflow-hidden relative pb-1">
              <motion.span variants={wordVariants} className="block">
                to Life
              </motion.span>
            </span>
          </motion.h1>
        </div>

        {/* Elegant subtitle */}
        <motion.p
          className="responsive-text-base theme-text-sec font-light leading-relaxed max-w-3xl mx-auto mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          Custom Shopify themes built for brands that demand excellence,
          performance, and timeless design.
        </motion.p>

        {/* Clean CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => setCalendlyOpen(true)}
              className="elegant-button w-full sm:w-auto px-6 sm:px-8 py-3 responsive-text-xs font-medium tracking-wide rounded"
            >
              Schedule a Call
            </Button>
          </motion.div>

          <motion.button
            onClick={() => navigate("/work")}
            className="elegant-button-outline w-full sm:w-auto px-6 sm:px-8 py-3 responsive-text-xs font-medium tracking-wide rounded transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            View Our Work
          </motion.button>
        </motion.div>

        {/* Subtle scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <motion.div
            className="w-px h-16 bg-gradient-to-b from-transparent via-beige/60 to-transparent"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
      <CalendlyModal
        open={calendlyOpen}
        onClose={() => setCalendlyOpen(false)}
      />
    </motion.section>
  );
};

export default ElegantHero;
