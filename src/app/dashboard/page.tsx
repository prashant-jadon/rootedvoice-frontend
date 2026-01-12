'use client'

import { motion } from 'framer-motion'
import { 
  Calendar, 
  Video, 
  Users, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Bell, 
  Settings,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Star,
  MessageCircle,
  FileText,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { sessionAPI, therapistAPI, clientAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import CompensationChart from '@/components/CompensationChart'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [clients, setClients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [therapistProfile, setTherapistProfile] = useState<any>(null)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  // Check URL params for tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab')
      if (tab && ['overview', 'clients'].includes(tab)) {
        setActiveTab(tab)
      }
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (user?.role !== 'therapist') {
      router.push('/client-dashboard')
      return
    }

    fetchDashboardData()
  }, [isAuthenticated, user])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch upcoming sessions
      const sessionsRes = await sessionAPI.getUpcoming()
      const sessionsData = sessionsRes.data.data || []
      setUpcomingSessions(sessionsData)

      // Fetch clients
      const clientsRes = await clientAPI.getAll()
      const clientsData = clientsRes.data.data || []
      setClients(clientsData.slice(0, 3)) // Get first 3 clients

      // Fetch therapist profile
      const therapistRes = await therapistAPI.getMyProfile()
      setTherapistProfile(therapistRes.data.data)
      
      // Fetch therapist stats
      if (therapistRes.data.data?._id) {
        const statsRes = await therapistAPI.getStats(therapistRes.data.data._id)
        setStats(statsRes.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    { 
      title: 'Total Sessions', 
      value: stats?.totalSessions || '0', 
      change: '+12%', 
      icon: <Video className="w-6 h-6" />, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Active Clients', 
      value: stats?.activeClients || '0', 
      change: '+8%', 
      icon: <Users className="w-6 h-6" />, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Monthly Revenue', 
      value: `$${stats?.totalRevenue || '0'}`, 
      change: '+15%', 
      icon: <DollarSign className="w-6 h-6" />, 
      color: 'bg-purple-500' 
    },
    { 
      title: 'Avg Rating', 
      value: stats?.rating ? stats.rating.toFixed(1) : '0', 
      change: '+5%', 
      icon: <Star className="w-6 h-6" />, 
      color: 'bg-orange-500' 
    }
  ]

  return (
    <ProtectedRoute allowedRoles={['therapist']}>
      <div className="min-h-screen bg-gray-50">
        <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" />, href: null },
              { id: 'sessions', label: 'Sessions', icon: <Video className="w-5 h-5" />, href: '/sessions' },
              { id: 'clients', label: 'Clients', icon: <Users className="w-5 h-5" />, href: null },
              { id: 'resources', label: 'Resources', icon: <FileText className="w-5 h-5" />, href: '/resources' },
              { id: 'my-practice', label: 'My Practice', icon: <TrendingUp className="w-5 h-5" />, href: '/my-practice' },
              { id: 'payments', label: 'Payments', icon: <DollarSign className="w-5 h-5" />, href: '/payments' }
            ].map((tab) => (
              tab.href ? (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </Link>
              ) : (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:text-black hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              )
            ))}
          </nav>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
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
                  <p className="text-2xl font-bold text-black">{stat.value}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-full text-white`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Compensation Chart */}
          {therapistProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <CompensationChart
                credentialType={therapistProfile.credentials || 'SLP'}
                hoursAccumulated={therapistProfile.totalHoursWorked || 0}
                currentHourlyRate={therapistProfile.hourlyRate || (therapistProfile.credentials === 'SLPA' ? 30 : 35)}
              />
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">Upcoming Sessions</h2>
                <Link href="/sessions" className="text-black hover:text-gray-600 transition-colors">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => (
                    <div key={session._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">
                            {session.clientId?.userId ? getInitials(`${session.clientId.userId.firstName} ${session.clientId.userId.lastName}`) : 'N/A'}
                        </span>
                      </div>
                      <div>
                          <h3 className="font-semibold text-black">
                            {session.clientId?.userId ? `${session.clientId.userId.firstName} ${session.clientId.userId.lastName}` : 'Unknown Client'}
                          </h3>
                          <p className="text-sm text-gray-600">{session.sessionType}</p>
                        </div>
                    </div>
                    
                    <div className="text-right">
                        <p className="font-semibold text-black">{formatTime(session.scheduledDate)}</p>
                        <p className="text-sm text-gray-600">{session.duration} min</p>
                        <p className="text-xs text-gray-500">{formatDate(session.scheduledDate)}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                            : session.status === 'scheduled'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {session.status}
                      </span>
                        <Link 
                          href={`/video-call?sessionId=${session._id}`} 
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" 
                          title="Start Video Call"
                        >
                        <Video className="w-4 h-4" />
                      </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No upcoming sessions</p>
                  </div>
                )}
              </div>
              
              <Link href="/sessions" className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-black hover:border-black transition-colors flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" />
                Schedule New Session
              </Link>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Clients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">Recent Clients</h2>
                <Link href="/dashboard?tab=clients" className="text-black hover:text-gray-600 transition-colors">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <div key={client._id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">
                          {client.userId ? getInitials(`${client.userId.firstName} ${client.userId.lastName}`) : 'N/A'}
                        </span>
                    </div>
                    <Link href={`/client-view/${client._id}`} className="flex-1">
                        <h3 className="font-semibold text-black text-sm hover:text-blue-600 transition-colors">
                          {client.userId ? `${client.userId.firstName} ${client.userId.lastName}` : 'Unknown'}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {client.currentDiagnoses && client.currentDiagnoses[0] || 'No diagnosis'}
                        </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full" 
                            style={{ width: '75%' }}
                        ></div>
                      </div>
                    </Link>
                    <Link href={`/client-view/${client._id}`} className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="View Documents">
                      <FileText className="w-4 h-4" />
                    </Link>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No clients yet</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">Notifications</h2>
                <button className="text-black hover:text-gray-600 transition-colors">
                  Mark all read
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                  <h3 className="font-semibold text-black text-sm">Welcome to your dashboard!</h3>
                  <p className="text-xs text-gray-600 mt-1">You have {upcomingSessions.length} upcoming sessions</p>
                  <p className="text-xs text-gray-500 mt-2">Just now</p>
                </div>
                {stats?.completedSessions > 0 && (
                  <div className="p-3 rounded-lg bg-green-50 border-l-4 border-green-500">
                    <h3 className="font-semibold text-black text-sm">Sessions completed</h3>
                    <p className="text-xs text-gray-600 mt-1">You've completed {stats.completedSessions} sessions</p>
                    <p className="text-xs text-gray-500 mt-2">This month</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h2 className="text-xl font-bold text-black mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link href="/sessions" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-black">New Session</span>
                </Link>
                
                <Link href="/dashboard?tab=clients" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-black">View All Clients</span>
                </Link>
                
                <Link href="/resources" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Upload Resource</span>
                </Link>
                
                <Link href="/sessions" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-black">View Calendar</span>
                </Link>
              </div>
            </motion.div>
          </div>
          </div>
        </div>
        )}

        {activeTab === 'clients' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl premium-shadow p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">All Clients</h2>
              <Link href="/dashboard" className="text-gray-600 hover:text-black">
                Back to Overview
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.length > 0 ? (
                clients.map((client) => (
                  <Link
                    key={client._id}
                    href={`/client-view/${client._id}`}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">
                          {client.userId ? getInitials(`${client.userId.firstName} ${client.userId.lastName}`) : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">
                          {client.userId ? `${client.userId.firstName} ${client.userId.lastName}` : 'Unknown'}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {client.currentDiagnoses && client.currentDiagnoses[0] || 'No diagnosis'}
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full" 
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No clients yet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
      </div>
    </ProtectedRoute>
  )
}
