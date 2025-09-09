import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = 'https://zwbsqvwaevafuyyhrumk.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    // Get the ID from URL search parameters
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID parametri talab qilinadi' },
        { status: 400 }
      )
    }

    // Fetch all columns from the tests table based on the ID
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase xatosi:', error)
      return NextResponse.json(
        { error: 'Test ma’lumotlarini olish muvaffaqiyatsiz' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json({ error: 'Test topilmadi' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('API xatosi:', error)
    return NextResponse.json({ error: 'Ichki server xatosi' }, { status: 500 })
  }
}