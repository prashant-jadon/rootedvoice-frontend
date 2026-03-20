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
      title: 'Getting Started & Evaluations',
      icon: <HelpCircle className="w-6 h-6" />,
      questions: [
        {
          question: 'How do I know if therapy is needed?',
          answer: 'If you or a loved one is experiencing frustration communicating, feeling misunderstood, or noticing changes in speech or swallowing, an evaluation can provide clarity. We\'re here to help you figure out the best next steps.'
        },
        {
          question: 'Do I need a referral to get started?',
          answer: 'Because we are a private-pay practice, you do not need a doctor\'s referral to schedule an evaluation or begin therapy with us.'
        },
        {
          question: 'What if therapy is not recommended after the evaluation?',
          answer: 'That\'s a great outcome! If an evaluation shows that ongoing therapy isn\'t needed, we will provide you with peace of mind, a few helpful strategies for home, and guidance on what milestones to watch for.'
        },
        {
          question: 'What age groups do you serve?',
          answer: 'We work with individuals across the entire lifespan—from infants and toddlers (through dedicated parent coaching) to school-aged children, adolescents, adults, and seniors.'
        }
      ]
    },
    {
      title: 'Therapy & Services',
      icon: <MessageCircle className="w-6 h-6" />,
      questions: [
        {
          question: 'What if my child has autism?',
          answer: 'We warmly welcome autistic children and their families. Our approach focuses on connection, building upon your child\'s strengths, and supporting how they naturally communicate, rather than forcing them to communicate like neurotypical peers.'
        },
        {
          question: 'What if my loved one is aging?',
          answer: 'We offer dedicated support for older adults experiencing voice changes, swallowing difficulties, or communication challenges after neurological events like a stroke. Our priority is preserving dignity, safety, and quality of life.'
        },
        {
          question: 'What if my child or family speaks more than one language?',
          answer: 'We celebrate bilingualism! We offer multilingual care and never recommend dropping a home language. Our therapists are trained to differentiate natural language differences from language disorders.'
        },
        {
          question: 'Can I switch therapists?',
          answer: 'Yes. Your comfort and connection with your therapist are the most important parts of the process. If you feel another therapist might be a better fit, we\'ll help you transition smoothly.'
        }
      ]
    },
    {
      title: 'Technology & Security',
      icon: <Shield className="w-6 h-6" />,
      questions: [
        {
          question: 'Is telehealth effective?',
          answer: 'Yes! Research shows that telehealth speech therapy is just as effective as in-person visits for most individuals. We use engaging, interactive tools that make online sessions highly rewarding.'
        },
        {
          question: 'What technology do I need?',
          answer: 'All you need is a computer, tablet, or smartphone with a microphone and camera, plus a reliable internet connection. We designed our platform to be simple to use.'
        },
        {
          question: 'Is my information secure?',
          answer: 'Yes. Our platform is fully HIPAA-compliant, meaning your privacy, personal information, and video sessions are protected by the highest standard of security.'
        }
      ]
    },
    {
      title: 'Pricing & Billing',
      icon: <CreditCard className="w-6 h-6" />,
      questions: [
        {
          question: 'Is speech therapy covered by insurance?',
          answer: 'We operate as an out-of-network, private-pay practice. This allows us to focus entirely on your care without insurance-dictated timelines or session caps. While we don\'t bill insurance directly, you may be eligible for out-of-network reimbursement.'
        },
        {
          question: 'Can I use HSA or FSA funds?',
          answer: 'Yes! We accept Health Savings Account (HSA) and Flexible Spending Account (FSA) cards for both evaluations and ongoing therapy sessions.'
        },
        {
          question: 'Do you provide superbills?',
          answer: 'Yes. Upon request, we provide detailed monthly superbills that you can submit directly to your insurance provider for potential out-of-network reimbursement.'
        },
        {
          question: 'What payment options are available?',
          answer: 'We accept all major credit and debit cards, as well as HSA and FSA cards. Payments are processed securely online.'
        },
        {
          question: 'Can I stop therapy at any time?',
          answer: 'Yes, absolutely. You can cancel or pause your subscription at any time. We want therapy to fit comfortably into your life and budget.'
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

          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Mail className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-1">Email Us</h3>
              <p className="text-gray-600 text-sm">info@rootedvoices.com</p>
              <p className="text-gray-500 text-xs mt-1">24-hour response</p>
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
