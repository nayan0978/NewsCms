import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

async function getUserId() {
  const cookieStore = await cookies()
  return cookieStore.get('user_id')?.value
}

// Simulated Google Trends API (in production, use actual Google Trends API)
async function fetchGoogleTrends() {
  const trends = [
    'artificial intelligence breakthrough',
    'climate change news',
    'technology trends 2026',
    'space exploration latest',
    'health and wellness tips',
    'cryptocurrency updates',
    'social media news',
    'cybersecurity threats',
  ]

  return trends.sort(() => Math.random() - 0.5).slice(0, 5)
}

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('trending_topics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ topics: data })
  } catch (error) {
    console.error('Fetch trending error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch latest trends
    const trends = await fetchGoogleTrends()

    // Add to database
    const newTrends = []
    for (const trend of trends) {
      const { data, error } = await supabase
        .from('trending_topics')
        .upsert([{ topic: trend }], { onConflict: 'topic' })
        .select()

      if (!error && data) {
        newTrends.push(data[0])
      }
    }

    return NextResponse.json({
      message: 'Trends fetched and saved',
      count: newTrends.length,
      topics: newTrends,
    })
  } catch (error) {
    console.error('Fetch trends error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
