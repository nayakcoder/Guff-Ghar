import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreatePost } from '@/components/feed/create-post'
import { useAuthStore, useUIStore } from '@/lib/store'

// Mock the hooks and stores
vi.mock('@/lib/store', () => ({
  useAuthStore: vi.fn(),
  useUIStore: vi.fn()
}))

vi.mock('@/lib/hooks/use-posts', () => ({
  useCreatePost: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ id: '1' })
  })
}))

vi.mock('@/components/ui/toaster', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}))

const mockUser = {
  id: 'user1',
  username: 'testuser',
  display_name: 'Test User',
  avatar_url: null
}

describe('CreatePost', () => {
  beforeEach(() => {
    useUIStore.mockReturnValue('en')
  })

  it('renders login message when user is not authenticated', () => {
    useAuthStore.mockReturnValue(null)
    
    render(<CreatePost />)
    
    expect(screen.getByText('Please log in to create posts')).toBeInTheDocument()
  })

  it('renders create post form when user is authenticated', () => {
    useAuthStore.mockReturnValue(mockUser)
    
    render(<CreatePost />)
    
    expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /post/i })).toBeInTheDocument()
  })

  it('updates character count as user types', async () => {
    useAuthStore.mockReturnValue(mockUser)
    
    render(<CreatePost />)
    
    const textarea = screen.getByPlaceholderText("What's on your mind?")
    fireEvent.change(textarea, { target: { value: 'Hello world' } })
    
    expect(screen.getByText('11/500')).toBeInTheDocument()
  })

  it('disables post button when content is empty', () => {
    useAuthStore.mockReturnValue(mockUser)
    
    render(<CreatePost />)
    
    const postButton = screen.getByRole('button', { name: /post/i })
    expect(postButton).toBeDisabled()
  })

  it('enables post button when content is provided', async () => {
    useAuthStore.mockReturnValue(mockUser)
    
    render(<CreatePost />)
    
    const textarea = screen.getByPlaceholderText("What's on your mind?")
    const postButton = screen.getByRole('button', { name: /post/i })
    
    fireEvent.change(textarea, { target: { value: 'Test post content' } })
    
    expect(postButton).not.toBeDisabled()
  })

  it('clears content after successful post submission', async () => {
    useAuthStore.mockReturnValue(mockUser)
    
    render(<CreatePost />)
    
    const textarea = screen.getByPlaceholderText("What's on your mind?")
    const postButton = screen.getByRole('button', { name: /post/i })
    
    fireEvent.change(textarea, { target: { value: 'Test post content' } })
    fireEvent.click(postButton)
    
    await waitFor(() => {
      expect(textarea.value).toBe('')
    })
  })
})