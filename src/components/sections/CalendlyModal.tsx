import { memo } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CalendlyModal = memo(({ open, onClose }: Props) => {
  const url = import.meta.env.VITE_CALENDLY_URL as string | undefined;
  if (!url) return null;
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="relative w-[95vw] max-w-4xl h-[80vh] bg-black border border-beige/20 rounded-xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white bg-black/60 border border-white/20 rounded px-3 py-1 text-sm"
          aria-label="Close"
        >
          Close
        </button>
        <iframe
          src={url}
          title="Book a call"
          className="w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
});

CalendlyModal.displayName = "CalendlyModal";

export default CalendlyModal;
