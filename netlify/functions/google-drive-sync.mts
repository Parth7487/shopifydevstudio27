import type { Context, Config } from "@netlify/functions";
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''

interface GoogleDriveImage {
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

// Convert Google Drive file ID to direct image URL
const getDirectImageUrl = (fileId: string): string => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`
}

// Fetch images from Google Drive folder
const fetchImagesFromFolder = async (apiKey: string, folderId: string): Promise<GoogleDriveImage[]> => {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?` +
    `q='${folderId}' in parents and (mimeType contains 'image/')&` +
    `fields=files(id,name,webViewLink,webContentLink,thumbnailLink,mimeType,size,createdTime,modifiedTime)&` +
    `key=${apiKey}&` +
    `orderBy=modifiedTime desc`
  )

  if (!response.ok) {
    throw new Error(`Google Drive API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.files || []
}

export default async (req: Request, context: Context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers,
    })
  }

  try {
    const body = await req.json()
    const { apiKey, folderId, action = 'sync' } = body

    if (!apiKey || !folderId) {
      return new Response(JSON.stringify({
        error: 'Missing required parameters: apiKey and folderId'
      }), {
        status: 400,
        headers,
      })
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (action === 'fetch') {
      // Just fetch and return images
      const images = await fetchImagesFromFolder(apiKey, folderId)
      return new Response(JSON.stringify({ images }), {
        status: 200,
        headers,
      })
    }

    if (action === 'sync') {
      // Fetch images from Google Drive
      const driveImages = await fetchImagesFromFolder(apiKey, folderId)
      
      // Fetch current portfolio projects
      const { data: projects, error: fetchError } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('status', 'published')

      if (fetchError) {
        throw new Error(`Failed to fetch projects: ${fetchError.message}`)
      }

      const errors: string[] = []
      let updated = 0

      // Try to match images to projects based on name patterns
      for (const project of projects || []) {
        try {
          // Look for images that match the project brand or title
          const matchingImage = driveImages.find(img => {
            const imgName = img.name.toLowerCase()
            const brandName = project.brand.toLowerCase()
            const titleName = project.title.toLowerCase().replace(/[^a-z0-9]/gi, '')
            
            return imgName.includes(brandName) || 
                   imgName.includes(titleName) ||
                   brandName.includes(imgName.replace(/\.[^/.]+$/, "")) // Remove extension
          })

          if (matchingImage) {
            const directImageUrl = getDirectImageUrl(matchingImage.id)
            
            // Update the project with the new image URL
            const { error: updateError } = await supabase
              .from('portfolio_projects')
              .update({ 
                image: directImageUrl,
                updated_at: new Date().toISOString()
              })
              .eq('id', project.id)

            if (updateError) {
              errors.push(`Failed to update ${project.title}: ${updateError.message}`)
            } else {
              updated++
              console.log(`Updated ${project.title} with image: ${matchingImage.name}`)
            }
          }
        } catch (error) {
          errors.push(`Error processing ${project.title}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }

      return new Response(JSON.stringify({
        success: errors.length === 0,
        updated,
        errors,
        totalImages: driveImages.length,
        totalProjects: projects?.length || 0
      }), {
        status: 200,
        headers,
      })
    }

    if (action === 'update') {
      // Update specific project with image
      const { projectId, imageFileId } = body
      
      if (!projectId || !imageFileId) {
        return new Response(JSON.stringify({
          error: 'Missing projectId or imageFileId'
        }), {
          status: 400,
          headers,
        })
      }

      const directImageUrl = getDirectImageUrl(imageFileId)
      
      const { error } = await supabase
        .from('portfolio_projects')
        .update({ 
          image: directImageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)

      if (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          status: 500,
          headers,
        })
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Project image updated successfully'
      }), {
        status: 200,
        headers,
      })
    }

    return new Response(JSON.stringify({
      error: 'Invalid action. Use: fetch, sync, or update'
    }), {
      status: 400,
      headers,
    })

  } catch (error) {
    console.error('Google Drive sync error:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers,
    })
  }
}

export const config: Config = {
  path: "/api/google-drive-sync"
}
