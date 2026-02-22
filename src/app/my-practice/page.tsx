'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Star,
  BarChart3,
  Clock,
  Video,
  FileText,
  Award,
  Target,
  Activity,
  Phone,
  Mail,
  MapPin,
  Edit,
  Save,
  ClipboardCheck,
  Eye,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Send,
  Loader2,
  Stethoscope,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { therapistAPI, sessionAPI, clientAPI, evaluationAPI, subscriptionAPI } from '@/lib/api'
import CredentialsBadge from '@/components/CredentialsBadge'
import AvailabilityManager from '@/components/AvailabilityManager'

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  'therapist_assigned': { label: 'New - Review Required', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  'therapist_reviewing': { label: 'Under Review', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  'ready_for_meeting': { label: 'Ready for Meeting', color: 'text-green-700', bgColor: 'bg-green-100' },
  'meeting_scheduled': { label: 'Meeting Scheduled', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  'in_progress': { label: 'Meeting In Progress', color: 'text-indigo-700', bgColor: 'bg-indigo-100' },
  'completed': { label: 'Completed', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  'recommendations_sent': { label: 'Recommendations Sent', color: 'text-gray-700', bgColor: 'bg-gray-100' },
}

export default function MyPracticePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Real data from API
  const [therapistProfile, setTherapistProfile] = useState<any>(null)
  const [pricingTiers, setPricingTiers] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [evaluations, setEvaluations] = useState<any[]>([])
  const [expandedEval, setExpandedEval] = useState<string | null>(null)
  const [evalDetails, setEvalDetails] = useState<Record<string, any>>({})
  const [evalActionLoading, setEvalActionLoading] = useState<string | null>(null)
  const [completionForm, setCompletionForm] = useState<{ evalId: string; tier: string; notes: string; grantAccess: boolean } | null>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'therapist') {
      router.push('/login')
      return
    }

    fetchPracticeData()
  }, [isAuthenticated, user, authLoading])

  const fetchPracticeData = async () => {
    try {
      setIsLoading(true)

      const therapistRes = await therapistAPI.getMyProfile()
      setTherapistProfile(therapistRes.data.data)

      const sessionsRes = await sessionAPI.getAll()
      setSessions(sessionsRes.data.data.sessions || [])

      try {
        const clientsRes = await clientAPI.getAll()
        setClients(clientsRes.data.data || [])
      } catch (error) {
        console.log('Could not fetch clients')
      }

      try {
        const evalsRes = await evaluationAPI.getTherapistAssignments()
        setEvaluations(evalsRes.data.data || [])
      } catch (error) {
        console.log('Could not fetch evaluation assignments')
      }

      try {
        const pricingRes = await subscriptionAPI.getPricing()
        const backendPricing = pricingRes.data.data
        const transformedPricing = Object.entries(backendPricing).map(([id, data]: [string, any]) => ({
          id,
          name: data.name.replace(' Tier', '').replace(' tier', ''),
          price: data.price,
          sessionsPerMonth: data.sessionsPerMonth,
          billingCycle: data.billingCycle
        }))
        // Sort: Rooted, Flourish, Bloom, Evaluation
        const sortOrder = ['rooted', 'flourish', 'bloom', 'evaluation']
        transformedPricing.sort((a, b) => sortOrder.indexOf(a.id) - sortOrder.indexOf(b.id))
        setPricingTiers(transformedPricing)
      } catch (error) {
        console.log('Could not fetch pricing tiers')
      }

    } catch (error) {
      console.error('Failed to fetch practice data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadEvalDetails = useCallback(async (evalId: string) => {
    if (evalDetails[evalId]) return
    try {
      const res = await evaluationAPI.getDetails(evalId)
      setEvalDetails(prev => ({ ...prev, [evalId]: res.data.data }))
    } catch (error) {
      console.error('Failed to load evaluation details:', error)
    }
  }, [evalDetails])

  const toggleEvalExpand = (evalId: string) => {
    if (expandedEval === evalId) {
      setExpandedEval(null)
    } else {
      setExpandedEval(evalId)
      loadEvalDetails(evalId)
    }
  }

  const handleEvalAction = async (evalId: string, action: 'start-review' | 'therapist-ready' | 'start-meeting') => {
    setEvalActionLoading(evalId)
    try {
      if (action === 'start-review') {
        await evaluationAPI.startReview(evalId)
      } else if (action === 'therapist-ready') {
        await evaluationAPI.therapistReady(evalId)
      } else if (action === 'start-meeting') {
        await evaluationAPI.startMeeting(evalId)
        router.push(`/video-call?evaluationId=${evalId}`)
        return
      }
      const evalsRes = await evaluationAPI.getTherapistAssignments()
      setEvaluations(evalsRes.data.data || [])
    } catch (error: any) {
      alert(error.response?.data?.message || 'Action failed')
    } finally {
      setEvalActionLoading(null)
    }
  }

  const handleCompleteEvaluation = async () => {
    if (!completionForm) return
    setEvalActionLoading(completionForm.evalId)
    try {
      await evaluationAPI.complete(completionForm.evalId, {
        subscriptionTier: completionForm.tier,
        notes: completionForm.notes,
        grantResourceAccess: completionForm.grantAccess,
      })
      setCompletionForm(null)
      const evalsRes = await evaluationAPI.getTherapistAssignments()
      setEvaluations(evalsRes.data.data || [])
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to complete evaluation')
    } finally {
      setEvalActionLoading(null)
    }
  }

  if (isLoading || !therapistProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading practice data...</p>
        </div>
      </div>
    )
  }

  const completedSessions = sessions.filter(s => s.status === 'completed').length
  const upcomingSessions = sessions.filter(s => s.status === 'scheduled' || s.status === 'confirmed').length
  const therapistName = `${therapistProfile.userId?.firstName || ''} ${therapistProfile.userId?.lastName || ''}`.trim()

  const activeEvaluations = evaluations.filter(e =>
    !['recommendations_sent', 'cancelled'].includes(e.status)
  )

  console.log('Evaluations fetched:', evaluations.length);
  console.log('Active evaluations:', activeEvaluations.length);

  const metrics = [
    { title: 'Total Clients', value: clients.length.toString(), change: '+100%', icon: <Users className="w-6 h-6" />, color: 'bg-blue-500' },
    { title: 'Active Caseload', value: clients.length.toString(), change: '+100%', icon: <Activity className="w-6 h-6" />, color: 'bg-green-500' },
    { title: 'Total Sessions', value: sessions.length.toString(), change: '+100%', icon: <Calendar className="w-6 h-6" />, color: 'bg-purple-500' },
    { title: 'Avg Rating', value: (therapistProfile.rating || 0).toFixed(1), change: '+0.1', icon: <Star className="w-6 h-6" />, color: 'bg-orange-500' }
  ]

  const analytics = {
    sessionsThisWeek: upcomingSessions,
    sessionsThisMonth: sessions.length,
    avgSessionLength: '45 min',
    completionRate: sessions.length > 0 ? `${Math.round((completedSessions / sessions.length) * 100)}%` : '0%',
  }

  const today = new Date().toISOString().split('T')[0]
  const todaysSessions = sessions.filter(s => {
    const sessionDate = new Date(s.scheduledDate).toISOString().split('T')[0]
    return sessionDate === today && (s.status === 'scheduled' || s.status === 'confirmed')
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-2xl font-bold text-black">Rooted Voices</Link>
              <span className="text-gray-400">/</span>
              <h1 className="text-2xl font-bold text-black">My Practice</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                <span>{isEditing ? 'Save Changes' : 'Edit Practice'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Practice Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl premium-shadow p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">Dr. {therapistName}&apos;s Practice</h2>
              <div className="text-lg text-gray-600">
                <div className="flex items-center gap-2">
                  <span>Licensed Speech-Language Pathologist</span>
                  <CredentialsBadge credentials={therapistProfile.credentials || 'SLP'} canSupervise={therapistProfile.canSupervise || false} />
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{therapistProfile.licensedStates?.join(', ') || 'Not specified'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{therapistProfile.userId?.phone || 'Not set'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{therapistProfile.userId?.email}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-2xl font-bold">{(therapistProfile.rating || 0).toFixed(1)}</span>
              </div>
              <p className="text-sm text-gray-600">{therapistProfile.totalReviews || 0} reviews</p>
            </div>
          </div>

          {therapistProfile.specializations && therapistProfile.specializations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {therapistProfile.specializations.map((spec: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {spec}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl premium-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-black">{metric.value}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {metric.change}
                  </p>
                </div>
                <div className={`${metric.color} p-3 rounded-full text-white`}>
                  {metric.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ========== EVALUATION ASSIGNMENTS SECTION ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="bg-white rounded-2xl premium-shadow p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-black">Evaluation Assignments</h2>
                <p className="text-sm text-gray-500">{activeEvaluations.length} active evaluation{activeEvaluations.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {activeEvaluations.map((evaluation: any) => {
              const status = STATUS_CONFIG[evaluation.status] || { label: evaluation.status, color: 'text-gray-700', bgColor: 'bg-gray-100' }
              const isExpanded = expandedEval === evaluation._id
              const details = evalDetails[evaluation._id]
              const daysLeft = evaluation.therapistReviewDeadline ? getDaysUntilDeadline(evaluation.therapistReviewDeadline) : null

              return (
                <div key={evaluation._id} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Evaluation Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleEvalExpand(evaluation._id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {evaluation.clientId?.firstName?.[0]}{evaluation.clientId?.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">
                          {evaluation.clientId?.firstName} {evaluation.clientId?.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {evaluation.scheduledDate ? `Scheduled: ${formatDate(evaluation.scheduledDate)}` : 'Pending schedule'}
                          {evaluation.scheduledTime ? ` at ${evaluation.scheduledTime}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {daysLeft !== null && daysLeft <= 1 && ['therapist_assigned', 'therapist_reviewing'].includes(evaluation.status) && (
                        <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          {daysLeft <= 0 ? 'Deadline passed!' : '1 day left'}
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
                        {status.label}
                      </span>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200"
                      >
                        <div className="p-6 space-y-6">
                          {/* Intake Form Data */}
                          <div>
                            <h4 className="font-semibold text-black mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-600" />
                              Client Intake Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                              {evaluation.intakeFormData?.clientType && (
                                <div>
                                  <span className="text-xs text-gray-500 uppercase tracking-wide">Client Type</span>
                                  <p className="font-medium text-black capitalize">{evaluation.intakeFormData.clientType}</p>
                                </div>
                              )}
                              {evaluation.intakeFormData?.stateOfResidence && (
                                <div>
                                  <span className="text-xs text-gray-500 uppercase tracking-wide">State of Residence</span>
                                  <p className="font-medium text-black">{evaluation.intakeFormData.stateOfResidence}</p>
                                </div>
                              )}
                              {evaluation.intakeFormData?.dateOfBirth && (
                                <div>
                                  <span className="text-xs text-gray-500 uppercase tracking-wide">Date of Birth</span>
                                  <p className="font-medium text-black">{formatDate(evaluation.intakeFormData.dateOfBirth)}</p>
                                </div>
                              )}
                              {evaluation.intakeFormData?.guardianName && (
                                <div>
                                  <span className="text-xs text-gray-500 uppercase tracking-wide">Guardian</span>
                                  <p className="font-medium text-black">{evaluation.intakeFormData.guardianName} ({evaluation.intakeFormData.guardianRelation})</p>
                                </div>
                              )}
                              {evaluation.intakeFormData?.primaryConcerns && (
                                <div className="md:col-span-2">
                                  <span className="text-xs text-gray-500 uppercase tracking-wide">Primary Concerns</span>
                                  <p className="font-medium text-black">{evaluation.intakeFormData.primaryConcerns}</p>
                                </div>
                              )}
                              {evaluation.intakeFormData?.communicationConcerns && (
                                <div className="md:col-span-2">
                                  <span className="text-xs text-gray-500 uppercase tracking-wide">Communication Concerns</span>
                                  <p className="font-medium text-black">{evaluation.intakeFormData.communicationConcerns}</p>
                                </div>
                              )}
                              {evaluation.intakeFormData?.medicalHistory && (
                                <div className="md:col-span-2">
                                  <span className="text-xs text-gray-500 uppercase tracking-wide">Medical History</span>
                                  <p className="font-medium text-black">{evaluation.intakeFormData.medicalHistory}</p>
                                </div>
                              )}
                              {evaluation.intakeFormData?.currentDiagnoses?.length > 0 && (
                                <div className="md:col-span-2">
                                  <span className="text-xs text-gray-500 uppercase tracking-wide">Current Diagnoses</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {evaluation.intakeFormData.currentDiagnoses.map((d: string, i: number) => (
                                      <span key={i} className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">{d}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {evaluation.intakeFormData?.additionalNotes && (
                                <div className="md:col-span-2">
                                  <span className="text-xs text-gray-500 uppercase tracking-wide">Additional Notes</span>
                                  <p className="font-medium text-black">{evaluation.intakeFormData.additionalNotes}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Additional client details from API */}
                          {details?.clientInfo && (
                            <div>
                              <h4 className="font-semibold text-black mb-3 flex items-center gap-2">
                                <User className="w-4 h-4 text-green-600" />
                                Full Client Profile
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg">
                                <div>
                                  <span className="text-xs text-gray-500 uppercase tracking-wide">Email</span>
                                  <p className="font-medium text-black">{details.clientInfo.email}</p>
                                </div>
                                {details.clientInfo.emergencyContact?.name && (
                                  <div>
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">Emergency Contact</span>
                                    <p className="font-medium text-black">
                                      {details.clientInfo.emergencyContact.name} ({details.clientInfo.emergencyContact.relation}) - {details.clientInfo.emergencyContact.phone}
                                    </p>
                                  </div>
                                )}
                                {details.clientInfo.spokenLanguages?.length > 0 && (
                                  <div>
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">Languages</span>
                                    <p className="font-medium text-black">{details.clientInfo.spokenLanguages.join(', ')}</p>
                                  </div>
                                )}
                                {details.clientInfo.documents?.length > 0 && (
                                  <div>
                                    <span className="text-xs text-gray-500 uppercase tracking-wide">Documents</span>
                                    <p className="font-medium text-black">{details.clientInfo.documents.length} document(s) on file</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Review deadline info */}
                          {evaluation.therapistReviewDeadline && ['therapist_assigned', 'therapist_reviewing'].includes(evaluation.status) && (
                            <div className={`flex items-center gap-3 p-3 rounded-lg ${daysLeft !== null && daysLeft <= 1 ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                              <Clock className="w-5 h-5 text-yellow-600" />
                              <div>
                                <p className="text-sm font-medium text-black">
                                  Review Deadline: {formatDate(evaluation.therapistReviewDeadline)}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {daysLeft !== null && daysLeft > 0
                                    ? `${daysLeft} day${daysLeft !== 1 ? 's' : ''} remaining to review client details`
                                    : 'Deadline has passed - please review as soon as possible'}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
                            {evaluation.status === 'therapist_assigned' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEvalAction(evaluation._id, 'start-review') }}
                                disabled={evalActionLoading === evaluation._id}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                              >
                                {evalActionLoading === evaluation._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                                Start Reviewing
                              </button>
                            )}

                            {evaluation.status === 'therapist_reviewing' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEvalAction(evaluation._id, 'therapist-ready') }}
                                disabled={evalActionLoading === evaluation._id}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                {evalActionLoading === evaluation._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                Mark as Ready
                              </button>
                            )}

                            {['ready_for_meeting', 'meeting_scheduled'].includes(evaluation.status) && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEvalAction(evaluation._id, 'start-meeting') }}
                                disabled={evalActionLoading === evaluation._id}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                              >
                                {evalActionLoading === evaluation._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                                Join Meeting
                              </button>
                            )}

                            {['in_progress', 'completed'].includes(evaluation.status) && evaluation.status !== 'recommendations_sent' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setCompletionForm({
                                    evalId: evaluation._id,
                                    tier: '',
                                    notes: '',
                                    grantAccess: true,
                                  })
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                              >
                                <Send className="w-4 h-4" />
                                Complete & Send Recommendations
                              </button>
                            )}

                            {evaluation.meetingLink && ['ready_for_meeting', 'meeting_scheduled', 'in_progress'].includes(evaluation.status) && (
                              <Link
                                href={evaluation.meetingLink}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <BookOpen className="w-4 h-4" />
                                Resource Library
                              </Link>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}

            {activeEvaluations.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-gray-900 font-medium">No Active Assignments</h3>
                <p className="text-gray-500 text-sm mt-1">You currently have no pending evaluations to process.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Completion Form Modal */}
        <AnimatePresence>
          {completionForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setCompletionForm(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                  Complete Evaluation & Send Recommendations
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recommended Subscription Tier</label>
                    <select
                      value={completionForm.tier}
                      onChange={e => setCompletionForm({ ...completionForm, tier: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Select a tier...</option>
                      {pricingTiers.map((tier) => (
                        <option key={tier.id} value={tier.id}>
                          {tier.name} - ${tier.price}{tier.billingCycle === 'monthly' || tier.billingCycle === 'every-4-weeks' ? '/month' : '/session'} {tier.sessionsPerMonth > 0 && `(${tier.sessionsPerMonth} sessions)`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Therapist Notes & Recommendations</label>
                    <textarea
                      value={completionForm.notes}
                      onChange={e => setCompletionForm({ ...completionForm, notes: e.target.value })}
                      rows={4}
                      placeholder="Enter your evaluation notes, recommendations, and plan of care..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="grantAccess"
                      checked={completionForm.grantAccess}
                      onChange={e => setCompletionForm({ ...completionForm, grantAccess: e.target.checked })}
                      className="w-5 h-5 text-emerald-600 rounded"
                    />
                    <label htmlFor="grantAccess" className="text-sm text-gray-700">
                      Grant Resource Library Access
                    </label>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> The client&apos;s $195 evaluation fee will be credited toward their subscription purchase. Recommendations will be emailed to the client and saved to their profile.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleCompleteEvaluation}
                      disabled={evalActionLoading === completionForm.evalId}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 font-medium"
                    >
                      {evalActionLoading === completionForm.evalId ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      Send Recommendations
                    </button>
                    <button
                      onClick={() => setCompletionForm(null)}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Session Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h2 className="text-xl font-bold text-black mb-6">Session Analytics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">This Week</p>
                  <p className="text-2xl font-bold text-black">{analytics.sessionsThisWeek}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">This Month</p>
                  <p className="text-2xl font-bold text-black">{analytics.sessionsThisMonth}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Length</p>
                  <p className="text-2xl font-bold text-black">{analytics.avgSessionLength}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.completionRate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hourly Rate</p>
                  <p className="text-2xl font-bold text-purple-600">${therapistProfile.hourlyRate || 85}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{completedSessions}</p>
                </div>
              </div>
            </motion.div>

            {/* Availability Manager */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <AvailabilityManager
                therapistId={therapistProfile._id}
                initialAvailability={therapistProfile.availability}
                onUpdate={fetchPracticeData}
              />
            </motion.div>

            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">Today&apos;s Schedule</h2>
                <Link href="/sessions" className="text-black hover:text-gray-600 transition-colors">
                  View all
                </Link>
              </div>

              {todaysSessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No sessions scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaysSessions.map((session: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-black">{session.scheduledTime}</div>
                          <div className="text-xs text-gray-500">{session.duration} min</div>
                        </div>
                        <div className="w-px h-8 bg-gray-300"></div>
                        <div>
                          <h4 className="font-semibold text-black">
                            {session.clientId?.userId?.firstName} {session.clientId?.userId?.lastName}
                          </h4>
                          <p className="text-sm text-gray-600 capitalize">{session.sessionType}</p>
                        </div>
                      </div>
                      <Link href={`/video-call?session=${session._id}`} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <Video className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Clients List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">My Clients</h2>
                <span className="text-sm text-gray-600">{clients.length} total</span>
              </div>

              {clients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No clients yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {clients.slice(0, 5).map((client: any) => (
                    <div key={client._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {client.userId?.firstName?.[0]}{client.userId?.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-black">
                            {client.userId?.firstName} {client.userId?.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">{client.userId?.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {clients.length > 5 && (
                    <Link href="/sessions" className="block text-center text-blue-600 hover:underline text-sm mt-4">
                      View all {clients.length} clients
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h3 className="text-lg font-bold text-black mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/sessions" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Manage Schedule</span>
                </Link>

                <Link href="/resources" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Resource Library</span>
                </Link>

                <Link href="/dashboard" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Dashboard</span>
                </Link>

                <Link href="/profile" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Edit Profile</span>
                </Link>
              </div>
            </motion.div>

            {/* Performance Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h3 className="text-lg font-bold text-black mb-4">Performance Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Client Satisfaction</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-black">{(therapistProfile.rating || 0).toFixed(1)}/5.0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Reviews</span>
                  <span className="font-semibold text-black">{therapistProfile.totalReviews || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Years Experience</span>
                  <span className="font-semibold text-black">{therapistProfile.yearsOfExperience || 0} years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Clients</span>
                  <span className="font-semibold text-green-600">{clients.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Evaluations</span>
                  <span className="font-semibold text-orange-600">{activeEvaluations.length}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
