'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Post, Settings } from '@/lib/supabase'
import { Share2, Eye, Calendar } from 'lucide-react'

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [settings, setSettings] = useState<Partial<Settings>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
    fetchSettings()
  }, [])

  async function fetchPosts() {
    try {
      const res = await fetch('/api/posts?status=published&limit=20')
      const data = await res.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.settings) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  function shareToWhatsApp(post: Post) {
    const text = `Check out: ${post.title}\n${window.location.origin}/post/${post.slug}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      {/* Render header code from settings */}
      {settings.header_code && (
        <div dangerouslySetInnerHTML={{ __html: settings.header_code }} />
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Latest News & Stories
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {settings.site_description || 'Stay informed with our latest articles and trending topics'}
            </p>
          </div>
        </section>

        {/* AdSense Banner */}
        {settings.adsense_client_id && (
          <div className="border-b border-border bg-muted px-4 py-8 text-center text-sm text-muted-foreground">
            <p>Advertisement</p>
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adsense_client_id}`}
              crossOrigin="anonymous"
            ></script>
          </div>
        )}

        {/* Posts Grid */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-muted-foreground">No posts published yet.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map(post => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {post.featured_image_url && (
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      <img
                        src={post.featured_image_url || "/placeholder.svg"}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                      {post.category && (
                        <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                          {post.category}
                        </span>
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-xl">
                      <Link href={`/post/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {post.excerpt || post.content.substring(0, 150)}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {post.tags?.split(',').slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-accent px-2 py-1 text-xs text-accent-foreground"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views} views
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.published_at || '').toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link href={`/post/${post.slug}`} className="flex-1 rounded bg-primary px-3 py-2 text-center text-xs font-medium text-primary-foreground hover:bg-primary/90">
                        Read More
                      </Link>
                      <button
                        onClick={() => shareToWhatsApp(post)}
                        className="rounded bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
