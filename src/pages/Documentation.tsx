import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  Book,
  Code,
  Zap,
  Settings,
  Users,
  ChevronRight,
} from "lucide-react";
import ElegantNavigation from "../components/sections/ElegantNavigation";
import Footer from "../components/sections/Footer";
import CalendlyModal from "../components/sections/CalendlyModal";
import {
  fadeInUpVariants,
  staggerContainerVariants,
} from "../hooks/use-scroll-reveal";

const Documentation = () => {
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const docSections = [
    {
      icon: Zap,
      title: "Getting Started",
      description: "Quick setup guides and basic configuration",
      articles: [
        "Initial Shopify Setup",
        "Theme Installation Guide",
        "Basic Configuration",
        "First Store Optimization",
      ],
    },
    {
      icon: Code,
      title: "Development",
      description: "Technical guides for developers",
      articles: [
        "Liquid Template Customization",
        "Custom Component Development",
        "API Integration",
        "Advanced Configurations",
      ],
    },
    {
      icon: Settings,
      title: "Optimization",
      description: "Performance and conversion optimization",
      articles: [
        "Speed Optimization Techniques",
        "SEO Best Practices",
        "Conversion Rate Optimization",
        "Mobile Optimization",
      ],
    },
    {
      icon: Users,
      title: "User Experience",
      description: "Creating exceptional customer experiences",
      articles: [
        "UX Design Principles",
        "Customer Journey Mapping",
        "Trust Signal Implementation",
        "Accessibility Guidelines",
      ],
    },
  ];

  const quickLinks = [
    "Installation Guide",
    "API Reference",
    "Troubleshooting",
    "Best Practices",
    "Migration Guide",
    "Performance Tips",
  ];

  const popularGuides = [
    {
      title: "Complete Shopify Theme Customization Guide",
      description:
        "Everything you need to know about customizing your Shopify theme",
      readTime: "15 min read",
      difficulty: "Intermediate",
    },
    {
      title: "Advanced Liquid Programming",
      description:
        "Master advanced Liquid concepts for dynamic store functionality",
      readTime: "20 min read",
      difficulty: "Advanced",
    },
    {
      title: "Conversion Optimization Checklist",
      description:
        "Step-by-step checklist to improve your store's conversion rate",
      readTime: "10 min read",
      difficulty: "Beginner",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <ElegantNavigation />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            variants={fadeInUpVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6"
          >
            <span>Complete&nbsp;</span>
            <span className="text-beige">Documentation</span>
          </motion.h1>
          <motion.p
            variants={fadeInUpVariants}
            className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto mb-8"
          >
            <span
              style={{
                fontFamily:
                  'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
              }}
            >
              Everything you need to understand our process, technologies, and
              best practices for creating world-class Shopify stores.
            </span>
            Everything you need to build, optimize, and scale your Shopify
            store. From basic setup to advanced customizations.
          </motion.p>
        </motion.div>
      </section>

      <section className="py-4 text-center bg-black/90 border-y border-white/10">
        <p className="text-[10px] sm:text-xs text-gray-500 max-w-3xl mx-auto px-4">
          Note: Some websites shown or linked here are used purely as references
          or inspiration and were not fully developed by us. As expert
          developers, we can build similar features and experiences tailored to
          your needs with ease.
        </p>
      </section>

      {/* Our Technology Stack */}
      <section className="bg-charcoal py-24 px-8">
        <div className="max-w-6xl mx-auto px-8 w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainerVariants}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUpVariants}
              className="text-4xl font-bold tracking-tight leading-tight mb-6"
            >
              Our Technology Stack
            </motion.h2>
            <motion.p
              variants={fadeInUpVariants}
              className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto"
            >
              We use cutting-edge tools and technologies to deliver exceptional
              results. Our team stays current with the latest developments in
              e-commerce technology.
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Shopify Partner",
                image: "https://cdn.shopify.com/static/shopify-favicon.png",
                description:
                  "Official Shopify Plus Partner with access to exclusive tools and resources",
                badge: "Certified",
                badgeColor: "bg-green-500/20 text-green-400",
              },
              {
                name: "Liquid Templating",
                image: "https://shopify.dev/assets/templating/liquid-icon.svg",
                description:
                  "Expert-level Shopify Liquid development for custom features and functionality",
                badge: "Expert",
                badgeColor: "bg-beige/20 text-beige",
              },
              {
                name: "Figma",
                image:
                  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
                description:
                  "Professional design tool for creating pixel-perfect mockups and prototypes",
                badge: "Professional",
                badgeColor: "bg-blue-500/20 text-blue-400",
              },
              {
                name: "Canva",
                image: "https://www.canva.com/favicon.ico",
                description:
                  "Quick design solutions for marketing materials and brand assets",
                badge: "Proficient",
                badgeColor: "bg-purple-500/20 text-purple-400",
              },
              {
                name: "HTML5",
                image:
                  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
                description:
                  "Modern semantic markup for accessible and SEO-friendly stores",
                badge: "Expert",
                badgeColor: "bg-beige/20 text-beige",
              },
              {
                name: "CSS3",
                image:
                  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
                description:
                  "Advanced styling with animations, transitions, and responsive design",
                badge: "Expert",
                badgeColor: "bg-beige/20 text-beige",
              },
              {
                name: "Tailwind CSS",
                image:
                  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
                description:
                  "Utility-first framework for rapid, consistent, and maintainable styling",
                badge: "Expert",
                badgeColor: "bg-beige/20 text-beige",
              },
              {
                name: "JavaScript",
                image:
                  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
                description:
                  "Modern ES6+ for interactive features and enhanced user experience",
                badge: "Advanced",
                badgeColor: "bg-purple-500/20 text-purple-400",
              },
            ].map((tech, index) => (
              <motion.div
                key={index}
                variants={fadeInUpVariants}
                className="bg-black border border-graphite rounded-xl p-6 hover:border-beige/20 transition-all duration-300"
              >
                <div className="flex items-center justify-center h-12 w-12 mx-auto mb-4">
                  <img
                    src={tech.image}
                    alt={tech.name}
                    className="w-10 h-10 object-contain"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg font-bold leading-7 mb-2">
                  {tech.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  {tech.description}
                </p>
                <div
                  className={`inline-block ${tech.badgeColor} rounded-full px-3 py-1 text-xs font-medium`}
                >
                  {tech.badge}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainerVariants}
            viewport={{ once: true }}
          >
            <motion.h2
              variants={fadeInUpVariants}
              className="text-3xl font-bold text-center mb-12"
            >
              Documentation Sections
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {docSections.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUpVariants}
                    className="bg-gradient-to-br from-graphite/50 to-charcoal/30 border border-beige/10 rounded-2xl p-8 hover:border-beige/20 transition-all duration-300"
                  >
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-beige/20 rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="w-6 h-6 text-beige" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{section.title}</h3>
                        <p className="text-gray-400 text-sm">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {section.articles.map((article, articleIndex) => (
                        <li key={articleIndex}>
                          <button className="flex items-center justify-between w-full text-left text-gray-300 hover:text-beige transition-colors duration-200 group">
                            <span>{article}</span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Guides */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-charcoal/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainerVariants}
            viewport={{ once: true }}
          >
            <motion.h2
              variants={fadeInUpVariants}
              className="text-3xl font-bold text-center mb-12"
            >
              Popular Guides
            </motion.h2>
            <div className="space-y-6">
              {popularGuides.map((guide, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUpVariants}
                  className="bg-gradient-to-br from-graphite/50 to-charcoal/30 border border-beige/10 rounded-2xl p-6 hover:border-beige/20 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-beige transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-gray-400 mb-3">{guide.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          {guide.readTime}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            guide.difficulty === "Beginner"
                              ? "bg-green-900/30 text-green-400"
                              : guide.difficulty === "Intermediate"
                                ? "bg-yellow-900/30 text-yellow-400"
                                : "bg-red-900/30 text-red-400"
                          }`}
                        >
                          {guide.difficulty}
                        </span>
                      </div>
                    </div>
                    <Book className="w-5 h-5 text-beige opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* API Reference */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={staggerContainerVariants}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            variants={fadeInUpVariants}
            className="bg-gradient-to-r from-beige/10 to-clay/10 border border-beige/20 rounded-2xl p-8"
          >
            <motion.h2
              variants={fadeInUpVariants}
              className="text-2xl sm:text-3xl font-bold mb-4"
            >
              Need Something <span className="text-beige">Specific?</span>
            </motion.h2>
            <motion.p
              variants={fadeInUpVariants}
              className="text-gray-400 mb-6 max-w-2xl mx-auto"
            >
              Can't find what you're looking for? Check our API reference,
              browse our code examples, or reach out to our support team.
            </motion.p>
            <motion.div
              variants={fadeInUpVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-6 py-3 bg-beige text-black font-semibold rounded-lg hover:bg-beige/90 transition-colors">
                API Reference
              </button>
              <button className="px-6 py-3 border border-beige text-beige font-semibold rounded-lg hover:bg-beige/10 transition-colors">
                Contact Support
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Empty section to maintain structure */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto px-8 w-full"></div>
      </section>

      {/* Need More Help? */}
      <section className="bg-charcoal py-24 px-8">
        <div className="max-w-4xl mx-auto px-8 w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainerVariants}
            viewport={{ once: true }}
            className="text-center flex flex-col justify-center items-center"
          >
            <motion.h2
              variants={fadeInUpVariants}
              className="text-3xl font-bold leading-9 mb-8"
            >
              Need More Help?
            </motion.h2>
            <div className="flex gap-6 text-center justify-end items-center">
              <motion.div
                variants={fadeInUpVariants}
                className="bg-black rounded-xl p-6 ml-6"
              >
                <h3 className="font-bold mb-3">Schedule a Call</h3>
                <p className="text-gray-400 text-sm leading-5 mb-4">
                  Book a consultation with our experts
                </p>
                <button
                  onClick={() => {
                    const url = (import.meta as any).env?.VITE_CALENDLY_URL as
                      | string
                      | undefined;
                    if (url) {
                      setCalendlyOpen(true);
                    }
                  }}
                  className="inline-block text-beige hover:text-beige/80 transition-colors"
                >
                  Book Now →
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
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

export default Documentation;
