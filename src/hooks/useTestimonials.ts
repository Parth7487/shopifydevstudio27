import { useState, useEffect, useCallback } from "react";

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  quote: string;
  avatar?: string;
  rating: number;
  metric?: string;
  industry?: string;
  verified: boolean;
  sort_order: number;
  created_at?: string;
}

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "default-1",
    author: "Sarah Chen",
    role: "UX/UI Design Lead",
    company: "Figma Community",
    quote: "Their design implementation perfectly captures our vision while maintaining performance.",
    avatar: "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F2db76c02fb2f4424869be58cff012b97?format=webp&width=80",
    rating: 5,
    metric: "50K+ Design Downloads",
    industry: "Design",
    verified: true,
    sort_order: 0
  },
  {
    id: "default-2",
    author: "Marcus Williams",
    role: "Performance Optimization Specialist",
    company: "ShopifyPlus Partner",
    quote: "They consistently deliver lightning-fast stores that convert at industry-leading rates.",
    avatar: "https://cdn.builder.io/api/v1/image/assets%2Fe3a704dc325d4c328aee5dc050d03764%2F12b9f370a7b141828551d29b95ea5b8e?format=webp&width=80",
    rating: 5,
    metric: "40% Average Speed Increase",
    industry: "ShopifyPlus",
    verified: true,
    sort_order: 1
  }
];

let cachedTestimonials: Testimonial[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(cachedTestimonials || DEFAULT_TESTIMONIALS);
  const [loading, setLoading] = useState(!cachedTestimonials);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async (skipCache = false) => {
    try {
      const now = Date.now();
      if (!skipCache && cachedTestimonials && (now - cacheTimestamp < CACHE_DURATION)) {
        setTestimonials(cachedTestimonials);
        setLoading(false);
        return;
      }

      setLoading(!cachedTestimonials);
      setError(null);

      const response = await fetch("/api/testimonials");
      if (!response.ok) {
        throw new Error(`Failed to fetch testimonials: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      const list = Array.isArray(data) && data.length > 0 ? data : DEFAULT_TESTIMONIALS;
      setTestimonials(list);
      cachedTestimonials = list;
      cacheTimestamp = Date.now();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load testimonials");
      // Fallback is already displayed
    } finally {
      setLoading(false);
    }
  }, []);

  const saveTestimonial = useCallback(async (testimonial: Partial<Testimonial> & { id?: string }) => {
    try {
      const isEdit = !!testimonial.id;
      const url = isEdit ? `/api/testimonials/${testimonial.id}` : "/api/testimonials";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonial)
      });

      if (!response.ok) {
        throw new Error(`Failed to save testimonial: ${response.status} ${response.statusText}`);
      }

      const saved = await response.json();

      setTestimonials(prev => {
        let next;
        if (isEdit) {
          next = prev.map(t => t.id === saved.id ? saved : t);
        } else {
          next = [saved, ...prev];
        }
        // Resort by sort_order
        next.sort((a, b) => a.sort_order - b.sort_order);
        cachedTestimonials = next;
        cacheTimestamp = Date.now();
        return next;
      });

      return saved;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  const deleteTestimonial = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(`Failed to delete testimonial: ${response.status} ${response.statusText}`);
      }

      setTestimonials(prev => {
        const next = prev.filter(t => t.id !== id);
        cachedTestimonials = next;
        cacheTimestamp = Date.now();
        return next;
      });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }, []);

  const updateTestimonialOrder = useCallback(async (orderedIds: string[]) => {
    // Optimistically update local state first
    setTestimonials(prev => {
      const copy = [...prev];
      const next = orderedIds.map((id, index) => {
        const item = copy.find(t => t.id === id);
        if (item) {
          return { ...item, sort_order: index };
        }
        return null;
      }).filter(Boolean) as Testimonial[];
      
      cachedTestimonials = next;
      cacheTimestamp = Date.now();
      return next;
    });

    try {
      // Update each item's sort order on the backend
      await Promise.all(
        orderedIds.map((id, index) =>
          fetch(`/api/testimonials/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sort_order: index })
          })
        )
      );
      return true;
    } catch (err) {
      console.error("Failed to persist testimonial sort order:", err);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  return {
    testimonials,
    loading,
    error,
    refetch: () => fetchTestimonials(true),
    saveTestimonial,
    deleteTestimonial,
    updateTestimonialOrder
  };
};
