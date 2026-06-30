import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const body = await request.json() as {
    email: string
    monthly_revenue: number
    estimated_lost: number
    estimated_recoverable: number
    shopify_domain?: string
  }

  if (!body.email || !body.monthly_revenue) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const db = createServerClient()
  const { error } = await db.from('calculator_leads').insert({
    email: body.email,
    monthly_revenue: body.monthly_revenue,
    estimated_lost: body.estimated_lost,
    estimated_recoverable: body.estimated_recoverable,
    shopify_domain: body.shopify_domain ?? null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
