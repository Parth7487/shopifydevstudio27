import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Settings,
  HelpCircle,
  Eye,
  Calendar,
  User,
  ExternalLink,
  Lock,
  Boxes
} from "lucide-react";
import ElegantNavigation from "../components/sections/ElegantNavigation";
import Footer from "../components/sections/Footer";
import OptimizedImage from "../components/OptimizedImage";
import { updatePageMeta } from "../lib/seo-meta";
import { addBreadcrumbSchema } from "../lib/breadcrumb-schema";
import { useSettings } from "../hooks/useSettings";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface CaseStudyItem {
  id: string;
  storeName: string;
  category: string;
  improvements: string[];
  challenge: string;
  solution: string;
  websiteUrl: string;
  afterImage: string;
}

interface BlogItem {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const { settings } = useSettings();

  useEffect(() => {
    updatePageMeta({
      title: "E-Commerce Engineering & Shopify Solutions FAQ | Shopify Dev Studio",
      description: "Access custom Shopify theme coding documentation, conversion optimization blueprints, case studies, blogs, and search-optimized technical FAQs. Partner with an expert Solutions Architect.",
      ogTitle: "E-Commerce Engineering & Shopify FAQ Hub | Shopify Dev Studio",
      ogDescription: "Search-optimized technical FAQ, case studies, and blogs from Shopify Dev Studio. Optimize your e-commerce platform today.",
      url: "https://www.shopifydevstudio.com/resources",
    });

    addBreadcrumbSchema([
      { name: "Home", url: "https://www.shopifydevstudio.com/" },
      { name: "Resources Hub", url: "https://www.shopifydevstudio.com/resources" },
    ]);
  }, []);

