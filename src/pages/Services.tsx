import { motion } from "framer-motion";
import { BookFlip } from "../components/sections/BookFlip";
import DesignPlayground from "../components/sections/DesignPlayground";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CalendlyModal from "../components/sections/CalendlyModal";
import { updatePageMeta } from "../lib/seo-meta";
import { addBreadcrumbSchema } from "../lib/breadcrumb-schema";

const Services = () => {
  const navigate = useNavigate();
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  // Unified form state for BookFlip
  const [formState, setFormState] = useState({
    storeUrl: "",
    email: "",
    businessName: "",
    challenges: "",
    consent: false,
    submitting: false,
    submitted: false,
    formError: "",
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formState.consent) {
        setFormState((prev) => ({ ...prev, formError: "Please check the consent box to continue." }));
        return;
      }
      setFormState((prev) => ({ ...prev, formError: "", submitting: true }));
      try {
        const res = await fetch("/api/send-contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storeUrl: formState.storeUrl,
            email: formState.email,
            businessName: formState.businessName,
            challenges: formState.challenges,
            source: "Services Free Audit Form",
          }),
        });

        if (res.ok) {
          setFormState((prev) => ({
            ...prev,
            submitted: true,
            storeUrl: "",
            email: "",
            businessName: "",
            challenges: "",
            consent: false,
            submitting: false,
          }));
        } else {
          const data = await res.json();
          setFormState((prev) => ({
            ...prev,
            submitting: false,
            formError: data?.error || "Something went wrong. Please try WhatsApp instead.",
          }));
        }
      } catch {
        setFormState((prev) => ({
          ...prev,
          submitting: false,
          formError: "Network error. Please reach us directly on WhatsApp or email.",
        }));
      }
    },
    [formState],
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
        "Bespoke Headless Storefronts (Hydrogen & Oxygen)",
        "Custom Shopify App & API Development",
        "Checkout Extensibility & Functions Migration",
        "Server-Side Tracking & Attribution (GA4 & CAPI)",
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
      <section className="pt-24 pb-1 sm:pt-28 sm:pb-2 lg:pt-32 lg:pb-3 mobile-safe-padding text-center">
        <div className="max-w-4xl mx-auto w-full">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="text-2xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight mb-4 sm:mb-6"
          >
            <span>High-Performance Shopify Engineering </span>
            <span className="text-beige">& Solutions Architecture</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="theme-text-sec text-sm sm:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8"
          >
            We build bespoke storefronts, custom apps, and secure AI integrations engineered from scratch. 
            Say goodbye to bloated templates, monthly app fees, and slow checkout speeds.
          </motion.p>
        </div>
      </section>

      {/* Services Introduction Section */}
      <section className="pt-4 pb-6 px-8 sm:pt-6 sm:pb-8">
        <div className="max-w-4xl mx-auto text-center mb-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            variants={titleVariants}
            viewport={{ once: true }}
            className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight mb-6"
          >
            Enterprise-Grade E-Commerce Development & Systems Integration
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            variants={titleVariants}
            viewport={{ once: true }}
            className="theme-text-sec text-base sm:text-lg leading-relaxed max-w-3xl mx-auto"
          >
            From custom Liquid theme development and headless WebGL models to lossless migrations 
            and organic social scaling, we handle the complex technical details so you can focus on growth.
          </motion.p>
        </div>
      </section>

      {/* 3D Book Flip Component */}
      <section className="pt-4 pb-12 sm:pt-6 sm:pb-16 relative">
        <DesignPlayground />
        <div className="max-w-7xl mx-auto mobile-safe-padding relative z-10">
          <BookFlip 
            onFormSubmit={handleSubmit}
            formState={formState}
            setFormState={setFormState}
          />
        </div>
      </section>

      {/* Complete Liquid Design Solutions Section */}
      <section className="theme-bg-subtle py-16 sm:py-24 px-4 sm:px-8 relative border-t border-[var(--theme-border)]">
        {/* Design Playground Background */}
        <DesignPlayground />

        <div className="max-w-4xl mx-auto w-full text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            <motion.h2
              variants={titleVariants}
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6 sm:mb-8"
            >
              Our Staging-First & Secure Development Protocol
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="bg-beige/10 border border-beige/25 rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8"
            >
              <h3 className="text-beige text-lg sm:text-xl md:text-2xl font-bold leading-snug mb-3 sm:mb-4">
                "Zero Downtime. 100% Code Ownership."
              </h3>
              <p className="theme-text-sec text-sm sm:text-base md:text-lg leading-relaxed">
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
              className="theme-text-sec text-sm sm:text-base md:text-lg leading-relaxed space-y-4 sm:space-y-6"
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

              <p className="text-beige text-base sm:text-lg md:text-xl font-semibold leading-normal">
                Don't let an expensive, slow stack cap your brand's growth potential.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sentinel Client Dashboard Callout */}
      <section className="bg-gradient-to-r from-beige/5 to-[var(--theme-bg-subtle)] py-16 sm:py-24 px-4 sm:px-8 relative border-t border-[var(--theme-border)]">
        <div className="max-w-4xl mx-auto w-full text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            <motion.h2
              variants={titleVariants}
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6 sm:mb-8"
            >
              The "Sentinel" Client Portal
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="theme-card border border-[var(--theme-border)] rounded-xl sm:rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8"
            >
              <h3 className="text-beige text-lg sm:text-xl md:text-2xl font-bold leading-snug mb-3 sm:mb-4">
                Monitor Progress, Upload Assets & Keep Track
              </h3>
              <p className="theme-text-sec text-sm sm:text-base md:text-lg leading-relaxed">
                Every project comes with a private, secure administrative dashboard. Monitor development roadmaps in real-time, upload design assets/Figma guides directly to the staging environment, review Git logs, and message your Solutions Architect directly.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="bg-gradient-to-r from-beige/10 to-clay/10 border border-[var(--theme-border)] rounded-2xl p-6 sm:p-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
              Ready to Dominate Your Market?
            </h2>
            <p className="theme-text-sec text-base sm:text-lg mb-8 max-w-2xl mx-auto">
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
                className="px-8 py-3.5 bg-beige text-black font-semibold rounded-lg hover:bg-beige/90 transition-colors duration-200 text-sm sm:text-base"
              >
                Start Your Project
              </button>
              <button
                onClick={() => navigate("/work")}
                className="px-8 py-3.5 border border-beige text-beige font-semibold rounded-lg hover:bg-beige/10 transition-colors duration-200 text-sm sm:text-base"
              >
                View Our Work
              </button>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Footer */}
      <CalendlyModal
        open={calendlyOpen}
        onClose={() => setCalendlyOpen(false)}
      />
    </div>
  );
};

export default Services;
