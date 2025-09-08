'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useUIStore } from '@/lib/store'

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 2,
        refetchOnWindowFocus: false,
        // Add better error handling
        onError: (error) => {
          console.error('Query error:', error)
        },
      },
      mutations: {
        onError: (error) => {
          console.error('Mutation error:', error)
        },
      },
    },
  }))

  const theme = useUIStore((state) => state.theme)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark', 'high-contrast')
      
      if (theme === 'dark') {
        root.classList.add('dark')
      } else if (theme === 'high-contrast') {
        root.classList.add('high-contrast')
      } else {
        root.classList.add('light')
      }
    }
  }, [theme])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}