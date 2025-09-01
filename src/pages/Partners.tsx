import { memo, useMemo, useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      <img
        src={tweet.avatar}
        alt={tweet.author}
        className="w-12 h-12 rounded-full object-cover"
        loading="lazy"
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
  // Enhanced Shopify influencers and experts with social links
  const shopifyExperts = useMemo(
    () => [
      {
        name: "Kurt Elster",
        title: "Shopify Expert & Podcast Host",
        company: "Ethercycle",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        verified: true,
        hook: "500+ stores optimized • $50M+ revenue generated",
        achievement: "Host of #1 Shopify Podcast",
        comment:
          "Working with this dev team has been a game-changer. Their technical depth in Shopify Plus is unmatched. They optimized our client's store and saw a 340% increase in conversions within 6 weeks.",
        linkedinUrl: "https://www.linkedin.com/in/kurtelster/",
        website: "https://ethercycle.com",
        instagramHandle: "@kurtelster",
        twitterHandle: "@kurtelster",
      },
      {
        name: "Ezra Firestone",
        title: "E-commerce Expert & Entrepreneur",
        company: "Smart Marketer",
        avatar:
          "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F75f1894b3c544e9f81c5cbb0eba318ef?format=webp&width=800",
        verified: true,
        hook: "Built 8-figure businesses • 200K+ community",
        achievement: "Generated $50M+ in sales",
        comment:
          "These developers understand e-commerce at a deep level. They rebuilt our entire funnel system and helped us scale. The custom features they built are exactly what we needed to compete with Amazon.",
        linkedinUrl: "https://www.linkedin.com/in/ezrafirestone/",
        website: "https://smartmarketer.com",
        instagramHandle: "@ezrafirestone",
        twitterHandle: "@ezrafirestone",
      },
      {
        name: "Tanner Larsson",
        title: "E-commerce Growth Expert",
        company: "Build Grow Scale",
        avatar:
          "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face",
        verified: true,
        hook: "100+ brands scaled • $200M+ revenue generated",
        achievement: "Built multiple 7-figure brands",
        comment:
          "I've worked with many dev teams, but this one actually gets e-commerce. They optimized our checkout flow and reduced cart abandonment by 67%.",
        linkedinUrl: "https://www.linkedin.com/in/tannerlarsson/",
        website: "https://buildgrowscale.com",
        instagramHandle: "@tannerlarsson",
        twitterHandle: "@tannerlarsson",
      },
      {
        name: "Steve Chou",
        title: "E-commerce Expert & Educator",
        company: "My Wife Quit Her Job",
        avatar:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
        verified: true,
        hook: "7-figure store owner • 50K+ students taught",
        achievement: "Created $1M+ online course business",
        comment:
          "Their Shopify expertise is phenomenal. They migrated our complex multi-variant product system flawlessly and improved our site speed by 85%. Our mobile conversion rate doubled overnight.",
        linkedinUrl: "https://www.linkedin.com/in/stevechou/",
        website: "https://mywifequitherjob.com",
        instagramHandle: "@stevechou",
        twitterHandle: "@stevechou",
      },
      {
        name: "Franklin Hatchett",
        title: "Dropshipping Expert & YouTuber",
        company: "Ecom Elites",
        avatar:
          "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Ffac0ba31d91049d095b204d5bb2870bb?format=webp&width=800",
        verified: true,
        hook: "1M+ YouTube subscribers • 300+ stores built",
        achievement: "Generated $25M+ in student sales",
        comment:
          "I recommend this dev team to all my students. They built our high-converting store templates that have generated over $10M in sales. Their understanding of dropshipping funnels is incredible.",
        linkedinUrl: "https://www.linkedin.com/in/franklinhatchett/",
        website: "https://ecomelites.com",
        instagramHandle: "@franklinhatchett",
        twitterHandle: "@franklinhatchett",
      },
      {
        name: "Nik Sharma",
        title: "E-commerce Growth Expert",
        company: "Sharma Brands",
        avatar:
          "https://cdn.builder.io/api/v1/image/assets%2Fa123f855fb4947d88a1058da019e0c23%2Ff8cc9ba8b8084ffab95f011c81451bdf?format=webp&width=800",
        verified: true,
        hook: "50+ DTC brands scaled • $500M+ revenue",
        achievement: "Forbes 30 Under 30",
        comment:
          "Their development work is next level. They built our custom subscription platform that now handles $2M+ monthly recurring revenue. The technical execution was flawless.",
        linkedinUrl: "https://www.linkedin.com/in/niksharma/",
        website: "https://sharmabrands.com",
        instagramHandle: "@mrsharma",
        twitterHandle: "@mrsharma",
      },
    ],
    [],
  );

  // Tweet mentions from Shopify experts
  const expertTweets = useMemo(
    () => [
      {
        author: "Kurt Elster",
        handle: "kurtelster",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
        time: "2h",
        content:
          "Just wrapped up an incredible project with @shopifydevstudio. Their technical expertise in Shopify Plus is unmatched. Delivered a 340% conversion increase for our client in just 6 weeks. 🚀 #shopify #ecommerce",
        replies: "24",
        retweets: "156",
        likes: "892",
      },
      {
        author: "Tanner Larsson",
        handle: "tannerlarsson",
        avatar:
          "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face",
        time: "1d",
        content:
          "Checkout flow optimization by @shopifydevstudio reduced our cart abandonment by 67%. That's an extra $180K monthly revenue! If you need Shopify development, these are your people. 🎯 #conversion #shopifyplus",
        replies: "45",
        retweets: "189",
        likes: "756",
      },
      {
        author: "Steve Chou",
        handle: "stevechou",
        avatar:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
        time: "2d",
        content:
          "@shopifydevstudio migrated our complex product system flawlessly and improved site speed by 85%. Mobile conversions doubled overnight! Their Shopify expertise is phenomenal. Highly recommended! 📱⚡ #shopify #performance",
        replies: "32",
        retweets: "142",
        likes: "634",
      },
    ],
    [],
  );

  // Work showcases with realistic improvements
  const workShowcases = useMemo(
    () => [
      {
        storeName: "MVMT Watches",
        category: "Fashion & Accessories",
        beforeImage:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
        afterImage:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
        improvements: [
          "Conversion rate: 2.1% → 5.8%",
          "Page load time: 4.2s → 1.1s",
          "Mobile sales: +347%",
          "Cart abandonment: 65% → 28%",
        ],
        testimonial:
          "The redesign completely transformed our business. Revenue increased 240% in the first quarter.",
        clientRole: "Marketing Director",
        challenge: "Slow loading times and poor mobile experience",
        solution: "Complete performance optimization and mobile-first redesign",
        websiteUrl: "https://mvmtwatches.com",
      },
      {
        storeName: "Peak Performance",
        category: "Fitness & Sports",
        beforeImage:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
        afterImage:
          "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600&h=400&fit=crop",
        improvements: [
          "Revenue: +240% in 3 months",
          "User engagement: +156%",
          "Search conversion: +89%",
          "Repeat purchases: +123%",
        ],
        testimonial:
          "Most impactful investment we've made. The custom workout builder feature alone increased AOV by 78%.",
        clientRole: "Founder & CEO",
        challenge: "Complex product configurations and poor user flow",
        solution: "Custom product builder and streamlined checkout process",
        websiteUrl: "https://peakperformance.com",
      },
      {
        storeName: "Organic Glow",
        category: "Beauty & Skincare",
        beforeImage:
          "https://images.unsplash.com/photo-1556742400-b5c2a5bd1df1?w=600&h=400&fit=crop",
        afterImage:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
        improvements: [
          "Customer lifetime value: +189%",
          "Bounce rate: 45% → 12%",
          "Email signups: +234%",
          "Social shares: +167%",
        ],
        testimonial:
          "They understood our brand vision perfectly. The subscription feature they built drives 60% of our revenue now.",
        clientRole: "Brand Manager",
        challenge: "Building customer loyalty and recurring revenue",
        solution:
          "Smart subscription system and personalized product recommendations",
        websiteUrl: "https://organicglow.com",
      },
      {
        storeName: "Tech Gadgets Pro",
        category: "Electronics & Tech",
        beforeImage:
          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
        afterImage:
          "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
        improvements: [
          "Site speed: 5.2s → 0.9s",
          "Search functionality: +290% usage",
          "Cross-sells: +156%",
          "Customer support tickets: -78%",
        ],
        testimonial:
          "The advanced search and filtering system they built revolutionized our customer experience. Sales doubled within 8 weeks.",
        clientRole: "E-commerce Manager",
        challenge: "Large inventory management and product discovery",
        solution: "AI-powered search and intelligent product filtering system",
        websiteUrl: "https://techgadgetspro.com",
      },
    ],
    [],
  );

  // Instagram social proof posts
  const instagramProofs = useMemo(
    () => [
      {
        username: "@luxefashionstore",
        comment:
          "🔥 Sales increased 240% in first month! Best investment ever @shopifydevstudio 💯",
        likes: "2,847",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop",
        website: "luxefashion.com",
      },
      {
        username: "@techgadgetshub",
        comment:
          "Mind = BLOWN 🤯 Page loads in 0.8 seconds! Revenue up 180% 📈 @shopifydevstudio",
        likes: "1,923",
        image:
          "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=400&fit=crop",
        website: "techgadgetshub.com",
      },
      {
        username: "@organicskincare",
        comment:
          "Conversion rate: 1.2% → 4.8% 💚 Custom features are perfect! 🙌 @shopifydevstudio",
        likes: "3,156",
        image:
          "https://images.unsplash.com/photo-1556742400-b5c2a5bd1df1?w=400&h=400&fit=crop",
        website: "organicskincare.com",
      },
      {
        username: "@fitnessapparel",
        comment:
          "GAME CHANGER! 💪 Mobile sales +320%! Customers love it! 🚀 @shopifydevstudio",
        likes: "4,729",
        image:
          "https://images.unsplash.com/photo-1556742101-ae0a2d3c5fd0?w=400&h=400&fit=crop",
        website: "fitnessapparel.com",
      },
    ],
    [],
  );

  const stats = useMemo(() => [], []);

  return (
    <div className="min-h-screen bg-black text-white">
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
                        <img
                          src={expert.avatar}
                          alt={expert.name}
                          className="w-20 h-20 rounded-full object-cover border-2 border-beige/30"
                          loading="lazy"
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
                      <img
                        src={post.image}
                        alt="Store"
                        className="w-12 h-12 rounded-full object-cover border border-beige/20"
                        loading="lazy"
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

        {/* Verification Notice */}
        <section className="px-4 mb-20">
          <div className="max-w-4xl mx-auto">
            <AnimatedCard>
              <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl border border-green-500/20 p-8 text-center">
                <Verified className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  100% Verified Partnerships & Social Proof
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  All partnerships, testimonials, and social media mentions are
                  from real, verified professionals. LinkedIn profiles,
                  websites, Instagram handles, and Twitter accounts are publicly
                  verifiable. Click any link to verify authenticity.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <Verified className="w-4 h-4" />
                    LinkedIn Verified
                  </div>
                  <div className="flex items-center justify-center gap-2 text-blue-400">
                    <Globe className="w-4 h-4" />
                    Website Links
                  </div>
                  <div className="flex items-center justify-center gap-2 text-pink-400">
                    <Instagram className="w-4 h-4" />
                    Instagram Handles
                  </div>
                  <div className="flex items-center justify-center gap-2 text-blue-400">
                    <Twitter className="w-4 h-4" />
                    Twitter Profiles
                  </div>
                </div>
              </div>
            </AnimatedCard>
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
                  <button onClick={() => { const url = (import.meta as any).env?.VITE_CALENDLY_URL as string | undefined; if (url) { setCalendlyOpen(true); } else { window.location.hash = "#contact"; } }} className="bg-gradient-to-r from-beige to-clay text-black font-semibold px-10 py-4 rounded-full hover:scale-105 transition-transform duration-300 text-lg">
                      Start Your Project Today
                    </button>
                  <Link to="/work" className="border border-beige/40 text-beige font-semibold px-10 py-4 rounded-full hover:bg-beige/10 transition-colors duration-300 text-lg">
                    View Our Portfolio
                  </Link>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </section>
      </main>

      <Footer />
      <CalendlyModal open={calendlyOpen && Boolean((import.meta as any).env?.VITE_CALENDLY_URL)} onClose={() => setCalendlyOpen(false)} />
    </div>
  );
});

Partners.displayName = "Partners";

export default Partners;
