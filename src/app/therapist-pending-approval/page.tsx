'use client'

import { CheckCircle, Clock, Mail } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'

export default function TherapistPendingApprovalPage() {
  const t = useTranslation()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [checkingStatus, setCheckingStatus] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Check therapist status
    const checkStatus = async () => {
      try {
        const api = (await import('@/lib/api')).default
        const response = await api.get('/auth/me')
        const therapist = response.data.data.profile

        if (therapist && therapist.status === 'active') {
          router.push('/dashboard')
        } else {
          setCheckingStatus(false)
        }
      } catch (error) {
        console.error('Error checking status:', error)
        setCheckingStatus(false)
      }
    }

    checkStatus()
  }, [isAuthenticated, router])

  if (checkingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('pendingApproval.title')}</h1>
          <p className="text-gray-600">
            {t('pendingApproval.subtitle')}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">{t('pendingApproval.whatHappensNext')}</h2>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{t('pendingApproval.registrationReceived')}</p>
                <p className="text-blue-700">{t('pendingApproval.registrationReceivedDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{t('pendingApproval.adminReview')}</p>
                <p className="text-blue-700">{t('pendingApproval.adminReviewDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{t('pendingApproval.emailNotification')}</p>
                <p className="text-blue-700">{t('pendingApproval.emailNotificationDesc')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">{t('pendingApproval.requiredDocumentsSubmitted')}</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              {t('pendingApproval.spaMembershipCertificate')}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              {t('pendingApproval.stateRegistrationDocument')}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              {t('pendingApproval.insuranceCertificate')}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              {t('pendingApproval.wwccCheck')}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              {t('pendingApproval.policeCheck')}
            </li>
          </ul>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Mail className="w-4 h-4" />
            <span>{t('pendingApproval.questions')}</span>
          </div>
          <Link
            href="/login"
            className="block w-full text-center py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            {t('pendingApproval.returnToLogin')}
          </Link>
        </div>
      </div>
    </div>
  )
}

