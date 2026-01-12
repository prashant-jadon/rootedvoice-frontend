'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Star, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Calendar, 
  Award, 
  Users, 
  CheckCircle,
  ArrowLeft,
  Globe,
  GraduationCap,
  Video,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { therapistAPI, subscriptionAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import CredentialsBadge from '@/components/CredentialsBadge'

export default function TherapistProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [therapist, setTherapist] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [subscription, setSubscription] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchTherapistProfile()
  }, [params.id])

  const fetchTherapistProfile = async () => {
    try {
      setIsLoading(true)
      const response = await therapistAPI.getById(params.id)
      setTherapist(response.data.data.therapist)
      setReviews(response.data.data.reviews || [])

      // Check if user has subscription (for booking)
      if (isAuthenticated && user?.role === 'client') {
        try {
          const subRes = await subscriptionAPI.getCurrent()
          setSubscription(subRes.data.data)
        } catch (error) {
          // No subscription
          setSubscription(null)
        }
      }
    } catch (error) {
      console.error('Failed to fetch therapist:', error)
      router.push('/meet-our-therapists')
    } finally {
      setIsLoading(false)
    }
  }

  const handleScheduleClick = () => {
    if (!isAuthenticated) {
      router.push(`/signup?therapist=${params.id}`)
      return
    }

    if (user?.role === 'therapist') {
      alert('Therapists cannot book sessions as clients')
      return
    }

    if (!subscription) {
      // No subscription - go to pricing
      router.push('/pricing')
      return
    }

    // Has subscription - go to booking
    router.push(`/book-session?therapistId=${params.id}`)
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Users className="w-4 h-4" /> },
    { id: 'specialties', label: 'Specialties', icon: <Award className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'availability', label: 'Availability', icon: <Calendar className="w-4 h-4" /> }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading therapist profile...</p>
        </div>
      </div>
    )
  }

  if (!therapist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl text-gray-600 mb-4">Therapist not found</p>
          <Link href="/meet-our-therapists" className="text-black hover:text-gray-600">
            Back to Therapists
          </Link>
        </div>
      </div>
    )
  }

  const therapistName = therapist.userId ? `${therapist.userId.firstName} ${therapist.userId.lastName}` : 'Unknown'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-black">Rooted Voices</Link>
              <span className="text-gray-400">/</span>
              <Link href="/meet-our-therapists" className="text-gray-600 hover:text-black transition-colors">
                Meet Our Therapists
              </Link>
              <span className="text-gray-400">/</span>
              <h1 className="text-lg font-bold text-black">{therapistName}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/services" className="text-gray-600 hover:text-black transition-colors">
                Services
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-black transition-colors">
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/meet-our-therapists" 
            className="inline-flex items-center text-gray-600 hover:text-black transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Therapists
          </Link>
        </div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl premium-shadow p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-5xl font-bold text-gray-700">
                    {therapist.userId ? getInitials(therapist.userId.firstName, therapist.userId.lastName) : 'NA'}
                  </span>
                </div>
              </div>
              
              {therapist.isVerified && (
                <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verified Professional
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-black mb-2">
                Dr. {therapistName}
              </h1>
              <p className="text-xl text-gray-600 mb-2">Speech-Language Pathologist</p>
              <p className="text-gray-500 mb-4">{therapist.credentials || 'CCC-SLP'}</p>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(therapist.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-black">{(therapist.rating || 0).toFixed(1)}</span>
                <span className="text-gray-600">({therapist.totalReviews || 0} reviews)</span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">{therapist.experience || 0}</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">{therapist.specializations?.length || 0}</div>
                  <div className="text-sm text-gray-600">Specialties</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">{therapist.licensedStates?.length || 0}</div>
                  <div className="text-sm text-gray-600">States</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">{therapist.totalSessions || 0}</div>
                  <div className="text-sm text-gray-600">Sessions</div>
                </div>
              </div>

              {/* Location & Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Licensed in: {(therapist.licensedStates || []).join(', ') || 'Multiple states'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{therapist.experience || 0} years of experience</span>
                </div>
                {therapist.userId?.email && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MessageCircle className="w-4 h-4" />
                    <span>{therapist.userId.email}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleScheduleClick}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center group"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {!isAuthenticated 
                    ? 'Sign Up to Book' 
                    : !subscription 
                    ? 'Choose Plan to Book' 
                    : 'Schedule Consultation'}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border border-gray-300 text-black px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl premium-shadow p-6 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl premium-shadow p-8">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-black mb-6">About Dr. {therapistName}</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                {therapist.bio || `Dr. ${therapistName} is an experienced speech-language pathologist dedicated to providing evidence-based therapy and personalized care. With ${therapist.experience || 0} years of experience, they specialize in helping clients achieve their communication goals through compassionate and effective treatment approaches.`}
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Education</h3>
                  {therapist.education && therapist.education.length > 0 ? (
                  <ul className="space-y-2">
                      {therapist.education.map((edu: any, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <GraduationCap className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-600">{edu.degree} - {edu.institution} ({edu.year})</span>
                      </li>
                    ))}
                  </ul>
                  ) : (
                    <p className="text-gray-500 italic">Education information not provided</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Clinical Role & Credentials</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Clinical Role:</span>
                        <CredentialsBadge 
                          credentials={therapist.credentials || 'SLP'} 
                          canSupervise={therapist.canSupervise || false}
                          size="sm"
                        />
                      </div>
                    </li>
                    {therapist.complianceDocuments?.stateLicensure?.licenseNumber && (
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">
                          State License: {therapist.complianceDocuments.stateLicensure.licenseNumber} 
                          {therapist.complianceDocuments.stateLicensure.state && ` (${therapist.complianceDocuments.stateLicensure.state})`}
                        </span>
                      </li>
                    )}
                    {therapist.credentials === 'SLP' && therapist.complianceDocuments?.ashaCertification?.certificationNumber && (
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">
                          ASHA Certification (CCC-SLP): {therapist.complianceDocuments.ashaCertification.certificationNumber}
                        </span>
                      </li>
                    )}
                    {therapist.credentials === 'SLPA' && therapist.complianceDocuments?.supervision?.supervisingSLPName && (
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">
                          Supervised by: {therapist.complianceDocuments.supervision.supervisingSLPName}
                        </span>
                      </li>
                    )}
                    {therapist.isVerified && (
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">Verified by Rooted Voices</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'specialties' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-black mb-6">Specialties & Expertise</h2>
              
              <div className="mb-8">
                  <h3 className="text-lg font-semibold text-black mb-4">Areas of Expertise</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {(therapist.specializations || []).map((specialty: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{specialty}</span>
                      </div>
                    ))}
                </div>
                {(!therapist.specializations || therapist.specializations.length === 0) && (
                  <p className="text-gray-500 italic">No specializations listed</p>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">Licensed States</h3>
                <div className="flex flex-wrap gap-2">
                  {(therapist.licensedStates || []).map((state: string, index: number) => (
                    <span key={index} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">
                      {state}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-black mb-6">Client Reviews</h2>
              
              {reviews.length > 0 ? (
              <div className="space-y-6">
                  {reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-black">
                              {review.isAnonymous ? 'Anonymous' : 'Client'}
                            </h4>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                      {review.response && (
                        <div className="mt-4 ml-12 p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm font-semibold text-black mb-1">Response from Dr. {therapistName}:</p>
                          <p className="text-sm text-gray-600">{review.response}</p>
                        </div>
                      )}
                  </div>
                ))}
              </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No reviews yet</p>
                  <p className="text-sm text-gray-500 mt-2">Be the first to review this therapist!</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'availability' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-black mb-6">Availability & Pricing</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Weekly Schedule</h3>
                  {therapist.availability && therapist.availability.length > 0 ? (
                  <div className="space-y-3">
                      {therapist.availability.map((slot: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-black capitalize">{slot.day}</span>
                          <span className="text-gray-600">{slot.startTime} - {slot.endTime}</span>
                      </div>
                    ))}
                  </div>
                  ) : (
                    <div className="p-6 bg-gray-50 rounded-lg text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">Availability not set</p>
                      <p className="text-sm text-gray-500 mt-1">Contact therapist for scheduling</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Pricing</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-black">Hourly Rate</span>
                        <span className="text-lg font-bold text-black">${therapist.hourlyRate || 85}/hr</span>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-black">Initial Consultation</span>
                        <span className="text-green-600 font-medium">Free 15-min</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-black mb-2">Session Options</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span>30-minute sessions available</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span>45-minute sessions available</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span>60-minute sessions available</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl premium-shadow p-8 mt-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Schedule a free 15-minute consultation with Dr. {therapistName} to discuss your goals and see if we're a good fit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleScheduleClick}
              className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              {!isAuthenticated 
                ? 'Sign Up & Schedule' 
                : !subscription 
                ? 'Choose Plan & Schedule' 
                : 'Schedule Free Consultation'}
            </button>
            <Link
              href="/meet-our-therapists"
              className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition-colors font-semibold"
            >
              Browse Other Therapists
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
