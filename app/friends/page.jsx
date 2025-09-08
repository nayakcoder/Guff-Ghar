'use client'

import { MainLayout } from '@/components/main-layout'
import { FriendsList } from '@/components/friends/friends-list'
import { FriendRequests } from '@/components/friends/friend-requests'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUIStore } from '@/lib/store'
import { translations } from '@/lib/i18n'

export default function FriendsPage() {
  const language = useUIStore((state) => state.language)
  const t = translations[language]

  return (
    <div className="min-h-screen bg-black">
      <MainLayout>
        <div className="max-w-lg mx-auto">
          <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-lg border-b border-gray-900 px-4 py-4">
            <h1 className="text-xl font-semibold text-white mb-4">{t.friends}</h1>
            
            <Tabs defaultValue="friends" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-900 border border-gray-800">
                <TabsTrigger value="friends" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">{t.friends}</TabsTrigger>
                <TabsTrigger value="requests" className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-800">Requests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="friends" className="mt-6">
                <FriendsList />
              </TabsContent>
              
              <TabsContent value="requests" className="mt-6">
                <FriendRequests />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </MainLayout>
    </div>
  )
}