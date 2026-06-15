import { useState, useEffect, useCallback } from "react";

export interface FooterSettings {
  copyright: string;
  logo_text: string;
  email: string;
  logo_type?: "text" | "image";
  logo_image?: string;
  favicon?: string;
  social_share_image?: string;
  seo_title?: string;
  seo_description?: string;
  logo_text_with_image?: boolean;
  enable_splash_cursor?: boolean;
}

export interface SocialSettings {
  whatsapp: string;
  telegram: string;
}

export interface NavItem {
  id: string;
  label: string;
}

export interface PartnerExpert {
  name: string;
  title: string;
  company: string;
  avatar: string;
  verified: boolean;
  hook: string;
  achievement: string;
  comment: string;
  linkedinUrl: string;
  website: string;
  instagramHandle: string;
  twitterHandle: string;
}

export interface PartnerTweet {
  author: string;
  handle: string;
  avatar: string;
  time: string;
  content: string;
  replies: string;
  retweets: string;
  likes: string;
}

export interface PartnerInstagram {
  username: string;
  comment: string;
  likes: string;
  image: string;
  website: string;
}

export interface PartnerShowcase {
  storeName: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  improvements: string[];
  testimonial: string;
  clientRole: string;
  challenge: string;
  solution: string;
  websiteUrl: string;
}

export interface PartnersContent {
  experts: PartnerExpert[];
  tweets: PartnerTweet[];
  instagram: PartnerInstagram[];
  showcases: PartnerShowcase[];
}

export interface SiteSettings {
  footer: FooterSettings;
  socials: SocialSettings;
  navigation: NavItem[];
  partners: PartnersContent;
}

