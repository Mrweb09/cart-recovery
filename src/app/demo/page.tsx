'use client'

import { useState, useEffect, useRef } from 'react'
import type { GeneratedEmail } from '@/types'

type DemoStep = 'idle' | 'webhook' | 'generating' | 'preview' | 'sent'

const DEMO_PRODUCTS = [
  { title: 'Oversized Acid Wash Hoodie', variant: 'Stone Grey / XL', price: '£89.00', qty: 1 },
  { title: 'Relaxed Cargo Trousers', variant: 'Olive / 32', price: '£79.00', qty: 1 },
  { title: 'Box Logo Tee', variant: 'White / L', price: '£39.00', qty: 2 },
]

const WEBHOOK_LINES = [
  '→ POST /api/webhooks/shopify/demo',
  '  x-shopify-topic: checkouts/create',
  '  x-shopify-hmac-sha256: ***verified***',
  '',
  '  {',
  '    "email": "jordan.m@gmail.com",',
  '    "total_price": "246.00",',
  '    "line_items": [',
  '      { "title": "Oversized Acid Wash Hoodie",',
  '        "price": "89.00", "quantity": 1 },',
  '      { "title": "Relaxed Cargo Trousers",',
  '        "price": "79.00", "quantity": 1 },',
  '      { "title": "Box Logo Tee",',
  '        "price": "39.00", "quantity": 2 }',
  '    ]',
  '  }',
  '',
  '✓ HMAC verified — authentic Shopify webhook',
  '✓ Customer identified: Jordan M.',
  '✓ Cart saved — email sequence scheduled',
  '⏰ Email 1 queued for 60 minutes from now...',
]

