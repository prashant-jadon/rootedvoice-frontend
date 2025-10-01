'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Baby, 
  User, 
  ArrowRight, 
  CheckCircle,
  Calendar,
  MessageCircle,
  Heart,
  Award,
  Shield
} from 'lucide-react'
import Link from 'next/link'

export default function ClientServicesPage() {
  const [selectedType, setSelectedType] = useState<'child' | 'adult' | null>(null)

  const childServices = [
    {
      category: 'Infants & Toddlers (0-3 years)',
      services: [
        'Early intervention for speech, language, and feeding',
        'Parent coaching on communication strategies',
        'Feeding and swallowing therapy (latching, bottle feeding, transitioning to solids)',
        'Assessment of developmental milestones',
        'Augmentative and alternative communication (AAC) introduction if needed'
      ]
    },
    {
      category: 'Preschool & School-Age Children (3-12 years)',
      services: [
        'Articulation and phonological disorder treatment',
        'Language development (vocabulary, grammar, sentence structure)',
        'Social communication and pragmatic skills training',
        'Stuttering/fluency therapy',
        'Literacy support (reading, writing, phonological awareness)',
        'Voice therapy (hoarseness, vocal misuse)',
        'Feeding and swallowing therapy (oral-motor skills, picky eating)',
        'AAC assessment and training for complex needs'
      ]
    },
    {
      category: 'Adolescents (13-18 years)',
      services: [
        'Academic language skills (comprehension, writing, organization)',
        'Fluency and stuttering therapy',
        'Voice therapy (including gender-affirming voice services)',
        'Social communication skills (peer interaction, conflict resolution)',
        'Executive function support (organization, planning, memory)',
        'AAC device customization and training',
        'Feeding/swallowing if medically needed'
      ]
    }
  ]

  const adultServices = [
    {
      category: 'Adults (18+ years)',
      services: [
        'Aphasia therapy (language loss after stroke or brain injury)',
        'Cognitive-communication therapy (attention, memory, problem-solving)',
        'Speech and intelligibility therapy (Parkinson\'s, ALS, TBI)',
        'Voice therapy (vocal strain, nodules, professional voice users)',
        'Fluency therapy for adults who stutter',
        'Swallowing and feeding therapy (dysphagia management)',
        'Accent modification (if desired)',
        'AAC services for complex communication needs'
      ]
    },
    {
      category: 'Older Adults & Geriatrics (65+ years)',
      services: [
        'Cognitive-communication therapy for dementia and memory decline',
        'Compensatory strategies for daily living communication',
        'Swallowing therapy (safe eating and drinking strategies)',
        'Voice care for age-related changes (presbyphonia)',
        'Support for maintaining social connection and quality of life'
      ]
    }
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
              <h1 className="text-2xl font-bold text-black">Find Services</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/services" className="text-gray-600 hover:text-black transition-colors">
                All Services
              </Link>
              <Link href="/meet-our-therapists" className="text-gray-600 hover:text-black transition-colors">
                Meet Our Therapists
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!selectedType ? (
          /* Selection Screen */
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Who are the services for?
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Select who will be receiving therapy to see our specialized services and find the right therapist for your needs.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Child Services */}
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                onClick={() => setSelectedType('child')}
                className="bg-white p-12 rounded-2xl premium-shadow hover:shadow-xl transition-all duration-300 group text-left"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Baby className="w-12 h-12 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-3">Child Services</h2>
                  <p className="text-gray-600 mb-6">
                    For infants, toddlers, children, and adolescents (0-18 years)
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>• Early intervention</p>
                    <p>• Language development</p>
                    <p>• Articulation therapy</p>
                    <p>• Academic support</p>
                  </div>
                  <div className="mt-6 flex items-center text-black group-hover:translate-x-2 transition-transform">
                    <span className="font-semibold">Explore Services</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </motion.button>

              {/* Adult Services */}
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onClick={() => setSelectedType('adult')}
                className="bg-white p-12 rounded-2xl premium-shadow hover:shadow-xl transition-all duration-300 group text-left"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <User className="w-12 h-12 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-black mb-3">Adult Services</h2>
                  <p className="text-gray-600 mb-6">
                    For adults and older adults (18+ years)
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>• Aphasia therapy</p>
                    <p>• Voice therapy</p>
                    <p>• Cognitive communication</p>
                    <p>• Swallowing therapy</p>
                  </div>
                  <div className="mt-6 flex items-center text-black group-hover:translate-x-2 transition-transform">
                    <span className="font-semibold">Explore Services</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Why Choose Us */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 bg-white rounded-2xl premium-shadow p-8"
            >
              <h2 className="text-2xl font-bold text-black text-center mb-8">Why Choose Rooted Voices?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Shield className="w-8 h-8" />,
                    title: 'HIPAA Compliant',
                    description: 'Secure, confidential therapy sessions'
                  },
                  {
                    icon: <Award className="w-8 h-8" />,
                    title: 'Licensed Professionals',
                    description: 'Certified, experienced therapists'
                  },
                  {
                    icon: <Heart className="w-8 h-8" />,
                    title: 'Personalized Care',
                    description: 'Treatment plans tailored to your needs'
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
          </div>
        ) : (
          /* Services Detail Screen */
          <div>
            <div className="mb-8 flex items-center justify-between">
              <button 
                onClick={() => setSelectedType(null)}
                className="inline-flex items-center text-gray-600 hover:text-black transition-colors group"
              >
                <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Back to Selection
              </button>
              <div className="flex items-center space-x-2">
                <Link href="/meet-our-therapists" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                  Find a Therapist
                </Link>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {selectedType === 'child' ? (
                  <Baby className="w-10 h-10 text-blue-600" />
                ) : (
                  <User className="w-10 h-10 text-purple-600" />
                )}
              </div>
              <h1 className="text-4xl font-bold text-black mb-4">
                {selectedType === 'child' ? 'Child & Adolescent' : 'Adult'} Services
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {selectedType === 'child' 
                  ? 'Comprehensive speech and language therapy services for children at every developmental stage'
                  : 'Specialized therapy services for adults addressing communication, voice, and swallowing needs'
                }
              </p>
            </motion.div>

            <div className="space-y-8">
              {(selectedType === 'child' ? childServices : adultServices).map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl premium-shadow p-8"
                >
                  <h2 className="text-2xl font-bold text-black mb-6">{category.category}</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {category.services.map((service, serviceIndex) => (
                      <div key={serviceIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-12 text-center"
            >
              <h2 className="text-2xl font-bold text-black mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Find a therapist specializing in {selectedType === 'child' ? 'pediatric' : 'adult'} services 
                and schedule your free consultation today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/meet-our-therapists" className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center group justify-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Find a Therapist
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/pricing" className="border border-gray-300 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  View Pricing
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
