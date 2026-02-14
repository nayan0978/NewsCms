'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Page } from '@/lib/supabase'

export default function PageEditorPage() {
  const router = useRouter()
  const params = useParams()
  const pageId = params.id as string
  const isNew = pageId === 'new'

  const [page, setPage] = useState<Partial<Page>>({
    title: '',
    content: '',
    status: 'draft',
  })
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isNew) {
      fetchPage()
    }
  }, [pageId])

  async function fetchPage() {
    try {
      const res = await fetch(`/api/pages/${pageId}`)
      const data = await res.json()
      if (data.page) {
        setPage(data.page)
      }
    } catch (error) {
      console.error('Error fetching page:', error)
    } finally {
      setLoading(false)
    }
  }

  async function savePage(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const url = isNew ? '/api/pages' : `/api/pages/${pageId}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page),
      })

      if (res.ok) {
        router.push('/admin/pages')
      }
    } catch (error) {
      console.error('Error saving page:', error)
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
        <h1 className="text-3xl font-bold text-foreground">{isNew ? 'Create Page' : 'Edit Page'}</h1>
      </div>

      <form onSubmit={savePage} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Title</label>
              <input
                type="text"
                value={page.title || ''}
                onChange={e => setPage({ ...page, title: e.target.value })}
                className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Content</label>
              <textarea
                value={page.content || ''}
                onChange={e => setPage({ ...page, content: e.target.value })}
                rows={15}
                className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Status</label>
              <select
                value={page.status || 'draft'}
                onChange={e => setPage({ ...page, status: e.target.value as any })}
                className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Page'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
