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
const LazySplashCursor = lazy(() => import("../ui/splash-cursor").then((m) => ({ default: m.SplashCursor })));
const LiteSplashCursor = lazy(() => import("../SplashCursor").then((m) => ({ default: m.default })));
import CalendlyModal from "./CalendlyModal";

const ElegantHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
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
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      if ((window as any).cancelIdleCallback && idleId && typeof idleId !== "number") {
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
      <div className="absolute inset-0 bg-gradient-to-br from-black via-charcoal/40 to-black subtle-grain" />

      {/* Fluid cursor effect with graceful fallback */}
      <div className="absolute inset-0 z-0 gpu-accelerated pointer-events-none">
        {showCursor && (
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
                SIM_RESOLUTION={96}
                DYE_RESOLUTION={720}
                PRESSURE_ITERATIONS={14}
                DENSITY_DISSIPATION={3.0}
                VELOCITY_DISSIPATION={2.0}
                SPLAT_FORCE={3200}
                SPLAT_RADIUS={0.12}
                COLOR_UPDATE_SPEED={7}
              />
            )}
          </Suspense>
        )}
      </div>

      {/* Subtle ambient background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 4 }}
      >
        <div
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(230,177,126,0.1) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(209,169,122,0.08) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto mobile-safe-padding text-center">
        {/* Main headline with elegant reveal */}
        <motion.div
          className="mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-extrabold leading-[0.9] tracking-tight text-gray-100 mb-6 sm:mb-8">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              We Bring
            </motion.span>
            <motion.span
              className="block text-beige"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Shopify Dreams
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              to Life
            </motion.span>
          </h1>
        </motion.div>

        {/* Elegant subtitle */}
        <motion.p
          className="responsive-text-base text-gray-400 font-light leading-relaxed max-w-3xl mx-auto mb-10 sm:mb-16"
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
              onClick={() => {
              const url = (import.meta as any).env?.VITE_CALENDLY_URL as string | undefined;
              if (url) {
                setCalendlyOpen(true);
              } else {
                scrollToSection("contact");
              }
            }}
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
      <CalendlyModal open={calendlyOpen && Boolean((import.meta as any).env?.VITE_CALENDLY_URL)} onClose={() => setCalendlyOpen(false)} />
    </motion.section>
  );
};

export default ElegantHero;
