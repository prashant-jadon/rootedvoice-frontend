'use client'

import { useEffect, useRef, useState } from 'react'
import { X, ChevronRight, ChevronLeft, PlayCircle, Sparkles, CheckCircle2 } from 'lucide-react'

export interface TourStep {
  selector?: string         // CSS selector to highlight — omit for a centered modal step
  title: string
  body: string
  videoUrl?: string         // Optional training video URL
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
}

interface Props {
  steps: TourStep[]
  storageKey: string        // localStorage key to remember completion
  autoStart?: boolean
  onDone?: () => void
}

export default function OnboardingTour({ steps, storageKey, autoStart = true, onDone }: Props) {
  const [active, setActive] = useState(false)
  const [idx, setIdx] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Decide whether to show on mount
  useEffect(() => {
    if (!autoStart) return
    try {
      const done = typeof window !== 'undefined' && localStorage.getItem(storageKey)
      if (!done) setActive(true)
    } catch {
      // storage might be blocked
    }
  }, [autoStart, storageKey])

  // Recompute highlight rect when step changes / on resize
  useEffect(() => {
    if (!active) return
    const step = steps[idx]
    if (!step?.selector) {
      setTargetRect(null)
      return
    }
    const compute = () => {
      const el = document.querySelector(step.selector!) as HTMLElement | null
      if (!el) {
        setTargetRect(null)
        return
      }
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
      scrollTimerRef.current = setTimeout(() => {
        setTargetRect(el.getBoundingClientRect())
      }, 350)
    }
    compute()
    window.addEventListener('resize', compute)
    window.addEventListener('scroll', compute, true)
    return () => {
      window.removeEventListener('resize', compute)
      window.removeEventListener('scroll', compute, true)
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    }
  }, [active, idx, steps])

  const finish = () => {
    try { localStorage.setItem(storageKey, new Date().toISOString()) } catch {}
    setActive(false)
    setIdx(0)
    onDone?.()
  }

  const skip = () => finish()

  if (!active) return null

  const step = steps[idx]
  const isLast = idx === steps.length - 1
  const isFirst = idx === 0

  // Compute tooltip positioning
  const PAD = 12
  const TOOLTIP_W = 360
  let tipStyle: React.CSSProperties = {
    position: 'fixed',
    width: `${TOOLTIP_W}px`,
    zIndex: 110,
  }
  if (targetRect) {
    const vw = window.innerWidth
    const vh = window.innerHeight
    // Prefer below the target, fall back to above
    const spaceBelow = vh - targetRect.bottom
    const spaceAbove = targetRect.top
    const placeBelow = spaceBelow >= 220 || spaceBelow >= spaceAbove
    let top = placeBelow ? targetRect.bottom + PAD : Math.max(16, targetRect.top - 220 - PAD)
    let left = Math.min(
      Math.max(16, targetRect.left + targetRect.width / 2 - TOOLTIP_W / 2),
      vw - TOOLTIP_W - 16
    )
    tipStyle = { ...tipStyle, top, left }
  } else {
    // Centered
    tipStyle = {
      ...tipStyle,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'min(480px, calc(100vw - 32px))',
    }
  }

  return (
    <>
      {/* Overlay with cut-out for target */}
      <div className="fixed inset-0 z-[100] pointer-events-auto" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'auto' }}>
          <defs>
            <mask id="tour-mask">
              <rect width="100%" height="100%" fill="white" />
              {targetRect && (
                <rect
                  x={targetRect.left - 6}
                  y={targetRect.top - 6}
                  width={targetRect.width + 12}
                  height={targetRect.height + 12}
                  rx="10"
                  ry="10"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(15,23,42,0.72)"
            mask="url(#tour-mask)"
          />
          {targetRect && (
            <rect
              x={targetRect.left - 6}
              y={targetRect.top - 6}
              width={targetRect.width + 12}
              height={targetRect.height + 12}
              rx="10"
              ry="10"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              className="animate-pulse"
            />
          )}
        </svg>
      </div>

      {/* Tooltip */}
      <div
        style={tipStyle}
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Therapist onboarding · Step {idx + 1} of {steps.length}
            </div>
            <h3 className="text-base font-semibold text-slate-900 mt-1">{step.title}</h3>
          </div>
          <button onClick={skip} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pb-4">
          <p className="text-sm text-slate-600 leading-relaxed">{step.body}</p>

          {step.videoUrl && (
            <a
              href={step.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:text-emerald-800 font-medium"
            >
              <PlayCircle className="w-4 h-4" />
              Watch training video (2 min)
            </a>
          )}
        </div>

        {/* Progress + controls */}
        <div className="px-5 py-3 bg-slate-50 flex items-center justify-between border-t border-slate-100">
          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-5 rounded-full ${
                  i === idx ? 'bg-emerald-500' : i < idx ? 'bg-emerald-300' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={() => setIdx(i => Math.max(0, i - 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
            {!isLast ? (
              <button
                onClick={() => setIdx(i => Math.min(steps.length - 1, i + 1))}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={finish}
                className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Finish
              </button>
            )}
          </div>
        </div>

        {/* Skip hint */}
        <button
          onClick={skip}
          className="w-full text-center text-[11px] text-slate-400 hover:text-slate-600 py-2 border-t border-slate-100"
        >
          Skip onboarding — you can re-launch it from the help menu anytime
        </button>
      </div>
    </>
  )
}

// Default step set for the therapist dashboard. Selectors use data-tour="…" attributes
// that the dashboard sprinkles in. Steps without a selector show as centered modals.
export const THERAPIST_DASHBOARD_TOUR: TourStep[] = [
  {
    title: 'Welcome to Rooted Voices 👋',
    body:
      "Let's take a 2-minute tour so you know exactly how to run sessions, log attendance, and document notes on this platform. You can replay this anytime from the help menu.",
    videoUrl: 'https://www.loom.com/share/placeholder-welcome',
  },
  {
    selector: '[data-tour="upcoming-sessions"]',
    title: 'Your upcoming sessions',
    body:
      "This is your live schedule. Click a session to see client details, open the video room, or reschedule. Reminders go out automatically 24h and 45m before each start.",
  },
  {
    selector: '[data-tour="join-session"]',
    title: 'Starting a session',
    body:
      "When it's time, click Join. You'll enter a secure Jitsi call with a visible countdown timer. At the warning point you'll see a red '5 minutes remaining' banner, then an overtime alert — so you can pace and finish on time.",
    videoUrl: 'https://www.loom.com/share/placeholder-session',
  },
  {
    selector: '[data-tour="clients"]',
    title: 'Your clients',
    body:
      "Review assigned clients, their goals, evaluation results, and recent notes here. You can also message families from each client page.",
  },
  {
    selector: '[data-tour="mock-session"]',
    title: 'Try a mock session',
    body:
      "Before your first real session, run the mock walkthrough. It takes 2 minutes and shows the timer, warnings, attendance logging and SOAP note submission end-to-end — with no real client involved.",
  },
  {
    title: 'Documentation & compliance',
    body:
      "After every session you'll log attendance (attended / no-show / cancelled) and submit a SOAP note. These flow straight to the admin dashboard for review. If you need help, use the chat widget bottom-right or email support.",
  },
  {
    title: "You're ready",
    body:
      "That's the full tour. Your onboarding checklist (ICA, HIPAA, W-9, orientation) lives on your profile page — complete those to unlock full client access. Good luck!",
  },
]
