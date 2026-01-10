'use client'

import { motion } from 'framer-motion'
import { 
  DollarSign, 
  Heart, 
  Users, 
  Clock, 
  Shield, 
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  Calendar,
  MessageCircle,
  FileText,
  Video,
  BarChart3,
  Zap,
  Globe,
  Award,
  Target,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslation } from '@/hooks/useTranslation'

export default function ForTherapistsPage() {
  const t = useTranslation()
  const compensationRanges = [
    {
      credential: 'SLP (Speech-Language Pathologist)',
      maxRate: '$75',
      description: 'Fully licensed Speech-Language Pathologists can set rates up to $75/hour',
      benefits: [
        '55% of session fee goes directly to you (45% platform fee)',
        'Set your own hourly rate (up to $75/hour)',
        '$20 cancellation fee protection when clients cancel',
        'Flexible scheduling on your terms',
        'Direct payment processing with transparent reporting',
        'No hidden fees or surprise deductions'
      ]
    },
    {
      credential: 'SLPA (Speech-Language Pathology Assistant)',
      maxRate: '$55',
      description: 'Speech-Language Pathology Assistants can set rates up to $55/hour',
      benefits: [
        '55% of session fee goes directly to you (45% platform fee)',
        'Set your own hourly rate (up to $55/hour)',
        '$15 cancellation fee protection when clients cancel',
        'Supportive platform designed for career growth',
        'Clear guidelines and supervision support',
        'Direct payment processing with transparent reporting'
      ]
    }
  ]

  const platformBenefits = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Generous Compensation',
      description: 'Keep 55% of every session fee. We believe therapists should be fairly compensated for their expertise and dedication.',
      details: [
        '55/45 revenue split (you keep 55%)',
        'Set your own rates within platform guidelines',
        'Transparent payment processing',
        'No hidden fees'
      ]
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Flexible Scheduling',
      description: 'Work when and where you want. Set your own availability and build a schedule that fits your life.',
      details: [
        'Control your own calendar',
        'Work from anywhere with internet',
        'No minimum session requirements',
        'Take time off when you need it'
      ]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'HIPAA-Compliant Platform',
      description: 'We handle all the technical and compliance requirements so you can focus on what you do best - helping clients.',
      details: [
        'End-to-end encryption',
        'Secure video conferencing',
        'Compliant document storage',
        'Regular security audits'
      ]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI-Powered Tools',
      description: 'Save time with our AI-assisted documentation and resource tools, giving you more time for client care.',
      details: [
        'AI-generated SOAP notes',
        'Smart resource library search',
        'Automated session reminders',
        'Document analysis tools'
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Supportive Community',
      description: 'Connect with fellow therapists, share resources, and grow together in our professional community forum.',
      details: [
        'Peer support and collaboration',
        'Shared resource library',
        'Professional development opportunities',
        'Mentorship connections'
      ]
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Practice Analytics',
      description: 'Track your practice growth with detailed analytics and insights to help you optimize your caseload.',
      details: [
        'Revenue tracking and insights',
        'Client progress analytics',
        'Session completion rates',
        'Performance metrics'
      ]
    }
  ]

  const whyRootedVoices = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Clinician-Centered Design',
      description: 'Every feature is built with therapists in mind. We understand your workflow and designed tools that actually save you time.'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Focus on Quality Care',
      description: 'We prioritize evidence-based practice and provide resources to help you deliver the best possible care to your clients.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Reach Clients Nationwide',
      description: 'Expand your practice beyond geographic limitations. Serve clients across state lines (where licensed) without travel.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Grow Your Practice',
      description: 'Build a sustainable practice with our tools and support. Many therapists see significant growth in their first year.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Professional Development',
      description: 'Access continuing education resources, training materials, and opportunities to advance your career.'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Innovation & Technology',
      description: 'Stay at the forefront of telehealth with cutting-edge tools and features that enhance your practice.'
    }
  ]

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson, SLP',
      location: 'California',
      quote: 'Rooted Voices has transformed how I practice. The platform is intuitive, the compensation is fair, and I love the flexibility.',
      rating: 5
    },
    {
      name: 'Michael Chen, SLPA',
      location: 'Texas',
      quote: 'As an SLPA, I appreciate the supportive environment and clear guidelines. The cancellation fee protection gives me peace of mind.',
      rating: 5
    },
    {
      name: 'Dr. Emily Rodriguez, SLP',
      location: 'New York',
      quote: 'The AI tools save me hours each week on documentation. I can focus on what matters - my clients.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('forTherapists.heroTitle')}
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              {t('forTherapists.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup?role=therapist"
                className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors inline-flex items-center justify-center"
              >
                {t('forTherapists.joinButton')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/who-we-are"
                className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors border-2 border-gray-300 inline-flex items-center justify-center"
              >
                {t('forTherapists.learnMoreButton')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Compensation Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('forTherapists.compensationTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('forTherapists.compensationSubtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {compensationRanges.map((range, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {range.credential === 'SLP (Speech-Language Pathologist)' ? t('forTherapists.slpTitle') : t('forTherapists.slpaTitle')}
                  </h3>
                  <div className="text-3xl font-bold text-blue-600">
                    {range.credential === 'SLP (Speech-Language Pathologist)' ? t('forTherapists.slpMaxRate') : t('forTherapists.slpaMaxRate')}
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  {range.credential === 'SLP (Speech-Language Pathologist)' ? t('forTherapists.slpDesc') : t('forTherapists.slpaDesc')}
                </p>
                <ul className="space-y-3">
                  {range.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl text-center"
          >
            <h3 className="text-2xl font-bold mb-4">{t('forTherapists.revenueSplitTitle')}</h3>
            <p className="text-lg mb-6">
              {t('forTherapists.revenueSplitDesc')}
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div>
                <div className="text-4xl font-bold mb-2">55%</div>
                <div className="text-blue-100">{t('forTherapists.yourEarnings')}</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">45%</div>
                <div className="text-blue-100">{t('forTherapists.platformFee')}</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">0%</div>
                <div className="text-blue-100">{t('forTherapists.noHiddenFees')}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('forTherapists.platformTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('forTherapists.platformSubtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-blue-600 mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 mb-4">{benefit.description}</p>
                <ul className="space-y-2">
                  {benefit.details.map((detail, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Rooted Voices Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('forTherapists.whyTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('forTherapists.whySubtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyRootedVoices.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200"
              >
                <div className="text-blue-600 mb-4">{reason.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('forTherapists.testimonialsTitle')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              {t('forTherapists.readyTitle')}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              {t('forTherapists.readySubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup?role=therapist"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                {t('forTherapists.getStarted')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/faq"
                className="bg-transparent text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors border-2 border-white inline-flex items-center justify-center"
              >
                {t('forTherapists.viewFAQ')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
