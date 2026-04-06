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
        'Parent coaching for infants and toddlers',
        'Early intervention services (birth to age 3)',
        'Accent modification',
        'Voice modification and voice therapy',
        'Social skills and pragmatic language development'
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
        'Alternative communication methods (AAC)',
        'Accent modification',
        'Voice modification'
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
        'Cognitive-communication therapy',
        'Accent modification',
        'Voice modification (professional voice users, singers, public speakers)',
        'Gender-affirming voice therapy'
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
        'Support for maintaining social connection and quality of life',
        'Accent modification',
        'Early communication support related to dementia and cognitive decline'
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
            Speech &amp; Language Care, Rooted in You
          </h1>
          <div className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 space-y-4">
            <p>
              Communication is deeply personal — and the care you receive should be too.
            </p>
            <p>
              At Rooted Voices, we provide individualized speech and language services that honor your experiences, your identity, and your goals. We are here to bridge the gaps in communication, creating space for connection, confidence, and meaningful progress at every stage of life.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/meet-our-therapists" className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center group">
              Meet Our Therapists
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/pricing" className="border border-gray-300 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300">
              View Pricing
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
                Yes, we do! We provide services across the full lifespan, starting from birth. Even though a young infant won&apos;t be saying words yet, there are important communication and developmental milestones we can support from day one — including cooing, social smiling, eye contact, feeding, and early sound-making. Early intervention begins at birth, and the earlier we start, the better the outcomes. For our youngest clients, we provide dedicated parent and caregiver coaching, guiding you step by step through strategies you can use at home to support your baby&apos;s development every single day.
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
                There is no strict minimum age for telehealth services. We have worked directly with infants as young as 9 to 10 months old via telehealth. The approach simply looks different depending on the child&apos;s age and developmental stage. For infants and very young children, sessions are caregiver-supported, meaning a parent or caregiver is actively involved and guided throughout. As children grow and their attention and engagement develop, sessions gradually shift toward more direct, one-on-one interaction. Every child is different, and we tailor our approach accordingly.
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
            <h2 className="text-3xl font-bold text-black mb-6">Why Rooted Voices</h2>
            <div className="max-w-3xl mx-auto space-y-4 text-lg text-gray-600">
              <p>
                Rooted Voices was created from both professional experience and lived understanding — with a deep awareness of the gaps that exist in access, representation, and quality care within our field.
              </p>
              <p>
                We believe communication is more than a skill — it is a bridge to connection, identity, and belonging. Our approach brings together evidence-based practice with a deep respect for who you are, where you come from, and how you experience the world.
              </p>
              <p>
                Every part of what we do is designed to feel intentional, supportive, and aligned with your needs — so you receive care that truly sees you.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Accessible & Multilingual Care',
                description: 'Support available in multiple languages, with clinicians who understand that culture, identity, and communication go far beyond translation'
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Evaluation-First, Personalized Care',
                description: 'Every journey begins with a thoughtful, comprehensive evaluation so we can understand you fully and build a plan tailored specifically to your needs and goals'
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Grounded in Research, Led with Care',
                description: 'Evidence-based therapy delivered with warmth, genuine respect, and a deep understanding of your lived experience'
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
          <h2 className="text-3xl font-bold text-black mb-6">Start with Care That&apos;s Built Differently</h2>
          <div className="max-w-3xl mx-auto space-y-4 text-lg text-gray-600 mb-8">
            <p>
              At Rooted Voices, therapy is intentional, personalized, and led by licensed clinicians who value quality care and meaningful human connection above all else.
            </p>
            <p>
              Whether you are seeking support for yourself or a loved one, every journey begins with a thoughtful evaluation — designed to truly understand your communication, your experiences, and your goals. Not just your symptoms. Not just a referral form. You.
            </p>
            <p>
              From there, we build a plan that is clear, supportive, and aligned with exactly what you need — because communication is more than a skill. It is a bridge to connection, confidence, and belonging.
            </p>
            <p className="font-medium text-black pt-4">
              This is not quick-access therapy.<br />
              This is care designed to create lasting, meaningful change.
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
