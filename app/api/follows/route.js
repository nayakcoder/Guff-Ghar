import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Follow a user
export async function POST(request) {
  return withAuth(async (req, res) => {
    try {
      const { userId } = await req.json()

      if (!userId) {
        return NextResponse.json(
          { error: 'User ID is required' },
          { status: 400 }
        )
      }

      if (userId === req.user.id) {
        return NextResponse.json(
          { error: 'Cannot follow yourself' },
          { status: 400 }
        )
      }

      // Check if user exists
      const targetUser = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!targetUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Check if already following
      const existingFollow = await prisma.follow.findFirst({
        where: {
          followerId: req.user.id,
          followingId: userId
        }
      })

      if (existingFollow) {
        return NextResponse.json(
          { error: 'Already following this user' },
          { status: 400 }
        )
      }

      // Create follow relationship
      await prisma.follow.create({
        data: {
          followerId: req.user.id,
          followingId: userId
        }
      })

      // Update follower counts
      await prisma.$transaction([
        prisma.user.update({
          where: { id: req.user.id },
          data: { followingCount: { increment: 1 } }
        }),
        prisma.user.update({
          where: { id: userId },
          data: { followersCount: { increment: 1 } }
        })
      ])

      return NextResponse.json({
        success: true,
        message: 'Successfully followed user'
      })

    } catch (error) {
      console.error('Follow error:', error)
      return NextResponse.json(
        { error: 'Failed to follow user' },
        { status: 500 }
      )
    }
  })(request)
}

// Unfollow a user
export async function DELETE(request) {
  return withAuth(async (req, res) => {
    try {
      const { searchParams } = new URL(req.url)
      const userId = searchParams.get('userId')

      if (!userId) {
        return NextResponse.json(
          { error: 'User ID is required' },
          { status: 400 }
        )
      }

      // Find and delete follow relationship
      const follow = await prisma.follow.findFirst({
        where: {
          followerId: req.user.id,
          followingId: userId
        }
      })

      if (!follow) {
        return NextResponse.json(
          { error: 'Not following this user' },
          { status: 400 }
        )
      }

      await prisma.follow.delete({
        where: { id: follow.id }
      })

      // Update follower counts
      await prisma.$transaction([
        prisma.user.update({
          where: { id: req.user.id },
          data: { followingCount: { decrement: 1 } }
        }),
        prisma.user.update({
          where: { id: userId },
          data: { followersCount: { decrement: 1 } }
        })
      ])

      return NextResponse.json({
        success: true,
        message: 'Successfully unfollowed user'
      })

    } catch (error) {
      console.error('Unfollow error:', error)
      return NextResponse.json(
        { error: 'Failed to unfollow user' },
        { status: 500 }
      )
    }
  })(request)
}

// Get followers/following list
export async function GET(request) {
  return withAuth(async (req, res) => {
    try {
      const { searchParams } = new URL(req.url)
      const userId = searchParams.get('userId') || req.user.id
      const type = searchParams.get('type') || 'followers' // followers or following
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')
      const skip = (page - 1) * limit

      let follows
      
      if (type === 'followers') {
        follows = await prisma.follow.findMany({
          where: { followingId: userId },
          include: {
            follower: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
                bio: true,
                verified: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        })
      } else {
        follows = await prisma.follow.findMany({
          where: { followerId: userId },
          include: {
            following: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
                bio: true,
                verified: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        })
      }

      const users = follows.map(follow => 
        type === 'followers' ? follow.follower : follow.following
      )

      const total = await prisma.follow.count({
        where: type === 'followers' 
          ? { followingId: userId }
          : { followerId: userId }
      })

      return NextResponse.json({
        users,
        total,
        page,
        limit,
        hasMore: skip + limit < total
      })

    } catch (error) {
      console.error('Get follows error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch follows' },
        { status: 500 }
      )
    }
  })(request)
}