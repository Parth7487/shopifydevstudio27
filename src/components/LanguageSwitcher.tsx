import { useLanguage } from "@/contexts/LanguageContext";
import { SUPPORTED_LANGUAGES } from "@/lib/translations";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "dropdown" | "inline";
}

const LanguageSwitcher = ({
  className = "",
  variant = "dropdown",
}: LanguageSwitcherProps) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const flagEmojis: Record<string, string> = {
    en: "🇬🇧",
    es: "🇪🇸",
    fr: "🇫🇷",
    de: "🇩🇪",
    it: "🇮🇹",
    pt: "🇵🇹",
    ja: "🇯🇵",
    zh: "🇨🇳",
    ko: "🇰🇷",
    ar: "🇸🇦",
    ru: "🇷���",
    in: "🇮🇩",
  };

  if (variant === "inline") {
    return (
      <div className={`flex gap-1 ${className}`}>
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
          <button
            key={code}
            onClick={() => setLanguage(code as any)}
            className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
              language === code
                ? "bg-beige text-black"
                : "bg-charcoal/50 text-gray-400 hover:text-beige hover:bg-charcoal"
            }`}
            title={name}
          >
            {flagEmojis[code] || code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-charcoal/50 hover:bg-charcoal text-gray-400 hover:text-beige transition-colors duration-200 text-sm font-medium"
        aria-label={t("common.language")}
        aria-expanded={isOpen}
      >
        <span>{flagEmojis[language] || "🌐"}</span>
        <span className="hidden sm:inline">
          {SUPPORTED_LANGUAGES[language]}
        </span>
        <span className="text-xs text-gray-500">▼</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-56 bg-charcoal border border-beige/20 rounded-lg shadow-xl z-50 overflow-hidden"
            >
              <div className="p-2">
                <p className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase tracking-wider">
                  {t("common.selectLanguage")}
                </p>

                <div className="space-y-1">
                  {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLanguage(code as any);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-colors duration-150 text-left ${
                        language === code
                          ? "bg-beige/20 text-beige"
                          : "text-gray-400 hover:text-beige hover:bg-charcoal/50"
                      }`}
                    >
                      <span className="text-lg">{flagEmojis[code]}</span>
                      <span className="flex-1 font-medium">{name}</span>
                      {language === code && (
                        <span className="text-beige text-lg">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
