import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const isMobile = window.innerWidth < 768;
      element.scrollIntoView({ behavior: isMobile ? "auto" : "smooth" });
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <footer className="bg-charcoal border-t border-beige/20 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Logo and Description */}
        <motion.div
          className="mb-8 pb-8 border-b border-beige/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-beige rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold text-lg">S</span>
            </div>
            <span className="text-gray-100 font-semibold text-lg">
              shopifydevstudio
            </span>
          </div>
          <p className="text-gray-400 font-light text-sm leading-relaxed max-w-2xl">
            Premium Shopify theme development agency creating exceptional
            e-commerce experiences that drive results and exceed expectations.
          </p>
          <div className="bg-gradient-to-r from-beige/20 to-clay/20 border border-beige/30 rounded-lg p-4 mt-5 w-full sm:w-fit">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-beige text-xl">🔥</span>
              <span className="text-beige text-sm font-semibold">
                Urgent Project?
              </span>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              2 emergency spaces available for quick turnaround projects
            </p>
          </div>
        </motion.div>

        {/* Mobile Expandable Sections */}
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-8 mb-8">
          {/* Resources Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {isMobile ? (
              <button
                onClick={() => toggleSection("resources")}
                className="w-full flex justify-between items-center py-3 px-4 bg-charcoal/50 hover:bg-charcoal/70 rounded-lg transition-colors mb-2"
              >
                <h3 className="text-white font-semibold text-base">
                  Resources
                </h3>
                <span
                  className={`transform transition-transform ${
                    expandedSection === "resources" ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
            ) : (
              <h3 className="text-white font-semibold mb-4 text-base">
                Resources
              </h3>
            )}
            {!isMobile || expandedSection === "resources" ? (
              <ul className="space-y-2.5 md:space-y-2">
                <li>
                  <button
                    onClick={() => navigate("/documentation")}
                    className="text-gray-400 hover:text-beige transition-colors duration-150 text-sm cursor-pointer font-medium block w-full text-left py-1.5 px-4 md:px-0 hover:bg-beige/5 md:hover:bg-transparent rounded md:rounded-none"
                  >
                    Documentation
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/support")}
                    className="text-gray-400 hover:text-beige transition-colors duration-150 text-sm cursor-pointer font-medium block w-full text-left py-1.5 px-4 md:px-0 hover:bg-beige/5 md:hover:bg-transparent rounded md:rounded-none"
                  >
                    Support
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/faq")}
                    className="text-gray-400 hover:text-beige transition-colors duration-150 text-sm cursor-pointer font-medium block w-full text-left py-1.5 px-4 md:px-0 hover:bg-beige/5 md:hover:bg-transparent rounded md:rounded-none"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            ) : null}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
          >
            {isMobile ? (
              <button
                onClick={() => toggleSection("contact")}
                className="w-full flex justify-between items-center py-3 px-4 bg-charcoal/50 hover:bg-charcoal/70 rounded-lg transition-colors mb-2"
              >
                <h3 className="text-white font-semibold text-base">
                  Get in Touch
                </h3>
                <span
                  className={`transform transition-transform ${
                    expandedSection === "contact" ? "rotate-180" : ""
                  }`}
                >
                  ���
                </span>
              </button>
            ) : (
              <h3 className="text-white font-semibold mb-4 text-base">
                Get in Touch
              </h3>
            )}
            {!isMobile || expandedSection === "contact" ? (
              <ul className="space-y-2.5 md:space-y-2">
                <li>
                  <a
                    href="mailto:consult@shopifydevstudio.tech"
                    className="text-gray-400 hover:text-beige transition-colors duration-150 text-sm block py-1.5 px-4 md:px-0 hover:bg-beige/5 md:hover:bg-transparent rounded md:rounded-none font-medium"
                  >
                    consult@shopifydevstudio.tech
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:shopifydevstudioo@gmail.com"
                    className="text-gray-400 hover:text-beige transition-colors duration-150 text-sm block py-1.5 px-4 md:px-0 hover:bg-beige/5 md:hover:bg-transparent rounded md:rounded-none font-medium"
                  >
                    shopifydevstudioo@gmail.com
                  </a>
                </li>
                <li className="text-gray-400 text-sm py-1.5 px-4 md:px-0">
                  Remote, Worldwide
                </li>
                <li className="text-gray-400 text-sm py-1.5 px-4 md:px-0">
                  24h Response Time
                </li>
              </ul>
            ) : null}
          </motion.div>

          {/* Quick Connect Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {isMobile ? (
              <button
                onClick={() => toggleSection("connect")}
                className="w-full flex justify-between items-center py-3 px-4 bg-charcoal/50 hover:bg-charcoal/70 rounded-lg transition-colors mb-2"
              >
                <h3 className="text-white font-semibold text-base">
                  Quick Connect
                </h3>
                <span
                  className={`transform transition-transform ${
                    expandedSection === "connect" ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
            ) : (
              <h3 className="text-white font-semibold mb-4 text-base">
                Quick Connect
              </h3>
            )}
            {!isMobile || expandedSection === "connect" ? (
              <ul className="space-y-2.5 md:space-y-3">
                <li>
                  <a
                    href="https://wa.me/917487080421?text=Hello%20Shopify%20Dev%20Studio%20%E2%80%93%20I%20would%20like%20to%20connect"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-beige transition-colors duration-150 text-sm inline-flex items-center gap-3 py-2 px-4 md:px-0 hover:bg-beige/5 md:hover:bg-transparent rounded md:rounded-none font-medium"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="text-beige/80 flex-shrink-0"
                    >
                      <path d="M17.5 6.5A7.5 7.5 0 0 0 6.2 17.2L5 21l3.9-1.1A7.5 7.5 0 1 0 17.5 6.5Zm-5.9 2.7c.2-.5.3-.5.6-.5h.5c.2 0 .4 0 .6.4.2.4.8 1.4.9 1.5.1.2.1.3 0 .5-.1.2-.2.3-.4.6-.2.2-.4.4-.2.7.2.2.8 1.4 1.9 2 .9.6 1.1.5 1.4.4.3-.1.7-.6.9-.8.2-.2.4-.2.6-.1.2.1 1.4.7 1.6.8.2.1.4.2.4.4 0 .2.1 1.1-.5 1.7-.5.6-1.1.7-1.6.7-.4 0-1 0-2-.4-1.1-.4-2-.9-2.8-1.7-.7-.7-1.3-1.5-1.9-2.5-.6-1-.9-1.8-1-2.1-.1-.3 0-.8.3-1.1.2-.3.6-.8.8-1.1Z" />
                    </svg>
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/prime2357"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-beige transition-colors duration-150 text-sm inline-flex items-center gap-3 py-2 px-4 md:px-0 hover:bg-beige/5 md:hover:bg-transparent rounded md:rounded-none font-medium"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="text-beige/80 flex-shrink-0"
                    >
                      <path d="M9.7 14.6 9.5 18c.4 0 .6-.2.8-.4l2-1.9 4.1 3c.8.4 1.3.2 1.5-.7L21.6 5c.2-.9-.4-1.3-1.2-1L3.3 10.2c-.8.3-.8.8-.1 1l4.3 1.3 10-6.3-7.8 8.4Z" />
                    </svg>
                    Telegram
                  </a>
                </li>
                <li>
                  <a
                    href="https://discord.gg/GcfkVXsn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-beige transition-colors duration-150 text-sm inline-flex items-center gap-3 py-2 px-4 md:px-0 hover:bg-beige/5 md:hover:bg-transparent rounded md:rounded-none font-medium"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="text-beige/80 flex-shrink-0"
                    >
                      <path d="M20 5.3c-1-.5-2.1-.8-3.3-1 0 0-.2.4-.3.5 1 .3 2 .8 2.8 1.5-1-.5-2.2-.9-3.5-1.1-.8-.2-1.6-.3-2.4-.3s-1.6.1-2.4.3C9.7 5 8.5 5.4 7.5 6c.8-.7 1.8-1.2 2.8-1.5-.1-.1-.3-.5-.3-.5-1.2.2-2.3.5-3.3 1C5.3 7 4.7 9 4.7 11.1c0 0 1 1.7 3.7 1.8 0 0 .4-.6.7-1.1-1.4-.4-1.9-1.2-1.9-1.2s.1.1.4.2c0 0 0 0 0 0 .1 0 .2.1.3.1.8.3 1.6.5 2.3.6.6.1 1.2.1 1.8.1s1.2 0 1.8-.1c.8-.1 1.5-.3 2.3-.6.1 0 .2-.1.3-.1 0 0 0 0 0 0 .2-.1.3-.1.4-.2 0 0-.5.8-1.9 1.2.3.5.7 1.1.7 1.1 2.7-.1 3.7-1.8 3.7-1.8 0-2.1-.6-4.1-1.9-5.8Z" />
                    </svg>
                    Discord
                  </a>
                </li>
                <li className="text-gray-400 text-sm py-1.5 px-4 md:px-0">
                  Available 7 days/week
                </li>
              </ul>
            ) : null}
          </motion.div>
        </div>

        {/* Shopify Partner Badge */}
        <motion.div
          className="border-t border-beige/10 pt-8 mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center gap-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F1673ec9568f943219a669aac87827a9f%2Fc80e013180444130bfd67d372b56eb41?format=webp&width=800"
              alt="Official Shopify Partner"
              className="h-16 w-auto object-contain"
            />
            <p className="text-gray-300 text-xs sm:text-sm font-medium">
              Official Shopify Partner
            </p>
          </div>
        </motion.div>

        {/* Bottom section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-xs sm:text-sm">
            © {currentYear} shopifydevstudio. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
