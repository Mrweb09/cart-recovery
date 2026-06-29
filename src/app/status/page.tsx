'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/Badge'

interface StatusCheck {
  ok: boolean
  latency_ms?: number
  error?: string
}

interface StatusData {
  status: 'ok' | 'degraded'
  checks: Record<string, StatusCheck>
  uptime_ms: number
  timestamp: string
}

const CHECK_LABELS: Record<string, { label: string; desc: string }> = {
  supabase: { label: 'Supabase Database', desc: 'Stores carts, clients, and email records' },
  claude_api: { label: 'Claude AI', desc: 'Email generation via claude-haiku-4-5' },
  resend: { label: 'Resend Email', desc: 'Transactional email delivery' },
}

export default function StatusPage() {
  const [data, setData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)

  async function refresh() {
    setLoading(true)
    try {
      const res = await fetch('/api/status')
      setData(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 30000)
    return () => clearInterval(interval)
  }, [])

  const allOk = data?.status === 'ok'

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <a href="/dashboard" className="text-text-muted text-sm hover:text-gold transition-colors">← Dashboard</a>
            <h1 className="text-2xl font-bold text-white mt-3 tracking-wide">System Status</h1>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="text-sm text-text-muted hover:text-gold glass-card px-4 py-2 transition-all hover:border-gold/25 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Refresh'}
          </button>
        </div>

        {/* Overall status banner */}
        <div className={`glass-card p-5 mb-6 border ${allOk ? 'border-emerald-500/20' : 'border-red-500/20'}`}
          style={{ background: allOk ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.04)' }}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${allOk ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
              {loading ? '~' : allOk ? 'OK' : '!'}
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {loading ? 'Checking systems...' : allOk ? 'All Systems Operational' : 'Service Degraded'}
              </div>
              {data?.timestamp && (
                <div className="text-text-muted text-xs mt-0.5">
                  Last checked: {new Date(data.timestamp).toLocaleTimeString('en-GB')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(data?.checks ?? {}).map(([key, check]) => {
            const meta = CHECK_LABELS[key] ?? { label: key, desc: '' }
            return (
              <div key={key} className="glass-card glass-card-hover p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${check.ok ? 'bg-emerald-400' : 'bg-red-400'}`} style={check.ok ? { boxShadow: '0 0 8px rgba(52,211,153,0.6)' } : {}} />
                    <div>
                      <div className="font-medium text-white text-sm">{meta.label}</div>
                      {meta.desc && <div className="text-text-muted text-xs mt-0.5">{meta.desc}</div>}
                      {check.error && <div className="text-red-400 text-xs mt-1">{check.error}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {check.latency_ms !== undefined && (
                      <span className="text-text-muted text-xs font-mono">{check.latency_ms}ms</span>
                    )}
                    <Badge variant={check.ok ? 'success' : 'danger'}>
                      {check.ok ? 'Operational' : 'Error'}
                    </Badge>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="glass-card p-6 mt-5">
          <div className="text-text-muted text-xs font-medium uppercase tracking-widest mb-4">Background Processing</div>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Email sequence cron', value: <Badge variant="gold" dot>Every 5 minutes</Badge> },
              { label: 'Email 1 delay', value: <span className="text-text-muted">60 min after abandonment</span> },
              { label: 'Email 2 delay', value: <span className="text-text-muted">24 hrs after abandonment</span> },
              { label: 'Email 3 delay', value: <span className="text-text-muted">48 hrs after abandonment</span> },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                <span className="text-text-secondary">{label}</span>
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
