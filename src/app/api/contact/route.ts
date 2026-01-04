import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY) {
      console.error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY environment variable')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { email, query } = body

    // Validate email
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate query
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Validate query word count (max 200 words)
    const wordCount = query.trim().split(/\s+/).length
    if (wordCount > 200) {
      return NextResponse.json(
        { error: `Query exceeds 200 words limit. Current: ${wordCount} words` },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Insert into contact_queries table
    const { data, error } = await supabase
      .from('contact_queries')
      .insert({
        email: email.toLowerCase().trim(),
        query: query.trim(),
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to submit query. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Your query has been submitted successfully!',
        data 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}

