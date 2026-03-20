'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, Play, Users, Calendar, Shield, Star, CheckCircle,
  Video, FileText, CreditCard, Menu, X, Heart, Mic, Brain, ChevronRight
} from 'lucide-react'
// import Link from "next/link"
import { useState, useEffect, useRef } from 'react'

import { useTranslation } from '@/hooks/useTranslation'
import { subscriptionAPI, publicAPI } from '@/lib/api'

/* ─── Fade-up utility ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' as const, delay: i * 0.08 }
  })
}

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' as const } }
}


/* ─── Tag chip ────────────────────────────────────────────────── */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#203936]/20 text-[#203936] bg-[#203936]/5">
      {children}
    </span>
  )
}

/* ─── Section label ───────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-8 h-px bg-[#203936]" />
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#203936]/70">{children}</span>
    </div>
  )
}

/* ─── Stat card ───────────────────────────────────────────────── */
function StatCard({ number, label, icon }: { number: string; label: string; icon: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group bg-white rounded-2xl p-6 shadow-sm border border-[#203936]/8 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-3xl font-black text-[#203936] mb-1">{number}</div>
      <div className="text-sm text-[#203936]/60 font-medium">{label}</div>
    </motion.div>
  )
}

/* ─── Feature card ────────────────────────────────────────────── */
function FeatureCard({
  icon, title, description, index
}: {
  icon: React.ReactNode; title: string; description: string; index: number
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className="group bg-white rounded-2xl p-8 border border-[#203936]/8 hover:border-[#203936]/20 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-400 cursor-default"
    >
      <div className="w-12 h-12 rounded-xl bg-[#203936]/8 flex items-center justify-center text-[#203936] mb-6 group-hover:bg-[#203936] group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[#132D22] mb-3">{title}</h3>
      <p className="text-[#203936]/60 text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}

/* ─── How it works step ───────────────────────────────────────── */
function HowStep({ number, title, desc, last }: {
  number: string; title: string; desc: string; last?: boolean
}) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-[#203936] text-white flex items-center justify-center font-black text-sm flex-shrink-0">
          {number}
        </div>
        {!last && <div className="w-px flex-1 bg-[#203936]/15 mt-3" />}
      </div>
      <div className={`${last ? 'pb-0' : 'pb-10'} pt-2`}>
        <h4 className="text-base font-bold text-[#132D22] mb-1">{title}</h4>
        <p className="text-sm text-[#203936]/55 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

/* ─── Testimonial card ────────────────────────────────────────── */
function TestimonialCard({
  quote, author, role, rating
}: {
  quote: string; author: string; role: string; rating: number
}) {
  return (
    <div className="bg-[#F7EBD3]/60 rounded-2xl p-7 border border-[#203936]/8">
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-[#B97B40] text-[#B97B40]" />
        ))}
      </div>
      <p className="text-[#132D22] text-sm leading-relaxed mb-5 italic">"{quote}"</p>
      <div>
        <div className="font-bold text-sm text-[#132D22]">{author}</div>
        <div className="text-xs text-[#203936]/50">{role}</div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [pricingTiers, setPricingTiers] = useState<any[]>([])
  const [loadingPricing, setLoadingPricing] = useState(true)
  const t = useTranslation()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroY = useTransform(scrollY, [0, 400], [0, 60])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetchPricing()
  }, [])

  const fetchPricing = async () => {
    try {
      setLoadingPricing(true)
      const response = await subscriptionAPI.getPricing()
      const backendPricing = response.data.data
      const iconMap: Record<string, string> = { rooted: '🌱', flourish: '🌿', bloom: '🌸' }
      const descriptionMap: Record<string, string> = {
        rooted: 'Build a strong foundation where growth begins',
        flourish: 'Grow, thrive, and expand your voice with care',
        bloom: 'Sustain your growth and keep your voice in full bloom'
      }
      const taglineMap: Record<string, string> = {
        rooted: 'For clients starting their therapy journey.',
        flourish: 'For clients ready to dive deeper and see real progress.',
        bloom: 'For clients seeking intensive, flexible therapy support.'
      }
      const billingCycleMap: Record<string, string> = {
        'every-4-weeks': 'billed monthly', monthly: 'billed monthly',
        'pay-as-you-go': 'per session', 'one-time': 'one-time payment'
      }
      const transformedPricing = Object.entries(backendPricing).map(([tierId, tierData]: [string, any]) => {
        const tierName = tierData.name.replace(' Tier', '').replace(' tier', '')
        let periodDisplay = '/month'
        let billingText = billingCycleMap[tierData.billingCycle] || tierData.billingCycle
        if (tierData.billingCycle === 'pay-as-you-go') { periodDisplay = '/session'; billingText = 'per session' }
        if (tierData.billingCycle === 'one-time') { periodDisplay = ''; billingText = 'one-time payment' }
        return {
          id: tierId, name: tierName,
          icon: tierData.icon || iconMap[tierId] || '💎',
          price: `$${tierData.price}`, period: periodDisplay, billing: billingText,
          description: tierData.description || descriptionMap[tierId] || '',
          tagline: taglineMap[tierId] || '',
          features: tierData.features || [],
          popular: tierData.popular || false,
          sessionsPerMonth: tierData.sessionsPerMonth || 0,
          duration: tierData.duration || 45
        }
      })
      setPricingTiers(transformedPricing.filter(t => ['rooted', 'flourish', 'bloom'].includes(t.id)))
    } catch {
      setPricingTiers([])
    } finally {
      setLoadingPricing(false)
    }
  }

  const testimonials = [
    { quote: "Rooted Voices completely transformed how I connect with clients. The platform is intuitive, secure, and genuinely helps me deliver better care.", author: "Sarah M.", role: "Licensed Speech-Language Pathologist", rating: 5 },
    { quote: "As a parent, finding a therapist that truly 'gets' my child was hard. This platform made the whole process comfortable and effective.", author: "James T.", role: "Parent of a client", rating: 5 },
    { quote: "The scheduling and billing features save me hours every week. I can focus entirely on my clients now.", author: "Dr. Priya K.", role: "Speech Therapist, 12 years", rating: 5 }
  ]

  const features = [
    { icon: <Video className="w-5 h-5" />, title: 'Secure Video Sessions', description: 'HD video calls with end-to-end encryption, screen sharing, and session recordings built for clinical settings.' },
    { icon: <Calendar className="w-5 h-5" />, title: 'Smart Scheduling', description: 'Integrated calendar with automated reminders, rescheduling, and intelligent timezone management.' },
    { icon: <FileText className="w-5 h-5" />, title: 'Resource Library', description: 'Upload and share worksheets, guides, and practice materials directly with your clients.' },
    { icon: <CreditCard className="w-5 h-5" />, title: 'Automated Billing', description: 'Secure payments, subscription management, and automatic invoice generation — zero admin hassle.' },
    { icon: <Shield className="w-5 h-5" />, title: 'HIPAA Compliant', description: 'Enterprise-grade security with full HIPAA compliance and end-to-end data protection.' },
    { icon: <Users className="w-5 h-5" />, title: 'Client Management', description: 'Comprehensive profiles, session notes, progress tracking, and client history in one place.' }
  ]

  return (
    <div className="min-h-screen bg-[#F7EBD3]" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>

      {/* ── NAVIGATION ───────────────────────────────────────────── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#F7EBD3]/95 backdrop-blur-xl shadow-sm border-b border-[#203936]/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex justify-between items-center h-[68px]">

            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <img src="/logorooted 1.png" alt="Rooted Voices" className="h-[80px] w-auto drop-shadow-sm transition-transform duration-300 group-hover:scale-105" />
            </a>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              {[
                { href: '/', label: 'Home' },
                { href: '/services', label: 'Services' },
                { href: '/meet-our-therapists', label: 'Meet Our Therapists' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/faq', label: 'FAQ' },
                { href: '/evaluation-booking', label: 'Schedule Evaluation' }
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm font-semibold text-[#203936]/70 hover:text-[#203936] transition-colors duration-200 relative group"
                >
                  {label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#203936] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <a
                href="/login?role=client"
                className="hidden sm:block text-sm font-semibold text-[#203936]/70 hover:text-[#203936] transition-colors px-3 py-2"
              >
                Client Login
              </a>
              <a
                href="/evaluation-booking"
                className="bg-[#203936] text-[#F7EBD3] text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#132D22] hover:scale-[1.03] active:scale-100 transition-all duration-200 shadow-md shadow-[#203936]/20"
              >
                Start Your Evaluation
              </a>
              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#203936] hover:bg-[#203936]/8 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#F7EBD3] border-t border-[#203936]/10 px-5 py-4 space-y-1"
          >
            {[
              { href: '/', label: 'Home' },
              { href: '/services', label: 'Services' },
              { href: '/meet-our-therapists', label: 'Meet Our Therapists' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/faq', label: 'FAQ' },
              { href: '/evaluation-booking', label: 'Schedule Evaluation' }
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-semibold text-[#203936] hover:bg-[#203936]/6 rounded-lg transition-colors"
              >
                {label}
              </a>
            ))}
            <div className="pt-3 border-t border-[#203936]/10 flex flex-col gap-2">
              <a href="/login?role=client" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 text-sm font-semibold text-[#203936]/70 hover:text-[#203936]">
                Client Login
              </a>
              <a href="/evaluation-booking" onClick={() => setMobileMenuOpen(false)} className="bg-[#203936] text-[#F7EBD3] text-sm font-bold px-4 py-2.5 rounded-full text-center">
                Start Your Evaluation
              </a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[100dvh] flex items-end pb-8 sm:pb-24 overflow-hidden"
        style={{ backgroundImage: 'url("/home-bg.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center top' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#132D22]/85 via-[#132D22]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#132D22]/30 via-transparent to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          style={{ opacity: heroOpacity }}
          className="absolute top-28 right-8 sm:right-16 bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-xl hidden md:flex"
        >
          <div className="w-8 h-8 bg-[#203936] rounded-full flex items-center justify-center text-xl">
            🌍
          </div>
          <div>
            <div className="text-white text-xs font-bold">Available in 20+ Languages</div>
            <div className="text-white/60 text-[10px]">Multilingual Care</div>
          </div>
        </motion.div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full"
        >
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="max-w-3xl"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[1.06] tracking-tight mb-3 sm:mb-6"
            >
              From first words to restored ones —<br />
              <span className="text-[#B97B40]">we show up for every stage of the journey.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-white/75 leading-relaxed max-w-xl mb-5 sm:mb-10"
            >
              Care that honors where you come from — and meets you wherever you are.
            </motion.p>
            
            <motion.p variants={fadeUp} className="text-sm text-white/60 mb-3 font-semibold tracking-wider uppercase">
              Your journey starts here.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
              <a
                href="/evaluation-booking"
                className="inline-flex items-center justify-center gap-2.5 bg-[#F7EBD3] text-[#132D22] text-sm font-black px-7 py-4 rounded-full hover:bg-white hover:scale-[1.03] active:scale-100 transition-all duration-200 shadow-xl shadow-black/30 group"
              >
                Start Your Evaluation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/for-therapists"
                className="inline-flex items-center justify-center gap-2.5 text-white text-sm font-semibold px-6 py-4 rounded-full border border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-200 backdrop-blur-sm group"
              >
                Join as a Clinician
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── MISSION ANCHOR (New) ─────────────────────────────────────── */}
      <section className="bg-[#132D22] text-[#F7EBD3] py-16 px-5 sm:px-8 text-center border-y border-[#203936]/20 shadow-inner">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <Heart className="w-8 h-8 text-[#B97B40] mb-6 animate-pulse" />
          <p className="text-2xl sm:text-3xl font-medium leading-relaxed italic">
            "The care I would have wanted my grandparents to receive — that is the standard we hold ourselves to at Rooted Voices."
          </p>
        </div>
      </section>

      {/* ── 2. WHO WE SUPPORT ─────────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8 bg-white" id="who-we-support">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <SectionLabel>Who We Support</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-black text-[#132D22] mb-6">Care for every stage of life.</h2>
            <p className="text-xl text-[#203936]/80 leading-relaxed font-medium">
              Rooted Voices was built to serve people across the full lifespan — from children finding their first words, to adults reclaiming their voice after illness or injury, to elders who deserve care that sees them fully. Wherever you are in your journey, there is a place for you here.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Children who are late to talk, hard to understand, or struggling to keep up in school",
              "Adults rebuilding their voice and confidence after a stroke, injury, or neurological change",
              "People who want to feel more confident and clear in how they speak and express themselves",
              "Families who speak more than one language and want care that genuinely understands their background",
              "Children and adults with autism who communicate differently and deserve support that honors that",
              "Elders navigating changes in swallowing, memory, or communication as they age"
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="bg-[#F7EBD3]/30 p-8 rounded-2xl border border-[#203936]/10 hover:-translate-y-1 transition-transform duration-300"
              >
                <Heart className="w-8 h-8 text-[#B97B40] mb-4" />
                <p className="text-[#132D22] font-medium leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. REASSURANCE BLOCK ──────────────────────────────────────── */}
      <section className="py-20 px-5 sm:px-8 bg-[#F7EBD3]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#132D22] mb-6">Not Sure Where to Start?</h2>
          <p className="text-lg text-[#203936] leading-relaxed mb-8">
            You're not alone. Many families and adults come to us unsure where to begin — and that's completely okay. Our first step is a guided evaluation designed to understand your specific situation and goals. From there, we walk with you through every step of the process. You don't have to figure it out alone.
          </p>
          <a
            href="/evaluation-booking"
            className="inline-flex items-center gap-2 bg-[#203936] text-white text-sm font-bold px-8 py-4 rounded-full hover:bg-[#132D22] transition-colors shadow-lg group"
          >
            Start Your Evaluation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ───────────────────────────────────────────── */}
      <section className="py-28 px-5 sm:px-8 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>How It Works</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-black text-[#132D22] leading-tight mb-6"
            >
              Your path to care.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#203936]/65 leading-relaxed max-w-lg mb-8">
              We've made finding the right therapist and starting your journey as simple and supportive as possible. Our process is designed to center your specific needs from day one.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="bg-[#F7EBD3]/30 rounded-3xl p-8 shadow-sm border border-[#203936]/10"
          >
            <HowStep number="01" title="Complete a Guided Intake" desc="Complete a guided intake so we can understand your goals and match you with the right therapist." />
            <HowStep number="02" title="Find Your Perfect Match" desc="Get matched with a licensed speech-language pathologist who understands your unique needs." />
            <HowStep number="03" title="Start Growing" desc="Begin virtual therapy tailored to your goals in a supportive environment that understands who you are and where you come from." last />
          </motion.div>
        </div>
      </section>

      {/* ── 5. WHY ROOTED VOICES ──────────────────────────────────────── */}
      <section className="py-28 px-5 sm:px-8 bg-gray-50 border-t border-[#203936]/5" id="why-rooted-voices">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Why Rooted Voices</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-[#132D22] leading-tight mb-4">
              Everything you need.<br />
              <span className="text-[#B97B40]">Nothing you don't.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#203936]/60 leading-relaxed">
              Built with clinicians in mind and designed for clients who deserve a seamless experience.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. CARE IN YOUR LANGUAGE ──────────────────────────────────── */}
      <section className="py-32 px-5 sm:px-8 bg-[#203936] text-white overflow-hidden relative" id="multilingual-support">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mx-auto w-16 h-16 bg-[#F7EBD3]/10 rounded-full flex items-center justify-center mb-6 border border-[#F7EBD3]/20">
            <span className="text-2xl">🌍</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#F7EBD3] mb-6">🌱 Speech Therapy in Your Language.</h2>
          <p className="text-lg text-[#F7EBD3]/80 leading-relaxed max-w-3xl mx-auto mb-16">
            Rooted Voices is available in 20+ languages — so that every family, in every community, can access the care they deserve without a language barrier standing in the way. Our site, our sessions, and our care are built to meet you where you are.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {['Español', 'Français', 'العربية', 'Português', '中文', 'Tagalog', 'Tiếng Việt', '한국어', 'Русский', 'Deutsch', '日本語', 'Italiano', 'Polski', 'हिन्दी', 'اردو'].map((lang, i) => (
              <span key={i} className="px-5 py-2.5 bg-white/10 rounded-full text-[#F7EBD3] font-medium border border-white/20 backdrop-blur-sm shadow-sm hover:bg-white/20 transition-colors cursor-default">
                {lang}
              </span>
            ))}
            <span className="px-5 py-2.5 bg-[#B97B40] rounded-full text-white font-bold shadow-lg">
              + More
            </span>
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ────────────────────────────────────────────── */}
      <section className="py-28 px-5 sm:px-8 bg-white" id="testimonials">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>Rooted Stories</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-black text-[#132D22] mb-4">Real Families. Real Progress.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestimonialCard 
              quote="Finding a therapist who truly understands our cultural background and speaks our language made all the difference for my son. He's thriving!" 
              author="Maria V." 
              role="Parent of a pediatric client" 
              rating={5} 
            />
            <TestimonialCard 
              quote="After my stroke, I lost my confidence. My Rooted Voices therapist didn't just help me speak again; they helped me find me again." 
              author="David L." 
              role="Adult client" 
              rating={5} 
            />
            <TestimonialCard 
              quote="The therapy structure and personalized approach has been incredible for our autistic daughter. They really honor how she communicates." 
              author="Sarah & Tom" 
              role="Parents" 
              rating={5} 
            />
          </div>
        </div>
      </section>

      {/* ── 8. FINAL CTA ──────────────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8 bg-[#F7EBD3] border-t border-[#203936]/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[#132D22] mb-6">Ready to find your voice?</h2>
          <p className="text-lg text-[#203936]/80 mb-10">Join the thousands of clients who have discovered life-changing care.</p>
          <a
            href="/evaluation-booking"
            className="inline-flex items-center gap-2 bg-[#203936] text-white text-sm font-black px-8 py-4 rounded-full hover:bg-[#132D22] hover:scale-105 transition-all duration-200 shadow-xl group"
          >
            Start Your Evaluation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* ── 9. CLINICIAN RECRUITMENT CONTENT ───────────────────────────── */}
      <section className="py-24 px-5 sm:px-8 bg-[#132D22]" id="for-clinicians">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.div variants={fadeUp} className="mb-4">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-[#F7EBD3]/20 text-[#F7EBD3]/60">
                <Mic className="w-3 h-3" />
                For Therapists
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-[#F7EBD3] leading-tight mb-5">
              Build your practice.<br />
              <span className="text-[#B97B40]">We handle the rest.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#F7EBD3]/55 leading-relaxed mb-8 max-w-lg">
              From automated billing to smart scheduling and a built-in client management system —
              Rooted Voices lets you focus on what you love: helping people find their voice.
            </motion.p>
            <motion.div variants={fadeUp} className="flex gap-4 flex-wrap">
              <a
                href="/for-therapists"
                className="inline-flex items-center gap-2 bg-[#F7EBD3] text-[#132D22] text-sm font-black px-6 py-3 rounded-full hover:bg-white transition-colors group"
              >
                Join as a Clinician
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/meet-our-therapists"
                className="inline-flex items-center gap-2 text-[#F7EBD3]/70 text-sm font-semibold px-6 py-3 rounded-full border border-[#F7EBD3]/20 hover:border-[#F7EBD3]/40 hover:text-[#F7EBD3] transition-all"
              >
                Meet our therapists
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: <CreditCard className="w-5 h-5" />, title: 'Automated Billing', desc: 'Never chase a payment again' },
              { icon: <Calendar className="w-5 h-5" />, title: 'Smart Calendar', desc: 'Scheduling that works for you' },
              { icon: <Brain className="w-5 h-5" />, title: 'Session Notes', desc: 'AI-assisted documentation' },
              { icon: <Users className="w-5 h-5" />, title: 'Client Roster', desc: 'Full client history at a glance' }
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/6 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-[#B97B40]/20 text-[#B97B40] flex items-center justify-center mb-4 group-hover:bg-[#B97B40]/30 transition-colors">
                  {item.icon}
                </div>
                <div className="font-bold text-sm text-[#F7EBD3] mb-1">{item.title}</div>
                <div className="text-xs text-[#F7EBD3]/40">{item.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  )
}