'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Eye, LogOut } from 'lucide-react'

export default function ImpersonationBanner() {
  const { impersonation, endImpersonation, user } = useAuth()
  if (!impersonation) return null

  const expires = impersonation.expiresAt
    ? new Date(impersonation.expiresAt).toLocaleTimeString()
    : null

  const viewingAs = user?.email
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    : 'this user'

  return (
    <div className="w-full bg-amber-500 text-amber-950 border-b border-amber-700">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 text-sm">
        <Eye className="w-4 h-4 flex-shrink-0" />
        <div className="flex-1">
          <span className="font-semibold">Admin view-as mode</span> — you're viewing the app as{' '}
          <span className="font-mono">{viewingAs}</span> on behalf of{' '}
          <span className="font-mono">{impersonation.impersonatedByEmail || 'an admin'}</span>.
          Every action is written to the audit log.
          {expires && <span className="ml-1 text-amber-900/80">Session expires at {expires}.</span>}
        </div>
        <button
          onClick={endImpersonation}
          className="inline-flex items-center gap-1 bg-amber-900 text-amber-50 px-3 py-1 rounded hover:bg-amber-950"
        >
          <LogOut className="w-3.5 h-3.5" />
          End view-as
        </button>
      </div>
    </div>
  )
}
