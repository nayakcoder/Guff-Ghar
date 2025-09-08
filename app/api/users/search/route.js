import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering for Vercel deployment
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Search users endpoint
export async function GET(request) {
  return withAuth(async (req, res) => {
    try {
      const { searchParams } = new URL(req.url)
      const query = searchParams.get('q')
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')
      const skip = (page - 1) * limit

      if (!query || query.trim().length === 0) {
        return NextResponse.json(
          { error: 'Search query is required' },
          { status: 400 }
        )
      }

      const searchQuery = query.trim()

      // Search users by username, display name, or bio
      const users = await prisma.user.findMany({
        where: {
          AND: [
            { id: { not: req.user.id } }, // Exclude current user
            {
              OR: [
                {
                  username: {
                    contains: searchQuery,
                    mode: 'insensitive'
                  }
                },
                {
                  displayName: {
                    contains: searchQuery,
                    mode: 'insensitive'
                  }
                },
                {
                  bio: {
                    contains: searchQuery,
                    mode: 'insensitive'
                  }
                }
              ]
            }
          ]
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
          verified: true,
          followersCount: true,
          followingCount: true,
          postsCount: true,
          createdAt: true
        },
        orderBy: [
          { verified: 'desc' }, // Verified users first
          { followersCount: 'desc' }, // Popular users next
          { createdAt: 'desc' } // Newest users last
        ],
        skip,
        take: limit
      })

      // Check which users the current user is following
      const userIds = users.map(user => user.id)
      const followingRelations = await prisma.follow.findMany({
        where: {
          followerId: req.user.id,
          followingId: { in: userIds }
        },
        select: { followingId: true }
      })

      const followingSet = new Set(followingRelations.map(f => f.followingId))

      // Add isFollowing flag to each user
      const usersWithFollowStatus = users.map(user => ({
        ...user,
        isFollowing: followingSet.has(user.id)
      }))

      const total = await prisma.user.count({
        where: {
          AND: [
            { id: { not: req.user.id } },
            {
              OR: [
                {
                  username: {
                    contains: searchQuery,
                    mode: 'insensitive'
                  }
                },
                {
                  displayName: {
                    contains: searchQuery,
                    mode: 'insensitive'
                  }
                },
                {
                  bio: {
                    contains: searchQuery,
                    mode: 'insensitive'
                  }
                }
              ]
            }
          ]
        }
      })

      return NextResponse.json({
        users: usersWithFollowStatus,
        total,
        page,
        limit,
        hasMore: skip + limit < total,
        query: searchQuery
      })

    } catch (error) {
      console.error('Search users error:', error)
      return NextResponse.json(
        { error: 'Failed to search users' },
        { status: 500 }
      )
    }
  })(request)
}