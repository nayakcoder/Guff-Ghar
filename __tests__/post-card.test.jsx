import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PostCard } from '@/components/feed/post-card'
import { useUIStore } from '@/lib/store'

// Mock the hooks and stores
vi.mock('@/lib/store', () => ({
  useUIStore: vi.fn()
}))

vi.mock('@/lib/hooks/use-posts', () => ({
  useLikePost: () => ({
    mutate: vi.fn()
  })
}))

vi.mock('next/link', () => {
  return ({ children, href }) => <a href={href}>{children}</a>
})

vi.mock('next/image', () => {
  return ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />
})

const mockPost = {
  id: '1',
  content: 'This is a test post',
  created_at: '2024-01-01T12:00:00Z',
  likes_count: 5,
  comments_count: 2,
  is_liked: false,
  media_url: null,
  media_type: null,
  author: {
    id: 'user1',
    username: 'testuser',
    display_name: 'Test User',
    avatar_url: null
  }
}

describe('PostCard', () => {
  beforeEach(() => {
    useUIStore.mockReturnValue('en')
  })

  it('renders post content correctly', () => {
    render(<PostCard post={mockPost} />)
    
    expect(screen.getByText('This is a test post')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('@testuser')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('shows heart icon as filled when post is liked', () => {
    const likedPost = { ...mockPost, is_liked: true }
    render(<PostCard post={likedPost} />)
    
    const heartButton = screen.getByRole('button', { name: /5/ })
    expect(heartButton).toHaveClass('text-red-500')
  })

  it('toggles comments when comment button is clicked', async () => {
    render(<PostCard post={mockPost} />)
    
    const commentButton = screen.getByRole('button', { name: /2/ })
    fireEvent.click(commentButton)
    
    await waitFor(() => {
      expect(screen.getByText('Comments coming soon...')).toBeInTheDocument()
    })
  })

  it('displays media when media_url is provided', () => {
    const postWithMedia = {
      ...mockPost,
      media_url: 'https://example.com/image.jpg',
      media_type: 'image'
    }
    
    render(<PostCard post={postWithMedia} />)
    
    const image = screen.getByAltText('Post media')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })
})