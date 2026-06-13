import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon } from "lucide-react";
import BookingModal from "./CalendlyModal";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useSettings } from "../../hooks/useSettings";
import { useTheme } from "../../contexts/ThemeContext";


const ElegantNavigation = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const { settings } = useSettings();
  const { theme, toggleTheme, isDark } = useTheme();

  // Throttled scroll handler for better performance
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const preloadRoute = useCallback((label: string) => {
    // Preload route chunks on hover/focus for instant nav
    switch (label) {
      case "Services":
        import("../../pages/Services");
        break;
      case "Process":
        import("../../pages/Process");
        break;
      case "About":
        import("../../pages/About");
        break;
      case "Work":
        import("../../pages/Work");
        break;
      case "Partners":
        import("../../pages/Partners");
        break;
      default:
        break;
    }
  }, []);

  const handleNavigation = useCallback(
    (itemId: string, itemLabel: string) => {
      setIsMobileMenuOpen(false);

      if (itemId === "hero") {
        navigate("/");
      } else if (itemLabel === "Services") {
        navigate("/services");
      } else if (itemLabel === "Process") {
        navigate("/process");
      } else if (itemLabel === "About") {
        navigate("/about");
      } else if (itemLabel === "Work") {
        navigate("/work");
      } else if (itemLabel === "Partners") {
        navigate("/partners");
      } else if (location.pathname === "/") {
        const element = document.getElementById(itemId);
        if (element) {
          const isMobile = window.innerWidth < 768;
          const behavior = isMobile ? "auto" : "smooth";
          element.scrollIntoView({ behavior, block: "start" });
        }
      } else {
        navigate("/");
      }
    },
    [navigate, location.pathname],
  );

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = settings.navigation;

  const isActiveItem = (itemLabel: string) => {
    if (location.pathname === "/" && itemLabel === "Home") return true;
    if (location.pathname === "/services" && itemLabel === "Services")
      return true;
    if (location.pathname === "/process" && itemLabel === "Process")
      return true;
    if (location.pathname === "/about" && itemLabel === "About") return true;
    if (location.pathname === "/work" && itemLabel === "Work") return true;
    if (location.pathname === "/partners" && itemLabel === "Partners")
      return true;
    return false;
  };

  const logoText = settings.footer.logo_text || "Dev Studio";
  const logoInitial = logoText.trim().charAt(0);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-sm border-b"
            : "bg-transparent border-transparent"
        }`}
        style={
          isScrolled
            ? {
                backgroundColor: "var(--theme-nav-bg)",
                borderColor: "var(--theme-nav-border)",
              }
            : undefined
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              {settings.footer.logo_type === "image" && settings.footer.logo_image ? (
                <img
                  src={settings.footer.logo_image}
                  alt={logoText}
                  className="h-8 sm:h-9 w-auto object-contain"
                />
              ) : (
                <>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 border border-beige/60 rounded relative flex items-center justify-center">
                    <span className="text-beige font-medium text-xs sm:text-sm">
                      {logoInitial}
                    </span>
                    <svg
                      className="absolute -top-2 left-1/2 -translate-x-1/2 text-beige w-6 h-4 sm:w-7 sm:h-4 pointer-events-none"
                      viewBox="0 0 24 14"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 11 A9 9 0 0 1 21 11"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6 11 v3"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M18 11 v3"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <span className="theme-text font-medium text-base sm:text-lg tracking-wide">
                    {logoText}
                  </span>
                </>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8 xl:space-x-12">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onMouseEnter={() => preloadRoute(item.label)}
                  onFocus={() => preloadRoute(item.label)}
                  onClick={() => handleNavigation(item.id, item.label)}
                  className={`relative text-sm font-medium tracking-wide transition-colors duration-200 ${
                    isActiveItem(item.label)
                      ? "text-beige"
                      : "theme-text-muted hover:text-beige"
                  }`}
                >
                  {item.label}
                  {isActiveItem(item.label) && (
                    <div className="absolute bottom-[-6px] left-0 right-0 h-px bg-beige" />
                  )}
                </button>
              ))}
            </div>

            {/* Desktop: Language + Social + Theme toggle + CTA */}
            <div className="hidden sm:flex items-center gap-3">
              <LanguageSwitcher variant="dropdown" />
              <a
                href={`https://wa.me/${(settings.socials.whatsapp || "").replace(/\D/g, "")}?text=Hello%20Shopify%20Dev%20Studio%20%E2%80%93%20I%20would%20like%20to%20connect`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp chat"
                className="text-beige/80 hover:text-beige transition-colors p-2 rounded-lg border border-beige/20 hover:border-beige/40"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M19.077 4.928A9.873 9.873 0 0 0 12.04 2c-5.46 0-9.905 4.444-9.905 9.907 0 1.745.456 3.45 1.32 4.96L2 22l5.253-1.378a9.851 9.851 0 0 0 4.782 1.229h.004c5.46 0 9.905-4.443 9.908-9.907a9.873 9.873 0 0 0 -2.87-7.016ZM12.04 20.108a8.093 8.093 0 0 1 -4.129-1.124l-.296-.176-3.071.805.819-2.994-.193-.307a8.077 8.077 0 0 1 -1.238-4.205c0-4.464 3.633-8.097 8.1-8.097a8.037 8.037 0 0 1 5.725 2.373 8.038 8.038 0 0 1 2.372 5.728c-.004 4.466-3.637 8.098-8.102 8.098Zm4.44-6.075c-.244-.122-1.44-.71-1.662-.792-.224-.08-.387-.121-.55.123-.163.243-.63.792-.772.955-.143.162-.285.183-.529.06-.244-.12-1.03-.38-1.962-1.21-.725-.647-1.215-1.448-1.357-1.693-.143-.243-.015-.375.107-.496.11-.11.244-.284.366-.426.122-.142.163-.243.244-.406.082-.162.041-.304-.02-.426-.062-.122-.55-1.32-.753-1.81-.197-.477-.393-.41-.53-.41h-.453c-.163 0-.427.061-.65.305-.224.244-.854.834-.854 2.031s.874 2.35 1.0 2.512c.121.163 1.72 2.624 4.167 3.68.583.25 1.037.4 1.392.513.585.186 1.117.16 1.538.097.469-.07 1.44-.588 1.642-1.155.204-.568.204-1.055.143-1.155-.06-.1-.223-.162-.467-.284Z" />
                </svg>
              </a>
              <a
                href={`https://t.me/${settings.socials.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram chat"
                className="text-beige/80 hover:text-beige transition-colors p-2 rounded-lg border border-beige/20 hover:border-beige/40"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.7 14.6 9.5 18c.4 0 .6-.2.8-.4l2-1.9 4.1 3c.8.4 1.3.2 1.5-.7L21.6 5c.2-.9-.4-1.3-1.2-1L3.3 10.2c-.8.3-.8.8-.1 1l4.3 1.3 10-6.3-7.8 8.4Z" />
                </svg>
              </a>

              {/* ── Theme toggle ── */}
              <button
                id="theme-toggle"
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                title={isDark ? "Light mode" : "Dark mode"}
                className="relative p-2 rounded-lg border border-beige/20 hover:border-beige/40 text-beige/80 hover:text-beige transition-all duration-300 overflow-hidden group"
              >
                <span
                  className={`block transition-all duration-300 ${
                    isDark
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 rotate-90 scale-75 absolute inset-0 m-auto w-5 h-5"
                  }`}
                >
                  <Sun className="w-5 h-5" />
                </span>
                <span
                  className={`block transition-all duration-300 ${
                    !isDark
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-75 absolute inset-0 m-auto w-5 h-5"
                  }`}
                >
                  <Moon className="w-5 h-5" />
                </span>
              </button>

              <Button
                onClick={() => setCalendlyOpen(true)}
                className="elegant-button px-4 lg:px-6 py-2 text-xs lg:text-sm font-medium tracking-wide rounded transition-all duration-200"
              >
                <span className="hidden md:inline">Start the Conversation</span>
                <span className="md:hidden">Contact</span>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden theme-text-muted hover:text-beige transition-colors duration-200 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden pt-20">
          <div
            className="absolute inset-0 backdrop-blur-xl"
            style={{ backgroundColor: "var(--theme-nav-bg)" }}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div
            className="relative flex flex-col h-full border-l border-beige/10 overflow-y-auto"
            style={{ backgroundColor: "var(--theme-bg)" }}
          >
            {/* Mobile menu header */}
            <div
              className="flex items-center justify-between p-5 border-b border-beige/20"
            >
              <div className="flex items-center space-x-3">
                {settings.footer.logo_type === "image" && settings.footer.logo_image ? (
                  <img
                    src={settings.footer.logo_image}
                    alt={logoText}
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  <>
                    <div className="w-8 h-8 border border-beige/60 rounded relative flex items-center justify-center">
                      <span className="text-beige font-medium text-xs">{logoInitial}</span>
                      <svg
                        className="absolute -top-2 left-1/2 -translate-x-1/2 text-beige w-6 h-4 pointer-events-none"
                        viewBox="0 0 24 14"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 11 A9 9 0 0 1 21 11"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6 11 v3"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M18 11 v3"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="theme-text font-medium text-base tracking-wide">
                      {logoText}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Theme toggle in mobile header */}
                <button
                  onClick={toggleTheme}
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  className="p-2 rounded-lg border border-beige/20 text-beige/80 hover:text-beige hover:border-beige/40 transition-all duration-300"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="theme-text-muted hover:text-beige transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Mobile navigation */}
            <div className="flex-1 flex flex-col justify-start pt-8 px-6 pb-20">
              <nav className="space-y-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id, item.label)}
                    className={`block w-full text-left py-3 px-4 rounded-xl transition-colors ${
                      isActiveItem(item.label)
                        ? "text-beige bg-beige/10"
                        : "theme-text-muted hover:text-beige hover:bg-beige/5"
                    }`}
                  >
                    <span className="text-xl font-medium tracking-wide">
                      {item.label}
                    </span>
                  </button>
                ))}
              </nav>

              {/* Language Switcher */}
              <div className="mt-8 mb-6">
                <LanguageSwitcher variant="inline" className="justify-center" />
              </div>

              {/* Mobile CTA */}
              <div className="flex items-center justify-center gap-4">
                <a
                  href={`https://wa.me/${(settings.socials.whatsapp || "").replace(/\D/g, "")}?text=Hello%20Shopify%20Dev%20Studio%20%E2%80%93%20I%20would%20like%20to%20connect`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp chat"
                  className="p-3 rounded-xl border border-beige/20 text-beige/80 hover:text-beige hover:border-beige/40 transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M19.077 4.928A9.873 9.873 0 0 0 12.04 2c-5.46 0-9.905 4.444-9.905 9.907 0 1.745.456 3.45 1.32 4.96L2 22l5.253-1.378a9.851 9.851 0 0 0 4.782 1.229h.004c5.46 0 9.905-4.443 9.908-9.907a9.873 9.873 0 0 0 -2.87-7.016ZM12.04 20.108a8.093 8.093 0 0 1 -4.129-1.124l-.296-.176-3.071.805.819-2.994-.193-.307a8.077 8.077 0 0 1 -1.238-4.205c0-4.464 3.633-8.097 8.1-8.097a8.037 8.037 0 0 1 5.725 2.373 8.038 8.038 0 0 1 2.372 5.728c-.004 4.466-3.637 8.098-8.102 8.098Zm4.44-6.075c-.244-.122-1.44-.71-1.662-.792-.224-.08-.387-.121-.55.123-.163.243-.63.792-.772.955-.143.162-.285.183-.529.06-.244-.12-1.03-.38-1.962-1.21-.725-.647-1.215-1.448-1.357-1.693-.143-.243-.015-.375.107-.496.11-.11.244-.284.366-.426.122-.142.163-.243.244-.406.082-.162.041-.304-.02-.426-.062-.122-.55-1.32-.753-1.81-.197-.477-.393-.41-.53-.41h-.453c-.163 0-.427.061-.65.305-.224.244-.854.834-.854 2.031s.874 2.35 1.0 2.512c.121.163 1.72 2.624 4.167 3.68.583.25 1.037.4 1.392.513.585.186 1.117.16 1.538.097.469-.07 1.44-.588 1.642-1.155.204-.568.204-1.055.143-1.155-.06-.1-.223-.162-.467-.284Z" />
                  </svg>
                </a>
                <a
                  href={`https://t.me/${settings.socials.telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram chat"
                  className="p-3 rounded-xl border border-beige/20 text-beige/80 hover:text-beige hover:border-beige/40 transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M9.7 14.6 9.5 18c.4 0 .6-.2.8-.4l2-1.9 4.1 3c.8.4 1.3.2 1.5-.7L21.6 5c.2-.9-.4-1.3-1.2-1L3.3 10.2c-.8.3-.8.8-.1 1l4.3 1.3 10-6.3-7.8 8.4Z" />
                  </svg>
                </a>
              </div>

              <div className="mt-6">
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setCalendlyOpen(true);
                  }}
                  className="w-full elegant-button px-6 py-4 text-base font-medium tracking-wide rounded-xl"
                >
                  Start the Conversation
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <BookingModal
        open={calendlyOpen}
        onClose={() => setCalendlyOpen(false)}
      />
    </>
  );
});

ElegantNavigation.displayName = "ElegantNavigation";

export default ElegantNavigation;
