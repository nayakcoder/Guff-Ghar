'use client'

import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/lib/store'
import { useToast } from '@/components/ui/toaster'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  })
  
  const { toast } = useToast()
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      // Mock authentication
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        username: isLogin ? 'demo_user' : formData.displayName.toLowerCase().replace(' ', '_'),
        email: formData.email,
        display_name: isLogin ? 'Demo User' : formData.displayName,
        avatar_url: null,
        bio: 'Welcome to Guff Ghar!'
      }
      
      setUser(mockUser)
      toast({
        title: 'Success',
        description: isLogin ? 'Logged in successfully!' : 'Account created successfully!',
      })
      router.push('/feed')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Authentication failed. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Status bar */}
      <div className="h-12 flex items-center justify-between px-6 pt-2">
        <span className="text-blue-400 text-sm">Sign Up / Log In</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-white text-3xl font-bold mb-2">Guff Ghar</h1>
            <p className="text-gray-400 text-sm">
              Welcome to the future of social.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="pl-12 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl h-14 focus:border-green-500 focus:ring-green-500/20"
                  required
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="pl-12 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl h-14 focus:border-green-500 focus:ring-green-500/20"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="pl-12 pr-12 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl h-14 focus:border-green-500 focus:ring-green-500/20"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white h-10 w-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="pl-12 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl h-14 focus:border-green-500 focus:ring-green-500/20"
                  required
                />
              </div>
            )}

            {/* Green Login Button - Exact match to design */}
            <Button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded-2xl h-14 text-lg mt-6 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : 'Log In'}
            </Button>
          </form>

          {isLogin && (
            <div className="mt-6 text-center">
              <button className="text-green-400 text-sm hover:underline">
                Forgot Password?
              </button>
            </div>
          )}

          {/* Social Login - Exact match to design */}
          <div className="mt-8">
            <div className="text-center text-gray-400 text-sm mb-6">
              or continue with
            </div>
            
            <div className="flex space-x-4 justify-center">
              <Button variant="outline" className="w-12 h-12 bg-white/10 border-gray-600 hover:bg-white/20 rounded-xl p-0">
                <div className="w-6 h-6 bg-white rounded-sm"></div>
              </Button>
              <Button variant="outline" className="w-12 h-12 bg-white/10 border-gray-600 hover:bg-white/20 rounded-xl p-0">
                <div className="w-6 h-6 bg-green-500 rounded-sm"></div>
              </Button>
              <Button variant="outline" className="w-12 h-12 bg-white/10 border-gray-600 hover:bg-white/20 rounded-xl p-0">
                <div className="w-6 h-6 bg-blue-500 rounded-sm"></div>
              </Button>
            </div>
          </div>

          {/* Toggle */}
          <div className="mt-8 text-center">
            <span className="text-gray-400 text-sm">
              Don't have an account? 
            </span>
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-400 hover:underline text-sm font-medium ml-1"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}