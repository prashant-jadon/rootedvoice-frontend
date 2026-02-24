'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, Play, Users, Calendar, Shield, Star, CheckCircle,
  Video, FileText, CreditCard, Menu, X, Heart, Mic, Brain, ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import DemoModal from '../components/DemoModal'
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
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [pricingTiers, setPricingTiers] = useState<any[]>([])
  const [loadingPricing, setLoadingPricing] = useState(true)
  const [landingStats, setLandingStats] = useState([
    { number: '10,000+', label: 'Active Therapists', icon: '🎯' },
    { number: '50,000+', label: 'Sessions Completed', icon: '⚡' },
    { number: '99.9%', label: 'Platform Uptime', icon: '🛡️' },
    { number: '4.9/5', label: 'Client Rating', icon: '⭐' }
  ])
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
    fetchLandingStats()
  }, [])

  const fetchLandingStats = async () => {
    try {
      const response = await publicAPI.getPlatformStats()
      const stats = response.data.data
      if (stats?.landingPageStats) {
        setLandingStats([
          { number: stats.landingPageStats.activeTherapists.number, label: stats.landingPageStats.activeTherapists.label, icon: stats.landingPageStats.activeTherapists.icon },
          { number: stats.landingPageStats.sessionsCompleted.number, label: stats.landingPageStats.sessionsCompleted.label, icon: stats.landingPageStats.sessionsCompleted.icon },
          { number: stats.landingPageStats.platformUptime.number, label: stats.landingPageStats.platformUptime.label, icon: stats.landingPageStats.platformUptime.icon },
          { number: stats.landingPageStats.clientRating.number, label: stats.landingPageStats.clientRating.label, icon: stats.landingPageStats.clientRating.icon }
        ])
      }
    } catch {
      // keep defaults
    }
  }

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
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/logorooted 1.png" alt="Rooted Voices" className="h-[80px] w-auto drop-shadow-sm transition-transform duration-300 group-hover:scale-105" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              {[
                { href: '/services', label: 'Services' },
                { href: '/who-we-are', label: 'Who We Are' },
                { href: '/for-therapists', label: 'For Therapists' },
                { href: '/meet-our-therapists', label: t('nav.therapists') },
                { href: '/pricing', label: t('nav.pricing') }
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm font-semibold text-[#203936]/70 hover:text-[#203936] transition-colors duration-200 relative group"
                >
                  {label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#203936] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">

              <Link
                href="/login"
                className="hidden sm:block text-sm font-semibold text-[#203936]/70 hover:text-[#203936] transition-colors px-3 py-2"
              >
                {t('nav.signIn')}
              </Link>
              <Link
                href="/signup"
                className="bg-[#203936] text-[#F7EBD3] text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#132D22] hover:scale-[1.03] active:scale-100 transition-all duration-200 shadow-md shadow-[#203936]/20"
              >
                {t('nav.getStarted')}
              </Link>
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
              { href: '/services', label: 'Services' },
              { href: '/who-we-are', label: 'Who We Are' },
              { href: '/for-therapists', label: 'For Therapists' },
              { href: '/meet-our-therapists', label: t('nav.therapists') },
              { href: '/pricing', label: t('nav.pricing') }
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-semibold text-[#203936] hover:bg-[#203936]/6 rounded-lg transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#203936]/10 flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 text-sm font-semibold text-[#203936]/70 hover:text-[#203936]">
                {t('nav.signIn')}
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="bg-[#203936] text-[#F7EBD3] text-sm font-bold px-4 py-2.5 rounded-full text-center">
                {t('nav.getStarted')}
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[100dvh] flex items-end pb-8 sm:pb-24 overflow-hidden"
        style={{ backgroundImage: 'url("/home-bg.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center top' }}
      >
        {/* Gradient overlay — bottom-loaded like Bella Health */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#132D22]/85 via-[#132D22]/30 to-transparent" />
        {/* Subtle vignette on sides */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#132D22]/30 via-transparent to-transparent" />

        {/* Floating trust badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          style={{ opacity: heroOpacity }}
          className="absolute top-28 right-8 sm:right-16 bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-xl hidden md:flex"
        >
          <div className="w-8 h-8 bg-[#B97B40] rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white text-xs font-bold">HIPAA Compliant</div>
            <div className="text-white/60 text-[10px]">Enterprise Security</div>
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
              Find your voice.
              <br />
              <span className="text-[#B97B40]">On your terms.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base sm:text-lg text-white/75 leading-relaxed max-w-xl mb-5 sm:mb-10"
            >
              At Rooted Voices, we believe communication holds power — the power to connect, advocate, grow, and thrive.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2.5 bg-[#F7EBD3] text-[#132D22] text-sm font-black px-7 py-4 rounded-full hover:bg-white hover:scale-[1.03] active:scale-100 transition-all duration-200 shadow-xl shadow-black/30 group"
              >
                {t('landing.hero.cta')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => setShowDemoModal(true)}
                className="inline-flex items-center gap-2.5 text-white text-sm font-semibold px-6 py-4 rounded-full border border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-200 backdrop-blur-sm group"
              >
                <span className="w-7 h-7 rounded-full bg-white/15 border border-white/25 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </span>
                {t('landing.hero.watchDemo')}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS TICKER ─────────────────────────────────────────── */}
      <section className="bg-[#203936] py-7">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-5 sm:px-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden">
            {landingStats.map((s, i) => (
              <div key={i} className="bg-[#203936] px-8 py-5 text-center">
                <div className="text-2xl font-black text-[#F7EBD3]">{s.number}</div>
                <div className="text-xs text-[#F7EBD3]/50 font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── INTRO / SPLIT ────────────────────────────────────────── */}
      <section className="py-28 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Our Platform</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-black text-[#132D22] leading-tight mb-6"
            >
              Therapy that&nbsp;works —
              <br />
              <span className="text-[#203936]">wherever you are</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#203936]/65 leading-relaxed mb-8 max-w-lg">
              Rooted Voices combines licensed expertise with powerful technology to create therapy
              experiences that deliver real, lasting results. Whether you're a client on your growth
              journey or a clinician building your practice — we're built for both.
            </motion.p>
            <motion.div variants={fadeUp} className="space-y-3">
              {[
                'Licensed, certified therapists in every specialty',
                'HIPAA-secure video sessions from home',
                'Flexible plans with no long-term contracts',
                'Progress tracking and session resources included'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-[#203936]">
                  <CheckCircle className="w-4 h-4 text-[#203936] flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="mt-10">
              <Link
                href="/who-we-are"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#203936] border-b-2 border-[#203936]/30 hover:border-[#203936] pb-0.5 transition-colors group"
              >
                Learn our story
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual — how it works */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-[#203936]/6"
          >
            <SectionLabel>How It Works</SectionLabel>
            <h3 className="text-2xl font-black text-[#132D22] mb-8">Three steps to better communication</h3>
            <HowStep number="01" title="Complete Your Evaluation" desc="Answer a short intake questionnaire so we can understand your needs and match you with the right therapist." />
            <HowStep number="02" title="Get Matched & Book" desc="Review your matched therapists, see their specialties and availability, then book your first session instantly." />
            <HowStep number="03" title="Start Your Journey" desc="Attend sessions from home, access your resource library, and track your progress every step of the way." last />
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section id="features" className="py-28 px-5 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Platform Features</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-[#132D22] leading-tight mb-4">
              Everything you need.<br />
              <span className="text-[#203936]">Nothing you don't.</span>
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

      {/* ── PRICING ──────────────────────────────────────────────── */}
      <section id="pricing" className="py-28 px-5 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="text-center max-w-xl mx-auto mb-16"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Pricing</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-[#132D22] leading-tight mb-4">
              {t('landing.pricingTitle')}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#203936]/60 leading-relaxed">
              {t('landing.pricingSubtitle')}
            </motion.p>
          </motion.div>

          {loadingPricing ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#203936]/20 border-t-[#203936]" />
            </div>
          ) : pricingTiers.length === 0 ? (
            <div className="text-center py-24 text-[#203936]/40 font-medium">No plans available right now.</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {pricingTiers.map((plan, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                  className={`relative rounded-2xl border flex flex-col ${plan.popular
                    ? 'bg-[#203936] border-[#203936] shadow-2xl shadow-[#203936]/25'
                    : 'bg-white border-[#203936]/12 hover:border-[#203936]/25 hover:shadow-lg'
                    } transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-[#B97B40] text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="p-8 flex-1">
                    <div className="text-3xl mb-4">{plan.icon}</div>
                    <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.popular ? 'text-[#F7EBD3]/50' : 'text-[#203936]/40'}`}>
                      {plan.name} Tier
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className={`text-4xl font-black ${plan.popular ? 'text-[#F7EBD3]' : 'text-[#132D22]'}`}>
                        {plan.price}
                      </span>
                      <span className={`text-sm font-medium ${plan.popular ? 'text-[#F7EBD3]/60' : 'text-[#203936]/45'}`}>
                        {plan.period}
                      </span>
                    </div>
                    <div className={`text-xs mb-1 ${plan.popular ? 'text-[#F7EBD3]/50' : 'text-[#203936]/40'}`}>{plan.billing}</div>
                    {plan.sessionsPerMonth > 0 && (
                      <div className={`text-xs font-semibold mb-4 ${plan.popular ? 'text-[#F7EBD3]/70' : 'text-[#203936]/60'}`}>
                        {plan.sessionsPerMonth} session{plan.sessionsPerMonth > 1 ? 's' : ''}/month · {plan.duration} min each
                      </div>
                    )}
                    <p className={`text-sm leading-relaxed mb-6 ${plan.popular ? 'text-[#F7EBD3]/70' : 'text-[#203936]/60'}`}>
                      {plan.tagline}
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat: string, fi: number) => (
                        <li key={fi} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-[#B97B40]' : 'text-[#203936]'}`} />
                          <span className={plan.popular ? 'text-[#F7EBD3]/75' : 'text-[#203936]/70'}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-8 pt-0">
                    <Link
                      href="/pricing"
                      className={`block w-full py-3.5 rounded-full text-sm font-bold text-center transition-all duration-200 hover:scale-[1.02] active:scale-100 ${plan.popular
                        ? 'bg-[#F7EBD3] text-[#132D22] hover:bg-white shadow-lg'
                        : 'bg-[#203936] text-[#F7EBD3] hover:bg-[#132D22]'
                        }`}
                    >
                      Get Started
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FOR THERAPISTS STRIP ─────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8 bg-[#132D22]">
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
              <Link
                href="/for-therapists"
                className="inline-flex items-center gap-2 bg-[#F7EBD3] text-[#132D22] text-sm font-black px-6 py-3 rounded-full hover:bg-white transition-colors group"
              >
                Join as a Therapist
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/meet-our-therapists"
                className="inline-flex items-center gap-2 text-[#F7EBD3]/70 text-sm font-semibold px-6 py-3 rounded-full border border-[#F7EBD3]/20 hover:border-[#F7EBD3]/40 hover:text-[#F7EBD3] transition-all"
              >
                Meet our therapists
              </Link>
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



      {/* Demo modal */}
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </div>
  )
}