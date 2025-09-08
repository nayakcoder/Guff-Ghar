import { Server } from 'socket.io'
import { AuthService } from './auth.js'
import { prisma } from './prisma.js'

let io

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
      methods: ["GET", "POST"]
    }
  })

  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '')
      
      if (!token) {
        return next(new Error('Authentication token required'))
      }

      const user = await AuthService.getUserFromToken(token)
      if (!user) {
        return next(new Error('Invalid authentication token'))
      }

      socket.userId = user.id
      socket.user = user
      next()
    } catch (error) {
      next(new Error('Authentication failed'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.username} connected`)
    
    // Join user to their personal room
    socket.join(`user:${socket.userId}`)
    
    // Update user status to online
    updateUserStatus(socket.userId, true)

    // Handle joining chat rooms
    socket.on('join_chat', async (chatId) => {
      try {
        // Verify user is participant in this chat
        const participant = await prisma.chatParticipant.findFirst({
          where: {
            chatId,
            userId: socket.userId,
            leftAt: null,
          },
        })

        if (!participant) {
          socket.emit('error', { message: 'Not authorized for this chat' })
          return
        }

        socket.join(`chat:${chatId}`)
        socket.emit('joined_chat', { chatId })
        
        // Notify others in chat that user is online
        socket.to(`chat:${chatId}`).emit('user_online', {
          userId: socket.userId,
          username: socket.user.username,
        })
      } catch (error) {
        console.error('Join chat error:', error)
        socket.emit('error', { message: 'Failed to join chat' })
      }
    })

    // Handle leaving chat rooms
    socket.on('leave_chat', (chatId) => {
      socket.leave(`chat:${chatId}`)
      socket.to(`chat:${chatId}`).emit('user_offline', {
        userId: socket.userId,
        username: socket.user.username,
      })
    })

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { chatId, content, type = 'TEXT', replyToId } = data

        // Verify user is participant in this chat
        const participant = await prisma.chatParticipant.findFirst({
          where: {
            chatId,
            userId: socket.userId,
            leftAt: null,
          },
        })

        if (!participant) {
          socket.emit('error', { message: 'Not authorized for this chat' })
          return
        }

        // Get other participants
        const otherParticipants = await prisma.chatParticipant.findMany({
          where: {
            chatId,
            userId: { not: socket.userId },
            leftAt: null,
          },
          select: { userId: true },
        })

        if (otherParticipants.length === 0) {
          socket.emit('error', { message: 'No recipients in chat' })
          return
        }

        // Create message in database
        const message = await prisma.message.create({
          data: {
            content,
            type,
            senderId: socket.userId,
            receiverId: otherParticipants[0].userId, // For direct chats
            chatId,
            replyToId,
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
            replyTo: {
              include: {
                sender: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                  },
                },
              },
            },
          },
        })

        // Update chat's updated timestamp
        await prisma.chat.update({
          where: { id: chatId },
          data: { updatedAt: new Date() },
        })

        // Format message
        const formattedMessage = {
          id: message.id,
          content: message.content,
          type: message.type,
          mediaUrl: message.mediaUrl,
          createdAt: message.createdAt,
          sender: message.sender,
          replyTo: message.replyTo,
        }

        // Send to all participants in the chat
        io.to(`chat:${chatId}`).emit('new_message', formattedMessage)

        // Send push notifications to offline users
        for (const participant of otherParticipants) {
          socket.to(`user:${participant.userId}`).emit('notification', {
            type: 'MESSAGE',
            title: `${socket.user.displayName || socket.user.username}`,
            content: content.substring(0, 100),
            chatId,
            senderId: socket.userId,
          })
        }

      } catch (error) {
        console.error('Send message error:', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      socket.to(`chat:${data.chatId}`).emit('user_typing', {
        userId: socket.userId,
        username: socket.user.username,
        chatId: data.chatId,
      })
    })

    socket.on('typing_stop', (data) => {
      socket.to(`chat:${data.chatId}`).emit('user_stopped_typing', {
        userId: socket.userId,
        chatId: data.chatId,
      })
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.user.username} disconnected`)
      updateUserStatus(socket.userId, false)
    })
  })

  return io
}

export function getSocketIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized')
  }
  return io
}

// Helper function to update user online status
async function updateUserStatus(userId, isOnline) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastActive: new Date() },
    })
  } catch (error) {
    console.error('Update user status error:', error)
  }
}