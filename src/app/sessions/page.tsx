'use client'

import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  Video, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  MessageCircle,
  FileText,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function SessionsPage() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showNewSessionModal, setShowNewSessionModal] = useState(false)

  // Dummy data
  const sessions = [
    {
      id: 1,
      client: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        avatar: 'SJ'
      },
      date: '2024-01-15',
      time: '10:00 AM',
      duration: 45,
      type: 'Speech Therapy',
      status: 'confirmed',
      notes: 'Working on articulation exercises',
      location: 'Online'
    },
    {
      id: 2,
      client: {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1 (555) 234-5678',
        avatar: 'MC'
      },
      date: '2024-01-15',
      time: '2:00 PM',
      duration: 60,
      type: 'Language Assessment',
      status: 'pending',
      notes: 'Initial assessment session',
      location: 'Online'
    },
    {
      id: 3,
      client: {
        name: 'Emma Wilson',
        email: 'emma.wilson@email.com',
        phone: '+1 (555) 345-6789',
        avatar: 'EW'
      },
      date: '2024-01-15',
      time: '4:30 PM',
      duration: 30,
      type: 'Follow-up',
      status: 'confirmed',
      notes: 'Progress review and next steps',
      location: 'Online'
    },
    {
      id: 4,
      client: {
        name: 'David Rodriguez',
        email: 'david.rodriguez@email.com',
        phone: '+1 (555) 456-7890',
        avatar: 'DR'
      },
      date: '2024-01-16',
      time: '9:00 AM',
      duration: 45,
      type: 'Speech Therapy',
      status: 'completed',
      notes: 'Great progress on stuttering exercises',
      location: 'Online'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <AlertCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
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
              <h1 className="text-2xl font-bold text-black">Sessions</h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setView('calendar')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    view === 'calendar' 
                      ? 'bg-black text-white' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    view === 'list' 
                      ? 'bg-black text-white' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-black transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-black transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowNewSessionModal(true)}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Session</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'calendar' ? (
          /* Calendar View */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl premium-shadow p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-black">January 2024</h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const hasSession = sessions.some(session => 
                      new Date(session.date).getDate() === day
                    )
                    const isToday = day === 15 // Dummy today
                    
                    return (
                      <div
                        key={day}
                        className={`h-12 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${
                          isToday 
                            ? 'bg-black text-white' 
                            : hasSession 
                              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                              : 'hover:bg-gray-100'
                        }`}
                      >
                        {day}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Today's Sessions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl premium-shadow p-6"
              >
                <h3 className="text-lg font-bold text-black mb-4">Today's Sessions</h3>
                <div className="space-y-3">
                  {sessions.filter(session => session.date === '2024-01-15').map((session) => (
                    <div key={session.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-black text-sm">{session.time}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{session.client.name}</p>
                      <p className="text-xs text-gray-500">{session.type}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl premium-shadow p-6"
              >
                <h3 className="text-lg font-bold text-black mb-4">This Week</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Sessions</span>
                    <span className="text-sm font-semibold text-black">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="text-sm font-semibold text-green-600">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="text-sm font-semibold text-yellow-600">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Revenue</span>
                    <span className="text-sm font-semibold text-black">$1,440</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          /* List View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl premium-shadow p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black">All Sessions</h2>
              <div className="flex items-center space-x-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black">
                  <option>All Status</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black">
                  <option>All Types</option>
                  <option>Speech Therapy</option>
                  <option>Language Assessment</option>
                  <option>Follow-up</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">{session.client.avatar}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">{session.client.name}</h3>
                        <p className="text-sm text-gray-600">{session.type}</p>
                        <p className="text-xs text-gray-500">{session.notes}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="font-semibold text-black">{session.date}</p>
                        <p className="text-sm text-gray-600">{session.time}</p>
                        <p className="text-xs text-gray-500">{session.duration} min</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(session.status)}`}>
                          {getStatusIcon(session.status)}
                          <span>{session.status}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Video className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{session.client.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{session.client.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{session.location}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* New Session Modal */}
      {showNewSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-black">Schedule New Session</h3>
              <button 
                onClick={() => setShowNewSessionModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
                  <option>Select a client</option>
                  <option>Sarah Johnson</option>
                  <option>Michael Chen</option>
                  <option>Emma Wilson</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input 
                  type="time" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
                  <option>30</option>
                  <option>45</option>
                  <option>60</option>
                  <option>90</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
                  <option>Speech Therapy</option>
                  <option>Language Assessment</option>
                  <option>Follow-up</option>
                  <option>Consultation</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea 
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Add session notes..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowNewSessionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Schedule
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
