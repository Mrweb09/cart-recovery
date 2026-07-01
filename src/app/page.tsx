'use client'

import { useState } from 'react'
import Link from 'next/link'

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

const FEATURES = [
  { icon: '✦', title: 'AI personalisation', desc: 'Every email is written by Claude AI, unique to each customer and the exact products they left. No templates. No filler.' },
  { icon: '⏱', title: '3-email sequence', desc: 'Emails fire automatically at 60 minutes, 24 hours, and 48 hours after abandonment — perfectly timed to recover the sale.' },
  { icon: '◈', title: 'Real-time dashboard', desc: 'Track every abandoned cart, email sent, and sale recovered. Full visibility at a glance.' },
  { icon: '⊡', title: 'Shopify integration', desc: 'Simple webhook setup — paste one URL into Shopify settings and you are live. No app store, no extra fees.' },
  { icon: '◉', title: 'Custom brand tone', desc: 'Friendly, professional, luxury or streetwear — the AI matches your brand voice on every single email.' },
  { icon: '£', title: 'Revenue tracking', desc: 'See exactly how much CartPulse has recovered. Clear ROI from the very first email sent.' },
]

const STEPS = [
  { n: '1', title: 'Connect Shopify', desc: 'We give you a webhook URL. Paste it into your Shopify settings. Done in under 5 minutes, no developer needed.' },
  { n: '2', title: 'AI writes the emails', desc: 'The moment a cart is abandoned, Claude AI writes a personalised email based on exactly what the customer left behind.' },
  { n: '3', title: 'Revenue recovered', desc: 'Emails send automatically at the perfect times. Customers come back, you get paid — while you sleep.' },
]

