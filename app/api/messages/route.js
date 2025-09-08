import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import { z } from 'zod'

const sendMessageSchema = z.object({
  chatId: z.string(),
  content: z.string().min(1),
  type: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE']).default('TEXT'),
  mediaUrl: z.string().url().optional(),
  replyToId: z.string().optional(),
})

export async function GET(request) {
  return withAuth(async (req, res) => {
    try {
      const { searchParams } = new URL(req.url)
      const chatId = searchParams.get('chat_id')
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '50')
      const skip = (page - 1) * limit

      if (!chatId) {
        return NextResponse.json(
          { error: 'Chat ID is required' },
          { status: 400 }
        )
      }

      // Verify user is participant in this chat
      const participant = await prisma.chatParticipant.findFirst({
        where: {
          chatId,
          userId: req.user.id,
          leftAt: null,
        },
      })

      if (!participant) {
        return NextResponse.json(
          { error: 'Not authorized for this chat' },
          { status: 403 }
        )
      }

      // Get messages
      const messages = await prisma.message.findMany({
        where: {
          chatId,
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
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      })

      const total = await prisma.message.count({
        where: { chatId },
      })

      // Mark messages as read
      await prisma.message.updateMany({
        where: {
          chatId,
          receiverId: req.user.id,
          readAt: null,
        },
        data: {
          readAt: new Date(),
        },
      })

      return NextResponse.json({
        messages: messages.reverse(), // Reverse to show oldest first
        total,
        page,
        limit,
      })
    } catch (error) {
      console.error('Get messages error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch messages' },
        { status: 500 }
      )
    }
  })(request)
}

export async function POST(request) {
  return withAuth(async (req, res) => {
    try {
      const body = await req.json()
      const validatedData = sendMessageSchema.parse(body)
      
      // Verify user is participant in this chat
      const participant = await prisma.chatParticipant.findFirst({
        where: {
          chatId: validatedData.chatId,
          userId: req.user.id,
          leftAt: null,
        },
      })

      if (!participant) {
        return NextResponse.json(
          { error: 'Not authorized for this chat' },
          { status: 403 }
        )
      }

      // Get other participants
      const otherParticipants = await prisma.chatParticipant.findMany({
        where: {
          chatId: validatedData.chatId,
          userId: { not: req.user.id },
          leftAt: null,
        },
        select: { userId: true },
      })

      if (otherParticipants.length === 0) {
        return NextResponse.json(
          { error: 'No recipients in chat' },
          { status: 400 }
        )
      }

      // Create message
      const message = await prisma.message.create({
        data: {
          ...validatedData,
          senderId: req.user.id,
          receiverId: otherParticipants[0].userId, // For direct chats
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
        where: { id: validatedData.chatId },
        data: { updatedAt: new Date() },
      })

      return NextResponse.json(message, { status: 201 })
    } catch (error) {
      console.error('Send message error:', error)
      
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid input', details: error.errors },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      )
    }
  })(request)
}