import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  const start = Date.now()
  const checks: Record<string, { ok: boolean; latency_ms?: number; error?: string }> = {}

  // Check Supabase
  try {
    const db = createServerClient()
    const t0 = Date.now()
    const { error } = await db.from('clients').select('id').limit(1)
    checks.supabase = { ok: !error, latency_ms: Date.now() - t0, error: error?.message }
  } catch (err) {
    checks.supabase = { ok: false, error: String(err) }
  }

  // Check Claude API key present
  checks.claude_api = { ok: !!process.env.ANTHROPIC_API_KEY }

  // Check Resend key present
  checks.resend = { ok: !!process.env.RESEND_API_KEY }

  const allOk = Object.values(checks).every((c) => c.ok)

  return NextResponse.json(
    {
      status: allOk ? 'ok' : 'degraded',
      checks,
      uptime_ms: Date.now() - start,
      timestamp: new Date().toISOString(),
    },
    { status: allOk ? 200 : 503 }
  )
}