  // SEO/AEO/GEO Optimized FAQs
  const faqs: FAQItem[] = [
    {
      id: "faq-1",
      category: "Solutions Architecture",
      question: "What is an E-commerce Solutions Architect, and why does my store need one?",
      answer: "An E-commerce Solutions Architect designs, integrates, and customizes the entire technical architecture of your store—linking your front-end customer experience with inventory databases, private ERPs, secure payment processors, and AI agents. Unlike standard template builders, an architect designs custom Liquid codebases that eliminate app overhead, lower maintenance costs, and ensure infinite scalability under high traffic spikes."
    },
    {
      id: "faq-2",
      category: "Theme Engineering",
      question: "How do you replace slow templates with hand-coded Liquid components?",
      answer: "We replace heavy, bloated pre-built Shopify themes with a streamlined, custom-coded Liquid framework. Pre-made themes load hundreds of unused scripts, css parameters, and layout calculators that tank your performance. We write clean, custom Liquid sections and templates from scratch, serving only critical assets to keep the DOM size minimal and load speeds under 1 second."
    },
    {
      id: "faq-3",
      category: "Theme Engineering",
      question: "How does Figma-to-Shopify theme conversion work at Shopify Dev Studio?",
      answer: "Our Figma-to-Shopify process transforms your design blueprints into pixel-perfect Liquid themes. We translate Figma design tokens into custom Tailwind-configured styles and React-based transitions. This guarantees that your brand's unique aesthetics, custom typography, animations, and responsive breakpoints are preserved with absolute fidelity, without resorting to slow layout building apps."
    },
    {
      id: "faq-4",
      category: "Performance",
      question: "What strategies do you use to reduce Shopify app fees?",
      answer: "Many Shopify stores pay thousands monthly in app fees for simple features like product tabs, countdown timers, custom size charts, and upsell grids. These apps inject duplicate scripts that slow down your pages. We hard-code these functionalities directly into your Liquid theme using custom templates, allowing you to uninstall expensive third-party apps, lower your monthly bills, and boost load speeds."
    },
    {
      id: "faq-5",
      category: "Migrations",
      question: "How do you ensure a lossless migration from WooCommerce or Magento to Shopify?",
      answer: "We manage complete data migrations by securely exporting and cleaning customer databases, historical orders, product variants, metafield mappings, and checkout settings. To preserve your search rankings, we map out full 301 redirect paths for old URLs, ensuring that Google and other search engine indices point directly to your new Shopify pages with zero broken links or lost authority."
    },
    {
      id: "faq-6",
      category: "Performance",
      question: "How do you achieve a 95+ mobile PageSpeed score?",
      answer: "We optimize mobile performance by compressing images into modern WebP/Avif format sets, adding dynamic lazy loading, eliminating render-blocking JS/CSS dependencies, and optimizing the critical rendering path. We also defer non-critical scripts (like tracking tags and heatmaps) until the page has loaded, ensuring that Largest Contentful Paint (LCP) and Interaction to Next Paint (INP) meet Google's Core Web Vitals targets."
    },
    {
      id: "faq-7",
      category: "Custom Apps",
      question: "Can you develop custom private Shopify apps for specific workflows?",
      answer: "Yes, we build secure, private Shopify apps using Node.js, Next.js, and Supabase. These custom apps automate internal workflows, connect to proprietary external databases (like custom ERPs or warehouse systems), synchronize live inventories, and implement secure custom checkout portals without exposing sensitive API credentials to the public storefront."
    },
    {
      id: "faq-8",
      category: "3D & WebGL",
      question: "How do 3D WebGL product models help conversion rates?",
      answer: "Integrating interactive 3D WebGL models (built with Spline or Three.js) directly on your product pages allows customers to rotate, zoom, and inspect products in real-time. This interactive experience builds high user trust, reduces product return rates, increases time-on-page, and has been shown to boost e-commerce conversion rates by up to 40%."
    },
    {
      id: "faq-9",
      category: "Headless Shopify",
      question: "What are the benefits of headless Shopify architecture using Next.js/Vite?",
      answer: "Headless Shopify separates your frontend presentation layer (using React frameworks like Next.js or Remix/Hydrogen) from Shopify's backend e-commerce engine. This allows developers to build ultra-fast, dynamic interfaces deployed to global edge CDNs (like Vercel). Headless commerce is ideal for enterprise brands that require complex animations, absolute frontend flexibility, and rapid page loads."
    },
    {
      id: "faq-10",
      category: "Support retainer",
      question: "What is your support retainer program for high-growth brands?",
      answer: "Our support retainer provides ongoing e-commerce engineering, design upgrades, monthly performance audits, and emergency bug fixes. You gain priority access to a dedicated developer with a guaranteed response time of under 2 hours. This ensures your store remains optimized, secure, and fully aligned with your marketing campaigns."
    }
  ];

  // Dynamic Case Studies preview data
  const caseStudies: CaseStudyItem[] = [
    {
      id: "case-1",
      storeName: "Peak Performance",
      category: "Fitness & Sports",
      improvements: ["Revenue: +240% in 3 months", "Bounce rate: -45%", "AOV: +78% via Custom Builder"],
      challenge: "Complex product variations and slow pre-made checkout flow.",
      solution: "Custom-coded product builder and optimized edge-cached checkout experience.",
      websiteUrl: "https://peakperformance.com",
      afterImage: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600&h=400&fit=crop"
    },
    {
      id: "case-2",
      storeName: "Organic Glow",
      category: "Beauty & Skincare",
      improvements: ["Customer CLV: +189%", "Mobile speed score: 24 → 96", "Email conversions: +234%"],
      challenge: "High customer acquisition costs and low customer retention.",
      solution: "Smart subscription engine hard-coded in Liquid with custom retention incentives.",
      websiteUrl: "https://organicglow.com",
      afterImage: "https://images.unsplash.com/photo-1556742400-b5c2a5bd1df1?w=600&h=400&fit=crop"
    }
  ];

