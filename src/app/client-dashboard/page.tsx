'use client'

import { motion } from 'framer-motion'
import { 
  Calendar, 
  Video, 
  FileText, 
  Clock, 
  TrendingUp, 
  Bell, 
  Settings,
  Plus,
  Star,
  MessageCircle,
  Download,
  Play,
  CheckCircle,
  AlertCircle,
  User,
  Heart,
  Target,
  Award
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ClientDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  // Dummy data
  const stats = [
    { title: 'Sessions Completed', value: '12', change: '+3 this month', icon: <Video className="w-6 h-6" />, color: 'bg-blue-500' },
    { title: 'Current Streak', value: '5 days', change: 'Keep it up!', icon: <TrendingUp className="w-6 h-6" />, color: 'bg-green-500' },
    { title: 'Progress Score', value: '85%', change: '+5% this week', icon: <Target className="w-6 h-6" />, color: 'bg-purple-500' },
    { title: 'Next Session', value: 'Tomorrow', change: '10:00 AM', icon: <Clock className="w-6 h-6" />, color: 'bg-orange-500' }
  ]

  const upcomingSessions = [
    {
      id: 1,
      therapist: 'Dr. Rebecca Smith',
      date: '2024-01-16',
      time: '10:00 AM',
      duration: '45 min',
      type: 'Speech Therapy',
      status: 'confirmed'
    },
    {
      id: 2,
      therapist: 'Dr. Rebecca Smith',
      date: '2024-01-18',
      time: '2:00 PM',
      duration: '30 min',
      type: 'Follow-up',
      status: 'scheduled'
    }
  ]

  const recentSessions = [
    {
      id: 1,
      therapist: 'Dr. Rebecca Smith',
      date: '2024-01-15',
      time: '10:00 AM',
      type: 'Speech Therapy',
      duration: '45 min',
      status: 'completed',
      notes: 'Great progress on /r/ sounds!',
      rating: 5
    },
    {
      id: 2,
      therapist: 'Dr. Rebecca Smith',
      date: '2024-01-12',
      time: '2:00 PM',
      type: 'Language Practice',
      duration: '30 min',
      status: 'completed',
      notes: 'Working on vocabulary building',
      rating: 5
    }
  ]

  const resources = [
    {
      id: 1,
      title: 'Articulation Exercises',
      type: 'worksheet',
      downloads: 3,
      lastUsed: '2 days ago'
    },
    {
      id: 2,
      title: 'Breathing Techniques',
      type: 'video',
      downloads: 1,
      lastUsed: '1 week ago'
    },
    {
      id: 3,
      title: 'Daily Practice Log',
      type: 'worksheet',
      downloads: 5,
      lastUsed: 'Today'
    }
  ]

  const progressData = [
    { week: 'Week 1', score: 60 },
    { week: 'Week 2', score: 65 },
    { week: 'Week 3', score: 70 },
    { week: 'Week 4', score: 75 },
    { week: 'Week 5', score: 80 },
    { week: 'Week 6', score: 85 }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-black">Rooted Voices</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-black transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">SJ</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Sarah Johnson</p>
                  <p className="text-xs text-gray-600">Client</p>
                </div>
              </div>
              
              <Link href="/client-profile" className="p-2 text-gray-600 hover:text-black transition-colors">
                <Settings className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-black mb-2">Welcome back, Sarah!</h1>
          <p className="text-gray-600">Ready for your next session? You're making great progress!</p>
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
                  <p className="text-2xl font-bold text-black">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full text-white`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Sessions */}
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
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">DR</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">{session.therapist}</h3>
                        <p className="text-sm text-gray-600">{session.type}</p>
                        <p className="text-xs text-gray-500">{session.date} at {session.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-semibold text-black">{session.duration}</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {session.status}
                      </span>
                      <Link href="/video-call" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <Video className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Progress Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h2 className="text-xl font-bold text-black mb-6">Your Progress</h2>
              <div className="h-64 flex items-end space-x-4">
                {progressData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600"
                      style={{ height: `${(data.score / 100) * 200}px` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">{data.week}</span>
                    <span className="text-xs font-semibold text-black">{data.score}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h2 className="text-xl font-bold text-black mb-6">Recent Sessions</h2>
              <div className="space-y-4">
                {recentSessions.map((session, index) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">{session.type}</h3>
                        <p className="text-sm text-gray-600">{session.therapist}</p>
                        <p className="text-xs text-gray-500">{session.date} - {session.notes}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < session.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
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
                  <span className="text-sm font-medium text-black">Book Session</span>
                </Link>
                <Link href="/resources" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-black">View Resources</span>
                </Link>
                <Link href="/video-call" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Video className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Join Session</span>
                </Link>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Message Therapist</span>
                </button>
              </div>
            </motion.div>

            {/* My Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h3 className="text-lg font-bold text-black mb-4">My Resources</h3>
              <div className="space-y-3">
                {resources.map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-black text-sm">{resource.title}</h4>
                      <p className="text-xs text-gray-600">Last used: {resource.lastUsed}</p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Link href="/resources" className="w-full mt-4 py-2 text-center text-blue-600 hover:text-blue-800 transition-colors">
                View all resources
              </Link>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h3 className="text-lg font-bold text-black mb-4">Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Award className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h4 className="font-medium text-black text-sm">5 Session Streak</h4>
                    <p className="text-xs text-gray-600">Completed 5 sessions in a row</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="font-medium text-black text-sm">Progress Master</h4>
                    <p className="text-xs text-gray-600">Reached 85% progress score</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Heart className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-black text-sm">Dedicated Learner</h4>
                    <p className="text-xs text-gray-600">Completed 12 sessions</p>
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
