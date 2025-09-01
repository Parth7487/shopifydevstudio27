import { motion } from "framer-motion";
import {
  Search,
  Palette,
  Code,
  TestTube,
  Rocket,
  BarChart3,
} from "lucide-react";
import ElegantNavigation from "../components/sections/ElegantNavigation";
import Footer from "../components/sections/Footer";
import { useState } from "react";
import CalendlyModal from "../components/sections/CalendlyModal";

const Process = () => {
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const processPhases = [
    {
      phase: "Phase 1",
      title: "Deep Dive Discovery",
      timeline: "1-2 weeks",
      description:
        "We don't just design - we investigate. Understanding your brand, customers, and competition is crucial for creating a store that converts.",
      icon: Search,
      activities: [
        "Brand personality analysis",
        "Target customer psychology mapping",
        "Competitor design audit",
        "Current store performance analysis",
        "User journey mapping",
      ],
      deliverables: [
        "Brand strategy document",
        "Customer persona profiles",
        "Competitive analysis report",
        "Design requirements specification",
      ],
    },
    {
      phase: "Phase 2",
      title: "Psychology-First Design",
      timeline: "2-3 weeks",
      description:
        "Every color, every button, every layout decision is made based on conversion psychology. We design experiences that guide customers naturally toward purchase.",
      icon: Palette,
      activities: [
        "Color psychology application",
        "Trust signal placement strategy",
        "Call-to-action optimization",
        "Mobile-first responsive design",
        "Micro-interaction planning",
      ],
      deliverables: [
        "High-fidelity mockups",
        "Interactive prototypes",
        "Style guide and design system",
        "Animation specifications",
      ],
    },
    {
      phase: "Phase 3",
      title: "Performance Development",
      timeline: "3-4 weeks",
      description:
        "Clean, optimized code that loads lightning-fast. We build for performance, SEO, and scalability from day one.",
      icon: Code,
      activities: [
        "Custom theme development",
        "Speed optimization implementation",
        "SEO structure setup",
        "Cross-browser testing",
        "Mobile optimization",
      ],
      deliverables: [
        "Custom Shopify theme",
        "Performance optimization report",
        "SEO audit and fixes",
        "Cross-device compatibility testing",
      ],
    },
    {
      phase: "Phase 4",
      title: "Conversion Testing",
      timeline: "1-2 weeks",
      description:
        "We don't guess -  every critical element to ensure maximum revenue per visitor before launch.",
      icon: TestTube,
      activities: [
        "A/B testing setup",
        "Conversion funnel analysis",
        "Heat mapping and user recording",
        "Checkout flow optimization",
        "Performance benchmarking",
      ],
      deliverables: [
        "A/B testing results",
        "Conversion optimization report",
        "User behavior analysis",
        "Pre-launch performance metrics",
      ],
    },
    {
      phase: "Phase 5",
      title: "Strategic Launch",
      timeline: "1 week",
      description:
        "A carefully orchestrated launch that minimizes downtime and maximizes impact. We monitor everything to ensure a smooth transition.",
      icon: Rocket,
      activities: [
        "Staging environment setup",
        "Data migration and verification",
        "Launch timing coordination",
        "Real-time monitoring",
        "Immediate optimization",
      ],
      deliverables: [
        "Live, optimized store",
        "Launch performance report",
        "Post-launch monitoring setup",
        "Knowledge transfer session",
      ],
    },
    {
      phase: "Phase 6",
      title: "Continuous Optimization",
      timeline: "Ongoing",
      description: "",
      icon: BarChart3,
      activities: [
        "Monthly performance reviews",
        "Ongoing A/B testing",
        "User feedback analysis",
        "Seasonal optimization",
        "Technology updates",
      ],
      deliverables: [
        "Monthly optimization reports",
        "Performance improvement tracking",
        "Ongoing support and updates",
        "Strategic recommendations",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const phaseVariants = {
    hidden: { opacity: 0, y: 50 },
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
            <span>Our Proven </span>
            <span className="text-beige">Process</span>
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className="text-gray-400 text-xl leading-relaxed mb-8"
          >
            From strategy to launch to ongoing optimization - every step is
            designed for maximum impact. See exactly how we transform your
            Shopify store into a conversion machine.
          </motion.p>
        </div>
      </section>

      {/* Detailed Process Section */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto px-8 w-full">
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div
              className="absolute left-8 top-0 w-px h-full min-h-full bg-beige opacity-80"
              style={{
                background:
                  "linear-gradient(to bottom, rgb(230, 177, 126), rgba(230, 177, 126, 0.5), rgb(230, 177, 126))",
                minHeight: "100%",
                zIndex: 1,
              }}
            />

            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {processPhases.map((phase, index) => {
                const IconComponent = phase.icon;
                return (
                  <motion.div
                    key={index}
                    variants={phaseVariants}
                    className={`relative ${index > 0 ? "mt-16" : ""}`}
                  >
                    {/* Timeline Dot */}
                    <div
                      className="absolute left-6 w-4 h-4 bg-beige rounded-full"
                      style={{
                        boxShadow: `0 0 ${15 + index * 3}px rgba(230, 177, 126, ${0.4 + index * 0.1})`,
                      }}
                    />

                    {/* Content Card */}
                    <div className="ml-20 bg-graphite border border-charcoal rounded-2xl p-8 transition-all duration-300">
                      <div className="grid md:grid-cols-3 gap-8">
                        {/* Phase Header */}
                        <div className="md:col-span-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 bg-beige/20 rounded-lg">
                              <IconComponent className="w-6 h-6 text-beige" />
                            </div>
                            <div>
                              <div className="text-beige text-sm font-medium leading-5">
                                {phase.phase}
                              </div>
                              <h3 className="text-xl font-bold leading-7">
                                {phase.title}
                              </h3>
                            </div>
                          </div>
                          <div className="text-beige font-medium mb-4">
                            {phase.timeline}
                          </div>
                          <p className="text-gray-400 leading-relaxed">
                            {phase.description}
                          </p>
                        </div>

                        {/* Activities and Deliverables */}
                        <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                          {/* Key Activities */}
                          <div>
                            <h4 className="font-semibold mb-3">
                              Key Activities
                            </h4>
                            <ul>
                              {phase.activities.map((activity, actIndex) => (
                                <li
                                  key={actIndex}
                                  className="flex items-start gap-3 mb-2"
                                >
                                  <div className="w-1.5 h-1.5 bg-beige rounded-full flex-shrink-0 mt-2" />
                                  <span className="text-gray-400 text-sm leading-5">
                                    {activity}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Deliverables */}
                          <div>
                            <h4 className="font-semibold mb-3">Deliverables</h4>
                            <ul>
                              {phase.deliverables.map(
                                (deliverable, delIndex) => (
                                  <li
                                    key={delIndex}
                                    className="flex items-start gap-3 mb-2"
                                  >
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0 mt-2" />
                                    <span className="text-gray-400 text-sm leading-5">
                                      {deliverable}
                                    </span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Our Process Works Section */}
      <section className="bg-charcoal py-24 px-8">
        <div className="max-w-4xl mx-auto px-8 w-full">
          <div className="text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={titleVariants}
              viewport={{ once: true }}
              className="bg-beige/10 border border-beige/20 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold leading-8 mb-4">
                Ready to Start Your Transformation?
              </h3>
              <p className="text-gray-400 mb-6">
                Our process has helped many stores increase their conversion
                rates by an average of 340%. Let's discuss how we can transform
                your Shopify store.
              </p>
              <button onClick={() => { const url = (import.meta as any).env?.VITE_CALENDLY_URL as string | undefined; if (url) { setCalendlyOpen(true); } else { window.location.hash = "#contact"; } }} className="inline-block bg-beige rounded-lg text-black text-lg font-medium leading-7 py-3 px-8 hover:bg-beige/90 transition-colors duration-200">
                Schedule Your Discovery Call
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      <CalendlyModal open={calendlyOpen && Boolean((import.meta as any).env?.VITE_CALENDLY_URL)} onClose={() => setCalendlyOpen(false)} />
    </div>
  );
};

export default Process;
