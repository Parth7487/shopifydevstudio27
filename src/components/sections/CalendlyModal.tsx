import { memo, useState, useEffect, useRef } from "react";
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

  const [form, setForm] = useState({
    name: "",
    email: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const nameRef = useRef<HTMLInputElement>(null);

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
      const res = await fetch("https://formspree.io/f/shopifydevstudio", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, _subject: `New Booking Request from ${form.name}` }),
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

  return (
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
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
        >
          <motion.div
            key="booking-card"
            className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl flex flex-col lg:flex-row"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: "linear-gradient(135deg, #0d0d0d 0%, #111111 100%)",
              border: "1px solid rgba(212,175,55,0.25)",
              boxShadow: "0 0 80px rgba(212,175,55,0.08), 0 40px 100px rgba(0,0,0,0.8)",
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
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,175,55,0.15)"; e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>

            {/* ─── LEFT PANEL ─── */}
            <div
              className="lg:w-2/5 p-8 lg:p-10 flex flex-col justify-between shrink-0"
              style={{ background: "linear-gradient(160deg, rgba(212,175,55,0.06) 0%, rgba(0,0,0,0) 60%)", borderRight: "1px solid rgba(212,175,55,0.1)" }}
            >
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)" }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
                  <span className="text-[#d4af37] text-xs font-semibold tracking-widest uppercase">Free Consultation</span>
                </div>

                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
                  Start the{" "}
                  <span style={{ background: "linear-gradient(135deg, #d4af37, #f5e16a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Conversation
                  </span>
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-8">
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
                      <span className="text-sm text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px mb-6" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.3), transparent)" }} />

                {/* Direct contact */}
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Or reach us directly</p>
                <div className="space-y-2">
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all" style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)" }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="#25D166"><path d="M17.5 6.5A7.5 7.5 0 0 0 6.2 17.2L5 21l3.9-1.1A7.5 7.5 0 1 0 17.5 6.5Z"/></svg>
                    </div>
                    <span>WhatsApp us</span>
                  </a>
                  <a
                    href={`https://t.me/${telegram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(36,161,222,0.1)", border: "1px solid rgba(36,161,222,0.2)" }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="#24A1DE"><path d="M9.7 14.6 9.5 18c.4 0 .6-.2.8-.4l2-1.9 4.1 3c.8.4 1.3.2 1.5-.7L21.6 5c.2-.9-.4-1.3-1.2-1L3.3 10.2c-.8.3-.8.8-.1 1l4.3 1.3 10-6.3-7.8 8.4Z"/></svg>
                    </div>
                    <span>Telegram</span>
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors group"
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
              <div className="mt-6 pt-6 border-t border-white/5">
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-[#d4af37] transition-colors flex items-center gap-1.5"
                >
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
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
                    <h3 className="text-2xl font-bold text-white mb-3">Message Received! 🎉</h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
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
                      <p className="text-white font-semibold text-lg mb-1">Tell us about your project</p>
                      <p className="text-gray-500 text-xs">All fields help us prepare a better proposal for you.</p>
                    </div>

                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Your Name *</label>
                        <input
                          ref={nameRef}
                          type="text"
                          required
                          placeholder="John Smith"
                          value={form.name}
                          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)"; e.currentTarget.style.background = "rgba(212,175,55,0.04)"; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="john@brand.com"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)"; e.currentTarget.style.background = "rgba(212,175,55,0.04)"; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                        />
                      </div>
                    </div>

                    {/* Project type */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Project Type</label>
                      <select
                        value={form.projectType}
                        onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200 appearance-none cursor-pointer"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                      >
                        <option value="" style={{ background: "#111" }}>Select project type…</option>
                        {PROJECT_TYPES.map((t) => (
                          <option key={t} value={t} style={{ background: "#111" }}>{t}</option>
                        ))}
                      </select>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Estimated Budget</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["< $2,000", "$2k – $10k", "$10k+"].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, budget: b }))}
                            className="py-2.5 rounded-xl text-xs font-medium transition-all duration-200"
                            style={{
                              background: form.budget === b ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.04)",
                              border: form.budget === b ? "1px solid rgba(212,175,55,0.5)" : "1px solid rgba(255,255,255,0.08)",
                              color: form.budget === b ? "#d4af37" : "rgba(255,255,255,0.5)",
                            }}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">About Your Project</label>
                      <textarea
                        rows={3}
                        placeholder="Tell us what you're building — your current challenges, goals, or anything that helps us understand your vision…"
                        value={form.message}
                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none resize-none transition-all duration-200"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)"; e.currentTarget.style.background = "rgba(212,175,55,0.04)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
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

                    <p className="text-center text-xs text-gray-600">
                      No spam, ever. We respond within 2 hours during business hours.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

BookingModal.displayName = "BookingModal";

export default BookingModal;
