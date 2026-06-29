import { createServerClient } from './supabase/server'
import { generateRecoveryEmail } from './claude/email-generator'
import { sendRecoveryEmail } from './resend/sender'
import type { AbandonedCart, Client } from '@/types'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

// Minutes after abandonment when each email fires
const EMAIL_DELAYS_MINUTES = {
  1: 60,     // 1 hour
  2: 1440,   // 24 hours
  3: 2880,   // 48 hours
} as const

export async function processEmailSequences(): Promise<{
  processed: number
  errors: number
}> {
  const db = createServerClient()
  let processed = 0
  let errors = 0

  // Find all carts that have a next_email_at in the past and aren't recovered/cancelled
  const { data: dueCarts, error } = await db
    .from('abandoned_carts')
    .select('*, clients(*)')
    .eq('recovered', false)
    .in('sequence_status', ['pending', 'active'])
    .lte('next_email_at', new Date().toISOString())
    .lt('emails_sent_count', 3)
    .order('next_email_at', { ascending: true })
    .limit(50) // Process max 50 per cron run to stay within timeout

  if (error) {
    console.error('[Cron] Failed to fetch due carts:', error)
    return { processed: 0, errors: 1 }
  }

  for (const row of dueCarts ?? []) {
    const cart = row as AbandonedCart & { clients: Client }
    const client = cart.clients

    if (!client) continue

    const emailNumber = (cart.emails_sent_count + 1) as 1 | 2 | 3

    try {
      await sendEmailForCart(cart, client, emailNumber)
      processed++
    } catch (err) {
      errors++
      await logError(db, client.id, cart.id, `Email ${emailNumber} failed: ${String(err)}`)
    }
  }

  return { processed, errors }
}

async function sendEmailForCart(
  cart: AbandonedCart,
  client: Client,
  emailNumber: 1 | 2 | 3
) {
  const db = createServerClient()

  const customerName = cart.customer_name?.split(' ')[0] ?? 'there'

  // Generate email with Claude
  const generatedEmail = await generateRecoveryEmail({
    emailNumber,
    customerName,
    products: cart.products,
    cartValue: cart.cart_value,
    checkoutUrl: cart.checkout_url ?? '',
    brandName: client.brand_name,
    toneOfVoice: client.tone_of_voice,
    logoUrl: client.logo_url,
    primaryColor: client.primary_color,
  })

  // Send via Resend
  const sendResult = await sendRecoveryEmail({
    resendApiKey: client.resend_api_key,
    fromEmail: client.from_email,
    fromName: client.brand_name,
    toEmail: cart.customer_email,
    toName: cart.customer_name,
    email: generatedEmail,
    cartId: cart.id,
    appUrl: APP_URL,
  })

  if (sendResult.error) {
    throw new Error(`Resend error: ${sendResult.error}`)
  }

  // Record the sent email
  await db.from('emails_sent').insert({
    cart_id: cart.id,
    client_id: client.id,
    email_number: emailNumber,
    subject: generatedEmail.subject,
    preview_text: generatedEmail.preview_text,
    body: generatedEmail.html_body,
    resend_message_id: sendResult.messageId,
  })

  // Calculate when next email should fire (or mark sequence done)
  const nextEmailNumber = emailNumber + 1
  const nextDelay = EMAIL_DELAYS_MINUTES[nextEmailNumber as keyof typeof EMAIL_DELAYS_MINUTES]

  const nextEmailAt = nextDelay
    ? new Date(new Date(cart.abandoned_at).getTime() + nextDelay * 60 * 1000).toISOString()
    : null

  await db
    .from('abandoned_carts')
    .update({
      emails_sent_count: emailNumber,
      sequence_status: emailNumber === 3 ? 'completed' : 'active',
      next_email_at: nextEmailAt,
    })
    .eq('id', cart.id)

  await logInfo(db, client.id, cart.id, `Email ${emailNumber} sent to ${cart.customer_email}`)
}

export async function scheduleFirstEmail(cartId: string, abandonedAt: string) {
  const db = createServerClient()
  const firstEmailAt = new Date(
    new Date(abandonedAt).getTime() + EMAIL_DELAYS_MINUTES[1] * 60 * 1000
  ).toISOString()

  await db
    .from('abandoned_carts')
    .update({ next_email_at: firstEmailAt, sequence_status: 'pending' })
    .eq('id', cartId)
}

export async function cancelSequenceForEmail(customerEmail: string, clientId: string) {
  const db = createServerClient()

  const { data: carts } = await db
    .from('abandoned_carts')
    .select('id')
    .eq('customer_email', customerEmail)
    .eq('client_id', clientId)
    .eq('recovered', false)

  if (!carts?.length) return

  for (const cart of carts) {
    await db
      .from('abandoned_carts')
      .update({
        recovered: true,
        recovered_at: new Date().toISOString(),
        sequence_status: 'cancelled',
      })
      .eq('id', cart.id)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function logInfo(db: any, clientId: string, cartId: string, message: string) {
  await db.from('system_logs').insert({ client_id: clientId, cart_id: cartId, level: 'info', message })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function logError(db: any, clientId: string, cartId: string, message: string) {
  await db.from('system_logs').insert({ client_id: clientId, cart_id: cartId, level: 'error', message })
}
