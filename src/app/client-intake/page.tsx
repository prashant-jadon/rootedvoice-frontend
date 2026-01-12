'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  User, 
  FileText, 
  MapPin, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { clientAPI } from '@/lib/api'

export default function ClientIntakePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [intakeStatus, setIntakeStatus] = useState<any>(null)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [formData, setFormData] = useState({
    clientType: '' as 'child' | 'adult' | '',
    primaryConcerns: '',
    communicationConcerns: '',
    stateOfResidence: '',
    telehealthConsent: {
      consented: false,
      understandsTechnology: false,
      understandsPrivacy: false,
      understandsLimitations: false,
      emergencyContactProvided: false,
      consentSignature: '',
      relationshipToClient: '',
    },
    additionalNotes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'client') {
      router.push('/login')
      return
    }
    checkIntakeStatus()
  }, [isAuthenticated, user])

  const checkIntakeStatus = async () => {
    try {
      setCheckingStatus(true)
      const response = await clientAPI.getIntakeStatus()
      const status = response.data.data
      setIntakeStatus(status)
      
      if (status.intakeCompleted) {
        // Intake already completed, redirect to dashboard
        router.push('/client-dashboard')
        return
      }
      
      // If intake exists but not completed, populate form
      if (status.intake) {
        setFormData({
          clientType: status.intake.clientType || '',
          primaryConcerns: status.intake.primaryConcerns || '',
          communicationConcerns: status.intake.communicationConcerns || '',
          stateOfResidence: status.intake.stateOfResidence || '',
          telehealthConsent: {
            consented: status.intake.telehealthConsent?.consented || false,
            understandsTechnology: status.intake.telehealthConsent?.understandsTechnology || false,
            understandsPrivacy: status.intake.telehealthConsent?.understandsPrivacy || false,
            understandsLimitations: status.intake.telehealthConsent?.understandsLimitations || false,
            emergencyContactProvided: status.intake.telehealthConsent?.emergencyContactProvided || false,
            consentSignature: status.intake.telehealthConsent?.consentSignature || '',
            relationshipToClient: status.intake.telehealthConsent?.relationshipToClient || '',
          },
          additionalNotes: status.intake.additionalNotes || '',
        })
      }
    } catch (error: any) {
      console.error('Failed to check intake status:', error)
      // If client profile doesn't exist yet, that's okay - they can still fill out intake
    } finally {
      setCheckingStatus(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.clientType) {
      newErrors.clientType = 'Please select whether this is for a child or adult'
    }

    if (!formData.primaryConcerns || formData.primaryConcerns.trim().length < 10) {
      newErrors.primaryConcerns = 'Please describe your primary concerns (at least 10 characters)'
    }

    if (!formData.stateOfResidence) {
      newErrors.stateOfResidence = 'Please select your state of residence'
    }

    if (!formData.telehealthConsent.consented) {
      newErrors.telehealthConsent = 'Telehealth consent is required to proceed'
    }

    if (!formData.telehealthConsent.understandsTechnology) {
      newErrors.telehealthConsent = 'Please confirm you understand the technology requirements'
    }

    if (!formData.telehealthConsent.understandsPrivacy) {
      newErrors.telehealthConsent = 'Please confirm you understand privacy and security measures'
    }

    if (!formData.telehealthConsent.understandsLimitations) {
      newErrors.telehealthConsent = 'Please confirm you understand the limitations of telehealth'
    }

    if (!formData.telehealthConsent.emergencyContactProvided) {
      newErrors.telehealthConsent = 'Please confirm you have an emergency contact available'
    }

    if (!formData.telehealthConsent.consentSignature) {
      newErrors.consentSignature = 'Please provide your signature (full name)'
    }

    if (!formData.telehealthConsent.relationshipToClient) {
      newErrors.relationshipToClient = 'Please specify your relationship to the client'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      await clientAPI.submitIntake(formData)
      router.push('/client-dashboard')
    } catch (error: any) {
      console.error('Failed to submit intake:', error)
      setErrors({
        submit: error.response?.data?.message || 'Failed to submit intake form. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img 
                src="/logorooted 1.png" 
                alt="Rooted Voices" 
                className="h-12"
              />
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Step 1 of 2: Complete Intake</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl premium-shadow p-8"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Client Intake Form</h1>
            <p className="text-gray-600">
              Please complete this intake form to help us understand your needs and provide the best care possible.
            </p>
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Client Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Is this service for a child or adult? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, clientType: 'child' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.clientType === 'child'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-2">👶</div>
                  <div className="font-semibold">Child</div>
                  <div className="text-xs mt-1 opacity-80">Ages 0-17</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, clientType: 'adult' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.clientType === 'adult'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-2">👤</div>
                  <div className="font-semibold">Adult</div>
                  <div className="text-xs mt-1 opacity-80">Ages 18+</div>
                </button>
              </div>
              {errors.clientType && (
                <p className="mt-2 text-sm text-red-600">{errors.clientType}</p>
              )}
            </div>

            {/* Primary Concerns */}
            <div>
              <label htmlFor="primaryConcerns" className="block text-sm font-medium text-gray-700 mb-2">
                What are your primary concerns or reasons for seeking speech and language therapy? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="primaryConcerns"
                rows={5}
                value={formData.primaryConcerns}
                onChange={(e) => setFormData({ ...formData, primaryConcerns: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.primaryConcerns ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Please describe your main concerns, what you hope to achieve, and any specific challenges you or your child are experiencing..."
              />
              {errors.primaryConcerns && (
                <p className="mt-2 text-sm text-red-600">{errors.primaryConcerns}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Don't worry if you don't have a formal diagnosis. We're here to help identify and address your needs.
              </p>
            </div>

            {/* Communication Concerns */}
            <div>
              <label htmlFor="communicationConcerns" className="block text-sm font-medium text-gray-700 mb-2">
                Communication Concerns (Optional)
              </label>
              <textarea
                id="communicationConcerns"
                rows={4}
                value={formData.communicationConcerns}
                onChange={(e) => setFormData({ ...formData, communicationConcerns: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Please describe any specific communication challenges, such as articulation, language comprehension, fluency, voice, or other concerns..."
              />
            </div>

            {/* State of Residence */}
            <div>
              <label htmlFor="stateOfResidence" className="block text-sm font-medium text-gray-700 mb-2">
                State of Residence <span className="text-red-500">*</span>
              </label>
              <select
                id="stateOfResidence"
                value={formData.stateOfResidence}
                onChange={(e) => setFormData({ ...formData, stateOfResidence: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                  errors.stateOfResidence ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select State</option>
                <option value="AL">Alabama (AL)</option>
                <option value="AK">Alaska (AK)</option>
                <option value="AZ">Arizona (AZ)</option>
                <option value="AR">Arkansas (AR)</option>
                <option value="CA">California (CA)</option>
                <option value="CO">Colorado (CO)</option>
                <option value="CT">Connecticut (CT)</option>
                <option value="DE">Delaware (DE)</option>
                <option value="FL">Florida (FL)</option>
                <option value="GA">Georgia (GA)</option>
                <option value="HI">Hawaii (HI)</option>
                <option value="ID">Idaho (ID)</option>
                <option value="IL">Illinois (IL)</option>
                <option value="IN">Indiana (IN)</option>
                <option value="IA">Iowa (IA)</option>
                <option value="KS">Kansas (KS)</option>
                <option value="KY">Kentucky (KY)</option>
                <option value="LA">Louisiana (LA)</option>
                <option value="ME">Maine (ME)</option>
                <option value="MD">Maryland (MD)</option>
                <option value="MA">Massachusetts (MA)</option>
                <option value="MI">Michigan (MI)</option>
                <option value="MN">Minnesota (MN)</option>
                <option value="MS">Mississippi (MS)</option>
                <option value="MO">Missouri (MO)</option>
                <option value="MT">Montana (MT)</option>
                <option value="NE">Nebraska (NE)</option>
                <option value="NV">Nevada (NV)</option>
                <option value="NH">New Hampshire (NH)</option>
                <option value="NJ">New Jersey (NJ)</option>
                <option value="NM">New Mexico (NM)</option>
                <option value="NY">New York (NY)</option>
                <option value="NC">North Carolina (NC)</option>
                <option value="ND">North Dakota (ND)</option>
                <option value="OH">Ohio (OH)</option>
                <option value="OK">Oklahoma (OK)</option>
                <option value="OR">Oregon (OR)</option>
                <option value="PA">Pennsylvania (PA)</option>
                <option value="RI">Rhode Island (RI)</option>
                <option value="SC">South Carolina (SC)</option>
                <option value="SD">South Dakota (SD)</option>
                <option value="TN">Tennessee (TN)</option>
                <option value="TX">Texas (TX)</option>
                <option value="UT">Utah (UT)</option>
                <option value="VT">Vermont (VT)</option>
                <option value="VA">Virginia (VA)</option>
                <option value="WA">Washington (WA)</option>
                <option value="WV">West Virginia (WV)</option>
                <option value="WI">Wisconsin (WI)</option>
                <option value="WY">Wyoming (WY)</option>
                <option value="DC">District of Columbia (DC)</option>
              </select>
              {errors.stateOfResidence && (
                <p className="mt-2 text-sm text-red-600">{errors.stateOfResidence}</p>
              )}
            </div>

            {/* Telehealth Consent */}
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold text-black mb-4 flex items-center space-x-2">
                <Shield className="w-6 h-6" />
                <span>Telehealth Consent & Acknowledgements</span>
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Please read and acknowledge each of the following statements. All items are required to proceed with telehealth services.
              </p>

              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.telehealthConsent.consented}
                    onChange={(e) => setFormData({
                      ...formData,
                      telehealthConsent: { ...formData.telehealthConsent, consented: e.target.checked }
                    })}
                    className="mt-1 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I consent to receive speech and language therapy services via telehealth/teletherapy. <span className="text-red-500">*</span>
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.telehealthConsent.understandsTechnology}
                    onChange={(e) => setFormData({
                      ...formData,
                      telehealthConsent: { ...formData.telehealthConsent, understandsTechnology: e.target.checked }
                    })}
                    className="mt-1 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I understand that I need a device (computer, tablet, or smartphone) with a camera and microphone, plus a stable internet connection to participate in telehealth sessions. <span className="text-red-500">*</span>
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.telehealthConsent.understandsPrivacy}
                    onChange={(e) => setFormData({
                      ...formData,
                      telehealthConsent: { ...formData.telehealthConsent, understandsPrivacy: e.target.checked }
                    })}
                    className="mt-1 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I understand that all telehealth sessions are conducted through a secure, HIPAA-compliant platform, and I will participate in a private location to protect my privacy. <span className="text-red-500">*</span>
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.telehealthConsent.understandsLimitations}
                    onChange={(e) => setFormData({
                      ...formData,
                      telehealthConsent: { ...formData.telehealthConsent, understandsLimitations: e.target.checked }
                    })}
                    className="mt-1 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I understand that telehealth may have limitations compared to in-person therapy, and I will discuss any concerns with my therapist. <span className="text-red-500">*</span>
                  </span>
                </label>

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.telehealthConsent.emergencyContactProvided}
                    onChange={(e) => setFormData({
                      ...formData,
                      telehealthConsent: { ...formData.telehealthConsent, emergencyContactProvided: e.target.checked }
                    })}
                    className="mt-1 h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I understand that I should have an emergency contact available during telehealth sessions, and I will provide this information in my profile. <span className="text-red-500">*</span>
                  </span>
                </label>

                {errors.telehealthConsent && (
                  <p className="text-sm text-red-600">{errors.telehealthConsent}</p>
                )}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="relationshipToClient" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Relationship to Client <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="relationshipToClient"
                    value={formData.telehealthConsent.relationshipToClient}
                    onChange={(e) => setFormData({
                      ...formData,
                      telehealthConsent: { ...formData.telehealthConsent, relationshipToClient: e.target.value }
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.relationshipToClient ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Relationship</option>
                    <option value="Self">Self</option>
                    <option value="Parent">Parent</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.relationshipToClient && (
                    <p className="mt-2 text-sm text-red-600">{errors.relationshipToClient}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="consentSignature" className="block text-sm font-medium text-gray-700 mb-2">
                    Signature (Full Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="consentSignature"
                    type="text"
                    value={formData.telehealthConsent.consentSignature}
                    onChange={(e) => setFormData({
                      ...formData,
                      telehealthConsent: { ...formData.telehealthConsent, consentSignature: e.target.value }
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.consentSignature ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.consentSignature && (
                    <p className="mt-2 text-sm text-red-600">{errors.consentSignature}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                id="additionalNotes"
                rows={3}
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Any additional information you'd like to share..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Link
                href="/login"
                className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isLoading ? 'Submitting...' : 'Continue to Dashboard'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

