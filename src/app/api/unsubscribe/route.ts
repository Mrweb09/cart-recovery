import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cartId = searchParams.get('cart')

  if (!cartId) {
    return new NextResponse('Missing cart parameter', { status: 400 })
  }

  const db = createServerClient()

  // Cancel the email sequence for this cart
  await db
    .from('abandoned_carts')
    .update({ sequence_status: 'cancelled' })
    .eq('id', cartId)
    .in('sequence_status', ['pending', 'active'])

  return new NextResponse(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Unsubscribed</title>
    <style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#09090B;color:#FAFAFA;}
    .box{text-align:center;max-width:400px;padding:40px;}</style></head>
    <body><div class="box"><h1 style="font-size:2rem;margin-bottom:1rem;">Done.</h1>
    <p style="color:#A1A1AA;">You've been unsubscribed from these cart reminders.<br/>You won't hear from us about this order again.</p></div></body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}
