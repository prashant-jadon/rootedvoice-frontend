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
import { useState } from 'react'

export default function MyPracticePage() {
  const [isEditing, setIsEditing] = useState(false)

  // Practice metrics
  const metrics = [
    { title: 'Total Clients', value: '24', change: '+12%', icon: <Users className="w-6 h-6" />, color: 'bg-blue-500' },
    { title: 'Active Caseload', value: '18', change: '+8%', icon: <Activity className="w-6 h-6" />, color: 'bg-green-500' },
    { title: 'This Month Revenue', value: '$4,320', change: '+15%', icon: <DollarSign className="w-6 h-6" />, color: 'bg-purple-500' },
    { title: 'Avg Client Rating', value: '4.9', change: '+0.1', icon: <Star className="w-6 h-6" />, color: 'bg-orange-500' }
  ]

  const caseloadByAge = [
    { label: 'Infants & Toddlers', count: 3, percentage: 13 },
    { label: 'Preschool & School-Age', count: 9, percentage: 37 },
    { label: 'Adolescents', count: 4, percentage: 17 },
    { label: 'Adults', count: 6, percentage: 25 },
    { label: 'Older Adults', count: 2, percentage: 8 }
  ]

  const caseloadByDisorder = [
    { label: 'Articulation', count: 7 },
    { label: 'Language Development', count: 5 },
    { label: 'Fluency', count: 3 },
    { label: 'Voice', count: 2 },
    { label: 'AAC', count: 1 }
  ]

  const analytics = {
    sessionsThisWeek: 12,
    sessionsThisMonth: 48,
    avgSessionLength: '45 min',
    completionRate: '95%',
    rescheduleRate: '8%',
    noShowRate: '2%'
  }

  const upcomingSchedule = [
    { time: '9:00 AM', client: 'Sarah Johnson', type: 'Speech Therapy', duration: '45 min' },
    { time: '10:00 AM', client: 'Michael Chen', type: 'Language Assessment', duration: '60 min' },
    { time: '2:00 PM', client: 'Emma Wilson', type: 'Follow-up', duration: '30 min' }
  ]

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
              <h2 className="text-3xl font-bold text-black mb-2">Dr. Rebecca Smith's Practice</h2>
              <p className="text-lg text-gray-600">Licensed Speech-Language Pathologist • CCC-SLP</p>
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>rebecca.smith@rootedvoices.com</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-2xl font-bold">4.9</span>
              </div>
              <p className="text-sm text-gray-600">127 reviews</p>
            </div>
          </div>
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
            {/* Caseload Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h2 className="text-xl font-bold text-black mb-6">Caseload Distribution</h2>
              
              <div className="mb-8">
                <h3 className="font-semibold text-black mb-4">By Age Group</h3>
                <div className="space-y-3">
                  {caseloadByAge.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{item.label}</span>
                        <span className="text-black font-medium">{item.count} clients ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-black mb-4">By Disorder Type</h3>
                <div className="grid grid-cols-5 gap-4">
                  {caseloadByDisorder.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-black mb-1">{item.count}</div>
                      <div className="text-xs text-gray-600">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

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
                  <p className="text-sm text-gray-600 mb-1">Reschedule Rate</p>
                  <p className="text-2xl font-bold text-yellow-600">{analytics.rescheduleRate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">No-Show Rate</p>
                  <p className="text-2xl font-bold text-red-600">{analytics.noShowRate}</p>
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
              
              <div className="space-y-3">
                {upcomingSchedule.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-black">{session.time}</div>
                        <div className="text-xs text-gray-500">{session.duration}</div>
                      </div>
                      <div className="w-px h-8 bg-gray-300"></div>
                      <div>
                        <h4 className="font-semibold text-black">{session.client}</h4>
                        <p className="text-sm text-gray-600">{session.type}</p>
                      </div>
                    </div>
                    <Link href="/video-call" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      <Video className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
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
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Resource Library</span>
                </Link>
                
                <Link href="/payments" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-black">View Payments</span>
                </Link>
                
                <Link href="/community" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Community Forum</span>
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
                    <span className="font-semibold text-black">4.9/5.0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="font-semibold text-black">2.3 hrs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Retention Rate</span>
                  <span className="font-semibold text-green-600">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Referral Rate</span>
                  <span className="font-semibold text-blue-600">34%</span>
                </div>
              </div>
            </motion.div>

            {/* Goals & Targets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h3 className="text-lg font-bold text-black mb-4">Monthly Goals</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Sessions Goal</span>
                    <span className="font-semibold text-black">48/50</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Revenue Goal</span>
                    <span className="font-semibold text-black">$4,320/$5,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '86%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">New Clients Goal</span>
                    <span className="font-semibold text-black">3/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
