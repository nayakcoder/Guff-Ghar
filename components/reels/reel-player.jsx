'use client'

import { useState, useRef } from 'react'
import { Heart, MessageCircle, Share, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLikeReel } from '@/lib/hooks/use-reels'
import { useUIStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function ReelPlayer({ reel }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef(null)
  
  const language = useUIStore((state) => state.language)
  const t = translations[language]
  
  const likeReelMutation = useLikeReel()

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleLike = () => {
    likeReelMutation.mutate(reel.id)
  }

  return (
    <Card className="relative overflow-hidden aspect-[9/16] bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.video_url}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Overlay Controls */}
      <div className="absolute inset-0 flex">
        {/* Main tap area for play/pause */}
        <div 
          className="flex-1 flex items-center justify-center"
          onClick={handlePlayPause}
        >
          {!isPlaying && (
            <div className="bg-black/50 rounded-full p-4">
              <Play className="h-8 w-8 text-white fill-white ml-1" />
            </div>
          )}
        </div>

        {/* Right sidebar with actions */}
        <div className="absolute right-4 bottom-20 flex flex-col space-y-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            className={cn(
              "bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12",
              reel.is_liked && "text-red-500"
            )}
          >
            <Heart 
              className={cn(
                "h-6 w-6",
                reel.is_liked && "fill-current"
              )} 
            />
          </Button>
          <span className="text-white text-sm text-center font-medium">
            {reel.likes_count || 0}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          <span className="text-white text-sm text-center font-medium">
            {reel.comments_count || 0}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12"
          >
            <Share className="h-6 w-6" />
          </Button>
        </div>

        {/* Top controls */}
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMute}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-4 left-4 right-16 text-white">
          <div className="flex items-center space-x-3 mb-3">
            <Link href={`/profile/${reel.author?.id}`}>
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage src={reel.author?.avatar_url} alt={reel.author?.username} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {reel.author?.username?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
            
            <div>
              <Link 
                href={`/profile/${reel.author?.id}`}
                className="font-semibold hover:underline"
              >
                @{reel.author?.username}
              </Link>
              <p className="text-sm text-white/80">
                {reel.author?.display_name}
              </p>
            </div>
          </div>

          {reel.caption && (
            <p className="text-sm leading-relaxed mb-2">
              {reel.caption}
            </p>
          )}

          {reel.hashtags && reel.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {reel.hashtags.map((tag) => (
                <span key={tag} className="text-sm text-blue-300">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}