  // Dynamic Blog posts preview data
  const blogs: BlogItem[] = [
    {
      id: "blog-1",
      title: "10 Essential Shopify Conversion Optimization Techniques",
      excerpt: "Discover proven, psychology-backed strategies to boost your store's conversion rate and maximize customer lifecycle revenue.",
      author: "Sarah Chen",
      date: "Dec 15, 2024",
      readTime: "8 min read",
      category: "Conversion",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
    },
    {
      id: "blog-2",
      title: "The Psychology Behind Color Choices in E-commerce",
      excerpt: "Learn how different color systems influence user emotion, guide shopping focus, and increase purchase checkout rates.",
      author: "Michael Torres",
      date: "Dec 10, 2024",
      readTime: "6 min read",
      category: "Design",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop"
    },
    {
      id: "blog-3",
      title: "Speed Optimization: Making Your Shopify Store Lightning Fast",
      excerpt: "Technical strategies to compress assets, optimize Liquid queries, and defer tracking scripts for top PageSpeed scores.",
      author: "David Kim",
      date: "Nov 28, 2024",
      readTime: "10 min read",
      category: "Performance",
      image: "https://images.unsplash.com/photo-1518438773649-970bae4d71f5?w=600&h=400&fit=crop"
    }
  ];

  // Dynamic search filter logic
  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCaseStudies = caseStudies.filter(cs => 
    cs.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cs.challenge.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cs.solution.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // FAQ Schema injection for Google / AI engines
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer
        }
      }))
    };

    let script = document.querySelector("script[data-resources-faq-schema]");
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-resources-faq-schema", "true");
      script.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(script);
    } else {
      script.textContent = JSON.stringify(faqSchema);
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" }}>
      <ElegantNavigation />

      {/* Hero Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-beige/10 border border-beige/30 text-beige px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" />
            E-Commerce Resource Hub
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-none text-white"
          >
            Resources & <span className="text-beige">FAQ Center</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto font-light leading-relaxed"
          >
            Answers to your e-commerce design, custom Liquid engineering, and conversion rate questions—coupled with verified blueprints.
          </motion.p>
          
          {/* Dynamic Unified Search */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-xl mx-auto pt-4"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs, case studies, or growth insights..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-full pl-12 pr-6 py-4 text-white focus:border-beige focus:outline-none transition-all shadow-lg text-sm"
            />
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap gap-2 justify-center border-b border-white/5 pb-6">
          {["All", "FAQs", "Case Studies", "Blogs"].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-beige text-black shadow-lg"
                  : "bg-white/5 text-gray-400 hover:text-beige hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* FAQs Column */}
          {(activeCategory === "All" || activeCategory === "FAQs") && (
            <div className={`space-y-6 ${activeCategory === "FAQs" ? "lg:col-span-12" : "lg:col-span-7"}`}>
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="w-5 h-5 text-beige" />
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">Frequently Asked Questions</h2>
              </div>

              {filteredFAQs.length === 0 ? (
                <p className="text-gray-500 text-sm">No matching FAQ found.</p>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map(faq => (
                    <div
                      key={faq.id}
                      className="bg-gradient-to-br from-charcoal/80 to-graphite/40 border border-white/10 rounded-2xl overflow-hidden hover:border-beige/30 transition-all duration-300"
                    >
                      <button
                        onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                        className="w-full p-6 text-left flex items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <span className="bg-beige/10 text-beige text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 flex-shrink-0">
                            {faq.category}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                            {faq.question}
                          </h3>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-beige transition-transform duration-300 flex-shrink-0 ${
                            openFAQ === faq.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      
                      <AnimatePresence>
                        {openFAQ === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 pb-6 border-t border-white/5 pt-4 bg-black/10"
                          >
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line pl-2 border-l border-beige/40">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Right Sidebar: Case Studies & Blogs */}
          {activeCategory === "All" && (
            <div className="lg:col-span-5 space-y-12">
              
              {/* Case Studies Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-beige" />
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider">Featured Blueprints</h2>
                </div>

                <div className="space-y-4">
                  {filteredCaseStudies.map(cs => (
                    <div key={cs.id} className="bg-gradient-to-br from-charcoal/80 to-graphite/40 border border-white/10 rounded-2xl p-6 hover:border-beige/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-beige uppercase tracking-wider px-2 py-0.5 bg-beige/5 border border-beige/20 rounded">
                          {cs.category}
                        </span>
                        <a href={cs.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-beige transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2">{cs.storeName} Rebuild</h3>
                      <p className="text-gray-400 text-xs mb-4 leading-relaxed">{cs.solution}</p>
                      
                      <div className="space-y-1.5 border-t border-white/5 pt-4">
                        {cs.improvements.map((imp, idx) => (
                          <div key={idx} className="text-xs text-green-400 flex items-center gap-2 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            {imp}
                          </div>
                        ))}
                      </div>

                      <div className="pt-4">
                        <Link to="/work" className="inline-flex items-center gap-1.5 text-xs font-semibold text-beige hover:text-clay transition-colors uppercase tracking-wider">
                          View Full Case Study
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blogs Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-beige" />
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider">Conversion & Dev Blogs</h2>
                </div>

                <div className="space-y-4">
                  {filteredBlogs.map(blog => (
                    <div key={blog.id} className="bg-gradient-to-br from-charcoal/80 to-graphite/40 border border-white/10 rounded-2xl p-6 hover:border-beige/30 transition-all duration-300">
                      <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase tracking-wider mb-2">
                        <Calendar className="w-3 h-3" />
                        <span>{blog.date}</span>
                        <span>•</span>
                        <span>{blog.readTime}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-2 leading-snug hover:text-beige transition-colors">
                        <Link to="/blog">{blog.title}</Link>
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{blog.excerpt}</p>
                      
                      <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                          <User className="w-3 h-3" />
                          <span>{blog.author}</span>
                        </div>
                        <Link to="/blog" className="text-beige text-xs hover:text-clay transition-colors flex items-center gap-1 uppercase tracking-wider font-semibold">
                          Read Post <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Dedicated Case Studies Grid (when filtered) */}
          {activeCategory === "Case Studies" && (
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredCaseStudies.map(cs => (
                <div key={cs.id} className="bg-gradient-to-br from-charcoal/80 to-graphite/40 border border-white/10 rounded-3xl p-8 hover:border-beige/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-beige uppercase tracking-wider px-2.5 py-1 bg-beige/5 border border-beige/20 rounded">
                      {cs.category}
                    </span>
                    <a href={cs.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-beige transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-4">{cs.storeName} Store Optimization</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">The Challenge</span>
                      <p className="text-gray-300 text-sm leading-relaxed">{cs.challenge}</p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-beige uppercase tracking-widest block">The Solution</span>
                      <p className="text-gray-300 text-sm leading-relaxed">{cs.solution}</p>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-6">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-3">Key Transformations</span>
                    <div className="flex flex-wrap gap-2">
                      {cs.improvements.map((imp, idx) => (
                        <span key={idx} className="text-xs bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-full font-medium">
                          {imp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dedicated Blogs Grid (when filtered) */}
          {activeCategory === "Blogs" && (
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredBlogs.map(blog => (
                <div key={blog.id} className="bg-gradient-to-br from-charcoal/80 to-graphite/40 border border-white/10 rounded-2xl overflow-hidden hover:border-beige/30 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="aspect-video relative overflow-hidden bg-black/40 border-b border-white/5">
                      <OptimizedImage src={blog.image} alt={blog.title} className="w-full h-full object-cover" width={320} height={180} />
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase tracking-wider">
                        <Calendar className="w-3 h-3" />
                        <span>{blog.date}</span>
                        <span>•</span>
                        <span>{blog.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white leading-snug hover:text-beige transition-colors">
                        <Link to="/blog">{blog.title}</Link>
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{blog.excerpt}</p>
                    </div>
                  </div>
                  <div className="p-6 border-t border-white/5 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <User className="w-3.5 h-3.5" />
                      <span>{blog.author}</span>
                    </div>
                    <Link to="/blog" className="text-beige text-xs hover:text-clay transition-colors flex items-center gap-1 uppercase tracking-wider font-semibold">
                      Read Post <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Resources;
