import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateSlug } from '@/lib/auth'
import { cookies } from 'next/headers'

async function getUserId() {
  const cookieStore = await cookies()
  return cookieStore.get('user_id')?.value
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const status = searchParams.get('status') || 'published'

    let query = supabase.from('pages').select('*')

    if (slug) {
      query = query.eq('slug', slug).single()
    } else {
      query = query.order('created_at', { ascending: false })
      if (status !== 'all') {
        query = query.eq('status', status)
      }
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ page: data, pages: Array.isArray(data) ? data : undefined })
  } catch (error) {
    console.error('Fetch pages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, status } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content required' }, { status: 400 })
    }

    const slug = generateSlug(title)

    const { data, error } = await supabase
      .from('pages')
      .insert([
        {
          title,
          slug,
          content,
          status: status || 'draft',
          author_id: userId,
          published_at: status === 'published' ? new Date().toISOString() : null,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ page: data }, { status: 201 })
  } catch (error) {
    console.error('Create page error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
