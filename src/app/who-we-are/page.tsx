'use client'

import { motion } from 'framer-motion'
import {
  Heart,
  Users,
  Award,
  Shield,
  Target,
  Lightbulb,
  CheckCircle,
  Star,
  Globe,
  Clock,
  ArrowRight,
  MessageCircle,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useState, useEffect } from 'react'
import { publicAPI } from '@/lib/api'

export default function WhoWeArePage() {
  const t = useTranslation()
  const [teamStats, setTeamStats] = useState([
    { number: '50+', label: t('whoWeAre.therapists'), context: 'Licensed and verified therapists across multiple states' },
    { number: '15+', label: t('whoWeAre.experience'), context: 'Combined years of clinical experience from our team' },
    { number: '10,000+', label: t('whoWeAre.sessions'), context: 'Total therapy sessions completed on our platform' },
    { number: '95%', label: t('whoWeAre.satisfaction'), context: t('whoWeAre.satisfactionContext') }
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await publicAPI.getPlatformStats()
        const stats = response.data.data
        if (stats?.whoWeAreStats) {
          setTeamStats([
            {
              number: stats.whoWeAreStats.licensedTherapists.number,
              label: stats.whoWeAreStats.licensedTherapists.label,
              context: stats.whoWeAreStats.licensedTherapists.context
            },
            {
              number: stats.whoWeAreStats.yearsExperience.number,
              label: stats.whoWeAreStats.yearsExperience.label,
              context: stats.whoWeAreStats.yearsExperience.context
            },
            {
              number: stats.whoWeAreStats.sessionsCompleted.number,
              label: stats.whoWeAreStats.sessionsCompleted.label,
              context: stats.whoWeAreStats.sessionsCompleted.context
            },
            {
              number: stats.whoWeAreStats.clientSatisfaction.number,
              label: stats.whoWeAreStats.clientSatisfaction.label,
              context: stats.whoWeAreStats.clientSatisfaction.context
            }
          ])
        }
      } catch (error) {
        console.error('Failed to fetch platform stats:', error)
        // Keep default stats on error
      }
    }
    fetchStats()
  }, [])

  const values = [
    {
      icon: <Users className="w-8 h-8" />,
      title: '🤝 Collaborative Approach',
      description: 'We believe the best outcomes happen through collaboration. Clients, families, and clinicians work together to set goals, adjust care, and celebrate progress. At Rooted Voices, collaboration means shared decisions, mutual respect, and empowerment.'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: '💡 Innovation & Technology',
      description: 'We use technology as a tool — not a replacement for human connection. Innovation at Rooted Voices helps increase access, reduce barriers, and create flexible pathways to care, wherever clients and clinicians are.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: '💚 Compassionate Care',
      description: 'We lead with compassion that honors the whole person, not just a diagnosis. Rooted Voices is a space where individuals and families feel safe, respected, and seen. We recognize communication is deeply tied to identity, culture, and lived experience.'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: '🎯 Evidence-Based Practice',
      description: 'Our care is grounded in evidence-based practice while remaining flexible and human. We combine research, clinical expertise, and lived experience to create therapy that is effective, meaningful, and responsive.'
    }
  ]


  const certifications = [
    'ASHA Certified Speech-Language Pathologists (CCC-SLP)',
    'State Licensed in Multiple States',
    'HIPAA Compliant Platform',
    'Continuing Education Requirements Met',
    'Specialized Training in Various Disorders',
    'Cultural Competency Training'
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
              <h1 className="text-2xl font-bold text-black">Who We Are</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/services" className="text-gray-600 hover:text-black transition-colors">
                Services
              </Link>
              <Link href="/meet-our-therapists" className="text-gray-600 hover:text-black transition-colors">
                Meet Our Therapists
              </Link>
              <Link href="/faq" className="text-gray-600 hover:text-black transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 1. Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            🌱 Who We Are
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Rooted Voices Speech & Language Therapy was created with one belief at its core:
            <span className="font-semibold text-black"> every voice deserves to be heard, understood, and valued.</span>
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4 leading-relaxed">
            We are a collective of skilled and compassionate clinicians supporting individuals of all ages, identities, cultures, and communication styles. Our care blends clinical excellence with humanity.
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            When you come to Rooted Voices, you're not just receiving therapy — you're joining a community of support, growth, and empowerment.
          </p>
        </motion.div>

        {/* 2. A Note From Our Founder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl premium-shadow p-8 mb-20"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-black mb-6 text-center">🌱 A Note From Our Founder</h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Rooted Voices was created from both professional experience and lived understanding.
              </p>
              <p>
                As a speech-language pathologist, I've witnessed the power of communication to transform lives — from first words spoken to confidence restored, from being misunderstood to finally being heard. I've also seen where traditional systems fall short, particularly for individuals and communities who are too often overlooked.
              </p>
              <p className="font-semibold text-black">
                Rooted Voices exists to do things differently.
              </p>
              <p>
                This is a space built with intention — where clinical excellence and humanity coexist, and where care is grounded in compassion, cultural humility, and respect for each person's identity and lived experience. We believe communication is more than a skill; it is a bridge to connection, dignity, and belonging.
              </p>
              <p>
                At Rooted Voices, no voice is overlooked. Every story matters. If you've found your way here, know this space was created with you in mind.
              </p>
              <div className="pt-6 border-t border-gray-200 mt-8">
                <p className="text-black font-semibold mb-2">With intention and care,</p>
                <p className="text-black font-semibold">
                  Ashley Blocker-Wilbourn, MS, CCC-SLP<br />
                  <span className="text-lg">Founder, Rooted Voices Speech & Language Therapy 🌱✨</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. Who Is a Speech-Language Pathologist? */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl premium-shadow p-8 mb-20"
        >
          <h2 className="text-3xl font-bold text-black text-center mb-8">🌱 Who Is a Speech-Language Pathologist?</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-lg text-gray-600 leading-relaxed">
              A Speech-Language Pathologist (SLP) is a licensed clinician trained to assess, diagnose, and treat communication and swallowing needs across the lifespan — supporting how people connect and express themselves.
            </p>
            <div>
              <h3 className="text-xl font-semibold text-black mb-4">SLPs support skills such as:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🗣</span>
                  <span className="text-gray-700">Speech sounds</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">💬</span>
                  <span className="text-gray-700">Language</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🧠</span>
                  <span className="text-gray-700">Cognitive-communication</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📖</span>
                  <span className="text-gray-700">Literacy</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">✨</span>
                  <span className="text-gray-700">Social communication</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🧩</span>
                  <span className="text-gray-700">Fluency</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🎤</span>
                  <span className="text-gray-700">Voice</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">🍽</span>
                  <span className="text-gray-700">Swallowing & feeding</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">📱</span>
                  <span className="text-gray-700">AAC</span>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-200">
              <p className="text-lg text-gray-600 leading-relaxed">
                Some people communicate with spoken words.<br />
                Others use AAC, gestures, text, movement, eye gaze, or emerging vocalizations.<br />
                <span className="font-semibold text-black">SLPs are trained to honor all communication styles, meeting each person right where they are.</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* 4. Certifications & Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl premium-shadow p-8 mb-20"
        >
          <h2 className="text-3xl font-bold text-black text-center mb-8">Certifications & Credentials</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{cert}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 5. Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          <div className="bg-white rounded-2xl premium-shadow p-8">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-4 text-center">🌿 Mission Statement</h2>
            <p className="text-gray-600 leading-relaxed text-center">
              Our mission is to provide safe, evidence-based, and culturally inclusive speech-language care that empowers individuals to communicate with confidence. We honor each voice and build care plans rooted in strengths, identity, and lived experience.
            </p>
          </div>

          <div className="bg-white rounded-2xl premium-shadow p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-4 text-center">🌿 Vision Statement</h2>
            <p className="text-gray-600 leading-relaxed text-center">
              Our vision is a world where no voice is overlooked and communication differences are met with understanding, not judgment. We are building a platform where clinical expertise, humanity, and technology come together to help voices grow freely and confidently.
            </p>
          </div>
        </motion.div>

        {/* 6. Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-black text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl premium-shadow p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-black flex-shrink-0">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 7. Why Choose Rooted Voices? */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl premium-shadow p-8 mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">Why Choose Rooted Voices?</h2>
            <div className="max-w-3xl mx-auto space-y-4 text-lg text-gray-600">
              <p>
                Rooted Voices was founded by a practicing Speech-Language Pathologist who understands firsthand the gaps in access, representation, and quality care within our field.
              </p>
              <p>
                We combine evidence-based practice with culturally responsive, multilingual accessibility and an ethical, evaluation-first model to ensure every client receives personalized and clinically sound therapy.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Clinician-Founded & Led',
                description: 'Built by licensed SLPs who actively practice in clinical settings. Our structure prioritizes clinical integrity over volume-driven care.'
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Multilingual & Accessible',
                description: 'Support for bilingual providers, real-time transcription during sessions, and a language-responsive platform designed to serve diverse populations.'
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Evaluation-First Care Model',
                description: 'Therapy begins with appropriate diagnostic evaluation and clearly defined goals to ensure measurable progress.'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'HIPAA Compliant',
                description: 'Secure, encrypted sessions that meet healthcare privacy standards.'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-black">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 8. Impact / Commitment (Stats) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-black text-center mb-8">{t('whoWeAre.statsTitle')}</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {teamStats.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-2xl premium-shadow p-6">
                <div className="text-4xl font-bold text-black mb-2">{stat.number}</div>
                <div className="text-gray-700 font-semibold mb-2">{stat.label}</div>
                {stat.context && (
                  <div className="text-sm text-gray-500 mt-2">{stat.context}</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* 9. CTA Section */}
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
