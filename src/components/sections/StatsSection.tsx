import { motion } from "framer-motion";

const StatsSection = () => {
  const stats = [
    { value: "98%", label: "Client Satisfaction" },
    { value: "24h", label: "Response Time" }
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

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
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
    <section className="bg-black py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={textVariants}
          className="mb-12"
        >
          <p className="text-white text-lg md:text-xl leading-relaxed mb-4">
            Stop losing customers to poorly designed stores.{" "}
            <span className="text-beige font-semibold">87% of shoppers</span>{" "}
            judge credibility by design alone. We craft{" "}
            <span className="text-beige font-semibold">psychology-driven</span>{" "}
            Shopify experiences that convert browsers into buyers.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
              <div className="text-left">
                <span className="text-white font-medium text-base">
                  {stat.value} {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
