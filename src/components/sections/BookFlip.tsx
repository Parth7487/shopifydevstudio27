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
  subtitle: string;
  description: string;
  features: string[];
  price: string;
  subBadges: string[];
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
    subtitle: "CUSTOM SHOPIFY SYNTHESIS",
    price: "$12,000",
    subBadges: ["CUSTOM SHOPIFY SYNTHESIS", "ZERO LAYOUT SHIFTS & SUPERFAST LOAD SPEED"],
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
    subtitle: "NATIVE FUNCTION INJECTION",
    price: "$4,500",
    subBadges: ["NATIVE FUNCTION INJECTION", "ONE-TIME SETUP WITH LIFETIME CODE OWNERSHIP"],
    description: "We replace bloated 3rd-party subscription apps (like cart drawers, size guides, custom filters, and product add-ons) with native, lightweight Liquid and CSS.",
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
    subtitle: "PRIVATE API INTEGRATION",
    price: "$8,000",
    subBadges: ["PRIVATE API INTEGRATION", "PERFECT FOR ERP & GLOBAL CRM PIPELINES"],
    description: "We build custom private or public Shopify applications to handle proprietary business logic and integrations.",
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
    subtitle: "DECOUPLED REACT ARCHITECTURE",
    price: "$15,000",
    subBadges: ["DECOUPLED REACT ARCHITECTURE", "ULTIMATE PERFORMANCE FOR HIGH-VOLUME LEADERS"],
    description: "Next-generation decoupled stores using React, Remix, and Shopify's Hydrogen framework, deployed on global Oxygen edge hosting.",
    features: [
      "Sub-second page loads and zero layout shifts (CLS)",
      "Complete creative design freedom away from Liquid constraints",
      "Edge-cached content delivery via global Oxygen CDN",
      "Unified Shopify checkout, payment & inventory integration",
    ],
  },
  {
    icon: Camera,
    title: "Product Photography, Staging & UGC Sourcing",
    subtitle: "HIGH-FIDELITY ASSETS DELIVERY",
    price: "$3,500",
    subBadges: ["HIGH-FIDELITY ASSETS DELIVERY", "EDITORIAL STAGING & CONTENT SOURCING"],
    description: "Full-suite editorial product photography, professional styling, lifestyle UGC model sourcing, and high-fidelity post-production editing.",
    features: [
      "Staging & editing for clothing, accessories & hardware",
      "Compressed, high-resolution WebP web-optimized assets",
      "Sourcing and vetting of creators and models",
      "Consistent brand aesthetic across all pages",
    ],
  },
  {
    icon: Box,
    title: "WebGL & 3D Interactive Product Modeling",
    subtitle: "INTERACTIVE VIEWPORT RENDER",
    price: "$6,000",
    subBadges: ["INTERACTIVE VIEWPORT RENDER", "AR/VR-READY WEBGL DESIGN"],
    description: "We create web-ready 3D product models and integrate WebGL viewers directly on your Product Details Page (PDP).",
    features: [
      "AR/VR-ready interactive 3D product models",
      "360-degree rotation and close-up zoom detail",
      "Reduced product returns by up to 40%",
      "Increased buyer engagement and conversion rates",
    ],
  },
  {
    icon: Sparkles,
    title: "Brand Identity, Storytelling & Packaging Development",
    subtitle: "CREATIVE IDENTITY & THEORY",
    price: "$7,500",
    subBadges: ["CREATIVE IDENTITY & THEORY", "BESPOKE VISUAL DESIGN & PACKAGING"],
    description: "We design your complete brand theory, design premium logos, outline your brand style books, and design custom unboxing packaging.",
    features: [
      "Bespoke logo marks and corporate typography kits",
      "Brand style guide books defining your tone of voice",
      "Custom unboxing experience & packaging structural designs",
      "Distinct market positioning strategies",
    ],
  },
  {
    icon: Layers,
    title: "Enterprise Variant Catalog Management",
    subtitle: "HEAVY DIRECTORY SCHEMA",
    price: "$5,000",
    subBadges: ["HEAVY DIRECTORY SCHEMA", "BULLSEYE SEO INDEXING FOR LARGER INVENTORIES"],
    description: "Custom-coded AJAX selector interfaces capable of organizing and managing massive directories of up to 13,000+ variants.",
    features: [
      "Custom AJAX variant selector grids",
      "Year/Make/Model automotive & parts search integrations",
      "Bulk CSV schema mapping and upload workflows",
      "Bypasses default Shopify catalog limits",
    ],
  },
  {
    icon: Search,
    title: "Complete Search Domination (SEO, GEO & AEO)",
    subtitle: "SEMANTIC KNOWLEDGE SCHEMA",
    price: "$3,000",
    subBadges: ["SEMANTIC KNOWLEDGE SCHEMA", "GENERATIVE ENGINE OPTIMIZATION"],
    description: "A 3-tier approach covering classic search engine indexing (SEO), generative engine optimization (GEO), and direct answer optimizations (AEO).",
    features: [
      "Dynamic Product, Article & structured FAQ schemas",
      "Content structured to be scraped & cited by AI searches",
      "Google Universal Commerce Protocol integration",
      "Featured snippets and voice search optimization",
    ],
  },
  {
    icon: BarChart3,
    title: "Ad Account Scaling & Organic Social Management",
    subtitle: "ACQUISITION FUNNEL ENGINEERING",
    price: "$4,500/mo",
    subBadges: ["ACQUISITION FUNNEL ENGINEERING", "HIGH-INTENT SOCIAL ACQUISITION"],
    description: "Scale paid acquisition across Google, Meta, and TikTok, alongside organic Instagram & Facebook page management.",
    features: [
      "Meta, Google, and TikTok ad account daily optimization",
      "Organic Instagram & Facebook page & content management",
      "Brand-aligned social creative matching your store's visual DNA",
      "Landing page CRO loops aligned with ad creatives",
    ],
  },
  {
    icon: RefreshCw,
    title: "Lossless Migrations from Any Hosting Provider",
    subtitle: "SOVEREIGN DATABASE RELOCATION",
    price: "$4,000",
    subBadges: ["SOVEREIGN DATABASE RELOCATION", "ZERO DOWNTIME TRANSITION GUARANTEE"],
    description: "Data-safe, lossless migrations from WooCommerce, Magento, Squarespace, Webflow, or custom CMS databases.",
    features: [
      "100% preservation of SEO metadata and rankings",
      "Flawless customer profile, product & history transfers",
      "Recharge/Bold to native Shopify Subscriptions token migrations",
      "Scheduled midnight cutovers for zero downtime",
    ],
  },
  {
    icon: Shield,
    title: "Ongoing Support & E-Commerce Store Management (Retainer)",
    subtitle: "DEDICATED MANAGED SERVICES",
    price: "$2,500/mo",
    subBadges: ["DEDICATED MANAGED SERVICES", "FAST-RESPONSE CODE MAINTENANCE"],
    description: "Consistent, on-demand support retainers where we act as your dedicated Shopify and website manager. We deploy updates immediately.",
    features: [
      "On-demand storefront tweaks, banners & navigation menu updates",
      "Uploading new collections, product images & managing layouts",
      "Consistent daily support channel to keep your site bug-free",
      "Fast-response communication via Slack, WhatsApp or Telegram",
    ],
  }
];

