'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Users, Video, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { familyCoachingAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
// Using native Date instead of dayjs

interface FamilyCoachingListProps {
  clientId?: string
  therapistId?: string
  onSessionClick?: (session: any) => void
}

export default function FamilyCoachingList({
  clientId,
  therapistId,
  onSessionClick,
}: FamilyCoachingListProps) {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'completed'>('all')

  useEffect(() => {
    fetchSessions()
  }, [clientId, therapistId, filter])

  const fetchSessions = async () => {
    try {
      setIsLoading(true)
      const params: any = {}
      if (filter !== 'all') {
        const now = new Date()
        if (filter === 'upcoming') {
          params.startDate = now.toISOString()
        } else if (filter === 'past') {
          params.endDate = now.toISOString()
        }
      }
      
      const response = await familyCoachingAPI.getSessions(params)
      setSessions(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async (sessionId: string) => {
    if (!confirm('Are you sure you want to cancel this session?')) {
      return
    }

    try {
      await familyCoachingAPI.cancelSession(sessionId, 'Cancelled by user')
      fetchSessions()
    } catch (error: any) {
      alert('Failed to cancel session: ' + (error.response?.data?.message || 'Unknown error'))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true
    if (filter === 'completed') return session.status === 'completed'
    if (filter === 'upcoming') {
      const sessionDate = new Date(session.scheduledDate)
      return sessionDate >= new Date() && session.status !== 'completed' && session.status !== 'cancelled'
    }
    if (filter === 'past') {
      const sessionDate = new Date(session.scheduledDate)
      return sessionDate < new Date()
    }
    return true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center space-x-2">
        {(['all', 'upcoming', 'past', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No family coaching sessions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const sessionDate = new Date(session.scheduledDate)
            const isPast = sessionDate < new Date()
            const isUpcoming = sessionDate >= new Date() && session.status !== 'completed' && session.status !== 'cancelled'

            return (
              <div
                key={session._id}
                className="bg-white rounded-xl premium-shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onSessionClick?.(session)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-black">
                        {session.sessionType === 'family-coaching'
                          ? 'Family Coaching'
                          : session.sessionType === 'caregiver-training'
                          ? 'Caregiver Training'
                          : 'Support Session'}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{sessionDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{session.scheduledTime}</span>
                        <span className="text-gray-400">({session.duration} min)</span>
                      </div>
                      {session.participants && session.participants.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{session.participants.length} participant(s)</span>
                        </div>
                      )}
                      {session.therapistId?.userId && (
                        <div className="flex items-center space-x-2">
                          <span>
                            Therapist: {session.therapistId.userId.firstName} {session.therapistId.userId.lastName}
                          </span>
                        </div>
                      )}
                    </div>

                    {session.topics && session.topics.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Topics:</p>
                        <div className="flex flex-wrap gap-2">
                          {session.topics.map((topic: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {session.goals && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Goals:</p>
                        <p className="text-sm text-gray-600">{session.goals}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {isUpcoming && session.meetingLink && (
                      <a
                        href={session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="Join Session"
                      >
                        <Video className="w-4 h-4" />
                      </a>
                    )}
                    {isUpcoming && user?.role === 'therapist' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle edit
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Session"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCancel(session._id)
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Cancel Session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

