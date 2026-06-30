'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

const inputCls = 'w-full bg-white/3 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-gold/50 focus:bg-white/5 transition-all duration-200'

function calculate(monthlyRevenue: number) {
  const totalCartValue = monthlyRevenue / 0.31
  const estimatedLost = totalCartValue - monthlyRevenue
  const estimatedRecoverable = estimatedLost * 0.15
  return { estimatedLost, estimatedRecoverable }
}

export default function CalculatorPage() {
  const [step, setStep] = useState<'input' | 'gate' | 'result'>('input')
  const [revenue, setRevenue] = useState('')
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ estimatedLost: number; estimatedRecoverable: number } | null>(null)

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault()
    const rev = parseFloat(revenue)
    if (!rev || rev <= 0) return
    setResult(calculate(rev))
    setStep('gate')
  }

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    if (!result) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/calculator-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          monthly_revenue: parseFloat(revenue),
          estimated_lost: result.estimatedLost,
          estimated_recoverable: result.estimatedRecoverable,
          shopify_domain: domain || undefined,
        }),
      })
      if (!res.ok) throw new Error('Something went wrong, try again')
      setStep('result')
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-4 md:px-8 py-4 flex items-center justify-between" style={{ background: 'rgba(2,8,24,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)' }}>
            <span className="text-bg text-xs font-bold">CP</span>
          </div>
          <span className="font-bold text-white tracking-wide">CartPulse</span>
        </div>
        <a href="/demo" className="text-gold/70 hover:text-gold text-sm transition-colors">See live demo →</a>
      </div>

      <div className="max-w-xl mx-auto p-4 md:p-8 pt-10 md:pt-16">
        <div className="text-center mb-9">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">How much are abandoned carts costing you?</h1>
          <p className="text-text-secondary text-sm mt-3">Enter your monthly Shopify revenue and find out in 10 seconds.</p>
        </div>

        {step === 'input' && (
          <form onSubmit={handleCalculate} className="glass-card p-6 space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Monthly revenue (£) *</label>
              <input
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                type="number"
                min="1"
                step="any"
                placeholder="e.g. 5000"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">Shopify domain (optional)</label>
              <input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="mystore.myshopify.com"
                className={inputCls}
              />
            </div>
            <Button type="submit" size="lg" className="w-full">Calculate my losses →</Button>
          </form>
        )}

        {step === 'gate' && result && (
          <div className="glass-card p-6 space-y-5">
            <div className="text-center py-4">
              <div className="text-text-muted text-xs uppercase tracking-widest mb-2">You could be losing</div>
              <div className="text-4xl font-bold text-gold gold-glow blur-sm select-none">£{result.estimatedLost.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</div>
              <div className="text-text-muted text-xs mt-2">per month to abandoned carts</div>
            </div>
            <div className="border-t border-white/5 pt-5">
              <p className="text-text-secondary text-sm mb-4 text-center">Enter your email to unlock your full results</p>
              <form onSubmit={handleUnlock} className="space-y-3">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@email.com"
                  required
                  className={inputCls}
                />
                {error && <div className="text-red-400 text-xs">{error}</div>}
                <Button type="submit" loading={loading} size="lg" className="w-full">Unlock my results →</Button>
              </form>
            </div>
          </div>
        )}

        {step === 'result' && result && (
          <div className="space-y-4">
            <div className="glass-card p-6 text-center border border-gold/10" style={{ background: 'rgba(245,200,66,0.02)' }}>
              <div className="text-text-muted text-xs uppercase tracking-widest mb-2">Estimated monthly loss</div>
              <div className="text-4xl font-bold text-gold gold-glow">£{result.estimatedLost.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</div>
              <div className="text-text-muted text-xs mt-2">based on a 69% average cart abandonment rate</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-text-muted text-xs uppercase tracking-widest mb-2">Recoverable with CartPulse</div>
              <div className="text-3xl font-bold text-emerald-400">£{result.estimatedRecoverable.toLocaleString('en-GB', { maximumFractionDigits: 0 })}<span className="text-text-muted text-sm">/mo</span></div>
              <div className="text-text-muted text-xs mt-2">based on a 15% average recovery rate from AI email sequences</div>
            </div>
            <div className="glass-card p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-white">Want to see it in action?</div>
                <div className="text-text-muted text-sm mt-0.5">Watch a live AI email get generated for a real cart</div>
              </div>
              <a href="/demo" className="shrink-0">
                <Button>Watch demo →</Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
