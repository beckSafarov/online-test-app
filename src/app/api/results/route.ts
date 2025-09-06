import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = 'https://zwbsqvwaevafuyyhrumk.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { answers, session_id } = body

    // Validate required fields
    if (!answers) {
      return NextResponse.json(
        { error: 'Missing required fields: answers' },
        { status: 400 }
      )
    }

    // Validate session_id
    if (!session_id) {
      return NextResponse.json(
        { error: 'Missing required fields: session_id' },
        { status: 400 }
      )
    }

    // Insert test results record
    const { data, error } = await supabase
      .from('test_results')
      .insert({
        answers: answers,
        session_id: session_id
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create test results' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}