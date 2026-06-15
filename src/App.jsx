import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, memo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import ScrollProgress from "./components/ScrollProgress";
import PageTransition from "./components/PageTransition";

// Import only critical pages directly for instant loading
import Index from "./pages/Index";

// Aggressive lazy loading for maximum performance
const Services = lazy(() => import("./pages/Services"));
const Process = lazy(() => import("./pages/Process"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const Documentation = lazy(() => import("./pages/Documentation"));
const Support = lazy(() => import("./pages/Support"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Work = lazy(() => import("./pages/Work"));
const Partners = lazy(() => import("./pages/Partners"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FaviconExport = lazy(() => import("./pages/FaviconExport"));

// Lazy load UI components to reduce bundle size
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));

// Centered premium loading spinner for smooth transitions
const MinimalLoader = memo(() => (
  <div className="fixed inset-0 z-50 bg-[var(--theme-bg)] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-beige/20 border-t-beige rounded-full animate-spin" />
      <p className="text-beige text-xs tracking-widest uppercase font-light">Loading...</p>
    </div>
  </div>
));

// Ultra-aggressive caching for speed
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60, // 1 hour - longer caching
      gcTime: 1000 * 60 * 60 * 2, // 2 hours
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 0, // No retries for faster loading
      retryDelay: 0,
      networkMode: "online", // Only when online
    },
    mutations: {
      retry: 0,
      networkMode: "online",
    },
  },
});

const AnimatedRoutes = memo(() => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route
          path="/services"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <PageTransition><Services /></PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/process"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <PageTransition><Process /></PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <PageTransition><About /></PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/work"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <PageTransition><Work /></PageTransition>
            </Suspense>
          }
        />
        {/* Redirect old Work2 routes to new Work page */}
        <Route path="/work2" element={<Navigate to="/work" replace />} />
        <Route path="/Work2" element={<Navigate to="/work" replace />} />
        <Route
          path="/blog"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <PageTransition><Blog /></PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/documentation"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <PageTransition><Documentation /></PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/support"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <PageTransition><Support /></PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/faq"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <PageTransition><FAQ /></PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/partners"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <PageTransition><Partners /></PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/favicon-export"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <PageTransition><FaviconExport /></PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <PageTransition><Admin /></PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/404"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <PageTransition><NotFound /></PageTransition>
            </Suspense>
          }
        />
        <Route path="/NotFound" element={<Navigate to="/404" replace />} />
        <Route
          path="*"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <PageTransition><NotFound /></PageTransition>
            </Suspense>
          }
        />
      </Routes>
    </AnimatePresence>
  );
});

AnimatedRoutes.displayName = "AnimatedRoutes";

const App = memo(() => {
  useEffect(() => {
    // Preload important route bundles in the background when the browser is idle
    const timer = setTimeout(() => {
      import("./pages/Services");
      import("./pages/Process");
      import("./pages/About");
      import("./pages/Work");
      import("./pages/Partners");
    }, 2000); // 2 second delay to avoid impacting initial page load performance
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <ScrollProgress />
        <AnimatedRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
});

App.displayName = "App";

export default App;
