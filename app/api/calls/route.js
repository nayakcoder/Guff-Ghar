import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

// Create a video call room
export async function POST(request) {
  return withAuth(async (req, res) => {
    try {
      const { participants, type = 'VIDEO' } = await req.json()

      if (!participants || participants.length === 0) {
        return NextResponse.json(
          { error: 'Participants are required' },
          { status: 400 }
        )
      }

      // Verify all participants exist
      const users = await prisma.user.findMany({
        where: {
          id: { in: [...participants, req.user.id] }
        }
      })

      if (users.length !== participants.length + 1) {
        return NextResponse.json(
          { error: 'Some participants not found' },
          { status: 404 }
        )
      }

      // Create call room
      const roomId = uuidv4()
      const call = await prisma.call.create({
        data: {
          roomId,
          type,
          initiatorId: req.user.id,
          status: 'INITIATED',
          participants: {
            create: [
              ...participants.map(userId => ({
                userId,
                status: 'INVITED'
              })),
              {
                userId: req.user.id,
                status: 'JOINED'
              }
            ]
          }
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true
                }
              }
            }
          },
          initiator: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        call
      })

    } catch (error) {
      console.error('Create call error:', error)
      return NextResponse.json(
        { error: 'Failed to create call' },
        { status: 500 }
      )
    }
  })(request)
}

// Join a call
export async function PUT(request) {
  return withAuth(async (req, res) => {
    try {
      const { roomId, action } = await req.json() // action: 'join' | 'leave' | 'accept' | 'reject'

      if (!roomId || !action) {
        return NextResponse.json(
          { error: 'Room ID and action are required' },
          { status: 400 }
        )
      }

      // Find the call
      const call = await prisma.call.findUnique({
        where: { roomId },
        include: {
          participants: true
        }
      })

      if (!call) {
        return NextResponse.json(
          { error: 'Call not found' },
          { status: 404 }
        )
      }

      // Check if user is a participant
      const participant = call.participants.find(p => p.userId === req.user.id)
      
      if (!participant) {
        return NextResponse.json(
          { error: 'Not authorized for this call' },
          { status: 403 }
        )
      }

      let updateData = {}
      let callUpdateData = {}

      switch (action) {
        case 'join':
        case 'accept':
          updateData.status = 'JOINED'
          updateData.joinedAt = new Date()
          if (call.status === 'INITIATED') {
            callUpdateData.status = 'ACTIVE'
            callUpdateData.startedAt = new Date()
          }
          break
        
        case 'leave':
          updateData.status = 'LEFT'
          updateData.leftAt = new Date()
          break
        
        case 'reject':
          updateData.status = 'REJECTED'
          break
        
        default:
          return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
          )
      }

      // Update participant status
      await prisma.callParticipant.update({
        where: { id: participant.id },
        data: updateData
      })

      // Update call status if needed
      if (Object.keys(callUpdateData).length > 0) {
        await prisma.call.update({
          where: { id: call.id },
          data: callUpdateData
        })
      }

      // Check if call should be ended (all participants left)
      if (action === 'leave') {
        const activeParticipants = await prisma.callParticipant.count({
          where: {
            callId: call.id,
            status: 'JOINED'
          }
        })

        if (activeParticipants === 0) {
          await prisma.call.update({
            where: { id: call.id },
            data: {
              status: 'ENDED',
              endedAt: new Date()
            }
          })
        }
      }

      return NextResponse.json({
        success: true,
        message: `Successfully ${action}ed call`
      })

    } catch (error) {
      console.error('Call action error:', error)
      return NextResponse.json(
        { error: 'Failed to perform call action' },
        { status: 500 }
      )
    }
  })(request)
}

// Get call details
export async function GET(request) {
  return withAuth(async (req, res) => {
    try {
      const { searchParams } = new URL(req.url)
      const roomId = searchParams.get('roomId')

      if (!roomId) {
        return NextResponse.json(
          { error: 'Room ID is required' },
          { status: 400 }
        )
      }

      const call = await prisma.call.findUnique({
        where: { roomId },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true
                }
              }
            }
          },
          initiator: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true
            }
          }
        }
      })

      if (!call) {
        return NextResponse.json(
          { error: 'Call not found' },
          { status: 404 }
        )
      }

      // Check if user is authorized
      const isParticipant = call.participants.some(p => p.userId === req.user.id)
      
      if (!isParticipant) {
        return NextResponse.json(
          { error: 'Not authorized for this call' },
          { status: 403 }
        )
      }

      return NextResponse.json({
        success: true,
        call
      })

    } catch (error) {
      console.error('Get call error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch call details' },
        { status: 500 }
      )
    }
  })(request)
}