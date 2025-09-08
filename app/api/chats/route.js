import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'
import { z } from 'zod'

const createChatSchema = z.object({
  participantId: z.string(),
  isGroup: z.boolean().default(false),
  name: z.string().optional(),
})

export async function GET(request) {
  return withAuth(async (req, res) => {
    try {
      const chats = await prisma.chat.findMany({
        where: {
          participants: {
            some: {
              userId: req.user.id,
              leftAt: null,
            },
          },
        },
        include: {
          participants: {
            where: {
              leftAt: null,
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true,
                  lastActive: true,
                },
              },
            },
          },
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
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
          _count: {
            select: {
              messages: {
                where: {
                  receiverId: req.user.id,
                  readAt: null,
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })

      // Format response
      const formattedChats = chats.map(chat => {
        const otherParticipants = chat.participants.filter(
          p => p.userId !== req.user.id
        )
        const lastMessage = chat.messages[0] || null

        return {
          id: chat.id,
          name: chat.name,
          isGroup: chat.isGroup,
          participants: otherParticipants.map(p => p.user),
          lastMessage: lastMessage ? {
            id: lastMessage.id,
            content: lastMessage.content,
            type: lastMessage.type,
            createdAt: lastMessage.createdAt,
            sender: lastMessage.sender,
          } : null,
          unreadCount: chat._count.messages,
          updatedAt: chat.updatedAt,
        }
      })

      return NextResponse.json(formattedChats)
    } catch (error) {
      console.error('Get chats error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch chats' },
        { status: 500 }
      )
    }
  })(request)
}

export async function POST(request) {
  return withAuth(async (req, res) => {
    try {
      const body = await req.json()
      const validatedData = createChatSchema.parse(body)
      
      // Check if direct chat already exists
      if (!validatedData.isGroup) {
        const existingChat = await prisma.chat.findFirst({
          where: {
            isGroup: false,
            participants: {
              every: {
                userId: {
                  in: [req.user.id, validatedData.participantId],
                },
              },
            },
          },
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        })

        if (existingChat) {
          return NextResponse.json({
            id: existingChat.id,
            participants: existingChat.participants.map(p => p.user),
            isGroup: false,
          })
        }
      }

      // Create new chat
      const chat = await prisma.chat.create({
        data: {
          name: validatedData.name,
          isGroup: validatedData.isGroup,
          participants: {
            create: [
              {
                userId: req.user.id,
                isAdmin: true,
              },
              {
                userId: validatedData.participantId,
                isAdmin: false,
              },
            ],
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      })

      return NextResponse.json({
        id: chat.id,
        name: chat.name,
        isGroup: chat.isGroup,
        participants: chat.participants.map(p => p.user),
      }, { status: 201 })
    } catch (error) {
      console.error('Create chat error:', error)
      
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid input', details: error.errors },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to create chat' },
        { status: 500 }
      )
    }
  })(request)
}