/* Compute the page number a service appears on inside the book */
const getServicePage = (idx: number): string => {
  const page = 3 + Math.floor(idx / 2);
  return String(page).padStart(2, '0');
};

export const BookFlip: React.FC<BookFlipProps> = ({ onFormSubmit, formState, setFormState }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalLeafs = 6; 

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
    if (index === 5) return currentPage > 5 ? 30 : 10;
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
      }, 1200);
      
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

      const threshold = 100;
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
      {/* ═══════ 3D Book Layout – Desktop / Tablet Landscape ═══════ */}
      <div className="hidden md:block">
        <div className="book-viewport">

          <div className={`book-wrapper ${currentPage === 0 ? "closed" : "open"}`}>
            
            {/* Book Spine (3D cylinder structure) */}
            <div className="book-spine-3d"></div>

            {/* Bookmark ribbon */}
            <div className="bookmark-ribbon" style={{
              transform: currentPage === 0 ? "translateX(-50%) translateZ(-4px) rotateZ(-0.5deg)" : "translateX(-50%) translateZ(4px) rotateZ(1deg) scaleY(0.96)"
            }}></div>

            {/* Spine gold dots */}
            {currentPage > 0 && (
              <>
                <div className="spine-dot" style={{ left: '50%', top: '-2px', transform: 'translateX(-50%)' }} />
                <div className="spine-dot" style={{ left: '50%', bottom: '-2px', transform: 'translateX(-50%)' }} />
              </>
            )}

            {/* Thickness / Edge effects */}
            {currentPage > 0 && <div className="book-thickness-left"></div>}
            {currentPage < totalLeafs && <div className="book-thickness-right"></div>}

            {/* ─── LEAF 0: FRONT COVER & INDEX ─── */}
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
              {/* Cover Front */}
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

              {/* Cover Inside Left (Index Page) */}
              <div className="page-side light-page page-leaf-back page-left" style={{ pointerEvents: (isLeafInteractive(0) && isLeafFlipped(0)) ? "auto" : "none" }}>
                <div className="page-spine-shadow-left"></div>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <h2 className="text-4xl font-black tracking-tight text-[#e8dfd2] font-serif mb-1" style={{ fontFamily: "'Georgia', serif" }}>INDEX</h2>
                    <p className="text-[11px] font-bold uppercase tracking-[3px] text-beige mb-1">Selected Services</p>
                    <p className="text-[8px] uppercase tracking-[2px] text-[#6a5d4e] mb-6">Designing with Purpose, Crafting with Passion.</p>
                    <p className="text-[10px] text-[#8a7d6e] leading-relaxed mb-4 text-justify">
                      A journey through our architectural Shopify and cloud database evolution, each service representing a unique story and a distinct performance challenge. From the first speed benchmarks to the final production live deployments, every customized module reflects our dedication to not only solving merchant performance bottlenecks but also creating highly tailored, exquisite storefront architectures.
                    </p>
                    <p className="text-[10px] text-[#8a7d6e] leading-relaxed text-justify">
                      As you explore these capabilities, we invite you to look beyond superficial templates and discover the complex core choreography, serverless synchronizations, and custom asset extractions that define our signature of digital commerce. Each page holds a piece of our engineering journey—where the art of high-end branding meets the strict science of high-throughput conversion.
                    </p>
                  </div>
                  <div className="page-corner-peel-left"></div>
                  <div className="page-footer pt-3">
                    <span className="footer-left-text">III</span>
                    <span className="footer-right-text">PORTFOLIO VOLUME II</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── LEAF 1: TOC & CATEGORY I LEFT ─── */}
            <div 
              className={`page-leaf ${draggingLeafIndex === 1 ? "dragging" : ""} ${getFlippingClass(1)}`}
              style={{
                transform: `rotateY(${getLeafRotation(1)}deg)`,
                zIndex: getLeafZIndex(1),
                transition: draggingLeafIndex === 1 ? "none" : "transform 1.2s cubic-bezier(0.25, 1, 0.3, 1)",
                pointerEvents: "none"
              }}
              onMouseDown={(e) => {
                if (currentPage > 1) { startDrag(e, 1, "backward"); }
                else { startDrag(e, 1, "forward"); }
              }}
              onTouchStart={(e) => {
                if (currentPage > 1) { startDrag(e, 1, "backward"); }
                else { startDrag(e, 1, "forward"); }
              }}
            >
              {/* Table of Contents (Front of Leaf 1) */}
              <div className="page-side light-page" style={{ pointerEvents: (isLeafInteractive(1) && !isLeafFlipped(1)) ? "auto" : "none", padding: '20px 24px' }}>
                <div className="page-spine-shadow-right"></div>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h2 className="text-[17px] font-bold italic text-[#e8dfd2]" style={{ fontFamily: "'Georgia', serif" }}>Shopify Dev Studio</h2>
                        <p className="text-[6.5px] uppercase tracking-[2px] text-[#6a5d4e] mt-0.5">Signature Services Catalog & Guide</p>
                      </div>
                      <div className="border border-beige/40 rounded-full px-3 py-1 flex-shrink-0">
                        <span className="text-[7px] text-beige uppercase tracking-wider font-semibold">Est. 2026</span>
                      </div>
                    </div>

                    {/* Service Index List */}
                    <div className="mt-2">
                      {SERVICES_DATA.map((service, idx) => (
                        <div key={idx} className="toc-entry">
                          <div className="toc-dot" />
                          <span className="toc-number">{String(idx + 1).padStart(2, '0')}</span>
                          <div className="toc-info">
                            <div className="toc-title">{service.title}</div>
                            <div className="toc-subtitle">{service.subtitle}</div>
                          </div>
                          <span className="toc-page">Page {getServicePage(idx)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="page-corner-peel"></div>
                  <div className="page-footer pt-3">
                    <span className="footer-left-text">SHOPIFY CUSTOM INDEX</span>
                    <span className="footer-right-text">IV</span>
                  </div>
                </div>
              </div>

              {/* Category I Left Page (Back of Leaf 1, Page 3) */}
              <div className="page-side light-page page-leaf-back page-left" style={{ pointerEvents: (isLeafInteractive(1) && isLeafFlipped(1)) ? "auto" : "none" }}>
                <div className="page-spine-shadow-left"></div>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="page-header mb-4">
                      <span className="header-category">I. LES INTERFACES PRIMORDIALES</span>
                      <span className="header-page">PAGE 03</span>
                    </div>

                    <div className="services-container space-y-6">
                      {renderServiceCard(SERVICES_DATA[0])}
                      {renderServiceCard(SERVICES_DATA[1])}
                    </div>
                  </div>
                  <div className="page-corner-peel-left"></div>
                  <div className="page-footer pt-3">
                    <span className="footer-left-text">PREMIUM CURATED OPTIONS</span>
                    <span className="footer-right-text">VOL. II | DIGITAL STAGING</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── LEAF 2: CATEGORY I RIGHT & CATEGORY II LEFT ─── */}
            <div 
              className={`page-leaf ${draggingLeafIndex === 2 ? "dragging" : ""} ${getFlippingClass(2)}`}
              style={{
                transform: `rotateY(${getLeafRotation(2)}deg)`,
                zIndex: getLeafZIndex(2),
                transition: draggingLeafIndex === 2 ? "none" : "transform 1.2s cubic-bezier(0.25, 1, 0.3, 1)",
                pointerEvents: "none"
              }}
              onMouseDown={(e) => {
                if (currentPage > 2) { startDrag(e, 2, "backward"); }
                else { startDrag(e, 2, "forward"); }
              }}
              onTouchStart={(e) => {
                if (currentPage > 2) { startDrag(e, 2, "backward"); }
                else { startDrag(e, 2, "forward"); }
              }}
            >
              {/* Category I Right Page (Front of Leaf 2, Page 4) */}
              <div className="page-side light-page" style={{ pointerEvents: (isLeafInteractive(2) && !isLeafFlipped(2)) ? "auto" : "none" }}>
                <div className="page-spine-shadow-right"></div>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="page-header mb-4">
                      <span className="header-category">I. LES INTERFACES PRIMORDIALES</span>
                      <span className="header-page">PAGE 04</span>
                    </div>

                    <div className="services-container space-y-6">
                      {renderServiceCard(SERVICES_DATA[2])}
                      {renderServiceCard(SERVICES_DATA[3])}
                    </div>
                  </div>
                  <div className="page-corner-peel"></div>
                  <div className="page-footer pt-3">
                    <span className="footer-left-text">CURATED BY SHOPIFY DEV STUDIO</span>
                    <span className="footer-right-text">VOL. III | ADVANCED SCALE</span>
                  </div>
                </div>
              </div>

              {/* Category II Left Page (Back of Leaf 2, Page 5) */}
              <div className="page-side light-page page-leaf-back page-left" style={{ pointerEvents: (isLeafInteractive(2) && isLeafFlipped(2)) ? "auto" : "none" }}>
                <div className="page-spine-shadow-left"></div>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="page-header mb-4">
                      <span className="header-category">II. L'ART ET LA MATIÈRE</span>
                      <span className="header-page">PAGE 05</span>
                    </div>

                    <div className="services-container space-y-6">
                      {renderServiceCard(SERVICES_DATA[4])}
                      {renderServiceCard(SERVICES_DATA[5])}
                    </div>
                  </div>
                  <div className="page-corner-peel-left"></div>
                  <div className="page-footer pt-3">
                    <span className="footer-left-text">PREMIUM CURATED OPTIONS</span>
                    <span className="footer-right-text">VOL. II | DIGITAL STAGING</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── LEAF 3: CATEGORY II RIGHT & CATEGORY III LEFT ─── */}
            <div 
              className={`page-leaf ${draggingLeafIndex === 3 ? "dragging" : ""} ${getFlippingClass(3)}`}
              style={{
                transform: `rotateY(${getLeafRotation(3)}deg)`,
                zIndex: getLeafZIndex(3),
                transition: draggingLeafIndex === 3 ? "none" : "transform 1.2s cubic-bezier(0.25, 1, 0.3, 1)",
                pointerEvents: "none"
              }}
              onMouseDown={(e) => {
                if (currentPage > 3) { startDrag(e, 3, "backward"); }
                else { startDrag(e, 3, "forward"); }
              }}
              onTouchStart={(e) => {
                if (currentPage > 3) { startDrag(e, 3, "backward"); }
                else { startDrag(e, 3, "forward"); }
              }}
            >
              {/* Category II Right Page (Front of Leaf 3, Page 6) */}
              <div className="page-side light-page" style={{ pointerEvents: (isLeafInteractive(3) && !isLeafFlipped(3)) ? "auto" : "none" }}>
                <div className="page-spine-shadow-right"></div>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="page-header mb-4">
                      <span className="header-category">II. L'ART ET LA MATIÈRE</span>
                      <span className="header-page">PAGE 06</span>
                    </div>

                    <div className="services-container space-y-6">
                      {renderServiceCard(SERVICES_DATA[6])}
                      {renderServiceCard(SERVICES_DATA[7])}
                    </div>
                  </div>
                  <div className="page-corner-peel"></div>
                  <div className="page-footer pt-3">
                    <span className="footer-left-text">CURATED BY SHOPIFY DEV STUDIO</span>
                    <span className="footer-right-text">VOL. III | ADVANCED SCALE</span>
                  </div>
                </div>
              </div>

              {/* Category III Left Page (Back of Leaf 3, Page 7) */}
              <div className="page-side light-page page-leaf-back page-left" style={{ pointerEvents: (isLeafInteractive(3) && isLeafFlipped(3)) ? "auto" : "none" }}>
                <div className="page-spine-shadow-left"></div>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="page-header mb-4">
                      <span className="header-category">III. L'EXPANSION DIGITALE</span>
                      <span className="header-page">PAGE 07</span>
                    </div>

                    <div className="services-container space-y-6">
                      {renderServiceCard(SERVICES_DATA[8])}
                      {renderServiceCard(SERVICES_DATA[9])}
                    </div>
                  </div>
                  <div className="page-corner-peel-left"></div>
                  <div className="page-footer pt-3">
                    <span className="footer-left-text">PREMIUM CURATED OPTIONS</span>
                    <span className="footer-right-text">VOL. II | DIGITAL STAGING</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── LEAF 4: CATEGORY III RIGHT & FREE AUDIT FORM ─── */}
            <div 
              className={`page-leaf ${draggingLeafIndex === 4 ? "dragging" : ""} ${getFlippingClass(4)}`}
              style={{
                transform: `rotateY(${getLeafRotation(4)}deg)`,
                zIndex: getLeafZIndex(4),
                transition: draggingLeafIndex === 4 ? "none" : "transform 1.2s cubic-bezier(0.25, 1, 0.3, 1)",
                pointerEvents: "none"
              }}
              onMouseDown={(e) => {
                if (currentPage > 4) { startDrag(e, 4, "backward"); }
                else { startDrag(e, 4, "forward"); }
              }}
              onTouchStart={(e) => {
                if (currentPage > 4) { startDrag(e, 4, "backward"); }
                else { startDrag(e, 4, "forward"); }
              }}
            >
              {/* Category III Right Page (Front of Leaf 4, Page 8) */}
              <div className="page-side light-page" style={{ pointerEvents: (isLeafInteractive(4) && !isLeafFlipped(4)) ? "auto" : "none" }}>
                <div className="page-spine-shadow-right"></div>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="page-header mb-4">
                      <span className="header-category">III. L'EXPANSION DIGITALE</span>
                      <span className="header-page">PAGE 08</span>
                    </div>

                    <div className="services-container space-y-6">
                      {renderServiceCard(SERVICES_DATA[10])}
                      {renderServiceCard(SERVICES_DATA[11])}
                    </div>
                  </div>
                  <div className="page-corner-peel"></div>
                  <div className="page-footer pt-3">
                    <span className="footer-left-text">CURATED BY SHOPIFY DEV STUDIO</span>
                    <span className="footer-right-text">VOL. III | ADVANCED SCALE</span>
                  </div>
                </div>
              </div>

              {/* Free Audit Form (Back of Leaf 4, Page 9) */}
              <div className="page-side light-page page-leaf-back page-left" style={{ pointerEvents: (isLeafInteractive(4) && isLeafFlipped(4)) ? "auto" : "none" }}>
                <div className="page-spine-shadow-left"></div>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="page-header mb-4">
                      <span className="header-category">IV. L'OPTIMISATION CONTINUE</span>
                      <span className="header-page">PAGE 09</span>
                    </div>

                    <span className="text-[10px] uppercase tracking-wider text-beige font-semibold">Free Audit Request</span>
                    <h3 className="text-lg font-bold font-serif text-[#e8dfd2] mt-1 mb-3">Visual Performance Blueprint</h3>
                    
                    {formState.submitted ? (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-beige/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-beige" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h4 className="text-[#e8dfd2] font-bold text-sm mb-1">Audit Ordered!</h4>
                        <p className="text-[#8a7d6e] text-[10px] leading-relaxed">
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
                            className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(197,160,89,0.15)] text-xs rounded px-3 py-1.5 text-[#e8dfd2] placeholder-[#5a5048] focus:outline-none focus:border-beige"
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
                            className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(197,160,89,0.15)] text-xs rounded px-3 py-1.5 text-[#e8dfd2] placeholder-[#5a5048] focus:outline-none focus:border-beige"
                          />
                          <input 
                            type="text" 
                            placeholder="Business Name"
                            value={formState.businessName}
                            onChange={(e) => setFormState((prev: any) => ({ ...prev, businessName: e.target.value }))}
                            className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(197,160,89,0.15)] text-xs rounded px-3 py-1.5 text-[#e8dfd2] placeholder-[#5a5048] focus:outline-none focus:border-beige"
                          />
                        </div>
                        <div>
                          <textarea 
                            placeholder="Key Challenges (Optional)"
                            rows={2}
                            value={formState.challenges}
                            onChange={(e) => setFormState((prev: any) => ({ ...prev, challenges: e.target.value }))}
                            className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(197,160,89,0.15)] text-xs rounded px-3 py-1.5 text-[#e8dfd2] placeholder-[#5a5048] resize-none focus:outline-none focus:border-beige"
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
                          <label htmlFor="consent" className="text-[9px] text-[#8a7d6e] leading-tight">
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
                  <div className="page-footer pt-3">
                    <span className="footer-left-text">PREMIUM CURATED OPTIONS</span>
                    <span className="footer-right-text">VOL. II | DIGITAL STAGING</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── LEAF 5: BACK COVER ─── */}
            <div 
              className={`page-leaf ${draggingLeafIndex === 5 ? "dragging" : ""} ${getFlippingClass(5)}`}
              style={{
                transform: `rotateY(${getLeafRotation(5)}deg)`,
                zIndex: getLeafZIndex(5),
                transition: draggingLeafIndex === 5 ? "none" : "transform 1.2s cubic-bezier(0.25, 1, 0.3, 1)",
                pointerEvents: "none"
              }}
              onMouseDown={(e) => {
                if (currentPage > 5) { startDrag(e, 5, "backward"); }
              }}
              onTouchStart={(e) => {
                if (currentPage > 5) { startDrag(e, 5, "backward"); }
              }}
            >
              {/* Back Cover Inside Right */}
              <div className="page-side book-cover book-cover-back" style={{ pointerEvents: (isLeafInteractive(5) && !isLeafFlipped(5)) ? "auto" : "none" }}>
                <div className="cover-gold-trim opacity-60">
                  <p className="text-beige/70 italic text-sm text-center px-8">
                    Shopify Dev Studio
                  </p>
                </div>
              </div>

              {/* Back Cover Outside */}
              <div className="page-side book-cover book-cover-front page-leaf-back page-left" style={{ pointerEvents: (isLeafInteractive(5) && isLeafFlipped(5)) ? "auto" : "none" }}>
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

          {/* ═══════ Bottom Navigation Bar ═══════ */}
          <div className="book-bottom-nav">
            <button 
              onClick={prevSpread} 
              className="book-nav-btn"
              disabled={currentPage === 0}
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextSpread} 
              className={`book-nav-btn ${currentPage < totalLeafs ? "book-nav-btn-active" : ""}`}
              disabled={currentPage >= totalLeafs}
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="spread-counter">
              {currentPage === 0 ? "Cover" : `Spread ${currentPage} of ${totalLeafs}`}
            </span>
            {currentPage > 0 && (
              <button onClick={() => jumpToSpread(0)} className="close-menu-btn">
                Close Menu
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ═══════ MOBILE / TABLET PORTRAIT VIEW ═══════ */}
      <div className="block md:hidden px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-beige/10 to-charcoal border border-beige/25 rounded-2xl p-6 text-center shadow-md">
            <BookOpen className="w-8 h-8 text-beige mx-auto mb-3" />
            <h3 className="text-xl font-bold font-serif text-beige mb-2">Our Services Catalog</h3>
            <p className="text-xs theme-text-sec leading-relaxed">
              Browse through our premium, natively engineered Shopify services below.
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
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-beige/15 flex items-center justify-center border border-beige/20 flex-shrink-0">
                        <IconComp className="w-4 h-4 text-beige" />
                      </div>
                      <h4 className="text-sm font-bold theme-text leading-tight">{service.title}</h4>
                    </div>
                    <span className="text-xs font-mono text-beige font-semibold flex-shrink-0">{service.price}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3">
                    {service.subBadges.map((badge, bidx) => (
                      <span key={bidx} className="text-[9px] uppercase tracking-wider text-gray-500 bg-gray-900/50 px-2 py-0.5 rounded border border-gray-800">
                        {badge}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs theme-text-sec leading-relaxed">{service.description}</p>
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

// Helper card rendering function
const renderServiceCard = (s: ServiceItem) => {
  if (!s) return null;
  return (
    <div className="book-service-card">
      <div className="flex items-baseline justify-between mb-1">
        <h4 className="text-[12px] font-bold tracking-wider text-[#e8dfd2] uppercase font-serif">
          {s.title}
        </h4>
        <div className="flex items-center gap-1 flex-shrink-0 ml-3 text-beige font-semibold">
          <span className="text-[10px] font-mono">{s.price}</span>
          <svg className="w-3 h-3 text-beige" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 8 16 12 12 16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>
      </div>
      <div className="sub-badges-row mb-1.5">
        {s.subBadges.map((badge, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <span className="sub-badge-divider">•</span>}
            <span className="sub-badge">{badge}</span>
          </React.Fragment>
        ))}
      </div>
      <p className="text-[10px] text-[#9e8e7e] leading-relaxed text-justify">
        {s.description}
      </p>
    </div>
  );
};
