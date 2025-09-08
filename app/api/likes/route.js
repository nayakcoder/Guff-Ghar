import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Like/Unlike a post
export async function POST(request) {
  return withAuth(async (req, res) => {
    try {
      const { postId } = await req.json()

      if (!postId) {
        return NextResponse.json(
          { error: 'Post ID is required' },
          { status: 400 }
        )
      }

      // Check if post exists
      const post = await prisma.post.findUnique({
        where: { id: postId }
      })

      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }

      // Check if already liked
      const existingLike = await prisma.like.findFirst({
        where: {
          userId: req.user.id,
          postId
        }
      })

      if (existingLike) {
        // Unlike the post
        await prisma.like.delete({
          where: { id: existingLike.id }
        })

        await prisma.post.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } }
        })

        return NextResponse.json({
          success: true,
          liked: false,
          message: 'Post unliked'
        })
      } else {
        // Like the post
        await prisma.like.create({
          data: {
            userId: req.user.id,
            postId
          }
        })

        await prisma.post.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } }
        })

        return NextResponse.json({
          success: true,
          liked: true,
          message: 'Post liked'
        })
      }

    } catch (error) {
      console.error('Like/Unlike error:', error)
      return NextResponse.json(
        { error: 'Failed to like/unlike post' },
        { status: 500 }
      )
    }
  })(request)
}

// Get likes for a post
export async function GET(request) {
  return withAuth(async (req, res) => {
    try {
      const { searchParams } = new URL(req.url)
      const postId = searchParams.get('postId')
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')
      const skip = (page - 1) * limit

      if (!postId) {
        return NextResponse.json(
          { error: 'Post ID is required' },
          { status: 400 }
        )
      }

      const likes = await prisma.like.findMany({
        where: { postId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              verified: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      })

      const total = await prisma.like.count({
        where: { postId }
      })

      // Check if current user liked this post
      const userLiked = await prisma.like.findFirst({
        where: {
          postId,
          userId: req.user.id
        }
      })

      return NextResponse.json({
        likes,
        total,
        page,
        limit,
        hasMore: skip + limit < total,
        userLiked: !!userLiked
      })

    } catch (error) {
      console.error('Get likes error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch likes' },
        { status: 500 }
      )
    }
  })(request)
}