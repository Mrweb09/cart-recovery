'use client'

import { useState, useEffect } from 'react'
import { CartsTable } from '@/components/dashboard/CartsTable'
import { ClientSwitcher } from '@/components/dashboard/ClientSwitcher'
import { Button } from '@/components/ui/Button'
import type { AbandonedCart } from '@/types'

type StatusFilter = 'all' | 'recovered' | 'active' | 'lost'

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'In Sequence' },
  { value: 'recovered', label: 'Recovered' },
  { value: 'lost', label: 'Lost' },
]

export default function CartsPage() {
  const [clientId, setClientId] = useState<string | null>(null)
  const [status, setStatus] = useState<StatusFilter>('all')
  const [carts, setCarts] = useState<AbandonedCart[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (clientId) params.set('client_id', clientId)
    if (status !== 'all') params.set('status', status)

    fetch(`/api/carts?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setCarts(data.carts ?? [])
        setTotal(data.total ?? 0)
        setLoading(false)
      })
  }, [clientId, status, page])

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Abandoned Carts</h1>
          <p className="text-text-secondary text-sm mt-1">{total} total carts tracked</p>
        </div>
        <ClientSwitcher selectedId={clientId} onChange={(id) => { setClientId(id); setPage(1) }} />
      </div>

      {/* Status tabs */}
      <div className="overflow-x-auto mb-7">
      <div className="flex gap-1 glass-card p-1 w-fit" style={{ borderRadius: '0.625rem' }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatus(tab.value); setPage(1) }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              status === tab.value
                ? 'bg-gold text-bg shadow-lg shadow-gold/20'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      </div>

      <CartsTable carts={carts} loading={loading} />

      {/* Pagination */}
      {total > 25 && (
        <div className="flex items-center justify-between mt-5">
          <div className="text-text-muted text-sm">
            Showing {(page - 1) * 25 + 1}–{Math.min(page * 25, total)} of {total}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page * 25 >= total}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
