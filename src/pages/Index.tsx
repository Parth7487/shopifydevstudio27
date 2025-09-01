import { memo, lazy, Suspense, useEffect, useState, useCallback } from "react";
import ElegantNavigation from "../components/sections/ElegantNavigation";
import Preloader from "../components/Preloader";
import ElegantHero from "../components/sections/ElegantHero";
import Footer from "../components/sections/Footer";

// Ultra-lightweight lazy loading - only load what's needed
const StatsSection = lazy(() => import("../components/sections/StatsSection"));
const Process = lazy(() => import("../components/sections/Process"));
const CollaborationSection = lazy(
  () => import("../components/sections/CollaborationSection"),
);
const FAQ = lazy(() => import("../components/sections/FAQ"));
const WorkMarquee = lazy(() => import("../components/sections/WorkMarquee"));
const WorkMarqueeAlt = lazy(() => import("../components/sections/WorkMarqueeAlt"));
const ProblemSolution = lazy(
  () => import("../components/sections/ProblemSolution"),
);

// Minimal loader - no animations for instant feel
const ComponentLoader = memo(() => <div className="h-4" />);

const Index = memo(() => {
  // Set dark mode immediately - no delays
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const [showPreloader, setShowPreloader] = useState(true);
  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
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
