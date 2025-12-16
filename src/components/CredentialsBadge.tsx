'use client'

import { Shield, AlertCircle } from 'lucide-react'

interface CredentialsBadgeProps {
  credentials: 'SLP' | 'SLPA' | null | undefined
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function CredentialsBadge({ 
  credentials, 
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

  const isSLPA = credentials === 'SLPA'
  
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${
        isSLPA
          ? 'bg-amber-100 text-amber-800 border border-amber-200'
          : 'bg-blue-100 text-blue-800 border border-blue-200'
      } ${sizeClasses[size]}`}
      title={
        isSLPA
          ? 'Speech-Language Pathology Assistant - Limited access to resources'
          : 'Speech-Language Pathologist - Full access'
      }
    >
      {showIcon && (
        <Shield className={iconSizes[size]} />
      )}
      {credentials}
      {isSLPA && (
        <AlertCircle 
          className={iconSizes[size]} 
          title="SLPA has restricted access to certain resources"
        />
      )}
    </span>
  )
}

