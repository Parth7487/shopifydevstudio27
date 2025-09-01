// Instant loading optimizations for Supabase data

export const prefetchSupabaseData = async () => {
  // Prefetch critical data immediately when the app loads
  if (typeof window !== "undefined") {
    try {
      // Import Supabase client dynamically
      const { supabase } = await import("./supabase");

      if (supabase) {
        // Prefetch portfolio projects in background
        supabase
          .from("portfolio_projects")
          .select(
            `
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
          `,
          )
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(100)
          .then(() => {
            console.log("Portfolio data prefetched");
          })
          .catch(() => {
            console.log("Prefetch failed, using fallback data");
          });
      }
    } catch (error) {
      console.log("Prefetch optimization not available");
    }
  }
};

// Optimize images for instant loading
export const optimizeImageLoading = () => {
  if (typeof window !== "undefined") {
    // Avoid preloading external images that may 404 or change over time
    // Rely on browser lazy/priority hints in markup instead
  }
};

// Initialize instant loading optimizations
export const initInstantLoading = () => {
  prefetchSupabaseData();
  optimizeImageLoading();
};
