import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({ hasUsers: false, configured: false }, { status: 200 })
    }

    // Check if any users exist
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Check users error:', error)
      return NextResponse.json({ hasUsers: false, error: 'Database not initialized' }, { status: 200 })
    }

    return NextResponse.json({ 
      hasUsers: (count || 0) > 0,
      configured: true,
      userCount: count || 0
    })
  } catch (error) {
    console.error('Error checking users:', error)
    return NextResponse.json({ hasUsers: false, error: 'Server error' }, { status: 500 })
  }
}
