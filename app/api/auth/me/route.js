import { NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value ||
                 request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token' },
        { status: 401 }
      )
    }
    
    const user = await AuthService.getUserFromToken(token)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({ user })
    
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    )
  }
}