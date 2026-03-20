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
  Award,
  Globe,
  Target
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function ServicesPage() {
  const t = useTranslation()
  const services = [
    {
      id: 'pediatric',
      title: 'Pediatric',
      ageRange: '0–12 years',
      icon: <Baby className="w-8 h-8" />,
      color: 'bg-blue-500',
      description: 'Support for early milestones, language development, and school success.',
      features: [
        'Children who are late to talk',
        'Children who are hard to understand (articulation)',
        'Struggles with reading, writing, and language at school',
        'Feeding or swallowing challenges, including picky eating',
        'Support for children with autism',
        'Children who use alternative ways to communicate (AAC)',
        'Parent coaching for infants and toddlers'
      ]
    },
    {
      id: 'adolescent',
      title: 'Adolescent',
      ageRange: '13–18 years',
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'bg-green-500',
      description: 'Advanced communication skills for academic, social, and personal confidence.',
      features: [
        'Academic language skills (reading comprehension, writing)',
        'Social communication and peer interaction',
        'Executive functioning (organization, planning, focus)',
        'Stuttering and fluency support',
        'Voice therapy (including gender-affirming care)',
        'Alternative communication methods (AAC)'
      ]
    },
    {
      id: 'adult',
      title: 'Adult',
      ageRange: '18–64 years',
      icon: <User className="w-8 h-8" />,
      color: 'bg-purple-500',
      description: 'Professional, medical, and personal communication enhancement.',
      features: [
        'Rebuilding communication after a stroke, brain injury, or neurological diagnosis',
        'Swallowing safety and dysphagia management',
        'Voice therapy for vocal strain or professional voice users',
        'Stuttering support for adults',
        'Cognitive-communication therapy'
      ]
    },
    {
      id: 'geriatric',
      title: 'Geriatric',
      ageRange: '65+ years',
      icon: <Heart className="w-8 h-8" />,
      color: 'bg-orange-500',
      description: 'Maintaining communication, safety, and quality of life in later years.',
      features: [
        'Rebuilding communication after a stroke, brain injury, or neurological diagnosis',
        'Swallowing safety and safe eating and drinking strategies',
        'Voice changes with aging (presbyphonia)',
        'Cognitive-communication therapy for memory or neurological changes',
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

        {/* Telehealth Age & Scope Clarifications */}
        <div className="bg-[#132D22] text-[#F7EBD3] rounded-2xl p-8 mb-16 shadow-xl border border-white/10">
          <h2 className="text-2xl font-bold mb-8 text-white text-center flex items-center justify-center gap-3">
            <Baby className="w-6 h-6 text-[#B97B40]" /> Ages We Serve & Telehealth Clarity
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="font-bold text-white mb-3 text-lg">Do you work with infants?</h3>
              <p className="text-[#F7EBD3]/90 text-sm leading-relaxed">
                Yes, we do. While a 2-month-old cannot participate in traditional screen-based telehealth, we provide <strong>dedicated parent coaching</strong>. We guide you, the caregiver, step-by-step through strategies to support your baby&apos;s early communication and development right at home.
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="font-bold text-white mb-3 text-lg">Do you offer feeding therapy?</h3>
              <p className="text-[#F7EBD3]/90 text-sm leading-relaxed">
                Absolutely. We offer specialized feeding and swallowing therapy across the lifespan. This includes support for infant latching and bottle feeding, transitioning to solids, picky eating in childhood, and safe swallowing strategies for adults and elders.
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="font-bold text-white mb-3 text-lg">What is the minimum age for direct telehealth?</h3>
              <p className="text-[#F7EBD3]/90 text-sm leading-relaxed">
                Direct one-on-one telehealth therapy typically begins around <strong>age 3</strong>, depending on the child&apos;s attention span. For children under 3, our primary and most effective approach is empowering parents and caregivers through active coaching.
              </p>
            </div>
          </div>
        </div>

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
            <h2 className="text-3xl font-bold text-black mb-6">Why Choose Rooted Voices?</h2>
            <div className="max-w-3xl mx-auto space-y-4 text-lg text-gray-600">
              <p>
                Rooted Voices was founded by a practicing Speech-Language Pathologist who understands firsthand the gaps in access, representation, and quality care within our field.
              </p>
              <p>
                We combine approaches supported by science with care that understands who you are and where you come from, multilingual accessibility and an ethical, evaluation-first model to ensure every client receives personalized therapy that is proven to work.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Multilingual & Accessible',
                description: 'Support available in multiple languages, with bilingual clinicians and real-time transcription options to ensure care that comes to you.'
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Evaluation-First, Personalized Care',
                description: 'Every journey begins with a comprehensive evaluation so we can understand your unique needs and design a therapy plan tailored specifically to you.'
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Grounded in Research & Compassionate',
                description: 'Therapy methods backed by research delivered with warmth, respect, and care that understands who you are and where you come from — honoring your communication style and the life you have lived.'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-black">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
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
          <h2 className="text-3xl font-bold text-black mb-6">Start with Care That's Built Differently</h2>
          <div className="max-w-3xl mx-auto space-y-4 text-lg text-gray-600 mb-8">
            <p>
              At Rooted Voices, therapy is structured, intentional, and led by licensed clinicians who prioritize clinical integrity over volume.
            </p>
            <p>
              Whether you're seeking services for yourself or a loved one, every plan of care begins with an appropriate evaluation, clearly defined goals, and measurable outcomes.
            </p>
            <p className="font-medium text-black pt-4">
              This is not quick-access therapy.<br />
              This is care designed to create lasting communication change.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/meet-our-therapists" className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center group">
              Find a Therapist
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/pricing" className="border border-gray-300 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center group">
              View Services & Pricing
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
