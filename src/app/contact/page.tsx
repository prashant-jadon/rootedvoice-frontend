'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import Header from '@/components/Header'
import { publicAPI } from '@/lib/api'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      await publicAPI.submitContactForm(formData)
      setStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      console.error('Contact form error:', error)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7EBD3]" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
      <Header />

      <main className="flex-grow pt-28 pb-20 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-[#132D22] mb-6">Let’s Connect</h1>
            <p className="text-lg text-[#203936]/80 max-w-2xl mx-auto leading-relaxed">
              Whether you’re ready to schedule an evaluation or just exploring your options, we’re here to help you take the next step. Reach out below, and our team will be in touch within 24-48 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-3xl p-8 border border-[#203936]/10 shadow-sm">
                <h3 className="text-xl font-bold text-[#132D22] mb-6">Get in Touch</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#203936]/10 flex items-center justify-center text-[#203936] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#132D22] mb-1">Email Us</h4>
                      <p className="text-sm text-[#203936]/70 leading-relaxed">
                        Our friendly team is here to help.
                      </p>
                      <a href="mailto:info@rootedvoices.com" className="text-sm font-semibold text-[#B97B40] hover:underline mt-1 inline-block">
                        info@rootedvoices.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#203936]/10 flex items-center justify-center text-[#203936] shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#132D22] mb-1">Call Us</h4>
                      <p className="text-sm text-[#203936]/70 leading-relaxed">
                        Mon-Fri from 8am to 5pm.
                      </p>
                      <a href="tel:+18005550199" className="text-sm font-semibold text-[#B97B40] hover:underline mt-1 inline-block">
                        +1 (800) 555-0199
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#203936]/10 flex items-center justify-center text-[#203936] shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#132D22] mb-1">Office</h4>
                      <p className="text-sm text-[#203936]/70 leading-relaxed">
                        100 Therapy Way<br />
                        Suite 100<br />
                        Chicago, IL 60601
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 border border-[#203936]/10 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-[#132D22] mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#F7EBD3]/30 border border-[#203936]/20 rounded-xl focus:ring-2 focus:ring-[#203936] focus:border-transparent outline-none transition-all placeholder:text-[#203936]/40"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-[#132D22] mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#F7EBD3]/30 border border-[#203936]/20 rounded-xl focus:ring-2 focus:ring-[#203936] focus:border-transparent outline-none transition-all placeholder:text-[#203936]/40"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-[#132D22] mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#F7EBD3]/30 border border-[#203936]/20 rounded-xl focus:ring-2 focus:ring-[#203936] focus:border-transparent outline-none transition-all placeholder:text-[#203936]/40"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-[#132D22] mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#F7EBD3]/30 border border-[#203936]/20 rounded-xl focus:ring-2 focus:ring-[#203936] focus:border-transparent outline-none transition-all text-[#132D22]"
                      >
                        <option value="">Select a subject...</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Client Support / Platform Help">Client Support / Platform Help</option>
                        <option value="Billing / Payment Question">Billing / Payment Question</option>
                        <option value="Clinician Careers / Joining">Clinician Careers / Joining</option>
                        <option value="Partnership / Affiliates">Partnership / Affiliates</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-[#132D22] mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#F7EBD3]/30 border border-[#203936]/20 rounded-xl focus:ring-2 focus:ring-[#203936] focus:border-transparent outline-none transition-all placeholder:text-[#203936]/40 resize-none"
                      placeholder="How can we help you today?"
                    />
                  </div>

                  {status === 'success' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-[#2d5a27]/10 text-[#2d5a27] rounded-lg border border-[#2d5a27]/20 flex items-start gap-3">
                      <span className="text-xl">✅</span>
                      <div>
                        <p className="font-semibold text-sm">Message Sent Successfully</p>
                        <p className="text-xs opacity-90">Thank you for reaching out. We've received your inquiry and will be in touch shortly.</p>
                      </div>
                    </motion.div>
                  )}

                  {status === 'error' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
                      <p className="font-semibold text-sm">Oops! Something went wrong.</p>
                      <p className="text-xs opacity-90">Unable to send your message. Please try again later or email us directly.</p>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#203936] text-[#F7EBD3] font-bold px-8 py-4 rounded-xl hover:bg-[#132D22] hover:scale-[1.02] active:scale-100 transition-all shadow-md disabled:opacity-70 disabled:hover:scale-100"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#F7EBD3]/30 border-t-[#F7EBD3] rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
