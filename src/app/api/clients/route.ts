import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export async function GET() {
  const db = createServerClient()
  const { data, error } = await db
    .from('clients')
    .select('id, brand_name, shopify_domain, from_email, tone_of_voice, logo_url, primary_color, active, created_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json() as {
    brand_name: string
    shopify_domain: string
    resend_api_key: string
    from_email: string
    logo_url?: string
    tone_of_voice?: string
    primary_color?: string
  }

  if (!body.brand_name || !body.shopify_domain || !body.resend_api_key || !body.from_email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Generate a unique webhook secret for this client
  const webhookSecret = randomBytes(32).toString('hex')

  const db = createServerClient()
  const { data, error } = await db
    .from('clients')
    .insert({
      brand_name: body.brand_name,
      shopify_domain: body.shopify_domain.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      shopify_webhook_secret: webhookSecret,
      resend_api_key: body.resend_api_key,
      from_email: body.from_email,
      logo_url: body.logo_url ?? null,
      tone_of_voice: body.tone_of_voice ?? 'friendly',
      primary_color: body.primary_color ?? '#7C3AED',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  return NextResponse.json({
    client: data,
    webhook_url: `${appUrl}/api/webhooks/shopify/${data.id}`,
    webhook_secret: webhookSecret,
  })
}
