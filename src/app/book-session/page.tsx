'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import { Calendar, Clock, DollarSign, ArrowLeft, CheckCircle, User } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { subscriptionAPI, sessionAPI, therapistAPI, clientAPI, evaluationAPI, stripeAPI } from '@/lib/api'
import CalendarSync from '@/components/CalendarSync'

function BookSessionContent() {
  const [therapist, setTherapist] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [sessionType, setSessionType] = useState('initial')
  const [duration, setDuration] = useState(45)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [remainingSessions, setRemainingSessions] = useState<any>(null)
  const [evaluationBlocked, setEvaluationBlocked] = useState(false)
  const [evaluationStatus, setEvaluationStatus] = useState<string | null>(null)

  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const therapistId = searchParams.get('therapistId')

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (user?.role !== 'client') {
      router.push('/dashboard')
      return
    }

    fetchData()
  }, [isAuthenticated, user, therapistId])

  useEffect(() => {
    // Check for payment success from Stripe redirect
    const paymentSuccess = searchParams.get('payment_success')
    const sessionId = searchParams.get('session_id')

    if (paymentSuccess === 'true' && sessionId) {
      verifyPaymentAndCreateSession(sessionId)
    }
  }, [searchParams])

  const verifyPaymentAndCreateSession = async (sessionId: string) => {
    try {
      setIsBooking(true)
      const response = await stripeAPI.verifySessionPayment(sessionId)

      if (response.data.success) {
        setSuccess(true)
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/client-dashboard')
        }, 3000)
      }
    } catch (error) {
      console.error('Payment verification failed:', error)
      setError('Payment verification failed. Please contact support.')
    } finally {
      setIsBooking(false)
    }
  }

  const fetchData = async () => {
    try {
      setIsLoading(true)

      // Check evaluation status — must be completed/recommendations_sent to book
      try {
        const evalRes = await evaluationAPI.getMyEvaluation()
        const evalData = evalRes.data.data
        if (evalData) {
          setEvaluationStatus(evalData.status)
          const allowedStatuses = ['completed', 'recommendations_sent']
          if (!allowedStatuses.includes(evalData.status)) {
            setEvaluationBlocked(true)
          }
        } else {
          // No evaluation at all — block booking
          setEvaluationBlocked(true)
          setEvaluationStatus('none')
        }
      } catch (err) {
        // If evaluation API fails, assume no evaluation
        setEvaluationBlocked(true)
        setEvaluationStatus('none')
      }

      // Get therapist info
      if (therapistId) {
        const therapistRes = await therapistAPI.getById(therapistId)
        const therapistData = therapistRes.data.data.therapist || therapistRes.data.data
        if (!therapistData) {
          setError('Therapist not found')
          return
        }
        setTherapist(therapistData)
      } else {
        setError('Therapist ID is required')
        return
      }

      // Get current subscription
      try {
        const subRes = await subscriptionAPI.getCurrent()
        setSubscription(subRes.data.data)
      } catch (error) {
        // No subscription - redirect to pricing
        router.push('/pricing')
        return
      }

    } catch (error) {
      console.error('Failed to fetch data:', error)
      setError('Failed to load booking information')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookSession = async () => {
    setError('')
    setIsBooking(true)

    // Validation
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time')
      setIsBooking(false)
      return
    }

    if (!therapistId) {
      setError('Therapist not selected')
      setIsBooking(false)
      return
    }

    try {
      // Get client profile to get the actual clientId
      const clientProfileRes = await clientAPI.getMyProfile()
      const clientId = clientProfileRes.data.data._id

      if (!clientId) {
        setError('Client profile not found. Please complete your profile first.')
        setIsBooking(false)
        return
      }

      // Get therapist's actual _id from database (not just URL param)
      // If therapist not loaded, fetch it
      let therapistIdToUse = therapist?._id
      if (!therapistIdToUse && therapistId) {
        try {
          const therapistRes = await therapistAPI.getById(therapistId)
          const therapistData = therapistRes.data.data.therapist || therapistRes.data.data
          therapistIdToUse = therapistData?._id
          if (!therapistIdToUse) {
            setError('Therapist not found. Please try again.')
            setIsBooking(false)
            return
          }
        } catch (error) {
          setError('Failed to load therapist information. Please try again.')
          setIsBooking(false)
          return
        }
      }

      if (!therapistIdToUse) {
        setError('Therapist information not available. Please try again.')
        setIsBooking(false)
        return
      }

      // Calculate session price
      // Rate caps: SLP = $75, SLPA = $55
      let sessionPrice = 0

      if (sessionType === 'initial') {
        // Checking subscription plan for Initial Evaluation pricing
        // Rooted/Flourish: Included (Free)
        // Bloom/None: $195
        if (subscription && (subscription.tier === 'rooted' || subscription.tier === 'flourish')) {
          sessionPrice = 0;
        } else {
          sessionPrice = 195; // Standard Evaluation Price
        }
      } else {
        // Regular Session Logic
        // Get therapist data if not already loaded
        let therapistData = therapist
        if (!therapistData && therapistId) {
          try {
            const therapistRes = await therapistAPI.getById(therapistId)
            therapistData = therapistRes.data.data.therapist || therapistRes.data.data
          } catch (error) {
            console.error('Failed to fetch therapist for price calculation:', error)
          }
        }

        // Determine max rate based on therapist credentials
        const maxRate = therapistData?.credentials === 'SLPA' ? 55 : 75

        if (therapistData) {
          // Use therapist's hourly rate if available, but ALWAYS cap it
          if (therapistData.hourlyRate && therapistData.hourlyRate > 0) {
            sessionPrice = Math.min(therapistData.hourlyRate, maxRate) // Cap at max rate
          } else {
            // Fallback: use subscription price or default, but cap it at therapist's max rate
            // For Bloom ($125 pay-as-you-go), we should check the plan price
            const subscriptionPrice = subscription?.price || 125 // Default to Pay-as-you-go rate
            sessionPrice = Math.min(subscriptionPrice, maxRate)
          }
        } else {
          // No therapist data: use subscription price capped at SLP rate
          const subscriptionPrice = subscription?.price || 125
          sessionPrice = Math.min(subscriptionPrice, 75) // Default to SLP cap
        }

        // Final safety check - ensure price never exceeds cap
        sessionPrice = Math.min(sessionPrice, maxRate)
      }

      // Check if payment is required (Bloom tier or passed session limit)
      if (sessionPrice > 0) {
        // Redirect to Stripe Checkout for payment
        try {
          console.log('Initiating payment for session:', { sessionPrice, therapistId: therapistIdToUse })

          const checkoutRes = await stripeAPI.createSessionPaymentCheckout({
            therapistId: therapistIdToUse,
            date: selectedDate,
            time: selectedTime,
            duration: duration,
            sessionType: sessionType,
            amount: sessionPrice
          })

          if (checkoutRes.data.success) {
            // Redirect to Stripe
            window.location.href = checkoutRes.data.data.url
            return // Stop execution here
          }
        } catch (paymentError: any) {
          console.error('Payment initiation failed:', paymentError)
          setError(paymentError.response?.data?.message || 'Failed to initiate payment')
          setIsBooking(false)
          return
        }
      }

      // Create session in database (Direct creation for $0 sessions)
      const sessionData = {
        therapistId: therapistIdToUse, // Use therapist's _id from database
        clientId: clientId,
        scheduledDate: selectedDate,
        scheduledTime: selectedTime,
        duration: duration,
        sessionType: sessionType,
        price: sessionPrice
      }

      console.log('Creating session with data:', sessionData)
      console.log('Therapist ID:', therapistIdToUse)
      console.log('Client ID:', clientId)
      const response = await sessionAPI.create(sessionData)

      // Get remaining sessions from response
      const remainingSessionsData = response.data.remainingSessions
      setRemainingSessions(remainingSessionsData)

      // Show success message with remaining sessions
      setSuccess(true)

      // Redirect to dashboard after 3 seconds (give time to see remaining sessions)
      setTimeout(() => {
        router.push('/client-dashboard')
      }, 3000)

    } catch (error: any) {
      console.error('Booking error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)

      // Handle specific "Requires Evaluation" error
      if (error.response?.status === 403 && error.response?.data?.requiresEvaluation) {
        setError('You must complete an Initial Evaluation before booking regular sessions. Please select "Initial Consultation" above to book your evaluation.')
        // Optionally force switch to 'initial' type?
        // setSessionType('initial')
        return;
      }

      // Get detailed error message
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to book session. Please try again.'

      setError(errorMessage)
      alert(`Booking failed: ${errorMessage}`)
    } finally {
      // Only set isBooking false if we didn't redirect (if verified, it handles its own loading state)
      // But actually, we returned early for redirect.
      // Checking checking... verifyPaymentAndCreateSession sets isBooking(true) then false.
      // Here, if we redirect, we returned.
      // If we didn't redirect, we fall through here.
      if (typeof window !== 'undefined' && !window.location.href.includes('checkout.stripe.com')) {
        setIsBooking(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking information...</p>
        </div>
      </div>
    )
  }

  if (evaluationBlocked) {
    const getEvalMessage = () => {
      switch (evaluationStatus) {
        case 'none':
          return 'You need to book and complete a diagnostic evaluation before booking ongoing sessions.'
        case 'pending_payment':
          return 'Please complete the $195 evaluation payment to proceed with your diagnostic evaluation.'
        case 'paid':
          return 'Your evaluation payment is confirmed. Please select a therapist and schedule your evaluation meeting.'
        case 'therapist_assigned':
        case 'therapist_reviewing':
          return 'Your therapist is currently reviewing your intake information. You\'ll be able to schedule your evaluation meeting soon.'
        case 'ready_for_meeting':
        case 'meeting_scheduled':
          return 'Your evaluation meeting is scheduled. Please complete your evaluation before booking regular sessions.'
        case 'in_progress':
          return 'Your evaluation is currently in progress. You\'ll be able to book sessions once the evaluation is complete.'
        default:
          return 'Please complete your diagnostic evaluation before booking regular sessions.'
      }
    }

    const getEvalCTA = () => {
      if (evaluationStatus === 'none') return { href: '/evaluation-booking', label: 'Book Evaluation' }
      return { href: '/client-evaluation', label: 'View Evaluation Status' }
    }

    const cta = getEvalCTA()

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Evaluation Required</h2>
          <p className="text-gray-600 mb-6">{getEvalMessage()}</p>
          <div className="space-y-3">
            <Link
              href={cta.href}
              className="block w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              {cta.label}
            </Link>
            <Link
              href="/client-dashboard"
              className="block w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  const therapistName = therapist?.userId ? `${therapist.userId.firstName} ${therapist.userId.lastName}` : 'Unknown'

  // Generate next 7 days for date selection
  const getNextDays = (count: number) => {
    const days = []
    for (let i = 1; i <= count; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      days.push(date.toISOString().split('T')[0])
    }
    return days
  }

  const availableTimes = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-black">Rooted Voices</Link>
            <Link href={`/therapist-profile/${therapistId}`} className="text-gray-600 hover:text-black">
              <ArrowLeft className="w-5 h-5 inline mr-2" />
              Back to Profile
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="text-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">Session Booked!</h2>
              <p className="text-green-600">Your session has been scheduled successfully.</p>
            </div>

            {/* Remaining Sessions Info */}
            {remainingSessions && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-3">Your Session Balance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Sessions:</span>
                    <span className="font-semibold text-gray-900">
                      {remainingSessions.hasUnlimited ? 'Unlimited' : remainingSessions.totalSessions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sessions Used:</span>
                    <span className="font-semibold text-gray-900">{remainingSessions.usedSessions}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-gray-900 font-semibold">Remaining Sessions:</span>
                    <span className={`font-bold text-lg ${remainingSessions.hasUnlimited
                      ? 'text-green-600'
                      : remainingSessions.remainingSessions > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                      }`}>
                      {remainingSessions.hasUnlimited
                        ? 'Unlimited'
                        : remainingSessions.remainingSessions}
                    </span>
                  </div>
                  {!remainingSessions.hasUnlimited && remainingSessions.remainingSessions === 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-red-600 text-center">
                        You've used all your sessions for this billing period.
                      </p>
                      <Link
                        href="/pricing"
                        className="block w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-semibold text-center text-sm shadow-md"
                      >
                        Renew Subscription
                      </Link>
                    </div>
                  )}
                  {!remainingSessions.hasUnlimited && remainingSessions.remainingSessions > 0 && (
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      You can book {remainingSessions.remainingSessions} more session{remainingSessions.remainingSessions !== 1 ? 's' : ''} this billing period.
                    </p>
                  )}
                </div>
              </div>
            )}

            <p className="text-sm text-green-500 mt-4 text-center">Redirecting to your dashboard...</p>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl premium-shadow p-8"
        >
          <h1 className="text-3xl font-bold text-black mb-2">Book a Session</h1>
          <p className="text-gray-600 mb-8">Schedule your therapy session with Dr. {therapistName}</p>

          {/* Therapist Info */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-black text-lg">Dr. {therapistName}</h3>
                <p className="text-gray-600">Speech-Language Pathologist</p>
                <p className="text-sm text-gray-500 mt-1">
                  {therapist?.specializations?.join(', ') || 'General Practice'}
                </p>
              </div>
              <div className="text-right">
                {subscription && (
                  <>
                    <p className="text-sm text-gray-600">Your Plan</p>
                    <p className="font-bold text-black">{subscription.tierName}</p>
                    <p className="text-sm text-gray-500">${subscription.price}/session</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Session Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Session Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSessionType('initial')}
                className={`p-4 rounded-lg border-2 transition-all ${sessionType === 'initial'
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <p className="font-semibold">Initial Consultation</p>
                <p className="text-sm opacity-80">
                  {subscription && (subscription.tier === 'rooted' || subscription.tier === 'flourish')
                    ? 'Included in Plan'
                    : 'Pre-paid Evaluation'}
                </p>
              </button>
              <button
                onClick={() => setSessionType('follow-up')}
                className={`p-4 rounded-lg border-2 transition-all ${sessionType === 'follow-up'
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <p className="font-semibold">Regular Session</p>
                <p className="text-sm opacity-80">Follow-up therapy session</p>
              </button>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Session Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>

          {/* Date Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Date
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Choose a date...</option>
              {getNextDays(14).map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </option>
              ))}
            </select>
          </div>

          {/* Time Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Time
            </label>
            <div className="grid grid-cols-3 gap-3">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 rounded-lg border-2 transition-all ${selectedTime === time
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-gray-400'
                    }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          {selectedDate && selectedTime && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-6 bg-purple-50 border border-purple-200 rounded-lg"
            >
              <h3 className="font-semibold text-black mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Therapist:</span>
                  <span className="font-medium text-black">Dr. {therapistName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-black">
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium text-black">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-black">{duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-black capitalize">{sessionType}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-purple-200">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold text-black text-lg">
                    {sessionType === 'initial'
                      ? (subscription && (subscription.tier === 'rooted' || subscription.tier === 'flourish')
                        ? 'Included (Free)'
                        : '$195'
                      )
                      : `$${Math.min(therapist?.hourlyRate || subscription?.price || 125, therapist?.credentials === 'SLPA' ? 55 : 75)}`
                    }
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Book Button */}
          <button
            onClick={handleBookSession}
            disabled={!selectedDate || !selectedTime || isBooking}
            className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
          >
            {isBooking ? 'Booking...' : 'Confirm Booking'}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            You'll receive a confirmation email with session details and video call link.
          </p>
        </motion.div>

        {/* Need a Plan? */}
        {!subscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center"
          >
            <h3 className="font-semibold text-yellow-800 mb-2">No Active Plan</h3>
            <p className="text-yellow-700 mb-4">
              You need to select a pricing plan before booking a session.
            </p>
            <Link
              href="/pricing"
              className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
            >
              Choose a Plan
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function BookSessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookSessionContent />
    </Suspense>
  )
}

