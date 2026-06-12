import { memo, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CALENDLY_URL = "https://calendly.com/shopifydevstudioo/30min";

const CalendlyModal = memo(({ open, onClose }: Props) => {
  const url =
    (import.meta.env.VITE_CALENDLY_URL as string | undefined) || CALENDLY_URL;

  useEffect(() => {
    if (open) {
      // Load Calendly external widget script
      const script = document.createElement("script");
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup script on unmount
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-[95vw] max-w-4xl h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden flex flex-col">
        {/* Header bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-black">
          <h3 className="text-base font-bold text-white">Schedule a 30-Min Call</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xs font-semibold px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        {/* Official Calendly Embed Widget */}
        <div className="flex-1 w-full h-full overflow-hidden bg-black">
          <div
            className="calendly-inline-widget w-full h-full"
            data-url={`${url}?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=000000&text_color=ffffff&primary_color=d4af37`}
            style={{ minWidth: "320px", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
});

CalendlyModal.displayName = "CalendlyModal";

export default CalendlyModal;
