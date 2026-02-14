import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { cookies } from 'next/headers'

async function getUserId() {
  const cookieStore = await cookies()
  return cookieStore.get('user_id')?.value
}

async function isAdmin(userId: string) {
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  return data?.role === 'admin'
}

export async function GET() {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured. Visit /setup to configure.' },
        { status: 503 }
      )
    }

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    return NextResponse.json({ settings: data })
  } catch (error) {
    console.error('Fetch settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!(await isAdmin(userId))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from('settings')
      .update({
        site_name: body.site_name,
        site_description: body.site_description,
        site_url: body.site_url,
        logo_url: body.logo_url,
        favicon_url: body.favicon_url,
        adsense_client_id: body.adsense_client_id,
        adsense_slot_ids: body.adsense_slot_ids,
        header_code: body.header_code,
        footer_code: body.footer_code,
        google_analytics_id: body.google_analytics_id,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ settings: data })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
