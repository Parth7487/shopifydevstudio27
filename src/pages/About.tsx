import { motion } from "framer-motion";
import { useState } from "react";
import CalendlyModal from "../components/sections/CalendlyModal";
import { Award, Users, Target, Heart, Calendar } from "lucide-react";
import ElegantNavigation from "../components/sections/ElegantNavigation";
import Footer from "../components/sections/Footer";

const About = () => {
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const stats = [
    { value: "98%", label: "Client Satisfaction" },
    { value: "24h", label: "Average Response Time" },
  ];

  const values = [
    {
      icon: Target,
      title: "Results-Driven",
      description:
        "Every decision we make is backed by data and focused on improving your conversion rates and revenue.",
    },
    {
      icon: Users,
      title: "Client-Focused",
      description:
        "Your success is our success. We work as an extension of your team to achieve your business goals.",
    },
    {
      icon: Award,
      title: "Quality Obsessed",
      description:
        "We never compromise on quality. Every detail is crafted with precision and attention to excellence.",
    },
    {
      icon: Heart,
      title: "Passion-Driven",
      description:
        "We're passionate about e-commerce and love helping businesses reach their full potential online.",
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

  const itemVariants = {
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <ElegantNavigation />

      {/* Header Section */}
      <section className="py-24 px-8 text-center">
        <div className="max-w-4xl mx-auto px-8 w-full">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="text-6xl font-bold tracking-tight leading-tight mb-6"
          >
            <span>We Believe Your Store Should Be </span>
            <span className="text-beige">Unforgettable</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="text-gray-400 text-xl leading-relaxed mb-8"
          >
            Just like walking into an incredible physical store leaves a lasting
            impression, your Shopify store should make customers stop, stare,
            and most importantly - buy.
          </motion.p>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="bg-charcoal py-24 px-8">
        <div className="max-w-6xl mx-auto px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={itemVariants}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold tracking-tight leading-tight mb-6">
                Our Story Started with Frustration
              </h2>
              <div className="text-gray-400 leading-relaxed space-y-6">
                <p>
                  Three years ago, our founder was running his own e-commerce
                  business. Despite having great products, the generic Shopify
                  theme was killing conversions. Customers would land on the
                  site and leave within seconds.
                </p>
                <p>
                  After spending months learning design and development, We
                  transformed his store. The results were incredible -{" "}
                  <span className="text-beige font-semibold">
                    conversion rates increased by 400%
                  </span>{" "}
                  and revenue tripled within six months.
                </p>
                <p>
                  Friends started asking for help. Word spread. Soon, Everyone
                  was transforming stores full-time. That's how Shopify Dev
                  Studio was born - from the frustration of seeing amazing
                  businesses held back by poor design.
                </p>
                <p>
                  Today, we've helped many stores break through their design
                  barriers and achieve the success they deserve. Because we
                  believe every business owner should experience the joy of
                  watching their conversion rates soar.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={itemVariants}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-beige/20 to-beige/5 border border-beige/20 rounded-2xl p-8">
                <div className="bg-graphite rounded-xl p-6">
                  <h3 className="text-beige text-xl font-bold leading-7 mb-4">
                    The Moment Everything Changed
                  </h3>
                  <div className="text-sm leading-5 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Before redesign:</span>
                      <span className="text-red-400">1.2% conversion rate</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">After redesign:</span>
                      <span className="text-green-400">
                        6.1% conversion rate
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Animated decoration elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-beige/30 rounded-full animate-pulse"></div>
              <div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-beige/20 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="py-24 px-8">
        <div className="max-w-4xl mx-auto px-8 w-full">
          <div className="text-center">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              variants={titleVariants}
              viewport={{ once: true }}
              className="text-4xl font-bold tracking-tight leading-tight mb-8"
            >
              Security & Compliance
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-graphite border border-charcoal rounded-xl p-6">
                <div className="flex items-center justify-center bg-green-500/20 rounded-lg w-12 h-12 mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-bold mb-3">GDPR Compliant</h3>
                <p className="text-gray-400 text-sm leading-5">
                  All our stores meet international privacy and data protection
                  standards.
                </p>
              </div>
              <div className="bg-graphite border border-charcoal rounded-xl p-6">
                <div className="flex items-center justify-center bg-blue-500/20 rounded-lg w-12 h-12 mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-bold mb-3">PCI Compliant</h3>
                <p className="text-gray-400 text-sm leading-5">
                  Secure payment processing that meets industry standards for
                  safety.
                </p>
              </div>
              <div className="bg-graphite border border-charcoal rounded-xl p-6">
                <div className="flex items-center justify-center bg-purple-500/20 rounded-lg w-12 h-12 mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-bold mb-3">SSL Secure</h3>
                <p className="text-gray-400 text-sm leading-5">
                  Enterprise-grade SSL certificates for maximum security and
                  trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Assurance Section */}
      <section className="bg-charcoal py-24 px-8">
        <div className="max-w-6xl mx-auto px-8 w-full">
          <div className="text-center mb-16">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              variants={titleVariants}
              viewport={{ once: true }}
              className="text-4xl font-bold tracking-tight leading-tight mb-6"
            >
              Quality Assurance
            </motion.h2>
            <motion.p
              initial="hidden"
              whileInView="visible"
              variants={titleVariants}
              viewport={{ once: true }}
              className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto"
            >
              Every project follows our rigorous quality standards to ensure
              exceptional results.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center bg-beige rounded-full w-6 h-6 flex-shrink-0 mt-1">
                  <div className="bg-black rounded-full w-2 h-2"></div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Code Review Process</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Every line of code is reviewed by senior developers before
                    deployment.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 mt-6">
                <div className="flex items-center justify-center bg-beige rounded-full w-6 h-6 flex-shrink-0 mt-1">
                  <div className="bg-black rounded-full w-2 h-2"></div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Performance Testing</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Comprehensive testing across devices and browsers to ensure
                    optimal performance.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 mt-6">
                <div className="flex items-center justify-center bg-beige rounded-full w-6 h-6 flex-shrink-0 mt-1">
                  <div className="bg-black rounded-full w-2 h-2"></div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Security Audits</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Regular security assessments to protect your store and
                    customer data.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 mt-6">
                <div className="flex items-center justify-center bg-beige rounded-full w-6 h-6 flex-shrink-0 mt-1">
                  <div className="bg-black rounded-full w-2 h-2"></div>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Accessibility Compliance</h3>
                  <p className="text-gray-400 leading-relaxed">
                    WCAG 2.1 AA compliance ensuring your store is accessible to
                    all users.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-black border border-graphite rounded-2xl p-8">
              <h3 className="text-beige text-2xl font-bold leading-8 mb-4">
                Our Promise
              </h3>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Code Quality Score:</span>
                  <span className="text-green-400 font-bold">A+</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-400">Performance Grade:</span>
                  <span className="text-green-400 font-bold">95+</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-400">Security Rating:</span>
                  <span className="text-green-400 font-bold">Excellent</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-400">Client Satisfaction:</span>
                  <span className="text-green-400 font-bold">98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-graphite/50 to-charcoal/30 border border-beige/10 rounded-2xl p-8 text-center"
              >
                <div className="text-4xl font-bold text-beige mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="bg-gradient-to-r from-beige/10 to-clay/10 border border-beige/20 rounded-2xl p-12"
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Work Together?</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              We'd love to learn about your business and explore how we can help
              you achieve your e-commerce goals. Let's start a conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => { const url = (import.meta as any).env?.VITE_CALENDLY_URL as string | undefined; if (url) { setCalendlyOpen(true); } else { window.location.hash = "#contact"; } }} className="px-8 py-4 bg-beige text-black font-semibold rounded-lg hover:bg-beige/90 transition-colors duration-200">
                  Get in Touch
                </button>
              <a href="/process" className="px-8 py-4 border border-beige text-beige font-semibold rounded-lg hover:bg-beige/10 transition-colors duration-200">
                View Our Process
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

export default About;
