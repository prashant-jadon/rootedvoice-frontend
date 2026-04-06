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
  // Removed stats block as per user request

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
      description: 'We lead with compassion that honors the whole person, not just a diagnosis. Rooted Voices is a space where individuals and families feel safe, respected, and seen. We recognize that how a person communicates is deeply personal — shaped by who they are, where they come from, and the life they have lived. We honor all of it.'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: '🎯 Research-Informed Care',
      description: 'Everything we do is grounded in the latest research — so you can trust that the therapy your family receives is not only compassionate, but proven to work.'
    }
  ]


  const certifications = [
    'ASHA Certified Speech-Language Pathologists (CCC-SLP)',
    'State Licensed & Actively Practicing',
    'HIPAA-Compliant & Secure Platform',
    'Ongoing Clinical Education & Professional Development',
    'Specialized Training Across Communication & Swallowing Disorders',
    'Care that Understands Who You Are & Inclusive Care'
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
            <h2 className="text-3xl font-bold text-black mb-6 text-center">A NOTE FROM OUR FOUNDER</h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Rooted Voices was created from both professional experience and lived understanding.
              </p>
              <p>
                As a speech-language pathologist, I have witnessed the power of communication to transform lives — from first words spoken to confidence restored, from being misunderstood to finally being heard. I have also seen where traditional systems fall short, particularly for individuals and communities who are too often overlooked.
              </p>
              <p>
                My passion for this work is deeply personal. Experiences within my own family and community shaped my understanding of how meaningful, culturally responsive care can impact not just communication, but quality of life.
              </p>
              <p>
                Rooted Voices exists to do things differently.
              </p>
              <p>
                This is a space built with intention — where clinical excellence and humanity coexist, and where every person receives care grounded in compassion, cultural humility, and genuine respect for who they are and where they come from. We believe communication is more than a skill. It is a bridge to connection, dignity, and belonging.
              </p>
              <p>
                At Rooted Voices, no voice is overlooked. Every story matters. If you have found your way here, know that this space was created with you in mind.
              </p>
              <div className="pt-6 border-t border-gray-200 mt-8">
                <p className="text-black font-semibold mb-2">With intention and care,</p>
                <p className="text-black font-semibold">
                  Ashley Blocker-Wilbourn, MS, CCC-SLP<br />
                  <span className="text-lg">Founder, Rooted Voices</span>
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
              A Speech-Language Pathologist (SLP) is a licensed specialist trained to evaluate and support how people communicate and swallow — from the first words a child speaks, to helping an adult find their voice again after a stroke, to supporting someone who communicates without spoken words at all.
            </p>
            <div>
              <h3 className="text-xl font-semibold text-black mb-4">SLPs support areas including:</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl pt-1">🗣️</span>
                  <div>
                    <span className="font-semibold text-gray-900 block mb-1">How Clearly You Speak</span>
                    <span className="text-gray-600 text-sm">Helping people be understood — whether a child is learning to say sounds correctly or an adult wants to feel more confident in how they come across.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl pt-1">🧠</span>
                  <div>
                    <span className="font-semibold text-gray-900 block mb-1">When the Brain Affects Speech</span>
                    <span className="text-gray-600 text-sm">Supporting people whose speech has been affected by neurological conditions — where words are hard to find, hard to form, or come out differently than intended.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl pt-1">💬</span>
                  <div>
                    <span className="font-semibold text-gray-900 block mb-1">Understanding & Expressing Language</span>
                    <span className="text-gray-600 text-sm">Helping people make sense of what they hear and read, and find the words to say what they mean — in conversations, at school, and in everyday life.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl pt-1">🤝</span>
                  <div>
                    <span className="font-semibold text-gray-900 block mb-1">Connecting With Others</span>
                    <span className="text-gray-600 text-sm">Supporting people who find social situations, reading the room, or building conversation challenging — so connection feels less overwhelming.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl pt-1">🧩</span>
                  <div>
                    <span className="font-semibold text-gray-900 block mb-1">Thinking & Communication Together</span>
                    <span className="text-gray-600 text-sm">Helping people whose memory, attention, or thinking affects how they communicate — often after a brain injury, stroke, or neurological diagnosis.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl pt-1">🌊</span>
                  <div>
                    <span className="font-semibold text-gray-900 block mb-1">Fluency & Flow</span>
                    <span className="text-gray-600 text-sm">Supporting people who stutter or experience interruptions in the rhythm of their speech — with strategies that build confidence and ease.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl pt-1">🎙️</span>
                  <div>
                    <span className="font-semibold text-gray-900 block mb-1">Voice</span>
                    <span className="text-gray-600 text-sm">Helping people whose voice — its sound, strength, or quality — has changed or no longer feels like them.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl pt-1">📱</span>
                  <div>
                    <span className="font-semibold text-gray-900 block mb-1">Communicating in Every Way</span>
                    <span className="text-gray-600 text-sm">Supporting people who use devices, pictures, gestures, eye gaze, or any other method to communicate — because speech is not the only valid voice.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-2xl pt-1">🍽️</span>
                  <div>
                    <span className="font-semibold text-gray-900 block mb-1">Eating & Swallowing</span>
                    <span className="text-gray-600 text-sm">Helping people for whom eating, drinking, or swallowing has become difficult, uncomfortable, or unsafe.</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-200">
              <p className="text-lg text-gray-600 leading-relaxed text-center font-medium">
                Some people communicate with spoken words.<br />
                Others use devices, gestures, movement, pictures, or a look in their eyes.<br />
                A great SLP honors every single one of those languages.<br />
                We meet each person exactly where they are. 🌱
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
              To deliver exceptional, personalized speech-language therapy to every person who needs it — regardless of where they live, what language they speak, or how they communicate. We believe access to great care should never depend on geography, background, or circumstance.
            </p>
          </div>

          <div className="bg-white rounded-2xl premium-shadow p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-4 text-center">🌿 Vision Statement</h2>
            <div className="text-gray-600 leading-relaxed text-center space-y-4">
              <p>A world where no voice is overlooked, and where communication differences are met with understanding, not judgment.</p>
              <p>Where every person — at every stage of life, in every corner of the world — has access to care that is exceptional, human, and built for them.</p>
            </div>
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
                title: 'Rooted in Skill. Delivered with Heart.',
                description: 'Therapy grounded in the latest research, delivered by clinicians who treat every person as a whole human being — not a diagnosis.'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-black">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 8. Clinician Recruitment Block (Replaces Stats) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 bg-[#132D22] text-[#F7EBD3] rounded-2xl p-10 md:p-14 text-center mx-auto max-w-5xl shadow-xl shadow-[#203936]/10"
        >
          <div className="w-16 h-16 bg-[#F7EBD3]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-[#B97B40]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Growing Practice</h2>
          <p className="text-lg md:text-xl text-[#F7EBD3]/80 leading-relaxed max-w-3xl mx-auto mb-10">
            Rooted Voices is currently welcoming licensed speech-language pathologists who share our commitment to accessible, compassionate care. We are growing intentionally — because who joins this platform matters as much as what we build. If you are a licensed SLP ready to be part of something meaningful, we would love to hear from you.
          </p>
          <a href="/for-therapists" className="inline-flex items-center gap-2 bg-[#B97B40] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#A06A36] transition-all shadow-lg shadow-[#B97B40]/20 hover:-translate-y-1">
            Learn More About Joining
            <ArrowRight className="w-5 h-5" />
          </a>
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