export const DEFAULT_PARTNERS: PartnersContent = {
  experts: [
    {
      name: "Kurt Elster",
      title: "Shopify Expert & Podcast Host",
      company: "Ethercycle",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      verified: true,
      hook: "500+ stores optimized • $50M+ revenue generated",
      achievement: "Host of #1 Shopify Podcast",
      comment: "Working with this dev team has been a game-changer. Their technical depth in Shopify Plus is unmatched. They optimized our client's store and saw a 340% increase in conversions within 6 weeks.",
      linkedinUrl: "https://www.linkedin.com/in/kurtelster/",
      website: "https://ethercycle.com",
      instagramHandle: "@kurtelster",
      twitterHandle: "@kurtelster"
    },
    {
      name: "Ezra Firestone",
      title: "E-commerce Expert & Entrepreneur",
      company: "Smart Marketer",
      avatar: "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F75f1894b3c544e9f81c5cbb0eba318ef?format=webp&width=800",
      verified: true,
      hook: "Built 8-figure businesses • 200K+ community",
      achievement: "Generated $50M+ in sales",
      comment: "These developers understand e-commerce at a deep level. They rebuilt our entire funnel system and helped us scale. The custom features they built are exactly what we needed to compete with Amazon.",
      linkedinUrl: "https://www.linkedin.com/in/ezrafirestone/",
      website: "https://smartmarketer.com",
      instagramHandle: "@ezrafirestone",
      twitterHandle: "@ezrafirestone"
    },
    {
      name: "Tanner Larsson",
      title: "E-commerce Growth Expert",
      company: "Build Grow Scale",
      avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face",
      verified: true,
      hook: "100+ brands scaled • $200M+ revenue generated",
      achievement: "Built multiple 7-figure brands",
      comment: "I've worked with many dev teams, but this one actually gets e-commerce. They optimized our checkout flow and reduced cart abandonment by 67%.",
      linkedinUrl: "https://www.linkedin.com/in/tannerlarsson/",
      website: "https://buildgrowscale.com",
      instagramHandle: "@tannerlarsson",
      twitterHandle: "@tannerlarsson"
    },
    {
      name: "Steve Chou",
      title: "E-commerce Expert & Educator",
      company: "My Wife Quit Her Job",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
      verified: true,
      hook: "7-figure store owner • 50K+ students taught",
      achievement: "Created $1M+ online course business",
      comment: "Their Shopify expertise is phenomenal. They migrated our complex multi-variant product system flawlessly and improved our site speed by 85%. Our mobile conversion rate doubled overnight.",
      linkedinUrl: "https://www.linkedin.com/in/stevechou/",
      website: "https://mywifequitherjob.com",
      instagramHandle: "@stevechou",
      twitterHandle: "@stevechou"
    },
    {
      name: "Franklin Hatchett",
      title: "Dropshipping Expert & YouTuber",
      company: "Ecom Elites",
      avatar: "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Ffac0ba31d91049d095b204d5bb2870bb?format=webp&width=800",
      verified: true,
      hook: "1M+ YouTube subscribers • 300+ stores built",
      achievement: "Generated $25M+ in student sales",
      comment: "I recommend this dev team to all my students. They built our high-converting store templates that have generated over $10M in sales. Their understanding of dropshipping funnels is incredible.",
      linkedinUrl: "https://www.linkedin.com/in/franklinhatchett/",
      website: "https://ecomelites.com",
      instagramHandle: "@franklinhatchett",
      twitterHandle: "@franklinhatchett"
    }
  ],
  tweets: [
    {
      author: "Kurt Elster",
      handle: "kurtelster",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      time: "2h",
      content: "Just wrapped up an incredible project with @shopifydevstudio. Their technical expertise in Shopify Plus is unmatched. Delivered a 340% conversion increase for our client in just 6 weeks. 🚀 #shopify #ecommerce",
      replies: "24",
      retweets: "156",
      likes: "892"
    },
    {
      author: "Tanner Larsson",
      handle: "tannerlarsson",
      avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face",
      time: "1d",
      content: "Checkout flow optimization by @shopifydevstudio reduced our cart abandonment by 67%. That's an extra $180K monthly revenue! If you need Shopify development, these are your people. 🎯 #conversion #shopifyplus",
      replies: "45",
      retweets: "189",
      likes: "756"
    },
    {
      author: "Steve Chou",
      handle: "stevechou",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
      time: "2d",
      content: "@shopifydevstudio migrated our complex product system flawlessly and improved site speed by 85%. Mobile conversions doubled overnight! Their Shopify expertise is phenomenal. Highly recommended! 📱⚡ #shopify #performance",
      replies: "32",
      retweets: "142",
      likes: "634"
    }
  ],
  instagram: [
    {
      username: "@luxefashionstore",
      comment: "🔥 Sales increased 240% in first month! Best investment ever @shopifydevstudio 💯",
      likes: "2,847",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop",
      website: "luxefashion.com"
    },
    {
      username: "@techgadgetshub",
      comment: "Mind = BLOWN 🤯 Page loads in 0.8 seconds! Revenue up 180% 📈 @shopifydevstudio",
      likes: "1,923",
      image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=400&fit=crop",
      website: "techgadgetshub.com"
    },
    {
      username: "@organicskincare",
      comment: "Conversion rate: 1.2% → 4.8% 💚 Custom features are perfect! 🙌 @shopifydevstudio",
      likes: "3,156",
      image: "https://images.unsplash.com/photo-1556742400-b5c2a5bd1df1?w=400&h=400&fit=crop",
      website: "organicskincare.com"
    },
    {
      username: "@fitnessapparel",
      comment: "GAME CHANGER! 💪 Mobile sales +320%! Customers love it! 🚀 @shopifydevstudio",
      likes: "4,729",
      image: "https://images.unsplash.com/photo-1556742101-ae0a2d3c5fd0?w=400&h=400&fit=crop",
      website: "fitnessapparel.com"
    }
  ],
  showcases: [
    {
      storeName: "Peak Performance",
      category: "Fitness & Sports",
      beforeImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600&h=400&fit=crop",
      improvements: [
        "Revenue: +240% in 3 months",
        "User engagement: +156%",
        "Search conversion: +89%",
        "Repeat purchases: +123%"
      ],
      testimonial: "Most impactful investment we've made. The custom workout builder feature alone increased AOV by 78%.",
      clientRole: "Founder & CEO",
      challenge: "Complex product configurations and poor user flow",
      solution: "Custom product builder and streamlined checkout process",
      websiteUrl: "https://peakperformance.com"
    },
    {
      storeName: "Organic Glow",
      category: "Beauty & Skincare",
      beforeImage: "https://images.unsplash.com/photo-1556742400-b5c2a5bd1df1?w=600&h=400&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1556742400-b5c2a5bd1df1?w=600&h=400&fit=crop",
      improvements: [
        "Customer lifetime value: +189%",
        "Bounce rate: 45% → 12%",
        "Email signups: +234%",
        "Social shares: +167%"
      ],
      testimonial: "They understood our brand vision perfectly. The subscription feature they built drives 60% of our revenue now.",
      clientRole: "Brand Manager",
      challenge: "Building customer loyalty and recurring revenue",
      solution: "Smart subscription system and personalized product recommendations",
      websiteUrl: "https://organicglow.com"
    },
    {
      storeName: "Tech Gadgets Pro",
      category: "Electronics & Tech",
      beforeImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      improvements: [
        "Site speed: 5.2s → 0.9s",
        "Search functionality: +290% usage",
        "Cross-sells: +156%",
        "Customer support tickets: -78%"
      ],
      testimonial: "The advanced search and filtering system they built revolutionized our customer experience. Sales doubled within 8 weeks.",
      clientRole: "E-commerce Manager",
      challenge: "Large inventory management and product discovery",
      solution: "AI-powered search and intelligent product filtering system",
      websiteUrl: "https://techgadgetspro.com"
    }
  ]
};

