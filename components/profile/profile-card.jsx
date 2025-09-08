'use client'

import { useState } from 'react'
import { MessageCircle, UserPlus, UserCheck, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSendFriendRequest } from '@/lib/hooks/use-friends'
import { useAuthStore, useUIStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { useToast } from '@/components/ui/toaster'
import Link from 'next/link'

export function ProfileCard({ user }) {
  const [isFollowing, setIsFollowing] = useState(user.is_following || false)
  
  const currentUser = useAuthStore((state) => state.user)
  const language = useUIStore((state) => state.language)
  const t = translations[language]
  const { toast } = useToast()
  
  const sendFriendRequestMutation = useSendFriendRequest()

  const isOwnProfile = currentUser?.id === user.id

  const handleFriendRequest = async () => {
    try {
      await sendFriendRequestMutation.mutateAsync(user.id)
      toast({
        title: 'Success',
        description: 'Friend request sent!',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send friend request',
        variant: 'destructive',
      })
    }
  }

  const handleFollow = () => {
    // Mock follow functionality
    setIsFollowing(!isFollowing)
    toast({
      title: 'Success',
      description: isFollowing ? 'Unfollowed user' : 'Following user',
    })
  }

  return (
    <div className="relative bg-black border-t border-gray-900">
      {/* Mountain Background Header */}
      <div 
        className="h-48 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 relative overflow-hidden"
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 200"><path d="M0,200 L200,100 L400,150 L600,80 L800,120 L1000,60 L1000,200 Z" fill="%23374151" opacity="0.8"/><path d="M0,200 L150,120 L350,170 L550,100 L750,140 L1000,80 L1000,200 Z" fill="%23475569" opacity="0.6"/></svg>')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
      
      {/* Profile Content */}
      <div className="relative px-4 pb-6">
        {/* Avatar positioned over the mountain */}
        <div className="-mt-16 mb-4">
          <Avatar className="h-24 w-24 border-4 border-black">
            <AvatarImage src={user.avatar_url} alt={user.username} />
            <AvatarFallback className="text-2xl bg-gray-800 text-white">
              {user.username?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">
                {user.display_name || user.username}
              </h1>
              <p className="text-gray-400 text-sm">@{user.username}</p>
            </div>
            
            {!isOwnProfile && (
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>

          {user.bio && (
            <p className="text-gray-300 text-sm leading-relaxed">{user.bio}</p>
          )}

          <div className="flex items-center space-x-6 text-sm">
            <span className="text-gray-400">
              <strong className="text-white">{user.posts_count || 0}</strong> {t.posts}
            </span>
            <span className="text-gray-400">
              <strong className="text-white">{user.followers_count || 0}</strong> {t.followers}
            </span>
            <span className="text-gray-400">
              <strong className="text-white">{user.following_count || 0}</strong> {t.following}
            </span>
          </div>

          {!isOwnProfile && currentUser && (
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleFollow}
                className={`px-6 py-2 rounded-full font-medium ${
                  isFollowing 
                    ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    <span>{t.unfollow}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    <span>{t.follow}</span>
                  </>
                )}
              </Button>

              <Link href={`/chat/${user.id}`}>
                <Button className="px-6 py-2 rounded-full font-medium bg-gray-800 text-white border border-gray-600 hover:bg-gray-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span>{t.send_message}</span>
                </Button>
              </Link>
            </div>
          )}

          {isOwnProfile && (
            <div className="flex items-center space-x-3">
              <Button className="px-6 py-2 rounded-full font-medium bg-gray-800 text-white border border-gray-600 hover:bg-gray-700">
                Edit Profile
              </Button>
              <Button className="px-6 py-2 rounded-full font-medium bg-gray-800 text-white border border-gray-600 hover:bg-gray-700">
                {t.settings}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}