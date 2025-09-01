import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const testimonials = [
  {
    quote:
      "Shopify Dev Studio completely transformed our online presence. The attention to detail and technical expertise resulted in a 78% increase in conversions within the first month.",
    author: "Sarah Chen",
    role: "CEO & Founder",
    company: "Luxe Fashion Empire",
    avatar: "/api/placeholder/80/80",
    rating: 5,
    metric: "+78% conversions",
    industry: "Fashion",
  },
  {
    quote:
      "Working with this team was an absolute game-changer. They didn't just build us a store—they built us a conversion machine that drives real business results.",
    author: "Michael Rodriguez",
    role: "Co-Founder",
    company: "Tech Innovations Hub",
    avatar: "/api/placeholder/80/80",
    rating: 5,
    metric: "+234% revenue",
    industry: "Technology",
  },
  {
    quote:
      "The level of creativity and technical skill exceeded all our expectations. Our new store perfectly captures our brand story while delivering exceptional performance.",
    author: "Emily Watson",
    role: "Creative Director",
    company: "Artisan Collective",
    avatar: "/api/placeholder/80/80",
    rating: 5,
    metric: "+145% engagement",
    industry: "Handcraft",
  },
  {
    quote:
      "From concept to launch, every detail was meticulously crafted. The result is a store that not only looks stunning but performs flawlessly across all devices.",
    author: "David Park",
    role: "Marketing Director",
    company: "Global Electronics",
    avatar: "/api/placeholder/80/80",
    rating: 5,
    metric: "+189% sales",
    industry: "Electronics",
  },
  {
    quote:
      "The team's deep understanding of Shopify and e-commerce best practices helped us achieve results we never thought possible. Truly exceptional work.",
    author: "Lisa Thompson",
    role: "Brand Manager",
    company: "Wellness & Beauty Co.",
    avatar: "/api/placeholder/80/80",
    rating: 5,
    metric: "+156% retention",
    industry: "Beauty",
  },
];

