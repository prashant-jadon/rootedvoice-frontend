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

export default function MeetOurTherapistsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [selectedState, setSelectedState] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

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

  const therapists = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      title: 'Speech-Language Pathologist',
      credentials: 'CCC-SLP, PhD',
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviewCount: 127,
      specialties: ['Early Intervention', 'Language Development', 'AAC'],
      states: ['California', 'Texas', 'New York'],
      experience: '8 years',
      languages: ['English', 'Mandarin', 'Spanish'],
      availability: 'Mon-Fri, Evenings',
      bio: 'Dr. Chen specializes in early intervention and bilingual language development. She has extensive experience working with children with autism spectrum disorder and developmental delays.',
      education: 'PhD in Communication Sciences, Stanford University',
      certifications: ['ASHA CCC-SLP', 'Early Intervention Specialist', 'AAC Specialist'],
      hourlyRate: '$85-95',
      consultationFee: 'Free 15-min consultation'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      title: 'Speech-Language Pathologist',
      credentials: 'CCC-SLP, MS',
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviewCount: 89,
      specialties: ['Articulation & Phonology', 'Fluency/Stuttering', 'Voice Therapy'],
      states: ['Florida', 'Georgia', 'Texas'],
      experience: '6 years',
      languages: ['English', 'Spanish'],
      availability: 'Mon-Sat, Flexible',
      bio: 'Michael focuses on articulation disorders and fluency therapy. He has a passion for working with school-age children and adolescents.',
      education: 'MS in Speech-Language Pathology, University of Florida',
      certifications: ['ASHA CCC-SLP', 'Fluency Specialist', 'Voice Therapy Certified'],
      hourlyRate: '$75-85',
      consultationFee: 'Free 15-min consultation'
    },
    {
      id: 3,
      name: 'Dr. Jennifer Kim',
      title: 'Speech-Language Pathologist',
      credentials: 'CCC-SLP, PhD',
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviewCount: 156,
      specialties: ['Adult Neurogenic Disorders', 'Cognitive-Communication', 'Feeding & Swallowing'],
      states: ['California', 'New York', 'Illinois'],
      experience: '12 years',
      languages: ['English', 'Korean'],
      availability: 'Mon-Fri, Some Weekends',
      bio: 'Dr. Kim is an expert in adult neurogenic communication disorders, particularly aphasia and cognitive-communication impairments following stroke and brain injury.',
      education: 'PhD in Speech-Language Pathology, Northwestern University',
      certifications: ['ASHA CCC-SLP', 'Board Certified Specialist in Adult Neurogenic Disorders', 'Dysphagia Specialist'],
      hourlyRate: '$95-105',
      consultationFee: 'Free 15-min consultation'
    },
    {
      id: 4,
      name: 'Emily Thompson',
      title: 'Speech-Language Pathologist',
      credentials: 'CCC-SLP, MS',
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviewCount: 73,
      specialties: ['Voice Therapy', 'Gender-Affirming Voice', 'Accent Modification'],
      states: ['New York', 'Pennsylvania', 'Ohio'],
      experience: '5 years',
      languages: ['English', 'French'],
      availability: 'Mon-Fri, Evenings',
      bio: 'Emily specializes in voice therapy and gender-affirming voice services. She has extensive training in working with transgender and non-binary individuals.',
      education: 'MS in Speech-Language Pathology, Columbia University',
      certifications: ['ASHA CCC-SLP', 'Gender-Affirming Voice Specialist', 'Accent Modification Certified'],
      hourlyRate: '$80-90',
      consultationFee: 'Free 15-min consultation'
    },
    {
      id: 5,
      name: 'Dr. Marcus Johnson',
      title: 'Speech-Language Pathologist',
      credentials: 'CCC-SLP, PhD',
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviewCount: 94,
      specialties: ['Feeding & Swallowing', 'Early Intervention', 'AAC'],
      states: ['Texas', 'Florida', 'Georgia'],
      experience: '10 years',
      languages: ['English', 'Portuguese'],
      availability: 'Mon-Fri, Flexible',
      bio: 'Dr. Johnson is a feeding and swallowing specialist with expertise in pediatric dysphagia and complex feeding disorders.',
      education: 'PhD in Communication Sciences, University of Texas',
      certifications: ['ASHA CCC-SLP', 'Pediatric Feeding Specialist', 'AAC Specialist'],
      hourlyRate: '$85-95',
      consultationFee: 'Free 15-min consultation'
    },
    {
      id: 6,
      name: 'Lisa Wang',
      title: 'Speech-Language Pathologist',
      credentials: 'CCC-SLP, MS',
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviewCount: 112,
      specialties: ['Language Development', 'Cognitive-Communication', 'Early Intervention'],
      states: ['California', 'Washington', 'Oregon'],
      experience: '7 years',
      languages: ['English', 'Mandarin', 'Cantonese'],
      availability: 'Mon-Sat, Flexible',
      bio: 'Lisa specializes in language development and cognitive-communication therapy for children and adults with developmental disabilities.',
      education: 'MS in Speech-Language Pathology, University of California, Berkeley',
      certifications: ['ASHA CCC-SLP', 'Early Intervention Specialist', 'Cognitive-Communication Specialist'],
      hourlyRate: '$75-85',
      consultationFee: 'Free 15-min consultation'
    }
  ]

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSpecialty = selectedSpecialty === 'all' || therapist.specialties.includes(selectedSpecialty)
    const matchesState = selectedState === 'all' || therapist.states.includes(selectedState)
    const matchesSearch = searchTerm === '' || 
      therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapist.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSpecialty && matchesState && matchesSearch
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
          <div className="grid md:grid-cols-4 gap-4">
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

            {/* Results Count */}
            <div className="flex items-center justify-center text-gray-600">
              <span className="text-sm">
                {filteredTherapists.length} therapist{filteredTherapists.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
        </motion.div>

        {/* Therapists Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTherapists.map((therapist, index) => (
            <motion.div
              key={therapist.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl premium-shadow overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Therapist Image */}
              <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-500" />
                </div>
              </div>

              <div className="p-6">
                {/* Basic Info */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-black mb-1">{therapist.name}</h3>
                  <p className="text-gray-600 mb-2">{therapist.title}</p>
                  <p className="text-sm text-gray-500 mb-3">{therapist.credentials}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(therapist.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {therapist.rating} ({therapist.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-black mb-2">Specialties:</h4>
                  <div className="flex flex-wrap gap-1">
                    {therapist.specialties.slice(0, 3).map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                    {therapist.specialties.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{therapist.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* States */}
                <div className="mb-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{therapist.states.join(', ')}</span>
                  </div>
                </div>

                {/* Experience & Languages */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{therapist.experience} experience</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span>{therapist.languages.join(', ')}</span>
                  </div>
                </div>

                {/* Bio Preview */}
                <p className="text-sm text-gray-600 mb-6 line-clamp-3">
                  {therapist.bio}
                </p>

                {/* Pricing */}
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Hourly Rate:</span>
                    <span className="font-semibold text-black">{therapist.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">Consultation:</span>
                    <span className="text-sm text-green-600 font-medium">{therapist.consultationFee}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    href={`/therapist-profile/${therapist.id}`}
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

        {/* No Results */}
        {filteredTherapists.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">No therapists found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search terms to find the right therapist for you.
            </p>
            <button
              onClick={() => {
                setSelectedSpecialty('all')
                setSelectedState('all')
                setSearchTerm('')
              }}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
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
