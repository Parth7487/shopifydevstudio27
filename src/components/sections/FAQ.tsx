import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How long does a complete transformation take?",
      answer:
        "Most transformations take 2-4 weeks depending on complexity. We start with a strategy session, move through design and development phases, and finish with testing and optimization. Rush projects can be accommodated for an additional fee.",
    },
    {
      question: "What if I already have a Shopify store?",
      answer:
        "Perfect! We specialize in transforming existing stores. We'll analyze your current setup, preserve what's working, and redesign areas that need improvement. All your products, customer data, and order history remain intact throughout the process.",
    },
    {
      question: "Do you guarantee results?",
      answer:
        "Yes, we offer a 30-day satisfaction guarantee. If you're not happy with the results, we'll work with you to make it right or provide a full refund. Our average clients see 25-40% improvement in conversion rates within the first month.",
    },
    {
      question: "How is this different from hiring a freelancer?",
      answer:
        "Unlike freelancers, we're a dedicated team with specialized expertise in Shopify psychology and conversion optimization. You get consistent communication, proven processes, ongoing support, and accountability that individual freelancers often can't provide.",
    },
    {
      question: "What's included in ongoing support?",
      answer:
        "Our support includes monthly performance reviews, bug fixes, security updates, minor design tweaks, speed optimization, and priority email support. We also provide training materials and can handle product launches or seasonal campaigns.",
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="bg-black py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={titleVariants}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
            Questions? <span className="text-beige">Answered.</span>
          </h2>
          <p className="text-gray-300 text-lg leading-7">
            Everything you need to know about transforming your store
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-gray-900/20 border border-gray-700 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-lg font-medium text-white text-left py-6 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
