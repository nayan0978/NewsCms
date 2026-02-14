'use client'

import React, { useEffect } from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [notConfigured, setNotConfigured] = useState(false)
  const [noUsers, setNoUsers] = useState(false)

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const res = await fetch('/api/settings')
        if (res.status === 503) {
          setNotConfigured(true)
        }
        
        // Check if any users exist
        const usersRes = await fetch('/api/auth/check-users')
        if (usersRes.ok) {
          const data = await usersRes.json()
          setNoUsers(!data.hasUsers && data.configured)
        }
      } catch {
        setNotConfigured(true)
      }
    }
    checkConfig()
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (res.status === 503) {
        router.push('/setup')
      } else if (res.ok) {
        const data = await res.json()
        router.push('/admin')
      } else {
        const data = await res.json()
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-4 text-center">
            <h1 className="text-3xl font-bold text-foreground">NewsCMS</h1>
            <p className="mt-1 text-sm text-muted-foreground">Professional News Publishing Platform</p>
          </div>
          <CardTitle className="text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          {notConfigured && (
            <div className="mb-4 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-900">
              <p className="font-bold">Setup Required</p>
              <p className="mt-1 text-xs">Supabase is not configured. Visit the setup page to configure your database.</p>
              <a href="/setup" className="mt-3 inline-block rounded bg-yellow-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-yellow-700">
                Go to Setup
              </a>
            </div>
          )}
          
          {noUsers && !notConfigured && (
            <div className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
              <div className="flex gap-2">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-bold">No Users Found</p>
                  <p className="mt-1 text-xs">Create your admin account to get started.</p>
                  <a href="/register" className="mt-3 inline-block rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700">
                    Create Admin Account
                  </a>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4" disabled={notConfigured}>
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/register" className="font-medium text-primary hover:underline">
              Register
            </Link>
          </div>

          {!noUsers && (
            <div className="mt-6 rounded-lg bg-muted p-4">
              <p className="text-xs font-medium text-foreground">Default Credentials (if used SQL script):</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Email: <code className="font-mono">admin@example.com</code>
              </p>
              <p className="text-xs text-muted-foreground">
                Password: <code className="font-mono">admin123</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
