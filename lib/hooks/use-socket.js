import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store'

let socket = null

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect()
        socket = null
      }
      setIsConnected(false)
      return
    }

    // Check if we're in a WebSocket-supported environment
    if (typeof window === 'undefined') return
    
    // For Vercel deployment, Socket.io won't work in serverless
    // This is a graceful fallback
    try {
      const { io } = require('socket.io-client')
      
      if (!socket) {
        const token = localStorage.getItem('auth-token')
        
        socket = io(process.env.NEXT_PUBLIC_APP_URL || window.location.origin, {
          auth: { token },
          transports: ['websocket', 'polling'],
          timeout: 5000
        })

        socket.on('connect', () => {
          console.log('Socket connected')
          setIsConnected(true)
        })

        socket.on('disconnect', () => {
          console.log('Socket disconnected')
          setIsConnected(false)
        })

        socket.on('connect_error', (error) => {
          console.warn('Socket connection failed (expected on Vercel):', error.message)
          setIsConnected(false)
        })

        socket.on('error', (error) => {
          console.warn('Socket error:', error)
        })
      }
    } catch (error) {
      console.warn('Socket.io not available (expected on Vercel):', error.message)
      setIsConnected(false)
    }

    return () => {
      // Don't disconnect here - keep connection alive
    }
  }, [user])

  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}