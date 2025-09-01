// Instant loading optimizations for Supabase data

export const prefetchSupabaseData = async () => {
  // Prefetch critical data immediately when the app loads
  if (typeof window !== 'undefined') {
    try {
      // Import Supabase client dynamically
      const { supabase } = await import('./supabase')
      
      if (supabase) {
        // Prefetch portfolio projects in background
        supabase
          .from('portfolio_projects')
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
            status
          `)
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(100)
          .then(() => {
            console.log('Portfolio data prefetched')
          })
          .catch(() => {
            console.log('Prefetch failed, using fallback data')
          })
      }
    } catch (error) {
      console.log('Prefetch optimization not available')
    }
  }
}

// Optimize images for instant loading
export const optimizeImageLoading = () => {
  if (typeof window !== 'undefined') {
    // Preload critical images
    const criticalImages = [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
      'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800'
    ]

    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }
}

// Initialize instant loading optimizations
export const initInstantLoading = () => {
  prefetchSupabaseData()
  optimizeImageLoading()
}
