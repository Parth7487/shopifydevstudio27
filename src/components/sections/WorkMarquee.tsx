import { memo, useEffect, useMemo, useRef, useState } from "react";
import OptimizedImage from "../OptimizedImage";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

interface Item {
  brand: string;
  image: string;
  hover?: string;
  url?: string;
}

const WorkMarquee = memo(() => {
  // Selected projects images (sourced from Work.tsx defaults)
  const items: Item[] = useMemo(
    () => [
      {
        brand: "Kotn",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fedcb8435931f44eb9b505c05d6b5320b?format=webp&width=800",
        hover:
          "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Ffe0af747be454520afaf237069cbde7d?format=webp&width=800",
        url: "https://kotn.com/",
      },
      {
        brand: "Burrow",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Ff76df5449ec447f1802e2eb11a4f74cc?format=webp&width=800",
        url: "https://burrow.com/",
      },
      {
        brand: "Outdoor Voices",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F46ff449fe2264a32bcc421ec79f0fb81?format=webp&width=800",
        hover:
          "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F6da0fe6abe844bfb822da2915cd23413?format=webp&width=800",
        url: "https://outdoorvoices.com/",
      },
      {
        brand: "Death Wish Coffee",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fd3ccfd7f90bb40bba243ccf3e66ecd5d?format=webp&width=800",
        hover:
          "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F952b87f38e4845aca65937386b0554f2?format=webp&width=800",
        url: "https://deathwishcoffee.com/",
      },
      {
        brand: "MVMT",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fd5ef16192a934217999bb0448ae4fcd0?format=webp&width=800",
        hover:
          "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F372f556fe7f94ca28e2080a47880f704?format=webp&width=800",
        url: "https://mvmt.com/",
      },
      {
        brand: "Triangl",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fb519514eaa674de1b183894be58328cd?format=webp&width=800",
        hover:
          "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F01d64a44f39844638e43f866b793afbc?format=webp&width=800",
        url: "https://triangl.com/",
      },
    ],
    []
  );

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstHalfRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);

  // Measure width and set CSS custom properties for smooth CSS animation
  useEffect(() => {
    const track = trackRef.current;
    const first = firstHalfRef.current;
    if (!track || !first) return;

    const apply = () => {
      const half = first.scrollWidth;
      // Pixels per second for elegant pace
      const velocity = 110; // px/s
      const duration = Math.max(half / velocity, 20); // seconds
      track.style.setProperty("--marquee-distance", half + "px");
      track.style.setProperty("--duration", duration + "s");
    };

    apply();

    const ro = new ResizeObserver(apply);
    ro.observe(first);
    return () => ro.disconnect();
  }, []);

  // Pause when not in view to save CPU
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Duplicate items to create an infinite loop
  const loopItems = useMemo(() => [...items, ...items], [items]);

  return (
    <section className="py-12 sm:py-16 px-4 relative overflow-hidden" ref={containerRef}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Recent Work</h2>
          <button
            onClick={() => navigate("/work")}
            className="text-beige text-sm border border-beige/30 px-3 py-1.5 rounded-lg hover:bg-beige/10 transition-colors"
          >
            View All
          </button>
        </div>

        <div
          ref={trackRef}
          className="marquee-track gpu-accelerated"
          data-paused={paused || !inView}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          {/* First half */}
          <div ref={firstHalfRef} className="flex gap-4 sm:gap-6">
            {items.map((item, idx) => (
              <a
                key={`a-${idx}`}
                href={item.url || "/work"}
                target={item.url ? "_blank" : undefined}
                rel={item.url ? "noopener noreferrer" : undefined}
                className="group relative block w-[88vw] sm:w-[60vw] md:w-[46vw] lg:w-[38vw] flex-shrink-0 focus:outline-none"
              >
                <div className="h-56 sm:h-64 md:h-72 lg:h-80 rounded-xl overflow-hidden border border-beige/20 bg-charcoal relative">
                  <OptimizedImage
                    src={item.image}
                    alt={item.brand}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  placeholder={false}
                  />
                  {item.hover && (
                    <OptimizedImage
                      src={item.hover}
                      alt={`${item.brand} hover`}
                      className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    placeholder={false}
                    />
                  )}
                  {/* Hover details */}
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <div className="flex items-center justify-between text-sm sm:text-base">
                      <span className="text-white font-medium">{item.brand}</span>
                      <span className="text-beige inline-flex items-center gap-1">
                        View <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
          {/* Second half (duplicate) */}
          <div className="flex gap-4 sm:gap-6" aria-hidden="true">
            {items.map((item, idx) => (
              <a
                key={`b-${idx}`}
                href={item.url || "/work"}
                target={item.url ? "_blank" : undefined}
                rel={item.url ? "noopener noreferrer" : undefined}
                className="group relative block w-[88vw] sm:w-[60vw] md:w-[46vw] lg:w-[38vw] flex-shrink-0"
              >
                <div className="h-56 sm:h-64 md:h-72 lg:h-80 rounded-xl overflow-hidden border border-beige/20 bg-charcoal relative">
                  <OptimizedImage
                    src={item.image}
                    alt={item.brand}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  placeholder={false}
                  />
                  {item.hover && (
                    <OptimizedImage
                      src={item.hover}
                      alt={`${item.brand} hover`}
                      className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    placeholder={false}
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <div className="flex items-center justify-between text-sm sm:text-base">
                      <span className="text-white font-medium">{item.brand}</span>
                      <span className="text-beige inline-flex items-center gap-1">
                        View <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

WorkMarquee.displayName = "WorkMarquee";

export default WorkMarquee;
