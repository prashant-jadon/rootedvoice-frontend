'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share, 
  Bookmark,
  TrendingUp,
  Award,
  Search,
  Plus,
  Filter,
  ThumbsUp,
  Reply,
  Eye,
  Clock,
  Pin,
  Star
} from 'lucide-react'
import Link from 'next/link'

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('discussions')

  const categories = [
    { id: 'all', name: 'All Discussions', count: 234 },
    { id: 'early-intervention', name: 'Early Intervention', count: 45 },
    { id: 'school-age', name: 'School-Age Therapy', count: 78 },
    { id: 'adult-neuro', name: 'Adult Neurogenic', count: 32 },
    { id: 'resources', name: 'Resource Sharing', count: 56 },
    { id: 'billing', name: 'Practice Management', count: 23 }
  ]

  const discussions = [
    {
      id: 1,
      title: 'Best strategies for /r/ sound generalization in conversational speech?',
      author: 'Dr. Sarah Chen',
      authorRole: 'SLP - 8 years experience',
      category: 'School-Age Therapy',
      replies: 24,
      views: 342,
      likes: 45,
      isPinned: true,
      lastActivity: '2 hours ago',
      excerpt: 'I\'ve been working with a 7-year-old who has mastered /r/ in structured activities but struggles in conversation...'
    },
    {
      id: 2,
      title: 'AAC assessment tools for minimally verbal children - recommendations?',
      author: 'Michael Rodriguez',
      authorRole: 'SLP - 6 years experience',
      category: 'Early Intervention',
      replies: 18,
      views: 256,
      likes: 32,
      isPinned: false,
      lastActivity: '4 hours ago',
      excerpt: 'Looking for evidence-based AAC assessment tools suitable for children ages 3-5...'
    },
    {
      id: 3,
      title: 'Teletherapy engagement strategies for reluctant clients',
      author: 'Emily Thompson',
      authorRole: 'SLP - 5 years experience',
      category: 'Resource Sharing',
      replies: 31,
      views: 478,
      likes: 67,
      isPinned: false,
      lastActivity: '1 day ago',
      excerpt: 'What are your go-to activities and techniques for keeping clients engaged during teletherapy sessions?'
    },
    {
      id: 4,
      title: 'Insurance reimbursement for AAC evaluations - tips?',
      author: 'Dr. Jennifer Kim',
      authorRole: 'SLP - 12 years experience',
      category: 'Practice Management',
      replies: 42,
      views: 589,
      likes: 78,
      isPinned: true,
      lastActivity: '2 days ago',
      excerpt: 'Looking for advice on documentation and coding for AAC evaluations to ensure insurance approval...'
    }
  ]

  const resources = [
    {
      id: 1,
      title: 'Free Articulation Screener Templates',
      author: 'Dr. Lisa Wang',
      downloads: 234,
      rating: 4.8,
      type: 'Template'
    },
    {
      id: 2,
      title: 'Progress Report Generator',
      author: 'Marcus Johnson',
      downloads: 189,
      rating: 4.9,
      type: 'Tool'
    },
    {
      id: 3,
      title: 'SOAP Note Quick Reference Guide',
      author: 'Rebecca Martinez',
      downloads: 456,
      rating: 4.7,
      type: 'Guide'
    }
  ]

  const upcomingTraining = [
    {
      title: 'Advanced AAC Strategies',
      date: 'Jan 25, 2024',
      time: '2:00 PM EST',
      instructor: 'Dr. Sarah Chen',
      attendees: 45
    },
    {
      title: 'Teletherapy Best Practices',
      date: 'Feb 1, 2024',
      time: '1:00 PM EST',
      instructor: 'Michael Rodriguez',
      attendees: 67
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
              <h1 className="text-2xl font-bold text-black">Community</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Discussion</span>
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
              { id: 'discussions', label: 'Discussions', icon: <MessageCircle className="w-5 h-5" /> },
              { id: 'resources', label: 'Shared Resources', icon: <Share className="w-5 h-5" /> },
              { id: 'training', label: 'Training & Workshops', icon: <Award className="w-5 h-5" /> }
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Search */}
              <div className="bg-white rounded-2xl premium-shadow p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl premium-shadow p-6">
                <h3 className="font-semibold text-black mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-sm">{category.name}</span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'discussions' && (
              <div className="space-y-4">
                {discussions.map((discussion, index) => (
                  <motion.div
                    key={discussion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl premium-shadow p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {discussion.isPinned && (
                                <Pin className="w-4 h-4 text-orange-500" />
                              )}
                              <h3 className="text-lg font-semibold text-black hover:text-gray-600 cursor-pointer">
                                {discussion.title}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{discussion.excerpt}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="font-medium text-black">{discussion.author}</span>
                              <span>{discussion.authorRole}</span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                {discussion.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Reply className="w-4 h-4" />
                              <span>{discussion.replies} replies</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{discussion.views} views</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{discussion.likes} likes</span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{discussion.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-4">
                {resources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl premium-shadow p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-1">{resource.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">Shared by {resource.author}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-gray-600">{resource.downloads} downloads</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{resource.rating}</span>
                          </div>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {resource.type}
                          </span>
                        </div>
                      </div>
                      <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        Download
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'training' && (
              <div className="space-y-4">
                {upcomingTraining.map((training, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl premium-shadow p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-2">{training.title}</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{training.date} at {training.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>Instructor: {training.instructor}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4" />
                            <span>{training.attendees} registered</span>
                          </div>
                        </div>
                      </div>
                      <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                        Register
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
