import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Palette, 
  Zap, 
  Code, 
  Globe, 
  Camera, 
  Layers, 
  Box, 
  RefreshCw, 
  Search, 
  Sparkles, 
  BarChart3, 
  Monitor, 
  ShieldAlert, 
  Activity, 
  Shield 
} from "lucide-react";
import "./BookFlip.css";

interface ServiceItem {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  features: string[];
}

interface BookFlipProps {
  onFormSubmit: (e: React.FormEvent) => void;
  formState: {
    storeUrl: string;
    email: string;
    businessName: string;
    challenges: string;
    consent: boolean;
    submitting: boolean;
    submitted: boolean;
    formError: string;
  };
  setFormState: React.Dispatch<React.SetStateAction<any>>;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    icon: Palette,
    title: "Bespoke 'Anti-Template' Theme Engineering",
    description: "100% custom-coded storefronts using clean Liquid and CSS. No slow templates, page builders, or buggy AI-generated code.",
    features: [
      "Unique designs tailored to your brand story",
      "Interactive swatches, quick-add & visual slide-outs",
      "Fully responsive layouts optimized for all screens",
      "Staging-first deployment with Shopify CLI & version control",
    ],
  },
  {
    icon: Zap,
    title: "The 'App-Killer' Protocol",
    description: "We hardcode cart drawers, size guides, custom filters, and native bundling engines using Shopify's modern Cart Transform API & Bundles API to eliminate slow 3rd-party subscription apps.",
    features: [
      "Saves $1,200 - $4,800/year in app fees",
      "Bypasses default 100-variant limits securely",
      "Removes heavy JavaScript script bloat",
      "Boosts mobile Lighthouse speed scores to 90+",
      "One-time setup with lifetime code ownership",
    ],
  },
  {
    icon: Code,
    title: "Custom Shopify App & API Development",
    description: "Secure private or public Shopify applications to handle complex workflows, custom discounts, and internal ERP syncing.",
    features: [
      "Private database and API integration",
      "Custom Shopify webhooks for real-time syncing",
      "Enterprise-standard security compliance",
      "Scalable architectures on dedicated servers",
    ],
  },
  {
    icon: Globe,
    title: "Bespoke Headless Storefronts (Hydrogen & Oxygen)",
    description: "Next-generation decoupled stores using React, Remix, and Shopify’s Hydrogen framework, deployed on global Oxygen edge hosting.",
    features: [
      "Sub-second page loads and zero layout shifts (CLS)",
      "Complete creative design freedom away from Liquid constraints",
      "Edge-cached content delivery via global Oxygen CDN",
      "Unified Shopify checkout, payment & inventory integration",
    ],
  },
  {
    icon: Camera,
    title: "Product Photography & UGC Sourcing",
    description: "High-end product photography, professional styling/staging, and lifestyle UGC content that converts casual browsers into buyers.",
    features: [
      "Staging & editing for clothing, accessories & hardware",
      "Compressed, high-resolution WebP web-optimized assets",
      "Sourcing and vetting of creators and models",
      "Consistent brand aesthetic across all pages",
    ],
  },
  {
    icon: Layers,
    title: "Enterprise Variant Catalog Management",
    description: "Organize and upload massive product databases of up to 13,000+ variants cleanly without breaching API limits.",
    features: [
      "Custom AJAX variant selector grids",
      "Year/Make/Model automotive & parts search integrations",
      "Bulk CSV schema mapping and upload workflows",
      "Bypasses default Shopify catalog limits",
    ],
  },
  {
    icon: Box,
    title: "WebGL & 3D Interactive Product Models",
    description: "WebGL viewer integrations on your Product Details Page (PDP) to show premium product dimensions, materials, and textures.",
    features: [
      "AR/VR-ready interactive 3D product models",
      "360-degree rotation and close-up zoom detail",
      "Reduced product returns by up to 40%",
      "Increased buyer engagement and conversion rates",
    ],
  },
  {
    icon: RefreshCw,
    title: "Lossless Migrations from Any Host",
    description: "Safe transitions to Shopify Plus or Standard from WooCommerce, Magento, Squarespace, Webflow, or custom backends.",
    features: [
      "100% preservation of SEO metadata and rankings",
      "Flawless customer profile, product & history transfers",
      "Recharge/Bold to native Shopify Subscriptions token migrations",
      "Scheduled midnight cutovers for zero downtime",
    ],
  },
  {
    icon: Search,
    title: "SEO, GEO & AEO Search Domination",
    description: "A 3-tier approach covering classic search engine indexing, generative engine optimization, and direct answer optimizations.",
    features: [
      "Dynamic Product, Article & structured FAQ schemas",
      "Content structured to be scraped & cited by AI searches",
      "Google Universal Commerce Protocol integration",
      "Featured snippets and voice search optimization",
    ],
  },
  {
    icon: Sparkles,
    title: "Brand Story, Logos & Packaging Development",
    description: "Complete visual identity design from scratch, establishing your brand theory and designing custom physical packaging structures.",
    features: [
      "Bespoke logo marks and corporate typography kits",
      "Brand style guide books defining your tone of voice",
      "Custom unboxing experience & packaging structural designs",
      "Distinct market positioning strategies",
    ],
  },
  {
    icon: BarChart3,
    title: "Ad Account Scaling & Organic Social",
    description: "Scale your acquisition funnels across Google, Meta, and TikTok, alongside organic Instagram & Facebook page management.",
    features: [
      "Meta, Google, and TikTok ad account daily optimization",
      "Organic Instagram & Facebook page & content management",
      "Brand-aligned social creative matching your store's visual DNA",
      "Landing page CRO loops aligned with ad creatives",
    ],
  },
  {
    icon: Monitor,
    title: "Multi-Platform Alternative Development",
    description: "Professional development for custom web requirements across alternative web environments (Framer, Webflow, WooCommerce).",
    features: [
      "High-fidelity Framer pages with custom motion design",
      "Complex Webflow CMS structures & UI templates",
      "Scalable self-hosted WooCommerce storefront solutions",
      "Custom cross-platform backend API connections",
    ],
  },
  {
    icon: ShieldAlert,
    title: "Checkout Extensibility & Functions Migration",
    description: "Seamlessly transition from checkout.liquid to Shopify Checkout Extensibility and replace legacy Shopify Scripts with custom Shopify Functions.",
    features: [
      "Lossless migration of your checkout custom fields and styles",
      "Custom Shopify Functions for advanced discount & shipping rules",
      "Zero-downtime integration verifying existing checkout flows",
      "Ensures full compliance with Shopify's latest standards",
    ],
  },
  {
    icon: Activity,
    title: "Server-Side Tracking & Attribution (GA4 & CAPI)",
    description: "Bypass checkout sandbox limitations and browser-based ad blocking. We deploy server-side GTM pipelines for 100% data fidelity.",
    features: [
      "100% accurate ad attribution tracking for Meta, TikTok & Google",
      "Server-to-server Conversions API (CAPI) workflow deployment",
      "Google Analytics 4 (GA4) server-side profiling",
      "Reduces page-weight by removing client-side scripts",
    ],
  },
  {
    icon: Shield,
    title: "Ongoing Support & Store Retainers",
    description: "Consistent, on-demand support retainers where we act as your dedicated Shopify and website manager. We deploy updates immediately.",
    features: [
      "On-demand storefront tweaks, banners & navigation menu updates",
      "Uploading new collections, product images & managing layouts",
      "Consistent daily support channel to keep your site bug-free",
      "Fast-response communication via Slack, WhatsApp or Telegram",
    ],
  }
];

