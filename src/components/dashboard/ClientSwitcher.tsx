'use client'

import { useState, useEffect } from 'react'
import type { Client } from '@/types'

interface ClientSwitcherProps {
  selectedId: string | null
  onChange: (clientId: string | null) => void
}

export function ClientSwitcher({ selectedId, onChange }: ClientSwitcherProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch('/api/clients')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setClients(data) })
      .catch(console.error)
  }, [])

  const selected = clients.find((c) => c.id === selectedId)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 glass-card px-3 py-2 text-sm text-text-secondary hover:text-white hover:border-gold/25 transition-all duration-200"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
        <span className="font-medium">{selected?.brand_name ?? 'All Clients'}</span>
        <svg className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 w-60 glass-card shadow-2xl shadow-black/60 z-50 overflow-hidden animate-in p-1">
          <button
            onClick={() => { onChange(null); setOpen(false) }}
            className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors ${!selectedId ? 'text-gold bg-gold/8' : 'text-text-primary hover:bg-white/5'}`}
          >
            All Clients
          </button>
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => { onChange(client.id); setOpen(false) }}
              className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors ${selectedId === client.id ? 'text-gold bg-gold/8' : 'text-text-primary hover:bg-white/5'}`}
            >
              <div>{client.brand_name}</div>
              <div className="text-xs text-text-muted">{client.shopify_domain}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
