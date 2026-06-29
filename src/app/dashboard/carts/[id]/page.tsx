'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { EmailTimeline } from '@/components/dashboard/EmailTimeline'
import type { AbandonedCart, EmailSent } from '@/types'

export default function CartDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [cart, setCart] = useState<AbandonedCart | null>(null)
  const [emails, setEmails] = useState<EmailSent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/carts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setCart(data.cart)
        setEmails(data.emails)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-64">
        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!cart) {
    return <div className="p-4 md:p-8 text-text-secondary">Cart not found.</div>
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-7">
        <Link href="/dashboard/carts" className="hover:text-gold transition-colors">Carts</Link>
        <span className="text-white/20">/</span>
        <span className="text-text-secondary">{cart.customer_email}</span>
      </div>

      {/* Cart header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-9">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">{cart.customer_name ?? cart.customer_email}</h1>
          <div className="text-text-muted text-sm mt-1">{cart.customer_email}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-3xl font-bold text-gold gold-glow">£{cart.cart_value.toFixed(2)}</div>
            <div className="text-text-muted text-xs mt-0.5">Cart value</div>
          </div>
          {cart.checkout_url && (
            <a
              href={cart.checkout_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/70 hover:text-gold text-sm border border-gold/20 hover:border-gold/40 rounded-lg px-3 py-2 transition-all glass-card"
            >
              View cart ↗
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-9">
        {/* Status */}
        <Card>
          <div className="text-text-muted text-xs font-medium uppercase tracking-widest mb-3">Status</div>
          {cart.recovered ? (
            <div>
              <Badge variant="success" dot>Recovered</Badge>
              {cart.recovered_at && (
                <div className="text-text-muted text-xs mt-2">
                  {new Date(cart.recovered_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
              {cart.recovered_value && (
                <div className="text-emerald-400 font-semibold mt-1.5">£{cart.recovered_value.toFixed(2)}</div>
              )}
            </div>
          ) : (
            <div>
              <Badge variant={cart.sequence_status === 'completed' ? 'danger' : 'gold'} dot>
                {cart.sequence_status === 'completed' ? 'Lost' : cart.sequence_status === 'active' ? 'In Sequence' : 'Pending'}
              </Badge>
              {cart.next_email_at && !cart.recovered && (
                <div className="text-text-muted text-xs mt-2">
                  Next: {new Date(cart.next_email_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Email sequence */}
        <Card>
          <div className="text-text-muted text-xs font-medium uppercase tracking-widest mb-3">Email Sequence</div>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => {
              const sent = emails.find((e) => e.email_number === n)
              return (
                <div key={n} className={`flex-1 rounded-lg py-3 text-center text-xs font-medium border transition-colors ${
                  sent ? 'bg-gold/10 text-gold border-gold/20' : 'bg-white/3 text-text-muted border-white/5'
                }`}>
                  <div className="text-lg font-bold">{n}</div>
                  <div>{sent ? (sent.opened ? 'Opened' : 'Sent') : '—'}</div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Timeline */}
        <Card>
          <div className="text-text-muted text-xs font-medium uppercase tracking-widest mb-3">Timeline</div>
          <div className="text-sm text-text-secondary">
            <div>Abandoned {new Date(cart.abandoned_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
            <div className="mt-1 text-text-muted text-xs">
              {emails.length} email{emails.length !== 1 ? 's' : ''} sent
            </div>
          </div>
        </Card>
      </div>

      {/* Products */}
      <div className="mb-9">
        <h2 className="text-lg font-semibold text-white tracking-wide mb-4">Cart Items</h2>
        <Card>
          <div className="space-y-3">
            {cart.products.map((product, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div>
                  <div className="font-medium text-white text-sm">{product.title}</div>
                  {product.variant_title && (
                    <div className="text-text-muted text-xs mt-0.5">{product.variant_title}</div>
                  )}
                </div>
                <div className="text-right text-sm">
                  <div className="font-semibold text-gold">£{product.price}</div>
                  <div className="text-text-muted text-xs">×{product.quantity}</div>
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-bold">
              <span className="text-text-secondary">Total</span>
              <span className="text-gold gold-glow">£{cart.cart_value.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Email History */}
      <div>
        <h2 className="text-lg font-semibold text-white tracking-wide mb-4">Email History</h2>
        <EmailTimeline emails={emails} />
      </div>
    </div>
  )
}
