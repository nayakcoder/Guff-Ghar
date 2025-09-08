import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth'

export async function POST(request, { params }) {
  return withAuth(async (req, res) => {
    try {
      const { id: postId } = params
      const userId = req.user.id

      // Check if post exists
      const post = await prisma.post.findUnique({
        where: { id: postId },
      })

      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }

      // Check if already liked
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      })

      if (existingLike) {
        // Unlike
        await prisma.$transaction([
          prisma.like.delete({
            where: { id: existingLike.id },
          }),
          prisma.post.update({
            where: { id: postId },
            data: { likesCount: { decrement: 1 } },
          }),
        ])

        return NextResponse.json({
          liked: false,
          likesCount: post.likesCount - 1,
        })
      } else {
        // Like
        await prisma.$transaction([
          prisma.like.create({
            data: {
              userId,
              postId,
            },
          }),
          prisma.post.update({
            where: { id: postId },
            data: { likesCount: { increment: 1 } },
          }),
        ])

        // Create notification for post author (if not liking own post)
        if (post.authorId !== userId) {
          await prisma.notification.create({
            data: {
              type: 'LIKE',
              title: 'New Like',
              content: `${req.user.displayName || req.user.username} liked your post`,
              senderId: userId,
              receiverId: post.authorId,
              postId,
            },
          })
        }

        return NextResponse.json({
          liked: true,
          likesCount: post.likesCount + 1,
        })
      }
    } catch (error) {
      console.error('Like post error:', error)
      return NextResponse.json(
        { error: 'Failed to like/unlike post' },
        { status: 500 }
      )
    }
  })(request)
}