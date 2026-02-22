'use client'

import { motion } from 'framer-motion'
import {
    Clock,
    Video,
    CheckCircle,
    AlertCircle,
    Calendar,
    User,
    FileText,
    DollarSign,
    ArrowRight,
    Star,
    BookOpen,
    Loader2,
    Stethoscope,
    Timer,
    ExternalLink,
    Gift,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { evaluationAPI } from '@/lib/api'

const STEPS = [
    { key: 'paid', label: 'Payment Complete', icon: DollarSign },
    { key: 'therapist_assigned', label: 'Therapist Assigned', icon: User },
    { key: 'therapist_reviewing', label: 'Under Review', icon: FileText },
    { key: 'ready_for_meeting', label: 'Ready for Meeting', icon: CheckCircle },
    { key: 'in_progress', label: 'Meeting', icon: Video },
    { key: 'recommendations_sent', label: 'Recommendations', icon: Star },
]

const STATUS_ORDER = [
    'pending_payment', 'pending_creation', 'intake_submitted', 'paid',
    'awaiting_therapist_selection', 'therapist_assigned', 'therapist_reviewing',
    'ready_for_meeting', 'meeting_scheduled', 'in_progress',
    'completed', 'recommendations_sent'
]

export default function ClientEvaluationPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [evaluation, setEvaluation] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [meetingLoading, setMeetingLoading] = useState(false)

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'client') {
            router.push('/login')
            return
        }
        fetchEvaluation()
    }, [isAuthenticated, user, authLoading])

    const fetchEvaluation = async () => {
        try {
            setIsLoading(true)
            const res = await evaluationAPI.getMyEvaluation()
            setEvaluation(res.data.data)
        } catch (error) {
            console.error('Failed to fetch evaluation:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStartMeeting = async () => {
        if (!evaluation?._id) return
        setMeetingLoading(true)
        try {
            const res = await evaluationAPI.startMeeting(evaluation._id)
            const data = res.data.data
            if (data.meetingLink) {
                router.push(data.meetingLink)
            } else if (data.jitsiRoomName) {
                router.push(`/video-call?evaluationId=${evaluation._id}`)
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to start meeting')
        } finally {
            setMeetingLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading evaluation...</p>
                </div>
            </div>
        )
    }

    if (!evaluation) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl p-12 text-center max-w-md mx-4 premium-shadow"
                >
                    <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-black mb-2">No Evaluation Found</h2>
                    <p className="text-gray-600 mb-6">You haven&apos;t booked a diagnostic evaluation yet. Start by completing your intake form and booking.</p>
                    <Link href="/evaluation-booking" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                        Book Evaluation <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        )
    }

    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })

    const currentStepIndex = STATUS_ORDER.indexOf(evaluation.status)

    const getStepStatus = (stepKey: string) => {
        const stepIdx = STATUS_ORDER.indexOf(stepKey)
        if (stepIdx < 0) return 'pending'
        if (currentStepIndex >= stepIdx) return 'completed'
        if (currentStepIndex === stepIdx - 1) return 'current'
        return 'pending'
    }

    const getDaysRemaining = () => {
        if (!evaluation.therapistReviewDeadline) return null
        const diff = new Date(evaluation.therapistReviewDeadline).getTime() - Date.now()
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    }

    const daysRemaining = getDaysRemaining()
    const therapist = evaluation.therapistId
    const therapistUser = therapist?.userId

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="text-2xl font-bold text-black">Rooted Voices</Link>
                            <span className="text-gray-400">/</span>
                            <h1 className="text-xl font-bold text-black">My Evaluation</h1>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Progress Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl premium-shadow p-8 mb-8"
                >
                    <h2 className="text-xl font-bold text-black mb-6">Evaluation Progress</h2>
                    <div className="flex items-center justify-between relative">
                        {/* Progress line */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
                        <div
                            className="absolute top-5 left-0 h-0.5 bg-green-500 z-0 transition-all duration-500"
                            style={{
                                width: `${Math.min(100, ((STEPS.findIndex(s => getStepStatus(s.key) === 'completed' || getStepStatus(s.key) === 'current') + 1) / STEPS.length) * 100)}%`
                            }}
                        />

                        {STEPS.map((step, index) => {
                            const status = getStepStatus(step.key)
                            const Icon = step.icon
                            const isActive = status === 'completed' || status === 'current'

                            return (
                                <div key={step.key} className="relative z-10 flex flex-col items-center" style={{ flex: 1 }}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${status === 'completed' ? 'bg-green-500 text-white' :
                                            status === 'current' ? 'bg-blue-500 text-white ring-4 ring-blue-100' :
                                                'bg-gray-200 text-gray-400'
                                        }`}>
                                        {status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <span className={`text-xs mt-2 text-center font-medium ${isActive ? 'text-black' : 'text-gray-400'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-white rounded-2xl premium-shadow p-6"
                        >
                            <h3 className="text-lg font-bold text-black mb-4">Current Status</h3>

                            {/* Waiting for therapist review */}
                            {['therapist_assigned', 'therapist_reviewing'].includes(evaluation.status) && (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Timer className="w-5 h-5 text-blue-600" />
                                            <span className="font-semibold text-blue-900">
                                                {evaluation.status === 'therapist_assigned' ? 'Therapist Assigned - Awaiting Review' : 'Therapist Is Reviewing Your Details'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-blue-800">
                                            Your therapist is reviewing your intake information. This typically takes up to 3 business days.
                                        </p>
                                        {daysRemaining !== null && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <div className="w-full bg-blue-100 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${Math.max(10, 100 - (daysRemaining / 3) * 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-blue-700 whitespace-nowrap">{daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Ready for meeting */}
                            {['ready_for_meeting', 'meeting_scheduled'].includes(evaluation.status) && (
                                <div className="space-y-4">
                                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                        <div className="flex items-center gap-3 mb-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <span className="font-semibold text-green-900">Therapist Is Ready!</span>
                                        </div>
                                        <p className="text-sm text-green-800 mb-3">
                                            {therapistUser?.firstName} {therapistUser?.lastName} has reviewed your details and is ready for your evaluation meeting.
                                        </p>
                                        <button
                                            onClick={handleStartMeeting}
                                            disabled={meetingLoading}
                                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                        >
                                            {meetingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
                                            Join Evaluation Meeting
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Meeting in progress */}
                            {evaluation.status === 'in_progress' && (
                                <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Video className="w-5 h-5 text-indigo-600" />
                                        <span className="font-semibold text-indigo-900">Meeting In Progress</span>
                                    </div>
                                    <p className="text-sm text-indigo-800 mb-3">Your evaluation meeting is currently in progress.</p>
                                    {evaluation.meetingLink && (
                                        <Link
                                            href={evaluation.meetingLink}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                        >
                                            <Video className="w-5 h-5" /> Rejoin Meeting
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* Recommendations received */}
                            {['completed', 'recommendations_sent'].includes(evaluation.status) && (
                                <div className="space-y-4">
                                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Star className="w-5 h-5 text-emerald-600" />
                                            <span className="font-semibold text-emerald-900">Evaluation Complete - Recommendations Ready!</span>
                                        </div>
                                        <p className="text-sm text-emerald-800">
                                            Your evaluation is complete and your therapist has sent personalized recommendations.
                                        </p>
                                    </div>

                                    {/* Recommendations Card */}
                                    {evaluation.recommendations && (
                                        <div className="bg-white border-2 border-emerald-200 p-6 rounded-xl">
                                            <h4 className="font-bold text-black mb-3 flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-emerald-600" />
                                                Therapist Recommendations
                                            </h4>
                                            {evaluation.recommendations.subscriptionTier && (
                                                <div className="mb-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                                                    <span className="text-xs text-emerald-600 uppercase tracking-wide font-medium">Recommended Plan</span>
                                                    <p className="text-lg font-bold text-black capitalize mt-1">{evaluation.recommendations.subscriptionTier}</p>
                                                </div>
                                            )}
                                            {evaluation.recommendations.notes && (
                                                <div className="mb-4">
                                                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Therapist Notes</span>
                                                    <p className="text-gray-700 mt-1">{evaluation.recommendations.notes}</p>
                                                </div>
                                            )}

                                            {/* $195 Credit Banner */}
                                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                                                <div className="flex items-center gap-3">
                                                    <Gift className="w-6 h-6 text-yellow-600" />
                                                    <div>
                                                        <p className="font-semibold text-yellow-900">$195 Evaluation Credit Available!</p>
                                                        <p className="text-sm text-yellow-800">Your evaluation fee will be credited toward your subscription purchase.</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <Link
                                                href={`/pricing${evaluation.recommendations.subscriptionTier ? `?recommended=${evaluation.recommendations.subscriptionTier}` : ''}`}
                                                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                                            >
                                                View Subscription Plans <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    )}

                                    {/* Resource library access */}
                                    {evaluation.resourceLibraryAccessGranted && (
                                        <Link
                                            href="/resources"
                                            className="flex items-center gap-3 p-4 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <BookOpen className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-black">Resource Library Access Granted</p>
                                                <p className="text-sm text-gray-600">Access curated materials recommended by your therapist</p>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-blue-500 ml-auto" />
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* Pending payment */}
                            {['pending_payment', 'pending_creation'].includes(evaluation.status) && (
                                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <DollarSign className="w-5 h-5 text-yellow-600" />
                                        <span className="font-semibold text-yellow-900">Payment Required</span>
                                    </div>
                                    <p className="text-sm text-yellow-800 mb-3">Complete your payment to proceed with therapist selection.</p>
                                    <Link
                                        href="/evaluation-booking"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                                    >
                                        Continue Booking <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}

                            {/* Awaiting therapist selection */}
                            {evaluation.status === 'paid' && (
                                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <User className="w-5 h-5 text-purple-600" />
                                        <span className="font-semibold text-purple-900">Select Your Therapist</span>
                                    </div>
                                    <p className="text-sm text-purple-800 mb-3">Payment complete! Now select a therapist and schedule your evaluation.</p>
                                    <Link
                                        href="/evaluation-booking"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                    >
                                        Select Therapist <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}

                            {/* Cancelled */}
                            {evaluation.status === 'cancelled' && (
                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                    <div className="flex items-center gap-3 mb-2">
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                        <span className="font-semibold text-red-900">Evaluation Cancelled</span>
                                    </div>
                                    <p className="text-sm text-red-800">
                                        This evaluation was cancelled{evaluation.cancellationReason ? `: ${evaluation.cancellationReason}` : '.'}.
                                    </p>
                                    <Link
                                        href="/evaluation-booking"
                                        className="inline-flex items-center gap-2 px-4 py-2 mt-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                    >
                                        Book New Evaluation <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Evaluation Details */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white rounded-2xl premium-shadow p-6"
                        >
                            <h3 className="text-lg font-bold text-black mb-4">Evaluation Details</h3>
                            <div className="space-y-4">
                                {/* Therapist */}
                                {therapistUser && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {therapistUser.firstName?.[0]}{therapistUser.lastName?.[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-black">{therapistUser.firstName} {therapistUser.lastName}</p>
                                            <p className="text-sm text-gray-500">Your Therapist</p>
                                        </div>
                                    </div>
                                )}

                                {/* Schedule */}
                                {evaluation.scheduledDate && (
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-black">{formatDate(evaluation.scheduledDate)}</p>
                                            <p className="text-sm text-gray-500">{evaluation.scheduledTime || 'Time TBD'}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Duration */}
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-black">60 minutes</p>
                                        <p className="text-sm text-gray-500">Video Evaluation</p>
                                    </div>
                                </div>

                                {/* Payment */}
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-black">${evaluation.amountPaid || 195}</p>
                                        <p className="text-sm text-green-600">Credit available for subscription</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-white rounded-2xl premium-shadow p-6"
                        >
                            <h3 className="text-lg font-bold text-black mb-4">Quick Links</h3>
                            <div className="space-y-2">
                                <Link href="/pricing" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium text-black">View Subscription Plans</span>
                                </Link>
                                <Link href="/resources" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-black">Resource Library</span>
                                </Link>
                                <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <FileText className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-medium text-black">Dashboard</span>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
