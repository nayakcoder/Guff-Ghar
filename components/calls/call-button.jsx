'use client'

import { useState } from 'react'
import { Phone, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toaster'
import { useUIStore } from '@/lib/store'
import { translations } from '@/lib/i18n'

export function CallButton({ userId, type = 'audio' }) {
  const [isCalling, setIsCalling] = useState(false)
  
  const language = useUIStore((state) => state.language)
  const t = translations[language]
  const { toast } = useToast()

  const handleCall = async () => {
    if (!userId) return

    setIsCalling(true)
    
    try {
      // Mock call functionality - in real app, integrate with WebRTC
      toast({
        title: 'Call Feature',
        description: `${type === 'video' ? 'Video' : 'Audio'} calling will be available soon!`,
      })
      
      // Simulate call duration
      setTimeout(() => {
        setIsCalling(false)
      }, 2000)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to initiate call',
        variant: 'destructive',
      })
      setIsCalling(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCall}
      disabled={isCalling}
      aria-label={type === 'video' ? t.video_call : t.call}
    >
      {type === 'video' ? (
        <Video className="h-4 w-4" />
      ) : (
        <Phone className="h-4 w-4" />
      )}
    </Button>
  )
}