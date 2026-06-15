import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Clock, Store, ShieldCheck, Users, LifeBuoy } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "How long does a complete transformation take?",
    answer:
      "Most transformations take 2-4 weeks depending on complexity. We start with a strategy session, move through design and development phases, and finish with testing and optimization. Rush projects can be accommodated for an additional fee.",
    icon: Clock,
  },
  {
    question: "What if I already have a Shopify store?",
    answer:
      "Perfect! We specialize in transforming existing stores. We'll analyze your current setup, preserve what's working, and redesign areas that need improvement. All your products, customer data, and order history remain intact throughout the process.",
    icon: Store,
  },
  {
    question: "Do you guarantee results?",
    answer:
      "Yes, we offer a 30-day satisfaction guarantee. If you're not happy with the results, we'll work with you to make it right or provide a full refund. Our average clients see 25-40% improvement in conversion rates within the first month.",
    icon: ShieldCheck,
  },
  {
    question: "How is this different from hiring a freelancer?",
    answer:
      "Unlike freelancers, we're a dedicated team with specialized expertise in Shopify psychology and conversion optimization. You get consistent communication, proven processes, ongoing support, and accountability that individual freelancers often can't provide.",
    icon: Users,
  },
  {
    question: "What's included in ongoing support?",
    answer:
      "Our support includes monthly performance reviews, bug fixes, security updates, minor design tweaks, speed optimization, and priority email support. We also provide training materials and can handle product launches or seasonal campaigns.",
    icon: LifeBuoy,
  },
];

const FAQ = () => {
  useEffect(() => {
    const schemaMarkup = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };

    let script = document.querySelector("script[data-faq-schema]");
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-faq-schema", "true");
      script.textContent = JSON.stringify(schemaMarkup);
      document.head.appendChild(script);
    }
  }, []);

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
    <section className="py-20 px-4" style={{ backgroundColor: "var(--theme-bg)" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={titleVariants}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold theme-text mb-6 tracking-tight">
            Questions? <span className="text-beige">Answered.</span>
          </h2>
          <p className="theme-text-sec text-lg leading-7">
            Everything you need to know about transforming your store
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((faq, index) => {
              const Icon = faq.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="group theme-card border theme-border rounded-lg overflow-hidden transition-all duration-300"
                  >
                    <AccordionTrigger
                      className="flex items-center justify-between w-full px-6 py-5 bg-transparent text-left group-data-[state=open]:bg-black/[0.02] dark:group-data-[state=open]:bg-white/[0.02] transition-colors [&>svg]:hidden hover:no-underline"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Icon className="w-5 h-5 transition-colors duration-300 theme-text-muted group-data-[state=open]:text-beige" />
                        <span className="text-base font-semibold theme-text transition-colors duration-300">
                          {faq.question}
                        </span>
                      </div>
                      <span className="text-xs font-semibold tracking-wider theme-text-muted group-data-[state=open]:text-beige">
                        {`FAQ-${index + 1}`}
                      </span>
                    </AccordionTrigger>

                    <AccordionContent className="relative px-6 py-5 text-sm leading-relaxed theme-text-sec border-t theme-border before:absolute before:top-0 before:left-0 before:w-[3px] before:h-full before:bg-beige before:opacity-0 group-data-[state=open]:before:opacity-100 transition-all duration-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
