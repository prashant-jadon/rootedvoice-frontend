'use client'

import { useEffect, useState, useRef } from 'react'
import { Clock, AlertTriangle, AlarmClock } from 'lucide-react'

interface SessionTimerProps {
  scheduledDurationMinutes: number
  startTimeMs?: number
  warningMinutesBeforeEnd?: number
  onWarning?: () => void
  onTimeUp?: () => void
  compact?: boolean
}

export default function SessionTimer({
  scheduledDurationMinutes,
  startTimeMs,
  warningMinutesBeforeEnd = 5,
  onWarning,
  onTimeUp,
  compact = false,
}: SessionTimerProps) {
  const startRef = useRef<number>(startTimeMs ?? Date.now())
  const [elapsedSec, setElapsedSec] = useState(0)
  const firedWarningRef = useRef(false)
  const firedTimeUpRef = useRef(false)

  useEffect(() => {
    if (startTimeMs) startRef.current = startTimeMs
  }, [startTimeMs])

  useEffect(() => {
    const tick = () => setElapsedSec(Math.floor((Date.now() - startRef.current) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const totalSec = scheduledDurationMinutes * 60
  const remainingSec = totalSec - elapsedSec
  const warningSec = warningMinutesBeforeEnd * 60

  const isWarning = remainingSec <= warningSec && remainingSec > 0
  const isTimeUp = remainingSec <= 0
  const isOvertime = remainingSec < 0

  useEffect(() => {
    if (isWarning && !firedWarningRef.current) {
      firedWarningRef.current = true
      onWarning?.()
    }
    if (isTimeUp && !firedTimeUpRef.current) {
      firedTimeUpRef.current = true
      onTimeUp?.()
    }
  }, [isWarning, isTimeUp, onWarning, onTimeUp])

  const absRemaining = Math.abs(remainingSec)
  const mm = String(Math.floor(absRemaining / 60)).padStart(2, '0')
  const ss = String(absRemaining % 60).padStart(2, '0')

  const label = isOvertime ? 'Overtime' : isTimeUp ? 'Time up' : isWarning ? `${warningMinutesBeforeEnd} min warning` : 'Scheduled'

  const barPct = Math.min(100, Math.max(0, (elapsedSec / totalSec) * 100))

  const color = isOvertime
    ? '#dc2626'
    : isWarning
    ? '#ef4444'
    : barPct > 75
    ? '#f59e0b'
    : '#10b981'

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
          isOvertime || isTimeUp
            ? 'bg-red-600 text-white animate-pulse'
            : isWarning
            ? 'bg-red-500/20 border border-red-500/60 text-red-200 animate-pulse'
            : 'bg-white/10 text-white/80'
        }`}
      >
        {isOvertime || isTimeUp ? (
          <AlarmClock className="w-3.5 h-3.5" />
        ) : isWarning ? (
          <AlertTriangle className="w-3.5 h-3.5" />
        ) : (
          <Clock className="w-3.5 h-3.5" />
        )}
        <span>
          {isOvertime ? '+' : ''}
          {mm}:{ss}
        </span>
        <span className="hidden md:inline text-[10px] opacity-70">
          / {scheduledDurationMinutes}m
        </span>
      </div>
    )
  }

  return (
    <div
      className={`rounded-xl border p-3 transition-all ${
        isOvertime || isTimeUp
          ? 'border-red-500 bg-red-600/90 text-white shadow-lg shadow-red-500/40 animate-pulse'
          : isWarning
          ? 'border-red-400/60 bg-red-500/15 text-red-100 animate-pulse'
          : 'border-white/10 bg-white/5 text-white/80'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isOvertime || isTimeUp ? (
            <AlarmClock className="w-4 h-4" />
          ) : isWarning ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <Clock className="w-4 h-4" />
          )}
          <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
        </div>
        <span className="text-sm font-mono font-bold">
          {isOvertime ? '+' : ''}
          {mm}:{ss}
        </span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${barPct}%`, background: color }}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[10px] text-white/50">
        <span>
          {Math.floor(elapsedSec / 60)}:{String(elapsedSec % 60).padStart(2, '0')} elapsed
        </span>
        <span>{scheduledDurationMinutes} min scheduled</span>
      </div>
      {isWarning && !isTimeUp && (
        <div className="mt-2 text-xs font-medium">
          {warningMinutesBeforeEnd} minutes remaining — begin wrap-up.
        </div>
      )}
      {isTimeUp && !isOvertime && (
        <div className="mt-2 text-xs font-bold">
          Scheduled time is up.
        </div>
      )}
      {isOvertime && (
        <div className="mt-2 text-xs font-bold">
          Session is {Math.floor(absRemaining / 60)}m {absRemaining % 60}s over scheduled time.
        </div>
      )}
    </div>
  )
}
