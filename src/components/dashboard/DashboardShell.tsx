'use client'

import { useState } from 'react'
import { NavLinks } from './NavLinks'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-30 w-60 shrink-0 flex flex-col border-r border-white/5 transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'rgba(2,8,24,0.98)', backdropFilter: 'blur(20px)' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)', boxShadow: '0 0 20px rgba(245,200,66,0.3)' }}>
              <span className="text-bg text-xs font-bold">CR</span>
            </div>
            <div>
              <div className="font-bold text-white text-sm tracking-wide">CartRecovery</div>
              <div className="text-text-muted text-[10px] tracking-widest uppercase">AI Platform</div>
            </div>
          </div>
        </div>

        <NavLinks onItemClick={() => setOpen(false)} />

        <div className="px-5 py-4 border-t border-white/5">
          <div className="text-text-muted text-[10px] tracking-widest uppercase mb-0.5">Version 1.0</div>
          <div className="text-text-muted text-xs">Powered by Claude AI</div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-10 flex items-center gap-3 px-4 py-3 border-b border-white/5" style={{ background: 'rgba(2,8,24,0.95)', backdropFilter: 'blur(20px)' }}>
          <button
            onClick={() => setOpen(true)}
            className="text-text-secondary hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)' }}>
              <span className="text-bg text-[10px] font-bold">CR</span>
            </div>
            <span className="font-bold text-white text-sm">CartRecovery</span>
          </div>
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
