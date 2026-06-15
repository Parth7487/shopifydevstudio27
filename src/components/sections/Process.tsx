import { motion } from "framer-motion";
import { useScrollReveal, scrollRevealVariants } from "../../hooks/use-scroll-reveal";
import { Search, Paintbrush, Terminal, CheckSquare, Rocket } from "lucide-react";
import RadialOrbitalTimeline from "../ui/radial-orbital-timeline";

const Process = () => {
  const titleRef = useScrollReveal();
  const timelineRef = useScrollReveal();

  const processSteps = [
    {
      id: 1,
      title: "Deep Dive Discovery",
      date: "1-2 weeks",
      content:
        "We analyze your brand, competitors, and target psychology to create a conversion-focused strategy.",
      category: "Phase 1",
      icon: Search,
      relatedIds: [2],
      status: "completed" as const,
      energy: 80,
    },
    {
      id: 2,
      title: "Psychology-First Design",
      date: "2-3 weeks",
      content:
        "Custom designs that leverage color psychology, social proof, and urgency to drive purchases.",
      category: "Phase 2",
      icon: Paintbrush,
      relatedIds: [1, 3],
      status: "completed" as const,
      energy: 90,
    },
    {
      id: 3,
      title: "Performance Development",
      date: "3-4 weeks",
      content:
        "Code optimization, speed enhancement, and mobile-first development for maximum conversions.",
      category: "Phase 3",
      icon: Terminal,
      relatedIds: [2, 4],
      status: "in-progress" as const,
      energy: 95,
    },
    {
      id: 4,
      title: "Conversion Testing",
      date: "1 week",
      content:
        "A/B testing every element to ensure maximum revenue per visitor before launch.",
      category: "Phase 4",
      icon: CheckSquare,
      relatedIds: [3, 5],
      status: "pending" as const,
      energy: 85,
    },
    {
      id: 5,
      title: "Launch & Optimize",
      date: "Ongoing",
      content:
        "Seamless launch with ongoing optimization to continuously improve performance.",
      category: "Phase 5",
      icon: Rocket,
      relatedIds: [4],
      status: "pending" as const,
      energy: 75,
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-8" style={{ background: "linear-gradient(to bottom, var(--theme-bg-subtle), var(--theme-bg))" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={titleRef.ref}
          initial="hidden"
          animate={titleRef.controls}
          variants={scrollRevealVariants}
          className="text-center mb-16"
        >
          <h2 className="text-5xl sm:text-6xl font-bold theme-text mb-6 leading-tight">
            <span>Our Proven </span>
            <span className="text-beige">Process</span>
          </h2>
          <p className="theme-text-sec text-lg sm:text-xl leading-7 max-w-3xl mx-auto">
            Explore our interactive timeline map detailing how we transition from strategic discovery to high-performance launch.
          </p>
        </motion.div>

        <motion.div
          ref={timelineRef.ref}
          initial="hidden"
          animate={timelineRef.controls}
          variants={scrollRevealVariants}
          className="w-full"
        >
          <RadialOrbitalTimeline timelineData={processSteps} />
        </motion.div>
      </div>
    </section>
  );
};

export default Process;
