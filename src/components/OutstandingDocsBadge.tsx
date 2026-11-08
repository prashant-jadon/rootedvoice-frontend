'use client'

import { useEffect, useState } from 'react'
import { sessionAPI } from '@/lib/api'
import { AlertCircle, FileText } from 'lucide-react'

interface OutstandingPayload {
  missingAttendance: any[]
  missingSoap: any[]
  counts: { missingAttendance: number; missingSoap: number }
}

export default function OutstandingDocsBadge() {
  const [data, setData] = useState<OutstandingPayload | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    sessionAPI
      .outstanding()
      .then((r) => {
        if (!cancelled) setData(r.data.data)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  if (!data) return null
  const total = (data.counts?.missingAttendance || 0) + (data.counts?.missingSoap || 0)
  if (total === 0) return null

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span className="font-medium text-amber-900">
            {total} session{total === 1 ? '' : 's'} need documentation
          </span>
        </div>
        <span className="text-xs text-amber-700 underline">{open ? 'hide' : 'show'}</span>
      </button>
      {open && (
        <div className="mt-3 space-y-3 text-sm">
          {data.counts.missingAttendance > 0 && (
            <div>
              <div className="font-semibold text-amber-900 mb-1 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Missing attendance ({data.counts.missingAttendance})
              </div>
              <ul className="space-y-1 text-amber-900/90">
                {data.missingAttendance.slice(0, 10).map((s: any) => (
                  <li key={s._id}>
                    {s.clientId?.userId?.firstName || 'Client'}{' '}
                    {s.clientId?.userId?.lastName || ''} —{' '}
                    {new Date(s.scheduledDate).toLocaleDateString()} {s.scheduledTime}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.counts.missingSoap > 0 && (
            <div>
              <div className="font-semibold text-amber-900 mb-1 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Missing SOAP notes ({data.counts.missingSoap})
              </div>
              <ul className="space-y-1 text-amber-900/90">
                {data.missingSoap.slice(0, 10).map((s: any) => (
                  <li key={s._id}>
                    {s.clientId?.userId?.firstName || 'Client'}{' '}
                    {s.clientId?.userId?.lastName || ''} —{' '}
                    {new Date(s.scheduledDate).toLocaleDateString()} {s.scheduledTime}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
