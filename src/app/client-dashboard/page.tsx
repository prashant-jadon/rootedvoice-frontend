'use client'

import { motion } from 'framer-motion'
import { 
  Calendar, 
  Video, 
  BookOpen, 
  TrendingUp, 
  Award,
  CheckCircle,
  Clock,
  User,
  MessageCircle,
  FileText,
  Target,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { sessionAPI, clientAPI, subscriptionAPI, assignmentAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function ClientDashboardPage() {
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
  const [clientProfile, setClientProfile] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [remainingSessions, setRemainingSessions] = useState<any>(null)
  const [assignments, setAssignments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (user?.role !== 'client') {
      router.push('/dashboard')
      return
    }

    fetchClientData()
  }, [isAuthenticated, user])

  const fetchClientData = async () => {
    try {
      // Fetch assignments
      try {
        const assignmentsRes = await assignmentAPI.getAll({ completed: false });
        setAssignments(assignmentsRes.data.data || []);
      } catch (error) {
        console.log('Could not fetch assignments');
      }
      setIsLoading(true)
      
      // Fetch upcoming sessions
      const sessionsRes = await sessionAPI.getUpcoming()
      const sessionsData = sessionsRes.data.data || []
      setUpcomingSessions(sessionsData)

      // Fetch current subscription
      try {
        const subRes = await subscriptionAPI.getCurrent()
        setSubscription(subRes.data.data)
        
        // Fetch remaining sessions if subscription exists
        if (subRes.data.data) {
          try {
            const remainingRes = await subscriptionAPI.getRemainingSessions()
            setRemainingSessions(remainingRes.data.data)
          } catch (error) {
            console.log('Could not fetch remaining sessions')
          }
        }
      } catch (error) {
        console.log('No subscription yet')
      }

      // Get client profile with real therapist data
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        
        let assignedTherapistName = 'Not assigned yet'
        
        // Fetch client profile to get assigned therapist
        try {
          const clientProfileRes = await clientAPI.getMyProfile()
          const clientData = clientProfileRes.data.data
          
          if (clientData.assignedTherapist?.userId) {
            assignedTherapistName = `Dr. ${clientData.assignedTherapist.userId.firstName} ${clientData.assignedTherapist.userId.lastName}`
          } else if (sessionsData.length > 0) {
            // Fallback: get therapist from first session
            const firstSession = sessionsData[0]
            if (firstSession.therapistId?.userId) {
              assignedTherapistName = `Dr. ${firstSession.therapistId.userId.firstName} ${firstSession.therapistId.userId.lastName}`
            }
          }
        } catch (error) {
          console.log('Could not fetch client profile, trying sessions fallback')
          // Fallback: try to get from sessions
          if (sessionsData.length > 0) {
            const firstSession = sessionsData[0]
            if (firstSession.therapistId?.userId) {
              assignedTherapistName = `Dr. ${firstSession.therapistId.userId.firstName} ${firstSession.therapistId.userId.lastName}`
            }
          }
        }
        
        setClientProfile({
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          therapist: assignedTherapistName,
          sessionStreak: 5,
          progressScore: 78,
          totalSessions: sessionsData.length,
          upcomingGoals: 3
        })
      }

      // Mock progress data - in real app, fetch from API
      setProgress({
        weeklyGoals: [65, 72, 78, 85, 78],
        overallProgress: 78
      })

    } catch (error) {
      console.error('Failed to fetch client data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: 'Session Streak',
      value: clientProfile?.sessionStreak || '0',
      icon: <Activity className="w-6 h-6" />,
      color: 'bg-purple-500',
      description: 'consecutive weeks'
    },
    {
      title: 'Progress Score',
      value: `${clientProfile?.progressScore || 0}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-green-500',
      description: 'overall improvement'
    },
    {
      title: 'Total Sessions',
      value: clientProfile?.totalSessions || '0',
      icon: <Video className="w-6 h-6" />,
      color: 'bg-blue-500',
      description: 'completed'
    },
    {
      title: 'Active Goals',
      value: clientProfile?.upcomingGoals || '0',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-orange-500',
      description: 'in progress'
    }
  ]

  return (
    <ProtectedRoute allowedRoles={['client']}>
    <div className="min-h-screen bg-gray-50">
        <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">
                Welcome back, {user?.firstName}! 👋
              </h1>
              {clientProfile?.therapist && clientProfile.therapist !== 'Not assigned yet' ? (
                <p className="text-gray-600">
                  Your therapist: <span className="font-semibold text-black">{clientProfile.therapist}</span>
                </p>
              ) : (
                <p className="text-gray-600">
                  <Link href="/meet-our-therapists" className="text-purple-600 hover:text-purple-700 font-semibold underline">
                    Find a therapist
                  </Link> to get started with your therapy journey
                </p>
              )}
            </div>
            {subscription && (
              <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg">
                <p className="text-sm font-semibold">{subscription.tierName}</p>
                <p className="text-xs">${subscription.price}/session</p>
                {remainingSessions && (
                  <p className="text-xs mt-1 font-medium">
                    {remainingSessions.hasUnlimited 
                      ? 'Unlimited sessions' 
                      : `${remainingSessions.remainingSessions} of ${remainingSessions.totalSessions} remaining`}
                  </p>
                )}
              </div>
            )}
          </div>
          {!subscription && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                You haven't selected a pricing plan yet. <Link href="/pricing" className="font-semibold underline">Choose a plan</Link> to get started!
              </p>
            </div>
          )}
          {!clientProfile?.therapist || clientProfile.therapist === 'Not assigned yet' ? (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Getting Started:</strong> Browse our <Link href="/meet-our-therapists" className="font-semibold underline">therapist directory</Link> and book a session to begin your therapy journey!
              </p>
            </div>
          ) : null}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl premium-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-black">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full text-white`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Remaining Sessions Card */}
        {remainingSessions && subscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Your Session Balance</h3>
                <div className="flex items-baseline space-x-4">
                  <div>
                    <p className="text-sm text-gray-600">Remaining Sessions</p>
                    <p className={`text-4xl font-bold ${
                      remainingSessions.hasUnlimited 
                        ? 'text-green-600' 
                        : remainingSessions.remainingSessions > 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                    }`}>
                      {remainingSessions.hasUnlimited 
                        ? '∞' 
                        : remainingSessions.remainingSessions}
                    </p>
                  </div>
                  {!remainingSessions.hasUnlimited && (
                    <div className="text-sm text-gray-600">
                      <p>Used: {remainingSessions.usedSessions} / {remainingSessions.totalSessions}</p>
                      {remainingSessions.remainingSessions === 0 && (
                        <p className="text-red-600 font-semibold mt-1">
                          All sessions used this billing period
                        </p>
                      )}
                      {remainingSessions.remainingSessions > 0 && (
                        <p className="text-green-600 font-semibold mt-1">
                          {remainingSessions.remainingSessions} more session{remainingSessions.remainingSessions !== 1 ? 's' : ''} available
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {remainingSessions.remainingSessions > 0 && !remainingSessions.hasUnlimited && (
                <Link
                  href="/meet-our-therapists"
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                >
                  Book Session
                </Link>
              )}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">Upcoming Sessions</h2>
                <Link href="/sessions" className="text-sm text-black hover:text-gray-600 transition-colors">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => (
                    <div key={session._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Video className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                          <h3 className="font-semibold text-black">Therapy Session</h3>
                          <p className="text-sm text-gray-600">{session.sessionType}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-black">{formatTime(session.scheduledDate)}</p>
                        <p className="text-sm text-gray-600">{formatDate(session.scheduledDate)}</p>
                        <p className="text-xs text-gray-500">{session.duration} min</p>
                    </div>
                    
                      <Link 
                        href={`/video-call?sessionId=${session._id}`}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Join
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No upcoming sessions</p>
                    <Link href="/meet-our-therapists" className="text-purple-600 hover:text-purple-700 text-sm mt-2 inline-block">
                      Book a session
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Weekly Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h2 className="text-xl font-bold text-black mb-6">Weekly Progress</h2>
              
              <div className="flex items-end justify-between h-48 space-x-4">
                {progress?.weeklyGoals.map((value: number, index: number) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-200 rounded-t-lg flex-grow relative" style={{ maxHeight: '192px' }}>
                    <div 
                        className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg absolute bottom-0"
                        style={{ height: `${value}%` }}
                    ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Week {index + 1}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h2 className="text-xl font-bold text-black mb-4">Current Goals</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-black text-sm">Improve /r/ sound</h3>
                    <span className="text-xs font-medium text-purple-600">85%</span>
                      </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                  <p className="text-xs text-gray-600 mt-2">Target: March 2025</p>
                    </div>
                    
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-black text-sm">Expand vocabulary</h3>
                    <span className="text-xs font-medium text-blue-600">65%</span>
                      </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Target: April 2025</p>
                </div>

                <Link
                  href="/client-profile"
                  className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-black hover:border-black transition-colors flex items-center justify-center text-sm"
                >
                  View All Goals
                </Link>
              </div>
            </motion.div>

            {/* Homework Assignments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h2 className="text-xl font-bold text-black mb-4">Homework</h2>
              
              {assignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No assignments yet</p>
                  <p className="text-xs mt-1">Your therapist will assign homework here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignments.slice(0, 3).map((assignment: any) => {
                    const isOverdue = !assignment.completed && new Date(assignment.dueDate) < new Date()
                    const dueDate = new Date(assignment.dueDate)
                    const isToday = dueDate.toDateString() === new Date().toDateString()
                    const isTomorrow = dueDate.toDateString() === new Date(Date.now() + 86400000).toDateString()
                    
                    let dueText = ''
                    if (assignment.completed) {
                      dueText = 'Completed ✓'
                    } else if (isOverdue) {
                      dueText = `Overdue: ${dueDate.toLocaleDateString()}`
                    } else if (isToday) {
                      dueText = 'Due: Today'
                    } else if (isTomorrow) {
                      dueText = 'Due: Tomorrow'
                    } else {
                      dueText = `Due: ${dueDate.toLocaleDateString()}`
                    }

                    return (
                      <div
                        key={assignment._id}
                        className={`flex items-start space-x-3 p-3 rounded-lg ${
                          assignment.completed
                            ? 'bg-green-50'
                            : isOverdue
                            ? 'bg-red-50'
                            : 'bg-gray-50'
                        }`}
                      >
                        {assignment.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <Clock className={`w-5 h-5 mt-0.5 ${isOverdue ? 'text-red-600' : 'text-gray-400'}`} />
                        )}
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-black">{assignment.title}</h3>
                          <p className={`text-xs ${assignment.completed ? 'text-green-600' : isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                            {dueText}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  
                  {assignments.length > 3 && (
                    <Link
                      href="/client-profile?tab=assignments"
                      className="block text-center text-sm text-blue-600 hover:underline mt-2"
                    >
                      View all {assignments.length} assignments
                    </Link>
                  )}
                </div>
                  )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h2 className="text-xl font-bold text-black mb-4">Quick Actions</h2>
              
              <div className="space-y-2">
                <Link
                  href="/meet-our-therapists"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-black">Find a Therapist</span>
                </Link>

                <Link
                  href="/client-profile"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-black">View My Goals</span>
                </Link>

                <Link
                  href="/resources"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-black">Practice Materials</span>
              </Link>

                <Link
                  href="/profile"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-black">My Profile</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
