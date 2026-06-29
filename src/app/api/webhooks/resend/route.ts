import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

// Resend sends webhooks for email events (opens, clicks)
// Configure in Resend dashboard: Webhooks → Add endpoint → your-domain.com/api/webhooks/resend
export async function POST(request: NextRequest) {
  const payload = await request.json() as {
    type: string
    data: {
      email_id: string
      created_at: string
    }
  }

  const db = createServerClient()
  const messageId = payload.data?.email_id

  if (!messageId) return NextResponse.json({ ok: true })

  if (payload.type === 'email.opened') {
    await db
      .from('emails_sent')
      .update({ opened: true, opened_at: new Date().toISOString() })
      .eq('resend_message_id', messageId)
      .eq('opened', false) // Only update first open
  }

  if (payload.type === 'email.clicked') {
    await db
      .from('emails_sent')
      .update({ clicked: true, clicked_at: new Date().toISOString() })
      .eq('resend_message_id', messageId)
      .eq('clicked', false)
  }

  return NextResponse.json({ ok: true })
}
