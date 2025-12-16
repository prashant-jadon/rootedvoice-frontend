'use client'

import { useState } from 'react'
import { X, Star, Loader2 } from 'lucide-react'
import { assignmentAPI } from '@/lib/api'

interface AssignmentFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  assignmentId: string
  currentFeedback?: string
  currentRating?: number
}

export default function AssignmentFeedbackModal({
  isOpen,
  onClose,
  onSuccess,
  assignmentId,
  currentFeedback,
  currentRating,
}: AssignmentFeedbackModalProps) {
  const [feedback, setFeedback] = useState(currentFeedback || '')
  const [rating, setRating] = useState(currentRating || 0)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!feedback.trim()) {
      alert('Please provide feedback')
      return
    }

    try {
      setIsLoading(true)
      await assignmentAPI.addFeedback(assignmentId, {
        feedback: feedback.trim(),
        rating: rating > 0 ? rating : undefined,
      })

      alert('Feedback added successfully!')
      onSuccess()
      handleClose()
    } catch (error: any) {
      console.error('Feedback error:', error)
      alert('Failed to add feedback: ' + (error.response?.data?.message || 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFeedback(currentFeedback || '')
    setRating(currentRating || 0)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">Add Feedback</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (Optional)
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`p-2 rounded-lg transition-colors ${
                    rating >= value
                      ? 'text-yellow-500'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                  disabled={isLoading}
                >
                  <Star
                    className={`w-6 h-6 ${rating >= value ? 'fill-current' : ''}`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-gray-600 ml-2">
                  {rating} out of 5
                </span>
              )}
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Provide detailed feedback on the assignment completion..."
              required
              maxLength={1000}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {feedback.length}/1000 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !feedback.trim()}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

