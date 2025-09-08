import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Reels API calls
async function fetchReels(page = 1, limit = 10) {
  const response = await fetch(`${API_BASE}/api/reels?page=${page}&limit=${limit}`)
  if (!response.ok) throw new Error('Failed to fetch reels')
  return response.json()
}

async function likeReel(reelId) {
  const response = await fetch(`${API_BASE}/api/reels/${reelId}/like`, {
    method: 'POST',
  })
  if (!response.ok) throw new Error('Failed to like reel')
  return response.json()
}

// Custom hooks
export function useReelsQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['reels', page, limit],
    queryFn: () => fetchReels(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useLikeReel() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: likeReel,
    onMutate: async (reelId) => {
      // Optimistic update similar to posts
      await queryClient.cancelQueries({ queryKey: ['reels'] })
      
      const previousReels = queryClient.getQueryData(['reels', 1, 10])
      
      queryClient.setQueryData(['reels', 1, 10], (old) => {
        if (!old) return old
        return {
          ...old,
          reels: old.reels.map(reel => 
            reel.id === reelId 
              ? { ...reel, likes_count: reel.likes_count + 1, is_liked: true }
              : reel
          )
        }
      })
      
      return { previousReels }
    },
    onError: (err, reelId, context) => {
      if (context?.previousReels) {
        queryClient.setQueryData(['reels', 1, 10], context.previousReels)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['reels'] })
    },
  })
}