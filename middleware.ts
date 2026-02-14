import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if Supabase env vars are configured
  const isConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Allow setup page regardless of configuration
  if (pathname === '/setup') {
    return NextResponse.next()
  }

  // If not configured and trying to access admin or login, redirect to setup
  if (!isConfigured && (pathname.startsWith('/admin') || pathname === '/login')) {
    return NextResponse.redirect(new URL('/setup', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/setup'],
}
