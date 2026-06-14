import { memo, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../../hooks/useSettings";

interface Props {
  open: boolean;
  onClose: () => void;
}

const WHATSAPP_NUMBER = "+917487080421";
const TELEGRAM_HANDLE = "prime2357";
const EMAIL = "shopifydevstudioo@gmail.com";
const CALENDLY_URL = "https://calendly.com/shopifydevstudioo/30min";

const PROJECT_TYPES = [
  "Custom Shopify Theme",
  "Shopify Store Setup",
  "Performance Optimization",
  "App Integration",
  "Migration to Shopify",
  "Ongoing Maintenance",
  "Other",
];

const BookingModal = memo(({ open, onClose }: Props) => {
  const { settings } = useSettings();
  const whatsapp = settings.socials.whatsapp || WHATSAPP_NUMBER;
  const telegram = settings.socials.telegram || TELEGRAM_HANDLE;
  const email = settings.footer.email || EMAIL;

  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const nameRef = useRef<HTMLInputElement>(null);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (open && mounted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, mounted]);

  // Focus first field when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => nameRef.current?.focus(), 300);
      setStatus("idle");
      setForm({ name: "", email: "", projectType: "", budget: "", message: "" });
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "Consultation Popup Form",
        }),
      });
      if (res.ok) {
        setStatus("sent");
      } else {
        // Fallback: open Calendly in new tab
        window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
        setStatus("sent");
      }
    } catch {
      // Fallback: open Calendly in new tab
      window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
      setStatus("sent");
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="booking-overlay"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          style={{ background: "rgba(10,10,10,0.95)" }}
        >
          <motion.div
            key="booking-card"
            className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl flex flex-col lg:flex-row"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: "linear-gradient(135deg, var(--theme-card) 0%, var(--theme-card-alt) 100%)",
              border: "1px solid var(--theme-border)",
              boxShadow: "0 0 80px var(--theme-shadow), 0 40px 100px rgba(0,0,0,0.15)",
            }}
          >
            {/* Gold gradient top border */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, #d4af37, #f5e16a, #d4af37, transparent)" }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
              style={{ background: "var(--theme-bg-subtle)", border: "1px solid var(--theme-border)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.15)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--theme-bg-subtle)"; e.currentTarget.style.borderColor = "var(--theme-border)"; }}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="var(--theme-text)" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>

            {/* ─── LEFT PANEL ─── */}
            <div
              className="lg:w-2/5 p-8 lg:p-10 flex flex-col justify-between shrink-0"
              style={{ background: "linear-gradient(160deg, rgba(212,175,55,0.06) 0%, transparent 60%)", borderRight: "1px solid var(--theme-border)" }}
            >
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)" }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                  <span className="text-[#d4af37] text-xs font-semibold tracking-widest uppercase">Free Consultation</span>
                </div>

                <h2 className="text-2xl lg:text-3xl font-bold theme-text mb-3 leading-tight">
                  Start the{" "}
                  <span style={{ background: "linear-gradient(135deg, #d4af37, #f5e16a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Conversation
                  </span>
                </h2>
                <p className="text-sm theme-text-sec leading-relaxed mb-8">
                  Tell us about your project and we'll schedule a 30-min call to discuss how we can bring your Shopify vision to life.
                </p>

                {/* What to expect */}
                <div className="space-y-3 mb-8">
                  {[
                    { icon: "⚡", text: "Response within 2 hours" },
                    { icon: "🎯", text: "Tailored strategy for your store" },
                    { icon: "💎", text: "No commitment required" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-sm theme-text">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px mb-6" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.3), transparent)" }} />

                {/* Direct contact */}
                <p className="text-xs theme-text-muted uppercase tracking-widest mb-3">Or reach us directly</p>
                <div className="space-y-2">
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm theme-text-sec hover:text-beige transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all" style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)" }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="#25D166"><path d="M19.077 4.928A9.873 9.873 0 0 0 12.04 2c-5.46 0-9.905 4.444-9.905 9.907 0 1.745.456 3.45 1.32 4.96L2 22l5.253-1.378a9.851 9.851 0 0 0 4.782 1.229h.004c5.46 0 9.905-4.443 9.908-9.907a9.873 9.873 0 0 0 -2.87-7.016ZM12.04 20.108a8.093 8.093 0 0 1 -4.129-1.124l-.296-.176-3.071.805.819-2.994-.193-.307a8.077 8.077 0 0 1 -1.238-4.205c0-4.464 3.633-8.097 8.1-8.097a8.037 8.037 0 0 1 5.725 2.373 8.038 8.038 0 0 1 2.372 5.728c-.004 4.466-3.637 8.098-8.102 8.098Zm4.44-6.075c-.244-.122-1.44-.71-1.662-.792-.224-.08-.387-.121-.55.123-.163.243-.63.792-.772.955-.143.162-.285.183-.529.06-.244-.12-1.03-.38-1.962-1.21-.725-.647-1.215-1.448-1.357-1.693-.143-.243-.015-.375.107-.496.11-.11.244-.284.366-.426.122-.142.163-.243.244-.406.082-.162.041-.304-.02-.426-.062-.122-.55-1.32-.753-1.81-.197-.477-.393-.41-.53-.41h-.453c-.163 0-.427.061-.65.305-.224.244-.854.834-.854 2.031s.874 2.35 1.0 2.512c.121.163 1.72 2.624 4.167 3.68.583.25 1.037.4 1.392.513.585.186 1.117.16 1.538.097.469-.07 1.44-.588 1.642-1.155.204-.568.204-1.055.143-1.155-.06-.1-.223-.162-.467-.284Z"/></svg>
                    </div>
                    <span>WhatsApp us</span>
                  </a>
                  <a
                    href={`https://t.me/${telegram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm theme-text-sec hover:text-beige transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(36,161,222,0.1)", border: "1px solid rgba(36,161,222,0.2)" }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="#24A1DE"><path d="M9.7 14.6 9.5 18c.4 0 .6-.2.8-.4l2-1.9 4.1 3c.8.4 1.3.2 1.5-.7L21.6 5c.2-.9-.4-1.3-1.2-1L3.3 10.2c-.8.3-.8.8-.1 1l4.3 1.3 10-6.3-7.8 8.4Z"/></svg>
                    </div>
                    <span>Telegram</span>
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 text-sm theme-text-sec hover:text-beige transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#d4af37" strokeWidth="1.8">
                        <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>
                      </svg>
                    </div>
                    <span className="truncate">Email us</span>
                  </a>
                </div>
              </div>

              {/* Book on Calendly link */}
              <div className="mt-6 pt-6 border-t theme-border">
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold text-center transition-all duration-200 border border-[#d4af37]/30 hover:border-[#d4af37]/60 text-[#d4af37] bg-[#d4af37]/5 hover:bg-[#d4af37]/10 hover:-translate-y-0.5 shadow-md shadow-[#d4af37]/5"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  Or book directly on Calendly →
                </a>
              </div>
            </div>

            {/* ─── RIGHT PANEL: FORM ─── */}
            <div className="flex-1 p-8 lg:p-10 overflow-y-auto">
              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.div
                    key="success"
                    className="flex flex-col items-center justify-center h-full text-center py-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                      style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))", border: "2px solid rgba(212,175,55,0.4)" }}
                    >
                      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold theme-text mb-3">Message Received! 🎉</h3>
                    <p className="theme-text-sec text-sm leading-relaxed max-w-xs">
                      We'll review your project details and reach out within 2 hours to schedule your free consultation.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-8 px-6 py-2.5 rounded-xl text-sm font-semibold text-black transition-all duration-200"
                      style={{ background: "linear-gradient(135deg, #d4af37, #f5e16a)" }}
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div>
                      <p className="theme-text font-semibold text-lg mb-1">Tell us about your project</p>
                      <p className="theme-text-muted text-xs">All fields help us prepare a better proposal for you.</p>
                    </div>

                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium theme-text-sec mb-1.5">Your Name *</label>
                        <input
                          ref={nameRef}
                          type="text"
                          required
                          placeholder="John Smith"
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl text-sm theme-text placeholder-[var(--theme-text-muted)] outline-none transition-all duration-200"
                          style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)" }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)"; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--theme-border)"; }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium theme-text-sec mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="john@brand.com"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl text-sm theme-text placeholder-[var(--theme-text-muted)] outline-none transition-all duration-200"
                          style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)" }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)"; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--theme-border)"; }}
                        />
                      </div>
                    </div>

                    {/* Project type */}
                    <div>
                      <label className="block text-xs font-medium theme-text-sec mb-1.5">Project Type</label>
                      <select
                        value={form.projectType}
                        onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm theme-text outline-none transition-all duration-200 appearance-none cursor-pointer"
                        style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--theme-border)"; }}
                      >
                        <option value="" className="theme-card">Select project type…</option>
                        {PROJECT_TYPES.map((t) => (
                          <option key={t} value={t} className="theme-card">{t}</option>
                        ))}
                      </select>
                    </div>


                    {/* Message */}
                    <div>
                      <label className="block text-xs font-medium theme-text-sec mb-1.5">About Your Project</label>
                      <textarea
                        rows={3}
                        placeholder="Tell us what you're building — your current challenges, goals, or anything that helps us understand your vision…"
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm theme-text placeholder-[var(--theme-text-muted)] outline-none resize-none transition-all duration-200"
                        style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--theme-border)"; }}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full py-4 rounded-xl text-sm font-bold text-black transition-all duration-300 relative overflow-hidden group"
                      style={{ background: "linear-gradient(135deg, #d4af37 0%, #f5e16a 50%, #d4af37 100%)", backgroundSize: "200% 100%" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundPosition = "100% 0"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(212,175,55,0.4)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundPosition = "0% 0"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      {status === "sending" ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.3)" strokeWidth="3"/>
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="black" strokeWidth="3" strokeLinecap="round"/>
                          </svg>
                          Sending…
                        </span>
                      ) : (
                        "Send Message & Book a Call →"
                      )}
                    </button>

                    <p className="text-center text-xs theme-text-muted">
                      No spam, ever. We respond within 2 hours during business hours.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
});

BookingModal.displayName = "BookingModal";

export default BookingModal;
