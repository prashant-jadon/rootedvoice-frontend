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

export default function FAQPage() {
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
      title: 'Getting Started',
      icon: <HelpCircle className="w-6 h-6" />,
      questions: [
        {
          question: 'How do I get started with therapy at Rooted Voices?',
          answer: 'Getting started is easy! Simply visit our "Meet Our Therapists" page to browse our licensed professionals, or contact us directly. We\'ll schedule a free consultation to discuss your needs and match you with the right therapist.'
        },
        {
          question: 'Do you offer free consultations?',
          answer: 'Yes! We offer free 15-minute consultations to help you understand our services and determine if we\'re a good fit for your needs. This is a great opportunity to ask questions and learn about our approach.'
        },
        {
          question: 'What age groups do you serve?',
          answer: 'We serve clients of all ages, from infants (0-3 years) to older adults (65+). Our therapists specialize in different age groups and communication needs, ensuring you receive age-appropriate care.'
        },
        {
          question: 'Do you accept insurance?',
          answer: 'We are currently in-network with several major insurance providers. Please contact us to verify your specific coverage. We also offer flexible payment plans and accept HSA/FSA payments.'
        }
      ]
    },
    {
      title: 'Services & Therapy',
      icon: <MessageCircle className="w-6 h-6" />,
      questions: [
        {
          question: 'What types of speech and language services do you offer?',
          answer: 'We offer comprehensive services including articulation therapy, language development, fluency therapy, voice therapy, feeding/swallowing therapy, AAC services, cognitive-communication therapy, and more. Visit our Services page for detailed information.'
        },
        {
          question: 'How long are therapy sessions?',
          answer: 'Session length varies by service tier: Rooted Tier (30 minutes), Flourish Tier (60 minutes), and Bloom Tier (60 minutes). We can adjust session length based on individual needs and attention spans.'
        },
        {
          question: 'How often will I have therapy sessions?',
          answer: 'Frequency depends on your service tier and individual needs. Rooted Tier includes 2-4 sessions per month, Flourish Tier offers weekly or bi-weekly sessions, and Bloom Tier provides flexible scheduling with 2-3 sessions monthly.'
        },
        {
          question: 'Do you provide therapy in languages other than English?',
          answer: 'Yes! Many of our therapists are bilingual or multilingual. Please let us know your language preferences during your consultation, and we\'ll match you with an appropriate therapist.'
        }
      ]
    },
    {
      title: 'Technology & Platform',
      icon: <Shield className="w-6 h-6" />,
      questions: [
        {
          question: 'Is teletherapy as effective as in-person therapy?',
          answer: 'Research shows that teletherapy can be just as effective as in-person therapy for many communication disorders. Our platform is designed specifically for speech therapy and includes interactive tools and resources.'
        },
        {
          question: 'What technology do I need for teletherapy?',
          answer: 'You\'ll need a computer, tablet, or smartphone with a camera and microphone, plus a stable internet connection. We recommend using Chrome or Safari browsers for the best experience.'
        },
        {
          question: 'Is my information secure and private?',
          answer: 'Absolutely. We use HIPAA-compliant, encrypted video conferencing and secure data storage. All sessions are confidential, and we follow strict privacy protocols to protect your information.'
        },
        {
          question: 'Can I record my therapy sessions?',
          answer: 'Recording policies vary by state and individual therapist preferences. We\'ll discuss recording options during your initial consultation and obtain proper consent if recording is desired.'
        }
      ]
    },
    {
      title: 'Billing & Payments',
      icon: <CreditCard className="w-6 h-6" />,
      questions: [
        {
          question: 'What are your pricing tiers?',
          answer: 'We offer three service tiers: Rooted Tier ($50/30min, billed every 4 weeks), Flourish Tier ($85/hour, billed every 4 weeks), and Bloom Tier ($90/hour, pay-as-you-go). Each tier includes different features and support levels.'
        },
        {
          question: 'When is payment due?',
          answer: 'For Rooted and Flourish tiers, payment is due every 4 weeks in advance. Bloom Tier is pay-as-you-go, with payment due before each session. We accept major credit cards, HSA/FSA, and bank transfers.'
        },
        {
          question: 'What is your cancellation policy?',
          answer: 'We require 24-hour notice for cancellations. Cancellations with less than 24-hour notice may be subject to a fee. Please see our detailed Cancellation Policy for complete information.'
        },
        {
          question: 'Do you offer payment plans or financial assistance?',
          answer: 'Yes, we offer flexible payment plans and may have financial assistance options available. Please contact us to discuss your specific situation and available options.'
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
            Frequently Asked
            <br />
            <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to common questions about our services, technology, billing, and more. 
            Can't find what you're looking for? We're here to help!
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
                          <p className="text-gray-600 leading-relaxed">
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
                <Clock className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-1">Response Time</h3>
              <p className="text-gray-600 text-sm">Within 24 hours</p>
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
