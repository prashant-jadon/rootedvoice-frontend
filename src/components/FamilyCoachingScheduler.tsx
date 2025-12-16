'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Users, Target, X, Save, Loader2, AlertCircle } from 'lucide-react'
import { familyCoachingAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

interface Participant {
  name: string
  relationship: 'parent' | 'guardian' | 'sibling' | 'family-member' | 'caregiver' | 'other'
  email?: string
  phone?: string
}

interface FamilyCoachingSchedulerProps {
  clientId: string
  therapistId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export default function FamilyCoachingScheduler({
  clientId,
  therapistId,
  onSuccess,
  onCancel,
}: FamilyCoachingSchedulerProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('10:00 AM')
  const [duration, setDuration] = useState(60)
  const [sessionType, setSessionType] = useState<'family-coaching' | 'caregiver-training' | 'support-session'>('family-coaching')
  const [participants, setParticipants] = useState<Participant[]>([
    { name: '', relationship: 'parent' }
  ])
  const [topics, setTopics] = useState<string[]>([''])
  const [goals, setGoals] = useState('')

  const addParticipant = () => {
    setParticipants([...participants, { name: '', relationship: 'parent' }])
  }

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index))
  }

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    const updated = [...participants]
    updated[index] = { ...updated[index], [field]: value }
    setParticipants(updated)
  }

  const addTopic = () => {
    setTopics([...topics, ''])
  }

  const removeTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index))
  }

  const updateTopic = (index: number, value: string) => {
    const updated = [...topics]
    updated[index] = value
    setTopics(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!scheduledDate) {
      setError('Please select a date')
      return
    }

    if (participants.some(p => !p.name.trim())) {
      setError('Please fill in all participant names')
      return
    }

    try {
      setIsLoading(true)
      
      const sessionData = {
        clientId,
        therapistId,
        scheduledDate,
        scheduledTime,
        duration,
        sessionType,
        participants: participants.filter(p => p.name.trim()),
        topics: topics.filter(t => t.trim()),
        goals,
      }

      await familyCoachingAPI.createSession(sessionData)
      
      if (onSuccess) {
        onSuccess()
      } else {
        alert('Family coaching session scheduled successfully!')
        // Reset form
        setScheduledDate('')
        setScheduledTime('10:00 AM')
        setDuration(60)
        setParticipants([{ name: '', relationship: 'parent' }])
        setTopics([''])
        setGoals('')
      }
    } catch (err: any) {
      console.error('Failed to schedule session:', err)
      setError(err.response?.data?.message || 'Failed to schedule family coaching session')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl premium-shadow p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">Schedule Family Coaching Session</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Time
            </label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => {
                const time = e.target.value
                const [hours, minutes] = time.split(':')
                const hour = parseInt(hours)
                const ampm = hour >= 12 ? 'PM' : 'AM'
                const displayHour = hour % 12 || 12
                setScheduledTime(`${displayHour}:${minutes} ${ampm}`)
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Duration & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
              <option value={120}>120 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Type
            </label>
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="family-coaching">Family Coaching</option>
              <option value="caregiver-training">Caregiver Training</option>
              <option value="support-session">Support Session</option>
            </select>
          </div>
        </div>

        {/* Participants */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Participants
          </label>
          <div className="space-y-3">
            {participants.map((participant, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={participant.name}
                    onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                    required
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <select
                    value={participant.relationship}
                    onChange={(e) => updateParticipant(index, 'relationship', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="parent">Parent</option>
                    <option value="guardian">Guardian</option>
                    <option value="sibling">Sibling</option>
                    <option value="family-member">Family Member</option>
                    <option value="caregiver">Caregiver</option>
                    <option value="other">Other</option>
                  </select>
                  {participants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addParticipant}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Participant
            </button>
          </div>
        </div>

        {/* Topics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discussion Topics
          </label>
          <div className="space-y-2">
            {topics.map((topic, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Topic"
                  value={topic}
                  onChange={(e) => updateTopic(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                {topics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTopic(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTopic}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Topic
            </button>
          </div>
        </div>

        {/* Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Target className="w-4 h-4 inline mr-1" />
            Session Goals
          </label>
          <textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="What do you hope to achieve in this session?"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scheduling...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Schedule Session</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

