'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { clientAPI } from '@/lib/api'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import DocumentLibrary from '@/components/DocumentLibrary'
import TherapyTimeline from '@/components/TherapyTimeline'
import AssignmentTracking from '@/components/AssignmentTracking'
import AssignmentCreateModal from '@/components/AssignmentCreateModal'
import {
  User,
  FileText,
  Calendar,
  MessageCircle,
  ArrowLeft,
  Plus,
  BookOpen,
} from 'lucide-react'
import Link from 'next/link'

export default function ClientViewPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [client, setClient] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('documents')
  const [timelineEvents, setTimelineEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'therapist') {
      router.push('/login')
      return
    }

    fetchClientData()
  }, [isAuthenticated, user, params.id])

  const fetchClientData = async () => {
    try {
      setIsLoading(true)
      const clientRes = await clientAPI.getById(params.id as string)
      setClient(clientRes.data.data)

      // Get timeline
      try {
        const timelineRes = await clientAPI.getTherapyTimeline(params.id as string)
        setTimelineEvents(timelineRes.data.data.timeline || [])
      } catch (error) {
        console.log('Could not fetch timeline')
      }
    } catch (error) {
      console.error('Failed to fetch client:', error)
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['therapist']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading client data...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!client) {
    return (
      <ProtectedRoute allowedRoles={['therapist']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Client not found</p>
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const clientName = client.userId
    ? `${client.userId.firstName} ${client.userId.lastName}`
    : 'Client'

  return (
    <ProtectedRoute allowedRoles={['therapist']}>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-black transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">{clientName}</h1>
                <p className="text-gray-600">
                  Client Profile & Documents
                </p>
              </div>
              {activeTab === 'assignments' && (
                <button
                  onClick={() => setShowAssignmentModal(true)}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Assignment</span>
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <nav className="flex space-x-4">
              {[
                { id: 'documents', label: 'Document Library', icon: <FileText className="w-5 h-5" /> },
                { id: 'assignments', label: 'Assignments', icon: <BookOpen className="w-5 h-5" /> },
                { id: 'timeline', label: 'Therapy Timeline', icon: <Calendar className="w-5 h-5" /> },
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
          {activeTab === 'documents' && (
            <DocumentLibrary
              clientId={params.id as string}
              clientName={clientName}
            />
          )}

          {activeTab === 'assignments' && (
            <AssignmentTracking
              clientId={params.id as string}
            />
          )}

          {activeTab === 'timeline' && (
            <TherapyTimeline
              clientId={params.id as string}
              events={timelineEvents}
            />
          )}
        </div>

        {/* Assignment Create Modal */}
        {showAssignmentModal && (
          <AssignmentCreateModal
            isOpen={showAssignmentModal}
            onClose={() => setShowAssignmentModal(false)}
            onSuccess={() => {
              // Refresh assignments
              setShowAssignmentModal(false)
            }}
            clientId={params.id as string}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}

