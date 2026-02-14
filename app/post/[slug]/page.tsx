'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card } from '@/components/ui/card'
import { Post, Settings } from '@/lib/supabase'
import { ArrowLeft, Calendar, Eye, Share2 } from 'lucide-react'

export default function PostPage() {
  const params = useParams()
  const slug = params.slug as string

  const [post, setPost] = useState<Post | null>(null)
  const [settings, setSettings] = useState<Partial<Settings>>({})
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])

  useEffect(() => {
    fetchPost()
    fetchSettings()
  }, [slug])

  async function fetchPost() {
    try {
      const res = await fetch(`/api/posts/${slug}`)
      const data = await res.json()
      if (data.post) {
        setPost(data.post)
        incrementViews(data.post.id)
        fetchRelatedPosts(data.post.category, data.post.id)
      }
    } catch (error) {
      console.error('Error fetching post:', error)
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

  async function fetchRelatedPosts(category: string | null, postId: string) {
    if (!category) return
    try {
      const res = await fetch(`/api/posts?status=published&limit=3`)
      const data = await res.json()
      if (data.posts) {
        setRelatedPosts(data.posts.filter((p: Post) => p.category === category && p.id !== postId).slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching related posts:', error)
    }
  }

  async function incrementViews(postId: string) {
    try {
      await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ views: (post?.views || 0) + 1 }),
      })
    } catch (error) {
      console.error('Error incrementing views:', error)
    }
  }

  function shareToWhatsApp() {
    if (!post) return
    const text = `Check out: ${post.title}\n${window.location.href}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 px-4 py-12 text-center text-muted-foreground">
          Loading...
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Post not found</h1>
            <Link href="/" className="mt-4 inline-block text-primary hover:underline">
              Back to home
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* Article */}
        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to articles
          </Link>

          {post.category && (
            <span className="mt-4 inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              {post.category}
            </span>
          )}

          <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="mt-6 flex flex-wrap gap-6 border-b border-border pb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(post.published_at || '').toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {post.views} views
            </div>
          </div>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="mt-8 overflow-hidden rounded-lg">
              <img
                src={post.featured_image_url || "/placeholder.svg"}
                alt={post.title}
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-sm dark:prose-invert mt-8 max-w-none text-foreground">
            <div
              className="text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
              {post.tags.split(',').map(tag => (
                <Link
                  key={tag}
                  href={`/?tag=${encodeURIComponent(tag.trim())}`}
                  className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground hover:bg-accent/80"
                >
                  #{tag.trim()}
                </Link>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="mt-8 flex gap-3 border-t border-border pt-6">
            <button
              onClick={shareToWhatsApp}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
            >
              <Share2 className="h-4 w-4" />
              Share on WhatsApp
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 font-medium text-foreground hover:bg-accent"
            >
              Print
            </button>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-border bg-muted px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-foreground">Related Articles</h2>
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost.id}
                    href={`/post/${relatedPost.slug}`}
                    className="group rounded-lg border border-border bg-background p-4 hover:shadow-md transition-shadow"
                  >
                    {relatedPost.featured_image_url && (
                      <div className="relative h-32 w-full overflow-hidden rounded bg-muted">
                        <img
                          src={relatedPost.featured_image_url || "/placeholder.svg"}
                          alt={relatedPost.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <h3 className="mt-3 line-clamp-2 font-medium text-foreground group-hover:text-primary">
                      {relatedPost.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(relatedPost.published_at || '').toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* AdSense */}
        {settings.adsense_client_id && (
          <div className="border-t border-border bg-muted px-4 py-8 text-center text-sm text-muted-foreground">
            <p>Advertisement</p>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
