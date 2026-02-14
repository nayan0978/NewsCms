import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

async function getUserId() {
  const cookieStore = await cookies()
  return cookieStore.get('user_id')?.value
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { posts } = body

    if (!Array.isArray(posts) || posts.length === 0) {
      return NextResponse.json({ error: 'Invalid posts array' }, { status: 400 })
    }

    // Insert import queue items
    const importItems = posts.map((post: any) => ({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || null,
      featured_image_url: post.featured_image_url || null,
      category: post.category || null,
      tags: post.tags || null,
      status: 'pending',
    }))

    const { data, error } = await supabase
      .from('import_queue')
      .insert(importItems)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Process imports asynchronously
    processImports(data)

    return NextResponse.json({
      message: 'Import started',
      count: data.length,
      items: data,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function processImports(items: any[]) {
  for (const item of items) {
    try {
      await supabase
        .from('import_queue')
        .update({ status: 'processing' })
        .eq('id', item.id)

      // TODO: Add author_id when user context is available
      const { error: insertError } = await supabase.from('posts').insert([
        {
          title: item.title,
          slug: item.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-'),
          content: item.content,
          excerpt: item.excerpt,
          featured_image_url: item.featured_image_url,
          category: item.category,
          tags: item.tags,
          status: 'published',
          author_id: '00000000-0000-0000-0000-000000000000', // System user
          published_at: new Date().toISOString(),
        },
      ])

      if (insertError) {
        await supabase
          .from('import_queue')
          .update({ status: 'failed', error_message: insertError.message })
          .eq('id', item.id)
      } else {
        await supabase
          .from('import_queue')
          .update({ status: 'completed' })
          .eq('id', item.id)
      }
    } catch (error) {
      await supabase
        .from('import_queue')
        .update({ status: 'failed', error_message: String(error) })
        .eq('id', item.id)
    }
  }
}
