'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Zap, RefreshCw, CheckCircle2, Clock, TrendingUp } from 'lucide-react'

export default function AutoPublishPage() {
  const [status, setStatus] = useState<any>(null)
  const [publishing, setPublishing] = useState(false)
  const [lastPublish, setLastPublish] = useState<any>(null)

  useEffect(() => {
    fetchStatus()
  }, [])

  async function fetchStatus() {
    try {
      const res = await fetch('/api/auto-publish')
      const data = await res.json()
      setStatus(data)
    } catch (error) {
      console.error('Error fetching status:', error)
    }
  }

  async function triggerAutoPublish() {
    setPublishing(true)
    try {
      const res = await fetch('/api/auto-publish', { method: 'POST' })
      const data = await res.json()
      setLastPublish(data)
      
      // Refresh status after publishing
      setTimeout(() => {
        fetchStatus()
      }, 1000)
    } catch (error) {
      console.error('Error auto-publishing:', error)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Auto-Publish</h1>
        <p className="text-muted-foreground">Automatically create and publish posts from trending topics</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpublished Topics</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status?.unpublishedTopics || 0}</div>
            <p className="text-xs text-muted-foreground">Ready to publish</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Published</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status?.recentAutoPublished || 0}</div>
            <p className="text-xs text-muted-foreground">Recent posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Zap className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">Auto-publish ready</p>
          </CardContent>
        </Card>
      </div>

      {/* Last Publish Result */}
      {lastPublish && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <CheckCircle2 className="h-5 w-5" />
              Publishing Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="text-green-800">
            <p className="font-medium">{lastPublish.message}</p>
            <p className="mt-2 text-sm">
              Successfully created {lastPublish.published} new posts from trending topics.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Main Control Card */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Publish Control</CardTitle>
          <CardDescription>
            Create and publish articles automatically from trending topics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            <div className="flex gap-2">
              <Zap className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-bold">How it works:</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
                  <li>Fetches unpublished trending topics from your database</li>
                  <li>Generates AI-powered content for each topic</li>
                  <li>Creates well-formatted articles with proper structure</li>
                  <li>Publishes them immediately to your site</li>
                  <li>Marks topics as published to avoid duplicates</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={triggerAutoPublish}
              disabled={publishing || (status?.unpublishedTopics === 0)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {publishing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Publish Now
                </>
              )}
            </Button>

            <Button
              onClick={fetchStatus}
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Status
            </Button>
          </div>

          {status?.unpublishedTopics === 0 && (
            <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-900">
              <p>No unpublished topics available. Add trending topics first!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Auto-Published Posts */}
      {status?.posts && status.posts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Auto-Published Posts</CardTitle>
            <CardDescription>Latest articles created by AI auto-publish</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {status.posts.map((post: any) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{post.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {post.category} • {post.views} views • {new Date(post.published_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Published
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup & Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">To use auto-publish:</p>
            <ol className="mt-2 list-inside list-decimal space-y-1">
              <li>Add trending topics via the "Trending" section</li>
              <li>Topics will be automatically detected and stored</li>
              <li>Click "Publish Now" to generate articles from topics</li>
              <li>Posts will be created and published automatically</li>
              <li>Monitor published posts in the Posts section</li>
            </ol>
          </div>

          <div className="rounded-lg bg-purple-50 p-3 text-purple-900">
            <p className="text-xs">
              💡 <strong>Pro Tip:</strong> Set up a cron job to trigger <code>/api/auto-publish</code> 
              periodically (e.g., every hour) for fully automated publishing!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
