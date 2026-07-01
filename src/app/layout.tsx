import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CartPulse — AI Cart Recovery for Shopify',
  description: 'CartPulse automatically sends AI-personalised recovery emails when customers abandon their Shopify cart. Set up in 5 minutes. Recover revenue on autopilot.',
  keywords: ['shopify cart recovery', 'abandoned cart emails', 'AI email automation', 'shopify marketing'],
  openGraph: {
    title: 'CartPulse — AI Cart Recovery for Shopify',
    description: 'Automatically recover abandoned Shopify carts with AI-personalised emails. Set up in 5 minutes.',
    url: 'https://cartpulse-io.vercel.app',
    siteName: 'CartPulse',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CartPulse — AI Cart Recovery for Shopify',
    description: 'Automatically recover abandoned Shopify carts with AI-personalised emails. Set up in 5 minutes.',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-bg text-text-primary antialiased`}>
        {/* Ambient background orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div
            className="absolute top-[-15%] left-[-5%] w-[700px] h-[700px] rounded-full animate-orb-float"
            style={{ background: 'radial-gradient(circle, rgba(245,200,66,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }}
          />
          <div
            className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full animate-orb-float-alt"
            style={{ background: 'radial-gradient(circle, rgba(74,144,217,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }}
          />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
