'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { therapistAPI } from '@/lib/api'
import ICAContent from '@/components/ICAContent'

const ICA_VERSION = '1.0'

export default function IcaAgreementPage() {
  const router = useRouter()
  const [isSigning, setIsSigning] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [scrolledToBottom, setScrolledToBottom] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40
    if (atBottom) setScrolledToBottom(true)
  }

  const handleSign = async () => {
    if (!agreed) return

    setIsSigning(true)
    setError('')
    try {
      await therapistAPI.createOrUpdate({
        complianceItems: {
          icaSigned: true,
          icaSignedAt: new Date(),
          icaVersion: ICA_VERSION,
        }
      })
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Error signing agreement:', err)
      setError(err?.response?.data?.message || 'Failed to sign agreement. Please try again.')
      setIsSigning(false)
    }
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
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Independent Contractor Agreement</h1>
                <p className="text-gray-600">Action Required: Please read and sign to finalize your onboarding</p>
              </div>
            </div>

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 md:p-8 max-h-[70vh] overflow-y-auto mb-4"
            >
              <ICAContent />
            </div>

            {!scrolledToBottom && (
              <p className="text-xs text-gray-500 text-center mb-4">
                Please scroll through the entire agreement to enable signing.
              </p>
            )}

            <div className={`flex items-start space-x-3 mb-6 p-4 rounded-lg border ${scrolledToBottom ? 'bg-gray-50 border-gray-200' : 'bg-gray-100 border-gray-200 opacity-60'}`}>
              <input
                type="checkbox"
                id="agree"
                className="w-5 h-5 mt-0.5 text-black border-gray-300 rounded focus:ring-black"
                checked={agreed}
                disabled={!scrolledToBottom}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label htmlFor="agree" className="text-sm text-gray-800 font-medium">
                I have read, understand, and agree to all terms of the Independent Contractor Agreement, including all Exhibits (A through D). I acknowledge that I am entering into this Agreement as an independent contractor and not as an employee.
              </label>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSign}
                disabled={!agreed || isSigning}
                className="flex items-center space-x-2 px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSigning ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Sign Agreement &amp; Continue</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
