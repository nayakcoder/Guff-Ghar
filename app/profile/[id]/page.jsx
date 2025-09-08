'use client'

import { MainLayout } from '@/components/main-layout'
import { ProfileCard } from '@/components/profile/profile-card'
import { PostCard } from '@/components/feed/post-card'
import { useProfileQuery } from '@/lib/hooks/use-profile'
import { EmptyState } from '@/components/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { useUIStore } from '@/lib/store'
import { translations } from '@/lib/i18n'

export default function ProfilePage({ params }) {
  const { id: userId } = params
  const language = useUIStore((state) => state.language)
  const t = translations[language]
  
  const { data: profile, isLoading, error } = useProfileQuery(userId)

  return (
    <div className="min-h-screen bg-black">
      <MainLayout>
        <div className="max-w-lg mx-auto">
        {isLoading && (
          <>
            <div className="bg-black border-t border-gray-900 p-6">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-20 w-20 rounded-full bg-gray-800" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-6 w-[200px] bg-gray-800" />
                  <Skeleton className="h-4 w-[150px] bg-gray-800" />
                  <Skeleton className="h-4 w-full bg-gray-800" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-4 w-[80px] bg-gray-800" />
                    <Skeleton className="h-4 w-[80px] bg-gray-800" />
                    <Skeleton className="h-4 w-[80px] bg-gray-800" />
                  </div>
                </div>
              </div>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </>
        )}

        {error && (
          <div className="px-4">
            <EmptyState
              title={t.error}
              description="Failed to load profile"
              action={{ label: t.retry, onClick: () => window.location.reload() }}
            />
          </div>
        )}

        {profile && (
          <>
            <ProfileCard user={profile.user} />
            
            <div className="space-y-0">
              {profile.posts && profile.posts.length > 0 ? (
                profile.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="px-4 py-8">
                  <EmptyState
                    title={t.no_posts}
                    description="This user hasn't posted anything yet"
                  />
                </div>
              )}
            </div>
          </>
        )}        
        </div>
      </MainLayout>
    </div>
  )
}

function PostSkeleton() {
  return (
    <div className="bg-black border-t border-gray-900 p-4 space-y-3">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[120px] bg-gray-800" />
          <Skeleton className="h-3 w-[80px] bg-gray-800" />
        </div>
      </div>
      <Skeleton className="h-4 w-full bg-gray-800" />
      <Skeleton className="h-4 w-3/4 bg-gray-800" />
    </div>
  )
}