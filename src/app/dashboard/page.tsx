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
import { useState } from 'react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  // Dummy data
  const stats = [
    { title: 'Total Sessions', value: '24', change: '+12%', icon: <Video className="w-6 h-6" />, color: 'bg-blue-500' },
    { title: 'Active Clients', value: '18', change: '+8%', icon: <Users className="w-6 h-6" />, color: 'bg-green-500' },
    { title: 'Monthly Revenue', value: '$4,320', change: '+15%', icon: <DollarSign className="w-6 h-6" />, color: 'bg-purple-500' },
    { title: 'Avg Session Time', value: '45m', change: '-2%', icon: <Clock className="w-6 h-6" />, color: 'bg-orange-500' }
  ]

  const upcomingSessions = [
    {
      id: 1,
      client: 'Sarah Johnson',
      time: '10:00 AM',
      duration: '45 min',
      type: 'Speech Therapy',
      status: 'confirmed'
    },
    {
      id: 2,
      client: 'Michael Chen',
      time: '2:00 PM',
      duration: '60 min',
      type: 'Language Assessment',
      status: 'pending'
    },
    {
      id: 3,
      client: 'Emma Wilson',
      time: '4:30 PM',
      duration: '30 min',
      type: 'Follow-up',
      status: 'confirmed'
    }
  ]

  const recentClients = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'SJ',
      lastSession: '2 days ago',
      progress: 85,
      nextSession: 'Today, 10:00 AM'
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: 'MC',
      lastSession: '1 week ago',
      progress: 72,
      nextSession: 'Today, 2:00 PM'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      avatar: 'EW',
      lastSession: '3 days ago',
      progress: 91,
      nextSession: 'Today, 4:30 PM'
    }
  ]

  const notifications = [
    {
      id: 1,
      title: 'New client registration',
      message: 'Sarah Johnson has booked a session for tomorrow',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      title: 'Payment received',
      message: 'Payment of $120 received from Michael Chen',
      time: '4 hours ago',
      unread: true
    },
    {
      id: 3,
      title: 'Session reminder',
      message: 'You have a session with Emma Wilson in 30 minutes',
      time: '6 hours ago',
      unread: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black">Rooted Voices</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-black transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">DR</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Dr. Rebecca Smith</p>
                  <p className="text-xs text-gray-600">Speech Therapist</p>
                </div>
              </div>
              
              <button className="p-2 text-gray-600 hover:text-black transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" />, href: null },
              { id: 'sessions', label: 'Sessions', icon: <Video className="w-5 h-5" />, href: '/sessions' },
              { id: 'clients', label: 'Clients', icon: <Users className="w-5 h-5" />, href: '/client-dashboard' },
              { id: 'resources', label: 'Resources', icon: <FileText className="w-5 h-5" />, href: '/resources' },
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
                {upcomingSessions.map((session, index) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">
                          {session.client.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">{session.client}</h3>
                        <p className="text-sm text-gray-600">{session.type}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-black">{session.time}</p>
                      <p className="text-sm text-gray-600">{session.duration}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.status}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-black hover:border-black transition-colors flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" />
                Schedule New Session
              </button>
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
                <Link href="/clients" className="text-black hover:text-gray-600 transition-colors">
                  View all
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentClients.map((client, index) => (
                  <div key={client.id} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">{client.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-black text-sm">{client.name}</h3>
                      <p className="text-xs text-gray-600">{client.lastSession}</p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full" 
                          style={{ width: `${client.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
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
                {notifications.map((notification, index) => (
                  <div key={notification.id} className={`p-3 rounded-lg ${
                    notification.unread ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
                  }`}>
                    <h3 className="font-semibold text-black text-sm">{notification.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                  </div>
                ))}
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
                
                <Link href="/client-dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Client View</span>
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
    </div>
  )
}
