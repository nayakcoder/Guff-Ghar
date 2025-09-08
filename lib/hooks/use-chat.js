// Update the existing use-chat.js to include the new hook
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

// Chat API calls
async function fetchChats() {
  const response = await fetch(`${API_BASE}/api/chats`)
  if (!response.ok) throw new Error('Failed to fetch chats')
  return response.json()
}

async function fetchChat(chatId) {
  const response = await fetch(`${API_BASE}/api/messages?chat_id=${chatId}`)
  if (!response.ok) throw new Error('Failed to fetch chat')
  return response.json()
}

async function sendMessage(messageData) {
  const response = await fetch(`${API_BASE}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData),
  })
  if (!response.ok) throw new Error('Failed to send message')
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

export function useChatQuery(chatId) {
  return useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => fetchChat(chatId),
    enabled: !!chatId,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (newMessage, variables) => {
      // Update the chat with the new message
      queryClient.setQueryData(['chat', variables.chat_id], (old) => {
        if (!old) return old
        return {
          ...old,
          messages: [...(old.messages || []), newMessage]
        }
      })
      
      // Update chats list with latest message
      queryClient.setQueryData(['chats'], (old) => {
        if (!old) return old
        return old.map(chat => 
          chat.id === variables.chat_id 
            ? { ...chat, last_message: newMessage, updated_at: newMessage.created_at }
            : chat
        )
      })
      
      // Invalidate to get fresh data
      queryClient.invalidateQueries({ queryKey: ['chat', variables.chat_id] })
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })
}