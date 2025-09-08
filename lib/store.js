import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
    }
  )
)

export const useUIStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      language: 'en',
      sidebarOpen: false,
      
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'ui-storage',
      skipHydration: true,
    }
  )
)