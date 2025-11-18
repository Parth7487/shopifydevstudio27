import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Language,
  SUPPORTED_LANGUAGES,
  COUNTRY_TO_LANGUAGE,
  getTranslation,
} from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Get user's country code from IP geolocation
const detectUserCountry = async (): Promise<string | null> => {
  try {
    // Use a free geolocation API
    const response = await fetch("https://ipapi.co/json/", {
      mode: "no-cors",
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.country_code || null;
  } catch {
    // Fallback: try using browser language
    const browserLang = navigator.language.split("-")[1]?.toUpperCase();
    return browserLang || null;
  }
};

// Get preferred language based on browser and country
const getPreferredLanguage = async (): Promise<Language> => {
  // Check localStorage first
  const stored = localStorage.getItem("language") as Language | null;
  if (stored && stored in SUPPORTED_LANGUAGES) {
    return stored;
  }

  // Try to detect country and get language
  const country = await detectUserCountry();
  if (country && country in COUNTRY_TO_LANGUAGE) {
    return COUNTRY_TO_LANGUAGE[country];
  }

  // Fallback to browser language if available
  const browserLang = navigator.language.split("-")[0].toLowerCase();
  if (browserLang in SUPPORTED_LANGUAGES) {
    return browserLang as Language;
  }

  // Default to English
  return "en";
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = async () => {
      const preferredLanguage = await getPreferredLanguage();
      setLanguageState(preferredLanguage);
      setIsInitialized(true);
    };

    initializeLanguage();
  }, []);

  const setLanguage = (newLanguage: Language) => {
    if (newLanguage in SUPPORTED_LANGUAGES) {
      setLanguageState(newLanguage);
      localStorage.setItem("language", newLanguage);
    }
  };

  const t = (
    key: string,
    replacements?: Record<string, string | number>,
  ): string => {
    return getTranslation(language, key, replacements);
  };

  // Don't render until language is initialized to avoid flash
  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
