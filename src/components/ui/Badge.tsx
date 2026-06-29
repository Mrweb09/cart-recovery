interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'gold' | 'purple' | 'neutral'
  children: React.ReactNode
  dot?: boolean
}

const VARIANTS = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  gold: 'bg-gold/10 text-gold border-gold/25',
  purple: 'bg-accent/10 text-accent border-accent/20',
  neutral: 'bg-white/5 text-text-secondary border-white/10',
}

const DOT_COLORS = {
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-red-400',
  gold: 'bg-gold',
  purple: 'bg-accent',
  neutral: 'bg-text-secondary',
}

export function Badge({ variant = 'neutral', children, dot }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${VARIANTS[variant]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${DOT_COLORS[variant]}`} />}
      {children}
    </span>
  )
}
