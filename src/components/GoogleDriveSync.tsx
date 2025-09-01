import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Cloud, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Image as ImageIcon,
  RefreshCw,
  Settings,
  FolderOpen
} from 'lucide-react'
import { useGoogleDriveSync, GoogleDriveImage } from '../lib/google-drive-sync'
import { useProjects } from '../hooks/useProjects'

interface GoogleDriveSyncProps {
  className?: string
}

export const GoogleDriveSync: React.FC<GoogleDriveSyncProps> = ({ className = '' }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('googleDriveApiKey') || '')
  const [folderId, setFolderId] = useState(localStorage.getItem('googleDriveFolderId') || '')
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<GoogleDriveImage[]>([])
  const [syncResult, setSyncResult] = useState<{
    success: boolean
    updated: number
    errors: string[]
  } | null>(null)
  
  const { syncImages, fetchImages, updateProjectImage } = useGoogleDriveSync()
  const { projects, refetch } = useProjects()

  // Save credentials to localStorage
  useEffect(() => {
    if (apiKey) localStorage.setItem('googleDriveApiKey', apiKey)
    if (folderId) localStorage.setItem('googleDriveFolderId', folderId)
  }, [apiKey, folderId])

  const handleFetchImages = async () => {
    if (!apiKey || !folderId) {
      alert('Please enter both Google Drive API Key and Folder ID')
      return
    }

    setIsLoading(true)
    try {
      const driveImages = await fetchImages(apiKey, folderId)
      setImages(driveImages)
    } catch (error) {
      console.error('Failed to fetch images:', error)
      alert('Failed to fetch images from Google Drive. Please check your API key and folder ID.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSyncImages = async () => {
    if (!apiKey || !folderId) {
      alert('Please enter both Google Drive API Key and Folder ID')
      return
    }

    setIsLoading(true)
    try {
      const result = await syncImages(apiKey, folderId)
      setSyncResult(result)
      
      if (result.success && result.updated > 0) {
        // Refresh the projects to show updated images
        await refetch()
      }
    } catch (error) {
      console.error('Sync failed:', error)
      setSyncResult({
        success: false,
        updated: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getImagePreviewUrl = (image: GoogleDriveImage): string => {
    return image.thumbnailLink || `https://drive.google.com/uc?export=view&id=${image.id}`
  }

  return (
    <div className={`bg-black/90 backdrop-blur-md rounded-xl border border-white/10 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <Cloud className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Google Drive Image Sync</h3>
      </div>

      {/* Configuration */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Google Drive API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Google Drive API key"
            className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Google Drive Folder ID
          </label>
          <input
            type="text"
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            placeholder="Enter the folder ID containing your images"
            className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
          />
        </div>

        <div className="text-xs text-gray-400">
          <p>📋 <strong>How to get your API key:</strong></p>
          <p>1. Go to <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Cloud Console</a></p>
          <p>2. Enable Google Drive API</p>
          <p>3. Create credentials → API Key</p>
          <br />
          <p>📁 <strong>How to get folder ID:</strong></p>
          <p>Copy the ID from your Google Drive folder URL after /folders/</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleFetchImages}
          disabled={isLoading || !apiKey || !folderId}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FolderOpen className="w-4 h-4" />
          )}
          Fetch Images
        </button>

        <button
          onClick={handleSyncImages}
          disabled={isLoading || !apiKey || !folderId}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Sync to Supabase
        </button>
      </div>

      {/* Sync Results */}
      {syncResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg mb-6 ${
            syncResult.success ? 'bg-green-900/20 border border-green-500/20' : 'bg-red-900/20 border border-red-500/20'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {syncResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span className={`font-medium ${syncResult.success ? 'text-green-400' : 'text-red-400'}`}>
              {syncResult.success ? 'Sync Successful' : 'Sync Failed'}
            </span>
          </div>
          
          <p className="text-gray-300 text-sm">
            Updated {syncResult.updated} project{syncResult.updated !== 1 ? 's' : ''}
          </p>
          
          {syncResult.errors.length > 0 && (
            <div className="mt-2">
              <p className="text-red-400 text-sm font-medium">Errors:</p>
              <ul className="text-red-300 text-xs mt-1">
                {syncResult.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {/* Images Preview */}
      {images.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Found Images ({images.length})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black/60 rounded-lg p-3 border border-white/10"
              >
                <img
                  src={getImagePreviewUrl(image)}
                  alt={image.name}
                  className="w-full h-20 object-cover rounded mb-2"
                  loading="lazy"
                />
                <p className="text-xs text-gray-300 truncate" title={image.name}>
                  {image.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(parseInt(image.size) / 1024 / 1024).toFixed(1)}MB
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Current Projects Status */}
      {projects.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-medium text-white mb-4">
            Current Projects ({projects.length})
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {projects.slice(0, 10).map((project) => (
              <div key={project.id} className="flex items-center gap-3 p-2 bg-black/40 rounded">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-8 h-8 object-cover rounded"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{project.title}</p>
                  <p className="text-xs text-gray-400 truncate">{project.brand}</p>
                </div>
              </div>
            ))}
            {projects.length > 10 && (
              <p className="text-xs text-gray-400 text-center">
                ...and {projects.length - 10} more projects
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GoogleDriveSync
