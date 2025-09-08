'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore, useUIStore } from '@/lib/store'
import { translations } from '@/lib/i18n'
import { useToast } from '@/components/ui/toaster'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const language = useUIStore((state) => state.language)
  const t = translations[language]
  const { toast } = useToast()
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Mock login - replace with actual auth
      const mockUser = {
        id: '1',
        username: 'demo_user',
        email: email,
        display_name: 'Demo User',
        avatar_url: null,
        bio: 'Welcome to Guff Ghar!'
      }
      
      setUser(mockUser)
      toast({
        title: 'Success',
        description: 'Logged in successfully!',
      })
      router.push('/feed')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid credentials. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center mb-4">
            <span className="text-primary-foreground font-bold text-lg">GG</span>
          </div>
          <CardTitle className="text-2xl">{t.login}</CardTitle>
          <CardDescription>
            Welcome back to {t.app_name}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : t.login}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline">
                {t.signup}
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-xs text-muted-foreground text-center">
              Demo: Use any email and password to login
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}