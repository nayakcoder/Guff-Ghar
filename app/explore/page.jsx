'use client'

import { MainLayout } from '@/components/main-layout'
import { Search, TrendingUp, Hash, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ExplorePage() {
  const trendingTopics = [
    { tag: 'Nepal', posts: '12.3k' },
    { tag: 'Kathmandu', posts: '8.7k' },
    { tag: 'Mountains', posts: '15.2k' },
    { tag: 'Culture', posts: '6.1k' },
    { tag: 'Food', posts: '9.8k' },
  ]

  const suggestedUsers = [
    { username: 'nepal_tourism', name: 'Nepal Tourism Board', followers: '125k' },
    { username: 'everest_base', name: 'Everest Base Camp', followers: '89k' },
    { username: 'kathmandu_valley', name: 'Kathmandu Valley', followers: '67k' },
  ]

  return (
    <div className="min-h-screen bg-black">
      <MainLayout>
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-lg border-b border-gray-900 px-4 py-3">
            <h1 className="text-white text-xl font-bold mb-4">Explore</h1>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for people, topics..."
                className="pl-10 bg-gray-900 border-gray-800 text-white placeholder-gray-400 rounded-xl h-12"
              />
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Trending Topics */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <h2 className="text-white font-semibold">Trending in Nepal</h2>
              </div>
              
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={topic.tag} className="flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400 text-sm">#{index + 1}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <Hash className="h-4 w-4 text-green-400" />
                          <span className="text-white font-medium">#{topic.tag}</span>
                        </div>
                        <span className="text-gray-400 text-sm">{topic.posts} posts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Users */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-5 w-5 text-green-400" />
                <h2 className="text-white font-semibold">Who to follow</h2>
              </div>
              
              <div className="space-y-3">
                {suggestedUsers.map((user) => (
                  <div key={user.username} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">@{user.username}</p>
                        <p className="text-gray-500 text-xs">{user.followers} followers</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4"
                    >
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <h2 className="text-white font-semibold mb-4">Recent posts</h2>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-800 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  )
}