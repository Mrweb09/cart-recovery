'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface OnboardResult {
  client: { id: string; brand_name: string }
  webhook_url: string
  webhook_secret: string
}

const TONE_OPTIONS = [
  { value: 'friendly', label: 'Friendly', desc: 'Warm, conversational — great for lifestyle & fashion brands' },
  { value: 'professional', label: 'Professional', desc: 'Polished & authoritative — ideal for B2C premium brands' },
  { value: 'luxury', label: 'Luxury', desc: 'Elevated & exclusive — think Net-a-Porter or Harrods' },
  { value: 'streetwear', label: 'Streetwear', desc: 'Bold & cultural — Supreme, Palace, Off-White energy' },
]

const inputCls = 'w-full bg-white/3 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-gold/50 focus:bg-white/5 transition-all duration-200'

export default function OnboardPage() {
  const [form, setForm] = useState({
    brand_name: '',
    shopify_domain: '',
    resend_api_key: '',
    from_email: '',
    logo_url: '',
    tone_of_voice: 'friendly',
    primary_color: '#F5C842',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<OnboardResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create client')
      setResult(data as OnboardResult)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-9">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(245,200,66,0.15)', border: '1px solid rgba(245,200,66,0.3)' }}>
              <span className="text-gold text-2xl">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">{result.client.brand_name} is live!</h1>
            <p className="text-text-secondary mt-2 text-sm">Send these to your client — they paste them into Shopify.</p>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-5">
              <div className="text-text-muted text-xs font-medium uppercase tracking-widest mb-3">Webhook URL</div>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-gold text-sm bg-white/3 rounded-lg px-3 py-2 font-mono break-all">
                  {result.webhook_url}
                </code>
                <button onClick={() => copy(result.webhook_url, 'url')} className="text-xs text-text-muted hover:text-gold border border-white/8 hover:border-gold/30 rounded-lg px-3 py-2 shrink-0 transition-all glass-card">
                  {copied === 'url' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="glass-card p-5">
              <div className="text-text-muted text-xs font-medium uppercase tracking-widest mb-3">Webhook Secret</div>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-gold text-sm bg-white/3 rounded-lg px-3 py-2 font-mono break-all">
                  {result.webhook_secret}
                </code>
                <button onClick={() => copy(result.webhook_secret, 'secret')} className="text-xs text-text-muted hover:text-gold border border-white/8 hover:border-gold/30 rounded-lg px-3 py-2 shrink-0 transition-all glass-card">
                  {copied === 'secret' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="glass-card p-5 border border-gold/10" style={{ background: 'rgba(245,200,66,0.02)' }}>
              <div className="text-xs text-text-secondary space-y-2">
                <p className="font-semibold text-gold text-sm">Shopify Setup Instructions</p>
                <ol className="space-y-1.5 list-decimal list-inside text-text-muted">
                  <li>Go to Shopify Admin → Settings → Notifications → Webhooks</li>
                  <li>Click <strong className="text-text-secondary">Create webhook</strong></li>
                  <li>Event: <strong className="text-text-secondary">Checkout creation</strong> — paste URL above</li>
                  <li>Repeat for <strong className="text-text-secondary">Checkout update</strong></li>
                  <li>Repeat for <strong className="text-text-secondary">Order creation</strong></li>
                  <li>Format: JSON · Secret: paste secret above</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-7">
            <a href="/dashboard" className="flex-1">
              <Button className="w-full">Go to Dashboard</Button>
            </a>
            <Button variant="secondary" onClick={() => setResult(null)}>Add Another Client</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="mb-9">
          <a href="/dashboard" className="text-text-muted text-sm hover:text-gold transition-colors">← Back to dashboard</a>
          <h1 className="text-2xl font-bold text-white mt-4 tracking-wide">Onboard New Client</h1>
          <p className="text-text-secondary text-sm mt-1">Takes under 5 minutes. You&apos;ll get a webhook URL to send them.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="glass-card p-6">
            <div className="text-text-muted text-xs font-medium uppercase tracking-widest mb-5">Brand Details</div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Brand Name *</label>
                <input value={form.brand_name} onChange={(e) => set('brand_name', e.target.value)} placeholder="e.g. UrbanThreads" required className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Shopify Domain *</label>
                <input value={form.shopify_domain} onChange={(e) => set('shopify_domain', e.target.value)} placeholder="mystore.myshopify.com" required className={inputCls} />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Logo URL</label>
                <input value={form.logo_url} onChange={(e) => set('logo_url', e.target.value)} placeholder="https://cdn.example.com/logo.png" className={inputCls} />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="text-text-muted text-xs font-medium uppercase tracking-widest mb-5">Email Setup</div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Resend API Key *</label>
                <input value={form.resend_api_key} onChange={(e) => set('resend_api_key', e.target.value)} placeholder="re_..." required type="password" className={`${inputCls} font-mono`} />
                <p className="text-text-muted text-xs mt-1.5">Get this from resend.com → API Keys</p>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">From Email *</label>
                <input value={form.from_email} onChange={(e) => set('from_email', e.target.value)} placeholder="hello@theirbrand.com" required type="email" className={inputCls} />
                <p className="text-text-muted text-xs mt-1.5">Must be a verified domain in Resend</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="text-text-muted text-xs font-medium uppercase tracking-widest mb-5">Brand Tone</div>
            <div className="grid grid-cols-2 gap-3">
              {TONE_OPTIONS.map((tone) => (
                <button
                  key={tone.value}
                  type="button"
                  onClick={() => set('tone_of_voice', tone.value)}
                  className={`text-left p-3.5 rounded-xl border transition-all duration-200 ${
                    form.tone_of_voice === tone.value
                      ? 'border-gold/40 bg-gold/8 text-white'
                      : 'border-white/8 hover:border-white/15 text-text-secondary hover:text-white'
                  }`}
                >
                  <div className={`font-semibold text-sm ${form.tone_of_voice === tone.value ? 'text-gold' : ''}`}>{tone.label}</div>
                  <div className="text-text-muted text-xs mt-1 leading-relaxed">{tone.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} size="lg" className="w-full">
            Create Client & Generate Webhook URL
          </Button>
        </form>
      </div>
    </div>
  )
}
