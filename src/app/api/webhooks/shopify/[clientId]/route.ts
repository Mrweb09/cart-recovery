import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyShopifyWebhook } from '@/lib/shopify/webhook-verify'
import { scheduleFirstEmail, cancelSequenceForEmail } from '@/lib/email-sequence'
import type { ShopifyCheckout, ShopifyOrder, CartProduct } from '@/types'

// Prevent body from being consumed before we can verify HMAC
export const config = { api: { bodyParser: false } }

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params
  const topic = request.headers.get('x-shopify-topic') ?? ''
  const hmacHeader = request.headers.get('x-shopify-hmac-sha256') ?? ''

  // Read raw body for HMAC verification
  const rawBody = await request.text()

  const db = createServerClient()

  // Load client record to get their webhook secret
  const { data: client, error: clientError } = await db
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single()

  if (clientError || !client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  // Verify authenticity — reject anything that doesn't match
  if (!verifyShopifyWebhook(rawBody, hmacHeader, client.shopify_webhook_secret)) {
    await db.from('system_logs').insert({
      client_id: clientId,
      level: 'warning',
      message: 'Webhook HMAC verification failed',
      metadata: { topic, hmac_received: hmacHeader },
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Route to the right handler
  if (topic === 'checkouts/create' || topic === 'checkouts/update') {
    await handleCheckout(db, client, payload as ShopifyCheckout)
  } else if (topic === 'orders/create' || topic === 'orders/paid') {
    await handleOrderCreated(db, client, payload as ShopifyOrder)
  }

  // Always return 200 quickly — Shopify retries on anything else
  return NextResponse.json({ ok: true })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleCheckout(db: any, client: any, checkout: ShopifyCheckout) {
  // Only process checkouts with an email — anonymous carts aren't recoverable
  if (!checkout.email) return

  const customerName =
    checkout.customer?.first_name ??
    checkout.billing_address?.first_name ??
    checkout.email.split('@')[0]

  const products: CartProduct[] = checkout.line_items.map((item) => ({
    id: item.id,
    title: item.title,
    variant_title: item.variant_title ?? null,
    price: item.price,
    quantity: item.quantity,
    image_url: null, // Shopify doesn't include images in webhook — enriched separately
  }))

  const cartValue = parseFloat(checkout.total_price) || 0
  const cartToken = checkout.token || checkout.cart_token || String(checkout.id)

  const { data: existing } = await db
    .from('abandoned_carts')
    .select('id, sequence_status, emails_sent_count')
    .eq('client_id', client.id)
    .eq('shopify_cart_token', cartToken)
    .single()

  if (existing) {
    // Only update if sequence hasn't started — don't reset timing once emails are going
    if (existing.sequence_status === 'pending') {
      await db
        .from('abandoned_carts')
        .update({
          customer_email: checkout.email,
          customer_name: customerName,
          cart_value: cartValue,
          products,
          checkout_url: checkout.abandoned_checkout_url,
          abandoned_at: new Date().toISOString(), // reset timer on activity
        })
        .eq('id', existing.id)

      await scheduleFirstEmail(existing.id, new Date().toISOString())
    }
  } else {
    const now = new Date().toISOString()
    const { data: newCart } = await db
      .from('abandoned_carts')
      .insert({
        client_id: client.id,
        shopify_cart_token: cartToken,
        customer_email: checkout.email,
        customer_name: customerName,
        cart_value: cartValue,
        products,
        checkout_url: checkout.abandoned_checkout_url,
        abandoned_at: now,
        sequence_status: 'pending',
      })
      .select('id')
      .single()

    if (newCart) {
      await scheduleFirstEmail(newCart.id, now)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleOrderCreated(db: any, client: any, order: ShopifyOrder) {
  if (!order.email) return

  // Cancel all pending sequences for this customer — they purchased
  await cancelSequenceForEmail(order.email, client.id)

  // Mark as recovered with value
  const recoveredValue = parseFloat(order.total_price) || 0
  await db
    .from('abandoned_carts')
    .update({
      recovered: true,
      recovered_at: new Date().toISOString(),
      recovered_value: recoveredValue,
      sequence_status: 'cancelled',
    })
    .eq('customer_email', order.email)
    .eq('client_id', client.id)
    .eq('recovered', false)
}
