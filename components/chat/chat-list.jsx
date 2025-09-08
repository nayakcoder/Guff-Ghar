'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/lib/store'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function ChatList({ chats }) {
  const user = useAuthStore((state) => state.user)

  const formatLastMessage = (message) => {
    if (!message) return 'No messages yet'
    
    if (message.content.length > 50) {
      return message.content.substring(0, 50) + '...'
    }
    return message.content
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Now'
    if (diffInHours < 24) return `${diffInHours}h`
    return date.toLocaleDateString()
  }

  const getOtherParticipant = (chat) => {
    return chat.participants?.find(p => p.id !== user?.id)
  }

  return (
    <div className="space-y-0">
      {chats.map((chat) => {
        const otherUser = getOtherParticipant(chat)
        const hasUnread = chat.unread_count > 0
        
        return (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div className={cn(
              "bg-black border-t border-gray-900 hover:bg-gray-900/50 transition-colors cursor-pointer",
              hasUnread && "border-l-2 border-l-green-500"
            )}>
              <div className="flex items-center space-x-3 p-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={otherUser?.avatar_url} alt={otherUser?.username} />
                  <AvatarFallback className="bg-gray-800 text-white">
                    {otherUser?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={cn(
                      "text-white truncate",
                      hasUnread ? "font-semibold" : "font-medium"
                    )}>
                      {otherUser?.display_name || otherUser?.username}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {formatTime(chat.updated_at)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-sm truncate",
                      hasUnread ? "text-gray-300 font-medium" : "text-gray-500"
                    )}>
                      {formatLastMessage(chat.last_message)}
                    </p>
                    
                    {hasUnread && (
                      <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2 flex-shrink-0">
                        {chat.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}