'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: '◈' },
  { href: '/dashboard/carts', label: 'Carts', icon: '⊡' },
  { href: '/onboard', label: 'Add Client', icon: '+' },
  { href: '/demo', label: 'Demo', icon: '▷' },
  { href: '/status', label: 'Status', icon: '◉' },
]

export function NavLinks({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
              isActive
                ? 'text-gold bg-gold/8 border border-gold/20'
                : 'text-text-secondary hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className={`font-mono text-base transition-colors ${isActive ? 'text-gold' : 'text-text-muted group-hover:text-text-secondary'}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
            {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />}
          </Link>
        )
      })}
    </nav>
  )
}
