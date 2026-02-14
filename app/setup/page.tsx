'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, Copy, Loader2 } from 'lucide-react'

export default function SetupPage() {
  const router = useRouter()
  const [copied, setCopied] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [configStatus, setConfigStatus] = useState({
    supabaseConfigured: false,
    databaseSetup: false,
    checking: true
  })
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    checkConfiguration()
  }, [])

  async function checkConfiguration() {
    try {
      // Check if Supabase is configured
      const envConfigured = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'your-anon-key-here'

      // Check if database is setup by trying to fetch settings
      let dbSetup = false
      if (envConfigured) {
        try {
          const res = await fetch('/api/settings')
          dbSetup = res.status !== 503
        } catch {
          dbSetup = false
        }
      }

      setConfigStatus({
        supabaseConfigured: !!envConfigured,
        databaseSetup: dbSetup,
        checking: false
      })

      // Auto-redirect if fully configured
      if (envConfigured && dbSetup) {
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (error) {
      console.error('Config check error:', error)
      setConfigStatus({ supabaseConfigured: false, databaseSetup: false, checking: false })
    }
  }

  async function verifySetup() {
    setVerifying(true)
    await checkConfiguration()
    setVerifying(false)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">NewsCMS Setup</h1>
          <p className="mt-2 text-lg text-gray-600">Get your publishing platform ready in minutes</p>
          
          {/* Status Banner */}
          {!configStatus.checking && configStatus.supabaseConfigured && configStatus.databaseSetup && (
            <div className="mt-4 rounded-lg bg-green-100 border-2 border-green-500 p-4">
              <div className="flex items-center justify-center gap-2 text-green-900">
                <CheckCircle2 className="h-5 w-5" />
                <p className="font-bold">Setup Complete! Redirecting to login...</p>
              </div>
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="mb-8 flex justify-between">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                  step >= num ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                {num}
              </div>
              <p className="mt-2 text-xs text-gray-700 sm:text-sm">
                {num === 1 && 'Create Supabase'}
                {num === 2 && 'Setup DB'}
                {num === 3 && 'Add Keys'}
                {num === 4 && 'Done!'}
              </p>
            </div>
          ))}
        </div>

        {/* Step 1: Supabase Project */}
        {step === 1 && (
          <Card className="mb-6 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">1</span>
                Create Supabase Project
              </CardTitle>
              <CardDescription>Create a free Supabase project to store your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <span className="font-bold">1.</span>
                    <span>
                      Go to{' '}
                      <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline">
                        supabase.com
                      </a>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold">2.</span>
                    <span>Click "Start your project" and sign up</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold">3.</span>
                    <span>Create a new organization and project (use free tier)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold">4.</span>
                    <span>Wait for your project to be created (2-3 minutes)</span>
                  </li>
                </ol>
              </div>
              <Button onClick={() => setStep(2)} className="w-full bg-blue-600 hover:bg-blue-700">
                Next: Setup Database
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Database Setup */}
        {step === 2 && (
          <Card className="mb-6 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">2</span>
                Setup Database
              </CardTitle>
              <CardDescription>Run SQL scripts to create tables and RLS policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-amber-50 p-4">
                <div className="mb-4 flex gap-2">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <p className="text-sm text-amber-900">Run both SQL scripts in your Supabase project to create the database structure.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-bold text-gray-900">Script 1: Create Tables</p>
                    <code className="block overflow-x-auto rounded bg-gray-100 p-2 text-xs text-gray-800">
                      /scripts/01-init-database.sql
                    </code>
                    <p className="mt-1 text-xs text-gray-600">Download this file from the project and run it in Supabase SQL Editor</p>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-bold text-gray-900">Script 2: Setup RLS Policies</p>
                    <code className="block overflow-x-auto rounded bg-gray-100 p-2 text-xs text-gray-800">
                      /scripts/02-rls-policies.sql
                    </code>
                    <p className="mt-1 text-xs text-gray-600">Run this script after the first one</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <p className="mb-3 text-sm font-bold text-green-900">How to run scripts in Supabase:</p>
                <ol className="space-y-2 text-sm text-green-800">
                  <li className="flex gap-2">
                    <span className="font-bold">1.</span>
                    <span>Go to your Supabase project dashboard</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">2.</span>
                    <span>Click "SQL Editor" in the left menu</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">3.</span>
                    <span>Click "New Query" and paste the SQL content</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">4.</span>
                    <span>Click "Run" and verify success</span>
                  </li>
                </ol>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Next: Add API Keys
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Environment Variables */}
        {step === 3 && (
          <Card className="mb-6 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">3</span>
                Add Environment Variables
              </CardTitle>
              <CardDescription>Configure your project with Supabase credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="mb-3 text-sm font-bold text-blue-900">Get your Supabase credentials:</p>
                <ol className="space-y-2 text-sm text-blue-800">
                  <li className="flex gap-2">
                    <span className="font-bold">1.</span>
                    <span>Open your Supabase project dashboard</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">2.</span>
                    <span>Click "Settings" → "API" in the left menu</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">3.</span>
                    <span>Copy "Project URL" and "Anon Public Key"</span>
                  </li>
                </ol>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-gray-300 bg-white p-4">
                  <p className="mb-3 text-sm font-bold text-gray-900">Create .env.local file in your project root:</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700">NEXT_PUBLIC_SUPABASE_URL</label>
                      <div className="mt-1 flex gap-2">
                        <code className="flex-1 truncate rounded bg-gray-100 px-3 py-2 text-xs text-gray-800">
                          https://your-project.supabase.co
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co', 'url')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700">NEXT_PUBLIC_SUPABASE_ANON_KEY</label>
                      <div className="mt-1 flex gap-2">
                        <code className="flex-1 truncate rounded bg-gray-100 px-3 py-2 text-xs text-gray-800">
                          your-anon-key-here
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here', 'key')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-gray-600">Replace the values with your actual Supabase credentials</p>
                </div>

                <div className="rounded-lg bg-purple-50 p-4">
                  <p className="text-sm font-bold text-purple-900">Or use Vercel Environment Variables:</p>
                  <ol className="mt-2 space-y-2 text-sm text-purple-800">
                    <li className="flex gap-2">
                      <span className="font-bold">1.</span>
                      <span>Go to your Vercel project settings</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">2.</span>
                      <span>Click "Environment Variables"</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">3.</span>
                      <span>Add the two variables above</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">4.</span>
                      <span>Redeploy your project</span>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(4)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Next: Verify Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <Card className="mb-6 border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                Verify Setup
              </CardTitle>
              <CardDescription>Check if everything is configured correctly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Configuration Status */}
              <div className="rounded-lg border-2 border-gray-300 bg-white p-4">
                <p className="mb-3 text-sm font-bold text-gray-900">Configuration Status:</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {configStatus.checking ? (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    ) : configStatus.supabaseConfigured ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm text-gray-700">
                      Supabase environment variables {configStatus.supabaseConfigured ? 'configured' : 'not configured'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {configStatus.checking ? (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    ) : configStatus.databaseSetup ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm text-gray-700">
                      Database tables {configStatus.databaseSetup ? 'initialized' : 'not initialized'}
                    </span>
                  </div>
                </div>
                
                {!configStatus.supabaseConfigured && !configStatus.checking && (
                  <div className="mt-3 rounded bg-yellow-50 p-3 text-xs text-yellow-900">
                    <p className="font-bold">Action Required:</p>
                    <p className="mt-1">Add your Supabase credentials to .env.local and restart the dev server</p>
                  </div>
                )}
                
                {configStatus.supabaseConfigured && !configStatus.databaseSetup && !configStatus.checking && (
                  <div className="mt-3 rounded bg-yellow-50 p-3 text-xs text-yellow-900">
                    <p className="font-bold">Action Required:</p>
                    <p className="mt-1">Run the SQL scripts in your Supabase project to create the database tables</p>
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-green-100 p-4">
                <p className="mb-3 text-sm font-bold text-green-900">Setup Checklist:</p>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex gap-2">
                    <span className={configStatus.supabaseConfigured ? "text-green-600" : "text-gray-400"}>✓</span>
                    <span>Supabase project created</span>
                  </li>
                  <li className="flex gap-2">
                    <span className={configStatus.databaseSetup ? "text-green-600" : "text-gray-400"}>✓</span>
                    <span>Database tables initialized</span>
                  </li>
                  <li className="flex gap-2">
                    <span className={configStatus.databaseSetup ? "text-green-600" : "text-gray-400"}>✓</span>
                    <span>RLS policies configured</span>
                  </li>
                  <li className="flex gap-2">
                    <span className={configStatus.supabaseConfigured ? "text-green-600" : "text-gray-400"}>✓</span>
                    <span>Environment variables added</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-gray-300 bg-white p-4">
                <p className="mb-3 text-sm font-bold text-gray-900">Next Steps:</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-blue-600">→</span>
                    <span>After adding .env.local, restart your development server (Ctrl+C then pnpm dev)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">→</span>
                    <span>Click "Verify Setup" below to check configuration</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">→</span>
                    <span>Create your admin account at <a href="/register" className="font-bold text-blue-600 hover:underline">/register</a></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600">→</span>
                    <span>Or use default credentials if you ran the SQL init script</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400">  </span>
                    <span className="text-xs">
                      <code className="rounded bg-gray-100 px-1.5 py-0.5">admin@example.com</code> / <code className="rounded bg-gray-100 px-1.5 py-0.5">admin123</code>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={verifySetup}
                  disabled={verifying}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Setup'
                  )}
                </Button>
                
                {configStatus.supabaseConfigured && configStatus.databaseSetup && (
                  <>
                    <a href="/register" className="block w-full rounded-lg bg-green-600 px-4 py-3 text-center font-bold text-white hover:bg-green-700">
                      Create Admin Account
                    </a>
                    <a href="/login" className="block w-full rounded-lg border-2 border-green-600 bg-white px-4 py-3 text-center font-bold text-green-700 hover:bg-green-50">
                      Login (if account exists)
                    </a>
                  </>
                )}
                
                <a href="/" className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center font-bold text-gray-900 hover:bg-gray-50">
                  View Homepage
                </a>
              </div>

              <p className="text-xs text-gray-600">
                Need help? Check SETUP_GUIDE.md in your project for detailed instructions.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>NewsCMS • WordPress-like Publishing Platform</p>
        </div>
      </div>
    </div>
  )
}
