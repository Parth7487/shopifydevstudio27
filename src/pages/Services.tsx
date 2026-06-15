import { motion } from "framer-motion";
import {
  Palette,
  Zap,
  Brain,
  Search,
  RefreshCw,
  Globe,
  Camera,
  Code,
  Layers,
  Box,
  Sparkles,
  BarChart3,
  Monitor,
  Shield,
} from "lucide-react";
import ElegantNavigation from "../components/sections/ElegantNavigation";
import Footer from "../components/sections/Footer";
import DesignPlayground from "../components/sections/DesignPlayground";
import { useState, useEffect, useCallback } from "react";
import CalendlyModal from "../components/sections/CalendlyModal";
import { updatePageMeta } from "../lib/seo-meta";
import { addBreadcrumbSchema } from "../lib/breadcrumb-schema";

const Services = () => {
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  // Form state
  const [storeUrl, setStoreUrl] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [challenges, setChallenges] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!consent) {
        setFormError("Please check the consent box to continue.");
        return;
      }
      setFormError("");
      setSubmitting(true);
      try {
        const res = await fetch("/api/send-contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storeUrl,
            email,
            businessName,
            challenges,
            source: "Services Free Audit Form",
          }),
        });

        if (res.ok) {
          setSubmitted(true);
          setStoreUrl("");
          setEmail("");
          setBusinessName("");
          setChallenges("");
          setConsent(false);
        } else {
          const data = await res.json();
          setFormError(
            data?.error ||
              "Something went wrong. Please try WhatsApp instead.",
          );
        }
      } catch {
        setFormError(
          "Network error. Please reach us directly on WhatsApp or email.",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [storeUrl, email, businessName, challenges, consent],
  );

  useEffect(() => {
    updatePageMeta({
      title: "Shopify Solutions Architect & Custom Theme Development | Shopify Dev Studio",
      description:
        "Premium custom Shopify theme development. Eliminate the 'App Tax' with native Liquid, build secure AI database integrations (MCP), and optimize for generative AI search. Get a free 24-hour visual blueprint.",
      ogTitle: "Shopify Solutions Architect & Custom Theme Engineering",
      ogDescription:
        "Eliminate app fees with native Liquid code, build custom AI/MCP dashboards, and scale your storefront globally.",
      url: "https://www.shopifydevstudio.com/services",
    });

    addBreadcrumbSchema([
      { name: "Home", url: "https://www.shopifydevstudio.com/" },
      { name: "Services", url: "https://www.shopifydevstudio.com/services" },
    ]);

    const schemaMarkup = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Shopify Solutions Architect & Brand Domination Suite",
      description:
        "Full-service Shopify solutions including custom Liquid development, private app creation, 3D WebGL models, editorial product photography, lossless SEO migrations, and high-ROI ads management.",
      provider: {
        "@type": "Organization",
        name: "Shopify Dev Studio",
        url: "https://www.shopifydevstudio.com",
      },
      areaServed: "Worldwide",
      serviceType: [
        "App-Killer Protocol (TCO & Speed Optimization)",
        "Bespoke Anti-Template Theme Engineering",
        "Custom Shopify App & API Development",
        "High-Conversion Editorial Photography & UGC",
        "Enterprise Variant Catalog Management (13,000+ variants)",
        "WebGL & 3D Interactive Product Models",
        "Lossless Migrations from Any Host",
        "Private Client Asset & Progress Dashboard",
        "SEO, GEO & AEO Domination Solutions",
        "Complete Brand Story, Logos & Packaging Design",
        "Social Media & Ad Account Scaling",
        "Alternative Platform Engineering (Framer, Webflow, WooCommerce)",
        "Ongoing Support & E-Commerce Store Management (Retainer)"
      ],
    };

    let script = document.querySelector("script[data-service-schema]");
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-service-schema", "true");
      script.textContent = JSON.stringify(schemaMarkup);
      document.head.appendChild(script);
    }
  }, []);

  const services = [
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
      description: "We hardcode cart drawers, size guides, custom filters, and bundling engines natively to eliminate slow 3rd-party subscription apps.",
      features: [
        "Saves $1,200 - $4,800/year in app fees",
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
      icon: Camera,
      title: "Product Photography, Staging & UGC Sourcing",
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
      title: "Lossless Migrations from Any Hosting Provider",
      description: "Safe transitions to Shopify Plus or Standard from WooCommerce, Magento, Squarespace, Webflow, or custom backends.",
      features: [
        "100% preservation of SEO metadata and rankings",
        "Flawless customer profile, product & history transfers",
        "Scheduled midnight cutovers for zero downtime",
        "Comprehensive redirects mapping & link checking",
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
      title: "Ad Account Scaling & Organic Social Management",
      description: "Scale your acquisition funnels across Google, Meta, and TikTok, alongside organic Instagram & Facebook page management. We create brand-aligned social content matching your store's visual DNA to build high-intent organic engagement.",
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
      icon: Shield,
      title: "Ongoing Support & E-Commerce Store Management (Retainer)",
      description: "Consistent, on-demand support retainers where we act as your dedicated Shopify and website manager. Send us a message, and we deploy updates immediately.",
      features: [
        "On-demand storefront tweaks, banners & navigation menu updates",
        "Uploading new collections, product images & managing layouts",
        "Consistent daily support channel to keep your site bug-free",
        "Fast-response communication via Slack, WhatsApp or Telegram",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const serviceVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" }}>
      {/* Navigation */}
      <ElegantNavigation />

      <section className="pt-16 pb-1 sm:pt-18 sm:pb-2 lg:pt-20 lg:pb-3 mobile-safe-padding text-center">
        <div className="max-w-4xl mx-auto w-full">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="responsive-text-4xl font-bold tracking-tight leading-tight mb-4 sm:mb-6"
          >
            <span>High-Performance Shopify Engineering </span>
            <span className="text-beige">& Solutions Architecture</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="theme-text-sec responsive-text-base leading-relaxed mb-6 sm:mb-8"
          >
            We build bespoke storefronts, custom apps, and secure AI integrations engineered from scratch. 
            Say goodbye to bloated templates, monthly app fees, and slow checkout speeds.
          </motion.p>
        </div>
      </section>

      {/* Services Introduction Section */}
      <section className="pt-4 pb-6 px-8 sm:pt-6 sm:pb-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            variants={titleVariants}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight leading-tight mb-6"
          >
            Enterprise-Grade E-Commerce Development & Systems Integration
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            variants={titleVariants}
            viewport={{ once: true }}
            className="theme-text-sec text-lg leading-relaxed max-w-3xl mx-auto"
          >
            From custom Liquid theme development and headless WebGL models to lossless migrations 
            and organic social scaling, we handle the complex technical details so you can focus on growth.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pt-4 pb-12 sm:pt-6 sm:pb-16 relative pb-7.5">
        {/* Design Playground Background */}
        <DesignPlayground />

        <div className="max-w-7xl mx-auto mobile-safe-padding relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  variants={serviceVariants}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.3 },
                  }}
                  className="theme-card border border-[var(--theme-border)] rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-beige/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center mb-4 sm:mb-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-beige/20 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-beige" />
                      </div>
                      <h3 className="responsive-text-base font-bold theme-text">
                        {service.title}
                      </h3>
                    </div>

                    <p className="theme-text-sec text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <ul className="space-y-2 sm:space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-2 sm:gap-3"
                      >
                        <div className="w-1.5 h-1.5 bg-beige rounded-full flex-shrink-0 mt-1.5 sm:mt-2" />
                        <span className="theme-text-sec text-xs sm:text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Complete Liquid Design Solutions Section */}
      <section className="theme-bg-subtle py-24 px-8 relative border-t border-[var(--theme-border)]">
        {/* Design Playground Background */}
        <DesignPlayground />

        <div className="max-w-4xl mx-auto px-8 w-full text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            <motion.h2
              variants={titleVariants}
              className="text-4xl font-bold tracking-tight leading-tight mb-8"
            >
              Our Staging-First & Secure Development Protocol
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="bg-beige/10 border border-beige/25 rounded-2xl p-8 mb-8"
            >
              <h3 className="text-beige text-2xl font-bold leading-8 mb-4">
                "Zero Downtime. 100% Code Ownership."
              </h3>
              <p className="theme-text-sec text-lg leading-relaxed">
                <span>We develop exclusively on </span>
                <span className="text-beige font-semibold">
                  private developer staging themes
                </span>
                <span>
                  {" "}
                  using the Shopify CLI and version control via GitHub. You own 100% of the code from Day 1, and your active storefront customers experience zero downtime or glitches.
                </span>
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="theme-text-sec text-lg leading-relaxed space-y-6"
            >
              <p>
                Think of your favorite physical luxury boutique. The moment a customer walks in, 
                everything from the layout to the custom details guides their buying decisions. 
                Your digital storefront works exactly the same way.
              </p>

              <p>
                <span>
                  When clients visit your online store, they form an impression within{" "}
                </span>
                <span className="text-beige font-semibold">0.05 seconds</span>
                <span>
                  . Generic builder themes, buggy plugins, and slow load times actively send 
                  them to your competitors.
                </span>
              </p>

              <p>
                We don't just build beautiful storefronts—we engineer premium, secure, and 
                conversion-optimized architectures. Every Liquid block and custom integration 
                we write is designed to maximize speed and your bottom-line profitability.
              </p>

              <p className="text-beige text-xl font-semibold leading-7">
                Don't let an expensive, slow stack cap your brand's growth potential.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sentinel Client Dashboard Callout */}
      <section className="bg-gradient-to-r from-beige/5 to-[var(--theme-bg-subtle)] py-24 px-8 relative border-t border-[var(--theme-border)]">
        <div className="max-w-4xl mx-auto px-8 w-full text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            <motion.h2
              variants={titleVariants}
              className="text-4xl font-bold tracking-tight leading-tight mb-8"
            >
              The "Sentinel" Client Portal
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="theme-card border border-[var(--theme-border)] rounded-2xl p-8 mb-8"
            >
              <h3 className="text-beige text-2xl font-bold leading-8 mb-4">
                Monitor Progress, Upload Assets & Keep Track
              </h3>
              <p className="theme-text-sec text-lg leading-relaxed">
                Every project comes with a private, secure administrative dashboard. Monitor development roadmaps in real-time, upload design assets/Figma guides directly to the staging environment, review Git logs, and message your Solutions Architect directly.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-gradient-to-r from-beige/10 to-beige/5 py-24 px-8 relative border-t border-[var(--theme-border)]">
        {/* Design Playground Background */}
        <DesignPlayground />

        <div className="max-w-4xl mx-auto px-8 w-full relative z-10">
          <div className="theme-card border border-[var(--theme-border)] rounded-2xl p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-beige/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-beige" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-beige text-2xl font-bold mb-2">Request Received!</h3>
                <p className="theme-text-sec text-sm leading-relaxed">
                  We'll analyze your store and send detailed recommendations within 24-26 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-beige underline text-sm hover:text-beige/80 transition-colors"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="storeUrl"
                    className="block text-sm font-medium leading-5 mb-2 theme-text"
                  >
                    Your Store URL *
                  </label>
                  <input
                    type="url"
                    id="storeUrl"
                    placeholder="https://yourstore.com"
                    required
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    className="w-full bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded-lg px-4 py-3 theme-text transition-colors duration-150 focus:border-beige focus:outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-5 mb-2 theme-text"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="your@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded-lg px-4 py-3 theme-text transition-colors duration-150 focus:border-beige focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="businessName"
                      className="block text-sm font-medium leading-5 mb-2 theme-text"
                    >
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      placeholder="Your Business"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded-lg px-4 py-3 theme-text transition-colors duration-150 focus:border-beige focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="currentChallenges"
                    className="block text-sm font-medium leading-5 mb-2 theme-text"
                  >
                    What challenges are you facing? (Optional)
                  </label>
                  <textarea
                    id="currentChallenges"
                    rows={4}
                    placeholder="Tell us about your app subscription costs, mobile speed bottlenecks, custom feature requirements, or migration concerns."
                    value={challenges}
                    onChange={(e) => setChallenges(e.target.value)}
                    className="w-full bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded-lg px-4 py-3 theme-text resize-none transition-colors duration-150 focus:border-beige focus:outline-none"
                  />
                </div>

                <div className="flex items-start gap-3 mt-6">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="w-4 h-4 mt-1 bg-[var(--theme-input-bg)] border-none text-beige rounded focus:ring-beige"
                  />
                  <label
                    htmlFor="consent"
                    className="theme-text-sec text-sm leading-5"
                  >
                    I agree to receive a detailed analysis of my store and
                    follow-up communications about optimization opportunities.
                  </label>
                </div>

                {formError && (
                  <p className="text-red-400 text-sm mt-3">{formError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-beige text-black font-medium text-lg leading-7 py-4 px-8 rounded-lg mt-6 hover:bg-beige/90 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Get Free Analysis"
                  )}
                </button>
              </form>
            )}

            <div className="bg-beige/10 border border-beige/25 rounded-xl p-6 mt-8">
              <h3 className="text-beige font-bold mb-3">Your Free Visual Blueprint Details:</h3>
              <ul className="text-sm leading-5 space-y-2">
                {[
                  "Mobile Page Speed & App-Tax Audit",
                  "Visual Architecture Sketch (Figma mockup or Loom walkthrough)",
                  "Custom Liquid implementation recommendations",
                  "Estimated annual app fee savings calculation",
                  "Conversion rate bottleneck identification",
                  "Staging-first project deployment plan",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-beige rounded-full flex-shrink-0" />
                    <span className="theme-text-sec">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="theme-text-sec text-sm leading-5">
              <span className="text-beige font-semibold">The 24-26 Hour Blueprint Clock:</span>{" "}
              Provide your store URL and details above. Within 24-26 hours, we'll deliver a custom mobile performance audit and visual mockup showing how we'll solve your bottlenecks natively. No obligations.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="bg-gradient-to-r from-beige/10 to-clay/10 border border-[var(--theme-border)] rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Dominate Your Market?
            </h2>
            <p className="theme-text-sec text-lg mb-8 max-w-2xl mx-auto">
              Let's discuss how our staging-first process can help you create a
              high-converting, native Shopify storefront that drives real results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  const url = (import.meta as any).env?.VITE_CALENDLY_URL as
                    | string
                    | undefined;
                  if (url) {
                    setCalendlyOpen(true);
                  } else {
                    window.location.hash = "#contact";
                  }
                }}
                className="px-8 py-4 bg-beige text-black font-semibold rounded-lg hover:bg-beige/90 transition-colors duration-200"
              >
                Start Your Project
              </button>
              <a
                href="/#work"
                className="px-8 py-4 border border-beige text-beige font-semibold rounded-lg hover:bg-beige/10 transition-colors duration-200"
              >
                View Our Work
              </a>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Footer */}
      <Footer />
      <CalendlyModal
        open={calendlyOpen}
        onClose={() => setCalendlyOpen(false)}
      />
    </div>
  );
};

export default Services;
