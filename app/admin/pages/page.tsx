'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Edit2 } from 'lucide-react'
import { Page } from '@/lib/supabase'

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPages()
  }, [])

  async function fetchPages() {
    try {
      const res = await fetch('/api/pages?status=all&limit=100')
      const data = await res.json()
      setPages(data.pages || [])
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deletePage(id: string) {
    if (!confirm('Are you sure you want to delete this page?')) return

    try {
      const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPages(pages.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Error deleting page:', error)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pages</h1>
          <p className="text-muted-foreground">Manage static pages like About, Contact, etc.</p>
        </div>
        <Link href="/admin/pages/new">
          <Button>Create Page</Button>
        </Link>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">Loading pages...</CardContent>
        </Card>
      ) : pages.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No pages found. <Link href="/admin/pages/new" className="underline">Create one</Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pages.map(page => (
                <div key={page.id} className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{page.title}</p>
                    <p className="text-sm text-muted-foreground">/{page.slug}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    page.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {page.status}
                  </span>
                  <div className="ml-4 flex gap-2">
                    <Link href={`/admin/pages/${page.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </Link>
                    <button
                      onClick={() => deletePage(page.id)}
                      className="rounded p-1 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
