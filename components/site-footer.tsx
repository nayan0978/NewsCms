'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Settings } from '@/lib/supabase'

export function SiteFooter() {
  const [settings, setSettings] = useState<Partial<Settings>>({})

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
    }
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* About */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
              {settings.site_name || 'NewsCMS'}
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
              {settings.site_description || 'A modern news publishing platform'}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Links</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Follow Us</h4>
            <div className="mt-4 flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10a10 10 0 11-20 0 10 10 0 0120 0zm-8.5-4a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-3 7a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.337 16.337H13.67v-5.013c0-1.193-.42-2.069-1.543-2.069-.84 0-1.34.567-1.56 1.116-.08.198-.1.474-.1.75v5.216h-2.667V6.885h2.667v1.055c.33-.51.919-1.231 2.29-1.231 1.67 0 2.93 1.092 2.93 3.441v6.187zM2.896 5.818a1.549 1.549 0 11-.003-3.098 1.549 1.549 0 01.003 3.098zm1.34 10.519H1.556V6.885h2.68v9.452zM17.668 1H2.331A1.327 1.327 0 001 2.327v15.346A1.327 1.327 0 002.331 19h15.337A1.328 1.328 0 0019 17.673V2.327A1.328 1.328 0 0017.668 1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {settings.site_name || 'NewsCMS'}. All rights reserved.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Powered by NewsCMS - WordPress-like Publishing Platform
          </p>
        </div>
      </div>

      {/* Render footer code from settings */}
      {settings.footer_code && (
        <div dangerouslySetInnerHTML={{ __html: settings.footer_code }} />
      )}
    </footer>
  )
}
