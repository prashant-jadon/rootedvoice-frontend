'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  FileText,
} from 'lucide-react'
import { assignmentAPI } from '@/lib/api'

interface AssignmentTrackingProps {
  clientId?: string
  therapistId?: string
}

export default function AssignmentTracking({
  clientId,
  therapistId,
}: AssignmentTrackingProps) {
  const [assignments, setAssignments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'overdue'>('all')

  useEffect(() => {
    fetchAssignments()
  }, [clientId, therapistId])

  const fetchAssignments = async () => {
    try {
      setIsLoading(true)
      const params: any = {}
      if (clientId) params.clientId = clientId
      if (therapistId) params.therapistId = therapistId

      const response = await assignmentAPI.getAll(params)
      setAssignments(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch assignments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === 'completed') return assignment.completed
    if (filter === 'pending') return !assignment.completed && new Date(assignment.dueDate) >= new Date()
    if (filter === 'overdue') return !assignment.completed && new Date(assignment.dueDate) < new Date()
    return true
  })

  const stats = {
    total: assignments.length,
    completed: assignments.filter((a) => a.completed).length,
    pending: assignments.filter((a) => !a.completed && new Date(a.dueDate) >= new Date()).length,
    overdue: assignments.filter((a) => !a.completed && new Date(a.dueDate) < new Date()).length,
  }

  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl premium-shadow p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl premium-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-black">Assignment Tracking</h2>
        <div className="flex space-x-2">
          {(['all', 'pending', 'completed', 'overdue'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-black">{stats.total}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Completed</span>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-black">{stats.completed}</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending</span>
            <Clock className="w-4 h-4 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-black">{stats.pending}</p>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Overdue</span>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-black">{stats.overdue}</p>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Completion Rate</span>
          <span className="text-sm font-bold text-black">{completionRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-3">
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No assignments found</p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => {
            const isOverdue = !assignment.completed && new Date(assignment.dueDate) < new Date()
            const dueDate = new Date(assignment.dueDate)

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
                      ) : isOverdue ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      )}
                      <h4 className="font-semibold text-black">{assignment.title}</h4>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs capitalize">
                        {assignment.type?.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Due: {dueDate.toLocaleDateString()} {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {assignment.completed && assignment.completedAt && (
                        <span className="text-green-600">
                          Completed: {new Date(assignment.completedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

