'use client'

import { motion } from 'framer-motion'
import {
  DollarSign,
  Heart,
  Users,
  Clock,
  Shield,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Zap,
  Globe,
  Award,
  Target,
  Lightbulb,
  FileText,
  BarChart3,
  Calendar,
  MessageCircle,
  Video,
  Star
} from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
}

export default function ForTherapistsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="bg-[#F7EBD3] py-24 px-5 sm:px-8 border-b border-[#203936]/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-black text-[#132D22] mb-6 tracking-tight">
              Build Your Practice with Purpose
            </motion.h1>
            <motion.div variants={fadeUp} className="text-xl text-[#203936]/80 mb-10 space-y-5">
              <p>Join a community of clinicians who are committed to doing meaningful work — where care is intentional, connection matters, and every voice is respected.</p>
              <p>At Rooted Voices, we support clinicians who want to provide care that goes beyond checklists and productivity metrics — care that is thoughtful, culturally responsive, and genuinely centered around the people you serve.</p>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup?role=therapist"
                className="bg-[#203936] text-[#F7EBD3] px-8 py-4 rounded-full font-bold hover:bg-[#132D22] hover:scale-105 active:scale-100 transition-all duration-200 inline-flex items-center justify-center shadow-xl group"
              >
                Join as a Clinician
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/who-we-are"
                className="bg-transparent text-[#132D22] px-8 py-4 rounded-full font-bold hover:bg-[#203936]/5 transition-colors border-2 border-[#132D22]/20 hover:border-[#132D22] inline-flex items-center justify-center"
              >
                Learn More About Rooted Voices
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── COMPENSATION (Edits 27-29, 30) ────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-[#132D22] mb-6">
              Clarity, Growth, and Support — Without the Guesswork
            </motion.h2>
            <motion.div variants={fadeUp} className="text-lg text-[#203936]/80 space-y-4">
              <p>We believe clinicians deserve to know exactly how they are paid, how they grow, and how they are supported every step of the way.</p>
              <p>Our structured hourly model is designed to be transparent, sustainable, and aligned with your long-term goals — so you can stay focused on what matters most: the people you serve.</p>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* SLP Card */}
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="bg-[#F7EBD3]/30 p-8 sm:p-10 rounded-3xl border border-[#203936]/10 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-2xl font-bold text-[#132D22] mb-2">SLP (Speech-Language Pathologist) — $40–$75/hour</h3>
              <p className="text-[#203936]/80 font-medium mb-8">A transparent, growth-based pay model — no percentage splits, no hidden deductions</p>
              
              <div className="mb-8">
                <h4 className="font-bold text-[#132D22] mb-4 text-sm tracking-widest uppercase">How Compensation Works:</h4>
                <ul className="space-y-3">
                  {['Start at $40/hour', 'Earn a $5 increase for every 5 hours worked', 'Progress up to $75/hour maximum', 'You are paid your full hourly rate for every completed session'].map((li, i) => (
                    <li key={i} className="flex items-start text-[#203936]/80 text-sm font-medium">
                      <CheckCircle className="w-5 h-5 text-[#B97B40] mr-3 shrink-0" />
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#132D22] mb-4 text-sm tracking-widest uppercase">What You Can Expect:</h4>
                <ul className="space-y-3">
                  {[
                    'No percentage-based pay — your rate is your rate',
                    'Clear, predictable income growth with defined milestones',
                    'Flexible scheduling on your terms',
                    'Cancellation protection — $20 fee applied when clients cancel',
                    'Direct, transparent payment processing'
                  ].map((li, i) => (
                    <li key={i} className="flex items-start text-[#203936]/80 text-sm font-medium">
                      <CheckCircle className="w-5 h-5 text-[#B97B40] mr-3 shrink-0" />
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* SLPA Card */}
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="bg-[#F7EBD3]/30 p-8 sm:p-10 rounded-3xl border border-[#203936]/10 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-2xl font-bold text-[#132D22] mb-2">SLPA (Speech-Language Pathology Assistant) — $25–$55/hour</h3>
              <p className="text-[#203936]/80 font-medium mb-8">A supportive, structured model designed for career growth and financial consistency</p>
              
              <div className="mb-8">
                <h4 className="font-bold text-[#132D22] mb-4 text-sm tracking-widest uppercase">How Compensation Works:</h4>
                <ul className="space-y-3">
                  {['Start at $25/hour', 'Earn a $5 increase for every 5 hours worked', 'Progress up to $55/hour maximum', 'You are paid your full hourly rate for every completed session'].map((li, i) => (
                    <li key={i} className="flex items-start text-[#203936]/80 text-sm font-medium">
                      <CheckCircle className="w-5 h-5 text-[#B97B40] mr-3 shrink-0" />
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#132D22] mb-4 text-sm tracking-widest uppercase">What You Can Expect:</h4>
                <ul className="space-y-3">
                  {[
                    'No percentage splits — straightforward, honest pay',
                    'Clear hourly progression with transparent milestones',
                    'Flexible scheduling',
                    'Cancellation protection — $15 fee applied when clients cancel',
                    'A supportive environment with clear guidelines and supervision',
                    'Direct, transparent payment processing'
                  ].map((li, i) => (
                    <li key={i} className="flex items-start text-[#203936]/80 text-sm font-medium">
                      <CheckCircle className="w-5 h-5 text-[#B97B40] mr-3 shrink-0" />
                      <span>{li}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── A PRACTICE MODEL THAT SUPPORTS YOU (Edit 31) ──────────────── */}
      <section className="py-24 px-5 sm:px-8 bg-[#F7EBD3]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-[#132D22] mb-6">
              A Practice Model That Supports You
            </motion.h2>
            <motion.div variants={fadeUp} className="text-lg text-[#203936]/80 space-y-4">
              <p>Rooted Voices was designed to support not just your work — but how you show up as a clinician every single day.</p>
              <p>With structure, flexibility, and intention, we create space for you to provide care that feels aligned, sustainable, and genuinely meaningful.</p>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Clear, Growth-Based Compensation',
                desc: 'Know exactly how you are paid — and exactly how you grow. Our structured hourly model provides transparency, consistency, and a clear path for increasing your rate over time — without hidden splits, percentages, or surprises.',
                bullets: ['Fixed hourly rate — no revenue splits', 'Tiered increases based on hours worked', 'Clear milestones and a transparent growth path'],
                icon: <DollarSign className="w-6 h-6" />
              },
              {
                title: 'Flexibility That Fits Your Life',
                desc: 'Build a schedule that works for you — not the other way around.',
                bullets: ['Set your own availability', 'Work from anywhere with an internet connection', 'No minimum session requirements', 'Take time off when you need it'],
                icon: <Clock className="w-6 h-6" />
              },
              {
                title: 'Supportive, Secure Infrastructure',
                desc: 'We handle the systems — so you can stay focused on care.',
                bullets: ['HIPAA-compliant platform', 'Secure, reliable video sessions', 'Streamlined documentation tools', 'Organized, easy-to-use client management'],
                icon: <Shield className="w-6 h-6" />
              }
            ].map((card, i) => (
              <motion.div
                key={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-[#203936]/5 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-14 h-14 bg-[#F7EBD3]/60 text-[#B97B40] rounded-xl flex items-center justify-center mb-6">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-[#132D22] mb-3">{card.title}</h3>
                <p className="text-[#203936]/70 mb-6 text-sm leading-relaxed">{card.desc}</p>
                <ul className="space-y-2">
                  {card.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start text-sm text-[#203936]/80 font-medium">
                      <CheckCircle className="w-4 h-4 text-[#B97B40] mr-2 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Support Beyond the Session (Edit 32) */}
          <div className="mt-20">
            <h3 className="text-center text-sm font-bold tracking-widest uppercase text-[#B97B40] mb-10">Support Beyond the Session</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Tools That Give You Your Time Back',
                  desc: 'Spend less time documenting — and more time connecting. Our built-in tools are designed to support your workflow, simplify documentation, and give you the space to focus fully on your clients.',
                  bullets: ['AI-assisted documentation support', 'Smart resource organization', 'Automated reminders and workflows'],
                  icon: <Zap className="w-6 h-6" />
                },
                {
                  title: 'A Community That Supports You',
                  desc: 'You are not doing this alone. Rooted Voices is built on connection — giving you space to collaborate, share, and grow alongside clinicians who value meaningful, intentional care.',
                  bullets: ['Peer support and collaboration', 'Shared resources and tools', 'Opportunities for professional development', 'Mentorship and genuine connection'],
                  icon: <Users className="w-6 h-6" />
                },
                {
                  title: 'Insight Into Your Growth',
                  desc: 'Understand how your practice is evolving — without the guesswork.',
                  bullets: ['Session and progress tracking', 'Clear visibility into your caseload', 'Simple, meaningful performance insights'],
                  icon: <BarChart3 className="w-6 h-6" />
                }
              ].map((card, i) => (
                <motion.div
                  key={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-[#203936]/5 hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="w-14 h-14 bg-[#F7EBD3]/60 text-[#B97B40] rounded-xl flex items-center justify-center mb-6">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#132D22] mb-3">{card.title}</h3>
                  <p className="text-[#203936]/70 mb-6 text-sm leading-relaxed">{card.desc}</p>
                  <ul className="space-y-2">
                    {card.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-start text-sm text-[#203936]/80 font-medium">
                        <CheckCircle className="w-4 h-4 text-[#B97B40] mr-2 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR CLINICIANS WHO WANT TO PRACTICE DIFFERENTLY (Edit 33) ── */}
      <section className="py-24 px-5 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-[#132D22] mb-6">
              For Clinicians Who Want to Practice Differently
            </motion.h2>
            <motion.div variants={fadeUp} className="text-lg text-[#203936]/80 space-y-4">
              <p>Rooted Voices was created for clinicians who value intentional care, meaningful connection, and the ability to show up fully in their work.</p>
              <p>This is not about volume or productivity metrics — it is about alignment, impact, and creating space for care that truly serves the people you are here to support.</p>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Care That Centers the Person', desc: 'We believe therapy should honor the individual — their identity, their lived experiences, and the way they naturally communicate', icon: <Heart /> },
              { title: 'Quality Over Quantity', desc: 'We prioritize thoughtful, evaluation-first care — not rushed sessions, not productivity quotas, not checklists', icon: <Star /> },
              { title: 'Access Without Barriers', desc: 'Provide care across communities and cultures without being limited by location — while always practicing within your scope and licensure', icon: <Globe /> },
              { title: 'A Practice That Can Grow With You', desc: 'Build a sustainable caseload that aligns with your goals, your capacity, and your life — on your terms', icon: <TrendingUp /> },
              { title: 'Connection, Not Isolation', desc: 'Be part of a community of clinicians who genuinely value collaboration, shared learning, and supporting one another', icon: <Users /> },
              { title: 'Tools That Support — Not Replace — You', desc: 'Our platform is designed to simplify your workflow, not define it — so you can stay focused on care, not systems', icon: <Lightbulb /> }
            ].map((reason, i) => (
              <motion.div
                key={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="bg-[#F7EBD3]/30 p-8 rounded-3xl border border-[#203936]/10"
              >
                <div className="text-[#B97B40] mb-5 w-10 h-10">{reason.icon}</div>
                <h3 className="text-lg font-bold text-[#132D22] mb-3">{reason.title}</h3>
                <p className="text-[#203936]/70 text-sm leading-relaxed font-medium">{reason.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT IT FEELS LIKE TO BE ROOTED (Edit 34) ────────────────── */}
      <section className="py-24 px-5 sm:px-8 bg-[#132D22]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-black text-[#F7EBD3] mb-4">
              What It Feels Like to Be Rooted
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Community That Feels Like Alignment',
                desc: 'You are not just joining a network — you are stepping into a space where clinicians share values, not just credentials. Connect, collaborate, and grow alongside people who are doing this work with the same intention you are.',
                icon: <Users className="w-8 h-8 text-[#B97B40]" />
              },
              {
                title: 'Support That Actually Supports You',
                desc: 'From clinical guidance to platform help, you are never left figuring it out alone. Our team walks with you — because the support we offer our clients should reflect the support we offer our clinicians.',
                icon: <Heart className="w-8 h-8 text-[#B97B40]" />
              },
              {
                title: 'Growth That’s Intentional',
                desc: 'Whether you are building your practice from the ground up or refining how you work, we support growth that is sustainable, aligned, and always rooted in quality care.',
                icon: <TrendingUp className="w-8 h-8 text-[#B97B40]" />
              }
            ].map((item, i) => (
              <motion.div
                key={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 p-10 rounded-3xl flex flex-col items-center text-center backdrop-blur-md"
              >
                <div className="mb-6 bg-[#B97B40]/10 p-4 rounded-2xl">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-[#F7EBD3]/70 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA (Edit 34) ────────────────────────────────────── */}
      <section className="py-32 bg-[#B97B40] text-center px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-4xl md:text-5xl font-black text-[#132D22] mb-6">Ready to Practice with Purpose?</h2>
            <p className="text-xl text-[#132D22]/80 mb-10 font-medium leading-relaxed">
              Join Rooted Voices and build a practice that feels aligned with who you are and the care you want to provide.
            </p>
            <Link
              href="/signup?role=therapist"
              className="bg-[#132D22] text-[#F7EBD3] px-10 py-5 rounded-full font-bold hover:bg-black hover:scale-105 active:scale-100 transition-all duration-200 inline-flex items-center shadow-xl group"
            >
              Join as a Clinician
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
