import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured. Visit /setup to configure.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { email, password, username, displayName, role = 'editor' } = body

    // Validation
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Email, password, and username are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${email},username.eq.${username}`)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      )
    }

    // Check if this is the first user (should be admin)
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    const isFirstUser = count === 0
    const userRole = isFirstUser ? 'admin' : role

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        username,
        display_name: displayName || username,
        role: userRole,
      })
      .select()
      .single()

    if (createError) {
      console.error('Create user error:', createError)
      
      // Provide more specific error messages
      if (createError.code === '23505') {
        return NextResponse.json(
          { error: 'User with this email or username already exists' },
          { status: 409 }
        )
      }
      
      if (createError.code === '42501') {
        return NextResponse.json(
          { error: 'Permission denied. Please check RLS policies in Supabase.' },
          { status: 403 }
        )
      }
      
      return NextResponse.json(
        { error: `Failed to create user: ${createError.message || 'Please try again.'}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        displayName: newUser.display_name,
        role: newUser.role,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
