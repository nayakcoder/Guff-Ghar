import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, withOptionalAuth } from '@/lib/auth'
import { z } from 'zod'

const createPostSchema = z.object({
  content: z.string().min(1).max(500),
  mediaUrls: z.array(z.string().url()).optional(),
  mediaTypes: z.array(z.string()).optional(),
  parentId: z.string().optional(), // for replies
})

export async function GET(request) {
  return withOptionalAuth(async (req, res) => {
    try {
      const { searchParams } = new URL(req.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')
      const authorId = searchParams.get('author')
      const skip = (page - 1) * limit

      const where = {
        parentId: null, // Only top-level posts, not replies
        ...(authorId && { authorId }),
      }

      const posts = await prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              verified: true,
            },
          },
          likes: req.user ? {
            where: { userId: req.user.id },
            select: { id: true },
          } : false,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      })

      const total = await prisma.post.count({ where })

      // Format response
      const formattedPosts = posts.map(post => ({
        id: post.id,
        content: post.content,
        mediaUrls: post.mediaUrls,
        mediaTypes: post.mediaTypes,
        createdAt: post.createdAt,
        likesCount: post._count.likes,
        commentsCount: post._count.comments,
        isLiked: req.user ? post.likes.length > 0 : false,
        author: {
          id: post.author.id,
          username: post.author.username,
          displayName: post.author.displayName,
          avatarUrl: post.author.avatarUrl,
          verified: post.author.verified,
        },
      }))

      return NextResponse.json({
        posts: formattedPosts,
        total,
        page,
        limit,
      })
    } catch (error) {
      console.error('Get posts error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      )
    }
  })(request)
}

export async function POST(request) {
  return withAuth(async (req, res) => {
    try {
      const body = await req.json()
      
      // Validate input
      const validatedData = createPostSchema.parse(body)
      
      // Create post
      const post = await prisma.post.create({
        data: {
          ...validatedData,
          authorId: req.user.id,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
              verified: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      })

      // Update user's post count
      await prisma.user.update({
        where: { id: req.user.id },
        data: { postsCount: { increment: 1 } },
      })

      // Format response
      const formattedPost = {
        id: post.id,
        content: post.content,
        mediaUrls: post.mediaUrls,
        mediaTypes: post.mediaTypes,
        createdAt: post.createdAt,
        likesCount: post._count.likes,
        commentsCount: post._count.comments,
        isLiked: false,
        author: {
          id: post.author.id,
          username: post.author.username,
          displayName: post.author.displayName,
          avatarUrl: post.author.avatarUrl,
          verified: post.author.verified,
        },
      }

      return NextResponse.json(formattedPost, { status: 201 })
    } catch (error) {
      console.error('Create post error:', error)
      
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid input', details: error.errors },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      )
    }
  })(request)
}