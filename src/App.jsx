import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, memo } from "react";
import ScrollProgress from "./components/ScrollProgress";

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

// Absolute minimal loader for instant feel
const MinimalLoader = memo(() => <div className="h-4 bg-black"></div>);

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

const App = memo(() => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
      <ScrollProgress />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/services"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <Services />
            </Suspense>
          }
        />
        <Route
          path="/process"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <Process />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="/work"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <Work />
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
              <Blog />
            </Suspense>
          }
        />
        <Route
          path="/documentation"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <Documentation />
            </Suspense>
          }
        />
        <Route
          path="/support"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <Support />
            </Suspense>
          }
        />
        <Route
          path="/faq"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <FAQ />
            </Suspense>
          }
        />
        <Route
          path="/partners"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <Partners />
            </Suspense>
          }
        />
        <Route
          path="/favicon-export"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <FaviconExport />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <Admin />
            </Suspense>
          }
        />
        <Route
          path="/404"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <NotFound />
            </Suspense>
          }
        />
        <Route path="/NotFound" element={<Navigate to="/404" replace />} />
        <Route
          path="*"
          element={
            <Suspense fallback={<MinimalLoader />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
));

App.displayName = "App";

export default App;
