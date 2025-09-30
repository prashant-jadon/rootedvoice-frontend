'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
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
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  GraduationCap,
  Shield,
  FileText,
  Video,
  BookOpen,
  Languages,
  Certificate,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export default function TherapistProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock therapist data - in a real app, this would be fetched based on params.id
  const therapist = {
    id: params.id,
    name: 'Dr. Sarah Chen',
    title: 'Speech-Language Pathologist',
    credentials: 'CCC-SLP, PhD',
    image: '/api/placeholder/400/400',
    rating: 4.9,
    reviewCount: 127,
    specialties: [
      'Early Intervention',
      'Language Development', 
      'AAC (Augmentative Communication)',
      'Autism Spectrum Disorder',
      'Bilingual Therapy'
    ],
    states: ['California', 'Texas', 'New York'],
    experience: '8 years',
    languages: ['English', 'Mandarin', 'Spanish'],
    availability: 'Mon-Fri, Evenings',
    bio: 'Dr. Chen specializes in early intervention and bilingual language development. She has extensive experience working with children with autism spectrum disorder and developmental delays. Her research focuses on culturally responsive therapy approaches and family-centered care.',
    education: [
      'PhD in Communication Sciences, Stanford University (2016)',
      'MS in Speech-Language Pathology, UC Berkeley (2014)',
      'BA in Linguistics, UCLA (2012)'
    ],
    certifications: [
      'ASHA CCC-SLP (Certificate of Clinical Competence)',
      'Early Intervention Specialist Certification',
      'AAC Specialist Certification',
      'Autism Spectrum Disorder Specialist',
      'Bilingual Service Provider Certification'
    ],
    hourlyRate: '$85-95',
    consultationFee: 'Free 15-min consultation',
    sessionTypes: ['Individual Therapy', 'Family Sessions', 'Group Therapy', 'Consultations'],
    ageGroups: ['Infants (0-3)', 'Preschool (3-5)', 'School Age (6-12)', 'Adolescents (13-18)'],
    insurance: ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare', 'Medicaid'],
    reviews: [
      {
        name: 'Maria Rodriguez',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Dr. Chen has been amazing with my 4-year-old son. Her bilingual approach has helped him so much with his language development.'
      },
      {
        name: 'Jennifer Kim',
        rating: 5,
        date: '1 month ago',
        comment: 'Professional, patient, and incredibly knowledgeable. My daughter looks forward to her sessions every week.'
      },
      {
        name: 'David Thompson',
        rating: 5,
        date: '2 months ago',
        comment: 'Dr. Chen\'s expertise in AAC has been life-changing for our family. Highly recommend!'
      }
    ],
    availability: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 6:00 PM',
      saturday: '10:00 AM - 2:00 PM',
      sunday: 'Closed'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Users className="w-4 h-4" /> },
    { id: 'specialties', label: 'Specialties', icon: <Award className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'availability', label: 'Availability', icon: <Calendar className="w-4 h-4" /> }
  ]

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
              <h1 className="text-2xl font-bold text-black">{therapist.name}</h1>
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
              <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                  <Users className="w-16 h-16 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-black mb-2">{therapist.name}</h1>
              <p className="text-xl text-gray-600 mb-2">{therapist.title}</p>
              <p className="text-gray-500 mb-4">{therapist.credentials}</p>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(therapist.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-black">{therapist.rating}</span>
                <span className="text-gray-600">({therapist.reviewCount} reviews)</span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">{therapist.experience}</div>
                  <div className="text-sm text-gray-600">Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">{therapist.specialties.length}</div>
                  <div className="text-sm text-gray-600">Specialties</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">{therapist.languages.length}</div>
                  <div className="text-sm text-gray-600">Languages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">{therapist.states.length}</div>
                  <div className="text-sm text-gray-600">States</div>
                </div>
              </div>

              {/* Location & Languages */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Licensed in: {therapist.states.join(', ')}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Globe className="w-4 h-4" />
                  <span>Languages: {therapist.languages.join(', ')}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Availability: {therapist.availability}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/pricing"
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center group"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Consultation
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
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
              <h2 className="text-2xl font-bold text-black mb-6">About {therapist.name}</h2>
              <p className="text-gray-600 leading-relaxed mb-8">{therapist.bio}</p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Education</h3>
                  <ul className="space-y-2">
                    {therapist.education.map((edu, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <GraduationCap className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Certifications</h3>
                  <ul className="space-y-2">
                    {therapist.certifications.map((cert, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Certificate className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">{cert}</span>
                      </li>
                    ))}
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
              <h2 className="text-2xl font-bold text-black mb-6">Specialties & Services</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Areas of Expertise</h3>
                  <div className="space-y-3">
                    {therapist.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Session Types</h3>
                  <div className="space-y-3">
                    {therapist.sessionTypes.map((type, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Video className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <span className="text-gray-600">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-black mb-4">Age Groups Served</h3>
                <div className="flex flex-wrap gap-2">
                  {therapist.ageGroups.map((age, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {age}
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
              <div className="space-y-6">
                {therapist.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-black">{review.name}</h4>
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
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'availability' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-black mb-6">Availability</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Weekly Schedule</h3>
                  <div className="space-y-3">
                    {Object.entries(therapist.availability).map(([day, time]) => (
                      <div key={day} className="flex justify-between items-center">
                        <span className="font-medium text-black capitalize">{day}</span>
                        <span className="text-gray-600">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Pricing</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-black">Hourly Rate</span>
                        <span className="text-lg font-bold text-black">{therapist.hourlyRate}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-black">Consultation</span>
                        <span className="text-green-600 font-medium">{therapist.consultationFee}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold text-black mb-3">Accepted Insurance</h4>
                    <div className="flex flex-wrap gap-2">
                      {therapist.insurance.map((ins, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {ins}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
