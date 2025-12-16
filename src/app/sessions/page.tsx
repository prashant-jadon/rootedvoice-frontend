'use client'

import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Video, 
  Plus, 
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  CreditCard,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { sessionAPI, clientAPI, therapistAPI, stripeAPI, calendarAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import PaymentModal from '@/components/PaymentModal'

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [calendarEvents, setCalendarEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean
    amount: number
    clientSecret?: string
    paymentIntentId?: string
    sessionId?: string
    title?: string
    description?: string
  }>({ isOpen: false, amount: 0 })
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  // Create session form state
  const [newSession, setNewSession] = useState({
    clientId: '',
    scheduledDate: '',
    scheduledTime: '10:00 AM',
      duration: 45,
    sessionType: 'follow-up',
    price: 85
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    fetchSessions()
    fetchCalendarEvents()
    if (user?.role === 'therapist') {
      fetchClients()
    }
  }, [isAuthenticated, user])

  const fetchSessions = async () => {
    try {
      setIsLoading(true)
      const response = await sessionAPI.getAll()
      setSessions(response.data.data.sessions || [])
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const response = await clientAPI.getAll()
      setClients(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    }
  }

  const fetchCalendarEvents = async () => {
    try {
      const today = new Date()
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1)
      const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0)
      
      const response = await calendarAPI.getEvents({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
      setCalendarEvents(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch calendar events:', error)
    }
  }

  const handleCreateSession = async () => {
    if (!newSession.clientId || !newSession.scheduledDate || !newSession.scheduledTime) {
      alert('Please fill all fields')
      return
    }

    try {
      // Get therapist ID
      const therapistsRes = await therapistAPI.getAll()
      const therapists = therapistsRes.data.data.therapists || []
      const currentTherapist = therapists.find((t: any) => t.userId._id === user?.id)

      if (!currentTherapist) {
        alert('Therapist profile not found')
        return
      }

      await sessionAPI.create({
        therapistId: currentTherapist._id,
        clientId: newSession.clientId,
        scheduledDate: newSession.scheduledDate,
        scheduledTime: newSession.scheduledTime,
        duration: newSession.duration,
        sessionType: newSession.sessionType,
        price: newSession.price
      })

      alert('Session created successfully!')
      setShowCreateModal(false)
      fetchSessions()
      
      // Reset form
      setNewSession({
        clientId: '',
        scheduledDate: '',
        scheduledTime: '10:00 AM',
      duration: 45,
        sessionType: 'follow-up',
        price: 85
      })
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create session')
    }
  }

  const handleCompleteSession = async (sessionId: string) => {
    try {
      await sessionAPI.complete(sessionId, 'Session completed')
      alert('Session completed! Payment processing required.')
      fetchSessions()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to complete session')
    }
  }

  const handleProcessPayment = async (sessionId: string, isCancellation = false) => {
    try {
      let response
      if (isCancellation) {
        response = await stripeAPI.createCancellationPayment(sessionId)
      } else {
        response = await stripeAPI.processSessionPayment(sessionId)
      }

      if (response.data.success) {
        setPaymentModal({
          isOpen: true,
          amount: response.data.data.amount,
          clientSecret: response.data.data.clientSecret,
          paymentIntentId: response.data.data.paymentIntentId,
          sessionId: sessionId,
          title: isCancellation ? 'Pay Cancellation Fee' : 'Pay for Session',
          description: isCancellation 
            ? 'This is the cancellation fee for the cancelled session.'
            : 'Complete payment for your therapy session.',
        })
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to process payment')
    }
  }

  const handlePaymentSuccess = () => {
    setPaymentModal({ isOpen: false, amount: 0 })
    fetchSessions()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'scheduled':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getClientName = (session: any) => {
    if (user?.role === 'therapist') {
      return session.clientId?.userId ? 
        `${session.clientId.userId.firstName} ${session.clientId.userId.lastName}` : 
        'Unknown Client'
    } else {
      return session.therapistId?.userId ? 
        `Dr. ${session.therapistId.userId.firstName} ${session.therapistId.userId.lastName}` : 
        'Unknown Therapist'
    }
  }

  const filteredSessions = sessions.filter((session: any) => {
    if (filterStatus === 'all') return true
    return session.status === filterStatus
  })

  const upcomingSessions = filteredSessions.filter((s: any) => 
    ['scheduled', 'confirmed'].includes(s.status) && new Date(s.scheduledDate) >= new Date()
  )
  
  const pastSessions = filteredSessions.filter((s: any) => 
    s.status === 'completed' || new Date(s.scheduledDate) < new Date()
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sessions...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">
                {user?.role === 'therapist' ? 'Session Management' : 'My Sessions'}
              </h1>
              <p className="text-gray-600">
                {user?.role === 'therapist' 
                  ? 'Manage your therapy sessions and client appointments'
                  : 'View and manage your therapy sessions'}
              </p>
            </div>
            
            {/* Only show create button for therapists */}
            {user?.role === 'therapist' && (
                <button
                onClick={() => setShowCreateModal(true)}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Session
                </button>
            )}
          </div>

          {/* View Mode Toggle & Filter Tabs */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex space-x-4">
              {['all', 'scheduled', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    filterStatus === status
                      ? 'bg-black text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-white rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded transition-colors flex items-center ${
                  viewMode === 'calendar'
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </button>
            </div>
          </div>

          {/* Calendar View */}
          {viewMode === 'calendar' ? (
            <div className="bg-white rounded-lg premium-shadow p-6">
              <h2 className="text-xl font-bold text-black mb-4">Calendar View</h2>
              <div className="grid grid-cols-7 gap-2">
                {/* Calendar Header */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-700 py-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {Array.from({ length: 35 }).map((_, index) => {
                  const date = new Date()
                  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
                  const dayOfWeek = firstDay.getDay()
                  const currentDate = new Date(date.getFullYear(), date.getMonth(), index - dayOfWeek + 1)
                  
                  const dayEvents = calendarEvents.filter((event: any) => {
                    const eventDate = new Date(event.startDate)
                    return (
                      eventDate.getDate() === currentDate.getDate() &&
                      eventDate.getMonth() === currentDate.getMonth() &&
                      eventDate.getFullYear() === currentDate.getFullYear()
                    )
                  })
                  
                  const isToday = 
                    currentDate.getDate() === date.getDate() &&
                    currentDate.getMonth() === date.getMonth() &&
                    currentDate.getFullYear() === date.getFullYear()
                  
                  const isCurrentMonth = currentDate.getMonth() === date.getMonth()
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-24 p-2 border border-gray-200 rounded ${
                        isToday ? 'bg-blue-50 border-blue-300' : ''
                      } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                        {currentDate.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event: any) => (
                          <Link
                            key={event._id}
                            href={`/video-call?sessionId=${event.sessionId?._id || event.sessionId}`}
                            className="block text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded truncate hover:bg-purple-200"
                            title={event.title}
                          >
                            {event.title.length > 15 ? `${event.title.substring(0, 15)}...` : event.title}
                          </Link>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Upcoming Events List */}
              <div className="mt-6">
                <h3 className="font-semibold text-black mb-3">Upcoming Events</h3>
                <div className="space-y-2">
                  {calendarEvents
                    .filter((event: any) => new Date(event.startDate) >= new Date())
                    .slice(0, 5)
                    .map((event: any) => (
                      <Link
                        key={event._id}
                        href={`/video-call?sessionId=${event.sessionId?._id || event.sessionId}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-black">{event.title}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <Video className="w-5 h-5 text-blue-600" />
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <>
          {/* Upcoming Sessions */}
          {upcomingSessions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-black mb-4">Upcoming Sessions</h2>
              <div className="grid gap-4">
                {upcomingSessions.map((session: any) => (
              <motion.div
                    key={session._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg premium-shadow p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-black text-lg">
                            {getClientName(session)}
                          </h3>
                          <p className="text-sm text-gray-600">{session.sessionType}</p>
                  </div>
                </div>
                
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="font-semibold text-black">
                            {formatDate(session.scheduledDate)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {session.scheduledTime} • {session.duration} min
                          </p>
                    </div>

                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(session.status)}`}>
                            {getStatusIcon(session.status)}
                            <span className="ml-1">{session.status}</span>
                          </span>
                </div>
                
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/video-call?sessionId=${session._id}`}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            title="Start Video Call"
                          >
                            <Video className="w-5 h-5" />
                          </Link>
                          
                          {user?.role === 'therapist' && (
                            <>
                              {session.status === 'in-progress' && (
                                <button
                                  onClick={() => handleCompleteSession(session._id)}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                  title="Complete Session"
                                >
                                  Complete
                                </button>
                              )}
                              <button
                                className="p-2 text-gray-600 hover:text-black transition-colors"
                                title="Edit Session"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                className="p-2 text-red-600 hover:text-red-700 transition-colors"
                                title="Cancel Session"
                                onClick={async () => {
                                  if (confirm('Cancel this session?')) {
                                    try {
                                      const isSLPA = session.therapistId?.credentials === 'SLPA'
                                      await sessionAPI.cancel(session._id, {
                                        reason: 'Cancelled by therapist',
                                        loggedByTherapist: isSLPA // If SLPA, they log it to get cancellation fee
                                      })
                                      fetchSessions()
                                      if (isSLPA) {
                                        alert('Session cancelled. Cancellation fee payment can be processed.')
                                      }
                                    } catch (error) {
                                      alert('Failed to cancel session')
                                    }
                                  }
                                }}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
            </div>

                    {session.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          <strong>Notes:</strong> {session.notes}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Past Sessions */}
          {pastSessions.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-black mb-4">Past Sessions</h2>
              <div className="grid gap-4">
                {pastSessions.map((session: any) => (
                <motion.div
                    key={session._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg premium-shadow p-6 opacity-75"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                          <h3 className="font-semibold text-black">
                            {getClientName(session)}
                          </h3>
                          <p className="text-sm text-gray-600">{session.sessionType}</p>
                        </div>
                    </div>
                    
                      <div className="flex items-center space-x-6">
                      <div className="text-right">
                          <p className="font-semibold text-gray-700">
                            {formatDate(session.scheduledDate)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {session.scheduledTime} • {session.duration} min
                          </p>
                          {session.price && (
                            <p className="text-sm font-medium text-gray-700 mt-1">
                              ${session.price}
                            </p>
                          )}
                      </div>
                      
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                          
                          {/* Payment Status */}
                          {session.paymentStatus && (
                            <span className={`px-2 py-1 rounded text-xs ${
                              session.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                              session.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {session.paymentStatus}
                            </span>
                          )}

                          {/* Payment Buttons */}
                          {user?.role === 'client' && (
                            <>
                              {session.status === 'completed' && session.paymentStatus !== 'paid' && (
                                <button
                                  onClick={() => handleProcessPayment(session._id)}
                                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center gap-2"
                                >
                                  <CreditCard className="w-4 h-4" />
                                  Pay ${session.price || 0}
                                </button>
                              )}
                            </>
                          )}

                          {/* SLPA Cancellation Fee Payment */}
                          {session.status === 'cancelled' && 
                           session.therapistId?.credentials === 'SLPA' && 
                           session.paymentStatus !== 'paid' && (
                            <button
                              onClick={() => handleProcessPayment(session._id, true)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center gap-2"
                            >
                              <CreditCard className="w-4 h-4" />
                              Pay Cancellation Fee
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                      </div>
                    </div>
          )}
            </>
          )}

          {/* Payment Modal */}
          <PaymentModal
            isOpen={paymentModal.isOpen}
            onClose={() => setPaymentModal({ isOpen: false, amount: 0 })}
            amount={paymentModal.amount}
            clientSecret={paymentModal.clientSecret}
            paymentIntentId={paymentModal.paymentIntentId}
            sessionId={paymentModal.sessionId}
            title={paymentModal.title}
            description={paymentModal.description}
            onSuccess={handlePaymentSuccess}
          />

          {/* Empty State */}
          {sessions.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-600 mb-2">No sessions yet</p>
              <p className="text-gray-500 mb-4">
                {user?.role === 'therapist' 
                  ? 'Create your first session to get started'
                  : 'Book a session with a therapist to begin your journey'}
              </p>
              {user?.role === 'therapist' ? (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Create First Session
                </button>
              ) : (
                <Link
                  href="/meet-our-therapists"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Find a Therapist
                </Link>
              )}
            </div>
        )}
      </div>

        {/* Create Session Modal (Therapist Only) */}
        {showCreateModal && user?.role === 'therapist' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">Create New Session</h2>
              <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-black"
              >
                  ✕
              </button>
            </div>
            
              <div className="space-y-4">
                {/* Client Selection */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Client
                  </label>
                  <select
                    value={newSession.clientId}
                    onChange={(e) => setNewSession({ ...newSession, clientId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Choose a client...</option>
                    {clients.map((client: any) => (
                      <option key={client._id} value={client._id}>
                        {client.userId ? `${client.userId.firstName} ${client.userId.lastName}` : 'Unknown'}
                      </option>
                    ))}
                </select>
              </div>
              
                {/* Date */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                <input 
                  type="date" 
                    value={newSession.scheduledDate}
                    onChange={(e) => setNewSession({ ...newSession, scheduledDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              
                {/* Time */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <select
                    value={newSession.scheduledTime}
                    onChange={(e) => setNewSession({ ...newSession, scheduledTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                  </select>
              </div>
              
                {/* Duration */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    value={newSession.duration}
                    onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                </select>
              </div>
              
                {/* Session Type */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Type
                  </label>
                  <select
                    value={newSession.sessionType}
                    onChange={(e) => setNewSession({ ...newSession, sessionType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="initial">Initial Consultation</option>
                    <option value="follow-up">Follow-up Session</option>
                    <option value="assessment">Assessment</option>
                    <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
                {/* Price */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Price
                  </label>
                  <input
                    type="number"
                    value={newSession.price}
                    onChange={(e) => setNewSession({ ...newSession, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              
                {/* Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleCreateSession}
                    className="flex-1 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                  >
                    Create Session
                  </button>
                <button 
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 border border-gray-300 text-black px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                </div>
              </div>
          </motion.div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  )
}
