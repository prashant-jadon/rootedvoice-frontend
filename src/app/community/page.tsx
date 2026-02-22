'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { forumAPI } from '@/lib/api'
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
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('discussions')
  const [posts, setPosts] = useState<any[]>([])
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [replies, setReplies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general', tags: [] })

  const categories = [
    { id: 'all', name: 'All Discussions' },
    { id: 'general', name: 'General' },
    { id: 'case-studies', name: 'Case Studies' },
    { id: 'resources', name: 'Resource Sharing' },
    { id: 'questions', name: 'Questions' },
    { id: 'tips', name: 'Tips & Tricks' },
    { id: 'announcements', name: 'Announcements' },
    { id: 'other', name: 'Other' }
  ]

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory, searchQuery])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const params: any = {}
      if (selectedCategory !== 'all') params.category = selectedCategory
      if (searchQuery) params.search = searchQuery

      const response = await forumAPI.getPosts(params)
      setPosts(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostClick = async (post: any) => {
    try {
      const response = await forumAPI.getPost(post._id)
      setSelectedPost(response.data.data.post)
      setReplies(response.data.data.replies || [])
    } catch (error) {
      console.error('Failed to fetch post:', error)
    }
  }

  const handleCreatePost = async () => {
    if (authLoading) return
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    try {
      await forumAPI.createPost(newPost)
      setShowCreateModal(false)
      setNewPost({ title: '', content: '', category: 'general', tags: [] })
      fetchPosts()
    } catch (error: any) {
      alert('Failed to create post: ' + (error.response?.data?.message || 'Unknown error'))
    }
  }

  const handleLikePost = async (postId: string) => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    try {
      await forumAPI.likePost(postId)
      fetchPosts()
      if (selectedPost && selectedPost._id === postId) {
        handlePostClick(selectedPost)
      }
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

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
      date: 'Jan 25, 2026',
      time: '2:00 PM EST',
      instructor: 'Dr. Sarah Chen',
      attendees: 45
    },
    {
      title: 'Teletherapy Best Practices',
      date: 'Feb 1, 2026',
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
              <Link href="/dashboard" className="flex items-center">
                <img
                  src="/logorooted 1.png"
                  alt="Rooted Voices Speech & Language Therapy"
                  className="w-18 h-20 mr-2"
                />
                <span className="text-2xl font-bold text-black">Rooted Voices</span>
              </Link>
              <span className="text-gray-400">/</span>
              <h1 className="text-2xl font-bold text-black">Community</h1>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Discussion</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Login to Post</span>
                </Link>
              )}
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
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.id
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      <span className="text-sm">{category.name}</span>
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
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading discussions...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No discussions found</p>
                    {isAuthenticated && (
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="mt-4 text-blue-600 hover:underline"
                      >
                        Start a discussion
                      </button>
                    )}
                  </div>
                ) : (
                  posts.map((post, index) => {
                    const authorName = post.authorId?.firstName && post.authorId?.lastName
                      ? `${post.authorId.firstName} ${post.authorId.lastName}`
                      : 'Anonymous'
                    const timeAgo = post.lastActivityAt
                      ? new Date(post.lastActivityAt) > new Date(Date.now() - 86400000)
                        ? `${Math.floor((Date.now() - new Date(post.lastActivityAt).getTime()) / 3600000)} hours ago`
                        : new Date(post.lastActivityAt).toLocaleDateString()
                      : 'Recently'

                    return (
                      <motion.div
                        key={post._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-white rounded-2xl premium-shadow p-6 hover:shadow-xl transition-shadow cursor-pointer"
                        onClick={() => handlePostClick(post)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {post.isPinned && (
                                    <Pin className="w-4 h-4 text-orange-500" />
                                  )}
                                  <h3 className="text-lg font-semibold text-black hover:text-gray-600">
                                    {post.title}
                                  </h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {post.content.substring(0, 150)}...
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="font-medium text-black">{authorName}</span>
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs capitalize">
                                    {post.category}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleLikePost(post._id)
                                  }}
                                  className="flex items-center space-x-1 hover:text-red-600 transition-colors"
                                >
                                  <Heart className={`w-4 h-4 ${post.likes?.some((likeId: any) => {
                                    const userId = (user as any)?._id || (user as any)?.id;
                                    return likeId?.toString() === userId?.toString();
                                  }) ? 'fill-current text-red-600' : ''}`} />
                                  <span>{post.likes?.length || 0} likes</span>
                                </button>
                                <div className="flex items-center space-x-1">
                                  <Reply className="w-4 h-4" />
                                  <span>{post.replyCount || 0} replies</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{post.viewCount || 0} views</span>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">{timeAgo}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                )}
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

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-black mb-4">Create New Discussion</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter discussion title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Write your discussion content..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewPost({ title: '', content: '', category: 'general', tags: [] })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.title || !newPost.content}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Post
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
