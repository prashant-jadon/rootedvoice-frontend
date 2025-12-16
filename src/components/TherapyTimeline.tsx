'use client'

import { useState } from 'react'
import {
  Calendar,
  FileText,
  Video,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import Link from 'next/link'

interface TimelineEvent {
  type: 'session' | 'document' | 'assignment' | 'milestone'
  date: string
  title: string
  description?: string
  status?: string
  id: string
  link?: string
  metadata?: any
}

interface TherapyTimelineProps {
  clientId: string
  events: TimelineEvent[]
}

export default function TherapyTimeline({ clientId, events }: TherapyTimelineProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())

  const toggleEvent = (id: string) => {
    const newExpanded = new Set(expandedEvents)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedEvents(newExpanded)
  }

  const getEventIcon = (type: string, status?: string) => {
    switch (type) {
      case 'session':
        if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-600" />
        if (status === 'cancelled') return <XCircle className="w-5 h-5 text-red-600" />
        return <Video className="w-5 h-5 text-blue-600" />
      case 'document':
        return <FileText className="w-5 h-5 text-purple-600" />
      case 'assignment':
        return <FileText className="w-5 h-5 text-orange-600" />
      case 'milestone':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />
    }
  }

  const getEventColor = (type: string, status?: string) => {
    switch (type) {
      case 'session':
        if (status === 'completed') return 'bg-green-100 border-green-300'
        if (status === 'cancelled') return 'bg-red-100 border-red-300'
        return 'bg-blue-100 border-blue-300'
      case 'document':
        return 'bg-purple-100 border-purple-300'
      case 'assignment':
        return 'bg-orange-100 border-orange-300'
      case 'milestone':
        return 'bg-green-100 border-green-300'
      default:
        return 'bg-gray-100 border-gray-300'
    }
  }

  // Sort events by date (most recent first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Group events by month
  const groupedEvents = sortedEvents.reduce((acc, event) => {
    const date = new Date(event.date)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(event)
    return acc
  }, {} as Record<string, TimelineEvent[]>)

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-')
    const date = new Date(parseInt(year), parseInt(month), 1)
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="bg-white rounded-2xl premium-shadow p-6">
      <h2 className="text-xl font-bold text-black mb-6">Therapy Timeline</h2>

      {sortedEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No timeline events yet</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-8">
            {Object.entries(groupedEvents)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([monthKey, monthEvents]) => (
                <div key={monthKey}>
                  <h3 className="text-lg font-semibold text-black mb-4 sticky top-0 bg-white py-2 z-10">
                    {formatMonth(monthKey)}
                  </h3>
                  <div className="space-y-4">
                    {monthEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`relative pl-16 ${getEventColor(event.type, event.status)} border-l-4 rounded-lg p-4`}
                      >
                        {/* Timeline Dot */}
                        <div className="absolute left-6 top-6 transform -translate-x-1/2">
                          {getEventIcon(event.type, event.status)}
                        </div>

                        {/* Event Content */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-black">{event.title}</h4>
                              {event.status && (
                                <span className="text-xs px-2 py-1 bg-white rounded-full capitalize">
                                  {event.status}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </p>
                            {event.description && (
                              <p className="text-sm text-gray-700">{event.description}</p>
                            )}

                            {/* Expandable Metadata */}
                            {event.metadata && Object.keys(event.metadata).length > 0 && (
                              <div className="mt-2">
                                <button
                                  onClick={() => toggleEvent(event.id)}
                                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-black transition-colors"
                                >
                                  <span>View Details</span>
                                  {expandedEvents.has(event.id) ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                                {expandedEvents.has(event.id) && (
                                  <div className="mt-2 p-3 bg-white rounded-lg text-sm">
                                    {event.metadata.aiAnalysis && (
                                      <div className="mb-3">
                                        <p className="font-semibold text-black mb-1">AI Analysis:</p>
                                        {event.metadata.aiAnalysis.summary && (
                                          <p className="text-gray-700 mb-2">
                                            {event.metadata.aiAnalysis.summary}
                                          </p>
                                        )}
                                        {event.metadata.aiAnalysis.diagnoses &&
                                          event.metadata.aiAnalysis.diagnoses.length > 0 && (
                                            <div>
                                              <p className="font-medium text-black mb-1">
                                                Diagnoses:
                                              </p>
                                              <div className="flex flex-wrap gap-1">
                                                {event.metadata.aiAnalysis.diagnoses.map(
                                                  (d: string, i: number) => (
                                                    <span
                                                      key={i}
                                                      className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs"
                                                    >
                                                      {d}
                                                    </span>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          )}
                                      </div>
                                    )}
                                    {event.metadata.notes && (
                                      <div>
                                        <p className="font-semibold text-black mb-1">Notes:</p>
                                        <p className="text-gray-700">{event.metadata.notes}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Action Link */}
                            {event.link && (
                              <Link
                                href={event.link}
                                className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                              >
                                View Details →
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

