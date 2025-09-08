import { useQuery } from '@tanstack/react-query'

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Enhanced chat API calls
async function fetchChats() {
  const response = await fetch(`${API_BASE}/api/chats`)
  if (!response.ok) throw new Error('Failed to fetch chats')
  return response.json()
}

// Custom hooks
export function useChatsQuery() {
  return useQuery({
    queryKey: ['chats'],
    queryFn: fetchChats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Re-export existing hooks
export { useChatQuery, useSendMessage } from './use-chat'