import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import type { DashboardMetrics } from '@/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get('client_id')

  const db = createServerClient()

  let cartsQuery = db.from('abandoned_carts').select('recovered, recovered_value, sequence_status')
  let emailsQuery = db.from('emails_sent').select('opened, clicked')

  if (clientId) {
    cartsQuery = cartsQuery.eq('client_id', clientId)
    emailsQuery = emailsQuery.eq('client_id', clientId)
  }

  const [{ data: carts }, { data: emails }] = await Promise.all([
    cartsQuery,
    emailsQuery,
  ])

  const totalCarts = carts?.length ?? 0
  const recoveredCarts = carts?.filter((c) => c.recovered) ?? []
  const totalRevenue = recoveredCarts.reduce((sum, c) => sum + (c.recovered_value ?? 0), 0)
  const recoveryRate = totalCarts > 0 ? (recoveredCarts.length / totalCarts) * 100 : 0

  const totalEmails = emails?.length ?? 0
  const openedEmails = emails?.filter((e) => e.opened).length ?? 0
  const clickedEmails = emails?.filter((e) => e.clicked).length ?? 0
  const openRate = totalEmails > 0 ? (openedEmails / totalEmails) * 100 : 0
  const clickRate = totalEmails > 0 ? (clickedEmails / totalEmails) * 100 : 0

  const activeSequences = carts?.filter((c) =>
    !c.recovered && ['pending', 'active'].includes(c.sequence_status)
  ).length ?? 0

  const metrics: DashboardMetrics = {
    total_revenue_recovered: totalRevenue,
    recovery_rate: recoveryRate,
    total_carts: totalCarts,
    total_emails_sent: totalEmails,
    open_rate: openRate,
    click_rate: clickRate,
    active_sequences: activeSequences,
  }

  return NextResponse.json(metrics)
}
