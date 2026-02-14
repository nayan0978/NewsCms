import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateSlug } from '@/lib/auth'
import { cookies } from 'next/headers'

async function getUserId() {
  const cookieStore = await cookies()
  return cookieStore.get('user_id')?.value
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('Fetch post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, excerpt, featured_image_url, category, tags, status } = body

    // Check ownership and get current post data
    const { data: post } = await supabase
      .from('posts')
      .select('*')
      .eq('id', params.id)
      .single()

    if (post?.author_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const slug = title ? generateSlug(title) : undefined
    
    // Handle published_at properly
    let published_at = post.published_at
    if (status === 'published' && !post.published_at) {
      published_at = new Date().toISOString()
    } else if (status === 'draft' || status === 'scheduled') {
      published_at = null
    }

    const { data, error } = await supabase
      .from('posts')
      .update({
        ...(title && { title }),
        ...(slug && { slug }),
        ...(content !== undefined && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(featured_image_url !== undefined && { featured_image_url }),
        ...(category !== undefined && { category }),
        ...(tags !== undefined && { tags }),
        ...(status && { status }),
        published_at,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ post: data })
  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check ownership
    const { data: post } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', params.id)
      .single()

    if (post?.author_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase.from('posts').delete().eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
