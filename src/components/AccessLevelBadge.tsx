'use client'

import { Lock, Unlock, Users } from 'lucide-react'

interface AccessLevelBadgeProps {
  accessLevel: 'SLP' | 'SLPA' | 'public'
  size?: 'sm' | 'md'
}

export default function AccessLevelBadge({ 
  accessLevel, 
  size = 'sm' 
}: AccessLevelBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
  }

  const styles = {
    SLP: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-200',
      icon: Lock,
      label: 'SLP Only',
      title: 'Restricted to Speech-Language Pathologists only',
    },
    SLPA: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: Users,
      label: 'SLPA+',
      title: 'Available to SLPA and SLP',
    },
    public: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: Unlock,
      label: 'Public',
      title: 'Available to everyone',
    },
  }

  const style = styles[accessLevel]
  const Icon = style.icon

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium border ${style.bg} ${style.text} ${style.border} ${sizeClasses[size]}`}
      title={style.title}
    >
      <Icon className={iconSizes[size]} />
      {style.label}
    </span>
  )
}

