import { NextRequest, NextResponse } from 'next/server'
import { processEmailSequences } from '@/lib/email-sequence'

// Vercel cron hits this every 5 minutes (see vercel.json)
export async function GET(request: NextRequest) {
  // Protect against external calls
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const start = Date.now()

  try {
    const result = await processEmailSequences()
    const duration = Date.now() - start

    console.log(`[Cron] Processed ${result.processed} emails, ${result.errors} errors in ${duration}ms`)

    return NextResponse.json({
      ok: true,
      processed: result.processed,
      errors: result.errors,
      duration_ms: duration,
    })
  } catch (err) {
    console.error('[Cron] Fatal error:', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
