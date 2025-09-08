'use client'

import { MainLayout } from '@/components/main-layout'
import { ChatWindow } from '@/components/chat/chat-window'
import { useChatQuery } from '@/lib/hooks/use-chat'
import { EmptyState } from '@/components/empty-state'
import { useUIStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { MessageCircle } from 'lucide-react'

export default function ChatPage({ params }) {
  const { id: chatId } = params
  const language = useUIStore((state) => state.language)
  const t = translations[language]
  
  const { data: chat, isLoading, error } = useChatQuery(chatId)

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-200px)]">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        {error && (
          <EmptyState
            title={t.error}
            description="Failed to load chat"
            action={{ label: t.retry, onClick: () => window.location.reload() }}
          />
        )}

        {!chat && !isLoading && (
          <EmptyState
            icon={MessageCircle}
            title="Chat not found"
            description="This conversation doesn't exist or you don't have access to it"
          />
        )}

        {chat && (
          <ChatWindow chat={chat} />
        )}
      </div>
    </MainLayout>
  )
}