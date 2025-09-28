'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Users, Calendar, Shield, Star, CheckCircle, Video, FileText, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black">Rooted Voices</h1>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-black transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-black transition-colors">Pricing</a>
              <a href="#about" className="text-gray-600 hover:text-black transition-colors">About</a>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-black transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors">
                Get Started
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-black transition-colors">
                Demo Dashboard
              </Link>
              <Link href="/client-dashboard" className="text-gray-600 hover:text-black transition-colors">
                Client Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-black mb-8 leading-tight"
            >
              Make speech & language therapy
              <br />
              <span className="gradient-text">accessible, private, and effective</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
            >
              A secure online platform where clients can easily book and attend therapy sessions, 
              while therapists get tools to save time, manage their practice, and reach more clients.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/signup" className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center group">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center text-gray-600 hover:text-black transition-colors">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Parallax Hero Image */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="w-96 h-96 bg-gray-100 rounded-3xl premium-shadow flex items-center justify-center"
          >
            <Video className="w-32 h-32 text-gray-400" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Everything you need for
              <br />
              <span className="gradient-text">effective therapy</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From secure video sessions to automated billing, we've got you covered.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Video className="w-8 h-8" />,
                title: "Secure Video Sessions",
                description: "HD video calls with end-to-end encryption, screen sharing, and recording capabilities."
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Smart Scheduling",
                description: "Integrated calendar with automated reminders, rescheduling, and timezone management."
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "Resource Library",
                description: "Upload and share worksheets, guides, and practice materials with your clients."
              },
              {
                icon: <CreditCard className="w-8 h-8" />,
                title: "Automated Billing",
                description: "Secure payments, subscription management, and automatic invoice generation."
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "HIPAA Compliant",
                description: "Enterprise-grade security with full compliance and data protection."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Client Management",
                description: "Comprehensive client profiles, session notes, and progress tracking."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl premium-shadow hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-black mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "Active Therapists" },
              { number: "50,000+", label: "Sessions Completed" },
              { number: "99.9%", label: "Uptime" },
              { number: "4.9/5", label: "Client Rating" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-black mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Simple, transparent
              <br />
              <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for your practice.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$29",
                period: "/month",
                description: "Perfect for individual therapists",
                features: [
                  "Up to 50 sessions/month",
                  "Basic video calls",
                  "Client management",
                  "Email support"
                ]
              },
              {
                name: "Professional",
                price: "$79",
                period: "/month",
                description: "For growing practices",
                features: [
                  "Unlimited sessions",
                  "HD video calls",
                  "Resource library",
                  "Automated billing",
                  "Priority support"
                ],
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                description: "For large organizations",
                features: [
                  "Everything in Professional",
                  "Custom integrations",
                  "Dedicated support",
                  "Advanced analytics",
                  "White-label options"
                ]
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white p-8 rounded-2xl premium-shadow relative ${
                  plan.popular ? 'ring-2 ring-black' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-black mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-black mb-2">
                    {plan.price}
                    <span className="text-lg text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-600">{feature}</span>
          </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'border border-gray-300 text-black hover:bg-gray-50'
                }`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-black mb-8"
          >
            Ready to transform your
            <br />
            <span className="gradient-text">therapy practice?</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 mb-12"
          >
            Join thousands of therapists who are already using Rooted Voices to grow their practice.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/signup" className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center group">
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="text-gray-600 hover:text-black transition-colors">
              Schedule a Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Rooted Voices</h3>
              <p className="text-gray-400">
                Making speech & language therapy accessible, private, and effective for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">HIPAA</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Rooted Voices. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}