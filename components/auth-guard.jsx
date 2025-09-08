'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

export function AuthGuard({ children }) {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push('/auth')
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated && !user) {
    return null // or loading spinner
  }

  return children
}