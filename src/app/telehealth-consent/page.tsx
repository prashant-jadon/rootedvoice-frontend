'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Lock, 
  Video,
  Phone,
  Mail,
  Clock,
  Users,
  Monitor,
  Wifi,
  ArrowLeft,
  Download
} from 'lucide-react'
import Link from 'next/link'

export default function TelehealthConsentPage() {
  const [consentItems, setConsentItems] = useState<{[key: string]: boolean}>({})

  const toggleConsent = (item: string) => {
    setConsentItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }))
  }

  const consentSections = [
    {
      id: 'understanding',
      title: 'Understanding of Telehealth Services',
      icon: <FileText className="w-6 h-6" />,
      items: [
        'I understand that telehealth involves the use of electronic communications to enable healthcare providers at different locations to share individual patient medical information for the purpose of improving patient care.',
        'I understand that the services provided via telehealth are not intended to replace in-person healthcare services.',
        'I understand that my healthcare provider may determine that my condition is not suitable for telehealth services and may require an in-person visit.',
        'I understand that I have the right to withdraw my consent to telehealth services at any time without affecting my right to future care or treatment.'
      ]
    },
    {
      id: 'technology',
      title: 'Technology Requirements and Limitations',
      icon: <Monitor className="w-6 h-6" />,
      items: [
        'I understand that I need a computer, tablet, or smartphone with a camera and microphone.',
        'I understand that I need a stable internet connection for the telehealth session.',
        'I understand that technical difficulties may occur and may require rescheduling the session.',
        'I understand that the quality of the video and audio may vary based on my internet connection.',
        'I understand that I am responsible for ensuring my technology is working properly before the session.'
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy and Security',
      icon: <Lock className="w-6 h-6" />,
      items: [
        'I understand that all telehealth sessions are conducted using HIPAA-compliant, encrypted video conferencing software.',
        'I understand that my personal health information will be protected according to HIPAA regulations.',
        'I understand that I should conduct sessions in a private location to protect my privacy.',
        'I understand that recordings of sessions (if any) will only be made with my explicit consent.',
        'I understand that I should not share my session links or login information with others.'
      ]
    },
    {
      id: 'emergency',
      title: 'Emergency Situations',
      icon: <AlertCircle className="w-6 h-6" />,
      items: [
        'I understand that telehealth services are not appropriate for emergency situations.',
        'I understand that in case of a medical emergency, I should call 911 or go to the nearest emergency room.',
        'I understand that my healthcare provider may not be able to provide immediate assistance during a telehealth session.',
        'I understand that I should have emergency contact information readily available during sessions.'
      ]
    },
    {
      id: 'billing',
      title: 'Billing and Insurance',
      icon: <FileText className="w-6 h-6" />,
      items: [
        'I understand that telehealth services may be billed to my insurance provider.',
        'I understand that I am responsible for any copayments, deductibles, or fees not covered by insurance.',
        'I understand that billing for telehealth services may be different from in-person services.',
        'I understand that I should verify my insurance coverage for telehealth services.'
      ]
    },
    {
      id: 'communication',
      title: 'Communication and Follow-up',
      icon: <Phone className="w-6 h-6" />,
      items: [
        'I understand that my healthcare provider may need to contact me between sessions.',
        'I understand that I can contact my healthcare provider with questions or concerns.',
        'I understand that follow-up care may be recommended after telehealth sessions.',
        'I understand that I should inform my healthcare provider of any changes in my condition.'
      ]
    }
  ]

  const allConsentItems = consentSections.flatMap(section => 
    section.items.map((_, index) => `${section.id}-${index}`)
  )

  const allConsented = allConsentItems.every(item => consentItems[item])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-black">Rooted Voices</Link>
              <span className="text-gray-400">/</span>
              <h1 className="text-2xl font-bold text-black">Telehealth Consent</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/faq" className="text-gray-600 hover:text-black transition-colors">
                FAQ
              </Link>
              <Link href="/cancellation-policy" className="text-gray-600 hover:text-black transition-colors">
                Cancellation Policy
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
            Telehealth Therapy
            <br />
            <span className="gradient-text">Consent Form</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Please read and consent to the following information about our telehealth services. 
            This consent is required before beginning teletherapy sessions.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>HIPAA Compliant • Secure • Confidential</span>
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-12"
        >
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Notice</h3>
              <p className="text-blue-800">
                This consent form must be completed and signed before your first telehealth session. 
                Please read each section carefully and check the boxes to indicate your understanding and consent. 
                You may withdraw your consent at any time by contacting your therapist.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Consent Sections */}
        <div className="space-y-8">
          {consentSections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              className="bg-white rounded-2xl premium-shadow p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-black">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-black">{section.title}</h2>
              </div>
              
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => {
                  const itemId = `${section.id}-${itemIndex}`
                  const isConsented = consentItems[itemId]
                  
                  return (
                    <div key={itemIndex} className="flex items-start space-x-4">
                      <button
                        onClick={() => toggleConsent(itemId)}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                          isConsented 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {isConsented && <CheckCircle className="w-4 h-4" />}
                      </button>
                      <p className="text-gray-700 leading-relaxed">{item}</p>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technology Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 bg-white rounded-2xl premium-shadow p-8"
        >
          <h2 className="text-2xl font-bold text-black mb-6 text-center">Technology Requirements</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Required Equipment</h3>
              <ul className="space-y-3">
                {[
                  'Computer, tablet, or smartphone with camera',
                  'Microphone and speakers (or headset)',
                  'Stable internet connection (minimum 10 Mbps)',
                  'Updated web browser (Chrome, Safari, Firefox)',
                  'Private, quiet location for sessions'
                ].map((requirement, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">Recommended Setup</h3>
              <ul className="space-y-3">
                {[
                  'High-speed internet connection (25+ Mbps)',
                  'Good lighting for video quality',
                  'Comfortable seating and workspace',
                  'Backup device available',
                  'Test your setup before first session'
                ].map((recommendation, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Consent Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 bg-white rounded-2xl premium-shadow p-8"
        >
          <h2 className="text-2xl font-bold text-black mb-6 text-center">Consent Summary</h2>
          <div className="text-center">
            <div className="mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                allConsented ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {allConsented ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <p className={`text-lg font-medium ${
                allConsented ? 'text-green-600' : 'text-gray-600'
              }`}>
                {allConsented 
                  ? 'All consent items have been acknowledged' 
                  : `${Object.keys(consentItems).length} of ${allConsentItems.length} items consented`
                }
              </p>
            </div>
            
            {allConsented && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  By providing your consent, you acknowledge that you have read, understood, 
                  and agree to the terms outlined in this telehealth consent form.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download Consent Form
                  </button>
                  <Link 
                    href="/meet-our-therapists"
                    className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Find a Therapist
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 bg-white rounded-2xl premium-shadow p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-black mb-6">Questions About Telehealth?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            If you have questions about our telehealth services or need technical support, 
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
              <p className="text-gray-600 text-sm">support@rootedvoices.com</p>
              <p className="text-gray-500 text-xs">24-hour response</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Video className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-1">Tech Support</h3>
              <p className="text-gray-600 text-sm">tech@rootedvoices.com</p>
              <p className="text-gray-500 text-xs">Setup assistance</p>
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
