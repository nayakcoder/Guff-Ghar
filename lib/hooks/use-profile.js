import { useQuery } from '@tanstack/react-query'

// Dynamic API base URL that works in both SSR and client-side
function getApiBase() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Fallback for SSR
  return 'http://localhost:3001'
}

const API_BASE = getApiBase()

// Profile API calls
async function fetchProfile(userId) {
  const response = await fetch(`${API_BASE}/api/profile/${userId}`)
  if (!response.ok) throw new Error('Failed to fetch profile')
  return response.json()
}

// Custom hooks
export function useProfileQuery(userId) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}