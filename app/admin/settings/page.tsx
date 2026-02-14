'use client'

import React from "react"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings as SettingsType } from '@/lib/supabase'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Partial<SettingsType>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.settings) {
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        alert('Settings saved successfully!')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
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
        <h1 className="text-3xl font-bold text-foreground">Site Settings</h1>
        <p className="text-muted-foreground">Configure your website and integrations</p>
      </div>

      <form onSubmit={saveSettings} className="space-y-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Site Name</label>
              <input
                type="text"
                value={settings.site_name || ''}
                onChange={e => setSettings({ ...settings, site_name: e.target.value })}
                className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Site Description</label>
              <textarea
                value={settings.site_description || ''}
                onChange={e => setSettings({ ...settings, site_description: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Site URL</label>
              <input
                type="url"
                value={settings.site_url || ''}
                onChange={e => setSettings({ ...settings, site_url: e.target.value })}
                className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground">Logo URL</label>
                <input
                  type="url"
                  value={settings.logo_url || ''}
                  onChange={e => setSettings({ ...settings, logo_url: e.target.value })}
                  className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Favicon URL</label>
                <input
                  type="url"
                  value={settings.favicon_url || ''}
                  onChange={e => setSettings({ ...settings, favicon_url: e.target.value })}
                  className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AdSense Settings */}
        <Card>
          <CardHeader>
            <CardTitle>AdSense Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">AdSense Client ID</label>
              <input
                type="text"
                placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                value={settings.adsense_client_id || ''}
                onChange={e => setSettings({ ...settings, adsense_client_id: e.target.value })}
                className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-muted-foreground">Your Google AdSense publisher ID</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">AdSense Slot IDs (JSON)</label>
              <textarea
                placeholder='[{"position": "header", "slot": "1234567890"}, {"position": "sidebar", "slot": "0987654321"}]'
                value={settings.adsense_slot_ids || ''}
                onChange={e => setSettings({ ...settings, adsense_slot_ids: e.target.value })}
                rows={4}
                className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Header & Footer Code */}
        <Card>
          <CardHeader>
            <CardTitle>Header & Footer Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Header Code (Meta Tags, Analytics)</label>
              <textarea
                placeholder="<meta name='description' content='...' />"
                value={settings.header_code || ''}
                onChange={e => setSettings({ ...settings, header_code: e.target.value })}
                rows={6}
                className="mt-1 w-full rounded border border-input bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-muted-foreground">Injected in &lt;head&gt;</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Footer Code (Analytics, Scripts)</label>
              <textarea
                placeholder="<script>...</script>"
                value={settings.footer_code || ''}
                onChange={e => setSettings({ ...settings, footer_code: e.target.value })}
                rows={6}
                className="mt-1 w-full rounded border border-input bg-background px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-muted-foreground">Injected before &lt;/body&gt;</p>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Google Analytics ID</label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={settings.google_analytics_id || ''}
                onChange={e => setSettings({ ...settings, google_analytics_id: e.target.value })}
                className="mt-1 w-full rounded border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}