const FAQS = [
  { q: 'How long does setup take?', a: 'Under 5 minutes. You paste one webhook URL into your Shopify settings and you are live. We handle everything else.' },
  { q: 'How personalised are the emails really?', a: 'Each email is written from scratch by Claude AI. It uses the customer\'s name, the exact products they left, and your brand tone. No template, no placeholder text.' },
  { q: 'What if a customer unsubscribes?', a: 'Unsubscribes are handled automatically. We will never email someone who has opted out.' },
  { q: 'Does it work with any Shopify store?', a: 'Yes. Any Shopify store can connect via webhook. Works with all product types and all Shopify plans.' },
]

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen text-white overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-white/5" style={{ background: 'rgba(2,8,24,0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)', boxShadow: '0 0 20px rgba(245,200,66,0.3)' }}>
              <span className="text-bg text-xs font-bold">CP</span>
            </div>
            <span className="font-bold text-white tracking-wide">CartPulse</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/demo" className="text-text-secondary hover:text-white transition-colors">Demo</Link>
            <Link href="/calculator" className="text-text-secondary hover:text-white transition-colors">Calculator</Link>
            <Link href="/status" className="text-text-secondary hover:text-white transition-colors">Status</Link>
            <Link href="/dashboard" className="text-text-secondary hover:text-white transition-colors">Log in</Link>
            <Link href="/demo" className="text-bg text-sm font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition-all" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)' }}>
              See Demo
            </Link>
          </div>

          <button className="md:hidden text-text-secondary p-1" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 px-4 py-4 space-y-3 text-sm" style={{ background: 'rgba(2,8,24,0.98)' }}>
            <Link href="/demo" className="block text-text-secondary hover:text-white py-1" onClick={() => setMobileOpen(false)}>Demo</Link>
            <Link href="/calculator" className="block text-text-secondary hover:text-white py-1" onClick={() => setMobileOpen(false)}>Calculator</Link>
            <Link href="/dashboard" className="block text-text-secondary hover:text-white py-1" onClick={() => setMobileOpen(false)}>Log in</Link>
            <Link href="/demo" className="block text-bg font-semibold px-4 py-2.5 rounded-lg text-center" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)' }} onClick={() => setMobileOpen(false)}>
              See Demo
            </Link>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-10 animate-orb-float pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(245,200,66,0.5) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-8 animate-orb-float-alt pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(74,144,217,0.4) 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 glass-card px-3 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-gold text-xs font-semibold tracking-widest uppercase">AI-Powered Cart Recovery</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
                Turn abandoned carts into <span className="text-gold gold-glow">recovered revenue</span>
              </h1>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                CartPulse sends AI-personalised emails the moment a customer abandons their Shopify cart. No setup headaches. No effort. Just sales you would have lost.
              </p>
              <div className="flex flex-wrap gap-3 mb-5">
                <Link href="/demo" className="text-bg font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition-all text-sm" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)', boxShadow: '0 4px 20px rgba(245,200,66,0.25)' }}>
                  See it live →
                </Link>
                <Link href="/calculator" className="glass-card glass-card-hover px-6 py-3 rounded-lg text-text-secondary hover:text-white text-sm font-medium transition-all">
                  Calculate my losses
                </Link>
              </div>
              <p className="text-text-muted text-xs">No credit card required · 5 minute setup · Cancel anytime</p>
            </div>

            {/* Product preview card */}
            <div className="relative">
              <div className="glass-card p-5 border border-white/10" style={{ boxShadow: '0 0 60px rgba(245,200,66,0.06)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-red-500/60" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                  <span className="text-text-muted text-xs font-mono ml-2">cart-recovery · live</span>
                </div>
                <div className="font-mono text-xs space-y-1.5 mb-4">
                  <div className="text-green-300/70">→ Cart abandoned: jordan.m@gmail.com</div>
                  <div className="text-green-300/70">→ Cart value: £246.00 · 3 items</div>
                  <div className="text-gold">✦ Claude AI writing personalised email...</div>
                  <div className="text-emerald-400">✓ Email generated in 2.1s</div>
                  <div className="text-emerald-400">✓ Sent via Resend · delivery confirmed</div>
                </div>
                <div className="glass-card p-4 border border-gold/20" style={{ background: 'rgba(245,200,66,0.03)' }}>
                  <div className="text-xs text-text-muted mb-1.5">Generated subject line:</div>
                  <div className="text-sm font-semibold text-white">"Yo Jordan, your Oversized Hoodie is selling fast 👀"</div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <div className="text-xs text-text-muted">Personalised · UrbanThreads tone</div>
                    <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      Sent
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-2 md:-right-4 glass-card px-4 py-2.5 border border-emerald-500/25" style={{ background: 'rgba(16,185,129,0.08)' }}>
                <div className="text-emerald-400 font-bold text-sm">+£246 recovered</div>
                <div className="text-text-muted text-xs">while you were asleep</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-white/5" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 grid grid-cols-3 gap-4 text-center">
          {[
            { value: '69%', label: 'Average cart abandonment rate' },
            { value: '45%', label: 'Average email open rate' },
            { value: '3×', label: 'Email recovery sequence' },
          ].map((stat) => (
            <div key={stat.value}>
              <div className="text-2xl md:text-3xl font-bold text-gold gold-glow">{stat.value}</div>
              <div className="text-text-muted text-xs md:text-sm mt-1 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <div className="text-center mb-14">
          <div className="text-gold text-xs font-semibold tracking-widest uppercase mb-3">How it works</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Set up in 5 minutes. Runs forever.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div key={step.n} className="glass-card glass-card-gold p-7 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5 text-lg font-bold text-bg" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)', boxShadow: '0 0 24px rgba(245,200,66,0.25)' }}>
                {step.n}
              </div>
              <h3 className="font-bold text-white text-lg mb-3">{step.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-y border-white/5 py-20 md:py-28" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <div className="text-gold text-xs font-semibold tracking-widest uppercase mb-3">Features</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Everything you need to recover revenue</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass-card glass-card-hover p-6">
                <div className="text-gold text-2xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo CTA ── */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
        <div className="text-gold text-xs font-semibold tracking-widest uppercase mb-3">See it in action</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-5">Watch AI write a real cart recovery email in seconds</h2>
        <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">Click a button. Watch Claude AI analyse a real abandoned cart and write a personalised email from scratch. No template. No filler.</p>
        <Link href="/demo" className="inline-block text-bg font-semibold px-8 py-4 rounded-lg hover:brightness-110 transition-all text-base" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)', boxShadow: '0 4px 30px rgba(245,200,66,0.3)' }}>
          Launch live demo →
        </Link>
      </section>

      {/* ── Pricing ── */}
      <section className="border-y border-white/5 py-20 md:py-28" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <div className="text-gold text-xs font-semibold tracking-widest uppercase mb-3">Pricing</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Simple pricing. Serious returns.</h2>
            <p className="text-text-secondary mt-3">Most stores recover the monthly fee within the first week.</p>
          </div>
          <div className="max-w-sm mx-auto glass-card p-8 border border-gold/20 text-center" style={{ background: 'rgba(245,200,66,0.02)', boxShadow: '0 0 60px rgba(245,200,66,0.06)' }}>
            <div className="text-gold text-xs font-semibold tracking-widest uppercase mb-4">Monthly plan</div>
            <div className="text-5xl font-bold text-white mb-1">£99</div>
            <div className="text-text-muted text-sm mb-8">per month · cancel anytime</div>
            <div className="space-y-3 text-left mb-8">
              {[
                'Unlimited abandoned carts tracked',
                'AI personalised emails for every cart',
                '3-email recovery sequence',
                'Real-time dashboard and analytics',
                'Shopify webhook integration',
                'Custom brand tone and styling',
                'Full setup included',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                  <CheckIcon />
                  {item}
                </div>
              ))}
            </div>
            <Link href="/onboard" className="block text-bg font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition-all text-sm" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)' }}>
              Get started →
            </Link>
            <p className="text-text-muted text-xs mt-4">No setup fees · No long-term contracts</p>
          </div>
        </div>
      </section>

      {/* ── Calculator CTA ── */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">Not sure if it is worth it?</h2>
        <p className="text-text-secondary mb-6 max-w-xl mx-auto">Enter your monthly revenue and see exactly how much you could be recovering every single month.</p>
        <Link href="/calculator" className="inline-block glass-card glass-card-hover px-6 py-3 rounded-lg text-white font-medium text-sm transition-all">
          Calculate my losses →
        </Link>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-white/5 py-20 md:py-28" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">Common questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="glass-card glass-card-hover overflow-hidden">
                <button
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-white text-sm">{faq.q}</span>
                  <span className="text-gold text-lg shrink-0 leading-none">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-text-secondary text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <div className="glass-card p-10 md:p-16 text-center border border-gold/10 relative overflow-hidden" style={{ background: 'rgba(245,200,66,0.02)' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(245,200,66,0.12) 0%, transparent 70%)' }} />
          <div className="text-gold text-xs font-semibold tracking-widest uppercase mb-4 relative">Ready to start?</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4 relative">Stop losing sales to abandoned carts</h2>
          <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto relative">Every abandoned cart is a customer who almost bought. CartPulse brings them back automatically while you focus on everything else.</p>
          <div className="flex flex-wrap justify-center gap-3 relative">
            <Link href="/demo" className="text-bg font-semibold px-8 py-3.5 rounded-lg hover:brightness-110 transition-all text-sm" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)', boxShadow: '0 4px 30px rgba(245,200,66,0.25)' }}>
              See live demo →
            </Link>
            <Link href="/onboard" className="glass-card glass-card-hover px-8 py-3.5 rounded-lg text-text-secondary hover:text-white text-sm font-medium transition-all">
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)' }}>
              <span className="text-bg text-[10px] font-bold">CP</span>
            </div>
            <span className="font-bold text-white text-sm">CartPulse</span>
            <span className="text-text-muted text-xs">· Powered by Claude AI</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-text-muted">
            <Link href="/demo" className="hover:text-white transition-colors">Demo</Link>
            <Link href="/calculator" className="hover:text-white transition-colors">Calculator</Link>
            <Link href="/status" className="hover:text-white transition-colors">Status</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
