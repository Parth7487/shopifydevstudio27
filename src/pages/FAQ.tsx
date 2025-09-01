import { motion } from "framer-motion";
import { useState } from "react";
import {
  ChevronDown,
  Search,
  HelpCircle,
  Clock,
  Zap,
  Shield,
  Users,
} from "lucide-react";
import ElegantNavigation from "../components/sections/ElegantNavigation";
import Footer from "../components/sections/Footer";
import {
  fadeInUpVariants,
  staggerContainerVariants,
} from "../hooks/use-scroll-reveal";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const categories = ["All", "General", "Technical", "Billing", "Support"];

  const faqData = [
    {
      id: 1,
      category: "General",
      question: "What services do you offer for Shopify stores?",
      answer:
        "We offer comprehensive Shopify services including custom theme development, conversion optimization, performance enhancement, psychology-based design, mobile-first development, and ongoing support. Our goal is to create high-converting stores that maximize your revenue.",
    },
    {
      id: 2,
      category: "General",
      question: "How long does it take to complete a Shopify project?",
      answer:
        "Project timelines vary based on complexity. A basic theme customization takes 2-3 weeks, while a complete custom development project can take 6-8 weeks. We provide detailed timelines during our initial consultation and keep you updated throughout the process.",
    },
    {
      id: 3,
      category: "Technical",
      question: "Do you provide custom Liquid development?",
      answer:
        "Yes, we specialize in custom Liquid development. Our team creates custom templates, sections, and functionality tailored to your specific needs. We ensure all code is clean, efficient, and follows Shopify best practices.",
    },
    {
      id: 4,
      category: "Technical",
      question: "Can you help with third-party app integrations?",
      answer:
        "Absolutely! We have extensive experience integrating various third-party apps including payment gateways, inventory management systems, email marketing tools, analytics platforms, and more. We ensure seamless integration that doesn't affect your store's performance.",
    },
    {
      id: 5,
      category: "Technical",
      question: "How do you ensure my store loads quickly?",
      answer:
        "We implement multiple optimization techniques including image compression, code minification, lazy loading, CDN integration, and database optimization. We also remove unused code and optimize the critical rendering path to achieve the fastest possible loading times.",
    },
    {
      id: 6,
      category: "Billing",
      question: "What are your pricing models?",
      answer:
        "We offer flexible pricing options including fixed-price projects, hourly rates for smaller tasks, and retainer agreements for ongoing support. Pricing depends on project complexity, timeline, and specific requirements. We provide detailed quotes after understanding your needs.",
    },
    {
      id: 7,
      category: "Billing",
      question: "Do you offer payment plans?",
      answer:
        "Yes, we offer flexible payment plans for larger projects. Typically, we require 50% upfront and 50% upon completion, but we can accommodate custom payment schedules based on your business needs and project timeline.",
    },
    {
      id: 8,
      category: "Support",
      question: "What kind of support do you provide after launch?",
      answer:
        "We provide comprehensive post-launch support including bug fixes, security updates, performance monitoring, and feature enhancements. We offer different support tiers from basic maintenance to full-service ongoing development partnerships.",
    },
    {
      id: 9,
      category: "Support",
      question: "How quickly do you respond to support requests?",
      answer:
        "Our response times vary by support tier: Priority support gets responses within 2 hours, Standard support within 24 hours, and Basic support within 48 hours. Emergency issues are always handled immediately regardless of tier.",
    },
    {
      id: 10,
      category: "General",
      question: "Do you work with existing Shopify stores or only new ones?",
      answer:
        "We work with both new and existing Shopify stores. For existing stores, we conduct a comprehensive audit to identify improvement opportunities and create a customized optimization plan that builds on your current setup.",
    },
    {
      id: 11,
      category: "Technical",
      question: "Can you help with mobile optimization?",
      answer:
        "Yes, mobile optimization is a core part of our service. We ensure your store performs perfectly on all devices with responsive design, touch-optimized interactions, fast loading times, and mobile-specific features like swipe gestures and app-like navigation.",
    },
    {
      id: 12,
      category: "General",
      question: "Do you provide SEO optimization?",
      answer:
        "Yes, we implement comprehensive SEO optimization including meta tags, structured data, site speed optimization, mobile-friendliness, and content optimization. We ensure your store follows SEO best practices to improve search engine visibility.",
    },
  ];

  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const quickStats = [
    { icon: HelpCircle, label: "FAQs Answered", value: "500+" },
    { icon: Clock, label: "Avg Response Time", value: "< 2 hours" },
    { icon: Users, label: "Happy Clients", value: "200+" },
    { icon: Shield, label: "Success Rate", value: "99.5%" },
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
            <span>Frequently Asked </span>
            <span className="text-beige">Questions</span>
          </motion.h1>
          <motion.p
            variants={fadeInUpVariants}
            className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto mb-8"
          >
            Find quick answers to common questions about our Shopify development
            services, processes, and support options.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            variants={fadeInUpVariants}
            className="relative max-w-lg mx-auto"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-charcoal border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:border-beige focus:outline-none"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeCategory === category
                    ? "bg-beige text-black"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainerVariants}
            viewport={{ once: true }}
          >
            {filteredFAQs.length === 0 ? (
              <motion.div
                variants={fadeInUpVariants}
                className="text-center py-12"
              >
                <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No FAQs found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or category filter.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    variants={fadeInUpVariants}
                    className="bg-gradient-to-br from-graphite/50 to-charcoal/30 border border-beige/10 rounded-2xl overflow-hidden hover:border-beige/20 transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-6 text-left flex items-center justify-between"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <span className="bg-beige/10 text-beige text-xs px-2 py-1 rounded-full mt-1">
                          {faq.category}
                        </span>
                        <h3 className="text-lg font-semibold text-white group-hover:text-beige transition-colors">
                          {faq.question}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-beige transition-transform duration-200 ${
                          openFAQ === faq.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6"
                      >
                        <div className="pl-12">
                          <p className="text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-charcoal/30">
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
              Still Need <span className="text-beige">Help?</span>
            </motion.h2>
            <motion.p
              variants={fadeInUpVariants}
              className="text-gray-400 mb-6 max-w-2xl mx-auto"
            >
              Can't find the answer you're looking for? Our support team is
              ready to help with any questions or concerns you might have.
            </motion.p>
            <motion.div
              variants={fadeInUpVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-6 py-3 border border-beige text-beige font-semibold rounded-lg hover:bg-beige/10 transition-colors">
                Contact Us
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
