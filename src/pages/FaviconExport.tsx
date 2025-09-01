import { useCallback } from "react";

const sizes = [512, 192, 64];

function drawSvgToCanvas(svgText: string, size: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas 2D not available"));
      // High quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function FaviconExport() {
  const exportAll = useCallback(async (type: "image/png" | "image/jpeg") => {
    const svgResp = await fetch("/favicon.svg");
    const svgText = await svgResp.text();
    for (const size of sizes) {
      const canvas = await drawSvgToCanvas(svgText, size);
      const link = document.createElement("a");
      link.download = `favicon-${size}.${type === "image/png" ? "png" : "jpg"}`;
      link.href = canvas.toDataURL(type, type === "image/jpeg" ? 0.96 : undefined);
      link.click();
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-zinc-900/70 border border-white/10 rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">Favicon Export</h1>
        <p className="text-gray-300 mb-6">Download the site icon in multiple formats and sizes for best quality.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={() => exportAll("image/png")} className="px-4 py-3 rounded-lg bg-beige text-black font-semibold hover:opacity-90">Download PNG (512/192/64)</button>
          <button onClick={() => exportAll("image/jpeg")} className="px-4 py-3 rounded-lg border border-beige text-beige font-semibold hover:bg-beige/10">Download JPEG (512/192/64)</button>
        </div>
        <div className="mt-6 text-sm text-gray-400">
          SVG source is already served at <code className="text-gray-200">/favicon.svg</code>.
        </div>
      </div>
    </div>
  );
}
