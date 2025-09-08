import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

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

// Friends API calls
async function fetchFriends() {
  const response = await fetch(`${API_BASE}/api/friends`)
  if (!response.ok) throw new Error('Failed to fetch friends')
  return response.json()
}

async function fetchFriendRequests() {
  const response = await fetch(`${API_BASE}/api/friends/requests`)
  if (!response.ok) throw new Error('Failed to fetch friend requests')
  return response.json()
}

async function sendFriendRequest(userId) {
  const response = await fetch(`${API_BASE}/api/friends/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  })
  if (!response.ok) throw new Error('Failed to send friend request')
  return response.json()
}

async function respondToFriendRequest(requestId, action) {
  const response = await fetch(`${API_BASE}/api/friends/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ request_id: requestId, action }),
  })
  if (!response.ok) throw new Error('Failed to respond to friend request')
  return response.json()
}

// Custom hooks
export function useFriendsQuery() {
  return useQuery({
    queryKey: ['friends'],
    queryFn: fetchFriends,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useFriendRequestsQuery() {
  return useQuery({
    queryKey: ['friend-requests'],
    queryFn: fetchFriendRequests,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useSendFriendRequest() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] })
      queryClient.invalidateQueries({ queryKey: ['friends'] })
    },
  })
}

export function useRespondToFriendRequest() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ requestId, action }) => respondToFriendRequest(requestId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-requests'] })
      queryClient.invalidateQueries({ queryKey: ['friends'] })
    },
  })
}