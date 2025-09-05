import { motion } from "framer-motion";
import { useState, useMemo, memo, useEffect, useCallback } from "react";
import {
  ExternalLink,
  Play,
  Search,
  Filter,
  Star,
  TrendingUp,
  Zap,
  ShoppingCart,
  Settings,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import ElegantNavigation from "../components/sections/ElegantNavigation";
import Footer from "../components/sections/Footer";
import OptimizedImage from "../components/OptimizedImage";
import CalendlyModal from "../components/sections/CalendlyModal";

const Work = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Projects");
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  // Fetch projects from Supabase
  const {
    projects: supabaseProjects,
    loading: supabaseLoading,
    error: supabaseError,
    refetch: refetchProjects,
  } = useProjects();

  const [portfolioProjects, setPortfolioProjects] = useState<any[]>([]);

  // Default portfolio projects (fallback when no CMS data)
  const defaultPortfolioProjects = [
    {
      id: 1,
      title: "Kotn - Sustainable Fashion",
      brand: "Kotn",
      description:
        "A premium Egyptian cotton fashion brand that champions sustainable manufacturing. The site features immersive storytelling about their supply chain, impact tracking dashboards, and interactive product customization tools that helped increase customer engagement by showcasing their commitment to ethical fashion.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fedcb8435931f44eb9b505c05d6b5320b?format=webp&width=1280",
      imageHover:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Ffe0af747be454520afaf237069cbde7d?format=webp&width=1280",
      videoUrl:
        "https://player.vimeo.com/video/847503258?autoplay=1&loop=1&muted=1",
      category: "Fashion",
      tags: ["Sustainable Fashion", "Story-driven"],
      tech: ["Shopify Plus", "Custom Apps", "Mobile First"],
      metrics: {
        conversion: "420%",
        loadTime: "0.6s",
      },
      liveUrl: "https://kotn.com/",
      featured: true,
      hasVideo: true,
    },
    {
      id: 2,
      title: "Rothy's - Sustainable Shoes",
      brand: "Rothy's",
      description:
        "Revolutionary footwear brand creating shoes from recycled plastic bottles. The website showcases their innovative 3D knitting technology with interactive product visualization, precise size matching algorithms, and virtual try-on features that reduced returns and boosted customer confidence.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fd4ca22878f6648a8914d31d02e810994?format=webp&width=1280",
      imageHover:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F2125aea746ff422a86745d34681e8791?format=webp&width=1280",
      videoUrl:
        "https://player.vimeo.com/video/743163629?autoplay=1&loop=1&muted=1",
      category: "Fashion",
      tags: ["3D Technology", "Sustainability"],
      tech: ["Shopify Plus", "AR Integration", "Custom Quiz"],
      metrics: {
        conversion: "385%",
        loadTime: "0.7s",
      },
      liveUrl: "https://rothys.com/",
      featured: false,
      hasVideo: true,
    },
    {
      id: 3,
      title: "Fenty Beauty - Inclusive Beauty",
      brand: "Fenty Beauty",
      description:
        "Rihanna's groundbreaking beauty empire that redefined inclusivity in cosmetics. The platform features advanced shade matching AI, virtual try-on experiences, and user-generated content galleries that celebrate diversity, resulting in record-breaking product launches and community engagement.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F65b6338bafb244c19dbffc3a5eb0f08d?format=webp&width=1280",
      imageHover:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F970f16bdaec540b794022fe7d386d183?format=webp&width=1280",
      videoUrl:
        "https://player.vimeo.com/video/731423904?autoplay=1&loop=1&muted=1",
      category: "Beauty",
      tags: ["Shade Matching", "AR Try-On"],
      tech: ["Shopify Plus", "AR Technology", "Live Chat"],
      metrics: {
        conversion: "450%",
        loadTime: "0.5s",
      },
      liveUrl: "https://fentybeauty.com/",
      featured: true,
      hasVideo: true,
    },
    {
      id: 4,
      title: "Herbivore Botanicals - Clean Beauty",
      brand: "Herbivore",
      description:
        "Clean beauty pioneer emphasizing ingredient transparency and natural formulations. The site features detailed ingredient sourcing stories, interactive skin analysis quizzes, educational content about clean beauty, and personalized product recommendations based on skin type and concerns.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F8b6ff11188004f2f987b8c3bbeb05763?format=webp&width=800",
      category: "Beauty",
      tags: ["Clean Beauty", "Ingredient Focus"],
      tech: ["Shopify", "Quiz Integration", "Clean Code"],
      metrics: {
        conversion: "340%",
        loadTime: "0.8s",
      },
      liveUrl: "https://herbivorebotanicals.com/",
      featured: false,
      hasVideo: false,
    },
    {
      id: 5,
      title: "Burrow - Modular Furniture",
      brand: "Burrow",
      description:
        "Modern furniture brand specializing in modular, easy-to-assemble pieces. The website offers sophisticated 3D room visualization tools, drag-and-drop furniture configuration, AR placement features, and detailed assembly guides that simplified the furniture buying experience.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Ff76df5449ec447f1802e2eb11a4f74cc?format=webp&width=800",
      videoUrl:
        "https://player.vimeo.com/video/736275204?autoplay=1&loop=1&muted=1",
      category: "Home & Garden",
      tags: ["3D Visualization", "Modular Design"],
      tech: ["Shopify Plus", "3D Technology", "Custom Builder"],
      metrics: {
        conversion: "375%",
        loadTime: "0.9s",
      },
      liveUrl: "https://burrow.com/",
      featured: false,
      hasVideo: true,
    },
    {
      id: 6,
      title: "Tuft & Needle - Sleep Innovation",
      brand: "Tuft & Needle",
      description:
        "Sleep innovation company focused on premium mattresses and sleep optimization. Features an intelligent mattress selector quiz, sleep tracking integration, educational content about sleep science, and a comprehensive trial program that builds customer trust and reduces purchase anxiety.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F949702c24f604351b6197d59ac91fd17?format=webp&width=800",
      category: "Home & Garden",
      tags: ["Sleep Tech", "Quiz Builder"],
      tech: ["Shopify", "Sleep Quiz", "Trial System"],
      metrics: {
        conversion: "320%",
        loadTime: "0.7s",
      },
      liveUrl: "https://tuftandneedle.com/",
      featured: false,
      hasVideo: false,
    },
    {
      id: 10,
      title: "Daily Harvest - Superfood Delivery",
      brand: "Daily Harvest",
      description:
        "Superfood delivery service with nutritional tracking and meal planning tools.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fbaba4c9c65ac4e99a9cd8353423de404?format=webp&width=800",
      category: "Food & Beverage",
      tags: ["Superfood", "Meal Planning"],
      tech: ["Shopify Plus", "Nutrition API", "Meal Planner"],
      metrics: {
        conversion: "365%",
        loadTime: "0.6s",
      },
      liveUrl: "https://daily-harvest.com/",
      featured: false,
      hasVideo: false,
    },
    {
      id: 11,
      title: "Mejuri - Fine Jewelry",
      brand: "Mejuri",
      description:
        "Fine jewelry brand with virtual try-on technology and personalization features.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fd909e91b354a4c56981710883340e7e2?format=webp&width=800",
      videoUrl:
        "https://player.vimeo.com/video/456789123?autoplay=1&loop=1&muted=1",
      category: "Jewelry",
      tags: ["Virtual Try-On", "Fine Jewelry"],
      tech: ["Shopify Plus", "AR Technology", "Luxury Experience"],
      metrics: {
        conversion: "425%",
        loadTime: "0.5s",
      },
      liveUrl: "https://mejuri.com/",
      featured: true,
      hasVideo: true,
    },
    {
      id: 12,
      title: "Outdoor Voices - Athletic Wear",
      brand: "Outdoor Voices",
      description:
        "Community-driven athletic wear brand with social fitness integration and local event features.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F46ff449fe2264a32bcc421ec79f0fb81?format=webp&width=1280",
      imageHover:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F6da0fe6abe844bfb822da2915cd23413?format=webp&width=1280",
      videoUrl:
        "https://player.vimeo.com/video/678912345?autoplay=1&loop=1&muted=1",
      category: "Fashion",
      tags: ["Community Focus", "Athletic Wear"],
      tech: ["Shopify Plus", "Community Features", "Event API"],
      metrics: {
        conversion: "365%",
        loadTime: "0.6s",
      },
      liveUrl: "https://outdoorvoices.com/",
      featured: false,
      hasVideo: true,
    },
    {
      id: 13,
      title: "Allbirds - Sustainable Footwear",
      brand: "Allbirds",
      description:
        "Pioneer in sustainable footwear made from renewable materials like merino wool and eucalyptus. Features transparent carbon footprint tracking for every product, material innovation showcases, recycling programs, and environmental impact calculators that educated consumers about sustainable choices.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Ff263af1ef6614bbfb777cd05802bc9a6?format=webp&width=1280",
      imageHover:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F71d7120cd41d44278771f138008ab204?format=webp&width=1280",
      videoUrl:
        "https://player.vimeo.com/video/456789012?autoplay=1&loop=1&muted=1",
      category: "Fashion",
      tags: ["Sustainable Materials", "Carbon Tracking"],
      tech: ["Shopify Plus", "Sustainability API", "Carbon Calculator"],
      metrics: {
        conversion: "395%",
        loadTime: "0.5s",
      },
      liveUrl: "https://allbirds.com/",
      featured: true,
      hasVideo: true,
    },
    {
      id: 17,
      title: "Death Wish Coffee - Bold Brews",
      brand: "Death Wish Coffee",
      description:
        "World's strongest coffee with subscription model and brewing guides integration.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fd3ccfd7f90bb40bba243ccf3e66ecd5d?format=webp&width=1280",
      imageHover:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F952b87f38e4845aca65937386b0554f2?format=webp&width=1280",
      category: "Food & Beverage",
      tags: ["Subscription Model", "Strong Coffee"],
      tech: ["Shopify Plus", "Subscription Engine", "Brewing Guides"],
      metrics: {
        conversion: "375%",
        loadTime: "0.7s",
      },
      liveUrl: "https://deathwishcoffee.com/",
      featured: false,
      hasVideo: false,
    },
    {
      id: 18,
      title: "Pura Vida - Artisan Jewelry",
      brand: "Pura Vida",
      description:
        "Handcrafted jewelry with charity partnerships and artisan story integration.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2F536d0ae12a9a4a46b044b3bd7a6a5923?format=webp&width=1280",
      imageHover:
        "https://cdn.builder.io/api/v1/image/assets%2F18655d8613064687a43655fcf3963c51%2Fa78badeec40d467eb6f741ca447f6898?format=webp&width=1280",
      videoUrl:
        "https://player.vimeo.com/video/789012456?autoplay=1&loop=1&muted=1",
      category: "Jewelry",
      tags: ["Artisan Crafted", "Charity Partnership"],
      tech: ["Shopify Plus", "Charity Integration", "Artisan Stories"],
      metrics: {
        conversion: "410%",
        loadTime: "0.6s",
      },
      liveUrl: "https://puravidabracelets.com/",
      featured: false,
      hasVideo: true,
    },
    {
      id: 19,
      title: "Bombas - Comfort Socks",
      brand: "Bombas",
      description:
        "Comfort-focused socks with social impact tracking and donation matching program.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F74949d852c074bc4b57ff0fff3c297ee?format=webp&width=800",
      imageHover:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fbbb37f4ca9c94d96bb1844865fe62925?format=webp&width=800",
      category: "Fashion",
      tags: ["Social Impact", "Comfort Technology"],
      tech: ["Shopify Plus", "Impact Tracking", "Donation System"],
      metrics: {
        conversion: "425%",
        loadTime: "0.5s",
      },
      liveUrl: "https://bombas.com/",
      featured: false,
      hasVideo: false,
    },
    {
      id: 21,
      title: "Triangl - Designer Swimwear",
      brand: "Triangl",
      description:
        "Luxury swimwear brand with virtual fitting technology and seasonal collections.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fb519514eaa674de1b183894be58328cd?format=webp&width=800",
      imageHover:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F01d64a44f39844638e43f866b793afbc?format=webp&width=800",
      category: "Fashion",
      tags: ["Luxury Swimwear", "Virtual Fitting"],
      tech: ["Shopify Plus", "AR Fitting", "Seasonal Collections"],
      metrics: {
        conversion: "465%",
        loadTime: "0.5s",
      },
      liveUrl: "https://triangl.com/",
      featured: true,
      hasVideo: false,
    },
    {
      id: 22,
      title: "Fashion Nova - Fast Fashion",
      brand: "Fashion Nova",
      description:
        "Trendy fashion with influencer integration and real-time inventory management.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F18fae872d56b46c4a993bdf2fb7ff6ce?format=webp&width=800",
      imageHover:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fef01753c32fb495484f3644394e2ef36?format=webp&width=800",
      videoUrl:
        "https://player.vimeo.com/video/901234678?autoplay=1&loop=1&muted=1",
      category: "Fashion",
      tags: ["Influencer Marketing", "Fast Fashion"],
      tech: ["Shopify Plus", "Influencer Platform", "Real-time Inventory"],
      metrics: {
        conversion: "385%",
        loadTime: "0.7s",
      },
      liveUrl: "https://fashionnova.com/",
      featured: false,
      hasVideo: true,
    },
    {
      id: 23,
      title: "Casper - Sleep Innovation",
      brand: "Casper",
      description:
        "Revolutionary sleep products with sleep tracking and personalized recommendations.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F6c1a58fd7160441ea71dd38a3916e374?format=webp&width=800",
      imageHover:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F6a03f9f1f75140aa992029f74ad389c8?format=webp&width=800",
      category: "Home & Garden",
      tags: ["Sleep Technology", "Personalization"],
      tech: ["Shopify Plus", "Sleep Quiz", "Smart Recommendations"],
      metrics: {
        conversion: "430%",
        loadTime: "0.6s",
      },
      liveUrl: "https://casper.com/",
      featured: false,
      hasVideo: false,
    },
    {
      id: 24,
      title: "Warby Parker - Eyewear Revolution",
      brand: "Warby Parker",
      description:
        "Affordable designer eyewear with virtual try-on and home try-on program.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fb1dbcacf16f54c05997a0ae856630d68?format=webp&width=800",
      imageHover:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F6ab5884447c14369814899e94a658233?format=webp&width=800",
      videoUrl:
        "https://player.vimeo.com/video/012345789?autoplay=1&loop=1&muted=1",
      category: "Fashion",
      tags: ["Virtual Try-On", "Home Try-On"],
      tech: ["Shopify Plus", "AR Technology", "Try-On Program"],
      metrics: {
        conversion: "455%",
        loadTime: "0.5s",
      },
      liveUrl: "https://warbyparker.com/",
      featured: true,
      hasVideo: true,
    },
    {
      id: 25,
      title: "Glossier - Beauty Community",
      brand: "Glossier",
      description:
        "Community-driven beauty brand with user-generated content and skincare diagnostics.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F925b231ab1bf4c45aa302d09fe61667a?format=webp&width=800",
      imageHover:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fff589c465cb74fee8cecaf975a2dd075?format=webp&width=800",
      category: "Beauty",
      tags: ["Community Driven", "User Generated"],
      tech: ["Shopify Plus", "Community Platform", "Skin Diagnostics"],
      metrics: {
        conversion: "475%",
        loadTime: "0.4s",
      },
      liveUrl: "https://glossier.com/",
      featured: false,
      hasVideo: false,
    },
    {
      id: 28,
      title: "Chubbies - Fun Menswear",
      brand: "Chubbies",
      description:
        "Fun men's shorts and apparel with gamified shopping and social sharing features.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F3f9d694493774c63bdcd12888444ad7e?format=webp&width=800",
      imageHover:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F1838dfb9e6204821b4c22ec1c1a3f401?format=webp&width=800",
      category: "Fashion",
      tags: ["Fun Apparel", "Gamification"],
      tech: ["Shopify Plus", "Gamification", "Social Sharing"],
      metrics: {
        conversion: "365%",
        loadTime: "0.6s",
      },
      liveUrl: "https://chubbiesshorts.com/",
      featured: false,
      hasVideo: false,
    },
    {
      id: 29,
      title: "Ritual - Smart Vitamins",
      brand: "Ritual",
      description:
        "Science-backed vitamins with ingredient transparency and health tracking integration.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fcff9690ccdaf4822b5df5f145edd9901?format=webp&width=800",
      imageHover:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fee5ada50b5b74cbbad13a05508292566?format=webp&width=800",
      videoUrl:
        "https://player.vimeo.com/video/234567901?autoplay=1&loop=1&muted=1",
      category: "Health & Wellness",
      tags: ["Science-Backed", "Transparency"],
      tech: ["Shopify Plus", "Health Tracking", "Ingredient Database"],
      metrics: {
        conversion: "420%",
        loadTime: "0.5s",
      },
      liveUrl: "https://ritual.com/",
      featured: false,
      hasVideo: true,
    },
    {
      id: 30,
      title: "Patagonia - Outdoor Gear",
      brand: "Patagonia",
      description:
        "Sustainable outdoor gear with environmental impact tracking and repair guides.",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fef8620b9e4954c9c8d2a95d1bc542c53?format=webp&width=800",
      imageHover:
        "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2Fec52cc61e4f0492b94fe59eb71e9bbe4?format=webp&width=800",
      category: "Sports & Outdoors",
      tags: ["Sustainability", "Outdoor Performance"],
      tech: ["Shopify Plus", "Impact Tracking", "Repair Guides"],
      metrics: {
        conversion: "415%",
        loadTime: "0.6s",
      },
      liveUrl: "https://patagonia.com/",
      featured: true,
      hasVideo: false,
    },
  ];

  const defaultPortfolioProjectsWithoutAllbirds =
    defaultPortfolioProjects.filter(
      (p) => (p.brand || "").toLowerCase() !== "allbirds",
    );

  // Optimized load projects function with instant Supabase integration
  const loadProjects = useCallback(() => {
    // Prioritize Supabase data for instant loading
    if (supabaseProjects.length > 0) {
      setPortfolioProjects(supabaseProjects);
      return;
    }

    // If Supabase is loading but we have no data yet, show default immediately
    if (supabaseLoading) {
      setPortfolioProjects(defaultPortfolioProjectsWithoutAllbirds);
      return;
    }

    // Final fallback to default projects (CMS disabled for performance)
    setPortfolioProjects(defaultPortfolioProjectsWithoutAllbirds);
  }, [supabaseProjects, supabaseLoading]);

  // Instant initial load
  useEffect(() => {
    // Show default projects immediately for instant display
    setPortfolioProjects(defaultPortfolioProjectsWithoutAllbirds);
  }, []);

  // Load projects from multiple sources (Supabase -> CMS -> Default)
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Dynamic categories based on actual projects
  const categories = useMemo(() => {
    const categoryCount: { [key: string]: number } = {};

    portfolioProjects.forEach((project) => {
      categoryCount[project.category] =
        (categoryCount[project.category] || 0) + 1;
    });

    const dynamicCategories = [
      { name: "All Projects", count: portfolioProjects.length },
      ...Object.entries(categoryCount).map(([name, count]) => ({
        name,
        count,
      })),
    ];

    return dynamicCategories;
  }, [portfolioProjects]);

  // Optimized filter projects with useMemo for better performance
  const filteredProjects = useMemo(() => {
    return portfolioProjects
      .filter((project) => (project.brand || "").toLowerCase() !== "allbirds")
      .filter((project) => {
        const matchesSearch =
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          );
        const matchesCategory =
          selectedCategory === "All Projects" ||
          project.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });
  }, [searchTerm, selectedCategory, portfolioProjects]);

  // Prioritize specific brands order
  const orderedProjects = useMemo(() => {
    const priority = [
      "Kotn",
      "Outdoor Voices",
      "Triangl",
      "Death Wish Coffee",
      "Warby Parker",
      "Glossier",
      "Bombas",
      "Pura Vida",
      "Fashion Nova",
    ];
    const indexOf = (brand: string) => {
      const i = priority.indexOf(brand);
      return i === -1 ? Number.MAX_SAFE_INTEGER : i;
    };
    return filteredProjects
      .map((p, i) => ({ p, i }))
      .sort((a, b) => {
        const pa = indexOf(a.p.brand);
        const pb = indexOf(b.p.brand);
        if (pa !== pb) return pa - pb;
        return a.i - b.i; // stable for equal priority
      })
      .map(({ p }) => p);
  }, [filteredProjects]);

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Glossy overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent pointer-events-none"></div>

      <ElegantNavigation />

      {/* Hero Section */}
      <section className="relative py-20 px-8 bg-black backdrop-blur-sm overflow-hidden border-b border-white/5">
        {/* Glossy reflections */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/[0.02] rounded-full filter blur-[64px]"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/[0.015] rounded-full filter blur-[64px]"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Our <span className="text-beige">Portfolio</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Discover our collection of high-converting Shopify stores that
            combine stunning design with powerful performance optimization.
          </motion.p>

          {/* Admin Access Button and Data Source Status */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {/* Data Source Status Indicator */}
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 text-xs border border-white/10">
              {supabaseLoading ? (
                <>
                  <Loader2 className="w-2 h-2 animate-spin text-blue-400" />
                  <span className="text-gray-300">Loading...</span>
                </>
              ) : supabaseError ? (
                <>
                  <AlertCircle className="w-2 h-2 text-red-400" />
                  <span className="text-gray-300">Supabase Error</span>
                </>
              ) : supabaseProjects.length > 0 ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-gray-300">Supabase Data</span>
                </>
              ) : portfolioProjects.length !==
                defaultPortfolioProjectsWithoutAllbirds.length ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-gray-300">CMS Data</span>
                </>
              ) : null}
            </div>

            <button
              onClick={() => (window.location.href = "/admin")}
              className="opacity-0 hover:opacity-100 transition-opacity duration-300 p-2 text-gray-500 hover:text-beige text-xs bg-black/60 backdrop-blur-md rounded-full border border-white/10"
              title="Admin Dashboard - Google Drive Sync"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Error Banner */}
      {supabaseError && (
        <section className="bg-red-900/20 border-y border-red-500/20 py-4 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-red-400 font-medium">
                  Failed to load from Supabase
                </p>
                <p className="text-red-300 text-sm">{supabaseError}</p>
              </div>
            </div>
            <button
              onClick={refetchProjects}
              disabled={supabaseLoading}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {supabaseLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Retry"
              )}
            </button>
          </div>
        </section>
      )}

      {/* Search and Filter Section */}
      <section className="bg-black/95 backdrop-blur-md py-6 sm:py-8 border-y border-white/10 shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"></div>
        <div className="max-w-[1152px] mx-auto px-4 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="flex-1 relative max-w-full sm:max-w-[448px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/80 backdrop-blur-md border border-white/20 rounded-lg py-3 pl-9 sm:pl-10 pr-4 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-beige/50 transition-all duration-300"
              />
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-beige" />
              <span className="text-gray-400 text-xs sm:text-sm">
                Filter by category:
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "bg-beige text-charcoal shadow-lg"
                    : "bg-black/60 backdrop-blur-md text-gray-400 hover:bg-black/80 border border-white/10 hover:border-white/20"
                }`}
              >
                <span>{category.name}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedCategory === category.name
                      ? "bg-charcoal/20 text-charcoal"
                      : "bg-beige/20 text-beige"
                  }`}
                >
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-8 sm:py-12 lg:py-16 bg-black relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] via-transparent to-white/[0.01]"></div>
        <div className="max-w-[1280px] mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
            {orderedProjects.map((project, index) => (
              <motion.a
                key={project.id}
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.2,
                  delay: Math.min(index * 0.02, 0.3),
                }}
                whileHover={{ y: -2 }}
                className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-black/80 border border-white/10 shadow-xl hover:shadow-2xl hover:border-white/20 transition-all duration-300"
                aria-label={`Open ${project.title}`}
              >
                {/* Media */}
                <div className="relative aspect-video overflow-hidden">
                  <OptimizedImage
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    width={1280}
                    height={720}
                    loading={index < 4 ? "eager" : "lazy"}
                  />
                  {project.imageHover && (
                    <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <OptimizedImage
                        src={project.imageHover}
                        alt={`${project.title} hover`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        width={1280}
                        height={720}
                        loading="lazy"
                        fetchPriority="low"
                      />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute left-3 right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-white text-sm sm:text-base font-semibold truncate">
                          {project.title}
                        </h3>
                        <div className="text-xs text-gray-300 truncate">
                          {project.brand}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-white/80 shrink-0" />
                    </div>
                  </div>
                </div>

                {/* Caption row */}
                <div className="flex items-center gap-2 px-3 py-2 border-t border-white/10 bg-black/70 backdrop-blur-sm">
                  <span className="text-sm font-medium truncate">
                    {project.title}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-xs text-gray-400 truncate">
                    {project.brand}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 text-center bg-black relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/[0.02] rounded-full filter blur-[200px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/[0.01] to-transparent"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            className="bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl p-12 shadow-2xl hover:shadow-3xl hover:border-beige/30 transition-all duration-300"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Create Your{" "}
              <span className="text-beige">Success Story?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Let's build a store that not only looks amazing but also converts
              visitors into loyal customers. Your competitors won't know what
              hit them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href={"/#contact"}
                onClick={(e) => {
                  const url = (import.meta as any).env?.VITE_CALENDLY_URL as
                    | string
                    | undefined;
                  if (url) {
                    e.preventDefault();
                    setCalendlyOpen(true);
                  }
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-beige text-black font-semibold rounded-lg hover:bg-beige/90 transition-all duration-300 shadow-lg"
              >
                Start Your Project
              </motion.a>
              <motion.a
                href="/services"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-beige text-beige font-semibold rounded-lg hover:border-beige/80 transition-all duration-300"
              >
                Free Store Analysis
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-4 text-center bg-black/95 border-t border-white/10">
        <p className="text-[8px] sm:text-[10px] text-gray-500 max-w-3xl mx-auto px-4">
          Disclaimer: Some showcased websites were not built end‑to‑end by us.
          In certain cases, we contributed select features, optimizations, or
          custom tweaks.
        </p>
      </section>

      <Footer />
      <CalendlyModal
        open={
          calendlyOpen && Boolean((import.meta as any).env?.VITE_CALENDLY_URL)
        }
        onClose={() => setCalendlyOpen(false)}
      />
    </div>
  );
};

Work.displayName = "Work";

export default memo(Work);
