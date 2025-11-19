import { useEffect, useState, useRef } from "react";

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          const scrollHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          const scrolled = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
          setProgress(Math.min(scrolled, 1));
          ticking.current = false;
        });
      }
    };

    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-0.5 z-[60] pointer-events-none bg-transparent"
      style={{ contain: "layout style paint" }}
    >
      <div
        ref={progressRef}
        className="h-full bg-beige shadow-[0_0_8px_rgba(230,177,126,0.35)]"
        style={{
          width: `${progress * 100}%`,
          transition: "width 0.05s ease-out",
          willChange: "width",
        }}
      />
    </div>
  );
};

export default ScrollProgress;
