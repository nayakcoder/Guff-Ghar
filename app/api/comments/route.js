import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const commentSchema = z.object({
  postId: z.string(),
  content: z.string().min(1).max(500),
  parentId: z.string().optional() // For nested replies
})

// Create a comment
export async function POST(request) {
  return withAuth(async (req, res) => {
    try {
      const body = await req.json()
      const validatedData = commentSchema.parse(body)

      // Check if post exists
      const post = await prisma.post.findUnique({
        where: { id: validatedData.postId }
      })

      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }

      // If replying to a comment, check if parent exists
      if (validatedData.parentId) {
        const parentComment = await prisma.comment.findUnique({
          where: { id: validatedData.parentId }
        })

        if (!parentComment) {
          return NextResponse.json(
            { error: 'Parent comment not found' },
            { status: 404 }
          )
        }
      }

      // Create comment
      const comment = await prisma.comment.create({
        data: {
          content: validatedData.content,
          userId: req.user.id,
          postId: validatedData.postId,
          parentId: validatedData.parentId || null
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              verified: true
            }
          },
          _count: {
            select: {
              replies: true,
              likes: true
            }
          }
        }
      })

      // Update post comments count
      await prisma.post.update({
        where: { id: validatedData.postId },
        data: { commentsCount: { increment: 1 } }
      })

      return NextResponse.json({
        success: true,
        comment
      })

    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid comment data', details: error.errors },
          { status: 400 }
        )
      }

      console.error('Create comment error:', error)
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      )
    }
  })(request)
}

// Get comments for a post
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

      // Get top-level comments (no parent)
      const comments = await prisma.comment.findMany({
        where: {
          postId,
          parentId: null
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              verified: true
            }
          },
          replies: {
            take: 3, // Show first 3 replies
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true,
                  verified: true
                }
              },
              _count: {
                select: { likes: true }
              }
            },
            orderBy: { createdAt: 'asc' }
          },
          _count: {
            select: {
              replies: true,
              likes: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      })

      const total = await prisma.comment.count({
        where: {
          postId,
          parentId: null
        }
      })

      return NextResponse.json({
        comments,
        total,
        page,
        limit,
        hasMore: skip + limit < total
      })

    } catch (error) {
      console.error('Get comments error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      )
    }
  })(request)
}

// Delete a comment
export async function DELETE(request) {
  return withAuth(async (req, res) => {
    try {
      const { searchParams } = new URL(req.url)
      const commentId = searchParams.get('commentId')

      if (!commentId) {
        return NextResponse.json(
          { error: 'Comment ID is required' },
          { status: 400 }
        )
      }

      // Check if comment exists and user owns it
      const comment = await prisma.comment.findUnique({
        where: { id: commentId }
      })

      if (!comment) {
        return NextResponse.json(
          { error: 'Comment not found' },
          { status: 404 }
        )
      }

      if (comment.userId !== req.user.id) {
        return NextResponse.json(
          { error: 'Not authorized to delete this comment' },
          { status: 403 }
        )
      }

      // Delete comment and its replies
      await prisma.comment.deleteMany({
        where: {
          OR: [
            { id: commentId },
            { parentId: commentId }
          ]
        }
      })

      // Update post comments count
      await prisma.post.update({
        where: { id: comment.postId },
        data: { commentsCount: { decrement: 1 } }
      })

      return NextResponse.json({
        success: true,
        message: 'Comment deleted successfully'
      })

    } catch (error) {
      console.error('Delete comment error:', error)
      return NextResponse.json(
        { error: 'Failed to delete comment' },
        { status: 500 }
      )
    }
  })(request)
}