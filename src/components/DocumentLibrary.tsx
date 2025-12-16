'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  FileText,
  Calendar,
  Download,
  Eye,
  Sparkles,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { clientAPI } from '@/lib/api'
import DocumentViewer from './DocumentViewer'

interface DocumentLibraryProps {
  clientId: string
  clientName?: string
}

export default function DocumentLibrary({ clientId, clientName }: DocumentLibraryProps) {
  const [documents, setDocuments] = useState<any[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [hasAnalysisFilter, setHasAnalysisFilter] = useState('all')
  const [selectedDocument, setSelectedDocument] = useState<any>(null)

  useEffect(() => {
    fetchDocuments()
  }, [clientId])

  useEffect(() => {
    filterDocuments()
  }, [documents, searchQuery, typeFilter, hasAnalysisFilter])

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      const response = await clientAPI.getDocuments(clientId)
      setDocuments(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterDocuments = () => {
    let filtered = [...documents]

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.type === typeFilter)
    }

    // Filter by analysis status
    if (hasAnalysisFilter === 'with') {
      filtered = filtered.filter((doc) => doc.aiAnalysis)
    } else if (hasAnalysisFilter === 'without') {
      filtered = filtered.filter((doc) => !doc.aiAnalysis)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((doc) => {
        // Search in filename
        if (doc.fileName?.toLowerCase().includes(query)) return true

        // Search in extracted text
        if (doc.extractedText?.toLowerCase().includes(query)) return true

        // Search in AI analysis
        if (doc.aiAnalysis) {
          if (doc.aiAnalysis.summary?.toLowerCase().includes(query)) return true
          if (
            doc.aiAnalysis.keyPoints?.some((kp: string) =>
              kp.toLowerCase().includes(query)
            )
          )
            return true
          if (
            doc.aiAnalysis.diagnoses?.some((d: string) =>
              d.toLowerCase().includes(query)
            )
          )
            return true
          if (
            doc.aiAnalysis.recommendations?.some((r: string) =>
              r.toLowerCase().includes(query)
            )
          )
            return true
        }

        // Search in notes
        if (doc.notes?.toLowerCase().includes(query)) return true

        return false
      })
    }

    // Sort by date (most recent first)
    filtered.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )

    setFilteredDocuments(filtered)
  }

  const handleSearch = async () => {
    try {
      setIsLoading(true)
      const response = await clientAPI.searchDocuments(clientId, {
        search: searchQuery,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        hasAnalysis: hasAnalysisFilter === 'with' ? 'true' : undefined,
      })
      setFilteredDocuments(response.data.data.documents || [])
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && documents.length === 0) {
    return (
      <div className="bg-white rounded-2xl premium-shadow p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl premium-shadow p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-2">
          Document Library{clientName && ` - ${clientName}`}
        </h2>
        <p className="text-sm text-gray-600">
          Search and manage client documents with OCR and AI analysis
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            placeholder="Search documents, text, diagnoses, recommendations..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Document Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">All Types</option>
              <option value="IEP">IEP</option>
              <option value="IFSP">IFSP</option>
              <option value="medical">Medical</option>
              <option value="evaluation">Evaluation</option>
              <option value="discharge">Discharge</option>
              <option value="assessment">Assessment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              AI Analysis
            </label>
            <select
              value={hasAnalysisFilter}
              onChange={(e) => setHasAnalysisFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">All Documents</option>
              <option value="with">With AI Analysis</option>
              <option value="without">Without AI Analysis</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredDocuments.length} of {documents.length} documents
      </div>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {searchQuery || typeFilter !== 'all' || hasAnalysisFilter !== 'all'
              ? 'No documents match your search criteria'
              : 'No documents found'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDocuments.map((doc) => (
            <DocumentViewer
              key={doc._id}
              document={doc}
              clientId={clientId}
              onDelete={() => {
                setDocuments(documents.filter((d) => d._id !== doc._id))
                setFilteredDocuments(
                  filteredDocuments.filter((d) => d._id !== doc._id)
                )
              }}
              canDelete={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

