'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, FileText, Eye, Zap } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    trendingTopics: 0,
    draftPosts: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const [postsRes, trendingRes] = await Promise.all([
        fetch('/api/posts?status=all'),
        fetch('/api/trending'),
      ])

      const postsData = await postsRes.json()
      const trendingData = await trendingRes.json()

      const totalViews = postsData.posts?.reduce((sum: number, post: any) => sum + (post.views || 0), 0) || 0
      const draftPosts = postsData.posts?.filter((post: any) => post.status === 'draft').length || 0

      setStats({
        totalPosts: postsData.posts?.length || 0,
        totalViews,
        trendingTopics: trendingData.topics?.length || 0,
        draftPosts,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your CMS</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">{stats.draftPosts} drafts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trending Topics</CardTitle>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trendingTopics}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Publish</CardTitle>
            <Zap className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">Every hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/posts/new">
              <Button className="w-full">Create New Post</Button>
            </Link>
            <Link href="/admin/auto-publish">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Zap className="mr-2 h-4 w-4" />
                AI Auto-Publish
              </Button>
            </Link>
            <Link href="/admin/pages/new">
              <Button variant="outline" className="w-full bg-transparent">
                Create New Page
              </Button>
            </Link>
            <Link href="/admin/import">
              <Button variant="outline" className="w-full bg-transparent">
                Bulk Import Posts
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Database</span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Auto-Publisher</span>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                Running
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Trending Sync</span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                Active
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
