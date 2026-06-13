import { memo, lazy, Suspense, useEffect, useState, useCallback } from "react";
import ElegantNavigation from "../components/sections/ElegantNavigation";
import Preloader from "../components/Preloader";
import ElegantHero from "../components/sections/ElegantHero";
import Footer from "../components/sections/Footer";
import { updatePageMeta } from "../lib/seo-meta";


// Ultra-lightweight lazy loading - only load what's needed
const StatsSection = lazy(() => import("../components/sections/StatsSection"));
const Process = lazy(() => import("../components/sections/Process"));
const CollaborationSection = lazy(
  () => import("../components/sections/CollaborationSection"),
);
const FAQ = lazy(() => import("../components/sections/FAQ"));
const WorkMarquee = lazy(() => import("../components/sections/WorkMarquee"));
const WorkMarqueeAlt = lazy(
  () => import("../components/sections/WorkMarqueeAlt"),
);
const ProblemSolution = lazy(
  () => import("../components/sections/ProblemSolution"),
);

// Minimal loader - no animations for instant feel
const ComponentLoader = memo(() => <div className="h-4" />);

const Index = memo(() => {
  useEffect(() => {

    updatePageMeta({
      title:
        "Shopify Dev Studio | Custom Shopify Theme Development & Conversion Optimization",
      description:
        "Expert Shopify developers specializing in custom theme design, conversion rate optimization, and performance enhancement. Transform your store into a high-converting sales machine. Trusted by 200+ brands worldwide.",
      ogTitle: "Shopify Dev Studio | Custom Shopify Theme Development",
      ogDescription:
        "Custom Shopify themes that convert browsers into buyers. Speed optimization, psychology-based design, and mobile-first development. Free store analysis.",
      ogImage: "https://www.shopifydevstudio.com/og-image.png",
      url: "https://www.shopifydevstudio.com/",
    });

    // Rich schema for AEO/GEO — helps AI engines (ChatGPT, Perplexity) cite us
    const schemas = [
      {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "Shopify Dev Studio",
        url: "https://www.shopifydevstudio.com",
        logo: "https://www.shopifydevstudio.com/favicon.svg",
        image: "https://www.shopifydevstudio.com/og-image.png",
        description:
          "Expert Shopify developers specializing in custom theme design, conversion rate optimization, and performance enhancement for e-commerce brands worldwide.",
        foundingDate: "2023",
        areaServed: "Worldwide",
        priceRange: "$$",
        knowsAbout: [
          "Shopify Theme Development",
          "Custom Liquid Development",
          "E-commerce Conversion Optimization",
          "Shopify Speed Optimization",
          "Mobile-First Design",
          "Shopify Plus Development",
        ],
        serviceType: [
          "Custom Shopify Theme Development",
          "Conversion Rate Optimization",
          "Shopify Performance Optimization",
          "Mobile Shopify Development",
          "Shopify App Integration",
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "200",
          bestRating: "5",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://www.shopifydevstudio.com/#webpage",
        url: "https://www.shopifydevstudio.com/",
        name: "Shopify Dev Studio | Custom Shopify Theme Development",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".hero-description"],
        },
        about: {
          "@type": "Thing",
          name: "Shopify Theme Development & Conversion Optimization",
        },
      },
    ];

    schemas.forEach((schema, i) => {
      const attr = `data-home-schema-${i}`;
      if (!document.querySelector(`script[${attr}]`)) {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute(attr, "true");
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      }
    });
  }, []);

  const [showPreloader, setShowPreloader] = useState(true);
  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" }}>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}

      {/* Navigation - critical above-the-fold */}
      <ElegantNavigation />

      {/* Main content */}
      <main>
        {/* Hero Section - critical path, loads immediately */}
        <section id="hero">
          <ElegantHero />
        </section>

        {/* Below-the-fold sections - lazy loaded */}
        <section>
          <Suspense fallback={<ComponentLoader />}>
            <StatsSection />
          </Suspense>
        </section>

        <section>
          <Suspense fallback={<ComponentLoader />}>
            <WorkMarquee />
          </Suspense>
        </section>

        <section>
          <Suspense fallback={<ComponentLoader />}>
            <WorkMarqueeAlt />
          </Suspense>
        </section>

        <section>
          <Suspense fallback={<ComponentLoader />}>
            <Process />
          </Suspense>
        </section>

        <section>
          <Suspense fallback={<ComponentLoader />}>
            <CollaborationSection />
          </Suspense>
        </section>

        <section>
          <Suspense fallback={<ComponentLoader />}>
            <FAQ />
          </Suspense>
        </section>

        <section>
          <Suspense fallback={<ComponentLoader />}>
            <ProblemSolution />
          </Suspense>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
});

Index.displayName = "Index";

export default Index;
