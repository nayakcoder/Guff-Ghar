import { NextResponse } from 'next/server'

// Mock data for friend requests
const mockFriendRequests = [
  {
    id: 'req1',
    status: 'pending',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    sender: {
      id: 'user1',
      username: 'alex_wilson',
      display_name: 'Alex Wilson',
      avatar_url: null
    }
  },
  {
    id: 'req2',
    status: 'pending',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    sender: {
      id: 'user2',
      username: 'maria_garcia',
      display_name: 'Maria Garcia',
      avatar_url: null
    }
  }
]

export async function GET() {
  try {
    return NextResponse.json(mockFriendRequests)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch friend requests' },
      { status: 500 }
    )
  }
}