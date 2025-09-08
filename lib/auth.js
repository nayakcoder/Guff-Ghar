import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma.js'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export class AuthService {
  // Hash password
  static async hashPassword(password) {
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12
    return await bcrypt.hash(password, rounds)
  }

  // Verify password
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
  }

  // Generate JWT token
  static generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return null
    }
  }

  // Create session
  static async createSession(userId) {
    const token = this.generateToken(userId)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    const session = await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    })

    return { session, token }
  }

  // Get user from token
  static async getUserFromToken(token) {
    try {
      const decoded = this.verifyToken(token)
      if (!decoded) return null

      const session = await prisma.session.findUnique({
        where: { token },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              displayName: true,
              bio: true,
              avatarUrl: true,
              coverUrl: true,
              location: true,
              website: true,
              verified: true,
              private: true,
              followersCount: true,
              followingCount: true,
              postsCount: true,
              createdAt: true,
              lastActive: true,
            },
          },
        },
      })

      if (!session || session.expiresAt < new Date()) {
        // Clean up expired session
        if (session) {
          await prisma.session.delete({ where: { id: session.id } })
        }
        return null
      }

      // Update last active
      await prisma.user.update({
        where: { id: session.userId },
        data: { lastActive: new Date() },
      })

      return session.user
    } catch (error) {
      console.error('Auth error:', error)
      return null
    }
  }

  // Register new user
  static async register({ email, username, password, displayName }) {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }],
        },
      })

      if (existingUser) {
        throw new Error(
          existingUser.email === email
            ? 'Email already exists'
            : 'Username already exists'
        )
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password)

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          username,
          displayName,
          hashedPassword,
        },
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          bio: true,
          avatarUrl: true,
          coverUrl: true,
          location: true,
          website: true,
          verified: true,
          private: true,
          followersCount: true,
          followingCount: true,
          postsCount: true,
          createdAt: true,
          lastActive: true,
        },
      })

      // Create session
      const { token } = await this.createSession(user.id)

      return { user, token }
    } catch (error) {
      throw error
    }
  }

  // Login user
  static async login({ email, password }) {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        throw new Error('Invalid credentials')
      }

      // Verify password
      const isValid = await this.verifyPassword(password, user.hashedPassword)
      if (!isValid) {
        throw new Error('Invalid credentials')
      }

      // Create session
      const { token } = await this.createSession(user.id)

      // Return user without password
      const { hashedPassword, ...userWithoutPassword } = user

      return { user: userWithoutPassword, token }
    } catch (error) {
      throw error
    }
  }

  // Logout user
  static async logout(token) {
    try {
      await prisma.session.deleteMany({
        where: { token },
      })
      return true
    } catch (error) {
      console.error('Logout error:', error)
      return false
    }
  }

  // Clean up expired sessions
  static async cleanupSessions() {
    try {
      await prisma.session.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      })
    } catch (error) {
      console.error('Session cleanup error:', error)
    }
  }
}

// Middleware to authenticate requests
export function withAuth(handler) {
  return async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || 
                   req.cookies?.token

      if (!token) {
        return res.status(401).json({ error: 'Authentication required' })
      }

      const user = await AuthService.getUserFromToken(token)
      if (!user) {
        return res.status(401).json({ error: 'Invalid or expired token' })
      }

      req.user = user
      return handler(req, res)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(500).json({ error: 'Authentication error' })
    }
  }
}

// Middleware to get user if authenticated (optional)
export function withOptionalAuth(handler) {
  return async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || 
                   req.cookies?.token

      if (token) {
        const user = await AuthService.getUserFromToken(token)
        req.user = user
      }

      return handler(req, res)
    } catch (error) {
      console.error('Optional auth middleware error:', error)
      // Continue without user
      return handler(req, res)
    }
  }
}