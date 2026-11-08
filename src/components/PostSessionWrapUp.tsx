'use client'

import { useState } from 'react'
import { X, CheckCircle2, UserX, Ban, Clock3, Sparkles, Save } from 'lucide-react'
import { sessionAPI } from '@/lib/api'

type AttendanceStatus = 'attended' | 'no-show' | 'cancelled-by-client' | 'cancelled-by-therapist' | 'late-cancel'

interface Props {
  sessionId: string
  isMock?: boolean
  clientName?: string
  defaultSoap?: {
    subjective?: string
    objective?: string
    assessment?: string
    plan?: string
  }
  onClose: () => void
  onSubmitted?: () => void
}

const ATTENDANCE_OPTIONS: {
  value: AttendanceStatus
  label: string
  desc: string
  icon: any
  color: string
}[] = [
  {
    value: 'attended',
    label: 'Attended',
    desc: 'Client was present and the session took place',
    icon: CheckCircle2,
    color: 'emerald',
  },
  {
    value: 'no-show',
    label: 'No-call / No-show',
    desc: 'Client did not attend and did not contact',
    icon: UserX,
    color: 'red',
  },
  {
    value: 'cancelled-by-client',
    label: 'Cancelled by client',
    desc: 'Client cancelled before the session',
    icon: Ban,
    color: 'amber',
  },
  {
    value: 'late-cancel',
    label: 'Late cancellation',
    desc: 'Client cancelled within 24 hours',
    icon: Clock3,
    color: 'orange',
  },
  {
    value: 'cancelled-by-therapist',
    label: 'Cancelled by therapist',
    desc: 'You had to cancel this session',
    icon: Ban,
    color: 'slate',
  },
]

