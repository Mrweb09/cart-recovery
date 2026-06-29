'use client'

import { useState, useEffect, useCallback } from 'react'
import { MetricsCard } from '@/components/dashboard/MetricsCard'
import { CartsTable } from '@/components/dashboard/CartsTable'
import { ClientSwitcher } from '@/components/dashboard/ClientSwitcher'
import type { DashboardMetrics, AbandonedCart } from '@/types'

function PoundIcon() {
  return <span className="text-base font-bold">£</span>
}
function ChartIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
}
function EmailIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
}
function CartIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
}

export default function DashboardPage() {
  const [clientId, setClientId] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [carts, setCarts] = useState<AbandonedCart[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    const qs = clientId ? `?client_id=${clientId}` : ''
    const [metricsRes, cartsRes] = await Promise.all([
      fetch(`/api/metrics${qs}`).then((r) => r.json()),
      fetch(`/api/carts${qs}&page=1`).then((r) => r.json()),
    ])
    setMetrics(metricsRes)
    setCarts(cartsRes.carts ?? [])
    setLoading(false)
  }, [clientId])

  useEffect(() => {
    setLoading(true)
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Overview</h1>
          <p className="text-text-secondary text-sm mt-1">Real-time cart recovery performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-text-muted px-3 py-1.5 glass-card">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Live
          </div>
          <ClientSwitcher selectedId={clientId} onChange={setClientId} />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <MetricsCard
          label="Revenue Recovered"
          value={metrics ? `£${metrics.total_revenue_recovered.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
          icon={<PoundIcon />}
          color="gold"
        />
        <MetricsCard
          label="Recovery Rate"
          value={metrics ? `${metrics.recovery_rate.toFixed(1)}%` : '—'}
          subtext={`${metrics?.total_carts ?? 0} total carts`}
          icon={<ChartIcon />}
          color="gold"
        />
        <MetricsCard
          label="Emails Sent"
          value={metrics ? metrics.total_emails_sent.toLocaleString() : '—'}
          subtext={`${metrics?.open_rate.toFixed(1) ?? 0}% open · ${metrics?.click_rate.toFixed(1) ?? 0}% click`}
          icon={<EmailIcon />}
          color="gold"
        />
        <MetricsCard
          label="Active Sequences"
          value={metrics ? metrics.active_sequences.toLocaleString() : '—'}
          subtext="Carts in email flow"
          icon={<CartIcon />}
          color="gold"
        />
      </div>

      {/* Recent Carts */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white tracking-wide">Recent Carts</h2>
          <a href="/dashboard/carts" className="text-gold/70 hover:text-gold text-sm transition-colors font-medium">
            View all →
          </a>
        </div>
        <CartsTable carts={carts.slice(0, 10)} loading={loading} />
      </div>
    </div>
  )
}