export const DEFAULT_SETTINGS: SiteSettings = {
  footer: {
    copyright: "© 2026 Shopifydevstudio. All rights reserved.",
    logo_text: "Dev Studio",
    email: "shopifydevstudioo@gmail.com",
    logo_type: "text",
    logo_image: "",
    favicon: "",
    social_share_image: "",
    seo_title: "",
    seo_description: "",
    logo_text_with_image: false,
    enable_splash_cursor: false
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
  ],
  partners: DEFAULT_PARTNERS
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
        navigation: Array.isArray(data.navigation) ? data.navigation : DEFAULT_SETTINGS.navigation,
        partners: data.partners || DEFAULT_SETTINGS.partners
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

  useEffect(() => {
    if (settings && settings.footer) {
      // 1. Update favicon if present
      const faviconUrl = settings.footer.favicon;
      if (faviconUrl) {
        const icons = document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]');
        icons.forEach(el => {
          el.setAttribute('href', faviconUrl);
        });
        
        const maskIcon = document.querySelector('link[rel="mask-icon"]');
        if (maskIcon) {
          maskIcon.setAttribute('href', faviconUrl);
        }
      }

      // 2. Update social share image if present
      const ogImageUrl = settings.footer.social_share_image;
      if (ogImageUrl) {
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
          ogImage.setAttribute('content', ogImageUrl);
        }
        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        if (twitterImage) {
          twitterImage.setAttribute('content', ogImageUrl);
        }
      }

      // 3. Update SEO Title if present
      const title = settings.footer.seo_title;
      if (title) {
        document.title = title;
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', title);
        }
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) {
          twitterTitle.setAttribute('content', title);
        }
      }

      // 4. Update SEO Description if present
      const description = settings.footer.seo_description;
      if (description) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', description);
        }
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
          ogDesc.setAttribute('content', description);
        }
        const twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (twitterDesc) {
          twitterDesc.setAttribute('content', description);
        }
      }
    }
  }, [settings]);

  return {
    settings,
    loading,
    error,
    refetch: () => fetchSettings(true),
    updateSetting
  };
};
