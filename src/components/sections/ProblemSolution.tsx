import { motion } from "framer-motion";

const ProblemSolution = () => {
  const problems = [
    "Generic themes that look like everyone else's store",
    "Slow loading speeds that kill 40% of potential sales",
    "Poor mobile experience losing 60% of traffic",
    "No psychological triggers to drive purchase decisions",
  ];

  const solutions = [
    "Custom designs that reflect your unique brand story",
    "Lightning-fast performance optimized for conversions",
    "Mobile-first design that captures every customer",
    "Psychology-based UX that converts visitors into buyers",
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
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative py-24 px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={titleVariants}
          className="text-center mb-16"
        >
          <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
            The $10,000 Question
          </h2>
          <p className="text-gray-400 text-xl leading-7 max-w-3xl mx-auto">
            Why do some Shopify stores make millions while others struggle to
            make their first sale?
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* The Painful Truth */}
          <motion.div variants={itemVariants}>
            <motion.div
              variants={cardVariants}
              className="bg-slate-800/40 border border-slate-600/50 rounded-xl p-6"
            >
              <h3 className="text-slate-300 text-2xl font-bold leading-8 mb-4">
                The Painful Truth
              </h3>
              <ul className="text-gray-400">
                {problems.map((problem, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-start mt-3 first:mt-0"
                  >
                    <span className="block text-slate-400 mt-1 text-lg">✗</span>
                    <span className="block ml-3 leading-relaxed">
                      {problem}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* The Transformation */}
          <motion.div variants={itemVariants}>
            <motion.div
              variants={cardVariants}
              className="bg-slate-800/40 border border-beige/30 rounded-xl p-6"
            >
              <h3 className="text-beige text-2xl font-bold leading-8 mb-4">
                The Transformation
              </h3>
              <ul className="text-gray-400">
                {solutions.map((solution, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-start mt-3 first:mt-0"
                  >
                    <span className="block text-beige mt-1 text-lg">✓</span>
                    <span className="block ml-3 leading-relaxed">
                      {solution}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default ProblemSolution;
