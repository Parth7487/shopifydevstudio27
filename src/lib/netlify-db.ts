// Netlify Database Integration
// This file provides utilities to interact with Netlify DB (powered by Neon)

export interface NetlifyPortfolioProject {
  id: string
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
    load_time: string
  }
  live_url: string
  featured: boolean
  has_video: boolean
  status: string
  created_at: string
  updated_at: string
}

// Base API URL for Netlify functions
const API_BASE = '/.netlify/functions'

export class NetlifyDatabase {
  
  // Initialize the database
  static async init(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE}/db-init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Database initialization failed:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Seed the database with sample data
  static async seed(): Promise<{ success: boolean; message: string; projectCount?: number }> {
    try {
      const response = await fetch(`${API_BASE}/db-seed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Database seeding failed:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Get all portfolio projects
  static async getProjects(): Promise<NetlifyPortfolioProject[]> {
    try {
      const response = await fetch(`${API_BASE}/portfolio`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const projects = await response.json()
      return projects || []
    } catch (error) {
      console.error('Failed to fetch projects from Netlify DB:', error)
      return []
    }
  }

  // Get single project by ID
  static async getProject(id: string): Promise<NetlifyPortfolioProject | null> {
    try {
      const response = await fetch(`${API_BASE}/portfolio/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const project = await response.json()
      return project
    } catch (error) {
      console.error('Failed to fetch project from Netlify DB:', error)
      return null
    }
  }

  // Create new project
  static async createProject(project: Omit<NetlifyPortfolioProject, 'id' | 'created_at' | 'updated_at'>): Promise<NetlifyPortfolioProject | null> {
    try {
      const response = await fetch(`${API_BASE}/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const newProject = await response.json()
      return newProject
    } catch (error) {
      console.error('Failed to create project in Netlify DB:', error)
      return null
    }
  }

  // Update project
  static async updateProject(id: string, updates: Partial<NetlifyPortfolioProject>): Promise<NetlifyPortfolioProject | null> {
    try {
      const response = await fetch(`${API_BASE}/portfolio/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const updatedProject = await response.json()
      return updatedProject
    } catch (error) {
      console.error('Failed to update project in Netlify DB:', error)
      return null
    }
  }

  // Delete project
  static async deleteProject(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/portfolio/${id}`, {
        method: 'DELETE',
      })
      
      return response.ok
    } catch (error) {
      console.error('Failed to delete project from Netlify DB:', error)
      return false
    }
  }
}

// Hook for React components
export const useNetlifyDB = () => {
  return {
    init: NetlifyDatabase.init,
    seed: NetlifyDatabase.seed,
    getProjects: NetlifyDatabase.getProjects,
    getProject: NetlifyDatabase.getProject,
    createProject: NetlifyDatabase.createProject,
    updateProject: NetlifyDatabase.updateProject,
    deleteProject: NetlifyDatabase.deleteProject,
  }
}
