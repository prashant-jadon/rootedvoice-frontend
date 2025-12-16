'use client'

import { useState, useEffect } from 'react'
import { X, Upload, FileText, Loader2, Calendar, User, Target } from 'lucide-react'
import { assignmentAPI, clientAPI } from '@/lib/api'

interface AssignmentCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  clientId?: string
}

export default function AssignmentCreateModal({
  isOpen,
  onClose,
  onSuccess,
  clientId: initialClientId,
}: AssignmentCreateModalProps) {
  const [clients, setClients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [uploadedAttachments, setUploadedAttachments] = useState<any[]>([])

  const [formData, setFormData] = useState({
    clientId: initialClientId || '',
    goalId: '',
    title: '',
    description: '',
    type: 'daily-practice',
    dueDate: '',
    instructions: '',
  })

  useEffect(() => {
    if (isOpen && !initialClientId) {
      fetchClients()
    }
  }, [isOpen, initialClientId])

  const fetchClients = async () => {
    try {
      const response = await clientAPI.getAll()
      setClients(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments([...attachments, ...newFiles])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const uploadAttachment = async (file: File): Promise<string> => {
    // In production, upload to server and get URL
    // For now, create a temporary URL
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        // In production, this would be the server URL
        const fileUrl = URL.createObjectURL(file)
        resolve(fileUrl)
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.clientId || !formData.title || !formData.description || !formData.dueDate) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setIsLoading(true)
      setIsUploading(true)

      // Upload attachments
      const attachmentData = []
      for (const file of attachments) {
        const fileUrl = await uploadAttachment(file)
        attachmentData.push({
          fileName: file.name,
          fileUrl: fileUrl,
          fileType: file.type,
        })
      }

      // Create assignment
      await assignmentAPI.create({
        ...formData,
        attachments: attachmentData,
      })

      alert('Assignment created successfully!')
      onSuccess()
      handleClose()
    } catch (error: any) {
      console.error('Assignment creation error:', error)
      alert('Failed to create assignment: ' + (error.response?.data?.message || 'Unknown error'))
    } finally {
      setIsLoading(false)
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      clientId: initialClientId || '',
      goalId: '',
      title: '',
      description: '',
      type: 'daily-practice',
      dueDate: '',
      instructions: '',
    })
    setAttachments([])
    setUploadedAttachments([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">Create New Assignment</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection */}
          {!initialClientId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
                disabled={isLoading}
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.userId
                      ? `${client.userId.firstName} ${client.userId.lastName}`
                      : 'Unknown Client'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., Daily Articulation Practice"
              required
              maxLength={200}
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Describe what the client needs to do..."
              required
              maxLength={2000}
              disabled={isLoading}
            />
          </div>

          {/* Type and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                disabled={isLoading}
              >
                <option value="daily-practice">Daily Practice</option>
                <option value="video-exercise">Video Exercise</option>
                <option value="reflection">Reflection</option>
                <option value="reading">Reading</option>
                <option value="worksheet">Worksheet</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions (Optional)
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Additional instructions for completing the assignment..."
              maxLength={2000}
              disabled={isLoading}
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {attachments.length > 0 ? (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-700"
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload files or drag and drop
                  </p>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    multiple
                    className="hidden"
                    id="attachment-upload"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="attachment-upload"
                    className="inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer text-sm"
                  >
                    Select Files
                  </label>
                </div>
              )}
              {attachments.length > 0 && (
                <div className="mt-2">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    multiple
                    className="hidden"
                    id="attachment-upload-more"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="attachment-upload-more"
                    className="inline-block text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    + Add more files
                  </label>
                </div>
              )}
            </div>
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
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Assignment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

