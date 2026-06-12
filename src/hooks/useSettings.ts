import { useState, useEffect, useCallback } from "react";

export interface FooterSettings {
  copyright: string;
  logo_text: string;
  email: string;
}

export interface SocialSettings {
  whatsapp: string;
  telegram: string;
}

export interface NavItem {
  id: string;
  label: string;
}

export interface SiteSettings {
  footer: FooterSettings;
  socials: SocialSettings;
  navigation: NavItem[];
}

export const DEFAULT_SETTINGS: SiteSettings = {
  footer: {
    copyright: "© 2026 Shopifydevstudio. All rights reserved.",
    logo_text: "Dev Studio",
    email: "shopifydevstudioo@gmail.com"
  },
  socials: {
    whatsapp: "+917487080421",
    telegram: "prime2357"
  },
  navigation: [
    { id: "hero", label: "Home" },
    { id: "services", label: "Services" },
    { id: "process", label: "Process" },
    { id: "work", label: "Work" },
    { id: "partners", label: "Partners" },
    { id: "about", label: "About" }
  ]
};

// In-memory cache for instant loads
let cachedSettings: SiteSettings | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds

export const useSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(cachedSettings || DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(!cachedSettings);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async (skipCache = false) => {
    try {
      const now = Date.now();
      if (!skipCache && cachedSettings && (now - cacheTimestamp < CACHE_DURATION)) {
        setSettings(cachedSettings);
        setLoading(false);
        return;
      }

      setLoading(!cachedSettings);
      setError(null);

      const response = await fetch("/api/settings");
      if (!response.ok) {
        throw new Error(`Failed to fetch settings: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Merge with defaults to ensure we have all required structures
      const mergedSettings: SiteSettings = {
        footer: { ...DEFAULT_SETTINGS.footer, ...(data.footer || {}) },
        socials: { ...DEFAULT_SETTINGS.socials, ...(data.socials || {}) },
        navigation: Array.isArray(data.navigation) ? data.navigation : DEFAULT_SETTINGS.navigation
      };

      setSettings(mergedSettings);
      cachedSettings = mergedSettings;
      cacheTimestamp = Date.now();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings");
      // Fallback is already set as default state
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSetting = useCallback(async (key: keyof SiteSettings, value: any) => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value })
      });

      if (!response.ok) {
        throw new Error(`Failed to update setting: ${response.status} ${response.statusText}`);
      }

      // Update local state and cache
      setSettings(prev => {
        const next = { ...prev, [key]: value };
        cachedSettings = next;
        cacheTimestamp = Date.now();
        return next;
      });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    refetch: () => fetchSettings(true),
    updateSetting
  };
};
