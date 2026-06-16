import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSettings } from "../../hooks/useSettings";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const logoText = settings.footer.logo_text || "Shopifydevstudio";
  const logoInitial = logoText.trim().charAt(0);

  return (
    <footer className="theme-card border-t theme-border py-12 sm:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-hidden">
        {/* Logo and Description */}
        <motion.div
          className="mb-12 pb-8 border-b theme-border"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-4">
            <div className="flex items-center space-x-3">
              {settings.footer.logo_type === "image" && settings.footer.logo_image ? (
                <>
                  <img
                    src={settings.footer.logo_image}
                    alt={logoText}
                    width="40"
                    height="40"
                    className="h-10 w-10 object-contain"
                  />
                  {settings.footer.logo_text_with_image && (
                    <span className="theme-text font-semibold text-lg">
                      {logoText}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-beige rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-bold text-lg">{logoInitial}</span>
                  </div>
                  <span className="theme-text font-semibold text-lg">
                    {logoText}
                  </span>
                </>
              )}
            </div>

            <div className="bg-gradient-to-r from-beige/15 to-clay/15 border border-beige/30 rounded-lg p-4 w-full sm:w-fit">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-beige text-lg">🔥</span>
                <span className="text-beige text-xs font-bold uppercase tracking-wider">
                  Urgent Project?
                </span>
              </div>
              <p className="theme-text-sec text-xs leading-relaxed">
                2 emergency spaces available for quick turnaround
              </p>
            </div>
          </div>
          
          <p className="theme-text-sec font-light text-sm leading-relaxed max-w-2xl">
            Premium Shopify theme development agency creating exceptional
            e-commerce experiences that drive results and exceed expectations.
          </p>
        </motion.div>

        {/* Structured Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          {/* Resources Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="theme-text font-bold text-xs uppercase tracking-widest border-b theme-border pb-2">
              Resources
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => navigate("/documentation")}
                  className="theme-text-muted hover:text-beige transition-all duration-200 text-sm cursor-pointer font-medium block w-full text-left py-3 hover:pl-1"
                >
                  Documentation
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/support")}
                  className="theme-text-muted hover:text-beige transition-all duration-200 text-sm cursor-pointer font-medium block w-full text-left py-3 hover:pl-1"
                >
                  Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/resources")}
                  className="theme-text-muted hover:text-beige transition-all duration-200 text-sm cursor-pointer font-medium block w-full text-left py-3 hover:pl-1"
                >
                  Resources Hub
                </button>
              </li>
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="theme-text font-bold text-xs uppercase tracking-widest border-b theme-border pb-2">
              Get in Touch
            </h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="mailto:consult@shopifydevstudio.tech"
                  className="theme-text-muted hover:text-beige transition-all duration-200 text-sm block py-3 hover:pl-1 font-medium"
                >
                  consult@shopifydevstudio.tech
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.footer.email}`}
                  className="theme-text-muted hover:text-beige transition-all duration-200 text-sm block py-3 hover:pl-1 font-medium"
                >
                  {settings.footer.email}
                </a>
              </li>
              <li className="theme-text-muted text-sm py-3 font-medium">
                Remote, Worldwide
              </li>
              <li className="theme-text-muted text-sm py-3 font-medium">
                24h Response Time
              </li>
            </ul>
          </motion.div>

          {/* Quick Connect Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="theme-text font-bold text-xs uppercase tracking-widest border-b theme-border pb-2">
              Quick Connect
            </h3>
            <ul className="space-y-3 pt-2">
              <li>
                <a
                  href="https://wa.me/917487080421?text=Hello%20Shopify%20Dev%20Studio%20%E2%80%93%20I%20would%20like%20to%20connect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-beige/15 hover:border-beige/45 theme-text hover:text-beige transition-all bg-black/25 font-semibold text-sm"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                    className="text-beige/80 flex-shrink-0"
                  >
                    <path d="M19.077 4.928A9.873 9.873 0 0 0 12.04 2c-5.46 0-9.905 4.444-9.905 9.907 0 1.745.456 3.45 1.32 4.96L2 22l5.253-1.378a9.851 9.851 0 0 0 4.782 1.229h.004c5.46 0 9.905-4.443 9.908-9.907a9.873 9.873 0 0 0 -2.87-7.016ZM12.04 20.108a8.093 8.093 0 0 1 -4.129-1.124l-.296-.176-3.071.805.819-2.994-.193-.307a8.077 8.077 0 0 1 -1.238-4.205c0-4.464 3.633-8.097 8.1-8.097a8.037 8.037 0 0 1 5.725 2.373 8.038 8.038 0 0 1 2.372 5.728c-.004 4.466-3.637 8.098-8.102 8.098Zm4.44-6.075c-.244-.122-1.44-.71-1.662-.792-.224-.08-.387-.121-.55.123-.163.243-.63.792-.772.955-.143.162-.285.183-.529.06-.244-.12-1.03-.38-1.962-1.21-.725-.647-1.215-1.448-1.357-1.693-.143-.243-.015-.375.107-.496.11-.11.244-.284.366-.426.122-.142.163-.243.244-.406.082-.162.041-.304-.02-.426-.062-.122-.55-1.32-.753-1.81-.197-.477-.393-.41-.53-.41h-.453c-.163 0-.427.061-.65.305-.224.244-.854.834-.854 2.031s.874 2.35 1.0 2.512c.121.163 1.72 2.624 4.167 3.68.583.25 1.037.4 1.392.513.585.186 1.117.16 1.538.097.469-.07 1.44-.588 1.642-1.155.204-.568.204-1.055.143-1.155-.06-.1-.223-.162-.467-.284Z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/prime2357"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-beige/15 hover:border-beige/45 theme-text hover:text-beige transition-all bg-black/25 font-semibold text-sm"
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
                  <span>Telegram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/GcfkVXsn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-beige/15 hover:border-beige/45 theme-text hover:text-beige transition-all bg-black/25 font-semibold text-sm"
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
                  <span>Discord</span>
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Massive Typography Logo */}
        <div
          className="w-full border-t theme-border pt-10 mt-12 mb-6 overflow-hidden"
          style={{ maxWidth: "100%" }}
        >
          <motion.h2
            className="font-serif italic font-semibold leading-none tracking-tighter text-beige/20 dark:text-white/15 text-center block w-full"
            style={{
              fontSize: "clamp(1.5rem, 5.5vw, 6rem)",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "clip",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.25 }}
            whileHover={{ opacity: 0.75 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Shopifydevstudio
          </motion.h2>
        </div>

        {/* Shopify Partner Badge */}
        <motion.div
          className="pt-6 mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center gap-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F1673ec9568f943219a669aac87827a9f%2Fc80e013180444130bfd67d372b56eb41?format=webp&width=800"
              alt="Official Shopify Partner"
              width="150"
              height="64"
              className="h-16 w-auto object-contain"
            />
            <p className="theme-text-sec text-xs sm:text-sm font-medium">
              Official Shopify Partner
            </p>
          </div>
        </motion.div>

        {/* Bottom section */}
        <motion.div
          className="text-center border-t theme-border pt-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          viewport={{ once: true }}
        >
          <p className="theme-text-muted text-xs sm:text-sm font-medium">
            {settings.footer.copyright}
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
