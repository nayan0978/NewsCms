'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Post } from '@/lib/supabase'

export default function PostEditorPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  const isNew = postId === 'new'

  const [post, setPost] = useState<Partial<Post>>({
    title: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    category: '',
    tags: '',
    status: 'draft',
  })
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNew) {
      fetchPost()
    }
  }, [postId])

  async function fetchPost() {
    try {
      const res = await fetch(`/api/posts/${postId}`)
      const data = await res.json()
      if (data.post) {
        setPost(data.post)
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  async function savePost(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const url = isNew ? '/api/posts' : `/api/posts/${postId}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })

      if (res.ok) {
        router.push('/admin/posts')
      }
    } catch (error) {
      console.error('Error saving post:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{isNew ? 'Create Post' : 'Edit Post'}</h1>
      </div>

      <form onSubmit={savePost} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Title</label>
              <input
                type="text"
                value={post.title || ''}
                onChange={e => setPost({ ...post, title: e.target.value })}
                className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Content</label>
              <textarea
                value={post.content || ''}
                onChange={e => setPost({ ...post, content: e.target.value })}
                rows={12}
                className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground">Excerpt</label>
                <textarea
                  value={post.excerpt || ''}
                  onChange={e => setPost({ ...post, excerpt: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Featured Image URL</label>
                <input
                  type="url"
                  value={post.featured_image_url || ''}
                  onChange={e => setPost({ ...post, featured_image_url: e.target.value })}
                  className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground">Category</label>
                <input
                  type="text"
                  value={post.category || ''}
                  onChange={e => setPost({ ...post, category: e.target.value })}
                  className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={post.tags || ''}
                  onChange={e => setPost({ ...post, tags: e.target.value })}
                  className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Status</label>
              <select
                value={post.status || 'draft'}
                onChange={e => setPost({ ...post, status: e.target.value as any })}
                className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Post'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
