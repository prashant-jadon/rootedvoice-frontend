'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, Trash2, Clock, Download } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { therapistAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import ICAContent from '@/components/ICAContent'

const ICA_VERSION = '1.0'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'

const getSignatureUrl = (url: string) => {
  if (!url) return url
  if (url.includes('blob.vercel-storage.com')) {
    return `${API_BASE_URL}/blob/proxy?url=${encodeURIComponent(url)}`
  }
  return url
}

export default function IcaAgreementPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>}>
      <IcaAgreementContent />
    </Suspense>
  )
}

function IcaAgreementContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pendingCountersign = searchParams.get('status') === 'pending-countersign'
  const viewSigned = searchParams.get('view') === 'signed'
  const { user } = useAuth()
  const [isSigning, setIsSigning] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [scrolledToBottom, setScrolledToBottom] = useState(false)
  const [error, setError] = useState('')
  const [address, setAddress] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSigned, setHasSigned] = useState(false)

  const contractorName = user ? `${user.firstName} ${user.lastName}` : ''

  useEffect(() => {
    if (viewSigned || pendingCountersign) {
      setLoadingProfile(true)
      therapistAPI.getMyProfile()
        .then(res => setProfile(res.data.data))
        .catch(err => console.error('Failed to load profile:', err))
        .finally(() => setLoadingProfile(false))
    }
  }, [viewSigned, pendingCountersign])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
  }, [])

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    e.preventDefault()
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const pos = getPos(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    setHasSigned(true)
  }

  const stopDraw = () => setIsDrawing(false)

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSigned(false)
  }

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 40) {
      setScrolledToBottom(true)
    }
  }

  const canSubmit = agreed && scrolledToBottom && hasSigned && address.trim().length > 0

  const handleSign = async () => {
    if (!canSubmit) return

    setIsSigning(true)
    setError('')
    try {
      const canvas = canvasRef.current!
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png')
      })

      const formData = new FormData()
      formData.append('signature', blob, 'signature.png')
      formData.append('address', address.trim())
      formData.append('icaVersion', ICA_VERSION)

      await therapistAPI.signIca(formData)
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Error signing ICA:', err)
      setError(err?.response?.data?.message || 'Failed to sign agreement. Please try again.')
      setIsSigning(false)
    }
  }

  const isFullySigned = viewSigned && profile?.complianceItems?.icaSigned && profile?.complianceItems?.icaCountersigned

  if (loadingProfile) {
    return (
      <ProtectedRoute allowedRoles={['therapist']}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['therapist']}>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl premium-shadow p-8"
          >
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isFullySigned ? 'bg-green-100' : pendingCountersign ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                {isFullySigned ? <CheckCircle className="w-6 h-6 text-green-600" /> :
                 pendingCountersign ? <Clock className="w-6 h-6 text-yellow-600" /> :
                 <FileText className="w-6 h-6 text-blue-600" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Independent Contractor Agreement</h1>
                <p className="text-gray-600">
                  {isFullySigned
                    ? 'This agreement has been fully executed by both parties.'
                    : pendingCountersign
                    ? 'Your signature has been submitted. Awaiting company countersignature.'
                    : 'Please read, fill in your details, and sign to finalize your onboarding'}
                </p>
              </div>
            </div>

            {/* Fully Signed View */}
            {isFullySigned && (
              <>
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="font-semibold text-green-800">Agreement Fully Executed</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 max-h-[70vh] overflow-y-auto mb-6">
                  <ICAContent signedData={{
                    effectiveDate: profile.complianceItems.icaEffectiveDate,
                    contractorName: `${profile.userId?.firstName || ''} ${profile.userId?.lastName || ''}`.trim(),
                    contractorAddress: profile.complianceItems.icaContractorAddress,
                    contractorSignatureUrl: profile.complianceItems.icaContractorSignatureUrl ? getSignatureUrl(profile.complianceItems.icaContractorSignatureUrl) : undefined,
                    contractorSignedAt: profile.complianceItems.icaSignedAt,
                    companySignerName: profile.complianceItems.icaCompanySignerName,
                    companySignerTitle: profile.complianceItems.icaCompanySignerTitle,
                    companySignatureUrl: profile.complianceItems.icaCompanySignatureUrl ? getSignatureUrl(profile.complianceItems.icaCompanySignatureUrl) : undefined,
                    companySignedAt: profile.complianceItems.icaCountersignedAt,
                  }} />
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Print / Save PDF
                  </button>
                </div>
              </>
            )}

            {/* Pending Countersign View */}
            {pendingCountersign && !isFullySigned && (
              <div className="mb-8 p-5 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">You have signed the ICA</p>
                    <p className="text-sm text-gray-600 mt-1">
                      The Rooted Voices team will review and countersign your agreement shortly.
                      You will gain full access to the platform once the agreement is fully executed by both parties.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Signing Form */}
            {!pendingCountersign && !isFullySigned && (
              <>
                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 max-h-[60vh] overflow-y-auto mb-4"
                >
                  <ICAContent />
                </div>

                {!scrolledToBottom && (
                  <p className="text-xs text-gray-500 text-center mb-4">
                    Please scroll through the entire agreement to continue.
                  </p>
                )}

            <div className={`mt-6 space-y-5 transition-opacity ${scrolledToBottom ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <h3 className="text-lg font-bold text-black border-b pb-2">Contractor Details</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={contractorName}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-filled from your profile</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mailing Address <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, State, ZIP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Digital Signature <span className="text-red-500">*</span></label>
                <p className="text-xs text-gray-500 mb-2">Draw your signature below using your mouse or finger</p>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg bg-white">
                  <canvas
                    ref={canvasRef}
                    className="w-full cursor-crosshair touch-none"
                    style={{ height: '140px' }}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={stopDraw}
                    onMouseLeave={stopDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={stopDraw}
                  />
                  {!hasSigned && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-gray-300 text-lg italic">Sign here</span>
                    </div>
                  )}
                </div>
                {hasSigned && (
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear signature
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="text"
                  value={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="agree"
                  className="w-5 h-5 mt-0.5 text-black border-gray-300 rounded focus:ring-black"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <label htmlFor="agree" className="text-sm text-gray-800 font-medium">
                  I have read, understand, and agree to all terms of the Independent Contractor Agreement, including all Exhibits (A through D). I acknowledge that I am entering into this Agreement as an independent contractor and not as an employee.
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSign}
                  disabled={!canSubmit || isSigning}
                  className="flex items-center space-x-2 px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSigning ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Sign &amp; Submit Agreement</span>
                    </>
                  )}
                </button>
              </div>
            </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
