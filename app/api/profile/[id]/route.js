import { NextResponse } from 'next/server'

// Mock profile data
const mockProfiles = {
  'demo_user': {
    user: {
      id: 'demo_user',
      username: 'demo_user',
      display_name: 'Demo User',
      avatar_url: null,
      bio: 'Welcome to Guff Ghar! This is a demo profile.',
      posts_count: 12,
      followers_count: 156,
      following_count: 89,
      is_following: false
    },
    posts: [
      {
        id: 'post1',
        content: 'Just exploring Guff Ghar for the first time! Amazing platform.',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        likes_count: 15,
        comments_count: 3,
        is_liked: false,
        media_url: null,
        media_type: null,
        author: {
          id: 'demo_user',
          username: 'demo_user',
          display_name: 'Demo User',
          avatar_url: null
        }
      }
    ]
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    // Get profile data
    const profile = mockProfiles[id] || {
      user: {
        id: id,
        username: id,
        display_name: `User ${id}`,
        avatar_url: null,
        bio: 'This is a sample profile.',
        posts_count: 0,
        followers_count: 0,
        following_count: 0,
        is_following: false
      },
      posts: []
    }

    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}