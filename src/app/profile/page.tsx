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
  CheckCircle,
  ChevronRight,
  X,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { therapistAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'

// Language mapping
const languageMap: { [key: string]: string } = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  ar: 'Arabic',
  pt: 'Portuguese',
  ru: 'Russian',
  it: 'Italian',
  hi: 'Hindi',
  nl: 'Dutch',
  pl: 'Polish',
  tr: 'Turkish',
  vi: 'Vietnamese',
  asl: 'American Sign Language',
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [therapist, setTherapist] = useState<any>(null)
  const [formData, setFormData] = useState<any>({
    phone: '',
    location: '',
    bio: '',
    specializations: [],
    spokenLanguages: [],
    education: [],
    certifications: [],
    workExperience: [],
  })

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'therapist') {
      router.push('/login')
      return
    }
    fetchProfile()
  }, [isAuthenticated, user])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const response = await therapistAPI.getMyProfile()
      const therapistData = response.data.data
      setTherapist(therapistData)
      
      // Populate form data
      setFormData({
        phone: therapistData.userId?.phone || '',
        location: therapistData.location || '',
        bio: therapistData.bio || '',
        specializations: therapistData.specializations || [],
        spokenLanguages: therapistData.spokenLanguages || [],
        education: therapistData.education || [],
        certifications: therapistData.certifications || [],
        workExperience: therapistData.workExperience || [],
      })
    } catch (error: any) {
      console.error('Failed to fetch profile:', error)
      if (error.response?.status === 404) {
        // Profile doesn't exist yet, create a basic one
        setTherapist({
          userId: user,
          specializations: [],
          spokenLanguages: [],
          education: [],
          certifications: [],
          workExperience: [],
          rating: 0,
          totalSessions: 0,
          totalReviews: 0,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await therapistAPI.createOrUpdate(formData)
      await fetchProfile() // Refresh data
      setIsEditing(false)
    } catch (error: any) {
      console.error('Failed to save profile:', error)
      alert(error.response?.data?.message || 'Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original
    if (therapist) {
      setFormData({
        phone: therapist.userId?.phone || '',
        location: therapist.location || '',
        bio: therapist.bio || '',
        specializations: therapist.specializations || [],
        spokenLanguages: therapist.spokenLanguages || [],
        education: therapist.education || [],
        certifications: therapist.certifications || [],
        workExperience: therapist.workExperience || [],
      })
    }
    setIsEditing(false)
  }

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: '', institution: '', year: new Date().getFullYear() }]
    })
  }

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_: any, i: number) => i !== index)
    })
  }

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...formData.education]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, education: updated })
  }

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, { name: '', issuer: '', year: new Date().getFullYear() }]
    })
  }

  const removeCertification = (index: number) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_: any, i: number) => i !== index)
    })
  }

  const updateCertification = (index: number, field: string, value: any) => {
    const updated = [...formData.certifications]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, certifications: updated })
  }

  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [...formData.workExperience, { 
        position: '', 
        company: '', 
        startDate: '', 
        endDate: '', 
        isCurrent: false,
        description: '' 
      }]
    })
  }

  const removeWorkExperience = (index: number) => {
    setFormData({
      ...formData,
      workExperience: formData.workExperience.filter((_: any, i: number) => i !== index)
    })
  }

  const updateWorkExperience = (index: number, field: string, value: any) => {
    const updated = [...formData.workExperience]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, workExperience: updated })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!therapist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    )
  }

  const userName = therapist.userId 
    ? `${therapist.userId.firstName} ${therapist.userId.lastName}`
    : 'Unknown User'
  const userEmail = therapist.userId?.email || ''
  const userPhone = formData.phone || therapist.userId?.phone || ''
  const location = formData.location || therapist.location || ''
  const bio = formData.bio || therapist.bio || ''
  const specialties = formData.specializations || therapist.specializations || []
  const languages = formData.spokenLanguages || therapist.spokenLanguages || []
  const education = formData.education || therapist.education || []
  const certifications = formData.certifications || therapist.certifications || []
  const workExperience = formData.workExperience || therapist.workExperience || []

  const stats = [
    { label: 'Total Sessions', value: therapist.totalSessions || 0, icon: <Video className="w-5 h-5" /> },
    { label: 'Active Clients', value: therapist.activeClients?.length || 0, icon: <Users className="w-5 h-5" /> },
    { label: 'Average Rating', value: therapist.rating?.toFixed(1) || '0.0', icon: <Star className="w-5 h-5" /> },
    { label: 'Years Experience', value: therapist.experience || 0, icon: <Award className="w-5 h-5" /> }
  ]

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const specializationOptions = [
    'Early Intervention',
    'Articulation & Phonology',
    'Language Development',
    'Fluency/Stuttering',
    'Voice Therapy',
    'Feeding & Swallowing',
    'AAC',
    'Cognitive-Communication',
    'Neurogenic Disorders',
    'Accent Modification',
    'Gender-Affirming Voice',
    'Pediatric',
    'Adult',
    'Geriatric',
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
              {isEditing ? (
                <>
                  <button 
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
              <button 
                  onClick={() => setIsEditing(true)}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
              </button>
              )}
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
                <span className="text-2xl font-bold text-gray-600">
                  {getInitials(therapist.userId?.firstName || '', therapist.userId?.lastName || '')}
                </span>
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
                  <h1 className="text-3xl font-bold text-black mb-2">{userName}</h1>
                  <p className="text-lg text-gray-600 mb-4">
                    {therapist.credentials ? `${therapist.credentials}-SLP` : 'Licensed Speech-Language Pathologist'}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{userEmail}</span>
                    </div>
                    {userPhone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                        <span>{userPhone}</span>
                    </div>
                    )}
                    {location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                        <span>{location}</span>
                    </div>
                    )}
                  </div>

                  {bio && <p className="text-gray-700 mb-4">{bio}</p>}

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
                    <span className="text-lg font-semibold">{therapist.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  {therapist.createdAt && (
                    <p className="text-sm text-gray-600">
                      Member since {new Date(therapist.createdAt).toLocaleDateString()}
                    </p>
                  )}
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
                  { id: 'credentials', label: 'Credentials & Compliance', icon: <Shield className="w-5 h-5" /> },
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
                      value={userName}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      value={userEmail}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      value={userPhone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={!isEditing}
                      placeholder="City, State"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea 
                    rows={4}
                    value={bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
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
                  {isEditing ? (
                    <div className="space-y-2">
                      {specializationOptions.map((spec) => (
                        <label key={spec} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={specialties.includes(spec)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, specializations: [...specialties, spec] })
                              } else {
                                setFormData({ ...formData, specializations: specialties.filter((s: string) => s !== spec) })
                              }
                            }}
                            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{spec}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                  <div className="flex flex-wrap gap-2">
                      {specialties.length > 0 ? (
                        specialties.map((specialty: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {specialty}
                      </span>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No specialties added yet</p>
                      )}
                  </div>
                  )}
                </div>

                {/* Languages */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <h2 className="text-xl font-bold text-black mb-4">Languages</h2>
                  {isEditing ? (
                    <div className="space-y-2">
                      {Object.entries(languageMap).map(([code, name]) => (
                        <label key={code} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={languages.includes(code)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, spokenLanguages: [...languages, code] })
                              } else {
                                setFormData({ ...formData, spokenLanguages: languages.filter((l: string) => l !== code) })
                              }
                            }}
                            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">{name}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                  <div className="flex flex-wrap gap-2">
                      {languages.length > 0 ? (
                        languages.map((lang: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {languageMap[lang] || lang}
                      </span>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No languages added yet</p>
                      )}
                  </div>
                  )}
                </div>

                {/* Education */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-black">Education</h2>
                    {isEditing && (
                      <button
                        onClick={addEducation}
                        className="flex items-center space-x-2 text-sm text-black hover:text-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Education</span>
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {education.length > 0 ? (
                      education.map((edu: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                          <GraduationCap className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                          {isEditing ? (
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={edu.degree || ''}
                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                placeholder="Degree"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              />
                              <input
                                type="text"
                                value={edu.institution || ''}
                                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                placeholder="Institution"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              />
                              <input
                                type="number"
                                value={edu.year || ''}
                                onChange={(e) => updateEducation(index, 'year', parseInt(e.target.value) || new Date().getFullYear())}
                                placeholder="Year"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              />
                              <button
                                onClick={() => removeEducation(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div className="flex-1">
                              <h3 className="font-semibold text-black">{edu.degree || 'Degree'}</h3>
                              <p className="text-gray-600">{edu.institution || 'Institution'}</p>
                              <p className="text-sm text-gray-500">{edu.year || 'Year'}</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No education added yet</p>
                    )}
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-black">Certifications</h2>
                    {isEditing && (
                      <button
                        onClick={addCertification}
                        className="flex items-center space-x-2 text-sm text-black hover:text-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Certification</span>
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {certifications.length > 0 ? (
                      certifications.map((cert: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                          <Award className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                          {isEditing ? (
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={cert.name || ''}
                                onChange={(e) => updateCertification(index, 'name', e.target.value)}
                                placeholder="Certification Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              />
                              <input
                                type="text"
                                value={cert.issuer || ''}
                                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                                placeholder="Issuing Organization"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              />
                              <input
                                type="number"
                                value={cert.year || ''}
                                onChange={(e) => updateCertification(index, 'year', parseInt(e.target.value) || new Date().getFullYear())}
                                placeholder="Year"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              />
                              <button
                                onClick={() => removeCertification(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div className="flex-1">
                              <h3 className="font-semibold text-black">{cert.name || 'Certification'}</h3>
                              <p className="text-gray-600">{cert.issuer || 'Issuer'}</p>
                              <p className="text-sm text-gray-500">{cert.year || 'Year'}</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No certifications added yet</p>
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-black">Experience</h2>
                    {isEditing && (
                      <button
                        onClick={addWorkExperience}
                        className="flex items-center space-x-2 text-sm text-black hover:text-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Experience</span>
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {workExperience.length > 0 ? (
                      workExperience.map((exp: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                          <Briefcase className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                          {isEditing ? (
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={exp.position || ''}
                                onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                                placeholder="Position"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              />
                              <input
                                type="text"
                                value={exp.company || ''}
                                onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                                placeholder="Company"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="date"
                                  value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''}
                                  onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                                  placeholder="Start Date"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                <input
                                  type="date"
                                  value={exp.endDate && !exp.isCurrent ? new Date(exp.endDate).toISOString().split('T')[0] : ''}
                                  onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                                  placeholder="End Date"
                                  disabled={exp.isCurrent}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                                />
                              </div>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={exp.isCurrent || false}
                                  onChange={(e) => updateWorkExperience(index, 'isCurrent', e.target.checked)}
                                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">Current Position</span>
                              </label>
                              <textarea
                                value={exp.description || ''}
                                onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                                placeholder="Description"
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                              />
                              <button
                                onClick={() => removeWorkExperience(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <div className="flex-1">
                              <h3 className="font-semibold text-black">{exp.position || 'Position'}</h3>
                              <p className="text-gray-600">{exp.company || 'Company'}</p>
                              <p className="text-sm text-gray-500">
                                {exp.startDate 
                                  ? `${new Date(exp.startDate).toLocaleDateString()} - ${exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}`
                                  : 'Duration not specified'
                                }
                              </p>
                              {exp.description && (
                          <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No work experience added yet</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'credentials' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Clinical Role */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <h2 className="text-xl font-bold text-black mb-4">Clinical Role</h2>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">
                        {therapist.credentials === 'SLP' 
                          ? 'Speech-Language Pathologist (SLP – Fully Licensed)'
                          : 'Speech-Language Pathology Assistant (SLPA – Supervised Role)'}
                      </span>
                    </div>
                    {therapist.isVerified && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">Verified by Rooted Voices</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ASHA Certification (SLP Only) */}
                {therapist.credentials === 'SLP' && therapist.complianceDocuments?.ashaCertification && (
                  <div className="bg-white rounded-2xl premium-shadow p-6">
                    <h2 className="text-xl font-bold text-black mb-4">ASHA Certification</h2>
                    <div className="space-y-3">
                      {therapist.complianceDocuments.ashaCertification.certificationNumber && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Certification Number (CCC-SLP):</span>
                          <p className="text-gray-900 mt-1">{therapist.complianceDocuments.ashaCertification.certificationNumber}</p>
                        </div>
                      )}
                      {therapist.complianceDocuments.ashaCertification.expirationDate && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Expiration Date:</span>
                          <p className="text-gray-900 mt-1">{new Date(therapist.complianceDocuments.ashaCertification.expirationDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {therapist.complianceDocuments.ashaCertification.verified ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-yellow-600">
                          <Clock className="w-5 h-5" />
                          <span className="text-sm font-medium">Pending Verification</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* State Licensure */}
                {therapist.complianceDocuments?.stateLicensure && (
                  <div className="bg-white rounded-2xl premium-shadow p-6">
                    <h2 className="text-xl font-bold text-black mb-4">State Licensure</h2>
                    <div className="space-y-3">
                      {therapist.complianceDocuments.stateLicensure.licenseNumber && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">License Number:</span>
                          <p className="text-gray-900 mt-1">{therapist.complianceDocuments.stateLicensure.licenseNumber}</p>
                        </div>
                      )}
                      {therapist.complianceDocuments.stateLicensure.state && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Licensing State:</span>
                          <p className="text-gray-900 mt-1">{therapist.complianceDocuments.stateLicensure.state}</p>
                        </div>
                      )}
                      {therapist.complianceDocuments.stateLicensure.expirationDate && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Expiration Date:</span>
                          <p className="text-gray-900 mt-1">{new Date(therapist.complianceDocuments.stateLicensure.expirationDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {therapist.complianceDocuments.stateLicensure.verified ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-yellow-600">
                          <Clock className="w-5 h-5" />
                          <span className="text-sm font-medium">Pending Verification</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Supervision (SLPA Only) */}
                {therapist.credentials === 'SLPA' && therapist.complianceDocuments?.supervision && (
                  <div className="bg-white rounded-2xl premium-shadow p-6">
                    <h2 className="text-xl font-bold text-black mb-4">Supervision</h2>
                    <div className="space-y-3">
                      {therapist.complianceDocuments.supervision.supervisingSLPName && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Supervising SLP Name:</span>
                          <p className="text-gray-900 mt-1">{therapist.complianceDocuments.supervision.supervisingSLPName}</p>
                        </div>
                      )}
                      {therapist.complianceDocuments.supervision.supervisingSLPLicenseNumber && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Supervising SLP License Number:</span>
                          <p className="text-gray-900 mt-1">{therapist.complianceDocuments.supervision.supervisingSLPLicenseNumber}</p>
                        </div>
                      )}
                      {therapist.complianceDocuments.supervision.supervisingState && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Supervising State:</span>
                          <p className="text-gray-900 mt-1">{therapist.complianceDocuments.supervision.supervisingState}</p>
                        </div>
                      )}
                      {therapist.complianceDocuments.supervision.verified ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-yellow-600">
                          <Clock className="w-5 h-5" />
                          <span className="text-sm font-medium">Pending Verification</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Professional Liability Insurance */}
                {therapist.complianceDocuments?.professionalLiabilityInsurance && (
                  <div className="bg-white rounded-2xl premium-shadow p-6">
                    <h2 className="text-xl font-bold text-black mb-4">Professional Liability Insurance</h2>
                    <div className="space-y-3">
                      {therapist.complianceDocuments.professionalLiabilityInsurance.provider && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Provider:</span>
                          <p className="text-gray-900 mt-1">{therapist.complianceDocuments.professionalLiabilityInsurance.provider}</p>
                        </div>
                      )}
                      {therapist.complianceDocuments.professionalLiabilityInsurance.policyNumber && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Policy Number:</span>
                          <p className="text-gray-900 mt-1">{therapist.complianceDocuments.professionalLiabilityInsurance.policyNumber}</p>
                        </div>
                      )}
                      {therapist.complianceDocuments.professionalLiabilityInsurance.coverageAmount && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Coverage Amount:</span>
                          <p className="text-gray-900 mt-1">{therapist.complianceDocuments.professionalLiabilityInsurance.coverageAmount}</p>
                        </div>
                      )}
                      {therapist.complianceDocuments.professionalLiabilityInsurance.expirationDate && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Expiration Date:</span>
                          <p className="text-gray-900 mt-1">{new Date(therapist.complianceDocuments.professionalLiabilityInsurance.expirationDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {therapist.complianceDocuments.professionalLiabilityInsurance.verified ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-yellow-600">
                          <Clock className="w-5 h-5" />
                          <span className="text-sm font-medium">Pending Verification</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Background Check */}
                {therapist.complianceDocuments?.backgroundCheck && (
                  <div className="bg-white rounded-2xl premium-shadow p-6">
                    <h2 className="text-xl font-bold text-black mb-4">Background Check / Child Safety Clearance</h2>
                    <div className="space-y-3">
                      {therapist.complianceDocuments.backgroundCheck.clearanceNumber && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Clearance Number:</span>
                          <p className="text-gray-900 mt-1">{therapist.complianceDocuments.backgroundCheck.clearanceNumber}</p>
                        </div>
                      )}
                      {therapist.complianceDocuments.backgroundCheck.state && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">State:</span>
                          <p className="text-gray-900 mt-1">{therapist.complianceDocuments.backgroundCheck.state}</p>
                        </div>
                      )}
                      {therapist.complianceDocuments.backgroundCheck.expirationDate && (
                        <div>
                          <span className="text-sm font-medium text-gray-600">Expiration Date:</span>
                          <p className="text-gray-900 mt-1">{new Date(therapist.complianceDocuments.backgroundCheck.expirationDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      {therapist.complianceDocuments.backgroundCheck.verified ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-yellow-600">
                          <Clock className="w-5 h-5" />
                          <span className="text-sm font-medium">Pending Verification</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h3 className="text-lg font-bold text-black mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/sessions" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Update Availability</span>
                </Link>
                <Link href="/resources" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Upload Resources</span>
                </Link>
                <Link href="/messages" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-black">View Messages</span>
                </Link>
                <Link href="/payments" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Payment Settings</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
