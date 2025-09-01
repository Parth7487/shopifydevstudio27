import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const enableSupabase = String(import.meta.env.VITE_ENABLE_SUPABASE || '').toLowerCase() === 'true'

// Check if we should enable Supabase and have valid credentials
const hasValidCredentials = enableSupabase &&
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  supabaseUrl !== 'YOUR_SUPABASE_PROJECT_URL' &&
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
  supabaseUrl.startsWith('https://')

let supabase: SupabaseClient | null = null

// Only create Supabase client if explicitly enabled and we have valid credentials
if (hasValidCredentials) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    supabase = null
  }
} else {
  console.info('Supabase disabled or not configured. Set VITE_ENABLE_SUPABASE=true, VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable database features.')
}

// Export the client (can be null)
export { supabase }

// Portfolio project type definition
export interface PortfolioProject {
  id: string // UUID in database
  title: string
  brand: string
  description: string
  image: string
  video_url?: string
  category: string
  tags: string[]
  tech: string[]
  metrics: {
    conversion: string
    load_time: string // Note: database uses 'load_time' not 'loadTime'
  }
  live_url: string
  featured: boolean
  has_video: boolean
  status?: string
  created_at?: string
  updated_at?: string
}

// Database table names
export const TABLES = {
  PORTFOLIO_PROJECTS: 'portfolio_projects',
} as const
