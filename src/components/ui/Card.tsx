interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
}

export function Card({ children, className = '', glow }: CardProps) {
  return (
    <div className={`glass-card glass-card-hover p-6 ${glow ? 'glass-card-gold' : ''} ${className}`}>
      {children}
    </div>
  )
}
