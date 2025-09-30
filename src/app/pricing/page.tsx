'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Calendar, 
  MessageCircle, 
  Users, 
  FileText,
  Clock,
  Shield,
  Heart,
  Award,
  Phone,
  Mail,
  HelpCircle
} from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState('flourish')

  const pricingTiers = [
    {
      id: 'rooted',
      name: 'Rooted',
      icon: '🌱',
      price: '$50',
      period: '/30min',
      billing: 'billed every 4 weeks',
      description: 'Build a strong foundation where growth begins',
      tagline: 'For clients starting their therapy journey, establishing essential skills and confidence.',
      features: [
        'Weekly therapy sessions (2–4 per month)',
        'Personalized treatment plan with clear goals',
        'Progress updates every 8–10 weeks',
        'Caregiver tips for at-home reinforcement',
        'Secure, HIPAA-compliant teletherapy platform',
        'Email support for brief follow-up questions'
      ],
      popular: false,
      color: 'border-gray-200'
    },
    {
      id: 'flourish',
      name: 'Flourish',
      icon: '🌿',
      price: '$85',
      period: '/hour',
      billing: 'billed every 4 weeks',
      description: 'Grow, thrive, and expand your voice with care',
      tagline: 'For clients ready to dive deeper, strengthen abilities, and see meaningful progress.',
      features: [
        'Weekly or bi-weekly therapy sessions',
        'Advanced treatment strategies tailored to client needs',
        'Detailed progress reports with measurable outcomes',
        'Monthly caregiver/family coaching sessions',
        'Priority scheduling and flexible rescheduling options',
        'Collaboration with schools, physicians, or other providers',
        'Direct messaging access for timely support between sessions'
      ],
      popular: true,
      color: 'border-black ring-2 ring-black'
    },
    {
      id: 'bloom',
      name: 'Bloom',
      icon: '🌸',
      price: '$90',
      period: '/hour',
      billing: 'pay-as-you-go',
      description: 'Sustain your growth and keep your voice in full bloom',
      tagline: 'For clients maintaining progress through flexible, pay-as-you-go sessions.',
      features: [
        'Pay-as-you-go pricing',
        'A few sessions per month (flexible scheduling, 2-3 sessions monthly)',
        'Focus on maintaining skills and building confidence',
        'Ongoing professional support without long-term commitment',
        'Perfect for maintenance check-ins rather than intensive therapy',
        'Month-to-month flexibility'
      ],
      popular: false,
      color: 'border-gray-200'
    }
  ]

  const faqItems = [
    {
      question: 'What\'s included in each pricing tier?',
      answer: 'Each tier includes different levels of support, session frequency, and additional services. Rooted focuses on foundational care, Flourish provides comprehensive support, and Bloom offers flexible maintenance sessions.'
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
    },
    {
      question: 'Do you accept insurance?',
      answer: 'We are in-network with several major insurance providers. Please contact us to verify your specific coverage and benefits.'
    },
    {
      question: 'What if I need to cancel?',
      answer: 'You can cancel your subscription at any time. Please see our Cancellation Policy for details about notice requirements and any applicable fees.'
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
              <h1 className="text-2xl font-bold text-black">Pricing</h1>
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
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Simple, Transparent
            <br />
            <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that best fits your needs and budget. All plans include 
            access to our licensed therapists and secure teletherapy platform.
          </p>
        </motion.div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-white p-8 rounded-2xl premium-shadow relative ${tier.color} ${
                tier.popular ? 'ring-2 ring-black' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <div className="text-4xl mb-2">{tier.icon}</div>
                <h3 className="text-2xl font-bold text-black mb-2">{tier.name} Tier</h3>
                <div className="text-4xl font-bold text-black mb-2">
                  {tier.price}
                  <span className="text-lg text-gray-600">{tier.period}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{tier.billing}</p>
                <p className="text-gray-600 font-medium mb-2">{tier.description}</p>
                <p className="text-sm text-gray-500">{tier.tagline}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => setSelectedPlan(tier.id)}
                className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                  tier.popular 
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'border border-gray-300 text-black hover:bg-gray-50'
                }`}
              >
                {selectedPlan === tier.id ? 'Selected' : 'Select Plan'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Plan Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl premium-shadow p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-black text-center mb-8">Plan Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-black">Features</th>
                  <th className="text-center py-4 px-4 font-semibold text-black">Rooted</th>
                  <th className="text-center py-4 px-4 font-semibold text-black">Flourish</th>
                  <th className="text-center py-4 px-4 font-semibold text-black">Bloom</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Session Length', rooted: '30 minutes', flourish: '60 minutes', bloom: '60 minutes' },
                  { feature: 'Sessions per Month', rooted: '2-4 sessions', flourish: '4-8 sessions', bloom: '2-3 sessions' },
                  { feature: 'Progress Reports', rooted: 'Every 8-10 weeks', flourish: 'Detailed monthly', bloom: 'As needed' },
                  { feature: 'Family Coaching', rooted: 'Tips provided', flourish: 'Monthly sessions', bloom: 'Available' },
                  { feature: 'Priority Scheduling', rooted: 'Standard', flourish: 'Priority', bloom: 'Flexible' },
                  { feature: 'Direct Messaging', rooted: 'Email support', flourish: 'Direct access', bloom: 'Available' },
                  { feature: 'Billing', rooted: 'Every 4 weeks', flourish: 'Every 4 weeks', bloom: 'Pay-as-you-go' }
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 font-medium text-black">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{row.rooted}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{row.flourish}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{row.bloom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl premium-shadow p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-black text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                <h3 className="text-lg font-semibold text-black mb-2">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl premium-shadow p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-black text-center mb-8">Why Choose Rooted Voices?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'HIPAA Compliant',
                description: 'Your privacy and data security are protected'
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Licensed Therapists',
                description: 'All therapists are certified and experienced'
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Personalized Care',
                description: 'Treatment plans tailored to your needs'
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Flexible Scheduling',
                description: 'Appointments that fit your schedule'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-black">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-black mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose your plan and start your journey towards better communication. 
            All plans include a free 15-minute consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/meet-our-therapists" className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center group">
              <MessageCircle className="w-5 h-5 mr-2" />
              Meet Our Therapists
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/services" className="border border-gray-300 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              View Our Services
            </Link>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-white rounded-2xl premium-shadow p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-black mb-6">Questions About Pricing?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team is here to help you choose the right plan for your needs. 
            Contact us for personalized recommendations.
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
                <HelpCircle className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-black mb-1">Live Chat</h3>
              <p className="text-gray-600 text-sm">Available 24/7</p>
              <p className="text-gray-500 text-xs">Instant support</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
