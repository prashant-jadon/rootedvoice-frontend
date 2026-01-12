'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail,
  Clock,
  Shield,
  CreditCard,
  Calendar,
  Users,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function FAQPage() {
  const t = useTranslation()
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqCategories = [
    {
      title: t('faq.gettingStarted'),
      icon: <HelpCircle className="w-6 h-6" />,
      questions: [
        {
          question: t('faq.howToGetStarted'),
          answer: t('faq.getStartedAnswer')
        },
        {
          question: t('faq.freeConsultations'),
          answer: t('faq.freeConsultationsAnswer')
        },
        {
          question: t('faq.ageGroups'),
          answer: t('faq.ageGroupsAnswer')
        },
        {
          question: t('faq.acceptInsurance'),
          answer: t('faq.acceptInsuranceAnswer')
        }
      ]
    },
    {
      title: t('faq.servicesTherapy'),
      icon: <MessageCircle className="w-6 h-6" />,
      questions: [
        {
          question: t('faq.typesOfServices'),
          answer: t('faq.typesOfServicesAnswer')
        },
        {
          question: t('faq.sessionLength'),
          answer: t('faq.sessionLengthAnswer')
        },
        {
          question: t('faq.sessionFrequency'),
          answer: t('faq.sessionFrequencyAnswer')
        },
        {
          question: t('faq.multilingualTherapy'),
          answer: t('faq.multilingualTherapyAnswer')
        }
      ]
    },
    {
      title: t('faq.technologyPlatform'),
      icon: <Shield className="w-6 h-6" />,
      questions: [
        {
          question: t('faq.telehealthEffective'),
          answer: t('faq.telehealthEffectiveAnswer')
        },
        {
          question: t('faq.technologyNeeded'),
          answer: t('faq.technologyNeededAnswer')
        },
        {
          question: t('faq.platformSecure'),
          answer: t('faq.platformSecureAnswer')
        },
        {
          question: t('faq.recordSessions'),
          answer: t('faq.recordSessionsAnswer')
        }
      ]
    },
    {
      title: t('faq.pricingBilling'),
      icon: <CreditCard className="w-6 h-6" />,
      questions: [
        {
          question: t('faq.pricingPlans'),
          answer: t('faq.pricingPlansAnswer')
        },
        {
          question: t('faq.paymentDue'),
          answer: t('faq.paymentDueAnswer')
        },
        {
          question: t('faq.cancellationPolicy'),
          answer: t('faq.cancellationPolicyAnswer')
        },
        {
          question: t('faq.paymentMethods'),
          answer: t('faq.paymentMethodsAnswer')
        },
        {
          question: t('faq.cancelSubscription'),
          answer: t('faq.cancelSubscriptionAnswer')
        }
      ]
    },
    {
      title: 'Scheduling & Appointments',
      icon: <Calendar className="w-6 h-6" />,
      questions: [
        {
          question: 'How do I schedule or reschedule an appointment?',
          answer: 'You can schedule appointments through your client portal, by calling us, or by emailing your therapist directly. We offer flexible scheduling including evenings and weekends.'
        },
        {
          question: 'What if I need to cancel or reschedule?',
          answer: 'You can cancel or reschedule through your client portal, by calling, or by emailing. We require 24-hour notice to avoid cancellation fees. Emergency situations are handled on a case-by-case basis.'
        },
        {
          question: 'Do you offer evening or weekend appointments?',
          answer: 'Yes! Many of our therapists offer evening and weekend appointments to accommodate busy schedules. Availability varies by therapist, so please check with your specific therapist.'
        },
        {
          question: 'What happens if I miss an appointment?',
          answer: 'Missed appointments without 24-hour notice may be subject to a cancellation fee. We understand that emergencies happen, so please contact us as soon as possible if you need to miss an appointment.'
        }
      ]
    },
    {
      title: 'Therapist Information',
      icon: <Users className="w-6 h-6" />,
      questions: [
        {
          question: 'How do I verify my therapist\'s credentials?',
          answer: 'All our therapists are licensed and certified. You can verify credentials through our therapist profiles, which include license numbers and certification details. We also provide links to state licensing boards for verification.'
        },
        {
          question: 'Can I choose my therapist?',
          answer: 'Yes! You can browse our therapist profiles and request a specific therapist. We\'ll do our best to match you with your preferred therapist based on availability and specialization.'
        },
        {
          question: 'What if I\'m not satisfied with my therapist?',
          answer: 'We want you to have the best possible experience. If you\'re not satisfied, please let us know and we\'ll work to find a better match or address any concerns you may have.'
        },
        {
          question: 'Do therapists specialize in specific areas?',
          answer: 'Yes! Our therapists have various specializations including early intervention, adult neurogenic disorders, voice therapy, fluency, AAC, and more. Check individual profiles for specific expertise areas.'
        }
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
              <h1 className="text-2xl font-bold text-black">FAQ</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/services" className="text-gray-600 hover:text-black transition-colors">
                Services
              </Link>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            {t('faq.title').split(' ').slice(0, 2).join(' ')}
            <br />
            <span className="gradient-text">{t('faq.title').split(' ').slice(2).join(' ')}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {t('faq.subtitle')} {t('faq.subtitleHelp')}
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="bg-white rounded-2xl premium-shadow p-8"
            >
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-black">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-black">{category.title}</h2>
              </div>
              
              <div className="space-y-4">
                {category.questions.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 100 + itemIndex
                  const isOpen = openItems.includes(globalIndex)
                  
                  return (
                    <div key={itemIndex} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg font-semibold text-black pr-4">
                          {item.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-4"
                        >
                          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-white rounded-2xl premium-shadow p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-black mb-4">Still Have Questions?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We're here to help! Contact us directly and we'll get back to you within 24 hours.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Phone className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-1">Call Us</h3>
              <p className="text-gray-600 text-sm">(555) 123-4567</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Mail className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-1">Email Us</h3>
              <p className="text-gray-600 text-sm">info@rootedvoices.com</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-1">{t('faq.visitUs')}</h3>
              <p className="text-gray-600 text-sm">{t('faq.address')}</p>
              <p className="text-gray-500 text-xs">{t('faq.cityState')}</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <h3 className="text-lg font-semibold text-black mb-6">Quick Links</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/services" className="px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors">
              Our Services
            </Link>
            <Link href="/meet-our-therapists" className="px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors">
              Meet Our Therapists
            </Link>
            <Link href="/pricing" className="px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors">
              Pricing Plans
            </Link>
            <Link href="/cancellation-policy" className="px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors">
              Cancellation Policy
            </Link>
            <Link href="/telehealth-consent" className="px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors">
              Telehealth Consent
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
