'use client'

interface MetricsCardProps {
  label: string
  value: string
  subtext?: string
  trend?: number
  icon: React.ReactNode
  color?: 'purple' | 'green' | 'blue' | 'orange' | 'gold'
}

const ICON_COLORS = {
  purple: 'text-accent bg-accent/10',
  green: 'text-emerald-400 bg-emerald-500/10',
  blue: 'text-accent bg-accent/10',
  orange: 'text-amber-400 bg-amber-500/10',
  gold: 'text-gold bg-gold/10',
}

export function MetricsCard({ label, value, subtext, trend, icon, color = 'gold' }: MetricsCardProps) {
  return (
    <div className="glass-card glass-card-hover glass-card-gold p-5 flex flex-col gap-4 group cursor-default">
      <div className="flex items-center justify-between">
        <span className="text-text-secondary text-sm font-medium tracking-wide">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${ICON_COLORS[color]}`}>
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-gold tracking-tight gold-glow animate-in">
          {value}
        </div>
        {subtext && <div className="text-text-muted text-xs mt-1.5">{subtext}</div>}
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          <span>{trend >= 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(trend).toFixed(1)}% vs last 7 days</span>
        </div>
      )}
    </div>
  )
}