export default function PostSessionWrapUp({
  sessionId,
  isMock = false,
  clientName,
  defaultSoap,
  onClose,
  onSubmitted,
}: Props) {
  const [step, setStep] = useState<1 | 2>(1)
  const [attendance, setAttendance] = useState<AttendanceStatus | null>(null)
  const [attendanceNotes, setAttendanceNotes] = useState('')

  const [subjective, setSubjective] = useState(defaultSoap?.subjective || '')
  const [objective, setObjective] = useState(defaultSoap?.objective || '')
  const [assessment, setAssessment] = useState(defaultSoap?.assessment || '')
  const [plan, setPlan] = useState(defaultSoap?.plan || '')

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [cancellationFee, setCancellationFee] = useState<number | null>(null)

  const needsSoap = attendance === 'attended'

  const handleContinue = async () => {
    if (!attendance) return
    setError('')

    if (isMock) {
      // Skip API; mock walkthrough only
      if (needsSoap) {
        setStep(2)
      } else {
        setDone(true)
      }
      return
    }

    setIsSaving(true)
    try {
      const res = await sessionAPI.recordAttendance(sessionId, {
        status: attendance,
        notes: attendanceNotes,
      })
      const fee = res?.data?.cancellationFee
      if (typeof fee === 'number' && fee > 0) {
        setCancellationFee(fee)
      }
      if (needsSoap) {
        setStep(2)
      } else {
        setDone(true)
        onSubmitted?.()
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to save attendance')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmitSoap = async (opts?: { finalize?: boolean }) => {
    if (isMock) {
      setDone(true)
      return
    }
    setIsSaving(true)
    setError('')
    try {
      await sessionAPI.saveSoapNote(sessionId, {
        subjective,
        objective,
        assessment,
        plan,
      })
      if (opts?.finalize) {
        await (sessionAPI as any).finalizeSoap?.(sessionId)
      }
      await sessionAPI.complete(sessionId, `${subjective}\n\n${objective}\n\n${assessment}\n\n${plan}`.trim())
      setDone(true)
      onSubmitted?.()
    } catch (e: any) {
      if (e?.response?.data?.soapLocked) {
        setError('This SOAP note is already finalized. Submit an addendum from the session page instead.')
      } else {
        setError(e?.response?.data?.message || 'Failed to save SOAP note')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const generateAIDraft = async () => {
    if (isMock) {
      setSubjective(
        "Client reported feeling more confident producing /r/ sounds in structured contexts. Caregiver noted increased willingness to speak at home."
      )
      setObjective(
        "Produced /r/ in initial position of single words with 82% accuracy (41/50 trials) with minimal visual cues. Reduced jaw tension observed."
      )
      setAssessment(
        "Steady progress toward goal of 90% accuracy in word-level /r/ production. Generalization to conversation remains emerging."
      )
      setPlan(
        "Continue phoneme practice at word and phrase level. Introduce short carrier phrases next session. Send home practice list to caregiver."
      )
      return
    }
    setIsSaving(true)
    setError('')
    try {
      const res = await sessionAPI.saveSoapNote(sessionId, { subjective, objective, assessment, plan })
      // trigger AI generation on server
      const genRes = await (sessionAPI as any).generateSoap?.(sessionId)
      const soap = genRes?.data?.data?.soapNote
      if (soap) {
        setSubjective(soap.subjective || subjective)
        setObjective(soap.objective || objective)
        setAssessment(soap.assessment || assessment)
        setPlan(soap.plan || plan)
      }
    } catch {
      setError('AI draft unavailable right now — fill in manually.')
    } finally {
      setIsSaving(false)
    }
  }

  if (done) {
    return (
      <Shell onClose={onClose} title="Session wrap-up complete">
        <div className="flex flex-col items-center text-center py-10 gap-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">All set</h3>
          <p className="text-slate-600 text-sm max-w-sm">
            {isMock
              ? "That's the end of the mock walkthrough. In a real session this would be submitted to the client's record and visible from the admin dashboard."
              : 'Attendance and session notes have been saved. Admins can review this from the admin dashboard.'}
          </p>
          {!isMock && cancellationFee !== null && cancellationFee > 0 && (
            <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-900 max-w-sm">
              A ${cancellationFee} cancellation fee has been queued for billing. Admins will see it in the payments queue — no further action from you.
            </div>
          )}
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
          >
            Close
          </button>
        </div>
      </Shell>
    )
  }

  return (
    <Shell
      onClose={onClose}
      title={step === 1 ? 'Record attendance' : 'Session note (SOAP)'}
      subtitle={clientName ? `${isMock ? 'Mock walkthrough · ' : ''}Client: ${clientName}` : undefined}
      step={step}
    >
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            How did this session go? Please record attendance before adding your session note.
          </p>
          <div className="space-y-2">
            {ATTENDANCE_OPTIONS.map(opt => {
              const Icon = opt.icon
              const selected = attendance === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => setAttendance(opt.value)}
                  className={`w-full text-left rounded-lg border p-3 flex items-start gap-3 transition-all ${
                    selected
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 text-sm">{opt.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                  </div>
                </button>
              )
            })}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">
              Notes {attendance === 'attended' ? '(optional)' : '(explain what happened)'}
            </label>
            <textarea
              value={attendanceNotes}
              onChange={e => setAttendanceNotes(e.target.value)}
              rows={3}
              placeholder={attendance === 'no-show' ? 'e.g., Client did not join. No message received. Followed up by email at 2:15pm.' : 'Optional context...'}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg p-2 border border-red-200">{error}</div>}

          <div className="flex items-center justify-between pt-2">
            <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
              Save for later
            </button>
            <button
              onClick={handleContinue}
              disabled={!attendance || isSaving}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm font-medium"
            >
              {isSaving ? 'Saving...' : needsSoap ? 'Continue to notes' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Document the session. Fields follow the SOAP framework.
            </p>
            <button
              onClick={generateAIDraft}
              disabled={isSaving}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isMock ? 'Fill demo note' : 'AI draft'}
            </button>
          </div>

          <SoapField label="S — Subjective" hint="Client / caregiver report, mood, concerns" value={subjective} onChange={setSubjective} />
          <SoapField label="O — Objective" hint="Observations, data collected, trial counts" value={objective} onChange={setObjective} />
          <SoapField label="A — Assessment" hint="Clinical interpretation, progress toward goals" value={assessment} onChange={setAssessment} />
          <SoapField label="P — Plan" hint="Next steps, home practice, upcoming session focus" value={plan} onChange={setPlan} />

          {error && <div className="text-sm text-red-600 bg-red-50 rounded-lg p-2 border border-red-200">{error}</div>}

          <div className="flex items-center justify-between pt-2 gap-2 flex-wrap">
            <button onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-slate-700">
              ← Back
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSubmitSoap()}
                disabled={isSaving || (!subjective && !objective && !assessment && !plan)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-600 text-emerald-700 hover:bg-emerald-50 disabled:border-slate-300 disabled:text-slate-400 text-sm font-medium"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving…' : 'Save as draft'}
              </button>
              <button
                onClick={() => handleSubmitSoap({ finalize: true })}
                disabled={isSaving || (!subjective && !objective && !assessment && !plan)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm font-medium"
                title="Save, lock, and complete the session. The note can only be amended with an addendum after this."
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving…' : 'Save & finalize'}
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 pt-1">
            Finalizing locks the note for compliance. Edits after finalization must be submitted as a dated addendum.
          </p>
        </div>
      )}
    </Shell>
  )
}

function Shell({
  onClose,
  title,
  subtitle,
  step,
  children,
}: {
  onClose: () => void
  title: string
  subtitle?: string
  step?: number
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-5 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            {step !== undefined && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`h-1 w-8 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                <span className={`h-1 w-8 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                <span className="text-[10px] text-slate-400 ml-1">Step {step} of 2</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

function SoapField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-semibold text-slate-800">{label}</label>
        <span className="text-[10px] text-slate-400">{hint}</span>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
      />
    </div>
  )
}
