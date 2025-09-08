'use client'

import { MainLayout } from '@/components/main-layout'
import { useAuthStore } from '@/lib/store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Settings, Edit, Share, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toaster'

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic'

export default function ProfilePage() {
  const { user, logout } = useAuthStore((state) => ({ user: state.user, logout: state.logout }))
  const router = useRouter()
  const { toast } = useToast()

  if (!user) {
    router.push('/auth')
    return null
  }

  const handleLogout = () => {
    logout()
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    })
    router.push('/auth')
  }

  return (
    <div className="min-h-screen bg-black">
      <MainLayout>
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-lg border-b border-gray-900 px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-white text-xl font-bold">Profile</h1>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <Settings className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Profile Header */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-gray-800">
                  <AvatarImage src={user.avatar_url} alt={user.username} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-2xl font-bold">
                    {user.username?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-white text-xl font-bold mb-1">
                  {user.display_name || user.username}
                </h2>
                <p className="text-gray-400 mb-4">@{user.username}</p>
                
                {user.bio && (
                  <p className="text-gray-300 text-sm mb-4">{user.bio}</p>
                )}

                <div className="flex items-center justify-center space-x-6 mb-6">
                  <div className="text-center">
                    <p className="text-white font-bold text-lg">12</p>
                    <p className="text-gray-400 text-sm">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg">156</p>
                    <p className="text-gray-400 text-sm">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-lg">89</p>
                    <p className="text-gray-400 text-sm">Following</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-800 rounded-xl">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <h3 className="text-white font-semibold mb-4">Activity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-xl p-3 text-center">
                  <p className="text-green-400 font-bold text-lg">2.3k</p>
                  <p className="text-gray-400 text-sm">Total Likes</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-3 text-center">
                  <p className="text-green-400 font-bold text-lg">456</p>
                  <p className="text-gray-400 text-sm">Comments</p>
                </div>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <h3 className="text-white font-semibold mb-4">Your posts</h3>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Post {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <h3 className="text-white font-semibold mb-4">Settings</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 hover:bg-gray-800 rounded-xl transition-colors">
                  <p className="text-white">Privacy Settings</p>
                  <p className="text-gray-400 text-sm">Manage who can see your content</p>
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-800 rounded-xl transition-colors">
                  <p className="text-white">Notifications</p>
                  <p className="text-gray-400 text-sm">Customize your notification preferences</p>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left p-3 hover:bg-gray-800 rounded-xl transition-colors text-red-400 flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  )
}