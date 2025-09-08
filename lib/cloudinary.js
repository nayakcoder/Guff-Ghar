import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export class CloudinaryService {
  static async uploadImage(file, options = {}) {
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: options.folder || 'guffghar',
        transformation: options.transformation || [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
        resource_type: 'image',
        ...options
      })

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw new Error('Failed to upload image')
    }
  }

  static async uploadVideo(file, options = {}) {
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: options.folder || 'guffghar/videos',
        resource_type: 'video',
        transformation: options.transformation || [
          { width: 1280, height: 720, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
        ...options
      })

      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        duration: result.duration,
        bytes: result.bytes
      }
    } catch (error) {
      console.error('Cloudinary video upload error:', error)
      throw new Error('Failed to upload video')
    }
  }

  static async uploadAvatar(file) {
    return this.uploadImage(file, {
      folder: 'guffghar/avatars',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    })
  }

  static async deleteFile(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId)
      return result.result === 'ok'
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      return false
    }
  }

  static getOptimizedUrl(publicId, options = {}) {
    return cloudinary.url(publicId, {
      secure: true,
      transformation: options.transformation || [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ],
      ...options
    })
  }
}

export default CloudinaryService