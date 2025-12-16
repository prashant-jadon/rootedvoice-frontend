'use client'

import { useState, useEffect } from 'react'
import { FileText, Upload } from 'lucide-react'
import DocumentViewer from './DocumentViewer'
import TherapyTimeline from './TherapyTimeline'
import { clientAPI } from '@/lib/api'

interface DocumentsTabProps {
  clientProfile: any
  documents: any[]
  timelineEvents: any[]
  onUploadClick: () => void
  onRefresh: () => void
}

export default function DocumentsTab({
  clientProfile,
  documents: initialDocuments,
  timelineEvents,
  onUploadClick,
  onRefresh,
}: DocumentsTabProps) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [isPolling, setIsPolling] = useState(false)

  // Update documents when prop changes
  useEffect(() => {
    setDocuments(initialDocuments)
  }, [initialDocuments])

  // Poll for document updates if any document is processing
  useEffect(() => {
    const hasProcessing = documents.some(
      (doc: any) => !doc.ocrProcessed || (doc.ocrProcessed && !doc.aiAnalysis && !doc.ocrError)
    )

    if (!hasProcessing || isPolling) {
      return undefined
    }

    setIsPolling(true)
    const pollInterval = setInterval(async () => {
      try {
        const response = await clientAPI.getDocuments(clientProfile._id)
        const updatedDocs = response.data.data || []
        setDocuments(updatedDocs)

        // Check if all documents are processed
        const allProcessed = updatedDocs.every(
          (doc: any) => doc.ocrProcessed && (doc.aiAnalysis || doc.ocrError)
        )

        if (allProcessed) {
          clearInterval(pollInterval)
          setIsPolling(false)
          onRefresh()
        }
      } catch (error) {
        console.error('Error polling documents:', error)
      }
    }, 5000)

    // Stop polling after 5 minutes
    const timeoutId = setTimeout(() => {
      clearInterval(pollInterval)
      setIsPolling(false)
    }, 5 * 60 * 1000)

    return () => {
      clearInterval(pollInterval)
      clearTimeout(timeoutId)
      setIsPolling(false)
    }
  }, [documents, clientProfile._id, isPolling, onRefresh])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl premium-shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-black">My Documents</h2>
          <button
            onClick={onUploadClick}
            className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>

        {isPolling && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              ⏳ Checking for processing updates... (This will stop automatically when complete)
            </p>
          </div>
        )}

        {documents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No documents uploaded yet</p>
            <p className="text-sm mt-2 mb-4">
              Upload IEPs, IFSPs, medical reports, and other important documents
            </p>
            <button
              onClick={onUploadClick}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Your First Document</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc: any) => (
              <DocumentViewer
                key={doc._id}
                document={doc}
                clientId={clientProfile._id}
                canDelete={true}
                onDelete={() => {
                  onRefresh()
                }}
              />
            ))}
          </div>
        )}
      </div>

      <TherapyTimeline clientId={clientProfile._id} events={timelineEvents || []} />
    </div>
  )
}
