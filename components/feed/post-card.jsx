'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLikePost } from '@/lib/hooks/use-posts'
import { useUIStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

export function PostCard({ post }) {
  const [showComments, setShowComments] = useState(false)
  
  const language = useUIStore((state) => state.language)
  const t = translations[language]
  
  const likePostMutation = useLikePost()

  const handleLike = () => {
    likePostMutation.mutate(post.id)
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    return `${Math.floor(diffInSeconds / 86400)}d`
  }

  return (
    <div className="bg-black border-t border-gray-900">
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-start space-x-3 flex-1">
          <Link href={`/profile/${post.author?.id}`}>
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={post.author?.avatar_url} alt={post.author?.username} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {post.author?.username?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Link 
                href={`/profile/${post.author?.id}`}
                className="text-white font-medium hover:underline text-sm"
              >
                {post.author?.display_name || post.author?.username}
              </Link>
              <span className="text-gray-500 text-sm">@{post.author?.username}</span>
              <span className="text-gray-500 text-sm">·</span>
              <span className="text-gray-500 text-sm">{formatTimeAgo(post.created_at)}</span>
            </div>
            
            {/* Content */}
            <div className="mt-2">
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-300 h-8 w-8 flex-shrink-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Media */}
      {post.media_url && (
        <div className="px-4 pb-3">
          <div className="rounded-2xl overflow-hidden border border-gray-800">
            {post.media_type === 'image' ? (
              <Image
                src={post.media_url}
                alt="Post media"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            ) : (
              <video
                src={post.media_url}
                controls
                className="w-full h-auto"
                preload="metadata"
              />
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-16 py-2 mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 hover:bg-gray-900 text-gray-400 hover:text-white transition-colors rounded-full px-3 py-2"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm">{post.comments_count || 0}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 hover:bg-gray-900 text-gray-400 hover:text-white transition-colors rounded-full px-3 py-2"
        >
          <Share className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn(
            "flex items-center space-x-2 hover:bg-gray-900 transition-colors rounded-full px-3 py-2",
            post.is_liked ? "text-red-500" : "text-gray-400 hover:text-white"
          )}
        >
          <Heart 
            className={cn(
              "h-5 w-5",
              post.is_liked && "fill-current"
            )} 
          />
          <span className="text-sm">{post.likes_count || 0}</span>
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-900">
          <div className="pt-3">
            <p className="text-gray-500 text-sm text-center">
              Comments coming soon...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}