import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = 'https://zwbsqvwaevafuyyhrumk.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { answers, session_id } = body

    // Majburiy maydonlarni tekshiring
    if (!answers) {
      return NextResponse.json(
        { error: 'Majburiy maydon yetishmaydi: answers' },
        { status: 400 }
      )
    }

    // session_id ni tekshirish
    if (!session_id) {
      return NextResponse.json(
        { error: 'Majburiy maydon yetishmaydi: session_id' },
        { status: 400 }
      )
    }

    // Insert test results record
    const { data, error } = await supabase
      .from('test_results')
      .insert({
        answers: answers,
        session_id: session_id,
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
          error: 'Test natijalarini yaratib bo‘lmadi',
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