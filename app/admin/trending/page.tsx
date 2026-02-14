'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw, Zap } from 'lucide-react'

export default function TrendingPage() {
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [autoPublish, setAutoPublish] = useState(true)

  useEffect(() => {
    fetchTrending()
    // Set up auto-refresh every hour
    const interval = setInterval(() => {
      if (autoPublish) {
        fetchTrending()
      }
    }, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [autoPublish])

  async function fetchTrending() {
    setFetching(true)
    try {
      const res = await fetch('/api/trending', { method: 'POST' })
      const data = await res.json()
      if (data.topics) {
        setTopics(data.topics)
      }
    } catch (error) {
      console.error('Error fetching trends:', error)
    } finally {
      setFetching(false)
      setLoading(false)
    }
  }

  async function publishTopic(topic: string) {
    try {
      // Create a post from trending topic
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: topic,
          content: `This is an auto-generated post about: ${topic}. Update this content with your own article.`,
          excerpt: `Latest news about ${topic}`,
          category: 'Trending',
          tags: topic,
          status: 'published',
          is_trending_post: true,
        }),
      })

      if (res.ok) {
        alert(`Published post: ${topic}`)
      }
    } catch (error) {
      console.error('Error publishing topic:', error)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trending Topics</h1>
          <p className="text-muted-foreground">Auto-publish from Google Trends</p>
        </div>
        <Button onClick={fetchTrending} disabled={fetching} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${fetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Auto-Publish Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Publish Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoPublish"
                checked={autoPublish}
                onChange={e => setAutoPublish(e.target.checked)}
                className="h-4 w-4 rounded border border-input"
              />
              <label htmlFor="autoPublish" className="font-medium text-foreground">
                Enable Auto-Publishing
              </label>
            </div>
            <span className="text-sm text-muted-foreground">Every hour, new trending topics will be auto-published</span>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900 dark:bg-blue-900/20 dark:text-blue-200">
            <div className="flex gap-2">
              <Zap className="h-4 w-4 flex-shrink-0" />
              <div>
                <p className="font-medium">Hourly Publishing</p>
                <p className="mt-1">New trending topics will be fetched and published automatically every hour.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trending Topics List */}
      {loading ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">Loading trending topics...</CardContent>
        </Card>
      ) : topics.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No trending topics found. Click Refresh to fetch latest trends.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Latest Trending Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topics.map((topic, index) => (
                <div key={topic.id || index} className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{topic.topic}</p>
                    <p className="text-xs text-muted-foreground">
                      {topic.is_published ? '✓ Published' : 'Not published'}
                    </p>
                  </div>
                  {!topic.is_published && (
                    <Button size="sm" onClick={() => publishTopic(topic.topic)}>
                      Publish
                    </Button>
                  )}
                  {topic.is_published && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      Published
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </span>
            <div>
              <p className="font-medium text-foreground">Fetch Trends</p>
              <p className="text-muted-foreground">Every hour, we fetch the latest trending topics from Google Trends</p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              2
            </span>
            <div>
              <p className="font-medium text-foreground">Auto-Publish</p>
              <p className="text-muted-foreground">New topics are automatically published as posts on your site</p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              3
            </span>
            <div>
              <p className="font-medium text-foreground">Manual Override</p>
              <p className="text-muted-foreground">Publish or skip any topic manually using the buttons above</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