const AnimatedTestimonials = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Touch handling for mobile swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < testimonials.length - 1) {
      nextTestimonial();
    }
    if (isRightSwipe && currentIndex > 0) {
      prevTestimonial();
    }
  }, [touchStart, touchEnd, currentIndex]);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  }, []);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
    setIsAutoPlaying(false);
  }, []);

  const goToTestimonial = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-32 bg-gradient-to-b from-black via-charcoal/20 to-black relative overflow-hidden min-h-screen flex items-center"
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-32 left-20 w-64 h-64 bg-beige/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-80 h-80 bg-clay/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Floating quote marks */}
      <motion.div
        className="absolute top-20 left-10 text-mint/20 text-9xl font-serif"
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        "
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 text-mint/20 text-9xl font-serif rotate-180"
        animate={{
          rotate: [180, 190, 170, 180],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
      >
        "
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl md:text-7xl font-bold text-white mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Client{" "}
            <span className="bg-gradient-to-r from-mint via-mint/80 to-mint bg-clip-text text-transparent">
              Love
            </span>
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Don't just take our word for it. See what our clients say about
            their transformation journey with us.
          </motion.p>
        </motion.div>

        {/* Enhanced Main testimonial carousel */}
        <div className="relative max-w-5xl mx-auto mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{
                opacity: 0,
                x: isMobile ? 50 : 100,
                rotateY: isMobile ? 0 : 30,
              }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{
                opacity: 0,
                x: isMobile ? -50 : -100,
                rotateY: isMobile ? 0 : -30,
              }}
              transition={{ duration: isMobile ? 0.4 : 0.6, ease: "easeInOut" }}
              className="perspective-1000"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Card className="bg-charcoal/80 border-beige/30 backdrop-blur-xl overflow-hidden relative">
                {/* Enhanced animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-beige/5 via-transparent to-clay/5"
                  animate={{
                    background: [
                      "linear-gradient(135deg, rgba(230,177,126,0.05) 0%, transparent 50%, rgba(209,169,122,0.05) 100%)",
                      "linear-gradient(225deg, rgba(209,169,122,0.05) 0%, transparent 50%, rgba(230,177,126,0.05) 100%)",
                      "linear-gradient(135deg, rgba(230,177,126,0.05) 0%, transparent 50%, rgba(209,169,122,0.05) 100%)",
                    ],
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                />

                <CardContent
                  className={`${isMobile ? "p-6" : "p-12"} relative z-10`}
                >
                  <div
                    className={`grid ${isMobile ? "grid-cols-1 gap-6" : "md:grid-cols-3 gap-8"} items-center`}
                  >
                    {/* Quote section */}
                    <div className={isMobile ? "order-2" : "md:col-span-2"}>
                      {/* Industry tag */}
                      <motion.span
                        className="inline-block bg-beige/20 text-beige px-3 py-1 rounded-full text-sm font-medium mb-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        {testimonials[currentIndex].industry}
                      </motion.span>

                      {/* Quote */}
                      <motion.blockquote
                        className={`${isMobile ? "text-lg" : "text-2xl md:text-3xl"} text-white mb-6 leading-relaxed font-light italic`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      >
                        "{testimonials[currentIndex].quote}"
                      </motion.blockquote>

                      {/* Rating stars */}
                      <motion.div
                        className="flex mb-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        {[...Array(testimonials[currentIndex].rating)].map(
                          (_, i) => (
                            <motion.span
                              key={i}
                              className={`text-beige ${isMobile ? "text-lg" : "text-2xl"} mr-1`}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: 0.6 + i * 0.1,
                              }}
                            >
                              ★
                            </motion.span>
                          ),
                        )}
                      </motion.div>

                      {/* Metric highlight */}
                      <motion.div
                        className="inline-flex items-center bg-beige/10 border border-beige/30 rounded-full px-4 py-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      >
                        <span className="text-beige font-bold text-lg mr-2">
                          📈
                        </span>
                        <span className="text-beige font-semibold">
                          {testimonials[currentIndex].metric}
                        </span>
                      </motion.div>
                    </div>

                    {/* Author section */}
                    <motion.div
                      className={`${isMobile ? "order-1 text-center" : "text-center md:text-left"}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <motion.div
                        className="relative inline-block mb-4"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Avatar
                          className={`${isMobile ? "w-16 h-16" : "w-24 h-24"} border-4 border-beige/30 mx-auto`}
                        >
                          <AvatarImage
                            src={testimonials[currentIndex].avatar}
                          />
                          <AvatarFallback className="bg-beige/20 text-beige text-xl">
                            {testimonials[currentIndex].author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <motion.div
                          className="absolute inset-0 border-4 border-beige/50 rounded-full"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>

                      <h4
                        className={`font-bold text-white ${isMobile ? "text-lg" : "text-xl"} mb-1`}
                      >
                        {testimonials[currentIndex].author}
                      </h4>
                      <p
                        className={`text-beige font-medium mb-1 ${isMobile ? "text-sm" : ""}`}
                      >
                        {testimonials[currentIndex].role}
                      </p>
                      <p
                        className={`text-gray-400 ${isMobile ? "text-sm" : ""}`}
                      >
                        {testimonials[currentIndex].company}
                      </p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Navigation arrows */}
          {!isMobile && (
            <>
              <motion.button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-charcoal/80 border border-beige/30 rounded-full flex items-center justify-center text-beige hover:bg-beige/10 transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-charcoal/80 border border-beige/30 rounded-full flex items-center justify-center text-beige hover:bg-beige/10 transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                disabled={currentIndex === testimonials.length - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </>
          )}

          {/* Mobile control panel */}
          {isMobile && (
            <motion.div
              className="flex items-center justify-center mt-4 space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                onClick={prevTestimonial}
                className="w-10 h-10 bg-charcoal/80 border border-beige/30 rounded-full flex items-center justify-center text-beige hover:bg-beige/10 transition-all duration-300"
                whileTap={{ scale: 0.9 }}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={toggleAutoPlay}
                className="w-10 h-10 bg-charcoal/80 border border-beige/30 rounded-full flex items-center justify-center text-beige hover:bg-beige/10 transition-all duration-300"
                whileTap={{ scale: 0.9 }}
              >
                {isAutoPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </motion.button>

              <motion.button
                onClick={nextTestimonial}
                className="w-10 h-10 bg-charcoal/80 border border-beige/30 rounded-full flex items-center justify-center text-beige hover:bg-beige/10 transition-all duration-300"
                whileTap={{ scale: 0.9 }}
                disabled={currentIndex === testimonials.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Testimonial indicators */}
        <div className="flex justify-center space-x-3 mb-16">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-mint scale-125"
                  : "bg-mint/30 hover:bg-mint/60"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {[
            { label: "Projects Delivered", value: "50+" },
            { label: "Client Satisfaction", value: "98%" },
            { label: "Average Rating", value: "5.0★" },
            { label: "Response Time", value: "24h" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
            >
              <motion.div
                className="text-3xl font-bold text-mint mb-2"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedTestimonials;
