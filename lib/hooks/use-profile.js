import { useQuery } from '@tanstack/react-query'

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001')

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