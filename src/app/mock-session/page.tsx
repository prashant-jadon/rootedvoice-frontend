'use client'

import { useState } from 'react'
import {
  CalendarCheck,
  Video,
  Timer,
  ClipboardList,
  CheckCircle2,
  Play,
  ArrowRight,
  PhoneOff,
  Users,
  BookOpen,
  AlertTriangle,
  Clock,
  Shield,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SessionTimer from '@/components/SessionTimer'
import PostSessionWrapUp from '@/components/PostSessionWrapUp'
import ProtectedRoute from '@/components/ProtectedRoute'
import Header from '@/components/Header'

type Stage = 'intro' | 'prep' | 'in-session' | 'wrap' | 'done'

export default function MockSessionPage() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('intro')
  const [durationMin, setDurationMin] = useState(5) // short demo duration
  const [sessionStart, setSessionStart] = useState<number>(0)
  const [warning, setWarning] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const [showWrap, setShowWrap] = useState(false)

  const startSession = () => {
    setSessionStart(Date.now())
    setWarning(false)
    setTimeUp(false)
    setStage('in-session')
  }

  const endSession = () => {
    setShowWrap(true)
  }

  return (
    <ProtectedRoute allowedRoles={['therapist']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
        <Header />

        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-700 font-semibold mb-2">
              <BookOpen className="w-4 h-4" />
              Training walkthrough
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Mock Therapy Session</h1>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Practice the full session flow — from pre-session prep, through the live video call
              with a visible timer, to post-session attendance and SOAP note. Nothing you do here
              affects real client records.
            </p>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto">
            {([
              { k: 'intro', label: 'Intro', icon: BookOpen },
              { k: 'prep', label: 'Prep', icon: CalendarCheck },
              { k: 'in-session', label: 'Session', icon: Video },
              { k: 'wrap', label: 'Wrap-up', icon: ClipboardList },
              { k: 'done', label: 'Done', icon: CheckCircle2 },
            ] as const).map((s, idx, arr) => {
              const active = stage === s.k
              const idxOf = (k: Stage) => arr.findIndex(a => a.k === k)
              const passed = idxOf(stage) > idx
              const Icon = s.icon
              return (
                <div key={s.k} className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                      active
                        ? 'bg-emerald-600 text-white'
                        : passed
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {s.label}
                  </div>
                  {idx < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-300" />}
                </div>
              )
            })}
          </div>

          {/* Content per stage */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            {stage === 'intro' && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-slate-900">What you'll see</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Highlight icon={CalendarCheck} title="Pre-session prep" body="Confirm who's on your schedule, check documents, review goals." />
                  <Highlight icon={Timer} title="Visible session timer" body="A countdown appears for the scheduled length. A red '5 min remaining' warning fires, then an overtime alert." />
                  <Highlight icon={Users} title="Live video call" body="Jitsi-based secure call with live captions and translation." />
                  <Highlight icon={ClipboardList} title="Attendance + SOAP" body="After the call, record whether the client attended / no-showed / cancelled, then enter your session note." />
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Shield className="w-3.5 h-3.5" />
                    Nothing in this walkthrough touches a real client's record.
                  </div>
                  <button
                    onClick={() => setStage('prep')}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm flex items-center gap-2"
                  >
                    Start walkthrough <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {stage === 'prep' && (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold text-slate-900">Pre-session checklist</h2>
                <ul className="space-y-2 text-sm text-slate-700">
                  {[
                    'Review client\'s most recent evaluation and current goals',
                    'Confirm materials you\'ll use (worksheets, assessments, visuals)',
                    'Verify your camera, mic, and quiet space',
                    'Open any session notes or data sheets you want handy',
                  ].map(t => (
                    <li key={t} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">
                    Mock session duration
                  </label>
                  <div className="flex items-center gap-2">
                    {[2, 5, 10, 30].map(d => (
                      <button
                        key={d}
                        onClick={() => setDurationMin(d)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                          durationMin === d
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        {d} min
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    For the walkthrough, pick a short duration so you can see the "5 min remaining"
                    warning and overtime alert quickly.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setStage('intro')}
                    className="text-sm text-slate-500 hover:text-slate-700"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={startSession}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" /> Enter session
                  </button>
                </div>
              </div>
            )}

            {stage === 'in-session' && (
              <div className="space-y-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">You're in a mock session</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Watch the timer — a warning banner fires before the scheduled end, then an
                      overtime banner. In a real session this would be a Jitsi video call.
                    </p>
                  </div>
                  <button
                    onClick={endSession}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    <PhoneOff className="w-4 h-4" /> End session
                  </button>
                </div>

                {/* Fake video area */}
                <div className="aspect-video rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 flex items-center justify-center text-white/40 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Mock video area</p>
                      <p className="text-xs opacity-60">The real session uses secure Jitsi video</p>
                    </div>
                  </div>
                  {warning && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold animate-pulse flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      5 minutes remaining
                    </div>
                  )}
                  {timeUp && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold animate-pulse flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Scheduled time is up — please wrap up
                    </div>
                  )}
                </div>

                {/* Timer */}
                <SessionTimer
                  scheduledDurationMinutes={durationMin}
                  startTimeMs={sessionStart}
                  warningMinutesBeforeEnd={Math.min(5, Math.max(1, Math.floor(durationMin / 2)))}
                  onWarning={() => setWarning(true)}
                  onTimeUp={() => setTimeUp(true)}
                />

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                  <strong>What to notice:</strong> the countdown shifts to red at the warning point
                  and to a pulsing banner once overtime begins. Both of these happen on real
                  sessions, visible to the therapist only.
                </div>
              </div>
            )}

            {stage === 'wrap' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Wrap-up submitted</h2>
                <p className="text-slate-600 text-sm">
                  You'll do this on every real session too — attendance first, then (if attended) a
                  SOAP note. Both land on the admin dashboard for review.
                </p>
                <button
                  onClick={() => setStage('done')}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm"
                >
                  Finish walkthrough
                </button>
              </div>
            )}

            {stage === 'done' && (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Walkthrough complete</h2>
                <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
                  You've seen the end-to-end flow. You can repeat this anytime from the dashboard.
                </p>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <button
                    onClick={() => {
                      setStage('intro')
                      setWarning(false)
                      setTimeUp(false)
                    }}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Run again
                  </button>
                  <Link
                    href="/dashboard"
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
                  >
                    Back to dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {showWrap && (
          <PostSessionWrapUp
            sessionId="mock"
            isMock
            clientName="Jamie R. (demo client)"
            onClose={() => {
              setShowWrap(false)
              setStage('wrap')
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}

function Highlight({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
        <Icon className="w-4 h-4" />
      </div>
      <div className="font-medium text-slate-900 text-sm">{title}</div>
      <div className="text-xs text-slate-600 mt-1">{body}</div>
    </div>
  )
}
