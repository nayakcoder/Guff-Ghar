'use client'

import { MainLayout } from '@/components/main-layout'
import { ChatList } from '@/components/chat/chat-list'
import { EmptyState } from '@/components/empty-state'
import { useChatsQuery } from '@/lib/hooks/use-chat'
import { useUIStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { MessageCircle } from 'lucide-react'

export default function ChatPage() {
  const language = useUIStore((state) => state.language)
  const t = translations[language]
  
  const { data: chats, isLoading, error } = useChatsQuery()

  return (
    <div className="min-h-screen bg-black">
      <MainLayout>
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-lg px-4 py-4 border-b border-gray-900">
            <h1 className="text-xl font-semibold text-white">{t.chat}</h1>
          </div>
          
          {isLoading && (
            <div className="space-y-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-900 border-t border-gray-900 h-16" />
              ))}
            </div>
          )}

          {error && (
            <div className="px-4 py-8">
              <EmptyState
                title={t.error}
                description="Failed to load chats"
                action={{ label: t.retry, onClick: () => window.location.reload() }}
              />
            </div>
          )}

          {chats && chats.length === 0 && (
            <div className="px-4 py-8">
              <EmptyState
                icon={MessageCircle}
                title="No conversations yet"
                description="Start a conversation with your friends!"
              />
            </div>
          )}

          {chats && chats.length > 0 && (
            <ChatList chats={chats} />
          )}
        </div>
      </MainLayout>
    </div>
  )
}