export default function DemoPage() {
  const [step, setStep] = useState<DemoStep>('idle')
  const [emailNumber, setEmailNumber] = useState<1 | 2 | 3>(1)
  const [webhookLine, setWebhookLine] = useState(0)
  const [generatingText, setGeneratingText] = useState('')
  const [email, setEmail] = useState<GeneratedEmail | null>(null)
  const [metrics, setMetrics] = useState({ emails: 0, revenue: 0, carts: 0 })
  const [error, setError] = useState<string | null>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [webhookLine])

  async function runDemo(num: 1 | 2 | 3) {
    setEmailNumber(num)
    setStep('webhook')
    setWebhookLine(0)
    setEmail(null)
    setError(null)
    setGeneratingText('')

    for (let i = 0; i <= WEBHOOK_LINES.length; i++) {
      await new Promise((r) => setTimeout(r, 80))
      setWebhookLine(i)
    }

    await new Promise((r) => setTimeout(r, 600))
    setStep('generating')

    const dots = [
      'Analysing cart contents...',
      'Profiling customer behaviour...',
      'Crafting personalised copy...',
      'Applying UrbanThreads tone...',
      'Finalising subject & preview...',
    ]
    for (const dot of dots) {
      setGeneratingText(dot)
      await new Promise((r) => setTimeout(r, 700))
    }

    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailNumber: num }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error ?? 'API error')
      setEmail(data.email)
      setStep('preview')
      setMetrics((m) => ({
        emails: m.emails + 1,
        revenue: m.revenue + (num === 1 ? 246 : 0),
        carts: m.carts + (num === 1 ? 1 : 0),
      }))
    } catch (err) {
      setError(String(err))
      setStep('idle')
    }
  }

  function markSent() {
    setStep('sent')
    setTimeout(() => setStep('idle'), 3000)
  }

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-4 md:px-8 py-4 flex items-center justify-between" style={{ background: 'rgba(2,8,24,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)' }}>
            <span className="text-bg text-xs font-bold">CR</span>
          </div>
          <span className="font-bold text-white tracking-wide">CartRecovery</span>
          <span className="text-text-muted text-sm">/ Demo Mode</span>
        </div>
        <div className="flex items-center gap-2 glass-card px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-gold text-xs font-semibold tracking-widest uppercase">Live Demo</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Brand header */}
        <div className="glass-card p-4 md:p-6 mb-6 flex flex-wrap items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)', boxShadow: '0 0 24px rgba(245,200,66,0.25)' }}>
            <span className="text-bg font-bold text-lg">UT</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white tracking-wide">UrbanThreads</h1>
            <div className="text-text-muted text-sm mt-0.5">urbanthreads.myshopify.com · Streetwear tone</div>
          </div>
          <div className="flex gap-4 md:gap-6 text-center">
            <div>
              <div className="text-xl md:text-2xl font-bold text-white">{metrics.carts}</div>
              <div className="text-text-muted text-xs mt-0.5">Carts</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold text-gold gold-glow">£{metrics.revenue}</div>
              <div className="text-text-muted text-xs mt-0.5">Recovered</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold text-accent">{metrics.emails}</div>
              <div className="text-text-muted text-xs mt-0.5">Emails</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left panel */}
          <div className="space-y-4">
            {/* Cart + controls */}
            <div className="glass-card p-5">
              <div className="text-text-muted text-xs font-medium uppercase tracking-widest mb-4">Abandoned Cart — Jordan M.</div>
              <div className="space-y-2 mb-5">
                {DEMO_PRODUCTS.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-white">{p.title}</div>
                      <div className="text-text-muted text-xs mt-0.5">{p.variant} · qty {p.qty}</div>
                    </div>
                    <div className="text-sm font-semibold text-gold">{p.price}</div>
                  </div>
                ))}
                <div className="flex justify-between pt-2.5 font-bold">
                  <span className="text-text-secondary">Total</span>
                  <span className="text-gold gold-glow">£246.00</span>
                </div>
              </div>

              <div className="text-text-muted text-xs font-medium uppercase tracking-widest mb-3">Simulate Email Sequence</div>
              <div className="grid grid-cols-3 gap-2">
                {([1, 2, 3] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => runDemo(n)}
                    disabled={step !== 'idle'}
                    className={`relative py-4 px-2 rounded-xl border text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                      n === emailNumber && step !== 'idle'
                        ? 'border-gold/50 bg-gold/10 text-gold'
                        : 'border-white/8 hover:border-gold/30 text-text-secondary hover:text-white hover:bg-white/3'
                    }`}
                  >
                    <div className="text-2xl font-bold mb-1">{n}</div>
                    <div className="text-xs">{n === 1 ? '60 min' : n === 2 ? '24 hrs' : '48 hrs'}</div>
                    <div className="text-xs text-text-muted mt-0.5">{n === 1 ? 'Curious' : n === 2 ? 'Urgency' : 'Goodbye'}</div>
                  </button>
                ))}
              </div>
              {step === 'idle' && (
                <p className="text-text-muted text-xs text-center mt-3">Click any email to generate a live AI email for Jordan&apos;s cart</p>
              )}
            </div>

            {/* Terminal */}
            <div className="glass-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                <span className="text-text-muted text-xs ml-2 font-mono">cart-recovery — webhook handler</span>
              </div>
              <div ref={terminalRef} className="font-mono text-xs p-4 h-64 overflow-y-auto text-green-400" style={{ background: '#020c08' }}>
                {step === 'idle' && (
                  <span className="text-text-muted">Waiting for Shopify webhook...<span className="typing-cursor" /></span>
                )}
                {step !== 'idle' && (
                  <div>
                    {WEBHOOK_LINES.slice(0, webhookLine).map((line, i) => (
                      <div key={i} className={`${line.startsWith('✓') ? 'text-emerald-400' : line.startsWith('⏰') ? 'text-gold' : 'text-green-300/70'}`}>
                        {line || ' '}
                      </div>
                    ))}
                    {step === 'generating' && (
                      <div className="mt-2 text-gold">
                        ✦ Claude (claude-haiku-4-5): {generatingText}<span className="typing-cursor" />
                      </div>
                    )}
                    {(step === 'preview' || step === 'sent') && (
                      <div className="mt-2">
                        <div className="text-emerald-400">✓ Email generated by Grok AI</div>
                        <div className="text-emerald-400">✓ Personalised for Jordan · UrbanThreads</div>
                        {step === 'sent' && (
                          <>
                            <div className="text-emerald-400">✓ Sent via Resend — message ID logged</div>
                            <div className="text-gold">📧 Email {emailNumber}/3 delivered to jordan.m@gmail.com</div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Email preview */}
          <div className="glass-card overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="text-sm font-medium text-white">
                {step === 'idle' && <span className="text-text-muted">Email Preview</span>}
                {step === 'webhook' && <span className="text-amber-400">Processing webhook...</span>}
                {step === 'generating' && <span className="text-gold">Grok is writing...</span>}
                {(step === 'preview' || step === 'sent') && (
                  <span>Email {emailNumber} — {email?.subject}</span>
                )}
              </div>
              {step === 'preview' && email && (
                <button
                  onClick={markSent}
                  className="text-bg text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:brightness-110"
                  style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)', boxShadow: '0 4px 15px rgba(245,200,66,0.25)' }}
                >
                  Send Email →
                </button>
              )}
              {step === 'sent' && (
                <span className="text-emerald-400 text-xs font-medium flex items-center gap-1.5">
                  <span>✓</span> Sent via Resend
                </span>
              )}
            </div>

            <div className="flex-1 relative">
              {step === 'idle' && (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center min-h-[400px]">
                  <div className="text-6xl mb-4 opacity-10">✉</div>
                  <div className="text-text-muted text-sm">Press an email button on the left to generate a live AI email for Jordan&apos;s cart</div>
                </div>
              )}
              {(step === 'webhook' || step === 'generating') && (
                <div className="flex flex-col items-center justify-center h-full p-8 min-h-[400px]">
                  <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mb-6" />
                  <div className="text-text-secondary text-sm text-center">
                    {step === 'webhook' ? 'Processing Shopify webhook...' : (
                      <div>
                        <div className="text-gold font-medium mb-2">Grok AI is writing...</div>
                        <div className="text-text-muted text-xs">{generatingText}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {(step === 'preview' || step === 'sent') && email && (
                <div className="h-full flex flex-col">
                  <div className="px-5 py-3 border-b border-white/5 space-y-1" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="text-xs text-text-muted">Subject: <span className="text-text-secondary">{email.subject}</span></div>
                    <div className="text-xs text-text-muted">Preview: <span className="text-text-secondary">{email.preview_text}</span></div>
                  </div>
                  <iframe
                    srcDoc={email.html_body}
                    title="Email preview"
                    className="flex-1 w-full bg-white"
                    sandbox="allow-same-origin"
                    style={{ minHeight: '500px' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
            Error: {error}
          </div>
        )}

        {/* CTA */}
        <div className="mt-6 glass-card p-5 flex flex-wrap items-center justify-between gap-4 border border-gold/10" style={{ background: 'rgba(245,200,66,0.02)' }}>
          <div>
            <div className="font-semibold text-white tracking-wide">Ready to deploy for your clients?</div>
            <div className="text-text-muted text-sm mt-0.5">Onboard a new client in under 5 minutes</div>
          </div>
          <a
            href="/onboard"
            className="text-bg text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:brightness-110 shrink-0"
            style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)', boxShadow: '0 4px 20px rgba(245,200,66,0.2)' }}
          >
            Add Client →
          </a>
        </div>
      </div>
    </div>
  )
}
