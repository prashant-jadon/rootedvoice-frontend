'use client'

import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Share, 
  Star, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  Folder,
  MoreVertical,
  Grid,
  List,
  Tag,
  Calendar,
  User,
  Heart,
  Bookmark
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { resourceAPI, translationAPI, therapistAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import CredentialsBadge from '@/components/CredentialsBadge'
import AccessLevelBadge from '@/components/AccessLevelBadge'
import SLPAWarning from '@/components/SLPAWarning'

export default function ResourcesPage() {
  const { user, isAuthenticated } = useAuth()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [resources, setResources] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAISearch, setIsAISearch] = useState(false)
  const [therapistCredentials, setTherapistCredentials] = useState<'SLP' | 'SLPA' | null>(null)
  const [canSupervise, setCanSupervise] = useState<boolean>(false)
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    category: '',
    accessLevel: 'public',
    tags: '',
  })

  // Dummy data
  const categories = [
    { id: 'all', name: 'All Resources', count: 24 },
    { id: 'worksheets', name: 'Worksheets', count: 12 },
    { id: 'exercises', name: 'Exercises', count: 8 },
    { id: 'assessments', name: 'Assessments', count: 4 },
    { id: 'videos', name: 'Videos', count: 6 },
    { id: 'audio', name: 'Audio Files', count: 3 }
  ]

  // Fetch therapist credentials if user is a therapist
  useEffect(() => {
    if (isAuthenticated && user?.role === 'therapist') {
      fetchTherapistCredentials()
    }
  }, [isAuthenticated, user])

  // Fetch resources when search query changes
  useEffect(() => {
    fetchResources()
  }, [selectedCategory])

  const fetchTherapistCredentials = async () => {
    try {
      const response = await therapistAPI.getMyProfile()
      setTherapistCredentials(response.data.data?.credentials || null)
      setCanSupervise(response.data.data?.canSupervise || false)
    } catch (error) {
      console.error('Failed to fetch therapist credentials:', error)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        handleAISearch()
      } else if (searchQuery.trim().length === 0) {
        fetchResources()
      }
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const fetchResources = async () => {
    try {
      setIsLoading(true)
      const params: any = {}
      if (selectedCategory !== 'all') {
        params.category = selectedCategory
      }
      const response = await resourceAPI.getAll(params)
      setResources(response.data.data || [])
      setIsAISearch(false)
    } catch (error) {
      console.error('Failed to fetch resources:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAISearch = async () => {
    if (searchQuery.trim().length === 0) {
      fetchResources()
      return
    }

    try {
      setIsLoading(true)
      setIsAISearch(true)
      
      // Detect language of search query for multilingual support
      let detectedLanguage = 'en'
      try {
        const langResponse = await translationAPI.detectLanguage(searchQuery)
        detectedLanguage = langResponse.data.data.language
      } catch (error) {
        console.error('Language detection failed:', error)
      }

      // Translate search query to English if needed for backend processing
      let searchQueryToUse = searchQuery
      if (detectedLanguage !== 'en') {
        try {
          const translateResponse = await translationAPI.translateText(
            searchQuery,
            detectedLanguage,
            'en'
          )
          searchQueryToUse = translateResponse.data.data.translated
        } catch (error) {
          console.error('Translation failed, using original query:', error)
        }
      }

      const response = await resourceAPI.aiSearch(searchQueryToUse, {
        page: 1,
        limit: 50,
      })
      setResources(response.data.data || [])
    } catch (error) {
      console.error('AI search failed:', error)
      // Fallback to regular search
      fetchResources()
    } finally {
      setIsLoading(false)
    }
  }

  const dummyResources = [
    {
      id: 1,
      title: 'Articulation Exercises for /r/ Sounds',
      description: 'Comprehensive worksheet with exercises to practice /r/ sound articulation',
      type: 'worksheet',
      fileType: 'pdf',
      size: '2.4 MB',
      uploadDate: '2024-01-10',
      downloads: 45,
      rating: 4.8,
      tags: ['articulation', 'r-sounds', 'exercises'],
      isFavorite: true,
      author: 'Dr. Rebecca Smith'
    },
    {
      id: 2,
      title: 'Language Development Assessment',
      description: 'Standardized assessment tool for evaluating language development in children',
      type: 'assessment',
      fileType: 'pdf',
      size: '5.2 MB',
      uploadDate: '2024-01-08',
      downloads: 23,
      rating: 4.9,
      tags: ['assessment', 'language', 'children'],
      isFavorite: false,
      author: 'Dr. Rebecca Smith'
    },
    {
      id: 3,
      title: 'Breathing Exercises Video',
      description: 'Guided breathing exercises for speech therapy sessions',
      type: 'video',
      fileType: 'mp4',
      size: '45.8 MB',
      uploadDate: '2024-01-05',
      downloads: 67,
      rating: 4.7,
      tags: ['breathing', 'exercises', 'video'],
      isFavorite: true,
      author: 'Dr. Rebecca Smith'
    },
    {
      id: 4,
      title: 'Phoneme Practice Cards',
      description: 'Flashcards for practicing different phonemes and sounds',
      type: 'exercises',
      fileType: 'pdf',
      size: '1.8 MB',
      uploadDate: '2024-01-03',
      downloads: 89,
      rating: 4.6,
      tags: ['phonemes', 'flashcards', 'practice'],
      isFavorite: false,
      author: 'Dr. Rebecca Smith'
    },
    {
      id: 5,
      title: 'Stuttering Therapy Techniques',
      description: 'Audio guide with techniques for managing stuttering',
      type: 'audio',
      fileType: 'mp3',
      size: '12.3 MB',
      uploadDate: '2024-01-01',
      downloads: 34,
      rating: 4.9,
      tags: ['stuttering', 'techniques', 'audio'],
      isFavorite: true,
      author: 'Dr. Rebecca Smith'
    },
    {
      id: 6,
      title: 'Vocabulary Building Activities',
      description: 'Interactive activities for expanding vocabulary in children',
      type: 'worksheet',
      fileType: 'pdf',
      size: '3.1 MB',
      uploadDate: '2023-12-28',
      downloads: 56,
      rating: 4.5,
      tags: ['vocabulary', 'children', 'activities'],
      isFavorite: false,
      author: 'Dr. Rebecca Smith'
    }
  ]

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />
      case 'mp4':
        return <Video className="w-8 h-8 text-blue-500" />
      case 'mp3':
        return <Music className="w-8 h-8 text-green-500" />
      case 'jpg':
      case 'png':
        return <Image className="w-8 h-8 text-purple-500" />
      default:
        return <Archive className="w-8 h-8 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'worksheet':
        return 'bg-blue-100 text-blue-800'
      case 'assessment':
        return 'bg-green-100 text-green-800'
      case 'video':
        return 'bg-purple-100 text-purple-800'
      case 'audio':
        return 'bg-orange-100 text-orange-800'
      case 'exercises':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Use API resources if available, otherwise use dummy data
  const displayResources = resources.length > 0 ? resources : dummyResources
  
  const filteredResources = displayResources.filter((resource: any) => {
    if (isAISearch) {
      // AI search already filtered, just filter by category
      return selectedCategory === 'all' || resource.category === selectedCategory
    }
    const matchesSearch = searchQuery === '' || 
      resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory || resource.type === selectedCategory
    return matchesSearch && matchesCategory
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
              <h1 className="text-2xl font-bold text-black">Resource Library</h1>
              <span className="text-sm text-gray-600">({filteredResources.length} resources)</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated && user?.role === 'therapist' && therapistCredentials && (
                <CredentialsBadge credentials={therapistCredentials} canSupervise={canSupervise} />
              )}
              {isAuthenticated && user?.role === 'therapist' && (
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* AI-Powered Search */}
              <div className="bg-white rounded-2xl premium-shadow p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <h3 className="font-semibold text-black">AI Smart Search</h3>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">✨ AI</span>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Try: /r/ sounds for 5-year-old"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAISearch()
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-600">Quick Filters:</p>
                  <div className="flex flex-wrap gap-1">
                    {['By Age', 'By Goal', 'By Domain', 'By Diagnosis'].map((filter) => (
                      <button key={filter} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors">
                        {filter}
                      </button>
                    ))}
                  </div>
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-black text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-sm">{category.name}</span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl premium-shadow p-6">
                <h3 className="font-semibold text-black mb-4">Library Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Files</span>
                    <span className="text-sm font-semibold text-black">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Downloads</span>
                    <span className="text-sm font-semibold text-black">314</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Storage Used</span>
                    <span className="text-sm font-semibold text-black">2.1 GB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      view === 'grid' 
                        ? 'bg-black text-white' 
                        : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      view === 'list' 
                        ? 'bg-black text-white' 
                        : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black">
                  <option>Sort by Date</option>
                  <option>Sort by Name</option>
                  <option>Sort by Downloads</option>
                  <option>Sort by Rating</option>
                </select>
              </div>
            </div>

            {/* Resources Grid/List */}
            {view === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl premium-shadow p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(resource.fileType)}
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                            {resource.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-yellow-500 transition-colors">
                          <Star className={`w-4 h-4 ${resource.isFavorite ? 'fill-current text-yellow-500' : ''}`} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-black line-clamp-2 flex-1">{resource.title}</h3>
                      {resource.accessLevel && (
                        <AccessLevelBadge accessLevel={resource.accessLevel} />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>
                    
                    {/* Show warning if SLPA tries to access SLP-only resource */}
                    {therapistCredentials === 'SLPA' && resource.accessLevel === 'SLP' && (
                      <SLPAWarning 
                        message="This resource is restricted to SLP credentials only" 
                        type="error"
                      />
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{resource.size}</span>
                      <span>{resource.downloads} downloads</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{resource.rating}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                          <Share className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl premium-shadow p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(resource.fileType)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-black flex-1">{resource.title}</h3>
                              {resource.accessLevel && (
                                <AccessLevelBadge accessLevel={resource.accessLevel} />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                            
                            {/* Show warning if SLPA tries to access SLP-only resource */}
                            {therapistCredentials === 'SLPA' && resource.accessLevel === 'SLP' && (
                              <div className="mb-2">
                                <SLPAWarning 
                                  message="This resource is restricted to SLP credentials only" 
                                  type="error"
                                />
                              </div>
                            )}
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{resource.size}</span>
                              <span>{resource.downloads} downloads</span>
                              <span>Uploaded {resource.uploadDate}</span>
                              <span>By {resource.author}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                              {resource.type}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{resource.rating}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.map((tag: string) => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-yellow-500 transition-colors">
                              <Star className={`w-4 h-4 ${resource.isFavorite ? 'fill-current text-yellow-500' : ''}`} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                              <Share className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-black">Upload Resource</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            <form 
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault()
                try {
                  // Check SLPA restrictions
                  if (therapistCredentials === 'SLPA') {
                    if (uploadFormData.accessLevel === 'SLP') {
                      alert('SLPA credentials cannot create SLP-only resources')
                      return
                    }
                    if (uploadFormData.category === 'assessment') {
                      alert('SLPA credentials cannot upload assessment resources')
                      return
                    }
                  }
                  
                  await resourceAPI.create(uploadFormData)
                  alert('Resource uploaded successfully! Pending admin approval.')
                  setShowUploadModal(false)
                  setUploadFormData({
                    title: '',
                    description: '',
                    category: '',
                    accessLevel: 'public',
                    tags: '',
                  })
                  fetchResources()
                } catch (error: any) {
                  alert(error.response?.data?.message || 'Failed to upload resource')
                }
              }}
            >
              {/* SLPA Warning */}
              {therapistCredentials === 'SLPA' && (
                <SLPAWarning 
                  message="As an SLPA, you cannot upload assessment resources or create SLP-only resources. You can upload public or SLPA-accessible resources."
                  type="warning"
                />
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Drag and drop files here, or click to select</p>
                  <input type="file" className="hidden" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input 
                  type="text" 
                  value={uploadFormData.title}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter resource title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  rows={3}
                  value={uploadFormData.description}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter resource description"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  value={uploadFormData.category}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="">Select category</option>
                  <option value="worksheet">Worksheet</option>
                  <option value="assessment" disabled={therapistCredentials === 'SLPA'}>Assessment {therapistCredentials === 'SLPA' && '(Restricted)'}</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="exercises">Exercises</option>
                </select>
                {therapistCredentials === 'SLPA' && uploadFormData.category === 'assessment' && (
                  <p className="text-xs text-red-600 mt-1">SLPA cannot upload assessment resources</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                <select 
                  value={uploadFormData.accessLevel}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, accessLevel: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="public">Public (Everyone)</option>
                  <option value="SLPA">SLPA+ (SLPA and SLP)</option>
                  <option value="SLP" disabled={therapistCredentials === 'SLPA'}>SLP Only {therapistCredentials === 'SLPA' && '(Restricted)'}</option>
                </select>
                {therapistCredentials === 'SLPA' && uploadFormData.accessLevel === 'SLP' && (
                  <p className="text-xs text-red-600 mt-1">SLPA cannot create SLP-only resources</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input 
                  type="text" 
                  value={uploadFormData.tags}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter tags separated by commas"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false)
                    setUploadFormData({
                      title: '',
                      description: '',
                      category: '',
                      accessLevel: 'public',
                      tags: '',
                    })
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Upload
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
