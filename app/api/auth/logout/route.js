import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value ||
                 request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (token) {
      await AuthService.logout(token)
    }
    
    // Create response
    const response = NextResponse.json({ 
      message: 'Logout successful' 
    })
    
    // Clear cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    })
    
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}