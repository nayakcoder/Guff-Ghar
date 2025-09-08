'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Phone, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/lib/store'
import { useSocket } from '@/lib/hooks/use-socket'

export function ChatWindow({ chat, onClose }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)
  
  const user = useAuthStore((state) => state.user)
  const socket = useSocket()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!socket || !chat) {
      // Fallback: fetch messages via API polling if no socket
      if (!socket && chat) {
        fetchMessages()
        // Set up polling as fallback
        const interval = setInterval(fetchMessages, 5000)
        return () => clearInterval(interval)
      }
      return
    }

    socket.emit('join-chat', chat.id)
    fetchMessages()

    socket.on('new-message', (newMessage) => {
      setMessages(prev => [...prev, newMessage])
    })

    return () => {
      socket.emit('leave-chat', chat.id)
      socket.off('new-message')
    }
  }, [socket, chat])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?chat_id=${chat.id}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const messageData = {
      chatId: chat.id,
      content: message.trim(),
      type: 'TEXT'
    }

    // Try socket first, fallback to API
    if (socket) {
      socket.emit('send-message', messageData)
    }
    
    // Always send to API for persistence
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      })
      
      if (response.ok && !socket) {
        // If no socket, manually add message to UI
        const newMessage = await response.json()
        setMessages(prev => [...prev, newMessage.message])
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }

    setMessage('')
  }

  if (!chat) return null

  const otherParticipants = chat.participants?.filter(p => p.userId !== user.id) || []
  const chatTitle = chat.name || otherParticipants.map(p => p.user?.displayName || p.user?.username).join(', ')

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={otherParticipants[0]?.user?.avatarUrl} />
            <AvatarFallback>{chatTitle?.charAt(0)}</AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-white text-sm">{chatTitle}</h3>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            ✕
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isOwn = msg.senderId === user.id
          return (
            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-3 py-2 max-w-xs ${
                isOwn ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'
              }`}>
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 border-gray-600 text-white"
          />
          <Button type="submit" size="icon" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}