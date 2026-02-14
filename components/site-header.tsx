'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Settings } from '@/lib/supabase'

export function SiteHeader() {
  const [settings, setSettings] = useState<Partial<Settings>>({})
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuItems, setMenuItems] = useState<any[]>([])

  useEffect(() => {
    fetchSettings()
    fetchMenuItems()
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
    }
  }

  async function fetchMenuItems() {
    try {
      const res = await fetch('/api/menu')
      const data = await res.json()
      if (data.items) {
        setMenuItems(data.items)
      }
    } catch (error) {
      console.error('Error fetching menu:', error)
    }
  }

  return (
    <header className="sticky top-0 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {settings.logo_url ? (
            <img src={settings.logo_url || "/placeholder.svg"} alt={settings.site_name} className="h-8 w-auto" />
          ) : (
            <div className="text-xl font-bold text-foreground">{settings.site_name || 'NewsCMS'}</div>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary">
            Home
          </Link>
          {menuItems.map(item => (
            <Link
              key={item.id}
              href={item.url}
              className="text-sm font-medium text-foreground hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary">
            About
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 hover:bg-accent md:hidden"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="border-t border-border px-4 py-4 md:hidden">
          <div className="space-y-2">
            <Link href="/" className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded">
              Home
            </Link>
            {menuItems.map(item => (
              <Link
                key={item.id}
                href={item.url}
                className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/about" className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded">
              About
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
