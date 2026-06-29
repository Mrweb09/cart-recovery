'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import type { EmailSent } from '@/types'

interface EmailTimelineProps {
  emails: EmailSent[]
}

const EMAIL_LABELS = {
  1: { label: 'Email 1', desc: '60 min after abandonment', tone: 'Warm & curious' },
  2: { label: 'Email 2', desc: '24 hrs after abandonment', tone: 'Urgency & FOMO' },
  3: { label: 'Email 3', desc: '48 hrs after abandonment', tone: 'Soft goodbye' },
}

export function EmailTimeline({ emails }: EmailTimelineProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (!emails.length) {
    return (
      <div className="text-center py-10 text-text-muted text-sm">
        No emails sent yet — sequence is scheduled.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {emails.map((email) => {
        const meta = EMAIL_LABELS[email.email_number]
        const isExpanded = expanded === email.id

        return (
          <div key={email.id} className="glass-card overflow-hidden">
            <button
              onClick={() => setExpanded(isExpanded ? null : email.id)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gold/15 text-gold flex items-center justify-center text-xs font-bold shrink-0 border border-gold/20">
                {email.email_number}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm">{email.subject}</div>
                <div className="text-text-muted text-xs mt-0.5">
                  {meta.desc} · {meta.tone} · {new Date(email.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {email.opened && <Badge variant="success">Opened</Badge>}
                {email.clicked && <Badge variant="gold">Clicked</Badge>}
                {email.converted && <Badge variant="success">Converted</Badge>}
                {!email.opened && !email.clicked && <Badge variant="neutral">Delivered</Badge>}
                <svg
                  className={`w-4 h-4 text-text-muted transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-white/5">
                <div className="p-4">
                  <div className="text-xs text-text-muted mb-3 font-medium uppercase tracking-wider">Email Preview</div>
                  <div className="rounded-lg overflow-hidden border border-white/8" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <iframe
                      srcDoc={email.body}
                      title={`Email ${email.email_number}`}
                      className="w-full min-h-[400px] bg-white"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
