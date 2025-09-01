import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardData {
  id: string;
  title: string;
  description: string;
  image?: string;
  icon?: React.ReactNode;
  badge?: string;
  action?: () => void;
}

interface MobileCardSliderProps {
  cards: CardData[];
  className?: string;
  showToggle?: boolean;
  autoSlide?: boolean;
  slideDuration?: number;
}

type ViewMode = "grid" | "list" | "carousel";

export const MobileCardSlider = ({
  cards,
  className = "",
  showToggle = true,
  autoSlide = false,
  slideDuration = 4000,
}: MobileCardSliderProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("carousel");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoSlide);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying || viewMode !== "carousel") return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, slideDuration);

    return () => clearInterval(interval);
  }, [isAutoPlaying, viewMode, cards.length, slideDuration]);

  // Set up drag constraints
  useEffect(() => {
    if (carouselRef.current && viewMode === "carousel") {
      const containerWidth = carouselRef.current.offsetWidth;
      const totalWidth = cards.length * containerWidth;
      setDragConstraints({
        left: -(totalWidth - containerWidth),
        right: 0,
      });
    }
  }, [cards.length, viewMode]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(velocity) > 500 || Math.abs(offset) > threshold) {
      if (offset > 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (offset < 0 && currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }

    setIsAutoPlaying(false);
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
    setIsAutoPlaying(false);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setIsAutoPlaying(false);
  };

  const goToCard = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => {
      if (prev === "carousel") return "grid";
      if (prev === "grid") return "list";
      return "carousel";
    });
    setIsAutoPlaying(false);
  };

  const CardComponent = ({
    card,
    index,
  }: {
    card: CardData;
    index: number;
  }) => (
    <motion.div
      className={`
        ${viewMode === "carousel" ? "min-w-full" : ""}
        ${viewMode === "grid" ? "min-w-[280px]" : ""}
        ${viewMode === "list" ? "w-full" : ""}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: viewMode === "carousel" ? 1.02 : 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={`
        bg-gradient-to-br from-charcoal/80 to-graphite/60 backdrop-blur-sm
        border border-beige/20 rounded-xl overflow-hidden
        shadow-xl hover:shadow-beige/10 transition-all duration-300
        ${viewMode === "list" ? "flex items-center p-4" : "p-6"}
        ${viewMode === "carousel" ? "h-80" : ""}
        ${viewMode === "grid" ? "h-64" : ""}
        ${viewMode === "list" ? "h-20" : ""}
        group relative
      `}
      >
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-beige/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={false}
          animate={{
            background: [
              "linear-gradient(135deg, rgba(230,177,126,0.05) 0%, transparent 50%)",
              "linear-gradient(225deg, rgba(230,177,126,0.08) 0%, transparent 50%)",
              "linear-gradient(135deg, rgba(230,177,126,0.05) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Badge */}
        {card.badge && (
          <motion.div
            className="absolute top-4 right-4 bg-beige/20 text-beige px-2 py-1 rounded-full text-xs font-medium z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {card.badge}
          </motion.div>
        )}

        <div
          className={`relative z-10 ${viewMode === "list" ? "flex items-center gap-4 w-full" : ""}`}
        >
          {/* Icon or Image */}
          <div
            className={`
            ${viewMode === "list" ? "flex-shrink-0" : "mb-4"}
            ${viewMode === "carousel" ? "text-4xl" : "text-3xl"}
            ${viewMode === "list" ? "text-2xl" : ""}
          `}
          >
            {card.icon || (
              <div className="w-12 h-12 bg-beige/10 rounded-lg flex items-center justify-center">
                <span className="text-beige text-xl">📱</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className={`${viewMode === "list" ? "flex-1 min-w-0" : ""}`}>
            <h3
              className={`
              font-semibold text-white mb-2 group-hover:text-beige transition-colors duration-300
              ${viewMode === "carousel" ? "text-xl" : ""}
              ${viewMode === "grid" ? "text-lg" : ""}
              ${viewMode === "list" ? "text-base truncate" : ""}
            `}
            >
              {card.title}
            </h3>

            <p
              className={`
              text-gray-400 group-hover:text-gray-300 transition-colors duration-300
              ${viewMode === "carousel" ? "text-base leading-relaxed" : ""}
              ${viewMode === "grid" ? "text-sm line-clamp-3" : ""}
              ${viewMode === "list" ? "text-sm truncate" : ""}
            `}
            >
              {card.description}
            </p>

            {/* Action button for carousel and grid views */}
            {(viewMode === "carousel" || viewMode === "grid") &&
              card.action && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    onClick={card.action}
                    size="sm"
                    className="elegant-button text-sm px-4 py-2"
                  >
                    Learn More
                  </Button>
                </motion.div>
              )}
          </div>

          {/* List view action */}
          {viewMode === "list" && card.action && (
            <motion.button
              onClick={card.action}
              className="flex-shrink-0 text-beige hover:text-beige/80 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* View Toggle */}
      {showToggle && (
        <motion.div
          className="flex items-center justify-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-charcoal/60 border border-beige/20 rounded-xl p-2 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={toggleViewMode}
                className={`
                  p-2 rounded-lg transition-all duration-300
                  ${viewMode === "carousel" ? "bg-beige text-black" : "text-beige hover:bg-beige/10"}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📱
              </motion.button>
              <motion.button
                onClick={toggleViewMode}
                className={`
                  p-2 rounded-lg transition-all duration-300
                  ${viewMode === "grid" ? "bg-beige text-black" : "text-beige hover:bg-beige/10"}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Grid className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={toggleViewMode}
                className={`
                  p-2 rounded-lg transition-all duration-300
                  ${viewMode === "list" ? "bg-beige text-black" : "text-beige hover:bg-beige/10"}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <List className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cards Container */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {viewMode === "carousel" && (
            <motion.div
              key="carousel"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-xl"
              ref={carouselRef}
            >
              <motion.div
                className="flex"
                animate={{ x: `${-currentIndex * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={dragConstraints}
                onDragEnd={handleDragEnd}
              >
                {cards.map((card, index) => (
                  <CardComponent key={card.id} card={card} index={index} />
                ))}
              </motion.div>

              {/* Carousel Navigation */}
              {cards.length > 1 && (
                <>
                  <button
                    onClick={prevCard}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 border border-beige/30 rounded-full flex items-center justify-center text-beige hover:bg-black/80 transition-all duration-300 backdrop-blur-sm"
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextCard}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 border border-beige/30 rounded-full flex items-center justify-center text-beige hover:bg-black/80 transition-all duration-300 backdrop-blur-sm"
                    disabled={currentIndex === cards.length - 1}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </motion.div>
          )}

          {viewMode === "grid" && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {cards.map((card, index) => (
                <CardComponent key={card.id} card={card} index={index} />
              ))}
            </motion.div>
          )}

          {viewMode === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {cards.map((card, index) => (
                <CardComponent key={card.id} card={card} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel Indicators */}
        {viewMode === "carousel" && cards.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {cards.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToCard(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-beige scale-125"
                    : "bg-beige/30 hover:bg-beige/60"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Auto-play indicator */}
      {viewMode === "carousel" && isAutoPlaying && (
        <motion.div
          className="absolute top-4 right-4 w-8 h-8 border-2 border-beige/30 border-t-beige rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
};

export default MobileCardSlider;
