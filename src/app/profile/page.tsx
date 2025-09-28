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
  Upload, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Star, 
  MessageCircle, 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  FileText, 
  Globe, 
  Languages,
  Clock,
  DollarSign,
  Users,
  Video,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  // Dummy data
  const profile = {
    name: 'Dr. Rebecca Smith',
    title: 'Licensed Speech-Language Pathologist',
    email: 'rebecca.smith@rootedvoices.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Experienced speech-language pathologist with over 8 years of practice. Specializing in articulation disorders, language development, and stuttering therapy. Committed to helping clients achieve their communication goals through evidence-based practices.',
    avatar: 'RS',
    joinDate: '2023-06-15',
    rating: 4.9,
    totalSessions: 1247,
    totalClients: 89,
    specialties: ['Articulation Disorders', 'Language Development', 'Stuttering Therapy', 'Voice Disorders'],
    languages: ['English', 'Spanish', 'French'],
    education: [
      {
        degree: 'Ph.D. in Speech-Language Pathology',
        school: 'University of California, Berkeley',
        year: '2016'
      },
      {
        degree: 'M.S. in Communication Sciences',
        school: 'Stanford University',
        year: '2014'
      }
    ],
    certifications: [
      {
        name: 'Certificate of Clinical Competence (CCC-SLP)',
        issuer: 'American Speech-Language-Hearing Association',
        year: '2016'
      },
      {
        name: 'Licensed Speech-Language Pathologist',
        issuer: 'California Board of Speech-Language Pathology',
        year: '2016'
      }
    ],
    experience: [
      {
        position: 'Senior Speech-Language Pathologist',
        company: 'San Francisco General Hospital',
        duration: '2018 - Present',
        description: 'Leading speech therapy services for pediatric and adult patients.'
      },
      {
        position: 'Speech-Language Pathologist',
        company: 'Children\'s Hospital Oakland',
        duration: '2016 - 2018',
        description: 'Provided comprehensive speech and language therapy services.'
      }
    ]
  }

  const stats = [
    { label: 'Total Sessions', value: profile.totalSessions, icon: <Video className="w-5 h-5" /> },
    { label: 'Active Clients', value: profile.totalClients, icon: <Users className="w-5 h-5" /> },
    { label: 'Average Rating', value: profile.rating, icon: <Star className="w-5 h-5" /> },
    { label: 'Years Experience', value: '8', icon: <Award className="w-5 h-5" /> }
  ]

  const recentActivity = [
    {
      id: 1,
      action: 'Completed session with Sarah Johnson',
      time: '2 hours ago',
      type: 'session'
    },
    {
      id: 2,
      action: 'Uploaded new resource: "Articulation Exercises"',
      time: '1 day ago',
      type: 'resource'
    },
    {
      id: 3,
      action: 'Received payment from Michael Chen',
      time: '2 days ago',
      type: 'payment'
    },
    {
      id: 4,
      action: 'Updated availability for next week',
      time: '3 days ago',
      type: 'schedule'
    }
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
              <h1 className="text-2xl font-bold text-black">Profile</h1>
            </div>
            
            <div className="flex items-center space-x-4">
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
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">{profile.avatar}</span>
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
                  <p className="text-lg text-gray-600 mb-4">{profile.title}</p>
                  
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
                    <span className="text-lg font-semibold">{profile.rating}</span>
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
                  { id: 'professional', label: 'Professional', icon: <Briefcase className="w-5 h-5" /> },
                  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
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

            {activeTab === 'professional' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Specialties */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <h2 className="text-xl font-bold text-black mb-4">Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialties.map((specialty, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <h2 className="text-xl font-bold text-black mb-4">Languages</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((language, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <h2 className="text-xl font-bold text-black mb-4">Education</h2>
                  <div className="space-y-4">
                    {profile.education.map((edu, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <GraduationCap className="w-5 h-5 text-gray-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-black">{edu.degree}</h3>
                          <p className="text-gray-600">{edu.school}</p>
                          <p className="text-sm text-gray-500">{edu.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <h2 className="text-xl font-bold text-black mb-4">Certifications</h2>
                  <div className="space-y-4">
                    {profile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Award className="w-5 h-5 text-gray-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-black">{cert.name}</h3>
                          <p className="text-gray-600">{cert.issuer}</p>
                          <p className="text-sm text-gray-500">{cert.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <h2 className="text-xl font-bold text-black mb-4">Experience</h2>
                  <div className="space-y-4">
                    {profile.experience.map((exp, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Briefcase className="w-5 h-5 text-gray-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-black">{exp.position}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                          <p className="text-sm text-gray-500">{exp.duration}</p>
                          <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Notification Settings */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <h2 className="text-xl font-bold text-black mb-4">Notification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-black">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive email updates about sessions and payments</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-black">SMS Notifications</h3>
                        <p className="text-sm text-gray-600">Receive text messages for urgent updates</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-black">Session Reminders</h3>
                        <p className="text-sm text-gray-600">Get reminded about upcoming sessions</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded" />
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <h2 className="text-xl font-bold text-black mb-4">Privacy Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-black">Profile Visibility</h3>
                        <p className="text-sm text-gray-600">Allow clients to view your profile</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-black">Session Recording</h3>
                        <p className="text-sm text-gray-600">Allow clients to record sessions</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded" />
                    </div>
                  </div>
                </div>

                {/* Account Settings */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <h2 className="text-xl font-bold text-black mb-4">Account Settings</h2>
                  <div className="space-y-4">
                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-black">Change Password</h3>
                          <p className="text-sm text-gray-600">Update your account password</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-black">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-600">Add an extra layer of security</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>
                    <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-black">Download Data</h3>
                          <p className="text-sm text-gray-600">Export your account data</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>
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

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h3 className="text-lg font-bold text-black mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sessions Completed</span>
                  <span className="text-sm font-semibold text-black">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New Clients</span>
                  <span className="text-sm font-semibold text-black">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="text-sm font-semibold text-black">$2,880</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <span className="text-sm font-semibold text-black">4.9</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h3 className="text-lg font-bold text-black mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Update Availability</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Upload Resources</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-black">View Messages</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Payment Settings</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
