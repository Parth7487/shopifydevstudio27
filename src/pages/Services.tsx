import { motion } from "framer-motion";
import {
  Palette,
  Zap,
  Brain,
  Shield,
  TrendingUp,
  Smartphone,
} from "lucide-react";
import ElegantNavigation from "../components/sections/ElegantNavigation";
import Footer from "../components/sections/Footer";
import DesignPlayground from "../components/sections/DesignPlayground";
import { useState } from "react";
import CalendlyModal from "../components/sections/CalendlyModal";

const Services = () => {
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const services = [
    {
      icon: Palette,
      title: "Custom Theme Design",
      features: [
        "Brand-specific design language",
        "Custom UI/UX components",
        "Mobile-first responsive design",
        "Brand consistency across pages",
      ],
    },
    {
      icon: TrendingUp,
      title: "Conversion Optimization",
      features: [
        "A/B testing implementation",
        "Checkout flow optimization",
        "User journey optimization",
        "Psychological trigger integration",
      ],
    },
    {
      icon: Zap,
      title: "Performance Enhancement",
      features: [
        "Speed optimization (0.5-1s load times)",
        "Image and asset compression",
        "Code minification and bundling",
        "CDN integration and caching",
      ],
    },
    {
      icon: Brain,
      title: "Psychology Integration",
      features: [
        "Color psychology application",
        "Social proof integration",
        "Urgency and scarcity tactics",
        "Trust signal placement",
      ],
    },
    {
      icon: Smartphone,
      title: "Mobile-First Development",
      features: [
        "Progressive Web App features",
        "Touch-optimized interactions",
        "Mobile payment integration",
        "Progressive Web App features",
      ],
    },
    {
      icon: Shield,
      title: "Ongoing Support",
      features: [
        "Zero data loss guarantee",
        "SEO preservation",
        "URL structure maintenance",
        "Post-migration optimization",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const serviceVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <ElegantNavigation />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 mobile-safe-padding text-center pb-3.5">
        <div className="max-w-4xl mx-auto w-full">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="responsive-text-4xl font-bold tracking-tight leading-tight mb-4 sm:mb-6"
          >
            <span>Transform Your </span>
            <span className="text-beige">Shopify Store</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="text-gray-400 responsive-text-base leading-relaxed mb-6 sm:mb-8"
          >
            Your online store is your digital storefront. Make it impossible for
            customers to ignore with our comprehensive Shopify customization
            services.
          </motion.p>
        </div>
      </section>

      {/* Services Introduction Section */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            variants={titleVariants}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight leading-tight mb-6"
          >
            Complete Shopify Solutions
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            variants={titleVariants}
            viewport={{ once: true }}
            className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto"
          >
            From design to development, optimization to ongoing support - we
            handle every aspect of your Shopify store to ensure it outperforms
            the competition.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 sm:py-16 relative pb-7.5">
        {/* Design Playground Background */}
        <DesignPlayground />

        <div className="max-w-7xl mx-auto mobile-safe-padding relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  variants={serviceVariants}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.3 },
                  }}
                  className="bg-gradient-to-br from-graphite/50 to-charcoal/30 border border-beige/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:border-beige/20 transition-all duration-300"
                >
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-beige/20 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-beige" />
                    </div>
                    <h3 className="responsive-text-base font-bold">
                      {service.title}
                    </h3>
                  </div>

                  <ul className="space-y-2 sm:space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-2 sm:gap-3"
                      >
                        <div className="w-1.5 h-1.5 bg-beige rounded-full flex-shrink-0 mt-1.5 sm:mt-2" />
                        <span className="text-gray-300 text-xs sm:text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Complete Liquid Design Solutions Section */}
      <section className="bg-charcoal py-24 px-8 relative">
        {/* Design Playground Background */}
        <DesignPlayground />

        <div className="max-w-4xl mx-auto px-8 w-full text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={containerVariants}
            viewport={{ once: true }}
          >
            <motion.h2
              variants={titleVariants}
              className="text-4xl font-bold tracking-tight leading-tight mb-8"
            >
              Complete Liquid Design Solutions
            </motion.h2>

            <motion.div
              variants={itemVariants}
              className="bg-beige/10 border border-beige/20 rounded-2xl p-8 mb-8"
            >
              <h3 className="text-beige text-2xl font-bold leading-8 mb-4">
                "You Imagine, We Create"
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                <span>We provide </span>
                <span className="text-beige font-semibold">
                  complete Liquid designs
                </span>
                <span>
                  {" "}
                  that are fully customizable to meet your exact needs. Think of
                  it like investing in premium furniture for a new store - your
                  online presence deserves the same attention and investment.
                </span>
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="text-gray-400 text-lg leading-relaxed space-y-6"
            >
              <p>
                Think of your favorite physical store. The moment you walk in,
                everything from the lighting to the layout influences your mood
                and buying decisions. Your Shopify store works the same way.
              </p>

              <p>
                <span>
                  When customers visit your online store, they judge your
                  business within{" "}
                </span>
                <span className="text-beige font-semibold">0.05 seconds</span>
                <span>
                  . The colors, animations, and overall design either build
                  trust or send them to your competitors.
                </span>
              </p>

              <p>
                We don't just make stores look pretty - we craft psychological
                experiences that turn browsers into buyers. Every color choice,
                every animation, every layout decision is based on proven
                conversion psychology.
              </p>

              <p className="text-beige text-xl font-semibold leading-7">
                Don't neglect your online presence - it reaches the entire
                world, while your physical store serves just one location.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-gradient-to-r from-beige/10 to-beige/5 py-24 px-8 relative">
        {/* Design Playground Background */}
        <DesignPlayground />

        <div className="max-w-4xl mx-auto px-8 w-full relative z-10">
          <div className="bg-graphite border border-beige/20 rounded-2xl p-8">
            <form>
              <div>
                <label
                  htmlFor="storeUrl"
                  className="block text-sm font-medium leading-5 mb-2"
                >
                  Your Store URL *
                </label>
                <input
                  type="url"
                  id="storeUrl"
                  placeholder="https://yourstore.com"
                  required
                  className="w-full bg-charcoal border border-black rounded-lg px-4 py-3 text-white transition-colors duration-150 focus:border-beige focus:outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-5 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    required
                    className="w-full bg-charcoal border border-black rounded-lg px-4 py-3 text-white transition-colors duration-150 focus:border-beige focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="businessName"
                    className="block text-sm font-medium leading-5 mb-2"
                  >
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    placeholder="Your Business"
                    className="w-full bg-charcoal border border-black rounded-lg px-4 py-3 text-white transition-colors duration-150 focus:border-beige focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="currentChallenges"
                  className="block text-sm font-medium leading-5 mb-2"
                >
                  What challenges are you facing? (Optional)
                </label>
                <textarea
                  id="currentChallenges"
                  rows={4}
                  placeholder="Tell us about your current conversion rate, loading issues, mobile problems, etc."
                  className="w-full bg-charcoal border border-black rounded-lg px-4 py-3 text-white resize-none transition-colors duration-150 focus:border-beige focus:outline-none"
                />
              </div>

              <div className="flex items-start gap-3 mt-6">
                <input
                  type="checkbox"
                  id="consent"
                  required
                  className="w-4 h-4 mt-1 bg-charcoal border-none text-beige rounded focus:ring-beige"
                />
                <label
                  htmlFor="consent"
                  className="text-gray-400 text-sm leading-5"
                >
                  I agree to receive a detailed analysis of my store and
                  follow-up communications about optimization opportunities.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-beige text-black font-medium text-lg leading-7 py-4 px-8 rounded-lg mt-6 hover:bg-beige/90 transition-colors duration-150"
              >
                Get Free Analysis
              </button>
            </form>

            <div className="bg-beige/10 border border-beige/20 rounded-xl p-6 mt-8">
              <h3 className="text-beige font-bold mb-3">What You'll Get:</h3>
              <ul className="text-sm leading-5 space-y-2">
                {[
                  "Performance audit (speed, mobile, SEO)",
                  "Conversion optimization opportunities",
                  "Design and UX improvement suggestions",
                  "Technical issues identification",
                  "Competitive analysis insights",
                  "Priority action plan",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-beige rounded-full flex-shrink-0" />
                    <span className="text-gray-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm leading-5">
              <span className="text-beige font-semibold">Fast Response:</span>{" "}
              We'll analyze your store and send detailed recommendations within
              24 hours. No obligations, just valuable insights to help your
              business grow.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="bg-gradient-to-r from-beige/10 to-clay/10 border border-beige/20 rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Store?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Let's discuss how our proven process can help you create a
              high-converting Shopify store that drives real results for your
              business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => { const url = (import.meta as any).env?.VITE_CALENDLY_URL as string | undefined; if (url) { setCalendlyOpen(true); } else { window.location.hash = "#contact"; } }} className="px-8 py-4 bg-beige text-black font-semibold rounded-lg hover:bg-beige/90 transition-colors duration-200">
                  Start Your Project
                </button>
              <a href="/#work" className="px-8 py-4 border border-beige text-beige font-semibold rounded-lg hover:bg-beige/10 transition-colors duration-200">
                View Our Work
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      <CalendlyModal open={calendlyOpen && Boolean((import.meta as any).env?.VITE_CALENDLY_URL)} onClose={() => setCalendlyOpen(false)} />
    </div>
  );
};

export default Services;
