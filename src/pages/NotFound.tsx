import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.warn("404 Not Found:", location.pathname);
    if (
      typeof window !== "undefined" &&
      typeof (window as any).gtag === "function"
    ) {
      (window as any).gtag("event", "page_view", {
        page_title: "404",
        page_path: location.pathname,
      });
      (window as any).gtag("event", "exception", {
        description: `404 Not Found: ${location.pathname}`,
        fatal: false,
      });
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" }}>
      <div className="text-center px-4 max-w-md">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-beige to-clay bg-clip-text text-transparent">404</h1>
        <h2 className="text-2xl font-semibold mb-3 theme-text">Page Not Found</h2>
        <p className="text-base theme-text-sec mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 rounded border border-beige/20 hover:border-beige/40 text-beige hover:bg-beige/5 transition-all duration-300 font-medium tracking-wide text-sm"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
