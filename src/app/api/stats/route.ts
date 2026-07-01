import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  const db = createServerClient()

  const [leadsResult, recoveredResult] = await Promise.all([
    db.from('calculator_leads').select('estimated_recoverable'),
    db.from('abandoned_carts').select('recovered_value').eq('recovered', true),
  ])

  const calculatorTotal = (leadsResult.data ?? []).reduce(
    (sum, row) => sum + (row.estimated_recoverable || 0), 0
  )
  const recoveredTotal = (recoveredResult.data ?? []).reduce(
    (sum, row) => sum + (row.recovered_value || 0), 0
  )

  return NextResponse.json({
    calculator_identified: Math.round(calculatorTotal),
    actually_recovered: Math.round(recoveredTotal),
  })
}
