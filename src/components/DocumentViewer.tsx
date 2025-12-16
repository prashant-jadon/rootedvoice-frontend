'use client'

import { useState } from 'react'
import {
  FileText,
  Download,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { clientAPI } from '@/lib/api'

interface Document {
  _id: string
  type: string
  fileName: string
  fileUrl: string
  uploadedAt: string
  notes?: string
  ocrProcessed: boolean
  extractedText?: string
  aiAnalysis?: {
    keyPoints: string[]
    summary: string
    importantDates: Array<{ date: string | Date; description: string }>
    diagnoses: string[]
    recommendations: string[]
    analyzedAt: string | Date
  }
  fileSize?: number
  mimeType?: string
}

interface DocumentViewerProps {
  document: Document
  clientId: string
  onDelete: () => void
  canDelete?: boolean
}

export default function DocumentViewer({
  document,
  clientId,
  onDelete,
  canDelete = false,
}: DocumentViewerProps) {
  const [showOCR, setShowOCR] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return
    }

    try {
      setIsDeleting(true)
      await clientAPI.deleteDocument(clientId, document._id)
      onDelete()
    } catch (error: any) {
      alert('Failed to delete document: ' + (error.response?.data?.message || 'Unknown error'))
    } finally {
      setIsDeleting(false)
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    if (isNaN(date.getTime())) {
      // Try parsing as YYYY-MM-DD format
      const parts = typeof dateString === 'string' ? dateString.split('-') : []
      if (parts.length === 3) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }
      return 'Invalid date'
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Document Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-black mb-1">{document.fileName}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="capitalize">{document.type}</span>
              <span>•</span>
              <span>{formatFileSize(document.fileSize)}</span>
              <span>•</span>
              <span>{formatDate(document.uploadedAt)}</span>
            </div>
            {document.notes && (
              <p className="text-sm text-gray-600 mt-2">{document.notes}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {document.fileUrl && (
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="View Document"
            >
              <Eye className="w-5 h-5" />
            </a>
          )}
          {document.fileUrl && (
            <a
              href={document.fileUrl}
              download
              className="p-2 text-gray-600 hover:text-green-600 transition-colors"
              title="Download Document"
            >
              <Download className="w-5 h-5" />
            </a>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Delete Document"
            >
              {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Processing Status */}
      <div className="mb-4 space-y-2">
        {document.ocrProcessed ? (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">OCR Processed</span>
            {document.ocrConfidence && (
              <span className="text-xs text-gray-500">({Math.round(document.ocrConfidence)}% confidence)</span>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-amber-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Processing OCR...</span>
          </div>
        )}
        
        {document.ocrError && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-2 rounded">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">OCR Error: {document.ocrError}</span>
          </div>
        )}

        {document.aiAnalysis ? (
          <div className="flex items-center space-x-2 text-green-600">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">AI Analysis Complete</span>
            {document.aiAnalysis.analyzedAt && (
              <span className="text-xs text-gray-500">
                ({formatDate(document.aiAnalysis.analyzedAt)})
              </span>
            )}
          </div>
        ) : document.ocrProcessed && !document.ocrError && (
          <div className="flex items-center space-x-2 text-amber-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Analyzing with AI...</span>
          </div>
        )}
      </div>

      {/* OCR Text Toggle */}
      {document.extractedText && (
        <div className="mb-4">
          <button
            onClick={() => setShowOCR(!showOCR)}
            className="flex items-center justify-between w-full px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">
              Extracted Text (OCR)
            </span>
            {showOCR ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {showOCR && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {document.extractedText}
              </p>
            </div>
          )}
        </div>
      )}

      {/* AI Analysis Toggle */}
      {document.aiAnalysis && (
        <div>
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="flex items-center justify-between w-full px-4 py-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors mb-2"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-900">
                AI Analysis Results
              </span>
            </div>
            {showAnalysis ? (
              <ChevronUp className="w-4 h-4 text-indigo-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {showAnalysis && (
            <div className="mt-2 space-y-4 p-4 bg-indigo-50 rounded-lg">
              {/* Summary */}
              {document.aiAnalysis.summary && (
                <div>
                  <h4 className="font-semibold text-black mb-2">Summary</h4>
                  <p className="text-sm text-gray-700">{document.aiAnalysis.summary}</p>
                </div>
              )}

              {/* Key Points */}
              {document.aiAnalysis.keyPoints && document.aiAnalysis.keyPoints.length > 0 && (
                <div>
                  <h4 className="font-semibold text-black mb-2">Key Points</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {document.aiAnalysis.keyPoints.map((point, index) => (
                      <li key={index} className="text-sm text-gray-700">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Diagnoses */}
              {document.aiAnalysis.diagnoses && document.aiAnalysis.diagnoses.length > 0 && (
                <div>
                  <h4 className="font-semibold text-black mb-2">Diagnoses</h4>
                  <div className="flex flex-wrap gap-2">
                    {document.aiAnalysis.diagnoses.map((diagnosis, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"
                      >
                        {diagnosis}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Important Dates */}
              {document.aiAnalysis.importantDates &&
                document.aiAnalysis.importantDates.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-black mb-2">Important Dates</h4>
                    <div className="space-y-2">
                      {document.aiAnalysis.importantDates.map((dateItem, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-black">
                              {formatDate(dateItem.date)}
                            </p>
                            <p className="text-xs text-gray-600">{dateItem.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Recommendations */}
              {document.aiAnalysis.recommendations &&
                document.aiAnalysis.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-black mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {document.aiAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}
        </div>
      )}

      {/* No Analysis Yet */}
      {document.ocrProcessed && !document.aiAnalysis && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-amber-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">
              AI analysis is being processed. Please check back in a few moments.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

