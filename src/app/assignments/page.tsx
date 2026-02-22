'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { assignmentAPI, clientAPI } from '@/lib/api'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import AssignmentCreateModal from '@/components/AssignmentCreateModal'
import AssignmentFeedbackModal from '@/components/AssignmentFeedbackModal'
import {
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  FileText,
  Download,
  Edit,
  Trash2,
  MessageSquare,
} from 'lucide-react'

export default function AssignmentsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [assignments, setAssignments] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'overdue'>('all')
  const [filterClient, setFilterClient] = useState('all')

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (user?.role !== 'therapist') {
      router.push('/client-dashboard')
      return
    }

    fetchData()
  }, [isAuthenticated, user, authLoading])

  const fetchData = async () => {
    try {
      setIsLoading(true)

      // Fetch assignments
      const assignmentsRes = await assignmentAPI.getAll()
      setAssignments(assignmentsRes.data.data || [])

      // Fetch clients
      const clientsRes = await clientAPI.getAll()
      setClients(clientsRes.data.data || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) {
      return
    }

    try {
      await assignmentAPI.delete(assignmentId)
      alert('Assignment deleted successfully')
      fetchData()
    } catch (error: any) {
      alert('Failed to delete assignment: ' + (error.response?.data?.message || 'Unknown error'))
    }
  }

  const filteredAssignments = assignments.filter((assignment) => {
    // Status filter
    if (filterStatus === 'completed' && !assignment.completed) return false
    if (filterStatus === 'pending' && (assignment.completed || new Date(assignment.dueDate) < new Date())) return false
    if (filterStatus === 'overdue' && (assignment.completed || new Date(assignment.dueDate) >= new Date())) return false

    // Client filter
    if (filterClient !== 'all' && assignment.clientId?._id !== filterClient) return false

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!assignment.title?.toLowerCase().includes(query) &&
          !assignment.description?.toLowerCase().includes(query)) {
        return false
      }
    }

    return true
  })

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['therapist']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assignments...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['therapist']}>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-black mb-2">Assignments</h1>
                <p className="text-gray-600">Manage homework and assignments for your clients</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Assignment</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search assignments..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>

              {/* Client Filter */}
              <select
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">All Clients</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.userId
                      ? `${client.userId.firstName} ${client.userId.lastName}`
                      : 'Unknown'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignments List */}
          <div className="space-y-4">
            {filteredAssignments.length === 0 ? (
              <div className="bg-white rounded-2xl premium-shadow p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No assignments found</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Create your first assignment
                </button>
              </div>
            ) : (
              filteredAssignments.map((assignment) => {
                const isOverdue = !assignment.completed && new Date(assignment.dueDate) < new Date()
                const dueDate = new Date(assignment.dueDate)
                const clientName = assignment.clientId?.userId
                  ? `${assignment.clientId.userId.firstName} ${assignment.clientId.userId.lastName}`
                  : 'Unknown Client'

                return (
                  <div
                    key={assignment._id}
                    className={`bg-white rounded-2xl premium-shadow p-6 ${
                      assignment.completed
                        ? 'border-l-4 border-green-500'
                        : isOverdue
                        ? 'border-l-4 border-red-500'
                        : 'border-l-4 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {assignment.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : isOverdue ? (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-600" />
                          )}
                          <h3 className="text-lg font-semibold text-black">{assignment.title}</h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs capitalize">
                            {assignment.type?.replace('-', ' ')}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-3">{assignment.description}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">Client:</span>
                            <span>{clientName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">Due:</span>
                            <span>
                              {dueDate.toLocaleDateString()} {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {assignment.completed && assignment.completedAt && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Completed {new Date(assignment.completedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>

                        {assignment.instructions && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700">
                              <strong>Instructions:</strong> {assignment.instructions}
                            </p>
                          </div>
                        )}

                        {assignment.attachments && assignment.attachments.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                            <div className="flex flex-wrap gap-2">
                              {assignment.attachments.map((attachment: any, index: number) => (
                                <a
                                  key={index}
                                  href={attachment.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                >
                                  <FileText className="w-4 h-4" />
                                  <span>{attachment.fileName}</span>
                                  <Download className="w-3 h-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {assignment.feedback && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-blue-900">Your Feedback:</p>
                              {assignment.rating && (
                                <div className="flex items-center space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= assignment.rating
                                          ? 'text-yellow-500 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-blue-800">{assignment.feedback}</p>
                            {assignment.feedbackDate && (
                              <p className="text-xs text-blue-600 mt-1">
                                {new Date(assignment.feedbackDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!assignment.feedback && (
                          <button
                            onClick={() => {
                              setSelectedAssignment(assignment)
                              setShowFeedbackModal(true)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Add Feedback"
                          >
                            <MessageSquare className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(assignment._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Assignment"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Modals */}
        {showCreateModal && (
          <AssignmentCreateModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              fetchData()
              setShowCreateModal(false)
            }}
          />
        )}

        {showFeedbackModal && selectedAssignment && (
          <AssignmentFeedbackModal
            isOpen={showFeedbackModal}
            onClose={() => {
              setShowFeedbackModal(false)
              setSelectedAssignment(null)
            }}
            onSuccess={() => {
              fetchData()
              setShowFeedbackModal(false)
              setSelectedAssignment(null)
            }}
            assignmentId={selectedAssignment._id}
            currentFeedback={selectedAssignment.feedback}
            currentRating={selectedAssignment.rating}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}

