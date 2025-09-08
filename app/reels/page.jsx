'use client'

import { MainLayout } from '@/components/main-layout'
import { ReelPlayer } from '@/components/reels/reel-player'
import { useReelsQuery } from '@/lib/hooks/use-reels'
import { EmptyState } from '@/components/empty-state'
import { useUIStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { Video } from 'lucide-react'

export default function ReelsPage() {
  const language = useUIStore((state) => state.language)
  const t = translations[language]
  
  const { data: reels, isLoading, error } = useReelsQuery()

  return (
    <MainLayout>
      <div className="max-w-md mx-auto">
        {isLoading && (
          <div className="animate-pulse bg-muted rounded-lg aspect-[9/16] w-full" />
        )}

        {error && (
          <EmptyState
            title={t.error}
            description="Failed to load reels"
            action={{ label: t.retry, onClick: () => window.location.reload() }}
          />
        )}

        {reels && reels.length === 0 && (
          <EmptyState
            icon={Video}
            title="No reels yet"
            description="Be the first to create a reel!"
          />
        )}

        {reels && reels.length > 0 && (
          <div className="space-y-4">
            {reels.map((reel) => (
              <ReelPlayer key={reel.id} reel={reel} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}