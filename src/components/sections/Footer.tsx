import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-charcoal border-t border-beige/20 py-4 sm:py-6">
      <div className="max-w-7xl mx-auto mobile-safe-padding px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-start">
          {/* Logo and description */}
          <motion.div
            className="sm:col-span-2 lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-beige rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xs sm:text-sm">
                  S
                </span>
              </div>
              <span className="text-gray-100 font-medium responsive-text-base">
                Shopify Dev Studio
              </span>
            </div>
            <p className="text-gray-400 font-light max-w-md text-sm leading-relaxed">
              Premium Shopify theme development agency creating exceptional
              e-commerce experiences that drive results and exceed expectations.
            </p>
          </motion.div>


          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
            className="pb-1"
          >
            <h3 className="text-white font-semibold mb-3 text-sm">
              Resources
            </h3>
            <ul className="space-y-2">
              <li
                onClick={() => navigate("/documentation")}
                className="text-gray-400 hover:text-beige transition-colors duration-150 cursor-pointer"
              >
                Documentation
              </li>
              <li
                onClick={() => navigate("/support")}
                className="text-gray-400 hover:text-beige transition-colors duration-150 cursor-pointer mt-2"
              >
                Support
              </li>
              <li
                onClick={() => navigate("/faq")}
                className="text-gray-400 hover:text-beige transition-colors duration-150 cursor-pointer mt-2"
              >
                FAQ
              </li>
            </ul>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white font-semibold mb-3 text-sm">
              Get in Touch
            </h4>
            <ul className="space-y-2 mb-3">
              <li>
                <a
                  href="mailto:contact@shopifydevstudio.tech"
                  className="text-gray-400 hover:text-beige transition-colors duration-200 text-sm sm:text-base"
                >
                  contact@shopifydevstudio.tech
                </a>
              </li>
              <li>
                <a
                  href="mailto:consult@shopifydevstudio.tech"
                  className="text-gray-400 hover:text-beige transition-colors duration-200 text-sm sm:text-base"
                >
                  consult@shopifydevstudio.tech
                </a>
              </li>
              <li>
                <a
                  href="mailto:shopifydevstudioo@gmail.com"
                  className="text-gray-400 hover:text-beige transition-colors duration-200 text-sm sm:text-base"
                >
                  shopifydevstudioo@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/917487080421?text=Hello%20Shopify%20Dev%20Studio%20%E2%80%93%20I%20would%20like%20to%20connect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-beige transition-colors duration-200 text-sm sm:text-base inline-flex items-center gap-2"
                  aria-label="Chat on WhatsApp"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor" className="text-beige/80"><path d="M17.5 6.5A7.5 7.5 0 0 0 6.2 17.2L5 21l3.9-1.1A7.5 7.5 0 1 0 17.5 6.5Zm-5.9 2.7c.2-.5.3-.5.6-.5h.5c.2 0 .4 0 .6.4.2.4.8 1.4.9 1.5.1.2.1.3 0 .5-.1.2-.2.3-.4.6-.2.2-.4.4-.2.7.2.2.8 1.4 1.9 2 .9.6 1.1.5 1.4.4.3-.1.7-.6.9-.8.2-.2.4-.2.6-.1.2.1 1.4.7 1.6.8.2.1.4.2.4.4 0 .2.1 1.1-.5 1.7-.5.6-1.1.7-1.6.7-.4 0-1 0-2-.4-1.1-.4-2-.9-2.8-1.7-.7-.7-1.3-1.5-1.9-2.5-.6-1-.9-1.8-1-2.1-.1-.3 0-.8.3-1.1.2-.3.6-.8.8-1.1Z"/></svg>
                  WhatsApp — Quick Connect
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/prime2357"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-beige transition-colors duration-200 text-sm sm:text-base inline-flex items-center gap-2"
                  aria-label="Chat on Telegram"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor" className="text-beige/80"><path d="M9.7 14.6 9.5 18c.4 0 .6-.2.8-.4l2-1.9 4.1 3c.8.4 1.3.2 1.5-.7L21.6 5c.2-.9-.4-1.3-1.2-1L3.3 10.2c-.8.3-.8.8-.1 1l4.3 1.3 10-6.3-7.8 8.4Z"/></svg>
                  Telegram — Quick Connect
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/GcfkVXsn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-beige transition-colors duration-200 text-sm sm:text-base inline-flex items-center gap-2"
                  aria-label="Join our Discord"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor" className="text-beige/80"><path d="M20 5.3c-1-.5-2.1-.8-3.3-1 0 0-.2.4-.3.5 1 .3 2 .8 2.8 1.5-1-.5-2.2-.9-3.5-1.1-.8-.2-1.6-.3-2.4-.3s-1.6.1-2.4.3C9.7 5 8.5 5.4 7.5 6c.8-.7 1.8-1.2 2.8-1.5-.1-.1-.3-.5-.3-.5-1.2.2-2.3.5-3.3 1C5.3 7 4.7 9 4.7 11.1c0 0 1 1.7 3.7 1.8 0 0 .4-.6.7-1.1-1.4-.4-1.9-1.2-1.9-1.2s.1.1.4.2c0 0 0 0 0 0 .1 0 .2.1.3.1.8.3 1.6.5 2.3.6.6.1 1.2.1 1.8.1s1.2 0 1.8-.1c.8-.1 1.5-.3 2.3-.6.1 0 .2-.1.3-.1 0 0 0 0 0 0 .2-.1.3-.1.4-.2 0 0-.5.8-1.9 1.2.3.5.7 1.1.7 1.1 2.7-.1 3.7-1.8 3.7-1.8 0-2.1-.6-4.1-1.9-5.8Z"/></svg>
                  Discord — Join Our Server
                </a>
              </li>
              <li className="text-gray-400 text-sm sm:text-base">
                Remote, Worldwide
              </li>
              <li className="text-gray-400 text-sm sm:text-base">
                24h Response Time
              </li>
              <li className="text-gray-400 text-sm sm:text-base">
                Available 7 days/week
              </li>
            </ul>

            {/* Urgent Project Box */}
            <div className="bg-gradient-to-r from-beige/20 to-clay/20 border border-beige/30 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-beige text-base sm:text-lg">🔥</span>
                <span className="text-beige text-xs sm:text-sm font-semibold">
                  Urgent Project?
                </span>
              </div>
              <p className="text-gray-300 text-xs leading-4">
                2 emergency spaces available
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div
          className="border-t border-beige/20 mt-2 sm:mt-4 pt-3 sm:pt-4 flex flex-col sm:flex-row justify-between items-center gap-2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
            © {currentYear} Shopify Dev Studio. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
