import { useState, useEffect, useCallback } from 'react'
import { supabase, PortfolioProject, TABLES } from '../lib/supabase'

export interface UseProjectsReturn {
  projects: PortfolioProject[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// In-memory cache for instant loading
let cachedProjects: PortfolioProject[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 30000 // 30 seconds

export const useProjects = (): UseProjectsReturn => {
  const [projects, setProjects] = useState<PortfolioProject[]>(cachedProjects || [])
  const [loading, setLoading] = useState(!cachedProjects)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async (skipCache = false) => {
    try {
      // Check cache first for instant loading
      const now = Date.now()
      if (!skipCache && cachedProjects && (now - cacheTimestamp) < CACHE_DURATION) {
        setProjects(cachedProjects)
        setLoading(false)
        return
      }

      setLoading(!cachedProjects) // Don't show loading if we have cached data
      setError(null)

      // Check if Supabase is available
      if (!supabase) {
        setProjects([])
        setLoading(false)
        return
      }

      const { data, error: fetchError } = await supabase
        .from(TABLES.PORTFOLIO_PROJECTS)
        .select(`
          id,
          title,
          brand,
          description,
          image,
          video_url,
          category,
          tags,
          tech,
          metrics,
          live_url,
          featured,
          has_video,
          status,
          created_at,
          updated_at
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(100)

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      // Transform data to match the expected format
      const transformedProjects: PortfolioProject[] = (data || []).map((project: any) => ({
        id: project.id,
        title: project.title,
        brand: project.brand,
        description: project.description,
        image: project.image,
        videoUrl: project.video_url,
        category: project.category,
        tags: Array.isArray(project.tags) ? project.tags : [],
        tech: Array.isArray(project.tech) ? project.tech : [],
        metrics: {
          conversion: project.metrics?.conversion || '0%',
          loadTime: project.metrics?.load_time || '0s', // Database uses 'load_time'
        },
        liveUrl: project.live_url,
        featured: project.featured || false,
        hasVideo: project.has_video || false,
        status: project.status,
        created_at: project.created_at,
        updated_at: project.updated_at,
      }))

      setProjects(transformedProjects)

      // Update cache for instant future loads
      cachedProjects = transformedProjects
      cacheTimestamp = Date.now()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(async () => {
    await fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    // Immediate load if we have cached data, otherwise fetch fresh
    if (cachedProjects) {
      setProjects(cachedProjects)
      setLoading(false)
      // Still fetch fresh data in background
      fetchProjects(true)
    } else {
      fetchProjects()
    }
  }, [fetchProjects])

  // Set up real-time subscription for project updates
  useEffect(() => {
    // Only set up subscription if Supabase is available
    if (!supabase) {
      return
    }

    const channel = supabase
      .channel('portfolio_projects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: TABLES.PORTFOLIO_PROJECTS,
        },
        () => {
          // Force refresh cache when data changes
          fetchProjects(true)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchProjects])

  return {
    projects,
    loading,
    error,
    refetch,
  }
}

// Additional helper hooks
export const useProject = (id: string) => {
  const [project, setProject] = useState<PortfolioProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if Supabase is available
        if (!supabase) {
          setProject(null)
          setLoading(false)
          return
        }

        const { data, error: fetchError } = await supabase
          .from(TABLES.PORTFOLIO_PROJECTS)
          .select('*')
          .eq('id', id)
          .single()

        if (fetchError) {
          throw new Error(fetchError.message)
        }

        if (data) {
          const transformedProject: PortfolioProject = {
            id: data.id,
            title: data.title,
            brand: data.brand,
            description: data.description,
            image: data.image,
            videoUrl: data.video_url,
            category: data.category,
            tags: Array.isArray(data.tags) ? data.tags : [],
            tech: Array.isArray(data.tech) ? data.tech : [],
            metrics: {
              conversion: data.metrics?.conversion || '0%',
              loadTime: data.metrics?.load_time || '0s', // Database uses 'load_time'
            },
            liveUrl: data.live_url,
            featured: data.featured || false,
            hasVideo: data.has_video || false,
            status: data.status,
            created_at: data.created_at,
            updated_at: data.updated_at,
          }
          setProject(transformedProject)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch project')
        console.error('Error fetching project:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProject()
    }
  }, [id])

  return { project, loading, error }
}
