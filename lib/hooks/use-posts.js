import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001')

// Posts API calls
async function fetchPosts(page = 1, limit = 20) {
  const response = await fetch(`${API_BASE}/api/posts?page=${page}&limit=${limit}`)
  if (!response.ok) throw new Error('Failed to fetch posts')
  return response.json()
}

async function createPost(postData) {
  const response = await fetch(`${API_BASE}/api/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  })
  if (!response.ok) throw new Error('Failed to create post')
  return response.json()
}

async function likePost(postId) {
  const response = await fetch(`${API_BASE}/api/posts/${postId}/like`, {
    method: 'POST',
  })
  if (!response.ok) throw new Error('Failed to like post')
  return response.json()
}

// Custom hooks
export function usePostsQuery(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['posts', page, limit],
    queryFn: () => fetchPosts(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      // Optimistic update
      queryClient.setQueryData(['posts', 1, 20], (old) => {
        if (!old) return { posts: [newPost], total: 1 }
        return {
          ...old,
          posts: [newPost, ...old.posts],
          total: old.total + 1
        }
      })
      
      // Invalidate to get fresh data
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useLikePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: likePost,
    onMutate: async (postId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['posts'] })
      
      const previousPosts = queryClient.getQueryData(['posts', 1, 20])
      
      queryClient.setQueryData(['posts', 1, 20], (old) => {
        if (!old) return old
        return {
          ...old,
          posts: old.posts.map(post => 
            post.id === postId 
              ? { ...post, likes_count: post.likes_count + 1, is_liked: true }
              : post
          )
        }
      })
      
      return { previousPosts }
    },
    onError: (err, postId, context) => {
      // Revert optimistic update on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts', 1, 20], context.previousPosts)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}