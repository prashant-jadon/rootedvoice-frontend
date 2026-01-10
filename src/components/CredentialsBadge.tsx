'use client'

import { Star, CheckCircle, Puzzle } from 'lucide-react'

interface CredentialsBadgeProps {
  credentials: 'SLP' | 'SLPA' | null | undefined
  canSupervise?: boolean
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function CredentialsBadge({ 
  credentials, 
  canSupervise = false,
  showIcon = true,
  size = 'md' 
}: CredentialsBadgeProps) {
  if (!credentials) return null

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  // Supervising SLP
  if (credentials === 'SLP' && canSupervise) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-yellow-100 text-yellow-800 ${sizeClasses[size]}`}
        title="⭐ Supervising SLP - Can supervise SLPA assistants"
      >
        {showIcon && (
          <Star className={`${iconSizes[size]} fill-yellow-600 text-yellow-600`} />
        )}
        Supervising SLP
      </span>
    )
  }

  // Licensed SLP
  if (credentials === 'SLP') {
  return (
    <span
        className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-green-100 text-green-800 ${sizeClasses[size]}`}
        title="✔️ Licensed SLP - Speech-Language Pathologist"
    >
      {showIcon && (
          <CheckCircle className={iconSizes[size]} />
      )}
        Licensed SLP
        </span>
    )
  }

  // SLPA
  if (credentials === 'SLPA') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-blue-100 text-blue-800 ${sizeClasses[size]}`}
        title="🧩 SLPA - Speech-Language Pathology Assistant"
      >
        {showIcon && (
          <Puzzle className={iconSizes[size]} />
      )}
        SLPA
    </span>
  )
  }

  return null
}

