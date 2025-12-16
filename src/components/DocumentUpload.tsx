'use client'

import { useState } from 'react'
import { Upload, FileText, X, Loader2 } from 'lucide-react'
import { clientAPI } from '@/lib/api'

interface DocumentUploadProps {
  clientId: string
  onUploadSuccess: () => void
  onClose: () => void
}

export default function DocumentUpload({ clientId, onUploadSuccess, onClose }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('other')
  const [notes, setNotes] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [pdfType, setPdfType] = useState<'text' | 'image' | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      // Reset PDF type when file changes
      if (selectedFile.type === 'application/pdf') {
        setPdfType(null) // User needs to select
      } else {
        setPdfType(null) // Not a PDF
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file')
      return
    }

    try {
      setIsUploading(true)
      setUploadProgress(0)

      // Check if PDF type is required
      if (file.type === 'application/pdf' && !pdfType) {
        alert('Please select whether this is a text-based or image-based PDF')
        return
      }

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('document', file)
      formData.append('type', documentType)
      formData.append('notes', notes)
      if (file.type === 'application/pdf' && pdfType) {
        formData.append('pdfType', pdfType)
      }

      // Upload file with metadata
      await clientAPI.uploadDocumentFile(clientId, formData)

      setUploadProgress(100)
      alert('Document uploaded successfully! OCR and AI analysis will be processed in the background.')
      onUploadSuccess()
      onClose()
    } catch (error: any) {
      console.error('Upload error:', error)
      alert('Failed to upload document: ' + (error.message || 'Unknown error'))
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">Upload Document</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isUploading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {file ? (
                <div className="space-y-4">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto" />
                  <div>
                    <p className="font-medium text-black">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-600 hover:text-red-700 text-sm"
                    disabled={isUploading}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop a file here, or click to select
                  </p>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    className="hidden"
                    id="file-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Select File
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported: PDF, DOC, DOCX, JPG, PNG, TXT (Max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* PDF Type Selection (only for PDFs) */}
          {file && file.type === 'application/pdf' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPdfType('text')}
                  disabled={isUploading}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    pdfType === 'text'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  } disabled:opacity-50`}
                >
                  <div className="font-semibold mb-1">Text-Based PDF</div>
                  <div className="text-xs text-gray-600">
                    PDF with selectable text (will extract text directly)
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPdfType('image')}
                  disabled={isUploading}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    pdfType === 'image'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  } disabled:opacity-50`}
                >
                  <div className="font-semibold mb-1">Image-Based PDF</div>
                  <div className="text-xs text-gray-600">
                    Scanned PDF or images (will use OCR)
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              disabled={isUploading}
            >
              <option value="IEP">IEP (Individualized Education Program)</option>
              <option value="IFSP">IFSP (Individualized Family Service Plan)</option>
              <option value="medical">Medical Document</option>
              <option value="evaluation">Evaluation Report</option>
              <option value="discharge">Discharge Summary</option>
              <option value="assessment">Assessment Report</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Add any additional notes about this document..."
              disabled={isUploading}
            />
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Uploading...</span>
                <span className="text-sm text-gray-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> After upload, the document will be processed with OCR to extract text,
              and then analyzed with AI to extract key points, diagnoses, and recommendations.
              This may take a few moments.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

