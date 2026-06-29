'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import type { AbandonedCart } from '@/types'

interface CartsTableProps {
  carts: AbandonedCart[]
  loading?: boolean
}

function cartStatusBadge(cart: AbandonedCart) {
  if (cart.recovered) return <Badge variant="success" dot>Recovered</Badge>
  if (cart.sequence_status === 'completed') return <Badge variant="danger" dot>Lost</Badge>
  if (cart.sequence_status === 'cancelled') return <Badge variant="neutral" dot>Cancelled</Badge>
  if (cart.emails_sent_count > 0) return <Badge variant="gold" dot>Emailing</Badge>
  return <Badge variant="warning" dot>Pending</Badge>
}

function formatTime(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  return `${mins}m ago`
}

export function CartsTable({ carts, loading }: CartsTableProps) {
  if (loading) {
    return (
      <div className="glass-card overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-white/5 last:border-0">
            <div className="w-32 h-4 bg-white/5 rounded animate-pulse" />
            <div className="w-24 h-4 bg-white/5 rounded animate-pulse" />
            <div className="flex-1 h-4 bg-white/5 rounded animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (!carts.length) {
    return (
      <div className="glass-card p-14 text-center">
        <div className="text-5xl mb-4 opacity-20">◻</div>
        <div className="text-text-secondary text-sm leading-relaxed">
          No abandoned carts yet.<br />Once your Shopify webhooks are connected, carts will appear here.
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-text-muted font-medium px-6 py-3 tracking-wide text-xs uppercase">Customer</th>
              <th className="text-left text-text-muted font-medium px-6 py-3 tracking-wide text-xs uppercase">Value</th>
              <th className="text-left text-text-muted font-medium px-6 py-3 tracking-wide text-xs uppercase">Items</th>
              <th className="text-left text-text-muted font-medium px-6 py-3 tracking-wide text-xs uppercase">Status</th>
              <th className="text-left text-text-muted font-medium px-6 py-3 tracking-wide text-xs uppercase">Emails</th>
              <th className="text-left text-text-muted font-medium px-6 py-3 tracking-wide text-xs uppercase">Abandoned</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {carts.map((cart) => (
              <tr
                key={cart.id}
                className="border-b border-white/5 last:border-0 transition-colors duration-150 hover:bg-gold/[0.03]"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{cart.customer_name ?? '—'}</div>
                  <div className="text-text-muted text-xs mt-0.5">{cart.customer_email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-gold">£{cart.cart_value.toFixed(2)}</span>
                  {cart.recovered && cart.recovered_value && (
                    <div className="text-emerald-400 text-xs mt-0.5">↩ £{cart.recovered_value.toFixed(2)}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-text-secondary">
                  {cart.products.length} item{cart.products.length !== 1 ? 's' : ''}
                </td>
                <td className="px-6 py-4">{cartStatusBadge(cart)}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium transition-colors ${
                          cart.emails_sent_count >= n
                            ? 'bg-gold/20 text-gold'
                            : 'bg-white/5 text-text-muted'
                        }`}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-text-muted text-xs">{formatTime(cart.abandoned_at)}</td>
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/carts/${cart.id}`}
                    className="text-gold/70 hover:text-gold text-xs font-medium transition-colors"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
