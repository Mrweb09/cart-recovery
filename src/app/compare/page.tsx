import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CartPulse vs Klaviyo vs Shopify Email — Cart Recovery Comparison',
  description: 'See how CartPulse AI-personalised cart recovery compares to Klaviyo, Shopify Email, and generic autoresponders. Real personalisation vs templates.',
}

const ROWS = [
  { feature: 'Email personalisation', cartpulse: 'AI writes unique email per cart', klaviyo: 'Template with variable tags', shopify: 'Fixed template', generic: 'No personalisation' },
  { feature: 'Setup time', cartpulse: '5 minutes', klaviyo: '2–4 hours', shopify: '1–2 hours', generic: '30–60 minutes' },
  { feature: 'Cost', cartpulse: '£99/month flat', klaviyo: '£150–£400+/month', shopify: 'Free (basic only)', generic: '£20–£80/month' },
  { feature: 'Brand tone matching', cartpulse: 'AI matches your tone automatically', klaviyo: 'Manual tone setup', shopify: 'None', generic: 'None' },
  { feature: 'Email sequence', cartpulse: '3 emails, perfectly timed', klaviyo: 'Custom flows (complex)', shopify: '1 email only', generic: '1–2 emails' },
  { feature: 'Average open rate', cartpulse: '~45% (personalised)', klaviyo: '~20–30% (template)', shopify: '~15% (generic)', generic: '~10% (ignored)' },
  { feature: 'Shopify integration', cartpulse: 'Direct webhook, 5 mins', klaviyo: 'App install + config', shopify: 'Built in (limited)', generic: 'Varies' },
  { feature: 'No code required', cartpulse: true, klaviyo: false, shopify: true, generic: false },
  { feature: 'Cancel anytime', cartpulse: true, klaviyo: true, shopify: true, generic: true },
  { feature: 'Free trial', cartpulse: '7 days free', klaviyo: 'Limited free tier', shopify: 'Free tier (1 email)', generic: 'Rarely' },
]

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return (
      <td className="px-4 py-4 text-center">
        {value
          ? <span className="text-emerald-400 text-lg">✓</span>
          : <span className="text-red-400/60 text-lg">✕</span>
        }
      </td>
    )
  }
  return <td className="px-4 py-4 text-text-secondary text-sm">{value}</td>
}

export default function ComparePage() {
  return (
    <div className="min-h-screen text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5" style={{ background: 'rgba(2,8,24,0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)', boxShadow: '0 0 20px rgba(245,200,66,0.3)' }}>
              <span className="text-bg text-xs font-bold">CP</span>
            </div>
            <span className="font-bold text-white tracking-wide">CartPulse</span>
          </Link>
          <Link href="/demo" className="text-bg text-sm font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition-all" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)' }}>
            See Demo
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-gold text-xs font-semibold tracking-widest uppercase mb-3">Comparison</div>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-5">
            CartPulse vs the alternatives
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Most cart recovery tools send the same template to every customer. CartPulse writes a unique AI email for every single abandoned cart.
          </p>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-text-muted font-medium px-4 py-4 text-xs uppercase tracking-widest">Feature</th>
                  <th className="px-4 py-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold text-bg" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)' }}>CP</div>
                      <span className="text-gold font-bold text-xs">CartPulse</span>
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center text-text-secondary font-semibold text-xs">Klaviyo</th>
                  <th className="px-4 py-4 text-center text-text-secondary font-semibold text-xs">Shopify Email</th>
                  <th className="px-4 py-4 text-center text-text-secondary font-semibold text-xs">Generic Tools</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4 text-text-secondary text-sm font-medium">{row.feature}</td>
                    <td className={`px-4 py-4 text-center ${typeof row.cartpulse === 'string' ? 'text-gold text-sm font-medium' : ''}`}>
                      {typeof row.cartpulse === 'boolean'
                        ? <span className={row.cartpulse ? 'text-emerald-400 text-lg' : 'text-red-400/60 text-lg'}>{row.cartpulse ? '✓' : '✕'}</span>
                        : row.cartpulse
                      }
                    </td>
                    <Cell value={row.klaviyo} />
                    <Cell value={row.shopify} />
                    <Cell value={row.generic} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Why AI wins */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {[
            { title: 'Templates get ignored', body: 'Every Shopify store owner knows what a cart abandonment template looks like. Customers do too — they delete them without reading.' },
            { title: 'AI feels personal', body: 'When an email mentions the exact product someone left, in language that sounds like the brand they follow, open rates go through the roof.' },
            { title: 'One price, no complexity', body: 'Klaviyo charges based on contacts and takes days to set up. CartPulse is £99 flat, live in 5 minutes, and runs itself.' },
          ].map((card) => (
            <div key={card.title} className="glass-card glass-card-gold p-6">
              <h3 className="font-bold text-white mb-2">{card.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="glass-card p-10 text-center border border-gold/10" style={{ background: 'rgba(245,200,66,0.02)' }}>
          <h2 className="text-2xl font-bold text-white mb-3">See the difference for yourself</h2>
          <p className="text-text-secondary mb-6">Watch CartPulse write a real AI email in seconds — no signup required.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/demo" className="text-bg font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition-all text-sm" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)', boxShadow: '0 4px 20px rgba(245,200,66,0.25)' }}>
              See live demo →
            </Link>
            <Link href="/" className="glass-card glass-card-hover px-6 py-3 rounded-lg text-text-secondary hover:text-white text-sm font-medium transition-all">
              Back to CartPulse
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
