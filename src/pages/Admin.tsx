import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Database,
  Cloud,
  Settings as SettingsIcon,
} from "lucide-react";
import ElegantNavigation from "../components/sections/ElegantNavigation";
import Footer from "../components/sections/Footer";
import GoogleDriveSync from "../components/GoogleDriveSync";
const Admin = () => {
  const [activeTab, setActiveTab] = useState<"drive" | "database" | "settings">(
    "drive",
  );

  const tabs = [
    { id: "drive", label: "Google Drive Sync", icon: Cloud },
    { id: "database", label: "Database", icon: Database },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ] as const;

  const [neonConnected, setNeonConnected] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("admin_authenticated") === "true";
  });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  React.useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => setNeonConnected(res.ok))
      .catch(() => setNeonConnected(false));
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between">
        <ElegantNavigation />
        <div className="flex-1 flex items-center justify-center px-4 relative py-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-beige/10 rounded-full filter blur-[128px] pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full filter blur-[128px] pointer-events-none"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-black/85 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-2xl relative z-10"
          >
            <h2 className="text-2xl font-bold text-center mb-6">
              Admin <span className="text-beige">Access</span>
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-beige/50 transition-all duration-300"
                />
              </div>
              {passwordError && (
                <p className="text-red-400 text-sm">{passwordError}</p>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-beige hover:bg-beige/95 text-charcoal font-bold rounded-lg transition-all duration-300 shadow-lg"
              >
                Unlock Dashboard
              </button>
            </form>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ElegantNavigation />

      {/* Header */}
      <section className="relative py-20 px-8 bg-black backdrop-blur-sm overflow-hidden border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </button>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Admin <span className="text-beige">Dashboard</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-xl text-gray-400 mb-8 max-w-3xl"
          >
            Manage your portfolio data, sync images from Google Drive, and
            configure settings.
          </motion.p>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-beige text-charcoal shadow-lg"
                    : "bg-black/60 backdrop-blur-md text-gray-400 hover:bg-black/80 border border-white/10 hover:border-white/20"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-black relative">
        <div className="max-w-6xl mx-auto px-8">
          {activeTab === "drive" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GoogleDriveSync />
            </motion.div>
          )}

          {activeTab === "database" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-black/90 backdrop-blur-md rounded-xl border border-white/10 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">
                  Database Management
                </h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-black/40 rounded-lg">
                  <h4 className="font-medium text-white mb-2">
                    Neon Connection (PostgreSQL)
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {neonConnected === null
                      ? "Checking connection..."
                      : neonConnected
                        ? "Your portfolio is successfully connected to the Neon Serverless PostgreSQL database."
                        : "Neon database connection failed. Please check your environment variables and connection string."}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={`w-2 h-2 rounded-full ${neonConnected === null ? "bg-yellow-400" : neonConnected ? "bg-green-400" : "bg-red-500"}`}
                    ></div>
                    <span
                      className={`text-sm ${neonConnected === null ? "text-yellow-400" : neonConnected ? "text-green-400" : "text-red-400"}`}
                    >
                      {neonConnected === null
                        ? "Checking..."
                        : neonConnected
                          ? "Connected"
                          : "Connection Failed"}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-black/40 rounded-lg">
                  <h4 className="font-medium text-white mb-2">
                    Data Management
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Use the Google Drive Sync tab to update portfolio images, or
                    manage data directly in your Neon console.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-black/90 backdrop-blur-md rounded-xl border border-white/10 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <SettingsIcon className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Settings</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-black/40 rounded-lg">
                  <h4 className="font-medium text-white mb-2">
                    API Configuration
                  </h4>
                  <p className="text-gray-400 text-sm mb-3">
                    Google Drive API keys and folder IDs are stored locally in
                    your browser for security.
                  </p>
                  <button
                    onClick={() => {
                      localStorage.removeItem("googleDriveApiKey");
                      localStorage.removeItem("googleDriveFolderId");
                      alert("Stored credentials cleared");
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Clear Stored Credentials
                  </button>
                </div>

                <div className="p-4 bg-black/40 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Environment</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Supabase:</span>
                      <span
                        className={
                          supabaseConnected ? "text-green-400" : "text-gray-400"
                        }
                      >
                        {supabaseConnected ? "Enabled ✓" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;
