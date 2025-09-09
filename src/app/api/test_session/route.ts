import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = 'https://zwbsqvwaevafuyyhrumk.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { testId, candidateName, candidatePhone, startedAt } = body

    // Majburiy maydonlarni tekshirish
    if (!testId || !candidateName || !candidatePhone || !startedAt) {
      return NextResponse.json(
        {
          error:
            'Majburiy maydonlar yetishmaydi: test_id, candidate_name, candidate_phone, started_at',
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
      console.error('Supabase xatosi tafsilotlari:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      return NextResponse.json(
        {
          error: 'Test sessiyasini yaratib bo‘lmadi',
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API xatosi:', error)
    return NextResponse.json({ error: 'Ichki server xatosi' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      submitted_at,
      is_completed,
      did_violate,
      sessionId,
      test_id,
      is_open,
    } = body

    // Majburiy maydonlarni tekshirish
    if (!submitted_at || !sessionId || !test_id) {
      return NextResponse.json(
        {
          error:
            'Majburiy maydonlar yetishmaydi: submitted_at, sessionId, test_id',
        },
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
        is_open: Boolean(is_open),
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) {
      console.error('Supabase xatosi tafsilotlari:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      return NextResponse.json(
        {
          error: 'Test sessiyasini yangilab bo‘lmadi',
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API xatosi:', error)
    return NextResponse.json({ error: 'Ichki server xatosi' }, { status: 500 })
  }
}
