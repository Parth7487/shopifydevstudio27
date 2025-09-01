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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              <div className="min-w-0">
                <ul className="space-y-2 mb-3">
                  <li>
                    <a
                      href="mailto:contact@shopifydevstudio.tech"
                      className="text-gray-400 hover:text-beige transition-colors duration-200 text-sm sm:text-base break-words"
                    >
                      contact@shopifydevstudio.tech
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:consult@shopifydevstudio.tech"
                      className="text-gray-400 hover:text-beige transition-colors duration-200 text-sm sm:text-base break-words"
                    >
                      consult@shopifydevstudio.tech
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:shopifydevstudioo@gmail.com"
                      className="text-gray-400 hover:text-beige transition-colors duration-200 text-sm sm:text-base break-words"
                    >
                      shopifydevstudioo@gmail.com
                    </a>
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
              </div>

              <div className="min-w-0">
                <ul className="space-y-2 mb-3 break-words">
                  <li>
                    <a
                      href="https://wa.me/917487080421?text=Hello%20Shopify%20Dev%20Studio%20%E2%80%93%20I%20would%20like%20to%20connect"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-beige transition-colors duration-200 text-sm inline-flex items-center gap-2 break-words"
                      aria-label="Chat on WhatsApp"
                    >
                      WhatsApp — Quick Connect
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://t.me/prime2357"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-beige transition-colors duration-200 text-sm inline-flex items-center gap-2 break-words"
                      aria-label="Chat on Telegram"
                    >
                      Telegram — Quick Connect
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://discord.gg/GcfkVXsn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-beige transition-colors duration-200 text-sm inline-flex items-center gap-2 break-words"
                      aria-label="Join our Discord"
                    >
                      Discord — Join Our Server
                    </a>
                  </li>
                  <li className="text-gray-400 text-sm">Remote, Worldwide</li>
                  <li className="text-gray-400 text-sm">24h Response Time</li>
                  <li className="text-gray-400 text-sm">Available 7 days/week</li>
                </ul>
              </div>
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
