'use client'

import { motion } from 'framer-motion'
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
  Save
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { therapistAPI, sessionAPI, clientAPI } from '@/lib/api'
import CredentialsBadge from '@/components/CredentialsBadge'

export default function MyPracticePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Real data from API
  const [therapistProfile, setTherapistProfile] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'therapist') {
      router.push('/login')
      return
    }
    
    fetchPracticeData()
  }, [isAuthenticated, user])

  const fetchPracticeData = async () => {
    try {
      setIsLoading(true)

      // Get therapist profile
      const therapistRes = await therapistAPI.getMyProfile()
      setTherapistProfile(therapistRes.data.data)

      // Get all sessions
      const sessionsRes = await sessionAPI.getAll()
      setSessions(sessionsRes.data.data.sessions || [])

      // Get all clients
      try {
        const clientsRes = await clientAPI.getAll()
        setClients(clientsRes.data.data || [])
      } catch (error) {
        console.log('Could not fetch clients')
      }

    } catch (error) {
      console.error('Failed to fetch practice data:', error)
    } finally {
      setIsLoading(false)
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
  const totalRevenue = completedSessions * (therapistProfile.hourlyRate || 85)
  const therapistName = `${therapistProfile.userId?.firstName || ''} ${therapistProfile.userId?.lastName || ''}`.trim()

  // Calculate metrics
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
    rescheduleRate: '0%',
    noShowRate: '0%'
  }

  // Get today's sessions
  const today = new Date().toISOString().split('T')[0]
  const todaysSessions = sessions.filter(s => {
    const sessionDate = new Date(s.scheduledDate).toISOString().split('T')[0]
    return sessionDate === today && (s.status === 'scheduled' || s.status === 'confirmed')
  })

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
              <h2 className="text-3xl font-bold text-black mb-2">Dr. {therapistName}'s Practice</h2>
              <p className="text-lg text-gray-600">
                <div className="flex items-center gap-2">
                  <span>Licensed Speech-Language Pathologist</span>
                  <CredentialsBadge credentials={therapistProfile.credentials || 'SLP'} canSupervise={therapistProfile.canSupervise || false} />
                </div>
              </p>
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

          {/* Specializations */}
          {therapistProfile.specializations && therapistProfile.specializations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {therapistProfile.specializations.map((spec: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
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

            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">Today's Schedule</h2>
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
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
