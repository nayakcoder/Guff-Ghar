'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

export default function OnboardingPage() {
  const [showSplash, setShowSplash] = useState(true)
  const router = useRouter()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    // If user is already logged in, redirect to feed
    if (user) {
      router.push('/feed')
      return
    }

    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [user, router])

  const handleContinue = () => {
    router.push('/auth')
  }

  if (user) {
    return null // Will redirect
  }

  // Splash Screen (simple loading)
  if (showSplash) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">GG</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Welcome Screen - Exact design from mockup
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Status bar area */}
      <div className="h-12 flex items-center justify-between px-6 pt-2">
        <span className="text-blue-400 text-sm">Welcome to Guff Ghar</span>
      </div>

      {/* Skip button top right */}
      <div className="absolute top-16 left-6 z-10">
        <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center px-8 pb-20">
        <div className="mb-16">
          <h1 className="text-white text-5xl font-bold leading-tight mb-6">
            Welcome to<br />
            Guff Ghar.
          </h1>
          
          <p className="text-gray-400 text-lg leading-relaxed">
            The future of connection is here. Your world, your conversations, all in one home.
          </p>
        </div>

        {/* Continue button */}
        <div className="space-y-4">
          <Button 
            onClick={handleContinue}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-full text-lg h-14 transition-all duration-200"
            size="lg"
          >
            Continue →
          </Button>
          
          <p className="text-gray-500 text-xs text-center">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}