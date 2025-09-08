const { createServer } = require('http')
const next = require('next')
const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = process.env.PORT || 3000
const socketPort = process.env.SOCKET_IO_PORT || 3001

// Initialize Next.js
const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

const prisma = new PrismaClient()

// Socket.io authentication middleware
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token
    
    if (!token) {
      throw new Error('No token provided')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    socket.userId = user.id
    socket.user = user
    next()
  } catch (error) {
    console.error('Socket authentication error:', error)
    next(new Error('Authentication failed'))
  }
}

app.prepare().then(() => {
  // Create HTTP server
  const server = createServer((req, res) => {
    return handler(req, res)
  })

  // Create Socket.io server
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })

  // Socket.io middleware
  io.use(authenticateSocket)

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log(`User ${socket.user.username} connected`)

    // Join user to their personal room
    socket.join(`user:${socket.userId}`)

    // Handle joining chat rooms
    socket.on('join-chat', async (chatId) => {
      try {
        // Verify user is participant in this chat
        const participant = await prisma.chatParticipant.findFirst({
          where: {
            chatId,
            userId: socket.userId,
            leftAt: null
          }
        })

        if (participant) {
          socket.join(`chat:${chatId}`)
          console.log(`User ${socket.user.username} joined chat ${chatId}`)
        }
      } catch (error) {
        console.error('Join chat error:', error)
      }
    })

    // Handle leaving chat rooms
    socket.on('leave-chat', (chatId) => {
      socket.leave(`chat:${chatId}`)
      console.log(`User ${socket.user.username} left chat ${chatId}`)
    })

    // Handle sending messages
    socket.on('send-message', async (data) => {
      try {
        const { chatId, content, type = 'TEXT', replyToId, mediaUrl } = data

        // Verify user is participant
        const participant = await prisma.chatParticipant.findFirst({
          where: {
            chatId,
            userId: socket.userId,
            leftAt: null
          }
        })

        if (!participant) {
          socket.emit('error', 'Not authorized for this chat')
          return
        }

        // Create message in database
        const message = await prisma.message.create({
          data: {
            content,
            type,
            chatId,
            senderId: socket.userId,
            replyToId,
            mediaUrl
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
              }
            },
            replyTo: {
              include: {
                sender: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true
                  }
                }
              }
            }
          }
        })

        // Update chat last message
        await prisma.chat.update({
          where: { id: chatId },
          data: {
            lastMessageId: message.id,
            updatedAt: new Date()
          }
        })

        // Emit message to chat room
        io.to(`chat:${chatId}`).emit('new-message', message)

        // Send push notification to offline users
        const chatParticipants = await prisma.chatParticipant.findMany({
          where: {
            chatId,
            userId: { not: socket.userId },
            leftAt: null
          },
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        })

        // Notify participants who are not online
        chatParticipants.forEach(participant => {
          const userSockets = io.sockets.adapter.rooms.get(`user:${participant.userId}`)
          if (!userSockets || userSockets.size === 0) {
            // User is offline, could send push notification here
            console.log(`Offline notification needed for ${participant.user.username}`)
          }
        })

      } catch (error) {
        console.error('Send message error:', error)
        socket.emit('error', 'Failed to send message')
      }
    })

    // Handle typing indicators
    socket.on('typing-start', (chatId) => {
      socket.to(`chat:${chatId}`).emit('user-typing', {
        userId: socket.userId,
        username: socket.user.username,
        typing: true
      })
    })

    socket.on('typing-stop', (chatId) => {
      socket.to(`chat:${chatId}`).emit('user-typing', {
        userId: socket.userId,
        username: socket.user.username,
        typing: false
      })
    })

    // Handle video call signaling
    socket.on('call-invite', async (data) => {
      const { roomId, participants } = data
      
      participants.forEach(userId => {
        socket.to(`user:${userId}`).emit('call-invitation', {
          roomId,
          caller: socket.user,
          type: data.type || 'VIDEO'
        })
      })
    })

    socket.on('call-answer', (data) => {
      const { roomId, answer } = data
      socket.to(`call:${roomId}`).emit('call-answered', {
        userId: socket.userId,
        answer
      })
    })

    socket.on('call-reject', (data) => {
      const { roomId } = data
      socket.to(`call:${roomId}`).emit('call-rejected', {
        userId: socket.userId
      })
    })

    socket.on('call-end', (data) => {
      const { roomId } = data
      socket.to(`call:${roomId}`).emit('call-ended', {
        userId: socket.userId
      })
    })

    // WebRTC signaling
    socket.on('webrtc-offer', (data) => {
      const { roomId, offer, target } = data
      socket.to(`user:${target}`).emit('webrtc-offer', {
        offer,
        sender: socket.userId
      })
    })

    socket.on('webrtc-answer', (data) => {
      const { answer, target } = data
      socket.to(`user:${target}`).emit('webrtc-answer', {
        answer,
        sender: socket.userId
      })
    })

    socket.on('webrtc-ice-candidate', (data) => {
      const { candidate, target } = data
      socket.to(`user:${target}`).emit('webrtc-ice-candidate', {
        candidate,
        sender: socket.userId
      })
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.username} disconnected`)
    })
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
    console.log(`> Socket.io server running on port ${port}`)
  })
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully')
  await prisma.$disconnect()
  process.exit(0)
})