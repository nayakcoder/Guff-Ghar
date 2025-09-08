'use client'

import { MessageCircle, UserMinus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useFriendsQuery } from '@/lib/hooks/use-friends'
import { EmptyState } from '@/components/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { useUIStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import Link from 'next/link'

export function FriendsList() {
  const language = useUIStore((state) => state.language)
  const t = translations[language]
  
  const { data: friends, isLoading, error } = useFriendsQuery()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <FriendSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        title={t.error}
        description="Failed to load friends"
        action={{ label: t.retry, onClick: () => retryQuery(['friends']) }}
      />
    )
  }

  if (!friends || friends.length === 0) {
    return (
      <EmptyState
        title={t.no_friends}
        description="Start connecting with people to build your network"
      />
    )
  }

  return (
    <div className="space-y-4">
      {friends.map((friend) => (
        <Card key={friend.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Link href={`/profile/${friend.id}`}>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={friend.avatar_url} alt={friend.username} />
                  <AvatarFallback>
                    {friend.username?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              
              <div>
                <Link 
                  href={`/profile/${friend.id}`}
                  className="font-semibold hover:underline"
                >
                  {friend.display_name || friend.username}
                </Link>
                <p className="text-sm text-muted-foreground">
                  @{friend.username}
                </p>
                {friend.bio && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {friend.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link href={`/chat/${friend.id}`}>
                <Button size="sm" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {t.send_message}
                </Button>
              </Link>
              
              <Button size="sm" variant="outline">
                <UserMinus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function FriendSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-3 w-[80px]" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-[100px]" />
          <Skeleton className="h-8 w-8" />
        </div>
      </CardContent>
    </Card>
  )
}