'use client'

import { motion } from 'framer-motion'
import { 
  Baby, 
  Users, 
  GraduationCap, 
  User, 
  Heart, 
  CheckCircle, 
  Star,
  ArrowRight,
  MessageCircle,
  Calendar,
  Shield,
  Award
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function ServicesPage() {
  const t = useTranslation()
  const services = [
    {
      id: 'infants-toddlers',
      title: 'Infants & Toddlers',
      ageRange: '0–3 years',
      icon: <Baby className="w-8 h-8" />,
      color: 'bg-pink-500',
      description: 'Early intervention and foundational communication development',
      features: [
        'Early intervention for speech, language, and feeding',
        'Parent coaching on communication strategies',
        'Feeding and swallowing therapy (latching, bottle feeding, transitioning to solids)',
        'Assessment of developmental milestones',
        'Augmentative and alternative communication (AAC) introduction if needed'
      ]
    },
    {
      id: 'preschool-school',
      title: 'Preschool & School-Age Children',
      ageRange: '3–12 years',
      icon: <Users className="w-8 h-8" />,
      color: 'bg-blue-500',
      description: 'Comprehensive speech and language development for growing minds',
      features: [
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
      id: 'adolescents',
      title: 'Adolescents',
      ageRange: '13–18 years',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'bg-green-500',
      description: 'Advanced communication skills for academic and social success',
      features: [
        'Academic language skills (comprehension, writing, organization)',
        'Fluency and stuttering therapy',
        'Voice therapy (including gender-affirming voice services)',
        'Social communication skills (peer interaction, conflict resolution)',
        'Executive function support (organization, planning, memory strategies)',
        'AAC device customization and training',
        'Feeding/swallowing if medically needed'
      ]
    },
    {
      id: 'adults',
      title: 'Adults',
      ageRange: '18+ years',
      icon: <User className="w-8 h-8" />,
      color: 'bg-purple-500',
      description: 'Professional and personal communication enhancement',
      features: [
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
      id: 'older-adults',
      title: 'Older Adults & Geriatrics',
      ageRange: '65+ years',
      icon: <Heart className="w-8 h-8" />,
      color: 'bg-orange-500',
      description: 'Maintaining communication and quality of life in golden years',
      features: [
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
              <Link href="/" className="flex items-center">
                <img 
                  src="/logorooted 1.png" 
                  alt="Rooted Voices Speech & Language Therapy" 
                   className="w-18 h-20 mr-2"
                />
                <span className="text-2xl font-bold text-black">Rooted Voices</span>
              </Link>
              <span className="text-gray-400">/</span>
              <h1 className="text-2xl font-bold text-black">Services</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/meet-our-therapists" className="text-gray-600 hover:text-black transition-colors">
                Meet Our Therapists
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
            {t('services.heroTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('services.heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/meet-our-therapists" className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center group">
              {t('nav.therapists')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/pricing" className="border border-gray-300 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300">
              {t('nav.pricing')}
            </Link>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="space-y-16">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl premium-shadow p-8"
            >
              <div className="flex items-start space-x-6">
                <div className={`${service.color} p-4 rounded-2xl text-white flex-shrink-0`}>
                  {service.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h2 className="text-3xl font-bold text-black">{service.title}</h2>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                      {service.ageRange}
                    </span>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-6">{service.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Link 
                      href="/meet-our-therapists" 
                      className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center group"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {t('nav.findTherapists')}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      href="/pricing" 
                      className="border border-gray-300 text-black px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {t('services.bookConsultation')}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-white rounded-2xl premium-shadow p-8"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">{t('services.whyChooseTitle')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('services.whyChooseDesc')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'HIPAA Compliant',
                description: 'Secure, confidential therapy sessions with full compliance to healthcare privacy standards.'
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Licensed Professionals',
                description: 'All therapists are licensed, certified, and experienced in their specialized areas.'
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: 'Evidence-Based Care',
                description: 'Treatment approaches backed by research and proven to deliver results.'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-black">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
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
          <h2 className="text-3xl font-bold text-black mb-4">{t('services.readyTitle')}</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('services.readySubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/meet-our-therapists" className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center group">
              {t('nav.therapists')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/pricing" className="border border-gray-300 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300">
              {t('nav.pricing')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
