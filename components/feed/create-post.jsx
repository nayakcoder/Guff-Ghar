'use client'

import { useState, useRef } from 'react'
import { Image, Video, Smile, Send, Camera, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { useCreatePost } from '@/lib/hooks/use-posts'
import { useAuthStore, useUIStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { useToast } from '@/components/ui/toaster'

export function CreatePost() {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const fileInputRef = useRef(null)
  
  const user = useAuthStore((state) => state.user)
  const language = useUIStore((state) => state.language)
  const t = translations[language]
  const { toast } = useToast()
  
  const createPostMutation = useCreatePost()

  const handleFileSelect = (type) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : 'video/*'
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    const newFiles = [...selectedFiles, ...files].slice(0, 4) // Max 4 files
    setSelectedFiles(newFiles)

    // Create previews
    const newPreviews = files.map(file => {
      const url = URL.createObjectURL(file)
      return {
        file,
        url,
        type: file.type.startsWith('image/') ? 'image' : 'video'
      }
    })
    
    setPreviews([...previews, ...newPreviews].slice(0, 4))
  }

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    
    // Revoke object URL to prevent memory leaks
    if (previews[index]) {
      URL.revokeObjectURL(previews[index].url)
    }
    
    setSelectedFiles(newFiles)
    setPreviews(newPreviews)
  }

  const uploadFiles = async () => {
    const uploadPromises = selectedFiles.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', file.type.startsWith('image/') ? 'image' : 'video')
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const result = await response.json()
      return result.data
    })
    
    return Promise.all(uploadPromises)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if ((!content.trim() && selectedFiles.length === 0) || !user) return

    setIsSubmitting(true)
    try {
      let mediaUrls = []
      
      // Upload files if any
      if (selectedFiles.length > 0) {
        const uploadResults = await uploadFiles()
        mediaUrls = uploadResults.map(result => ({
          url: result.url,
          type: result.format === 'mp4' ? 'video' : 'image'
        }))
      }
      
      await createPostMutation.mutateAsync({
        content: content.trim(),
        user_id: user.id,
        media: mediaUrls
      })
      
      // Reset form
      setContent('')
      setSelectedFiles([])
      setPreviews([])
      
      toast({
        title: 'Success',
        description: 'Post created successfully!',
      })
    } catch (error) {
      console.error('Post creation error:', error)
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 mx-4">
        <p className="text-center text-gray-400">
          Please log in to create posts
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 mx-4">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-gray-700">
            <AvatarImage src={user.avatar_url} alt={user.username} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {user.username?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What's happening?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[60px] resize-none border-none bg-transparent text-white placeholder-gray-400 focus-visible:ring-0 p-0 text-base"
              maxLength={500}
            />
            
            {/* File Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    {preview.type === 'image' ? (
                      <img
                        src={preview.url}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={preview.url}
                        className="w-full h-32 object-cover rounded-lg"
                        controls={false}
                      />
                    )}
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                />
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 h-8 w-8 rounded-full"
                  onClick={() => handleFileSelect('image')}
                  disabled={selectedFiles.length >= 4}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 h-8 w-8 rounded-full"
                  onClick={() => handleFileSelect('image')}
                  disabled={selectedFiles.length >= 4}
                >
                  <Image className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 h-8 w-8 rounded-full"
                  onClick={() => handleFileSelect('video')}
                  disabled={selectedFiles.length >= 4}
                >
                  <Video className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 h-8 w-8 rounded-full"
                  disabled
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500">
                  {content.length}/500
                </span>
                {selectedFiles.length > 0 && (
                  <span className="text-xs text-blue-400">
                    {selectedFiles.length}/4 files
                  </span>
                )}
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={(!content.trim() && selectedFiles.length === 0) || isSubmitting}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-2 font-medium transition-all duration-200"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}