'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload } from 'lucide-react'

export default function BulkImportPage() {
  const [csvContent, setCsvContent] = useState('')
  const [importing, setImporting] = useState(false)
  const [status, setStatus] = useState('')
  const [importedCount, setImportedCount] = useState(0)

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = event => {
        setCsvContent(event.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  async function startImport() {
    if (!csvContent.trim()) {
      alert('Please select a CSV file or enter data')
      return
    }

    setImporting(true)
    setStatus('Processing...')

    try {
      // Parse CSV
      const lines = csvContent.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      const posts = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        if (values.length > 0 && values[0]) {
          const post: any = {}
          headers.forEach((header, index) => {
            post[header] = values[index] || ''
          })
          posts.push(post)
        }
      }

      // Send to API
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts }),
      })

      const data = await res.json()
      setImportedCount(data.count)
      setStatus(`Successfully imported ${data.count} posts!`)
      setCsvContent('')
    } catch (error) {
      console.error('Import error:', error)
      setStatus('Error during import. Please check your data.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bulk Import</h1>
        <p className="text-muted-foreground">Import multiple posts from CSV file</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Import from CSV</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border-2 border-dashed border-border p-6">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <label className="mt-4 block cursor-pointer">
                  <span className="text-sm font-medium text-primary hover:underline">Choose file</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <p className="mt-2 text-xs text-muted-foreground">or drag and drop</p>
              </div>
            </div>

            {csvContent && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Preview (first 3 rows)</p>
                <pre className="max-h-32 overflow-auto rounded bg-muted p-2 text-xs">
                  {csvContent.split('\n').slice(0, 3).join('\n')}
                </pre>
              </div>
            )}

            <Button onClick={startImport} disabled={importing || !csvContent.trim()} className="w-full">
              {importing ? 'Importing...' : 'Start Import'}
            </Button>

            {status && (
              <div className={`rounded p-3 text-sm ${importedCount > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {status}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Format Guide */}
        <Card>
          <CardHeader>
            <CardTitle>CSV Format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-medium text-foreground">Required Columns:</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• <code className="bg-muted px-1">title</code> - Post title</li>
                <li>• <code className="bg-muted px-1">content</code> - Post content</li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-foreground">Optional Columns:</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>• <code className="bg-muted px-1">excerpt</code> - Short description</li>
                <li>• <code className="bg-muted px-1">featured_image_url</code> - Image URL</li>
                <li>• <code className="bg-muted px-1">category</code> - Category name</li>
                <li>• <code className="bg-muted px-1">tags</code> - Comma-separated tags</li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-foreground">Example CSV:</p>
              <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
{`title,content,category,tags
Breaking News,Article content here,News,breaking
Tech Update,Content about tech,Technology,tech,update`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Paste Raw CSV */}
      <Card>
        <CardHeader>
          <CardTitle>Or Paste CSV Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={csvContent}
            onChange={e => setCsvContent(e.target.value)}
            placeholder="title,content,category,tags&#10;Breaking News,Article content,News,breaking"
            rows={8}
            className="w-full rounded border border-input bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button onClick={startImport} disabled={importing || !csvContent.trim()} className="w-full">
            {importing ? 'Importing...' : 'Import Posts'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
