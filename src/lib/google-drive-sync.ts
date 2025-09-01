import { supabase, PortfolioProject } from './supabase'

export interface GoogleDriveImage {
  id: string
  name: string
  webViewLink: string
  webContentLink: string
  thumbnailLink: string
  mimeType: string
  size: string
  createdTime: string
  modifiedTime: string
}

export interface DriveFolder {
  id: string
  name: string
  images: GoogleDriveImage[]
}

export class GoogleDriveSync {
  private apiKey: string
  private folderId: string

  constructor(apiKey: string, folderId: string) {
    this.apiKey = apiKey
    this.folderId = folderId
  }

  // Convert Google Drive file ID to direct image URL
  static getDirectImageUrl(fileId: string): string {
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }

  // Extract file ID from Google Drive URL
  static extractFileId(driveUrl: string): string | null {
    const patterns = [
      /\/d\/([a-zA-Z0-9-_]+)/,
      /id=([a-zA-Z0-9-_]+)/,
      /file\/d\/([a-zA-Z0-9-_]+)/
    ]

    for (const pattern of patterns) {
      const match = driveUrl.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  // Fetch images from Google Drive folder via serverless function
  async fetchImagesFromFolder(): Promise<GoogleDriveImage[]> {
    try {
      const response = await fetch('/api/google-drive-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: this.apiKey,
          folderId: this.folderId,
          action: 'fetch'
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.images || []
    } catch (error) {
      console.error('Failed to fetch images from Google Drive:', error)
      throw error
    }
  }

  // Sync Google Drive images to Supabase portfolio projects via serverless function
  async syncImagesToSupabase(): Promise<{
    success: boolean
    updated: number
    errors: string[]
  }> {
    try {
      const response = await fetch('/api/google-drive-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: this.apiKey,
          folderId: this.folderId,
          action: 'sync'
        })
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return {
        success: data.success,
        updated: data.updated,
        errors: data.errors || []
      }

    } catch (error) {
      return {
        success: false,
        updated: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }

  // Update specific project with Google Drive image via serverless function
  async updateProjectImage(projectId: string, imageFileId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/google-drive-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: this.apiKey,
          folderId: this.folderId,
          action: 'update',
          projectId,
          imageFileId
        })
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      return data.success

    } catch (error) {
      console.error('Error updating project image:', error)
      return false
    }
  }

  // Bulk update projects with image mapping
  async bulkUpdateImages(imageMapping: Record<string, string>): Promise<{
    success: boolean
    updated: number
    errors: string[]
  }> {
    if (!supabase) {
      return {
        success: false,
        updated: 0,
        errors: ['Supabase not configured']
      }
    }

    const errors: string[] = []
    let updated = 0

    for (const [projectId, imageFileId] of Object.entries(imageMapping)) {
      try {
        const success = await this.updateProjectImage(projectId, imageFileId)
        if (success) {
          updated++
        } else {
          errors.push(`Failed to update project ${projectId}`)
        }
      } catch (error) {
        errors.push(`Error updating project ${projectId}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return {
      success: errors.length === 0,
      updated,
      errors
    }
  }
}

// Helper function to create Google Drive sync instance
export const createGoogleDriveSync = (apiKey: string, folderId: string) => {
  return new GoogleDriveSync(apiKey, folderId)
}

// Hook for React components
export const useGoogleDriveSync = () => {
  const syncImages = async (apiKey: string, folderId: string) => {
    const driveSync = createGoogleDriveSync(apiKey, folderId)
    return await driveSync.syncImagesToSupabase()
  }

  const updateProjectImage = async (projectId: string, imageFileId: string, apiKey: string, folderId: string) => {
    const driveSync = createGoogleDriveSync(apiKey, folderId)
    return await driveSync.updateProjectImage(projectId, imageFileId)
  }

  const fetchImages = async (apiKey: string, folderId: string) => {
    const driveSync = createGoogleDriveSync(apiKey, folderId)
    return await driveSync.fetchImagesFromFolder()
  }

  return {
    syncImages,
    updateProjectImage,
    fetchImages,
    getDirectImageUrl: GoogleDriveSync.getDirectImageUrl,
    extractFileId: GoogleDriveSync.extractFileId
  }
}
