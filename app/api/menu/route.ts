import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
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
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('order_index')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ items: data })
  } catch (error) {
    console.error('Fetch menu error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { label, url, order_index, parent_id } = body

    const { data, error } = await supabase
      .from('menu_items')
      .insert([{ label, url, order_index: order_index || 0, parent_id }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ item: data }, { status: 201 })
  } catch (error) {
    console.error('Create menu item error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
