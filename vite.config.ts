import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["lucide-react"],
          query: ["@tanstack/react-query"],
          motion: ["framer-motion"],
        },
      },
    },
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        passes: 3,
        pure_getters: true,
        drop_console: true,
        drop_debugger: true,
        ecma: 2020,
        module: true,
      },
      format: { comments: false },
    },
    chunkSizeWarningLimit: 900,
    reportCompressedSize: false,
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
  },
  server: {
    host: "::",
    port: 8080,
  },
  esbuild: {
    legalComments: "none",
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "framer-motion"],
  },
});
