import { NextResponse } from 'next/server'

// Mock data for friends
const mockFriends = [
  {
    id: 'friend1',
    username: 'john_doe',
    display_name: 'John Doe',
    avatar_url: null,
    bio: 'Software developer from Kathmandu',
    is_online: true
  },
  {
    id: 'friend2',
    username: 'jane_smith',
    display_name: 'Jane Smith',
    avatar_url: null,
    bio: 'Photographer and travel enthusiast',
    is_online: false
  },
  {
    id: 'friend3',
    username: 'ram_bahadur',
    display_name: 'Ram Bahadur',
    avatar_url: null,
    bio: 'Teaching and learning every day',
    is_online: true
  }
]

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
    return NextResponse.json(mockFriends)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch friends' },
      { status: 500 }
    )
  }
}