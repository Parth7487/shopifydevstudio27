import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Database, Cloud, Settings as SettingsIcon } from 'lucide-react'
import ElegantNavigation from '../components/sections/ElegantNavigation'
import Footer from '../components/sections/Footer'
import GoogleDriveSync from '../components/GoogleDriveSync'
import { useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'drive' | 'database' | 'settings'>('drive')

  const tabs = [
    { id: 'drive', label: 'Google Drive Sync', icon: Cloud },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ] as const

  const supabaseConnected = useMemo(() => !!supabase, [])

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
            Manage your portfolio data, sync images from Google Drive, and configure settings.
          </motion.p>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-beige text-charcoal shadow-lg'
                    : 'bg-black/60 backdrop-blur-md text-gray-400 hover:bg-black/80 border border-white/10 hover:border-white/20'
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
          {activeTab === 'drive' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GoogleDriveSync />
            </motion.div>
          )}

          {activeTab === 'database' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-black/90 backdrop-blur-md rounded-xl border border-white/10 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Database className="w-6 h-6 text-green-400" />
                <h3 className="text-xl font-bold text-white">Database Management</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-black/40 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Supabase Connection</h4>
                  <p className="text-gray-400 text-sm">
                    {supabaseConnected ? 'Your portfolio is connected to Supabase database for real-time updates.' : 'Supabase is not configured. The app will use local/Netlify data sources.'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${supabaseConnected ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                    <span className={`text-sm ${supabaseConnected ? 'text-green-400' : 'text-gray-400'}`}>{supabaseConnected ? 'Connected' : 'Not Configured'}</span>
                  </div>
                </div>

                <div className="p-4 bg-black/40 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Data Management</h4>
                  <p className="text-gray-400 text-sm">
                    Use the Google Drive Sync tab to update portfolio images, or manage data directly in the Supabase dashboard.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
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
                  <h4 className="font-medium text-white mb-2">API Configuration</h4>
                  <p className="text-gray-400 text-sm mb-3">
                    Google Drive API keys and folder IDs are stored locally in your browser for security.
                  </p>
                  <button
                    onClick={() => {
                      localStorage.removeItem('googleDriveApiKey')
                      localStorage.removeItem('googleDriveFolderId')
                      alert('Stored credentials cleared')
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
                      <span className={supabaseConnected ? 'text-green-400' : 'text-gray-400'}>
                        {supabaseConnected ? 'Enabled ✓' : 'Disabled'}
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
  )
}

export default Admin
