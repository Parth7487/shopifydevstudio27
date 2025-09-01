import { motion } from "framer-motion";
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  HelpCircle,
  FileText,
  Video,
  Users,
  Zap,
} from "lucide-react";
import ElegantNavigation from "../components/sections/ElegantNavigation";
import Footer from "../components/sections/Footer";
import {
  fadeInUpVariants,
  staggerContainerVariants,
} from "../hooks/use-scroll-reveal";

const Support = () => {
  const supportOptions = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Detailed help for complex issues",
      availability: "Business Hours",
      responseTime: "< 4 hours",
      action: "Send Email",
    },
    {
      icon: Phone,
      title: "Priority Phone",
      description: "Direct line for urgent matters",
      availability: "Mon-Fri 9AM-6PM EST",
      responseTime: "Immediate",
      action: "Call Now",
    },
  ];

  const quickHelp = [
    {
      icon: FileText,
      title: "Documentation",
    },
    {
      icon: HelpCircle,
      title: "FAQ",
    },
  ];

  const commonIssues = [
    {
      question: "How do I install a custom theme?",
      category: "Installation",
      views: "2.3k views",
    },
    {
      question: "Why is my store loading slowly?",
      category: "Performance",
      views: "1.8k views",
    },
    {
      question: "How to set up payment gateways?",
      category: "Setup",
      views: "1.5k views",
    },
    {
      question: "Custom CSS not working properly",
      category: "Development",
      views: "1.2k views",
    },
    {
      question: "Mobile responsive issues",
      category: "Design",
      views: "950 views",
    },
    {
      question: "SEO optimization best practices",
      category: "Marketing",
      views: "890 views",
    },
  ];

  const serviceStatus = [
    { service: "Shopify Stores", status: "Operational", uptime: "99.9%" },
    { service: "Custom Themes", status: "Operational", uptime: "99.8%" },
    { service: "Support System", status: "Operational", uptime: "99.9%" },
    { service: "API Services", status: "Operational", uptime: "99.7%" },
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
            <span>Get the </span>
            <span className="text-beige">Help You Need</span>
          </motion.h1>
          <motion.p
            variants={fadeInUpVariants}
            className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto"
          >
            Our dedicated support team is here to help you succeed. From quick
            questions to complex technical issues, we've got you covered.
          </motion.p>
        </motion.div>
      </section>

      {/* Common Issues */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
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
              Common Issues & Solutions
            </motion.h2>
            <div className="space-y-4">
              {commonIssues.map((issue, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUpVariants}
                  className="bg-gradient-to-br from-graphite/50 to-charcoal/30 border border-beige/10 rounded-2xl p-6 hover:border-beige/20 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-beige transition-colors">
                        {issue.question}
                      </h3>
                      <div className="flex items-center gap-4">
                        <span className="bg-beige/10 text-beige text-xs px-2 py-1 rounded-full">
                          {issue.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Help Resources */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-charcoal/30">
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
              Self-Help Resources
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {quickHelp.map((resource, index) => {
                const IconComponent = resource.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUpVariants}
                    className="bg-gradient-to-br from-graphite/50 to-charcoal/30 border border-beige/10 rounded-2xl p-6 hover:border-beige/20 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="w-10 h-10 bg-beige/20 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-5 h-5 text-beige" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-beige transition-colors">
                      {resource.title}
                    </h3>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Options */}
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
              Choose Your Support Channel
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {supportOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUpVariants}
                    className={`bg-gradient-to-br from-graphite/50 to-charcoal/30 border rounded-2xl p-8 transition-all duration-300 ${
                      option.primary
                        ? "border-beige/30 hover:border-beige/50"
                        : "border-beige/10 hover:border-beige/20"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${
                        option.primary ? "bg-beige/30" : "bg-beige/20"
                      }`}
                    >
                      <IconComponent className="w-6 h-6 text-beige" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{option.title}</h3>
                    <p className="text-gray-400 mb-6">{option.description}</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-beige" />
                        <span className="text-sm text-gray-300">
                          {option.availability}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-beige" />
                        <span className="text-sm text-gray-300">
                          Response: {option.responseTime}
                        </span>
                      </div>
                    </div>
                    <button
                      className={`w-full py-3 font-semibold rounded-lg transition-colors ${
                        option.primary
                          ? "bg-beige text-black hover:bg-beige/90"
                          : "border border-beige text-beige hover:bg-beige/10"
                      }`}
                    >
                      {option.action}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Status */}
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
              Service Status
            </motion.h2>
            <div className="bg-gradient-to-br from-graphite/50 to-charcoal/30 border border-beige/10 rounded-2xl p-8">
              <div className="grid gap-4">
                {serviceStatus.map((service, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUpVariants}
                    className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="font-medium">{service.service}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-green-400 text-sm">
                        {service.status}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {service.uptime}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Support;
