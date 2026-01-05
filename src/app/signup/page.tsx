'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Phone, MapPin, Upload, FileText } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'

export default function SignupPage() {
  const t = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<'client' | 'therapist'>('client')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    // Therapist specific
    credentials: 'SLP' as 'SLP' | 'SLPA',
    practiceState: '',
    practiceCity: '',
    practicePostcode: '',
    spaMembershipNumber: '',
    spaMembershipType: '',
    spaMembershipExpiration: '',
    stateRegistrationNumber: '',
    stateRegistrationState: '',
    stateRegistrationExpiration: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceCoverageAmount: '',
    insuranceExpiration: '',
    wwccNumber: '',
    wwccState: '',
    wwccExpiration: '',
    policeCheckNumber: '',
    policeCheckIssueDate: '',
    policeCheckExpiration: '',
    hourlyRate: 75,
    specializations: [] as string[],
    // Document files
    spaMembershipFile: null as File | null,
    stateRegistrationFile: null as File | null,
    insuranceFile: null as File | null,
    wwccFile: null as File | null,
    policeCheckFile: null as File | null,
    academicQualificationFiles: [] as File[],
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError(t('signup.passwordsDoNotMatch'))
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError(t('signup.passwordMinLength'))
      setIsLoading(false)
      return
    }

    // Therapist-specific validation
    if (userType === 'therapist') {
      if (!formData.credentials) {
        setError(t('signup.selectCredentials'))
        setIsLoading(false)
        return
      }

      if (!formData.practiceState || !formData.practiceCity || !formData.practicePostcode) {
        setError(t('signup.completePracticeLocation'))
        setIsLoading(false)
        return
      }

      if (!formData.spaMembershipNumber || !formData.spaMembershipFile) {
        setError(t('signup.spaMembershipRequired'))
        setIsLoading(false)
        return
      }

      if (!formData.stateRegistrationNumber || !formData.stateRegistrationFile) {
        setError(t('signup.stateRegistrationRequired'))
        setIsLoading(false)
        return
      }

      if (!formData.insuranceProvider || !formData.insurancePolicyNumber || !formData.insuranceFile) {
        setError(t('signup.insuranceRequired'))
        setIsLoading(false)
        return
      }

      if (!formData.wwccNumber || !formData.wwccFile) {
        setError(t('signup.wwccRequired'))
        setIsLoading(false)
        return
      }

      if (!formData.policeCheckNumber || !formData.policeCheckFile) {
        setError(t('signup.policeCheckRequired'))
        setIsLoading(false)
        return
      }

      // Validate hourly rate against credentials
      const maxRate = formData.credentials === 'SLP' ? 75 : 55
      if (formData.hourlyRate > maxRate) {
        setError(t('signup.hourlyRateExceeded').replace('{credential}', formData.credentials).replace('{maxRate}', maxRate.toString()))
        setIsLoading(false)
        return
      }
    }

    try {
      if (userType === 'therapist') {
        // First, register the user
      const registrationData: any = {
        email: formData.email,
        password: formData.password,
          role: 'therapist',
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
          credentials: formData.credentials,
          hourlyRate: formData.hourlyRate,
          specializations: formData.specializations,
          practiceLocation: {
            state: formData.practiceState,
            city: formData.practiceCity,
            postcode: formData.practicePostcode,
          },
          // Add top-level for backend validation
          spaMembershipNumber: formData.spaMembershipNumber,
          spaMembership: {
            membershipNumber: formData.spaMembershipNumber,
            membershipType: formData.spaMembershipType,
            expirationDate: formData.spaMembershipExpiration || null,
          },
          stateRegistration: {
            registrationNumber: formData.stateRegistrationNumber,
            state: formData.stateRegistrationState,
            expirationDate: formData.stateRegistrationExpiration || null,
          },
          professionalIndemnityInsurance: {
            provider: formData.insuranceProvider,
            policyNumber: formData.insurancePolicyNumber,
            coverageAmount: formData.insuranceCoverageAmount,
            expirationDate: formData.insuranceExpiration || null,
          },
          workingWithChildrenCheck: {
            checkNumber: formData.wwccNumber,
            state: formData.wwccState,
            expirationDate: formData.wwccExpiration || null,
          },
          policeCheck: {
            checkNumber: formData.policeCheckNumber,
            issueDate: formData.policeCheckIssueDate || null,
            expirationDate: formData.policeCheckExpiration || null,
          },
      }

      await register(registrationData)
      
        // After registration, upload documents
        const token = localStorage.getItem('token')
        if (token) {
          const formDataToUpload = new FormData()
          
          if (formData.spaMembershipFile) {
            formDataToUpload.append('spaMembership', formData.spaMembershipFile)
            formDataToUpload.append('spaMembershipNumber', formData.spaMembershipNumber)
            formDataToUpload.append('spaMembershipType', formData.spaMembershipType)
            if (formData.spaMembershipExpiration) {
              formDataToUpload.append('spaMembershipExpirationDate', formData.spaMembershipExpiration)
            }
          }

          if (formData.stateRegistrationFile) {
            formDataToUpload.append('stateRegistration', formData.stateRegistrationFile)
            formDataToUpload.append('stateRegistrationNumber', formData.stateRegistrationNumber)
            formDataToUpload.append('stateRegistrationState', formData.stateRegistrationState)
            if (formData.stateRegistrationExpiration) {
              formDataToUpload.append('stateRegistrationExpirationDate', formData.stateRegistrationExpiration)
            }
          }

          if (formData.insuranceFile) {
            formDataToUpload.append('professionalIndemnityInsurance', formData.insuranceFile)
            formDataToUpload.append('insuranceProvider', formData.insuranceProvider)
            formDataToUpload.append('insurancePolicyNumber', formData.insurancePolicyNumber)
            formDataToUpload.append('insuranceCoverageAmount', formData.insuranceCoverageAmount)
            if (formData.insuranceExpiration) {
              formDataToUpload.append('insuranceExpirationDate', formData.insuranceExpiration)
            }
          }

          if (formData.wwccFile) {
            formDataToUpload.append('workingWithChildrenCheck', formData.wwccFile)
            formDataToUpload.append('wwccNumber', formData.wwccNumber)
            formDataToUpload.append('wwccState', formData.wwccState)
            if (formData.wwccExpiration) {
              formDataToUpload.append('wwccExpirationDate', formData.wwccExpiration)
            }
          }

          if (formData.policeCheckFile) {
            formDataToUpload.append('policeCheck', formData.policeCheckFile)
            formDataToUpload.append('policeCheckNumber', formData.policeCheckNumber)
            if (formData.policeCheckIssueDate) {
              formDataToUpload.append('policeCheckIssueDate', formData.policeCheckIssueDate)
            }
            if (formData.policeCheckExpiration) {
              formDataToUpload.append('policeCheckExpirationDate', formData.policeCheckExpiration)
            }
          }

          // Upload documents
          try {
            const { therapistAPI } = await import('@/lib/api')
            await therapistAPI.uploadDocuments(formDataToUpload)
          } catch (uploadError: any) {
            console.error('Document upload error:', uploadError)
            // Don't fail registration if upload fails - documents can be uploaded later
          }
        }

        // Redirect to pending approval page
        router.push('/therapist-pending-approval')
      } else {
        // Client registration
        const registrationData: any = {
          email: formData.email,
          password: formData.password,
          role: 'client',
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth || new Date('2000-01-01'),
        }

        await register(registrationData)
        router.push('/client-dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || t('signup.registrationFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Back to Home */}
          <Link href="/" className="flex items-center text-gray-600 hover:text-black transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('signup.backToHome')}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">{t('signup.title')}</h1>
              <p className="text-gray-600">{t('signup.subtitle')}</p>
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* User Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('signup.iAmA')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('client')}
                  className={`py-3 px-4 rounded-lg border-2 transition-all duration-300 ${
                    userType === 'client'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {t('signup.client')}
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('therapist')}
                  className={`py-3 px-4 rounded-lg border-2 transition-all duration-300 ${
                    userType === 'therapist'
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {t('signup.therapist')}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('signup.firstName')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder={t('signup.firstName')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('signup.lastName')}
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder={t('signup.lastName')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('signup.email')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder={t('signup.email')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('signup.phone')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder={t('signup.phone')}
                  />
                </div>
              </div>

              {userType === 'therapist' && (
                <>
                  {/* Credentials Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {t('signup.credentials')} <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, credentials: 'SLP', hourlyRate: 75 })
                        }}
                        className={`py-3 px-4 rounded-lg border-2 transition-all ${
                          formData.credentials === 'SLP'
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <div className="font-semibold">SLP</div>
                        <div className="text-xs mt-1">{t('signup.fullyLicensed')}</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, credentials: 'SLPA', hourlyRate: 55 })
                        }}
                        className={`py-3 px-4 rounded-lg border-2 transition-all ${
                          formData.credentials === 'SLPA'
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <div className="font-semibold">SLPA</div>
                        <div className="text-xs mt-1">{t('signup.assistant')}</div>
                      </button>
                    </div>
                  </div>

                  {/* Practice Location - Australia */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="practiceState" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('signup.state')} <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="practiceState"
                        required
                        value={formData.practiceState}
                        onChange={(e) => setFormData({ ...formData, practiceState: e.target.value })}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="">{t('signup.state')}</option>
                        <option value="NSW">New South Wales (NSW)</option>
                        <option value="VIC">Victoria (VIC)</option>
                        <option value="QLD">Queensland (QLD)</option>
                        <option value="SA">South Australia (SA)</option>
                        <option value="WA">Western Australia (WA)</option>
                        <option value="TAS">Tasmania (TAS)</option>
                        <option value="NT">Northern Territory (NT)</option>
                        <option value="ACT">Australian Capital Territory (ACT)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="practiceCity" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('signup.city')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="practiceCity"
                        type="text"
                        required
                        value={formData.practiceCity}
                        onChange={(e) => setFormData({ ...formData, practiceCity: e.target.value })}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder={t('signup.city')}
                      />
                      </div>
                    <div>
                      <label htmlFor="practicePostcode" className="block text-sm font-medium text-gray-700 mb-2">
                        {t('signup.postcode')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="practicePostcode"
                        type="text"
                        required
                        value={formData.practicePostcode}
                        onChange={(e) => setFormData({ ...formData, practicePostcode: e.target.value })}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder={t('signup.postcode')}
                      />
                    </div>
                  </div>

                  {/* Hourly Rate */}
                  <div>
                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('signup.hourlyRate')} <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {t('signup.maxRate')}: ${formData.credentials === 'SLP' ? '75' : '55'}/hr
                      </span>
                    </label>
                    <input
                      id="hourlyRate"
                      type="number"
                      required
                      min="0"
                      max={formData.credentials === 'SLP' ? 75 : 55}
                      value={formData.hourlyRate}
                      onChange={(e) => {
                        const rate = parseFloat(e.target.value) || 0
                        const maxRate = formData.credentials === 'SLP' ? 75 : 55
                        setFormData({ ...formData, hourlyRate: Math.min(rate, maxRate) })
                      }}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder={t('signup.enterHourlyRate')}
                    />
                  </div>

                  {/* SPA Membership */}
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('signup.spaMembership')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="spaMembershipNumber" className="block text-sm font-medium text-gray-700 mb-2">
                          {t('signup.spaMembershipNumber')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="spaMembershipNumber"
                          type="text"
                          required
                          value={formData.spaMembershipNumber}
                          onChange={(e) => setFormData({ ...formData, spaMembershipNumber: e.target.value })}
                          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder={t('signup.enterSpaMembershipNumber')}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="spaMembershipType" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('signup.membershipType')}
                          </label>
                          <select
                            id="spaMembershipType"
                            value={formData.spaMembershipType}
                            onChange={(e) => setFormData({ ...formData, spaMembershipType: e.target.value })}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          >
                            <option value="">Select Type</option>
                            <option value="Full Member">Full Member</option>
                            <option value="Provisional Member">Provisional Member</option>
                            <option value="Associate Member">Associate Member</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="spaMembershipExpiration" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('signup.expirationDate')}
                          </label>
                          <input
                            id="spaMembershipExpiration"
                            type="date"
                            value={formData.spaMembershipExpiration}
                            onChange={(e) => setFormData({ ...formData, spaMembershipExpiration: e.target.value })}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="spaMembershipFile" className="block text-sm font-medium text-gray-700 mb-2">
                          {t('signup.uploadSpaMembershipCertificate')} <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            id="spaMembershipFile"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                            onChange={(e) => setFormData({ ...formData, spaMembershipFile: e.target.files?.[0] || null })}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                          />
                        </div>
                        {formData.spaMembershipFile && (
                          <p className="text-xs text-green-600 mt-1">✓ {formData.spaMembershipFile.name}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* State Registration */}
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('signup.stateRegistration')}</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="stateRegistrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('signup.stateRegistrationNumber')} <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="stateRegistrationNumber"
                            type="text"
                            required
                            value={formData.stateRegistrationNumber}
                            onChange={(e) => setFormData({ ...formData, stateRegistrationNumber: e.target.value })}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder={t('signup.enterStateRegistrationNumber')}
                          />
                        </div>
                        <div>
                          <label htmlFor="stateRegistrationState" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('signup.registrationState')} <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="stateRegistrationState"
                            required
                            value={formData.stateRegistrationState}
                            onChange={(e) => setFormData({ ...formData, stateRegistrationState: e.target.value })}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          >
                            <option value="">{t('signup.state')}</option>
                            <option value="NSW">NSW</option>
                            <option value="VIC">VIC</option>
                            <option value="QLD">QLD</option>
                            <option value="SA">SA</option>
                            <option value="WA">WA</option>
                            <option value="TAS">TAS</option>
                            <option value="NT">NT</option>
                            <option value="ACT">ACT</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="stateRegistrationExpiration" className="block text-sm font-medium text-gray-700 mb-2">
                          {t('signup.expirationDate')}
                        </label>
                        <input
                          id="stateRegistrationExpiration"
                          type="date"
                          value={formData.stateRegistrationExpiration}
                          onChange={(e) => setFormData({ ...formData, stateRegistrationExpiration: e.target.value })}
                          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label htmlFor="stateRegistrationFile" className="block text-sm font-medium text-gray-700 mb-2">
                          {t('signup.uploadStateRegistrationDocument')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="stateRegistrationFile"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                          onChange={(e) => setFormData({ ...formData, stateRegistrationFile: e.target.files?.[0] || null })}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                        />
                        {formData.stateRegistrationFile && (
                          <p className="text-xs text-green-600 mt-1">✓ {formData.stateRegistrationFile.name}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Professional Indemnity Insurance */}
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('signup.professionalIndemnityInsurance')}</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="insuranceProvider" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('signup.insuranceProvider')} <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="insuranceProvider"
                            type="text"
                            required
                            value={formData.insuranceProvider}
                            onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder={t('signup.enterInsuranceProvider')}
                          />
                        </div>
                        <div>
                          <label htmlFor="insurancePolicyNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('signup.insurancePolicyNumber')} <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="insurancePolicyNumber"
                            type="text"
                            required
                            value={formData.insurancePolicyNumber}
                            onChange={(e) => setFormData({ ...formData, insurancePolicyNumber: e.target.value })}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder={t('signup.enterPolicyNumber')}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="insuranceCoverageAmount" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('signup.coverageAmount')}
                          </label>
                          <input
                            id="insuranceCoverageAmount"
                            type="text"
                            value={formData.insuranceCoverageAmount}
                            onChange={(e) => setFormData({ ...formData, insuranceCoverageAmount: e.target.value })}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder={t('signup.enterCoverageAmount')}
                          />
                        </div>
                        <div>
                          <label htmlFor="insuranceExpiration" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('signup.expirationDate')}
                          </label>
                          <input
                            id="insuranceExpiration"
                            type="date"
                            value={formData.insuranceExpiration}
                            onChange={(e) => setFormData({ ...formData, insuranceExpiration: e.target.value })}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="insuranceFile" className="block text-sm font-medium text-gray-700 mb-2">
                          {t('signup.uploadInsuranceCertificate')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="insuranceFile"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                          onChange={(e) => setFormData({ ...formData, insuranceFile: e.target.files?.[0] || null })}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                        />
                        {formData.insuranceFile && (
                          <p className="text-xs text-green-600 mt-1">✓ {formData.insuranceFile.name}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Working with Children Check */}
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('signup.workingWithChildrenCheck')}</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="wwccNumber" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('signup.wwccNumber')} <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="wwccNumber"
                            type="text"
                            required
                            value={formData.wwccNumber}
                            onChange={(e) => setFormData({ ...formData, wwccNumber: e.target.value })}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder={t('signup.enterWwccNumber')}
                          />
                        </div>
                        <div>
                          <label htmlFor="wwccState" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('signup.wwccState')} <span className="text-red-500">*</span>
                    </label>
                    <select
                            id="wwccState"
                            required
                            value={formData.wwccState}
                            onChange={(e) => setFormData({ ...formData, wwccState: e.target.value })}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          >
                            <option value="">{t('signup.state')}</option>
                            <option value="NSW">NSW</option>
                            <option value="VIC">VIC</option>
                            <option value="QLD">QLD</option>
                            <option value="SA">SA</option>
                            <option value="WA">WA</option>
                            <option value="TAS">TAS</option>
                            <option value="NT">NT</option>
                            <option value="ACT">ACT</option>
                    </select>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="wwccExpiration" className="block text-sm font-medium text-gray-700 mb-2">
                          {t('signup.expirationDate')}
                        </label>
                        <input
                          id="wwccExpiration"
                          type="date"
                          value={formData.wwccExpiration}
                          onChange={(e) => setFormData({ ...formData, wwccExpiration: e.target.value })}
                          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label htmlFor="wwccFile" className="block text-sm font-medium text-gray-700 mb-2">
                          {t('signup.uploadWwccCertificate')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="wwccFile"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                          onChange={(e) => setFormData({ ...formData, wwccFile: e.target.files?.[0] || null })}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                        />
                        {formData.wwccFile && (
                          <p className="text-xs text-green-600 mt-1">✓ {formData.wwccFile.name}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Police Check */}
                  <div className="border-t pt-4 mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('signup.policeCheck')}</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="policeCheckNumber" className="block text-sm font-medium text-gray-700 mb-2">
                          {t('signup.policeCheckNumber')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="policeCheckNumber"
                          type="text"
                          required
                          value={formData.policeCheckNumber}
                          onChange={(e) => setFormData({ ...formData, policeCheckNumber: e.target.value })}
                          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder={t('signup.enterPoliceCheckNumber')}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="policeCheckIssueDate" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('signup.issueDate')}
                          </label>
                          <input
                            id="policeCheckIssueDate"
                            type="date"
                            value={formData.policeCheckIssueDate}
                            onChange={(e) => setFormData({ ...formData, policeCheckIssueDate: e.target.value })}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label htmlFor="policeCheckExpiration" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('signup.expirationDate')}
                          </label>
                          <input
                            id="policeCheckExpiration"
                            type="date"
                            value={formData.policeCheckExpiration}
                            onChange={(e) => setFormData({ ...formData, policeCheckExpiration: e.target.value })}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>
                  <div>
                        <label htmlFor="policeCheckFile" className="block text-sm font-medium text-gray-700 mb-2">
                          {t('signup.uploadPoliceCheckCertificate')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="policeCheckFile"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          required
                          onChange={(e) => setFormData({ ...formData, policeCheckFile: e.target.files?.[0] || null })}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                        />
                        {formData.policeCheckFile && (
                          <p className="text-xs text-green-600 mt-1">✓ {formData.policeCheckFile.name}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="border-t pt-4 mt-4">
                    <label htmlFor="specializations" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('signup.areasOfExpertise')}
                    </label>
                    <select
                      id="specializations"
                      multiple
                      value={formData.specializations}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value)
                        setFormData({ ...formData, specializations: selected })
                      }}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      size={6}
                    >
                      <option value="Early Intervention">Early Intervention</option>
                      <option value="Articulation & Phonology">Articulation & Phonology</option>
                      <option value="Language Development">Language Development</option>
                      <option value="Fluency/Stuttering">Fluency/Stuttering</option>
                      <option value="Voice Therapy">Voice Therapy</option>
                      <option value="Feeding & Swallowing">Feeding & Swallowing</option>
                      <option value="AAC">AAC</option>
                      <option value="Cognitive-Communication">Cognitive-Communication</option>
                      <option value="Neurogenic Disorders">Neurogenic Disorders</option>
                      <option value="Accent Modification">Accent Modification</option>
                      <option value="Gender-Affirming Voice">Gender-Affirming Voice</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{t('signup.selectMultiple')}</p>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('signup.password')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder={t('signup.createPassword')}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('signup.confirmPassword')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder={t('signup.confirmYourPassword')}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  {t('signup.agreeToTerms')}{' '}
                  <Link href="/terms" className="text-black hover:text-gray-600 transition-colors">
                    {t('signup.termsOfService')}
                  </Link>{' '}
                  {t('signup.and')}{' '}
                  <Link href="/privacy" className="text-black hover:text-gray-600 transition-colors">
                    {t('signup.privacyPolicy')}
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('signup.creatingAccount') : t('signup.createAccount')}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">{t('signup.orContinueWith')}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="ml-2">{t('signup.google')}</span>
                </button>

                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="ml-2">{t('signup.facebook')}</span>
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              {t('signup.alreadyHaveAccount')}{' '}
              <Link href="/login" className="text-black hover:text-gray-600 transition-colors font-medium">
                {t('signup.signIn')}
              </Link>
            </p>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-4">{t('signup.demoAccess')}</p>
              <div className="flex space-x-3">
                <Link href="/dashboard" className="flex-1 bg-gray-100 text-black px-4 py-2 rounded-lg text-center hover:bg-gray-200 transition-colors">
                  {t('signup.therapistDemo')}
                </Link>
                <Link href="/client-dashboard" className="flex-1 bg-gray-100 text-black px-4 py-2 rounded-lg text-center hover:bg-gray-200 transition-colors">
                  {t('signup.clientDemo')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Image/Content */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-md text-center"
        >
          <div className="w-64 h-64 bg-gray-200 rounded-3xl mx-auto mb-8 flex items-center justify-center">
            <div className="text-6xl">🚀</div>
          </div>
          <h2 className="text-2xl font-bold text-black mb-4">
            {userType === 'client' ? t('signup.findRightTherapist') : t('signup.growYourPractice')}
          </h2>
          <p className="text-gray-600 mb-8">
            {userType === 'client' 
              ? t('signup.clientDescription')
              : t('signup.therapistDescription')
            }
          </p>
          <div className="space-y-4 text-left">
            {userType === 'client' ? (
              <>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  <span className="text-gray-700">{t('signup.easyOnlineBooking')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  <span className="text-gray-700">{t('signup.secureVideoSessions')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  <span className="text-gray-700">{t('signup.progressTracking')}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  <span className="text-gray-700">{t('signup.clientManagementTools')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  <span className="text-gray-700">{t('signup.automatedBilling')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  <span className="text-gray-700">{t('signup.resourceLibrary')}</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
