'use client'

import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useFriendRequestsQuery, useRespondToFriendRequest } from '@/lib/hooks/use-friends'
import { EmptyState } from '@/components/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { useUIStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { useToast } from '@/components/ui/toaster'
import Link from 'next/link'

export function FriendRequests() {
  const language = useUIStore((state) => state.language)
  const t = translations[language]
  const { toast } = useToast()
  
  const { data: requests, isLoading, error } = useFriendRequestsQuery()
  const respondMutation = useRespondToFriendRequest()

  const handleRespond = async (requestId, action) => {
    try {
      await respondMutation.mutateAsync({ requestId, action })
      toast({
        title: 'Success',
        description: action === 'accept' ? 'Friend request accepted!' : 'Friend request declined',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to respond to friend request',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <RequestSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        title={t.error}
        description="Failed to load friend requests"
        action={{ label: t.retry, onClick: () => window.location.reload() }}
      />
    )
  }

  if (!requests || requests.length === 0) {
    return (
      <EmptyState
        title="No friend requests"
        description="You don't have any pending friend requests"
      />
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Link href={`/profile/${request.sender.id}`}>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={request.sender.avatar_url} alt={request.sender.username} />
                  <AvatarFallback>
                    {request.sender.username?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              
              <div>
                <Link 
                  href={`/profile/${request.sender.id}`}
                  className="font-semibold hover:underline"
                >
                  {request.sender.display_name || request.sender.username}
                </Link>
                <p className="text-sm text-muted-foreground">
                  @{request.sender.username}
                </p>
                <p className="text-sm text-muted-foreground">
                  Wants to be your friend
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={() => handleRespond(request.id, 'accept')}
                disabled={respondMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Accept
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRespond(request.id, 'reject')}
                disabled={respondMutation.isPending}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function RequestSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-3 w-[80px]" />
            <Skeleton className="h-3 w-[140px]" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-[80px]" />
          <Skeleton className="h-8 w-[80px]" />
        </div>
      </CardContent>
    </Card>
  )
}