import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseKey

export type User = {
  id: string
  email: string
  username: string
  display_name: string | null
  avatar_url: string | null
  role: 'admin' | 'editor' | 'viewer'
  created_at: string
}

export type Post = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image_url: string | null
  author_id: string
  status: 'draft' | 'published' | 'scheduled'
  views: number
  is_trending_post: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  category: string | null
  tags: string | null
}

export type Page = {
  id: string
  title: string
  slug: string
  content: string
  author_id: string
  status: 'draft' | 'published'
  published_at: string | null
  created_at: string
  updated_at: string
}

export type Settings = {
  id: string
  site_name: string | null
  site_description: string | null
  site_url: string | null
  logo_url: string | null
  favicon_url: string | null
  adsense_client_id: string | null
  adsense_slot_ids: string | null
  header_code: string | null
  footer_code: string | null
  google_analytics_id: string | null
  created_at: string
  updated_at: string
}

export type MenuItem = {
  id: string
  label: string
  url: string
  order_index: number
  parent_id: string | null
  created_at: string
}
