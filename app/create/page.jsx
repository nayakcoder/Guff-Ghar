'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/main-layout'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCreatePost } from '@/lib/hooks/use-posts'
import { useAuthStore } from '@/lib/store'
import { useToast } from '@/components/ui/toaster'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Image, Smile, Hash } from 'lucide-react'

export default function CreatePage() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const user = useAuthStore((state) => state.user)
  const createPostMutation = useCreatePost()
  const { toast } = useToast()
  const router = useRouter()

  if (!user) {
    router.push('/auth')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Please write something to post',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      await createPostMutation.mutateAsync({
        content: content.trim(),
        user_id: user.id,
      })

      toast({
        title: 'Success',
        description: 'Your post has been shared!',
      })

      setContent('')
      router.push('/feed')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <MainLayout>
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-lg border-b border-gray-900 px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-white text-xl font-bold">Create Post</h1>
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || isLoading}
                className="bg-green-500 hover:bg-green-600 text-white px-6 rounded-full"
              >
                {isLoading ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>

          {/* Create Post Form */}
          <div className="p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's happening?"
                  className="min-h-[120px] bg-black border-gray-800 text-white placeholder-gray-500 resize-none text-lg"
                  maxLength={280}
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-green-400"
                    >
                      <Image className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-green-400"
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-green-400"
                    >
                      <Hash className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <span className={`text-sm ${content.length > 250 ? 'text-red-400' : 'text-gray-400'}`}>
                    {content.length}/280
                  </span>
                </div>
              </form>
            </div>

            {/* Post Guidelines */}
            <div className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <h3 className="text-white font-semibold mb-3">Posting Guidelines</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>• Be respectful and kind to others</li>
                <li>• Keep your posts relevant and engaging</li>
                <li>• Avoid spam and duplicate content</li>
                <li>• Use hashtags to reach more people</li>
              </ul>
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  )
}