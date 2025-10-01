'use client'

import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  Camera, 
  Award, 
  Target, 
  TrendingUp, 
  Clock, 
  Star, 
  MessageCircle, 
  Settings, 
  Bell, 
  Shield, 
  Heart,
  CheckCircle,
  X
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ClientProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  // Dummy data
  const profile = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    dateOfBirth: '1990-05-15',
    joinDate: '2023-08-20',
    avatar: 'SJ',
    bio: 'I\'m working on improving my speech clarity and confidence. I love reading, hiking, and spending time with my family.',
    goals: [
      'Improve articulation of /r/ sounds',
      'Build confidence in public speaking',
      'Enhance vocabulary and language skills'
    ],
    preferences: {
      sessionTime: 'Morning (9 AM - 12 PM)',
      sessionLength: '45 minutes',
      communicationStyle: 'Encouraging and supportive',
      reminderFrequency: '24 hours before session'
    }
  }

  const stats = [
    { label: 'Sessions Completed', value: '12', icon: <CheckCircle className="w-5 h-5" /> },
    { label: 'Current Streak', value: '5 days', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Progress Score', value: '85%', icon: <Target className="w-5 h-5" /> },
    { label: 'Days Active', value: '45', icon: <Calendar className="w-5 h-5" /> }
  ]

  const achievements = [
    {
      id: 1,
      title: 'First Session Complete',
      description: 'Completed your first therapy session',
      date: '2023-08-25',
      icon: <Award className="w-6 h-6" />,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 2,
      title: '5 Session Streak',
      description: 'Completed 5 sessions in a row',
      date: '2023-12-15',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 3,
      title: 'Progress Master',
      description: 'Reached 85% progress score',
      date: '2024-01-10',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-800'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      action: 'Completed session with Dr. Smith',
      time: '2 hours ago',
      type: 'session'
    },
    {
      id: 2,
      action: 'Downloaded new practice materials',
      time: '1 day ago',
      type: 'resource'
    },
    {
      id: 3,
      action: 'Updated progress goals',
      time: '3 days ago',
      type: 'goal'
    },
    {
      id: 4,
      action: 'Rated last session 5 stars',
      time: '1 week ago',
      type: 'rating'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/client-dashboard" className="text-2xl font-bold text-black">Rooted Voices</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-black transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{profile.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">{profile.name}</p>
                  <p className="text-xs text-gray-600">Client</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl premium-shadow p-8 mb-8"
        >
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{profile.avatar}</span>
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-black mb-2">{profile.name}</h1>
                  <p className="text-lg text-gray-600 mb-4">Speech Therapy Client</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{profile.bio}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          {stat.icon}
                          <span className="text-2xl font-bold text-black">{stat.value}</span>
                        </div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-lg font-semibold">4.9</span>
                  </div>
                  <p className="text-sm text-gray-600">Member since {profile.joinDate}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="mb-6">
              <nav className="flex space-x-8">
                {[
                  { id: 'personal', label: 'Personal Info', icon: <User className="w-5 h-5" /> },
                  { id: 'goals', label: 'Goals & Progress', icon: <Target className="w-5 h-5" /> },
                  { id: 'preferences', label: 'Preferences', icon: <Settings className="w-5 h-5" /> }
                ].map((tab) => (
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
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'personal' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl premium-shadow p-6"
              >
                <h2 className="text-xl font-bold text-black mb-6">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={profile.name}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      defaultValue={profile.email}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      defaultValue={profile.phone}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input 
                      type="text" 
                      defaultValue={profile.location}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input 
                      type="date" 
                      defaultValue={profile.dateOfBirth}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea 
                    rows={4}
                    defaultValue={profile.bio}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'goals' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Current Goals */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <h2 className="text-xl font-bold text-black mb-4">Current Goals</h2>
                  <div className="space-y-4">
                    {profile.goals.map((goal, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                        <Target className="w-5 h-5 text-blue-600" />
                        <span className="text-black">{goal}</span>
                        {isEditing && (
                          <button className="ml-auto p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-black hover:border-black transition-colors">
                        + Add New Goal
                      </button>
                    )}
                  </div>
                </div>

                {/* Homework & Practice Assignments */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-black">Homework & Practice</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      3 active assignments
                    </span>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        title: '/r/ Sound Practice - Initial Position',
                        description: 'Practice /r/ sounds at the beginning of words. Complete 10 minutes daily.',
                        dueDate: 'Due: Tomorrow',
                        completed: false,
                        type: 'Daily Practice'
                      },
                      {
                        title: 'Breathing Exercises Video',
                        description: 'Watch and practice the breathing techniques demonstrated in the video.',
                        dueDate: 'Due: In 2 days',
                        completed: false,
                        type: 'Video Exercise'
                      },
                      {
                        title: 'Communication Journal',
                        description: 'Record situations where you successfully used your new techniques.',
                        dueDate: 'Due: End of week',
                        completed: true,
                        type: 'Reflection'
                      }
                    ].map((assignment, index) => (
                      <div key={index} className={`p-4 border rounded-lg ${
                        assignment.completed ? 'bg-green-50 border-green-200' : 'border-gray-200'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start space-x-3 flex-1">
                            <input
                              type="checkbox"
                              checked={assignment.completed}
                              className="mt-1 h-5 w-5 text-green-600 focus:ring-black border-gray-300 rounded"
                              readOnly
                            />
                            <div className="flex-1">
                              <h4 className={`font-semibold mb-1 ${
                                assignment.completed ? 'text-green-800 line-through' : 'text-black'
                              }`}>
                                {assignment.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                              <div className="flex items-center space-x-3 text-xs">
                                <span className={`px-2 py-1 rounded-full ${
                                  assignment.completed 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {assignment.type}
                                </span>
                                <span className={assignment.completed ? 'text-green-600' : 'text-orange-600'}>
                                  {assignment.dueDate}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <h2 className="text-xl font-bold text-black mb-4">Achievements</h2>
                  <div className="space-y-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className={`p-2 rounded-full ${achievement.color}`}>
                          {achievement.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-black">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <p className="text-xs text-gray-500 mt-1">Earned on {achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl premium-shadow p-6"
              >
                <h2 className="text-xl font-bold text-black mb-6">Session Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Session Time</label>
                    <select 
                      defaultValue={profile.preferences.sessionTime}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    >
                      <option>Morning (9 AM - 12 PM)</option>
                      <option>Afternoon (12 PM - 5 PM)</option>
                      <option>Evening (5 PM - 8 PM)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Length</label>
                    <select 
                      defaultValue={profile.preferences.sessionLength}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    >
                      <option>30 minutes</option>
                      <option>45 minutes</option>
                      <option>60 minutes</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Communication Style</label>
                    <select 
                      defaultValue={profile.preferences.communicationStyle}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    >
                      <option>Encouraging and supportive</option>
                      <option>Direct and focused</option>
                      <option>Gentle and patient</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Frequency</label>
                    <select 
                      defaultValue={profile.preferences.reminderFrequency}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    >
                      <option>24 hours before session</option>
                      <option>2 hours before session</option>
                      <option>30 minutes before session</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h3 className="text-lg font-bold text-black mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-black">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h3 className="text-lg font-bold text-black mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/client-dashboard" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Dashboard</span>
                </Link>
                <Link href="/sessions" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Book Session</span>
                </Link>
                <Link href="/resources" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-black">View Resources</span>
                </Link>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Contact Support</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
