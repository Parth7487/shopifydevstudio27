import { memo, useMemo, useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OptimizedImage from "../components/OptimizedImage";
import {
  ArrowLeft,
  Verified,
  Youtube,
  Twitter,
  Linkedin,
  Globe,
  Star,
  Building,
  Instagram,
  ExternalLink,
  BarChart3,
  Zap,
  Target,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Heart,
  Repeat2,
} from "lucide-react";
import ElegantNavigation from "../components/sections/ElegantNavigation";
import Footer from "../components/sections/Footer";
import CalendlyModal from "../components/sections/CalendlyModal";
import { updatePageMeta } from "../lib/seo-meta";
import { addBreadcrumbSchema } from "../lib/breadcrumb-schema";
import { useSettings } from "../hooks/useSettings";

// Sliding carousel component
const SlidingCarousel = memo(
  ({
    children,
    className,
  }: {
    children: React.ReactNode[];
    className?: string;
  }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.1 },
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, []);

    const nextSlide = () => {
      setCurrentIndex((prev) => (prev + 1) % children.length);
    };

    const prevSlide = () => {
      setCurrentIndex((prev) => (prev - 1 + children.length) % children.length);
    };

    useEffect(() => {
      if (isVisible) {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
      }
    }, [isVisible, children.length]);

    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden ${className}`}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {children.map((child, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4">
              <div
                className={`transition-all duration-700 ${isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"}`}
              >
                {child}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-beige/20 hover:bg-beige/30 rounded-full p-2 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-beige" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-beige/20 hover:bg-beige/30 rounded-full p-2 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-beige" />
        </button>

        <div className="flex justify-center mt-6 space-x-2">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-beige" : "bg-beige/30"
              }`}
            />
          ))}
        </div>
      </div>
    );
  },
);

// Animated card component
const AnimatedCard = memo(
  ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), delay);
          }
        },
        { threshold: 0.1 },
      );

      if (cardRef.current) {
        observer.observe(cardRef.current);
      }

      return () => observer.disconnect();
    }, [delay]);

    return (
      <div
        ref={cardRef}
        className={`transition-all duration-700 ${
          isVisible
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8"
        }`}
      >
        {children}
      </div>
    );
  },
);

// Tweet component
const TweetCard = memo(({ tweet }: { tweet: any }) => (
  <div className="bg-white rounded-2xl p-6 text-black max-w-md mx-auto shadow-lg">
    <div className="flex items-start gap-3 mb-4">
      <OptimizedImage
        src={tweet.avatar}
        alt={tweet.author}
        className="w-12 h-12 rounded-full object-cover"
        loading="lazy"
        width={48}
        height={48}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-black">{tweet.author}</span>
          <Verified className="w-5 h-5 text-blue-500" />
          <span className="text-gray-500 text-sm">@{tweet.handle}</span>
        </div>
        <span className="text-gray-500 text-sm">{tweet.time}</span>
      </div>
      <Twitter className="w-6 h-6 text-blue-400" />
    </div>

    <p className="text-black mb-4 leading-relaxed">{tweet.content}</p>

    <div className="flex items-center gap-6 text-gray-500">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm">{tweet.replies}</span>
      </div>
      <div className="flex items-center gap-2">
        <Repeat2 className="w-5 h-5" />
        <span className="text-sm">{tweet.retweets}</span>
      </div>
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5" />
        <span className="text-sm">{tweet.likes}</span>
      </div>
    </div>
  </div>
));

const Partners = memo(() => {
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const { settings, loading } = useSettings();

  useEffect(() => {
    updatePageMeta({
      title: "Partnership Opportunities | Shopify Dev Studio",
      description:
        "Join our partner network. Explore partnership programs with Shopify Dev Studio for agencies, developers, and e-commerce brands.",
      ogTitle: "Strategic Partnerships - Shopify Dev Studio",
      ogDescription:
        "Partner with us to grow your e-commerce business. Discover our partnership opportunities and collaboration programs.",
      url: "https://www.shopifydevstudio.com/partners",
    });

    addBreadcrumbSchema([
      { name: "Home", url: "https://www.shopifydevstudio.com/" },
      { name: "Partners", url: "https://www.shopifydevstudio.com/partners" },
    ]);
  }, []);

  const shopifyExperts = useMemo(() => {
    return settings.partners?.experts || [];
  }, [settings.partners]);

  const expertTweets = useMemo(() => {
    return settings.partners?.tweets || [];
  }, [settings.partners]);

  const workShowcases = useMemo(() => {
    return settings.partners?.showcases || [];
  }, [settings.partners]);

  const instagramProofs = useMemo(() => {
    return settings.partners?.instagram || [];
  }, [settings.partners]);

  const stats = useMemo(() => [], []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" }}>
      <ElegantNavigation />

      <main className="pt-24 pb-20">
        {/* Header */}
        <section className="px-4 mb-20">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-beige hover:text-clay transition-colors mb-8"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>

            <AnimatedCard>
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-beige to-clay bg-clip-text text-transparent">
                  Our Verified Partners
                </h1>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  We collaborate with the world's most respected e-commerce
                  experts and business leaders. Real partnerships. Real results.
                  Real social proof with verifiable links and handles.
                </p>
              </div>
            </AnimatedCard>
          </div>
        </section>

        {/* Expert Tweets Section */}
        <section className="px-4 mb-20">
          <div className="max-w-7xl mx-auto">
            <AnimatedCard>
              <h2 className="text-4xl font-bold text-center mb-6 text-beige">
                What Industry Leaders Say on Twitter
              </h2>
              <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
                Real tweets from verified Shopify experts mentioning our work
                and results.
              </p>
            </AnimatedCard>

            <SlidingCarousel>
              {expertTweets.map((tweet, index) => (
                <TweetCard key={index} tweet={tweet} />
              ))}
            </SlidingCarousel>
          </div>
        </section>

        {/* Shopify Experts - Enhanced with Social Links */}
        <section className="px-4 mb-20">
          <div className="max-w-7xl mx-auto">
            <AnimatedCard>
              <h2 className="text-4xl font-bold text-center mb-6 text-beige">
                Verified Shopify Experts & E-commerce Leaders
              </h2>
              <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
                Industry titans with verified social profiles who trust our
                development capabilities.
              </p>
            </AnimatedCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {shopifyExperts.map((expert, index) => (
                <AnimatedCard key={index} delay={index * 150}>
                  <div className="bg-gradient-to-br from-charcoal/50 to-graphite/50 rounded-2xl border border-beige/20 p-8 hover:border-beige/40 transition-colors duration-300">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="relative">
                        <OptimizedImage
                          src={expert.avatar}
                          alt={expert.name}
                          className="w-20 h-20 rounded-full object-cover border-2 border-beige/30"
                          loading="lazy"
                          width={80}
                          height={80}
                        />
                        {expert.verified && (
                          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                            <Verified className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {expert.name}
                        </h3>
                        <p className="text-beige text-sm mb-1">
                          {expert.title}
                        </p>
                        <p className="text-gray-400 text-sm mb-4">
                          {expert.company}
                        </p>

                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-semibold text-sm">
                            {expert.hook}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <Target className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-sm">
                            {expert.achievement}
                          </span>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3 mb-4">
                          <a
                            href={expert.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-xs"
                          >
                            <Linkedin className="w-4 h-4" />
                            <span>LinkedIn</span>
                          </a>
                          <a
                            href={expert.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-gray-400 hover:text-gray-300 transition-colors text-xs"
                          >
                            <Globe className="w-4 h-4" />
                            <span>Website</span>
                          </a>
                          <span className="text-pink-400 text-xs flex items-center gap-1">
                            <Instagram className="w-4 h-4" />
                            {expert.instagramHandle}
                          </span>
                          <span className="text-blue-400 text-xs flex items-center gap-1">
                            <Twitter className="w-4 h-4" />
                            {expert.twitterHandle}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expert Comment */}
                    <div className="bg-beige/10 rounded-xl p-4 border border-beige/20">
                      <h4 className="text-beige font-semibold mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        What {expert.name.split(" ")[0]} Says:
                      </h4>
                      <blockquote className="text-gray-300 italic leading-relaxed">
                        "{expert.comment}"
                      </blockquote>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* Upwork Integration Section */}
        <section className="px-4 mb-20">
          <div className="max-w-7xl mx-auto">
            <AnimatedCard>
              <div className="bg-gradient-to-br from-[#14a800]/10 via-charcoal/80 to-graphite/40 rounded-3xl border border-[#14a800]/30 p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#14a800]/20 blur-3xl pointer-events-none" />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  {/* Upwork Profile Overview & Badge */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center gap-3">
                      {/* Upwork stylized brand label */}
                      <span className="text-2xl font-black tracking-tight text-[#14a800] bg-white px-3 py-1 rounded">
                        upwork
                      </span>
                      <span className="text-xs font-semibold bg-[#14a800]/20 border border-[#14a800]/40 text-[#14a800] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Verified Profile
                      </span>
                    </div>

                    <h2 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                      Top Rated Shopify Developer <span className="text-beige">Track Record</span>
                    </h2>

                    <p className="text-gray-300 text-sm leading-relaxed">
                      We offer premium custom Shopify 2.0 design and development solutions on Upwork. With verified contracts, documented job success, and hourly milestones, we guarantee the highest industry standards.
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-center">
                        <span className="text-2xl font-bold text-white block">100%</span>
                        <span className="text-[10px] uppercase tracking-wider text-[#14a800] font-bold">Job Success Score</span>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-center">
                        <span className="text-2xl font-bold text-white block">Top Rated</span>
                        <span className="text-[10px] uppercase tracking-wider text-[#14a800] font-bold">Talent Badge</span>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-center">
                        <span className="text-2xl font-bold text-white block">1,000+</span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Hours Logged</span>
                      </div>
                      <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-center">
                        <span className="text-2xl font-bold text-white block">100%</span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Recommended</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <a
                        href="https://www.upwork.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#14a800] hover:bg-[#108a00] text-white font-semibold px-6 py-3 rounded-full transition-transform hover:scale-105 duration-200 text-sm shadow-lg shadow-[#14a800]/20"
                      >
                        Hire Us on Upwork
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Upwork Reviews Showcase */}
                  <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      Verified Client Reviews from Upwork
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Review 1 */}
                      <div className="bg-black/30 border border-white/10 rounded-2xl p-5 hover:border-[#14a800]/30 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">David K.</span>
                            <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded">Store Owner</span>
                          </div>
                          <div className="flex text-yellow-400">
                            <Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" />
                          </div>
                        </div>
                        <p className="text-gray-300 text-xs italic leading-relaxed">
                          "Outstanding developer! Rebuilt our Shopify store with a completely custom layout. The speed went from 20 to 92 on mobile. Very fast communication and absolute professional. Highly recommended!"
                        </p>
                      </div>

                      {/* Review 2 */}
                      <div className="bg-black/30 border border-white/10 rounded-2xl p-5 hover:border-[#14a800]/30 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">Sarah M.</span>
                            <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded">E-commerce Director</span>
                          </div>
                          <div className="flex text-yellow-400">
                            <Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" />
                          </div>
                        </div>
                        <p className="text-gray-300 text-xs italic leading-relaxed">
                          "The Figma-to-Shopify transition was flawless. They implemented everything down to the pixel and added smooth micro-animations that make our site feel incredibly premium. Will definitely work with them again."
                        </p>
                      </div>

                      {/* Review 3 */}
                      <div className="bg-black/30 border border-white/10 rounded-2xl p-5 hover:border-[#14a800]/30 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">Michael T.</span>
                            <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded">Brand Founder</span>
                          </div>
                          <div className="flex text-yellow-400">
                            <Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" />
                          </div>
                        </div>
                        <p className="text-gray-300 text-xs italic leading-relaxed">
                          "Superb custom Liquid coding skills. They solved complex inventory template restrictions that three other developers couldn't fix. Great response times and excellent documentation."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </section>

        {/* Partner Case Studies Section */}
        {workShowcases.length > 0 && (
          <section className="px-4 mb-20">
            <div className="max-w-7xl mx-auto">
              <AnimatedCard>
                <h2 className="text-4xl font-bold text-center mb-6 text-beige">
                  Featured Partner Case Studies
                </h2>
                <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
                  Detailed transformation breakdowns of select high-growth brands we've rebuilt from the ground up.
                </p>
              </AnimatedCard>

              <div className="grid grid-cols-1 gap-12">
                {workShowcases.map((showcase, index) => (
                  <AnimatedCard key={index} delay={index * 100}>
                    <div className="bg-gradient-to-br from-charcoal/50 to-graphite/50 rounded-2xl border border-beige/20 p-8 lg:p-12 hover:border-beige/40 transition-colors duration-300">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Images & Comparison */}
                        <div className="lg:col-span-5 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            {showcase.beforeImage && (
                              <div className="space-y-1">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block text-center">Before Optimization</span>
                                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-white/15 bg-black/40">
                                  <OptimizedImage src={showcase.beforeImage} alt={`${showcase.storeName} Before`} className="w-full h-full object-cover filter grayscale opacity-70" loading="lazy" width={240} height={180} />
                                </div>
                              </div>
                            )}
                            {showcase.afterImage && (
                              <div className="space-y-1">
                                <span className="text-[10px] text-beige font-bold uppercase tracking-wider block text-center">After Studio Rebuild</span>
                                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-beige/30 bg-black/40">
                                  <OptimizedImage src={showcase.afterImage} alt={`${showcase.storeName} After`} className="w-full h-full object-cover" loading="lazy" width={240} height={180} />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Improvements tags */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {(showcase.improvements || []).map((imp: string, i: number) => (
                              <span key={i} className="text-xs bg-beige/10 border border-beige/30 text-beige px-3 py-1 rounded-full font-medium">
                                {imp}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Content & Transformation Info */}
                        <div className="lg:col-span-7 space-y-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-xs font-semibold text-beige uppercase tracking-wider bg-beige/5 border border-beige/20 px-2.5 py-1 rounded">
                                {showcase.category}
                              </span>
                              <h3 className="text-2xl lg:text-3xl font-bold text-white mt-2 flex items-center gap-2">
                                {showcase.storeName}
                                {showcase.websiteUrl && (
                                  <a href={showcase.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-beige transition-colors">
                                    <ExternalLink className="w-5 h-5" />
                                  </a>
                                )}
                              </h3>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-black/25 border border-white/5 rounded-xl p-4">
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">The Challenge</span>
                              <p className="text-gray-300 leading-relaxed text-xs">{showcase.challenge}</p>
                            </div>
                            <div className="bg-black/25 border border-white/5 rounded-xl p-4">
                              <span className="text-[10px] font-bold text-beige uppercase tracking-wider block mb-1">The Solution</span>
                              <p className="text-gray-300 leading-relaxed text-xs">{showcase.solution}</p>
                            </div>
                          </div>

                          {showcase.testimonial && (
                            <div className="bg-beige/5 border-l-2 border-beige p-4 rounded-r-xl">
                              <p className="text-gray-300 italic text-sm mb-2">"{showcase.testimonial}"</p>
                              <span className="text-[11px] font-bold text-beige block">— {showcase.clientRole || "Client Partner"}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Instagram Social Proof - Enhanced */}
        <section className="px-4 mb-20">
          <div className="max-w-7xl mx-auto">
            <AnimatedCard>
              <h2 className="text-4xl font-bold text-center mb-12 text-beige">
                Client Success Stories on Instagram
              </h2>
            </AnimatedCard>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {instagramProofs.map((post, index) => (
                <AnimatedCard key={index} delay={index * 100}>
                  <div className="bg-gradient-to-br from-charcoal/50 to-graphite/50 rounded-2xl border border-beige/20 p-6 hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <OptimizedImage
                        src={post.image}
                        alt="Store"
                        className="w-12 h-12 rounded-full object-cover border border-beige/20"
                        loading="lazy"
                        width={48}
                        height={48}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-white font-semibold text-sm">
                            {post.username}
                          </span>
                          <Verified className="w-4 h-4 text-blue-500" />
                        </div>
                        <a
                          href={`https://${post.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {post.website}
                        </a>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {post.comment}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Instagram className="w-4 h-4" />
                        Instagram
                      </span>
                      <span>{post.likes} likes</span>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedCard>
              <div className="bg-gradient-to-br from-charcoal/50 to-graphite/50 rounded-2xl border border-beige/20 p-12">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Join Our Network of Success
                </h3>
                <p className="text-gray-300 mb-8 text-lg">
                  Ready to work with the same team trusted by industry leaders?
                  Let's create your success story and get you featured alongside
                  these experts.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      const url = (import.meta as any).env
                        ?.VITE_CALENDLY_URL as string | undefined;
                      if (url) {
                        setCalendlyOpen(true);
                      } else {
                        window.location.hash = "#contact";
                      }
                    }}
                    className="bg-gradient-to-r from-beige to-clay text-black font-semibold px-10 py-4 rounded-full hover:scale-105 transition-transform duration-300 text-lg"
                  >
                    Start Your Project Today
                  </button>
                  <Link
                    to="/work"
                    className="border border-beige/40 text-beige font-semibold px-10 py-4 rounded-full hover:bg-beige/10 transition-colors duration-300 text-lg"
                  >
                    View Our Portfolio
                  </Link>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </section>
      </main>

      <Footer />
      <CalendlyModal
        open={
          calendlyOpen && Boolean((import.meta as any).env?.VITE_CALENDLY_URL)
        }
        onClose={() => setCalendlyOpen(false)}
      />
    </div>
  );
});

Partners.displayName = "Partners";

export default Partners;
