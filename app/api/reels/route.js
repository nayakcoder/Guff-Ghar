import { NextResponse } from 'next/server'

// Mock data for reels
const mockReels = [
  {
    id: '1',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    caption: 'Beautiful Nepal mountains! 🏔️ #Nepal #Mountains',
    hashtags: ['Nepal', 'Mountains', 'Nature'],
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    likes_count: 128,
    comments_count: 24,
    is_liked: false,
    author: {
      id: 'reel1',
      username: 'mountain_explorer',
      display_name: 'Prakash Thapa',
      avatar_url: null
    }
  },
  {
    id: '2',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    caption: 'Traditional Nepali dance performance 💃 #Culture #Dance',
    hashtags: ['Culture', 'Dance', 'Traditional'],
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    likes_count: 89,
    comments_count: 15,
    is_liked: true,
    author: {
      id: 'reel2',
      username: 'cultural_nepal',
      display_name: 'Maya Gurung',
      avatar_url: null
    }
  }
]

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Simple pagination
    const startIndex = (page - 1) * limit
    const paginatedReels = mockReels.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      reels: paginatedReels,
      total: mockReels.length,
      page,
      limit
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reels' },
      { status: 500 }
    )
  }
}