'use client'

import { useState, useEffect } from 'react'
import { useAuthStore, useUIStore } from '@/lib/store'
import { usePostsQuery } from '@/lib/hooks/use-posts'
import { useChatsQuery } from '@/lib/hooks/use-chat'
import { Button } from '@/components/ui/button'

export default function DebugPage() {
  const [apiTests, setApiTests] = useState({})
  const auth = useAuthStore()
  const ui = useUIStore()
  const postsQuery = usePostsQuery()
  const chatsQuery = useChatsQuery()

  const testApiEndpoint = async (name, url) => {
    try {
      const response = await fetch(url)
      const data = await response.json()
      setApiTests(prev => ({
        ...prev,
        [name]: { success: true, data }
      }))
    } catch (error) {
      setApiTests(prev => ({
        ...prev,
        [name]: { success: false, error: error.message }
      }))
    }
  }

  useEffect(() => {
    testApiEndpoint('posts', '/api/posts')
    testApiEndpoint('chats', '/api/chats')
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-8">Debug Dashboard</h1>
      
      {/* Authentication State */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Authentication State</h2>
        <div className="space-y-2">
          <p><strong>User:</strong> {auth.user ? JSON.stringify(auth.user, null, 2) : 'Not logged in'}</p>
          <p><strong>Is Authenticated:</strong> {auth.isAuthenticated ? 'Yes' : 'No'}</p>
        </div>
        
        <div className="mt-4 space-x-4">
          <Button 
            onClick={() => auth.setUser({
              id: 'debug_user',
              username: 'debug_user',
              display_name: 'Debug User',
              email: 'debug@test.com',
              bio: 'This is a debug user'
            })}
            className="bg-green-500 hover:bg-green-600"
          >
            Set Debug User
          </Button>
          <Button 
            onClick={() => auth.logout()}
            className="bg-red-500 hover:bg-red-600"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* API Tests */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">API Tests</h2>
        <div className="space-y-4">
          {Object.entries(apiTests).map(([name, result]) => (
            <div key={name} className="border border-gray-700 rounded p-3">
              <h3 className="font-semibold capitalize">{name}</h3>
              <p className={`text-sm ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                Status: {result.success ? 'Success' : 'Failed'}
              </p>
              {result.error && (
                <p className="text-red-400 text-sm">Error: {result.error}</p>
              )}
              {result.data && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-400">View Data</summary>
                  <pre className="text-xs mt-2 overflow-auto max-h-32 bg-gray-800 p-2 rounded">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* React Query State */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">React Query State</h2>
        <div className="space-y-4">
          <div className="border border-gray-700 rounded p-3">
            <h3 className="font-semibold">Posts Query</h3>
            <p className="text-sm">Status: {postsQuery.status}</p>
            <p className="text-sm">Loading: {postsQuery.isLoading ? 'Yes' : 'No'}</p>
            <p className="text-sm">Error: {postsQuery.error ? postsQuery.error.message : 'None'}</p>
            <p className="text-sm">Data: {postsQuery.data ? `${postsQuery.data.posts?.length || 0} posts` : 'No data'}</p>
          </div>
          
          <div className="border border-gray-700 rounded p-3">
            <h3 className="font-semibold">Chats Query</h3>
            <p className="text-sm">Status: {chatsQuery.status}</p>
            <p className="text-sm">Loading: {chatsQuery.isLoading ? 'Yes' : 'No'}</p>
            <p className="text-sm">Error: {chatsQuery.error ? chatsQuery.error.message : 'None'}</p>
            <p className="text-sm">Data: {chatsQuery.data ? `${chatsQuery.data.length || 0} chats` : 'No data'}</p>
          </div>
        </div>
      </div>

      {/* UI State */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">UI State</h2>
        <div className="space-y-2">
          <p><strong>Theme:</strong> {ui.theme}</p>
          <p><strong>Language:</strong> {ui.language}</p>
          <p><strong>Sidebar Open:</strong> {ui.sidebarOpen ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="space-x-4">
          <Button onClick={() => window.location.href = '/feed'}>Go to Feed</Button>
          <Button onClick={() => window.location.href = '/auth'}>Go to Auth</Button>
          <Button onClick={() => window.location.href = '/profile'}>Go to Profile</Button>
          <Button onClick={() => window.location.href = '/chat'}>Go to Chat</Button>
          <Button onClick={() => window.location.href = '/create'}>Go to Create</Button>
        </div>
      </div>
    </div>
  )
}