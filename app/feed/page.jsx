'use client'

import { MainLayout } from '@/components/main-layout'
import { CreatePost } from '@/components/feed/create-post'
import { PostCard } from '@/components/feed/post-card'
import { usePostsQuery } from '@/lib/hooks/use-posts'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/empty-state'
import { useUIStore, useAuthStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { Search, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toaster'
import { useEffect } from 'react'

export default function FeedPage() {
  const language = useUIStore((state) => state.language)
  const user = useAuthStore((state) => state.user)
  const router = useRouter()
  const { toast } = useToast()
  const t = translations[language]
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth')
    }
  }, [user, router])
  
  const { data: posts, isLoading, error, refetch } = usePostsQuery()

  // Show loading if redirecting
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Redirecting to login...</div>
      </div>
    )
  }

  const handleTestFeatures = () => {
    toast({
      title: 'Test',
      description: 'All systems working! Posts: ' + (posts?.posts?.length || 0),
    })
  }

  return (
    <div className="min-h-screen bg-black">
      <MainLayout>
        <div className="max-w-lg mx-auto">
          {/* Header - Exact match to design */}
          <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-lg px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">GG</span>
                </div>
                <span className="text-white font-semibold text-lg">Guff Ghar</span>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={handleTestFeatures}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 h-7"
                >
                  Test
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white h-8 w-8">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white h-8 w-8">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* What's happening input */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm">U</span>
              </div>
              <div className="flex-1 bg-gray-900 rounded-full px-4 py-3">
                <input 
                  type="text" 
                  placeholder="What's happening?" 
                  className="w-full bg-transparent text-gray-400 placeholder-gray-500 text-sm focus:outline-none"
                  readOnly
                />
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white h-8 w-8">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-0">
            {isLoading && (
              <div className="space-y-0">
                {Array.from({ length: 3 }).map((_, i) => (
                  <PostSkeleton key={i} />
                ))}
              </div>
            )}

            {error && (
              <div className="px-4">
                <EmptyState
                  title={t.error}
                  description={`Failed to load posts: ${error.message}`}
                  action={{ 
                    label: t.retry, 
                    onClick: () => {
                      refetch()
                      toast({
                        title: 'Retrying',
                        description: 'Attempting to reload posts...',
                      })
                    }
                  }}
                />
              </div>
            )}

            {posts && posts.length === 0 && (
              <div className="px-4">
                <EmptyState
                  title={t.no_posts}
                  description="Start following people to see their posts here"
                />
              </div>
            )}

            {posts && posts.length > 0 && (
              posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
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
      <Skeleton className="h-[200px] w-full rounded-xl bg-gray-800" />
    </div>
  )
}