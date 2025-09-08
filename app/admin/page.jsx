'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, Users, MessageSquare, Video, Shield, Settings } from 'lucide-react'
import { useUIStore } from '@/lib/store'
import { translations } from '@/lib/i18n'

export default function AdminPage() {
  const language = useUIStore((state) => state.language)
  const t = translations[language]

  // Mock admin stats
  const stats = {
    totalUsers: 1250,
    totalPosts: 8430,
    totalMessages: 15670,
    totalReels: 890,
    activeToday: 340,
    reportsToday: 5
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reels</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReels.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +25% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Today</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeToday}</div>
              <p className="text-xs text-muted-foreground">
                27% of total users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Today</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.reportsToday}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>
                  Platform performance and health metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Server Status</span>
                    <span className="text-green-500 font-semibold">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Database Status</span>
                    <span className="text-green-500 font-semibold">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Storage Usage</span>
                    <span className="text-blue-500 font-semibold">2.3 TB / 10 TB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API Response Time</span>
                    <span className="text-green-500 font-semibold">125ms avg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Registered Users</span>
                    <span className="font-semibold">{stats.totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Verified Users</span>
                    <span className="font-semibold">890</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Suspended Users</span>
                    <span className="text-red-500 font-semibold">23</span>
                  </div>
                  <Button className="w-full mt-4">View All Users</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>
                  Review and moderate user-generated content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Posts Pending Review</span>
                    <span className="text-yellow-500 font-semibold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Reels Pending Review</span>
                    <span className="text-yellow-500 font-semibold">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Flagged Content</span>
                    <span className="text-red-500 font-semibold">5</span>
                  </div>
                  <Button className="w-full mt-4">Review Content</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Reports</CardTitle>
                <CardDescription>
                  Handle user reports and complaints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Open Reports</span>
                    <span className="text-red-500 font-semibold">{stats.reportsToday}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Resolved This Week</span>
                    <span className="text-green-500 font-semibold">28</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>High Priority</span>
                    <span className="text-red-500 font-semibold">2</span>
                  </div>
                  <Button className="w-full mt-4">View All Reports</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}