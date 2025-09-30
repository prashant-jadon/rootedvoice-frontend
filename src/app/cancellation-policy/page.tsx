'use client'

import { motion } from 'framer-motion'
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Phone, 
  Mail, 
  Calendar,
  DollarSign,
  Shield,
  FileText,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export default function CancellationPolicyPage() {
  const policySections = [
    {
      title: 'Cancellation Notice Requirements',
      icon: <Clock className="w-6 h-6" />,
      content: [
        'We require a minimum of 24 hours notice for all appointment cancellations.',
        'Cancellations made with less than 24 hours notice may be subject to a cancellation fee.',
        'Emergency situations will be handled on a case-by-case basis.',
        'No-show appointments will be charged the full session fee.'
      ]
    },
    {
      title: 'Rescheduling Policy',
      icon: <Calendar className="w-6 h-6" />,
      content: [
        'Appointments can be rescheduled with 24 hours notice at no charge.',
        'Rescheduling requests made with less than 24 hours notice may incur a fee.',
        'Multiple reschedules may require additional coordination.',
        'We will work with you to find alternative appointment times when possible.'
      ]
    },
    {
      title: 'Cancellation Fees',
      icon: <DollarSign className="w-6 h-6" />,
      content: [
        'Late cancellations (less than 24 hours): 50% of session fee',
        'No-show appointments: 100% of session fee',
        'Emergency cancellations: Fee may be waived with proper documentation',
        'Fees will be charged to your account on file'
      ]
    },
    {
      title: 'How to Cancel or Reschedule',
      icon: <Phone className="w-6 h-6" />,
      content: [
        'Call our main office: (555) 123-4567',
        'Email your therapist directly',
        'Use the client portal to cancel online',
        'Text message (for established clients only)',
        'Leave a voicemail if calling outside business hours'
      ]
    },
    {
      title: 'Emergency Situations',
      icon: <AlertCircle className="w-6 h-6" />,
      content: [
        'Medical emergencies are always excused from cancellation fees',
        'Family emergencies will be considered on a case-by-case basis',
        'Weather-related cancellations may be excused',
        'Technical difficulties on our end will not result in fees',
        'Documentation may be required for emergency fee waivers'
      ]
    },
    {
      title: 'Service-Specific Policies',
      icon: <FileText className="w-6 h-6" />,
      content: [
        'Initial evaluations: 48-hour cancellation notice required',
        'Group sessions: 72-hour cancellation notice required',
        'Family/caregiver sessions: 24-hour notice required',
        'Assessment appointments: 48-hour notice required',
        'Consultation calls: 24-hour notice required'
      ]
    }
  ]

  const importantNotes = [
    'All cancellation policies apply to both in-person and teletherapy sessions',
    'Payment is due regardless of attendance unless proper notice is given',
    'Repeated cancellations may result in modified scheduling requirements',
    'We understand that life happens - please communicate with us early',
    'Our goal is to provide consistent, reliable therapy services'
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
              <h1 className="text-2xl font-bold text-black">Cancellation Policy</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/faq" className="text-gray-600 hover:text-black transition-colors">
                FAQ
              </Link>
              <Link href="/telehealth-consent" className="text-gray-600 hover:text-black transition-colors">
                Telehealth Consent
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
            Cancellation
            <br />
            <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We understand that life can be unpredictable. Our cancellation policy is designed 
            to be fair to both our clients and therapists while maintaining consistent care.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Last updated: December 2024</span>
          </div>
        </motion.div>

        {/* Quick Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl premium-shadow p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-black mb-6 text-center">Quick Summary</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-black mb-2">24+ Hours Notice</h3>
              <p className="text-sm text-gray-600">No cancellation fee</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-black mb-2">Less than 24 Hours</h3>
              <p className="text-sm text-gray-600">50% of session fee</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-black mb-2">No-Show</h3>
              <p className="text-sm text-gray-600">100% of session fee</p>
            </div>
          </div>
        </motion.div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {policySections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl premium-shadow p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-black">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-black">{section.title}</h2>
              </div>
              
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 bg-blue-50 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-black mb-6 text-center">Important Notes</h2>
          <ul className="space-y-3">
            {importantNotes.map((note, index) => (
              <li key={index} className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{note}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 bg-white rounded-2xl premium-shadow p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-black mb-6">Questions About Our Policy?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            If you have questions about our cancellation policy or need to discuss special circumstances, 
            please don't hesitate to contact us.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Phone className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-1">Call Us</h3>
              <p className="text-gray-600 text-sm">(555) 123-4567</p>
              <p className="text-gray-500 text-xs">Mon-Fri, 8AM-6PM</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Mail className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-1">Email Us</h3>
              <p className="text-gray-600 text-sm">info@rootedvoices.com</p>
              <p className="text-gray-500 text-xs">24-hour response</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-1">Client Portal</h3>
              <p className="text-gray-600 text-sm">Cancel online</p>
              <p className="text-gray-500 text-xs">24/7 access</p>
            </div>
          </div>
        </motion.div>

        {/* Back to FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <Link 
            href="/faq" 
            className="inline-flex items-center text-black hover:text-gray-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to FAQ
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
