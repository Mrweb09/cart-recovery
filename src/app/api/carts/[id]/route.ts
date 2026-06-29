import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = createServerClient()

  const { data: cart, error } = await db
    .from('abandoned_carts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: 'Cart not found' }, { status: 404 })

  const { data: emails } = await db
    .from('emails_sent')
    .select('*')
    .eq('cart_id', id)
    .order('email_number', { ascending: true })

  return NextResponse.json({ cart, emails: emails ?? [] })
}
