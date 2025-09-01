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

const WorkMarqueeAlt = memo(() => {
  const items: Item[] = useMemo(
    () => [
      {
        brand: "Warby Parker",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fb1dbcacf16f54c05997a0ae856630d68?format=webp&width=800",
        hover:
          "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F6ab5884447c14369814899e94a658233?format=webp&width=800",
        url: "https://warbyparker.com/",
      },
      {
        brand: "Glossier",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F925b231ab1bf4c45aa302d09fe61667a?format=webp&width=800",
        hover:
          "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fff589c465cb74fee8cecaf975a2dd075?format=webp&width=800",
        url: "https://glossier.com/",
      },
      {
        brand: "Fashion Nova",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F18fae872d56b46c4a993bdf2fb7ff6ce?format=webp&width=800",
        hover:
          "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fef01753c32fb495484f3644394e2ef36?format=webp&width=800",
        url: "https://fashionnova.com/",
      },
      {
        brand: "Daily Harvest",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fbaba4c9c65ac4e99a9cd8353423de404?format=webp&width=800",
        url: "https://daily-harvest.com/",
      },
      {
        brand: "Mejuri",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fd909e91b354a4c56981710883340e7e2?format=webp&width=800",
        url: "https://mejuri.com/",
      },
      {
        brand: "Pura Vida",
        image:
          "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F536d0ae12a9a4a46b044b3bd7a6a5923?format=webp&width=800",
        hover:
          "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fa78badeec40d467eb6f741ca447f6898?format=webp&width=800",
        url: "https://puravidabracelets.com/",
      },
    ],
    [],
  );

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstHalfRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const track = trackRef.current;
    const first = firstHalfRef.current;
    if (!track || !first) return;
    const apply = () => {
      const half = first.scrollWidth;
      const velocity = 110;
      const duration = Math.max(half / velocity, 20);
      track.style.setProperty("--marquee-distance", half + "px");
      track.style.setProperty("--duration", duration + "s");
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(first);
    return () => ro.disconnect();
  }, []);

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

  const loopItems = useMemo(() => [...items, ...items], [items]);

  return (
    <section
      className="py-6 sm:py-10 px-4 relative overflow-hidden"
      ref={containerRef}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-end mb-3 sm:mb-5">
          <button
            onClick={() => navigate("/work")}
            className="text-beige text-xs border border-beige/30 px-3 py-1.5 rounded-lg hover:bg-beige/10 transition-colors"
          >
            View All
          </button>
        </div>

        <div
          ref={trackRef}
          className="marquee-track marquee-track-reverse gpu-accelerated"
          data-paused={paused || !inView}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div ref={firstHalfRef} className="flex gap-4 sm:gap-6">
            {items.map((item, idx) => (
              <a
                key={`ra-${idx}`}
                href={item.url || "/work"}
                target={item.url ? "_blank" : undefined}
                rel={item.url ? "noopener noreferrer" : undefined}
                className="group relative block w-[88vw] sm:w-[60vw] md:w-[46vw] lg:w-[38vw] flex-shrink-0"
              >
                <div className="h-52 sm:h-60 md:h-72 lg:h-80 rounded-xl overflow-hidden border border-beige/20 bg-charcoal relative">
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
                      <span className="text-white font-medium">
                        {item.brand}
                      </span>
                      <span className="text-beige inline-flex items-center gap-1">
                        View <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div className="flex gap-4 sm:gap-6" aria-hidden="true">
            {loopItems.map((item, idx) => (
              <a
                key={`rb-${idx}`}
                href={item.url || "/work"}
                target={item.url ? "_blank" : undefined}
                rel={item.url ? "noopener noreferrer" : undefined}
                className="group relative block w-[88vw] sm:w-[60vw] md:w-[46vw] lg:w-[38vw] flex-shrink-0"
              >
                <div className="h-52 sm:h-60 md:h-72 lg:h-80 rounded-xl overflow-hidden border border-beige/20 bg-charcoal relative">
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
                      <span className="text-white font-medium">
                        {item.brand}
                      </span>
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

WorkMarqueeAlt.displayName = "WorkMarqueeAlt";

export default WorkMarqueeAlt;
