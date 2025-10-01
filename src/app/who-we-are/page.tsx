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

export default function WhoWeArePage() {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Compassionate Care',
      description: 'We believe in treating every client with empathy, respect, and understanding, creating a safe space for growth and healing.'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Evidence-Based Practice',
      description: 'Our therapy approaches are grounded in research and proven methodologies, ensuring the most effective treatment for each individual.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Collaborative Approach',
      description: 'We work closely with clients, families, and other healthcare providers to create comprehensive, personalized treatment plans.'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Innovation & Technology',
      description: 'We leverage cutting-edge technology and innovative approaches to make therapy more accessible and effective for everyone.'
    }
  ]

  const teamStats = [
    { number: '50+', label: 'Licensed Therapists' },
    { number: '15+', label: 'Years Combined Experience' },
    { number: '10,000+', label: 'Sessions Completed' },
    { number: '95%', label: 'Client Satisfaction Rate' }
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
              <Link href="/" className="text-2xl font-bold text-black">Rooted Voices</Link>
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
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Who We Are
            <br />
            <span className="gradient-text">Rooted Voices</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We are a team of dedicated speech-language pathologists committed to making 
            communication therapy accessible, effective, and personalized for every client.
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl premium-shadow p-8 mb-16"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-black mb-6 text-center">Our Story</h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Rooted Voices began with a simple belief: <span className="font-semibold text-black">everyone deserves a voice</span>. 
                Founded by speech-language pathologists who experienced firsthand the barriers families face in accessing quality therapy, 
                we set out to create something different—a platform where geography, cost, and stigma would no longer stand in the way of care.
              </p>
              <p>
                We've seen the transformative power of speech therapy—<span className="font-semibold text-black">the child who finds their first words</span>, 
                the stroke survivor who reconnects with loved ones, the professional who reclaims their confident voice. 
                These moments inspire everything we do.
              </p>
              <p>
                Today, Rooted Voices serves thousands of clients nationwide, connecting them with passionate, licensed therapists 
                who specialize in their unique needs. <span className="font-semibold text-black">From our roots in compassionate care, 
                we help voices flourish and bloom</span>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          <div className="bg-white rounded-2xl premium-shadow p-8">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-4 text-center">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed text-center">
              To provide exceptional speech and language therapy services that empower individuals 
              to communicate effectively, build confidence, and achieve their personal and professional goals. 
              We believe that everyone deserves access to high-quality, evidence-based therapy that respects 
              their unique needs and circumstances.
            </p>
          </div>

          <div className="bg-white rounded-2xl premium-shadow p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-4 text-center">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed text-center">
              A world where every person, regardless of age, background, or circumstance, has access to 
              compassionate, effective speech and language therapy. We envision a future where communication 
              barriers dissolve, voices are heard, and every individual can express themselves with confidence and clarity.
            </p>
          </div>
        </motion.div>

        {/* Team Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-4 gap-8 mb-16"
        >
          {teamStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-black mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
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

        {/* Our Approach */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl premium-shadow p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-black text-center mb-8">Our Approach</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">Assessment & Planning</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive evaluation to understand your unique needs and develop personalized treatment goals.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">Collaborative Therapy</h3>
              <p className="text-gray-600 text-sm">
                Working together with you, your family, and other healthcare providers for the best outcomes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-3">Progress & Growth</h3>
              <p className="text-gray-600 text-sm">
                Regular monitoring and adjustment of treatment plans to ensure continuous progress and success.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Certifications & Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl premium-shadow p-8 mb-16"
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

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl premium-shadow p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-black text-center mb-8">Why Choose Rooted Voices?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'HIPAA Compliant',
                description: 'Your privacy and data security are our top priorities.'
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Accessible Anywhere',
                description: 'Receive therapy from the comfort of your own home.'
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Flexible Scheduling',
                description: 'Appointments that fit your busy lifestyle.'
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: 'Proven Results',
                description: 'Evidence-based approaches with measurable outcomes.'
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
          <h2 className="text-3xl font-bold text-black mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of clients who have improved their communication skills with Rooted Voices. 
            Take the first step towards better communication today.
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
      </div>
    </div>
  )
}
