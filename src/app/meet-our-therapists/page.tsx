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
  Heart,
  CheckCircle,
  Filter,
  Search,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  GraduationCap,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import { therapistAPI, translationAPI } from '@/lib/api'
import CredentialsBadge from '@/components/CredentialsBadge'

export default function MeetOurTherapistsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [selectedState, setSelectedState] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [bilingualOnly, setBilingualOnly] = useState(false)
  const [therapists, setTherapists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTherapists()
  }, [selectedSpecialty, selectedState, selectedLanguage, bilingualOnly])

  const fetchTherapists = async () => {
    try {
      setIsLoading(true)
      const params: any = {}

      if (selectedSpecialty !== 'all') {
        params.specialization = selectedSpecialty
      }

      if (selectedState !== 'all') {
        params.state = selectedState
      }

      if (selectedLanguage !== 'all') {
        // Use bilingual therapist API for language filtering
        try {
          const bilingualResponse = await translationAPI.getBilingualTherapists(selectedLanguage)
          const bilingualTherapists = bilingualResponse.data.data || []

          // Filter by other criteria
          let filtered = bilingualTherapists
          if (selectedSpecialty !== 'all') {
            filtered = filtered.filter((t: any) =>
              t.specializations?.includes(selectedSpecialty)
            )
          }
          if (selectedState !== 'all') {
            filtered = filtered.filter((t: any) =>
              t.licensedStates?.includes(selectedState)
            )
          }

          setTherapists(filtered)
          return
        } catch (error) {
          console.error('Failed to fetch bilingual therapists:', error)
        }
      }

      if (bilingualOnly) {
        params.bilingual = 'true'
      }

      const response = await therapistAPI.getAll(params)
      setTherapists(response.data.data.therapists || [])
    } catch (error) {
      console.error('Failed to fetch therapists:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const specialties = [
    'All Specialties',
    'Early Intervention',
    'Articulation & Phonology',
    'Language Development',
    'Fluency/Stuttering',
    'Voice Therapy',
    'Feeding & Swallowing',
    'AAC (Augmentative Communication)',
    'Cognitive-Communication',
    'Adult Neurogenic Disorders',
    'Accent Modification',
    'Gender-Affirming Voice'
  ]

  const states = [
    'All States',
    'California',
    'Texas',
    'New York',
    'Florida',
    'Illinois',
    'Pennsylvania',
    'Ohio',
    'Georgia',
    'North Carolina',
    'Michigan'
  ]

  const languages = [
    { value: 'all', label: 'All Languages' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'ar', label: 'Arabic' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'hi', label: 'Hindi' },
    { value: 'asl', label: 'American Sign Language' },
  ]

  const filteredTherapists = therapists.filter((therapist: any) => {
    const fullName = `${therapist.userId?.firstName || ''} ${therapist.userId?.lastName || ''}`.toLowerCase()
    const matchesSearch = searchTerm === '' ||
      fullName.includes(searchTerm.toLowerCase()) ||
      therapist.specializations?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-black">Rooted Voices</Link>
              <span className="text-gray-400">/</span>
              <h1 className="text-2xl font-bold text-black">Meet Our Therapists</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/services" className="text-gray-600 hover:text-black transition-colors">
                Services
              </Link>
              <Link href="/pricing" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Meet Our Licensed
            <br />
            <span className="gradient-text">Therapists</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our team of certified speech-language pathologists brings years of experience
            and specialized training to help you achieve your communication goals.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl premium-shadow p-6 mb-8"
        >
          <div className="grid md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search therapists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Specialty Filter */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              {specialties.map(specialty => (
                <option key={specialty} value={specialty === 'All Specialties' ? 'all' : specialty}>
                  {specialty}
                </option>
              ))}
            </select>

            {/* State Filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              {states.map(state => (
                <option key={state} value={state === 'All States' ? 'all' : state}>
                  {state}
                </option>
              ))}
            </select>

            {/* Language Filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>

            {/* Bilingual Toggle & Results Count */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bilingualOnly}
                  onChange={(e) => setBilingualOnly(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Bilingual Only</span>
              </label>
              <span className="text-xs text-gray-600">
                {filteredTherapists.length} found
              </span>
            </div>
          </div>
        </motion.div>

        {/* Therapists Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading therapists...</p>
          </div>
        ) : filteredTherapists.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600">No therapists found matching your criteria</p>
            <button
              onClick={() => {
                setSelectedSpecialty('all')
                setSelectedState('all')
                setSelectedLanguage('all')
                setBilingualOnly(false)
                setSearchTerm('')
              }}
              className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTherapists.map((therapist, index) => (
              <motion.div
                key={therapist._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl premium-shadow overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Therapist Image */}
                <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-gray-700">
                      {therapist.userId ? getInitials(therapist.userId.firstName, therapist.userId.lastName) : 'NA'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Basic Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-black mb-1">
                      {therapist.userId ? `${therapist.userId.firstName} ${therapist.userId.lastName}` : 'Unknown Therapist'}
                    </h3>
                    <p className="text-gray-600 mb-2">Speech-Language Pathologist</p>
                    <div className="mb-3">
                      <CredentialsBadge
                        credentials={therapist.credentials || 'SLP'}
                        canSupervise={therapist.canSupervise || false}
                        size="sm"
                      />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(therapist.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {(therapist.rating || 0).toFixed(1)} ({therapist.totalReviews || 0} reviews)
                      </span>
                    </div>

                    {/* Verified Badge */}
                    {therapist.isVerified && (
                      <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </div>
                    )}
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-black mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-1">
                      {(therapist.specializations || []).slice(0, 3).map((specialty: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                      {(therapist.specializations?.length || 0) > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{therapist.specializations.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* States */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{(therapist.licensedStates || []).join(', ') || 'Multiple states'}</span>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{therapist.experience || 0} years experience</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{therapist.totalSessions || 0} sessions completed</span>
                    </div>
                  </div>

                  {/* Bio Preview */}
                  <p className="text-sm text-gray-600 mb-6 line-clamp-3">
                    {therapist.bio || 'Experienced speech-language pathologist dedicated to helping clients achieve their communication goals.'}
                  </p>

                  {/* Pricing */}
                  <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Consultation:</span>
                      <span className="text-sm text-green-600 font-medium">Free 15-min</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link
                      href={`/therapist-profile/${therapist._id}`}
                      className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center group"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      View Profile
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href="/pricing"
                      className="w-full border border-gray-300 text-black py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Consultation
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-white rounded-2xl premium-shadow p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Why Choose Our Therapists?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All our therapists are licensed, certified, and committed to providing
              evidence-based, personalized care.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Licensed & Certified',
                description: 'All therapists hold current licenses and ASHA certification (CCC-SLP).'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'HIPAA Compliant',
                description: 'Secure, confidential therapy sessions with full privacy protection.'
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Personalized Care',
                description: 'Individualized treatment plans tailored to your specific needs and goals.'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-black">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-black mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation with one of our experienced therapists
            and take the first step towards better communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/pricing" className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center group">
              View Pricing Plans
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/services" className="border border-gray-300 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300">
              Learn About Our Services
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
