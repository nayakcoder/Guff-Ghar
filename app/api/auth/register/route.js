import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(6),
  displayName: z.string().min(1).max(50),
})

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Register user
    const { user, token } = await AuthService.register(validatedData)
    
    // Create response with token in cookie
    const response = NextResponse.json({ 
      user,
      message: 'Registration successful' 
    })
    
    // Set httpOnly cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })
    
    return response
    
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 400 }
    )
  }
}