export const BookFlip: React.FC<BookFlipProps> = ({ onFormSubmit, formState, setFormState }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalLeafs = 10; 

  // Drag physics states
  const [draggingLeafIndex, setDraggingLeafIndex] = useState<number | null>(null);
  const [dragDirection, setDragDirection] = useState<"forward" | "backward" | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef(0);
  const leafWidth = 390; 

  // Page flipping cinematic states
  const [flippingLeaf, setFlippingLeaf] = useState<{ index: number; dir: "forward" | "backward" } | null>(null);
  const prevPageRef = useRef(currentPage);
  const wasDraggingRef = useRef(false);

  // Dynamic Z-Index stack calculator to eliminate overlap/clipping glitches during flips
  const getLeafZIndex = (index: number) => {
    if (draggingLeafIndex === index) return 100;
    if (flippingLeaf?.index === index) return 90;
    if (index === 0) return currentPage > 0 ? 10 : 30;
    if (index === 10) return currentPage > 10 ? 30 : 10;
    return index < currentPage ? 10 + index : 30 - index;
  };

  useEffect(() => {
    const prev = prevPageRef.current;
    const next = currentPage;
    prevPageRef.current = next;

    if (prev !== next) {
      if (wasDraggingRef.current) {
        wasDraggingRef.current = false;
        return;
      }

      const index = next > prev ? prev : next;
      const dir = next > prev ? "forward" : "backward";
      setFlippingLeaf({ index, dir });
      
      const timer = setTimeout(() => {
        setFlippingLeaf(null);
      }, 1200); // matches the 1.2s animation duration
      
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentPage < totalLeafs) {
        setCurrentPage(prev => prev + 1);
      } else if (e.key === "ArrowLeft" && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage]);

  // Handle window mousemove and mouseup to track dragging safely outside leaf bounds
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingLeafIndex === null) return;
      const deltaX = e.clientX - dragStartX.current;
      setDragOffset(deltaX);
    };

    const handleMouseUp = () => {
      if (draggingLeafIndex === null) return;

      const threshold = 100; // Drag threshold to flip page
      if (dragDirection === "forward" && dragOffset < -threshold) {
        wasDraggingRef.current = true;
        setCurrentPage(prev => Math.min(totalLeafs, prev + 1));
      } else if (dragDirection === "backward" && dragOffset > threshold) {
        wasDraggingRef.current = true;
        setCurrentPage(prev => Math.max(0, prev - 1));
      }

      setDraggingLeafIndex(null);
      setDragDirection(null);
      setDragOffset(0);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (draggingLeafIndex === null) return;
      const deltaX = e.touches[0].clientX - dragStartX.current;
      setDragOffset(deltaX);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [draggingLeafIndex, dragDirection, dragOffset]);

  const startDrag = (e: React.MouseEvent | React.TouchEvent, index: number, direction: "forward" | "backward") => {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "BUTTON") {
      return;
    }

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    dragStartX.current = clientX;
    setDraggingLeafIndex(index);
    setDragDirection(direction);
    setDragOffset(0);
  };

  const nextSpread = () => {
    if (currentPage < totalLeafs) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevSpread = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const jumpToSpread = (index: number) => {
    setCurrentPage(index);
  };

  const getLeafRotation = (index: number) => {
    if (draggingLeafIndex === index) {
      if (dragDirection === "forward") {
        const percentage = Math.min(0, Math.max(-1, dragOffset / leafWidth));
        return percentage * 180;
      } else {
        const percentage = Math.max(0, Math.min(1, dragOffset / leafWidth));
        return -180 + (percentage * 180);
      }
    }
    if (index < currentPage) {
      return -180;
    }
    return 0;
  };

  const isLeafInteractive = (index: number) => {
    if (draggingLeafIndex === index) return true;
    return index === currentPage - 1 || index === currentPage;
  };

  const isLeafFlipped = (index: number) => {
    return index < currentPage;
  };

  const getFlippingClass = (index: number) => {
    if (flippingLeaf?.index !== index) return "";
    return flippingLeaf.dir === "forward" ? "flip-forward" : "flip-backward";
  };

  return (
    <div className="w-full">
      {/* 3D Book Layout for Desktop / Tablet Landscape */}
      <div className="hidden md:block">
        <div className="book-viewport">
          
          {/* Elegant Floating Navigation Buttons */}
          {currentPage > 0 && (
            <button 
              onClick={prevSpread} 
              className="absolute left-10 lg:left-24 z-50 p-4 rounded-full border border-beige/40 bg-black/60 text-beige hover:bg-beige hover:text-black transition-all duration-300 shadow-lg"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {currentPage < totalLeafs && (
            <button 
              onClick={nextSpread} 
              className="absolute right-10 lg:right-24 z-50 p-4 rounded-full border border-beige/40 bg-black/60 text-beige hover:bg-beige hover:text-black transition-all duration-300 shadow-lg"
              aria-label="Next Page"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div className={`book-wrapper ${currentPage === 0 ? "closed" : "open"}`}>
            
            {/* Book Spine (3D cylinder structure) */}
            <div className="book-spine-3d"></div>

            {/* Bookmark ribbon */}
            <div className="bookmark-ribbon" style={{
              transform: currentPage === 0 ? "translateX(-50%) translateZ(-4px) rotateZ(-0.5deg)" : "translateX(-50%) translateZ(4px) rotateZ(1deg) scaleY(0.96)"
            }}></div>

            {/* Thickness / Edge effects */}
            {currentPage > 0 && <div className="book-thickness-left"></div>}
            {currentPage < totalLeafs && <div className="book-thickness-right"></div>}

            {/* ─── LEAF 0: FRONT COVER ─── */}
            <div 
              className={`page-leaf ${draggingLeafIndex === 0 ? "dragging" : ""} ${getFlippingClass(0)}`}
              style={{
                transform: `rotateY(${getLeafRotation(0)}deg)`,
                zIndex: getLeafZIndex(0),
                transition: draggingLeafIndex === 0 ? "none" : "transform 1.2s cubic-bezier(0.25, 1, 0.3, 1)",
                pointerEvents: "none"
              }}
              onMouseDown={(e) => startDrag(e, 0, "forward")}
              onTouchStart={(e) => startDrag(e, 0, "forward")}
            >
              {/* Cover Front (Right page when book is closed) */}
              <div className="page-side book-cover book-cover-front" style={{ pointerEvents: (isLeafInteractive(0) && !isLeafFlipped(0)) ? "auto" : "none" }}>
                <div className="cover-gold-trim">
                  <div className="w-16 h-16 rounded-full bg-beige/10 flex items-center justify-center border border-beige/35 mb-4 shadow-inner">
                    <BookOpen className="w-8 h-8 text-beige" />
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold tracking-widest text-beige text-center mb-2 font-serif">
                    OUR SERVICES
                  </h1>
                  <div className="w-24 h-0.5 bg-beige/45 mb-4"></div>
                  <p className="text-xs tracking-widest text-beige/60 uppercase font-mono">
                    Shopify Dev Studio
                  </p>
                  <div className="page-corner-peel"></div>
                  <p className="text-[10px] text-beige/45 absolute bottom-8 uppercase tracking-widest">
                    Est. 2026 • Drag Page Edge to Flip
                  </p>
                </div>
              </div>

              {/* Cover Inside Left (Left page when cover is flipped open) */}
              <div className="page-side book-cover book-cover-back page-leaf-back page-left" style={{ pointerEvents: (isLeafInteractive(0) && isLeafFlipped(0)) ? "auto" : "none" }}>
                <div className="cover-gold-trim opacity-60">
                  <p className="text-beige/70 italic text-sm text-center px-8">
                    "Crafting ultra-performance digital boutique storefronts with absolute code integrity and robust architecture."
                  </p>
                </div>
              </div>
            </div>

            {/* ─── LEAF 1: WELCOME & INTRO SPREAD ─── */}
            <div 
              className={`page-leaf ${draggingLeafIndex === 1 ? "dragging" : ""} ${getFlippingClass(1)}`}
              style={{
                transform: `rotateY(${getLeafRotation(1)}deg)`,
                zIndex: getLeafZIndex(1),
                transition: draggingLeafIndex === 1 ? "none" : "transform 1.2s cubic-bezier(0.25, 1, 0.3, 1)",
                pointerEvents: "none"
              }}
              onMouseDown={(e) => {
                if (currentPage > 1) {
                  startDrag(e, 1, "backward");
                } else {
                  startDrag(e, 1, "forward");
                }
              }}
              onTouchStart={(e) => {
                if (currentPage > 1) {
                  startDrag(e, 1, "backward");
                } else {
                  startDrag(e, 1, "forward");
                }
              }}
            >
              {/* Front side (Right page when unflipped): Page 1 (Intro) */}
              <div className="page-side light-page" style={{ pointerEvents: (isLeafInteractive(1) && !isLeafFlipped(1)) ? "auto" : "none" }}>
                <div className="page-spine-shadow-right"></div>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-beige font-semibold">01 / Introduction</span>
                    <h2 className="text-2xl font-bold mt-2 mb-4 font-serif text-charcoal">Architectural Philosophy</h2>
                    <p className="text-xs text-charcoal/80 leading-relaxed mb-4">
                      Welcome to the premium Shopify Solutions Architect catalog. Each section in this ledger outlines a custom-coded system built natively for Shopify's Modern architecture.
                    </p>
                    <p className="text-xs text-charcoal/80 leading-relaxed">
                      We avoid heavy builder templates and bloated plug-ins, returning full speed, security, and checkout extensibility control to elite merchants.
                    </p>
                  </div>
                  <div className="page-corner-peel"></div>
                  <div className="border-t border-charcoal/10 pt-4">
                    <span className="text-[10px] text-charcoal/40 font-mono">PAGE 1</span>
                  </div>
                </div>
              </div>

              {/* Back side (Left page when flipped): Page 2 (Table of Contents) */}
              <div className="page-side light-page page-leaf-back page-left" style={{ pointerEvents: (isLeafInteractive(1) && isLeafFlipped(1)) ? "auto" : "none" }}>
                <div className="page-spine-shadow-left"></div>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-beige font-semibold">02 / Index</span>
                    <h2 className="text-2xl font-bold mt-2 mb-4 font-serif text-charcoal">Table of Contents</h2>
                    <ul className="space-y-1.5 text-xs text-charcoal/70">
                      <li><strong>Sec I:</strong> Anti-Template Themes & App-Killer (Page 3)</li>
                      <li><strong>Sec II:</strong> App Dev & Headless (Page 5)</li>
                      <li><strong>Sec III:</strong> Photography & Catalog Management (Page 7)</li>
                      <li><strong>Sec IV:</strong> WebGL 3D & Migration Suite (Page 9)</li>
                      <li><strong>Sec V:</strong> Search Engine Domination & Branding (Page 11)</li>
                      <li><strong>Sec VI:</strong> Acquisition & Custom Integrations (Page 13)</li>
                      <li><strong>Sec VII:</strong> Checkout Extensibility & Server GA4 (Page 15)</li>
                      <li><strong>Sec VIII:</strong> Ongoing Retainers & Blueprint (Page 17)</li>
                    </ul>
                  </div>
                  <div className="page-corner-peel-left"></div>
                  <div className="border-t border-charcoal/10 pt-4 flex justify-between">
                    <span className="text-[10px] text-charcoal/40 font-mono">PAGE 2</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── DYNAMIC SPREADS FOR SERVICES (S1 - S7) ─── */}
            {[0, 1, 2, 3, 4, 5, 6].map((spreadIndex) => {
              const s1 = SERVICES_DATA[spreadIndex * 2];
              const s2 = SERVICES_DATA[spreadIndex * 2 + 1];
              const leafIndex = spreadIndex + 2; 

              return (
                <div 
                  key={spreadIndex}
                  className={`page-leaf ${draggingLeafIndex === leafIndex ? "dragging" : ""} ${getFlippingClass(leafIndex)}`}
                  style={{
                    transform: `rotateY(${getLeafRotation(leafIndex)}deg)`,
                    zIndex: getLeafZIndex(leafIndex),
                    transition: draggingLeafIndex === leafIndex ? "none" : "transform 1.2s cubic-bezier(0.25, 1, 0.3, 1)",
                    pointerEvents: "none"
                  }}
                  onMouseDown={(e) => {
                    if (currentPage > leafIndex) {
                      startDrag(e, leafIndex, "backward");
                    } else {
                      startDrag(e, leafIndex, "forward");
                    }
                  }}
                  onTouchStart={(e) => {
                    if (currentPage > leafIndex) {
                      startDrag(e, leafIndex, "backward");
                    } else {
                      startDrag(e, leafIndex, "forward");
                    }
                  }}
                >
                  {/* Front side (Right page when unflipped): Service 2k-1 */}
                  <div className="page-side light-page" style={{ pointerEvents: (isLeafInteractive(leafIndex) && !isLeafFlipped(leafIndex)) ? "auto" : "none" }}>
                    <div className="page-spine-shadow-right"></div>
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded bg-beige/15 flex items-center justify-center border border-beige/20">
                            {s1 && <s1.icon className="w-4.5 h-4.5 text-beige" />}
                          </div>
                          <span className="text-[10px] uppercase tracking-wider text-beige font-semibold">Service Option {spreadIndex * 2 + 1}</span>
                        </div>
                        <h3 className="text-xl font-bold font-serif text-charcoal mb-2 leading-tight">{s1?.title}</h3>
                        <p className="text-xs text-charcoal/80 leading-relaxed mb-4">{s1?.description}</p>
                        
                        <ul className="space-y-1.5">
                          {s1?.features.map((feat, fi) => (
                            <li key={fi} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-beige rounded-full mt-1.5 flex-shrink-0" />
                              <span className="text-[10px] text-charcoal/70 leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="page-corner-peel"></div>
                      <div className="border-t border-charcoal/10 pt-4">
                        <span className="text-[10px] text-charcoal/40 font-mono">PAGE {leafIndex * 2 - 1}</span>
                      </div>
                    </div>
                  </div>

                  {/* Back side (Left page when flipped): Service 2k */}
                  <div className="page-side light-page page-leaf-back page-left" style={{ pointerEvents: (isLeafInteractive(leafIndex) && isLeafFlipped(leafIndex)) ? "auto" : "none" }}>
                    <div className="page-spine-shadow-left"></div>
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        {s2 ? (
                          <>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 rounded bg-beige/15 flex items-center justify-center border border-beige/20">
                                <s2.icon className="w-4.5 h-4.5 text-beige" />
                              </div>
                              <span className="text-[10px] uppercase tracking-wider text-beige font-semibold">Service Option {spreadIndex * 2 + 2}</span>
                            </div>
                            <h3 className="text-xl font-bold font-serif text-charcoal mb-2 leading-tight">{s2.title}</h3>
                            <p className="text-xs text-charcoal/80 leading-relaxed mb-4">{s2.description}</p>
                            
                            <ul className="space-y-1.5">
                              {s2.features.map((feat, fi) => (
                                <li key={fi} className="flex items-start gap-2">
                                  <div className="w-1 h-1 bg-beige rounded-full mt-1.5 flex-shrink-0" />
                                  <span className="text-[10px] text-charcoal/70 leading-snug">{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full pt-16">
                            <span className="text-charcoal/30 italic text-sm">Services Ledger</span>
                          </div>
                        )}
                      </div>
                      <div className="page-corner-peel-left"></div>
                      <div className="border-t border-charcoal/10 pt-4">
                        <span className="text-[10px] text-charcoal/40 font-mono">PAGE {leafIndex * 2}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ─── LEAF 9: SERVICE 15 & FREE AUDIT FORM ─── */}
            <div 
              className={`page-leaf ${draggingLeafIndex === 9 ? "dragging" : ""} ${getFlippingClass(9)}`}
              style={{
                transform: `rotateY(${getLeafRotation(9)}deg)`,
                zIndex: getLeafZIndex(9),
                transition: draggingLeafIndex === 9 ? "none" : "transform 1.2s cubic-bezier(0.25, 1, 0.3, 1)",
                pointerEvents: "none"
              }}
              onMouseDown={(e) => {
                if (currentPage > 9) {
                  startDrag(e, 9, "backward");
                } else {
                  startDrag(e, 9, "forward");
                }
              }}
              onTouchStart={(e) => {
                if (currentPage > 9) {
                  startDrag(e, 9, "backward");
                } else {
                  startDrag(e, 9, "forward");
                }
              }}
            >
              {/* Front side (Right page when unflipped): Service 15 */}
              <div className="page-side light-page" style={{ pointerEvents: (isLeafInteractive(9) && !isLeafFlipped(9)) ? "auto" : "none" }}>
                <div className="page-spine-shadow-right"></div>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded bg-beige/15 flex items-center justify-center border border-beige/20">
                        <Shield className="w-4.5 h-4.5 text-beige" />
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-beige font-semibold">Service Option 15</span>
                    </div>
                    <h3 className="text-xl font-bold font-serif text-charcoal mb-2 leading-tight">{SERVICES_DATA[14].title}</h3>
                    <p className="text-xs text-charcoal/80 leading-relaxed mb-4">{SERVICES_DATA[14].description}</p>
                    <ul className="space-y-1.5">
                      {SERVICES_DATA[14].features.map((feat, fi) => (
                        <li key={fi} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-beige rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-[10px] text-charcoal/70 leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="page-corner-peel"></div>
                  <div className="border-t border-charcoal/10 pt-4">
                    <span className="text-[10px] text-charcoal/40 font-mono">PAGE 17</span>
                  </div>
                </div>
              </div>

              {/* Back side (Left page when flipped): Free Audit Form */}
              <div className="page-side light-page page-leaf-back page-left" style={{ pointerEvents: (isLeafInteractive(9) && isLeafFlipped(9)) ? "auto" : "none" }}>
                <div className="page-spine-shadow-left"></div>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-beige font-semibold">Free Audit Request</span>
                    <h3 className="text-lg font-bold font-serif text-charcoal mt-1 mb-3">Visual Performance Blueprint</h3>
                    
                    {formState.submitted ? (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-beige/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-beige" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h4 className="text-charcoal font-bold text-sm mb-1">Audit Ordered!</h4>
                        <p className="text-charcoal/60 text-[10px] leading-relaxed">
                          We will evaluate your store and contact you in 24 hours.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={onFormSubmit} className="space-y-2.5">
                        <div>
                          <input 
                            type="url" 
                            id="storeUrl"
                            placeholder="Store URL *"
                            required
                            value={formState.storeUrl}
                            onChange={(e) => setFormState((prev: any) => ({ ...prev, storeUrl: e.target.value }))}
                            className="w-full bg-charcoal/5 border border-charcoal/10 text-xs rounded px-3 py-1.5 text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-beige"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="email" 
                            id="email"
                            placeholder="Email *"
                            required
                            value={formState.email}
                            onChange={(e) => setFormState((prev: any) => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-charcoal/5 border border-charcoal/10 text-xs rounded px-3 py-1.5 text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-beige"
                          />
                          <input 
                            type="text" 
                            placeholder="Business Name"
                            value={formState.businessName}
                            onChange={(e) => setFormState((prev: any) => ({ ...prev, businessName: e.target.value }))}
                            className="w-full bg-charcoal/5 border border-charcoal/10 text-xs rounded px-3 py-1.5 text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-beige"
                          />
                        </div>
                        <div>
                          <textarea 
                            placeholder="Key Challenges (Optional)"
                            rows={2}
                            value={formState.challenges}
                            onChange={(e) => setFormState((prev: any) => ({ ...prev, challenges: e.target.value }))}
                            className="w-full bg-charcoal/5 border border-charcoal/10 text-xs rounded px-3 py-1.5 text-charcoal placeholder-charcoal/40 resize-none focus:outline-none focus:border-beige"
                          />
                        </div>
                        <div className="flex items-start gap-2">
                          <input 
                            type="checkbox" 
                            id="consent" 
                            checked={formState.consent}
                            onChange={(e) => setFormState((prev: any) => ({ ...prev, consent: e.target.checked }))}
                            className="w-3.5 h-3.5 mt-0.5 accent-beige"
                          />
                          <label htmlFor="consent" className="text-[9px] text-charcoal/60 leading-tight">
                            I consent to receive a free store performance audit report.
                          </label>
                        </div>

                        {formState.formError && (
                          <p className="text-[10px] text-red-500 font-medium">{formState.formError}</p>
                        )}

                        <button 
                          type="submit" 
                          disabled={formState.submitting}
                          className="w-full bg-beige text-black text-xs font-semibold py-2 rounded hover:bg-beige/90 transition-colors disabled:opacity-50"
                        >
                          {formState.submitting ? "Analyzing..." : "Get Blueprint"}
                        </button>
                      </form>
                    )}
                  </div>
                  <div className="page-corner-peel-left"></div>
                  <div className="border-t border-charcoal/10 pt-4 flex justify-between">
                    <span className="text-[10px] text-charcoal/40 font-mono">PAGE 18</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── BACK COVER ─── */}
            <div 
              className={`page-leaf ${draggingLeafIndex === 10 ? "dragging" : ""} ${getFlippingClass(10)}`}
              style={{
                transform: `rotateY(${getLeafRotation(10)}deg)`,
                zIndex: getLeafZIndex(10),
                transition: draggingLeafIndex === 10 ? "none" : "transform 1.2s cubic-bezier(0.25, 1, 0.3, 1)",
                pointerEvents: "none"
              }}
              onMouseDown={(e) => {
                if (currentPage > 10) {
                  startDrag(e, 10, "backward");
                }
              }}
              onTouchStart={(e) => {
                if (currentPage > 10) {
                  startDrag(e, 10, "backward");
                }
              }}
            >
              {/* Back Cover Inside Right */}
              <div className="page-side book-cover book-cover-back" style={{ pointerEvents: (isLeafInteractive(10) && !isLeafFlipped(10)) ? "auto" : "none" }}>
                <div className="cover-gold-trim opacity-60">
                  <p className="text-beige/70 italic text-sm text-center px-8">
                    Shopify Dev Studio
                  </p>
                </div>
              </div>

              {/* Back Cover Outside */}
              <div className="page-side book-cover book-cover-front page-leaf-back page-left" style={{ pointerEvents: (isLeafInteractive(10) && isLeafFlipped(10)) ? "auto" : "none" }}>
                <div className="cover-gold-trim">
                  <div className="w-12 h-12 rounded-full border border-beige/40 flex items-center justify-center mb-3">
                    <span className="text-beige text-lg font-serif">S</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-beige/80">Shopify Dev Studio</p>
                  <p className="text-[9px] text-beige/50 font-mono mt-1">shopifydevstudioo@gmail.com</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Chapter / Spread Tab Selectors at base */}
        <div className="flex justify-center items-center gap-1.5 mt-8 max-w-xl mx-auto flex-wrap">
          {Array.from({ length: totalLeafs + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => jumpToSpread(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentPage === index 
                  ? "w-8 bg-beige" 
                  : "w-2 bg-beige/30 hover:bg-beige/50"
              }`}
              title={`Jump to Spread ${index}`}
            />
          ))}
        </div>
      </div>

      {/* ─── MOBILE / TABLET PORTRAIT VIEW ─── */}
      <div className="block md:hidden px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-beige/10 to-charcoal border border-beige/25 rounded-2xl p-6 text-center shadow-md">
            <BookOpen className="w-8 h-8 text-beige mx-auto mb-3" />
            <h3 className="text-xl font-bold font-serif text-beige mb-2">Our Services Catalog</h3>
            <p className="text-xs theme-text-sec leading-relaxed">
              Browse through our premium, natively engineered Shopify services below. Tap any card to review full specifications.
            </p>
          </div>

          <div className="space-y-4">
            {SERVICES_DATA.map((service, idx) => {
              const IconComp = service.icon;
              return (
                <div 
                  key={idx}
                  className="theme-card border border-[var(--theme-border)] rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded bg-beige/15 flex items-center justify-center border border-beige/20">
                      <IconComp className="w-4 h-4 text-beige" />
                    </div>
                    <h4 className="text-sm font-bold theme-text leading-tight">{service.title}</h4>
                  </div>
                  <p className="text-xs theme-text-sec mb-4 leading-relaxed">{service.description}</p>
                  <ul className="space-y-1.5 border-t border-[var(--theme-border)] pt-3">
                    {service.features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-beige rounded-full mt-1.5" />
                        <span className="text-xs theme-text-sec">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Audit Form Mobile */}
          <div className="theme-card border border-beige/25 rounded-xl p-5 mt-4">
            <h3 className="text-lg font-bold font-serif text-beige mb-2">Get Free Audit</h3>
            <p className="text-xs theme-text-sec mb-4">
              Enter your store URL to order a free visual performance blueprint.
            </p>

            {formState.submitted ? (
              <div className="text-center py-4 bg-beige/5 rounded-lg border border-beige/15">
                <span className="text-beige font-semibold text-sm">Request Submitted Successfully!</span>
              </div>
            ) : (
              <form onSubmit={onFormSubmit} className="space-y-3">
                <input 
                  type="url" 
                  id="mobile-storeUrl"
                  placeholder="Your Store URL *"
                  required
                  value={formState.storeUrl}
                  onChange={(e) => setFormState((prev: any) => ({ ...prev, storeUrl: e.target.value }))}
                  className="w-full bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded px-3 py-2 text-xs theme-text placeholder-gray-500 focus:outline-none focus:border-beige"
                />
                <input 
                  type="email" 
                  id="mobile-email"
                  placeholder="Your Email *"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState((prev: any) => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded px-3 py-2 text-xs theme-text placeholder-gray-500 focus:outline-none focus:border-beige"
                />
                <input 
                  type="text" 
                  placeholder="Business Name"
                  value={formState.businessName}
                  onChange={(e) => setFormState((prev: any) => ({ ...prev, businessName: e.target.value }))}
                  className="w-full bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded px-3 py-2 text-xs theme-text placeholder-gray-500 focus:outline-none focus:border-beige"
                />
                <textarea 
                  placeholder="What challenges are you facing?"
                  rows={3}
                  value={formState.challenges}
                  onChange={(e) => setFormState((prev: any) => ({ ...prev, challenges: e.target.value }))}
                  className="w-full bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded px-3 py-2 text-xs theme-text placeholder-gray-500 resize-none focus:outline-none focus:border-beige"
                />
                <div className="flex items-start gap-2">
                  <input 
                    type="checkbox" 
                    id="mobile-consent"
                    checked={formState.consent}
                    onChange={(e) => setFormState((prev: any) => ({ ...prev, consent: e.target.checked }))}
                    className="w-4 h-4 mt-0.5 accent-beige"
                  />
                  <label htmlFor="mobile-consent" className="text-xs theme-text-sec">
                    I agree to receive a free visual store analysis report.
                  </label>
                </div>

                {formState.formError && (
                  <p className="text-xs text-red-500 font-medium">{formState.formError}</p>
                )}

                <button 
                  type="submit" 
                  disabled={formState.submitting}
                  className="w-full bg-beige text-black text-sm font-semibold py-2.5 rounded hover:bg-beige/90 transition-colors disabled:opacity-50"
                >
                  {formState.submitting ? "Submitting..." : "Request Free Audit"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
