import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { CloudinaryService } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  return withAuth(async (req, res) => {
    try {
      const formData = await req.formData()
      const file = formData.get('file')
      const type = formData.get('type') || 'image'
      const postId = formData.get('postId')

      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        )
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create a data URL for Cloudinary
      const base64 = buffer.toString('base64')
      const dataUrl = `data:${file.type};base64,${base64}`

      let uploadResult

      // Upload based on type
      if (type === 'avatar') {
        uploadResult = await CloudinaryService.uploadAvatar(dataUrl)
        
        // Update user avatar
        await prisma.user.update({
          where: { id: req.user.id },
          data: { avatarUrl: uploadResult.url }
        })
      } else if (type === 'video') {
        uploadResult = await CloudinaryService.uploadVideo(dataUrl)
      } else {
        uploadResult = await CloudinaryService.uploadImage(dataUrl)
      }

      // If it's for a post, create media record
      if (postId) {
        await prisma.media.create({
          data: {
            postId,
            type: type.toUpperCase(),
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            width: uploadResult.width,
            height: uploadResult.height,
            format: uploadResult.format,
            size: uploadResult.bytes,
          }
        })
      }

      return NextResponse.json({
        success: true,
        data: uploadResult
      })

    } catch (error) {
      console.error('Upload error:', error)
      return NextResponse.json(
        { error: 'Upload failed' },
        { status: 500 }
      )
    }
  })(request)
}

// Handle file deletion
export async function DELETE(request) {
  return withAuth(async (req, res) => {
    try {
      const { searchParams } = new URL(req.url)
      const publicId = searchParams.get('publicId')
      const mediaId = searchParams.get('mediaId')

      if (!publicId) {
        return NextResponse.json(
          { error: 'Public ID required' },
          { status: 400 }
        )
      }

      // Delete from Cloudinary
      const deleted = await CloudinaryService.deleteFile(publicId)

      if (deleted && mediaId) {
        // Delete media record
        await prisma.media.delete({
          where: { id: mediaId }
        })
      }

      return NextResponse.json({
        success: deleted,
        message: deleted ? 'File deleted successfully' : 'Failed to delete file'
      })

    } catch (error) {
      console.error('Delete error:', error)
      return NextResponse.json(
        { error: 'Delete failed' },
        { status: 500 }
      )
    }
  })(request)
}