import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, Globe, Mail, ArrowUpRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../../hooks/useSettings";
import { useTheme } from "../../contexts/ThemeContext";
import BookingModal from "./CalendlyModal";

type Language = "en" | "es" | "fr";

const translations = {
  en: {
    Home: "Home",
    Services: "Services",
    About: "About",
    Work: "Work",
    Partners: "Partners",
    Contact: "Schedule Call",
  },
  es: {
    Home: "Inicio",
    Services: "Servicios",
    About: "Nosotros",
    Work: "Portafolio",
    Partners: "Aliados",
    Contact: "Reservar Llamada",
  },
  fr: {
    Home: "Accueil",
    Services: "Services",
    About: "À Propos",
    Work: "Projets",
    Partners: "Partenaires",
    Contact: "Prendre RDV",
  },
};

const ElegantNavigation = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [scrollY, setScrollY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>("en");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  
  const { settings } = useSettings();
  const { toggleTheme, isDark } = useTheme();

  // Track window scroll coordinates for responsive notch scaling
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const preloadRoute = useCallback((label: string) => {
    switch (label) {
      case "Services":
        import("../../pages/Services");
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

  const navItems = settings.navigation.filter(
    (item) => item.id !== "process" && item.label !== "Process"
  );

  const isActiveItem = (itemLabel: string) => {
    if (location.pathname === "/" && itemLabel === "Home") return true;
    if (location.pathname === "/services" && itemLabel === "Services") return true;
    if (location.pathname === "/about" && itemLabel === "About") return true;
    if (location.pathname === "/work" && itemLabel === "Work") return true;
    if (location.pathname === "/partners" && itemLabel === "Partners") return true;
    return false;
  };

  const getTranslatedLabel = (label: string) => {
    const key = label as keyof typeof translations.en;
    if (translations[currentLang] && translations[currentLang][key]) {
      return translations[currentLang][key];
    }
    return label;
  };

  const shrinkNav = scrollY > 100 && !isHovered && !isMobileMenuOpen;
  
  const logoText = settings.footer.logo_text || "Dev Studio";
  const logoInitial = logoText.trim().charAt(0);

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-0 right-0 z-50 px-4 md:px-6 w-full flex justify-center pointer-events-none"
      >
        {/* Capsule Pill Bar Container */}
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsLangOpen(false);
          }}
          animate={{
            maxWidth: shrinkNav ? "150px" : "980px",
            paddingLeft: shrinkNav ? "8px" : "16px",
            paddingRight: shrinkNav ? "8px" : "16px",
            borderRadius: "9999px",
            backgroundColor: shrinkNav
              ? isDark
                ? "rgba(13, 13, 13, 0.95)"
                : "rgba(26, 26, 26, 0.95)"
              : isDark
                ? "rgba(18, 18, 18, 0.85)"
                : "rgba(255, 255, 255, 0.82)",
            boxShadow: shrinkNav
              ? "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)"
              : "0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)",
          }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className={`w-full backdrop-blur-md border flex items-center justify-between pointer-events-auto transition-colors duration-300 relative ${
            shrinkNav
              ? "border-transparent text-white"
              : isDark
                ? "border-white/5 text-white/95"
                : "border-[#1a1a1a]/5 text-[#1a1a1a]"
          }`}
          style={{ height: "52px" }}
        >
          {/* Layout Left: Logo */}
          <div
            onClick={() => handleNavigation("hero", "Home")}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
            id="nav-logo"
          >
            {settings.footer.logo_type === "image" && settings.footer.logo_image ? (
              <img
                src={settings.footer.logo_image}
                alt={logoText}
                className="h-8 w-auto object-contain transition-all duration-300"
              />
            ) : (
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-serif font-bold text-sm tracking-tight transition-all duration-300 ${
                  shrinkNav
                    ? "bg-white/10 text-white"
                    : isDark
                      ? "bg-white/5 border border-white/10 text-white hover:scale-105"
                      : "bg-[#1a1a1a]/5 border border-black/10 text-[#1a1a1a] hover:scale-105"
                }`}
              >
                {logoInitial}
              </div>
            )}

            <AnimatePresence>
              {!(shrinkNav || (settings.footer.logo_type === "image" && !settings.footer.logo_text_with_image)) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="font-serif italic font-bold text-xs tracking-widest uppercase hidden md:inline-block transition-colors group-hover:opacity-80 whitespace-nowrap"
                >
                  {logoText}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Layout Middle: Desktop Links (Hidden when shrunk) */}
          <AnimatePresence>
            {!shrinkNav && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="hidden md:flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-full border border-black/5 dark:border-white/5 relative shrink-0"
              >
                {navItems.map((item) => {
                  const isActive = isActiveItem(item.label);
                  return (
                    <button
                      key={item.id}
                      onMouseEnter={() => preloadRoute(item.label)}
                      onFocus={() => preloadRoute(item.label)}
                      onClick={() => handleNavigation(item.id, item.label)}
                      className={`relative px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-black transition-colors duration-300 z-10 ${
                        isActive
                          ? isDark
                            ? "text-black"
                            : "text-white"
                          : isDark
                            ? "text-neutral-400 hover:text-white"
                            : "text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
                      }`}
                      id={`nav-item-${item.id}`}
                    >
                      <span className="relative z-10">{getTranslatedLabel(item.label)}</span>
                      {isActive && (
                        <motion.span
                          layoutId="active-nav-indicator"
                          className={`absolute inset-0 rounded-full z-0 ${
                            isDark ? "bg-[#f5f2ee]" : "bg-[#1a1a1a]"
                          }`}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Layout Right: Dark/Light Mode toggle, WhatsApp, Telegram & CTA Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all flex items-center justify-center hover:scale-110 active:scale-95 ${
                shrinkNav
                  ? "border-transparent bg-white/10 text-white hover:bg-white/20"
                  : isDark
                    ? "border-white/5 bg-white/5 text-amber-300 hover:bg-white/10"
                    : "border-black/5 bg-white/50 text-[#1a1a1a] hover:bg-black/5"
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              id="theme-toggler"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* WhatsApp & Telegram (Hidden when shrunk) */}
            <AnimatePresence>
              {!shrinkNav && (
                <>
                  <motion.a
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    href={`https://wa.me/${(settings.socials.whatsapp || "").replace(/\D/g, "")}?text=Hello%20Shopify%20Dev%20Studio%20%E2%80%93%20I%20would%20like%20to%20connect`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp chat"
                    className={`p-2 rounded-full border transition-all flex items-center justify-center hover:scale-110 active:scale-95 ${
                      isDark
                        ? "border-white/5 bg-white/5 text-white hover:bg-white/10"
                        : "border-black/5 bg-white/50 text-[#1a1a1a] hover:bg-black/5"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M19.077 4.928A9.873 9.873 0 0 0 12.04 2c-5.46 0-9.905 4.444-9.905 9.907 0 1.745.456 3.45 1.32 4.96L2 22l5.253-1.378a9.851 9.851 0 0 0 4.782 1.229h.004c5.46 0 9.905-4.443 9.908-9.907a9.873 9.873 0 0 0 -2.87-7.016ZM12.04 20.108a8.093 8.093 0 0 1 -4.129-1.124l-.296-.176-3.071.805.819-2.994-.193-.307a8.077 8.077 0 0 1 -1.238-4.205c0-4.464 3.633-8.097 8.1-8.097a8.037 8.037 0 0 1 5.725 2.373 8.038 8.038 0 0 1 2.372 5.728c-.004 4.466-3.637 8.098-8.102 8.098Zm4.44-6.075c-.244-.122-1.44-.71-1.662-.792-.224-.08-.387-.121-.55.123-.163.243-.63.792-.772.955-.143.162-.285.183-.529.06-.244-.12-1.03-.38-1.962-1.21-.725-.647-1.215-1.448-1.357-1.693-.143-.243-.015-.375.107-.496.11-.11.244-.284.366-.426.122-.142.163-.243.244-.406.082-.162.041-.304-.02-.426-.062-.122-.55-1.32-.753-1.81-.197-.477-.393-.41-.53-.41h-.453c-.163 0-.427.061-.65.305-.224.244-.854.834-.854 2.031s.874 2.35 1.0 2.512c.121.163 1.72 2.624 4.167 3.68.583.25 1.037.4 1.392.513.585.186 1.117.16 1.538.097.469-.07 1.44-.588 1.642-1.155.204-.568.204-1.055.143-1.155-.06-.1-.223-.162-.467-.284Z" />
                    </svg>
                  </motion.a>

                  <motion.a
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    href={`https://t.me/${settings.socials.telegram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram chat"
                    className={`p-2 rounded-full border transition-all flex items-center justify-center hover:scale-110 active:scale-95 ${
                      isDark
                        ? "border-white/5 bg-white/5 text-white hover:bg-white/10"
                        : "border-black/5 bg-white/50 text-[#1a1a1a] hover:bg-black/5"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9.7 14.6 9.5 18c.4 0 .6-.2.8-.4l2-1.9 4.1 3c.8.4 1.3.2 1.5-.7L21.6 5c.2-.9-.4-1.3-1.2-1L3.3 10.2c-.8.3-.8.8-.1 1l4.3 1.3 10-6.3-7.8 8.4Z" />
                    </svg>
                  </motion.a>
                </>
              )}
            </AnimatePresence>

            {/* Schedule/Contact CTA (Hidden when shrunk) */}
            <AnimatePresence>
              {!shrinkNav && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setCalendlyOpen(true)}
                  className={`hidden sm:flex items-center gap-1.5 font-bold text-[9px] uppercase tracking-widest py-2 px-4 rounded-full shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    isDark ? "bg-neutral-100 hover:bg-white text-black" : "bg-[#1a1a1a] hover:bg-black text-white"
                  }`}
                  id="nav-cta-contact"
                >
                  <span>{translations[currentLang]?.Contact || "Schedule Call"}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Quick Mail Trigger for Mobile Drawer */}
            <AnimatePresence>
              {!shrinkNav && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex sm:hidden"
                >
                  <button
                    onClick={() => setCalendlyOpen(true)}
                    className={`p-2 rounded-full transition-all ${
                      isDark ? "bg-white text-black hover:bg-neutral-100" : "bg-[#1a1a1a] text-white hover:bg-black"
                    }`}
                    id="mobile-nav-call"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Hamburger Trigger (Hidden when shrunk) */}
            <AnimatePresence>
              {!shrinkNav && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`md:hidden p-2 rounded-full border transition-all ${
                    isDark
                      ? "border-white/5 bg-white/5 text-white hover:bg-white/10"
                      : "border-black/10 bg-white/50 text-[#1a1a1a] hover:bg-black hover:text-white"
                  }`}
                  id="mobile-hamburguer-btn"
                >
                  {isMobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && !shrinkNav && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute top-20 left-4 right-4 border rounded-3xl p-4 shadow-2xl flex flex-col gap-2 z-40 md:hidden backdrop-blur-2xl pointer-events-auto ${
                isDark
                  ? "bg-[#121212]/95 border-white/10 text-white"
                  : "bg-white/95 border-black/10 text-[#1a1a1a]"
              }`}
            >
              {navItems.map((item) => {
                const isActive = isActiveItem(item.label);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id, item.label)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-[11px] uppercase tracking-widest font-bold transition-all relative ${
                      isActive
                        ? isDark
                          ? "bg-white/10 text-white"
                          : "bg-black/5 text-[#1a1a1a]"
                        : "text-neutral-500 hover:text-neutral-800 hover:bg-black/5"
                    }`}
                  >
                    <span className="relative z-10">{getTranslatedLabel(item.label)}</span>
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setCalendlyOpen(true);
                }}
                className={`w-full flex items-center justify-between text-xs tracking-widest uppercase py-3 px-4 rounded-xl mt-2 ${
                  isDark ? "bg-white text-black font-extrabold" : "bg-[#1a1a1a] text-white font-bold"
                }`}
              >
                <span>{translations[currentLang]?.Contact || "Schedule Call"}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <BookingModal open={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </>
  );
});

ElegantNavigation.displayName = "ElegantNavigation";

export default ElegantNavigation;

