'use client'

import { AlertTriangle, Info } from 'lucide-react'

interface SLPAWarningProps {
  message: string
  type?: 'warning' | 'info' | 'error'
  showIcon?: boolean
}

export default function SLPAWarning({ 
  message, 
  type = 'warning',
  showIcon = true 
}: SLPAWarningProps) {
  const styles = {
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  }

  const icons = {
    warning: AlertTriangle,
    info: Info,
    error: AlertTriangle,
  }

  const Icon = icons[type]

  return (
    <div className={`rounded-lg border p-3 ${styles[type]}`}>
      <div className="flex items-start gap-2">
        {showIcon && (
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        )}
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  )
}

