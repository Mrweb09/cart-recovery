import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get('client_id')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 25
  const offset = (page - 1) * limit

  const db = createServerClient()
  let query = db
    .from('abandoned_carts')
    .select('*, emails_sent(count)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (clientId) query = query.eq('client_id', clientId)
  if (status === 'recovered') query = query.eq('recovered', true)
  if (status === 'active') query = query.eq('recovered', false).in('sequence_status', ['pending', 'active'])
  if (status === 'lost') query = query.eq('recovered', false).eq('sequence_status', 'completed')

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ carts: data, total: count, page, limit })
}
