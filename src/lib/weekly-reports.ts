import { Resend } from 'resend'
import { createServerClient } from './supabase/server'

export async function sendWeeklyReports(): Promise<{ sent: number; errors: number }> {
  const db = createServerClient()
  let sent = 0
  let errors = 0

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: clients } = await db
    .from('clients')
    .select('id, brand_name, from_email, resend_api_key')
    .eq('active', true)

  for (const client of clients ?? []) {
    try {
      const [cartsResult, emailsResult, recoveredResult] = await Promise.all([
        db.from('abandoned_carts').select('id').eq('client_id', client.id).gte('created_at', weekAgo),
        db.from('emails_sent').select('id').eq('client_id', client.id).gte('sent_at', weekAgo),
        db.from('abandoned_carts').select('recovered_value').eq('client_id', client.id).eq('recovered', true).gte('recovered_at', weekAgo),
      ])

      const totalCarts = cartsResult.data?.length ?? 0
      const totalEmails = emailsResult.data?.length ?? 0
      const recoveredCarts = recoveredResult.data?.length ?? 0
      const recoveredRevenue = (recoveredResult.data ?? []).reduce((sum, r) => sum + (r.recovered_value || 0), 0)
      const recoveryRate = totalCarts > 0 ? ((recoveredCarts / totalCarts) * 100).toFixed(1) : '0.0'

      const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const weekEnd = new Date()
      const dateRange = `${weekStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${weekEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`

      const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#020818;font-family:Inter,system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <div style="margin-bottom:32px;">
      <div style="display:inline-block;background:linear-gradient(135deg,#F5C842,#c9a535);border-radius:8px;padding:6px 12px;">
        <span style="color:#020818;font-weight:700;font-size:13px;">CartPulse</span>
      </div>
    </div>

    <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 4px 0;">Weekly Report</h1>
    <p style="color:#475569;font-size:14px;margin:0 0 32px 0;">${client.brand_name} · ${dateRange}</p>

    <div style="display:grid;gap:12px;margin-bottom:32px;">
      <div style="background:rgba(245,200,66,0.06);border:1px solid rgba(245,200,66,0.2);border-radius:12px;padding:20px;">
        <div style="color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Revenue Recovered</div>
        <div style="color:#F5C842;font-size:32px;font-weight:700;">£${recoveredRevenue.toFixed(2)}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:32px;">
      ${[
        { label: 'Carts Tracked', value: totalCarts },
        { label: 'Emails Sent', value: totalEmails },
        { label: 'Recovery Rate', value: recoveryRate + '%' },
      ].map(stat => `
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px;text-align:center;">
          <div style="color:#ffffff;font-size:20px;font-weight:700;">${stat.value}</div>
          <div style="color:#475569;font-size:11px;margin-top:4px;">${stat.label}</div>
        </div>
      `).join('')}
    </div>

    ${recoveredRevenue > 0
      ? `<div style="background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:16px;margin-bottom:24px;">
          <p style="color:#10B981;font-size:14px;margin:0;">CartPulse recovered <strong>£${recoveredRevenue.toFixed(2)}</strong> for ${client.brand_name} this week.</p>
        </div>`
      : `<div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;margin-bottom:24px;">
          <p style="color:#94a3b8;font-size:14px;margin:0;">No recoveries this week — emails are sending and working in the background. Recovery typically takes 24–48 hours from abandonment.</p>
        </div>`
    }

    <p style="color:#475569;font-size:12px;margin:0;">CartPulse · Powered by Claude AI<br>You are receiving this because you are a CartPulse client.</p>
  </div>
</body>
</html>`

      const resend = new Resend(client.resend_api_key)
      const { error } = await resend.emails.send({
        from: `CartPulse Reports <${client.from_email}>`,
        to: client.from_email,
        subject: `Weekly Report — ${client.brand_name} — £${recoveredRevenue.toFixed(2)} recovered`,
        html,
      })

      if (error) throw new Error(error.message)
      sent++
    } catch (err) {
      console.error(`[Weekly] Failed for ${client.brand_name}:`, err)
      errors++
    }
  }

  return { sent, errors }
}
