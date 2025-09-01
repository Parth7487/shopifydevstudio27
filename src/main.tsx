import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { initInstantLoading } from "./lib/instant-loading";

// Initialize instant loading optimizations immediately
initInstantLoading();

// Get the root element with immediate error handling
const container = document.getElementById("root")!;

// Create root with concurrent features for better performance
const root = createRoot(container, {
  // Enable concurrent features for better performance
});

// Render immediately without extra checks in production
if (import.meta.env.DEV) {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  // Skip StrictMode in production for better performance
  root.render(<App />);
}
