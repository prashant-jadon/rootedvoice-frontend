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
  X,
  FileText,
  Upload,
  UserX,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { clientAPI, therapistAPI, sessionAPI, assignmentAPI, calendarAPI, familyCoachingAPI, subscriptionAPI } from '@/lib/api'
import CalendarSync from '@/components/CalendarSync'
import DocumentUpload from '@/components/DocumentUpload'
import DocumentsTab from '@/components/DocumentsTab'
import TherapyTimeline from '@/components/TherapyTimeline'
import AssignmentTracking from '@/components/AssignmentTracking'
import ReminderPreferences from '@/components/ReminderPreferences'
import FamilyCoachingScheduler from '@/components/FamilyCoachingScheduler'
import FamilyCoachingList from '@/components/FamilyCoachingList'

export default function ClientProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const t = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [isLoading, setIsLoading] = useState(true)
  
  // Real data from API
  const [clientProfile, setClientProfile] = useState<any>(null)
  const [therapist, setTherapist] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [timelineEvents, setTimelineEvents] = useState<any[]>([])
  const [subscription, setSubscription] = useState<any>(null)
  const [showCoachingScheduler, setShowCoachingScheduler] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'client') {
      router.push('/login')
      return
    }
    
    fetchClientData()
  }, [isAuthenticated, user, authLoading])

  const fetchClientData = async () => {
    try {
      setIsLoading(true)

      // Get client profile
      const clientRes = await clientAPI.getMyProfile()
      setClientProfile(clientRes.data.data)

      // Get assigned therapist if exists
      if (clientRes.data.data.assignedTherapist) {
        const therapistId = typeof clientRes.data.data.assignedTherapist === 'string' 
          ? clientRes.data.data.assignedTherapist 
          : clientRes.data.data.assignedTherapist._id

        if (therapistId) {
          try {
            const therapistRes = await therapistAPI.getById(therapistId)
            setTherapist(therapistRes.data.data.therapist)
          } catch (error) {
            console.log('Could not fetch therapist details')
          }
        }
      }

      // Get sessions for stats
      const sessionsRes = await sessionAPI.getAll()
      setSessions(sessionsRes.data.data.sessions || [])

      // Get assignments
      try {
        const assignmentsRes = await assignmentAPI.getAll()
        setAssignments(assignmentsRes.data.data || [])
      } catch (error) {
        console.log('Could not fetch assignments')
      }

      // Get documents
      try {
        const documentsRes = await clientAPI.getDocuments(clientRes.data.data._id)
        setDocuments(documentsRes.data.data || [])
      } catch (error) {
        console.log('Could not fetch documents')
      }

      // Get therapy timeline
      try {
        const timelineRes = await clientAPI.getTherapyTimeline(clientRes.data.data._id)
        setTimelineEvents(timelineRes.data.data.timeline || [])
      } catch (error) {
        console.log('Could not fetch timeline')
      }

      // Get subscription to check for Flourish tier
      try {
        const subscriptionRes = await subscriptionAPI.getCurrent()
        setSubscription(subscriptionRes.data.data)
      } catch (error) {
        console.log('Could not fetch subscription')
      }

    } catch (error) {
      console.error('Failed to fetch client data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnassignTherapist = async () => {
    if (!confirm('Are you sure you want to change your therapist? This will remove your current therapist assignment.')) {
      return
    }

    try {
      // Call API to unassign therapist
      await clientAPI.createOrUpdate({
        ...clientProfile,
        assignedTherapist: null
      })
      
      setTherapist(null)
      alert('Therapist unassigned successfully. You can now browse and select a new therapist.')
      router.push('/meet-our-therapists')
    } catch (error: any) {
      alert('Failed to unassign therapist: ' + (error.response?.data?.message || 'Unknown error'))
    }
  }

  if (isLoading || !clientProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  const completedSessions = sessions.filter(s => s.status === 'completed').length
  const upcomingSessions = sessions.filter(s => s.status === 'scheduled' || s.status === 'confirmed').length
  const userFullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  const userInitials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/client-dashboard" className="flex items-center">
                <img 
                  src="/logorooted 1.png" 
                  alt="Rooted Voices Speech & Language Therapy" 
                   className="w-18 h-20 mr-2"
                />
                <span className="text-2xl font-bold text-black">Rooted Voices</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-black transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{userInitials}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">{userFullName}</p>
                  <p className="text-xs text-gray-600">Client</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                <span>{isEditing ? t('clientProfile.saveChanges') : t('clientProfile.editProfile')}</span>
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
                <span className="text-2xl font-bold text-white">{userInitials}</span>
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
                  <h1 className="text-3xl font-bold text-black mb-2">{userFullName}</h1>
                  <p className="text-lg text-gray-600 mb-4">Speech Therapy Client</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{user?.email || 'N/A'}</span>
                    </div>
                    {clientProfile.userId?.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{clientProfile.userId.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{t('common.joined', 'Joined')} {new Date(clientProfile.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Assigned Therapist Section */}
                  {therapist ? (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-800 mb-1">{t('clientProfile.therapist.yourTherapist')}</p>
                          <p className="font-semibold text-green-900">
                            Dr. {therapist.userId?.firstName} {therapist.userId?.lastName}
                          </p>
                          <p className="text-xs text-green-700">{therapist.userId?.email}</p>
                        </div>
                        <button
                          onClick={handleUnassignTherapist}
                          className="text-green-700 hover:text-green-900 flex items-center space-x-1 text-sm"
                        >
                          <UserX className="w-4 h-4" />
                          <span>{t('clientProfile.therapist.changeTherapist')}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 mb-2">{t('clientProfile.therapist.notAssigned')}</p>
                      <Link 
                        href="/meet-our-therapists"
                        className="text-yellow-900 font-semibold underline hover:text-yellow-700"
                      >
                        {t('clientProfile.therapist.browseTherapists')}
                      </Link>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-2xl font-bold text-black">{completedSessions}</span>
                      </div>
                      <p className="text-sm text-gray-600">{t('clientProfile.stats.completedSessions')}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <Calendar className="w-5 h-5" />
                        <span className="text-2xl font-bold text-black">{upcomingSessions}</span>
                      </div>
                      <p className="text-sm text-gray-600">{t('clientProfile.stats.upcomingSessions')}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-1">
                        <Target className="w-5 h-5" />
                        <span className="text-2xl font-bold text-black">{sessions.length}</span>
                      </div>
                      <p className="text-sm text-gray-600">{t('clientProfile.stats.totalSessions')}</p>
                    </div>
                  </div>
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
                  { id: 'personal', label: t('clientProfile.tabs.personal'), icon: <User className="w-5 h-5" /> },
                  { id: 'intake', label: t('clientProfile.tabs.intake'), icon: <FileText className="w-5 h-5" /> },
                  { id: 'sessions', label: t('clientProfile.tabs.sessions'), icon: <Calendar className="w-5 h-5" /> },
                  { id: 'documents', label: t('clientProfile.tabs.documents'), icon: <FileText className="w-5 h-5" /> },
                  { id: 'assignments', label: t('clientProfile.tabs.assignments'), icon: <FileText className="w-5 h-5" /> },
                  ...(subscription?.tier === 'flourish' ? [{ id: 'family-coaching', label: t('clientProfile.tabs.familyCoaching'), icon: <Heart className="w-5 h-5" /> }] : []),
                  { id: 'preferences', label: t('clientProfile.tabs.preferences'), icon: <Settings className="w-5 h-5" /> }
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
                <h2 className="text-xl font-bold text-black mb-6">{t('clientProfile.personalInfo.title')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('clientProfile.personalInfo.firstName')}</label>
                    <input 
                      type="text" 
                      defaultValue={user?.firstName || ''}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('clientProfile.personalInfo.lastName')}</label>
                    <input 
                      type="text" 
                      defaultValue={user?.lastName || ''}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('clientProfile.personalInfo.email')}</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email || ''}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('clientProfile.personalInfo.phone')}</label>
                    <input 
                      type="tel" 
                      defaultValue={clientProfile.userId?.phone || ''}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('clientProfile.personalInfo.dateOfBirth')}</label>
                    <input 
                      type="date" 
                      defaultValue={clientProfile.dateOfBirth ? new Date(clientProfile.dateOfBirth).toISOString().split('T')[0] : ''}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('clientProfile.personalInfo.guardianName')}</label>
                    <input 
                      type="text" 
                      defaultValue={clientProfile.guardianName || 'N/A'}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'intake' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl premium-shadow p-6"
              >
                  <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-black">{t('clientProfile.intake.title')}</h2>
                  {clientProfile?.intake?.intakeCompleted ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>{t('clientProfile.intake.completed')}</span>
                    </span>
                  ) : (
                    <Link
                      href="/client-intake"
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                    >
                      {t('clientProfile.intake.completeIntake')}
                    </Link>
                  )}
                </div>

                {clientProfile?.intake?.intakeCompleted ? (
                  <div className="space-y-6">
                    {/* Client Type */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">{t('clientProfile.intake.clientType')}</h3>
                      <p className="text-black capitalize">{clientProfile.intake.clientType || t('clientProfile.intake.notSpecified')}</p>
                    </div>

                    {/* Primary Concerns */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">{t('clientProfile.intake.primaryConcerns')}</h3>
                      <p className="text-black whitespace-pre-line">{clientProfile.intake.primaryConcerns || t('clientProfile.intake.notProvided')}</p>
                    </div>

                    {/* Communication Concerns */}
                    {clientProfile.intake.communicationConcerns && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-2">{t('clientProfile.intake.communicationConcerns')}</h3>
                        <p className="text-black whitespace-pre-line">{clientProfile.intake.communicationConcerns}</p>
                      </div>
                    )}

                    {/* State of Residence */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">{t('clientProfile.intake.stateOfResidence')}</h3>
                      <p className="text-black">{clientProfile.intake.stateOfResidence || t('clientProfile.intake.notProvided')}</p>
                    </div>

                    {/* Telehealth Consent */}
                    <div className="border-t pt-6">
                      <h3 className="text-sm font-medium text-gray-600 mb-4">{t('clientProfile.intake.telehealthConsent')}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {clientProfile.intake.telehealthConsent?.consented ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                          <span className="text-sm text-gray-700">{t('clientProfile.intake.consentToTelehealth')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {clientProfile.intake.telehealthConsent?.understandsTechnology ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                          <span className="text-sm text-gray-700">{t('clientProfile.intake.understandsTechnology')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {clientProfile.intake.telehealthConsent?.understandsPrivacy ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                          <span className="text-sm text-gray-700">{t('clientProfile.intake.understandsPrivacy')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {clientProfile.intake.telehealthConsent?.understandsLimitations ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                          <span className="text-sm text-gray-700">{t('clientProfile.intake.understandsLimitations')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {clientProfile.intake.telehealthConsent?.emergencyContactProvided ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                          <span className="text-sm text-gray-700">{t('clientProfile.intake.emergencyContactProvided')}</span>
                        </div>
                        {clientProfile.intake.telehealthConsent?.consentSignature && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-gray-600">{t('clientProfile.intake.signedBy')}: <span className="font-medium text-black">{clientProfile.intake.telehealthConsent.consentSignature}</span></p>
                            <p className="text-sm text-gray-600">{t('clientProfile.intake.relationship')}: <span className="font-medium text-black">{clientProfile.intake.telehealthConsent.relationshipToClient}</span></p>
                            {clientProfile.intake.telehealthConsent.consentDate && (
                              <p className="text-sm text-gray-600">{t('clientProfile.intake.date')}: <span className="font-medium text-black">{new Date(clientProfile.intake.telehealthConsent.consentDate).toLocaleDateString()}</span></p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Notes */}
                    {clientProfile.intake.additionalNotes && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-2">{t('clientProfile.intake.additionalNotes')}</h3>
                        <p className="text-black whitespace-pre-line">{clientProfile.intake.additionalNotes}</p>
                      </div>
                    )}

                    {/* Completion Date */}
                    {clientProfile.intake.completedAt && (
                      <div className="pt-4 border-t">
                        <p className="text-xs text-gray-500">
                          {t('clientProfile.intake.completedOn')} {new Date(clientProfile.intake.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-black mb-2">{t('clientProfile.intake.notCompleted')}</h3>
                    <p className="text-gray-600 mb-6">
                      {t('clientProfile.intake.notCompletedDesc')}
                    </p>
                    <Link
                      href="/client-intake"
                      className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <span>{t('clientProfile.intake.completeIntakeForm')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'sessions' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl premium-shadow p-6"
              >
                <h2 className="text-xl font-bold text-black mb-6">{t('clientProfile.sessions.title')}</h2>
                
                {sessions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{t('clientProfile.sessions.noSessions')}</p>
                    <Link href="/meet-our-therapists" className="text-blue-600 hover:underline mt-2 block">
                      {t('clientProfile.sessions.bookFirstSession')}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-black capitalize">{session.sessionType} {t('clientProfile.sessions.sessionType')}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(session.scheduledDate).toLocaleDateString()} at {session.scheduledTime}
                            </p>
                            <p className="text-sm text-gray-600">{t('clientProfile.sessions.duration')}: {session.duration} {t('clientProfile.sessions.minutes')}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              session.status === 'completed' ? 'bg-green-100 text-green-800' :
                              session.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              session.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {t(`clientProfile.sessions.status.${session.status}`) || session.status}
                            </span>
                            {(session.status === 'confirmed' || session.status === 'scheduled') && (
                              <Link 
                                href={`/video-call?session=${session._id}`}
                                className="mt-2 block text-blue-600 hover:underline text-sm"
                              >
                                {t('clientProfile.sessions.joinSession')}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'documents' && (
              <DocumentsTab
                clientProfile={clientProfile}
                documents={documents}
                timelineEvents={timelineEvents}
                onUploadClick={() => setShowUploadModal(true)}
                onRefresh={fetchClientData}
              />
            )}

            {activeTab === 'assignments' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <h2 className="text-xl font-bold text-black mb-6">{t('clientProfile.assignments.title')}</h2>
                  
                  {assignments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>{t('clientProfile.assignments.noAssignments')}</p>
                      <p className="text-sm mt-2">{t('clientProfile.assignments.yourTherapistWillAssign')}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {assignments.map((assignment) => {
                        const isOverdue = !assignment.completed && new Date(assignment.dueDate) < new Date();
                        const dueDate = new Date(assignment.dueDate);
                        
                        return (
                          <div
                            key={assignment._id}
                            className={`border rounded-lg p-4 ${
                              assignment.completed
                                ? 'border-green-200 bg-green-50'
                                : isOverdue
                                ? 'border-red-200 bg-red-50'
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {assignment.completed ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <Clock className={`w-5 h-5 ${isOverdue ? 'text-red-600' : 'text-gray-400'}`} />
                                  )}
                                  <h4 className="font-semibold text-black">{assignment.title}</h4>
                                  {assignment.type && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs capitalize">
                                      {assignment.type.replace('-', ' ')}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                                  <span>{t('clientProfile.assignments.dueDate')}: {dueDate.toLocaleDateString()} {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  {assignment.completed && assignment.completedAt && (
                                    <span className="text-green-600">
                                      {t('clientProfile.assignments.completed')}: {new Date(assignment.completedAt).toLocaleDateString()}
                                    </span>
                                  )}
                                  {isOverdue && (
                                    <span className="text-red-600 font-medium">{t('clientProfile.assignments.overdue')}</span>
                                  )}
                                </div>
                                {assignment.instructions && (
                                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700 mb-2">
                                    <strong>{t('common.instructions', 'Instructions')}:</strong> {assignment.instructions}
                                  </div>
                                )}
                                {assignment.attachments && assignment.attachments.length > 0 && (
                                  <div className="mb-2">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Attachments:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {assignment.attachments.map((attachment: any, index: number) => (
                                        <a
                                          key={index}
                                          href={attachment.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100 transition-colors"
                                        >
                                          <FileText className="w-3 h-3" />
                                          <span>{attachment.fileName}</span>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {assignment.feedback && (
                                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                                    <strong className="text-blue-900">Therapist Feedback:</strong>
                                    <p className="text-blue-800 mt-1">{assignment.feedback}</p>
                                    {assignment.rating && (
                                      <div className="mt-1 flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span className="text-blue-900">{assignment.rating}/5</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {!assignment.completed && (
                                <button
                                  onClick={async () => {
                                    try {
                                      await assignmentAPI.update(assignment._id, { completed: true });
                                      await fetchClientData();
                                    } catch (error: any) {
                                      alert('Failed to mark as complete: ' + (error.response?.data?.message || 'Unknown error'));
                                    }
                                  }}
                                  className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                >
                                  {t('clientProfile.assignments.markAsComplete')}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Assignment Tracking Visualization */}
                <AssignmentTracking clientId={clientProfile._id} />
              </motion.div>
            )}

            {activeTab === 'family-coaching' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {subscription?.tier === 'flourish' ? (
                  <>
                    <div className="bg-white rounded-2xl premium-shadow p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-bold text-black">{t('clientProfile.familyCoaching.title')}</h2>
                          <p className="text-sm text-gray-600 mt-1">
                            {t('clientProfile.familyCoaching.noSessions')}
                          </p>
                        </div>
                        <button
                          onClick={() => setShowCoachingScheduler(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>{t('clientProfile.familyCoaching.scheduleSession')}</span>
                        </button>
                      </div>
                      
                      <FamilyCoachingList clientId={clientProfile._id} />
                    </div>

                    {showCoachingScheduler && (
                      <div className="bg-white rounded-2xl premium-shadow p-6 mt-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-bold text-black">{t('clientProfile.familyCoaching.scheduleSession')}</h3>
                          <button
                            onClick={() => setShowCoachingScheduler(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <FamilyCoachingScheduler
                          clientId={clientProfile._id}
                          onCancel={() => setShowCoachingScheduler(false)}
                          onSuccess={() => {
                            setShowCoachingScheduler(false)
                            fetchClientData()
                          }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-2xl premium-shadow p-6">
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-black mb-2">{t('clientProfile.familyCoaching.title')}</h2>
                      <p className="text-gray-600 mb-6">
                        {t('clientProfile.familyCoaching.noSessions')}
                      </p>
                      <Link
                        href="/pricing"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Award className="w-5 h-5" />
                        <span>Upgrade to Flourish Tier</span>
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Reminder Preferences */}
                <ReminderPreferences
                  clientId={clientProfile._id}
                  currentPreferences={clientProfile.preferences?.sessionReminders}
                  onUpdate={fetchClientData}
                />

                {/* Session Preferences */}
                <div className="bg-white rounded-2xl premium-shadow p-6">
                  <h2 className="text-xl font-bold text-black mb-6">{t('clientProfile.preferences.title')}</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('clientProfile.preferences.sessionReminders', 'Preferred Session Time')}</label>
                      <select 
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                      >
                        <option>Morning (9 AM - 12 PM)</option>
                        <option>Afternoon (12 PM - 5 PM)</option>
                        <option>Evening (5 PM - 8 PM)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('clientProfile.preferences.sessionLength', 'Session Length')}</label>
                      <select 
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                      >
                        <option>30 minutes</option>
                        <option>45 minutes</option>
                        <option>60 minutes</option>
                      </select>
                    </div>
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
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h3 className="text-lg font-bold text-black mb-4">{t('common.quickActions', 'Quick Actions')}</h3>
              <div className="space-y-3">
                <Link href="/client-dashboard" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-black">{t('nav.dashboard')}</span>
                </Link>
                <Link href="/meet-our-therapists" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-black">{t('dashboard.bookSession')}</span>
                </Link>
                <Link href="/pricing" className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-black">{t('nav.pricing')}</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Document Upload Modal */}
      {showUploadModal && clientProfile && (
        <DocumentUpload
          clientId={clientProfile._id}
          onUploadSuccess={() => {
            // Refresh documents
            clientAPI.getDocuments(clientProfile._id)
              .then((res) => setDocuments(res.data.data || []))
              .catch(console.error)
          }}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  )
}
