import type { Metadata } from 'next'
import { NavLinks } from '@/components/dashboard/NavLinks'

export const metadata: Metadata = { title: 'Dashboard — CartRecovery' }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 flex flex-col border-r border-white/5" style={{ background: 'rgba(2,8,24,0.95)', backdropFilter: 'blur(20px)' }}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F5C842, #c9a535)', boxShadow: '0 0 20px rgba(245,200,66,0.3)' }}>
              <span className="text-bg text-xs font-bold">CR</span>
            </div>
            <div>
              <div className="font-bold text-white text-sm tracking-wide">CartRecovery</div>
              <div className="text-text-muted text-[10px] tracking-widest uppercase">AI Platform</div>
            </div>
          </div>
        </div>

        <NavLinks />

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/5">
          <div className="text-text-muted text-[10px] tracking-widest uppercase mb-0.5">Version 1.0</div>
          <div className="text-text-muted text-xs">Powered by Grok AI</div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
