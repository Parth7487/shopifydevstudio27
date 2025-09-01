import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  useScrollReveal,
  scrollRevealVariants,
  staggerContainerVariants,
  fadeInUpVariants,
} from "../../hooks/use-scroll-reveal";

const Process = () => {
  const titleRef = useScrollReveal();
  const stepsRef = useScrollReveal();
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const processSteps = [
    {
      number: "01",
      title: "Deep Dive Discovery",
      description:
        "We analyze your brand, competitors, and target psychology to create a conversion-focused strategy.",
      timeline: "1-2 weeks",
    },
    {
      number: "02",
      title: "Psychology-First Design",
      description:
        "Custom designs that leverage color psychology, social proof, and urgency to drive purchases.",
      timeline: "2-3 weeks",
    },
    {
      number: "03",
      title: "Performance Development",
      description:
        "Code optimization, speed enhancement, and mobile-first development for maximum conversions.",
      timeline: "3-4 weeks",
    },
    {
      number: "04",
      title: "Conversion Testing",
      description:
        "A/B testing every element to ensure maximum revenue per visitor before launch.",
      timeline: "1 week",
    },
    {
      number: "05",
      title: "Launch & Optimize",
      description:
        "Seamless launch with ongoing optimization to continuously improve performance.",
      timeline: "Ongoing",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const stepVariants = {
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
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
    <section className="bg-gradient-to-b from-charcoal/30 to-black py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={titleRef.ref}
          initial="hidden"
          animate={titleRef.controls}
          variants={scrollRevealVariants}
          className="text-center mb-16"
        >
          <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
            <span>Our Proven </span>
            <span className="text-beige">Process</span>
          </h2>
          <p className="text-gray-400 text-xl leading-7 max-w-3xl mx-auto">
            From strategy to launch, every step is designed for maximum impact
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-beige via-beige/50 to-beige transform -translate-x-1/2 hidden md:block" />

          <motion.div
            ref={stepsRef.ref}
            initial="hidden"
            animate={stepsRef.controls}
            variants={staggerContainerVariants}
          >
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUpVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`flex items-center gap-16 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                } ${index > 0 ? "mt-16" : ""}`}
              >
                {/* Content Card */}
                <div className="flex-1">
                  <motion.div
                    variants={cardVariants}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.3 },
                    }}
                    className="backdrop-blur-sm bg-gradient-to-br from-graphite/50 to-charcoal/30 border border-beige/10 rounded-2xl p-8 shadow-xl"
                  >
                    <div className="flex items-center mb-4">
                      <span
                        className="block text-beige text-3xl font-bold leading-9 mr-4"
                        style={{
                          textShadow: `0 0 ${10 + index * 2}px rgba(230, 177, 126, ${0.5 + index * 0.1})`,
                        }}
                      >
                        {step.number}
                      </span>
                      <h3 className="text-white text-2xl font-bold leading-8">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <div className="flex items-center">
                      <span className="text-beige text-sm font-medium">
                        <span>Timeline: </span>
                        <span>{step.timeline}</span>
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Timeline Dot */}
                <div className="relative hidden md:block">
                  <motion.div
                    variants={cardVariants}
                    className="w-4 h-4 bg-beige border-3 border-black rounded-full"
                    style={{
                      boxShadow: `0 0 ${15 + index * 3}px rgba(230, 177, 126, ${0.4 + index * 0.1})`,
                    }}
                  />
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Process;
