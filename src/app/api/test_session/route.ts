import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = 'https://zwbsqvwaevafuyyhrumk.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const testId = formData.get('test_id') as string
    const candidateName = formData.get('candidate_name') as string
    const candidatePhone = formData.get('candidate_phone') as string
    const startedAt = formData.get('started_at') as string

    // Validate required fields
    if (!testId || !candidateName || !candidatePhone || !startedAt) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: test_id, candidate_name, candidate_phone, started_at',
        },
        { status: 400 }
      )
    }

    // Insert test session record
    const { data, error } = await supabase
      .from('test_sessions')
      .insert({
        test_id: testId,
        candidate_name: candidateName,
        candidate_phone: candidatePhone,
        started_at: startedAt,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create test session' },
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const { submitted_at, is_completed, did_violate, sessionId, test_id } = body

    // Validate required fields
    if (!submitted_at || !sessionId || !test_id) {
      return NextResponse.json(
        { error: 'Missing required fields: submitted_at, sessionId, test_id' },
        { status: 400 }
      )
    }

    // Insert test session record
    const { data, error } = await supabase
      .from('test_sessions')
      .update({
        submitted_at,
        is_completed: Boolean(is_completed),
        did_violate: Boolean(did_violate),
        test_id: test_id,
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create test session' },
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
