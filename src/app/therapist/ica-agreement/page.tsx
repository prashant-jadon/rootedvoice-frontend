'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import { therapistAPI } from '@/lib/api'

export default function IcaAgreementPage() {
  const router = useRouter()
  const [isSigning, setIsSigning] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleSign = async () => {
    if (!agreed) return;

    setIsSigning(true);
    try {
      // In a real implementation this would be a dedicated compliance sign endpoint
      await therapistAPI.createOrUpdate({ 
        complianceItems: {
          icaSigned: true,
          icaSignedAt: new Date()
        } 
      });
      // After signing, they unlock the dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error signing agreement:', error)
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
                <p className="text-gray-600">Action Required: Sign to finalize your onboarding</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 h-96 overflow-y-auto mb-8 prose max-w-none">
              <h3 className="text-black">Rooted Voices - Independent Contractor Agreement</h3>
              <p className="text-gray-700 mt-4">
                [Contract text pending review by business attorney. This is a placeholder showing where the final legal verbiage will reside.]
              </p>
              <p className="text-gray-700 mt-4">
                By signing this agreement, you acknowledge that you are an independent contractor, 
                responsible for your own taxes, maintaining active state licensure, and carrying sufficient 
                professional liability insurance while practicing on the Rooted Voices platform.
              </p>
            </div>

            <div className="flex items-center space-x-3 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <input 
                type="checkbox" 
                id="agree" 
                className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label htmlFor="agree" className="text-sm text-gray-800 font-medium">
                I have read and agree to the terms of the Independent Contractor Agreement.
              </label>
            </div>

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
                    <span>Sign & Continue to Dashboard</span>
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
