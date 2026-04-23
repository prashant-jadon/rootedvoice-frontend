'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, Play, Users, Calendar, Shield, Star, CheckCircle,
  Video, FileText, CreditCard, Menu, X, Heart, Mic, Brain, ChevronRight
} from 'lucide-react'
import Link from 'next/link'
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
    { icon: <Video className="w-5 h-5" />, title: 'Secure, Comfortable Sessions', description: 'Virtual sessions that are private, reliable, and designed to help you feel at ease and fully present — from wherever you are' },
    { icon: <Calendar className="w-5 h-5" />, title: 'Flexible, Stress-Free Scheduling', description: 'Easily book, reschedule, and manage your sessions in a way that actually works for your life' },
    { icon: <FileText className="w-5 h-5" />, title: 'Personalized Resources', description: 'Access materials, tools, and guidance tailored to support your progress beyond each session' },
    { icon: <CreditCard className="w-5 h-5" />, title: 'Simple, Transparent Billing', description: 'Clear, secure payments with no surprises, no confusion, and no added stress' },
    { icon: <Shield className="w-5 h-5" />, title: 'Safe and Protected Care', description: 'Your information and sessions are handled with the highest standard of privacy, security, and care' },
    { icon: <Users className="w-5 h-5" />, title: 'Ongoing Support and Connection', description: 'Stay connected with your therapist and track your growth every step of the way' }
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
            <SectionLabel>WHO WE SUPPORT</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-black text-[#132D22] mb-6">Care for Every Stage of Life</h2>
            <div className="text-xl text-[#203936]/80 leading-relaxed font-medium space-y-4">
              <p>Communication looks different for everyone — and so does the support you deserve.</p>
              <p>At Rooted Voices, we provide care across the full lifespan with intention, cultural awareness, and a deep respect for each person’s lived experience. Whether you are just beginning, rebuilding, or simply ready to feel more confident in your voice, there is space for you here.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Children",
                desc: "Who are learning to communicate, struggling to be understood, or needing support to thrive at home, in school, or in their community"
              },
              {
                title: "Adults",
                desc: "Rebuilding their voice and confidence after a stroke, injury, or neurological change — reclaiming not just speech, but themselves"
              },
              {
                title: "Individuals Seeking Confidence",
                desc: "Those who want to feel clearer, more empowered, and more fully heard in how they express themselves every day"
              },
              {
                title: "Multilingual Families",
                desc: "Who deserve care that genuinely respects and understands their language, culture, and identity — not just their diagnosis"
              },
              {
                title: "Individuals with autism and other communication differences",
                desc: "Who communicate differently and deserve support that honors, affirms, and celebrates who they are"
              },
              {
                title: "Older Adults",
                desc: "Navigating changes in memory, swallowing, or communication — with care that always prioritizes dignity, safety, and quality of life"
              }
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
                <h3 className="text-xl font-bold text-[#132D22] mb-2">{item.title}</h3>
                <p className="text-[#132D22] font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. REASSURANCE BLOCK ──────────────────────────────────────── */}
      <section className="py-20 px-5 sm:px-8 bg-[#F7EBD3]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#132D22] mb-6">Not Sure Where to Start?</h2>
          <div className="text-lg text-[#203936] leading-relaxed mb-8 space-y-4">
            <p>It is okay to not have all the answers — many of the individuals and families we work with begin in this exact place.</p>
            <p>At Rooted Voices, we start with a thoughtful, guided evaluation designed to understand you — your communication, your experiences, and your goals. Not just your symptoms. Not just a checklist. You, as a whole person.</p>
            <p>From there, we walk alongside you in building a care plan that feels supportive, clear, and aligned with exactly what you need.</p>
            <p className="font-bold">You do not have to figure this out on your own.</p>
          </div>

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
              <SectionLabel>HOW IT WORKS</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-black text-[#132D22] leading-tight mb-6"
            >
              Your Journey Starts Here
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#203936]/65 leading-relaxed max-w-lg mb-8">
              Starting speech therapy does not have to feel overwhelming. At Rooted Voices, we have created a process that is thoughtful, supportive, and centered around you from the very first step.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="bg-[#F7EBD3]/30 rounded-3xl p-8 shadow-sm border border-[#203936]/10"
          >
            <HowStep number="01" title="Share Your Story" desc="Complete a guided intake so we can understand your communication needs, your experiences, and your goals. This is not just paperwork — it is the beginning of your care." />
            <HowStep number="02" title="Find the Right Fit" desc="We thoughtfully match you with a licensed Speech-Language Pathologist who aligns with your needs, your background, and your preferences. The right fit matters, and we take that seriously." />
            <HowStep number="03" title="Begin Your Journey" desc="Start therapy in a warm, supportive space designed to help you grow, feel confident, and be fully understood — on your terms, at your pace." last />
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
              <SectionLabel>WHY ROOTED VOICES</SectionLabel>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black text-[#132D22] leading-tight mb-4">
              Care Designed With Intention — For You
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#203936]/60 leading-relaxed">
              Every part of the Rooted Voices experience is built to feel supportive, seamless, and centered around your needs — so you can focus on what matters most: growth, connection, and being fully understood.
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
          <h2 className="text-4xl md:text-5xl font-black text-[#F7EBD3] mb-6">Care That Speaks Your Language</h2>
          <div className="text-lg text-[#F7EBD3]/80 leading-relaxed max-w-3xl mx-auto mb-16 space-y-4">
            <p>At Rooted Voices, communication is more than words — it is culture, identity, and connection.</p>
            <p>We offer services in 20+ languages so that individuals and families can receive care in the language that feels most natural to them — without barriers, without translation gaps, and without anything lost in between.</p>
            <p>Because you deserve to be understood fully — not just clinically, but personally.</p>
            <p>Our platform, our therapists, and our entire approach are designed to meet you where you are — honoring your voice, your background, and your lived experience every step of the way.</p>
          </div>

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
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="flex justify-center mb-4"><SectionLabel>ROOTED STORIES</SectionLabel></div>
            <h2 className="text-4xl md:text-5xl font-black text-[#132D22] mb-4">Real Voices. Real Growth. Real Impact.</h2>
            <h3 className="text-2xl font-bold text-[#B97B40] mb-6">Because being heard changes everything.</h3>
            <p className="text-lg text-[#203936] leading-relaxed">
              Every journey looks different, but the goal is always the same — to feel understood, supported, and confident in how you communicate. Here is what that experience has meant for the individuals and families we have had the honor of walking alongside.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <TestimonialCard
              quote="Finding a therapist who truly understands our culture and speaks our language changed everything for our family. For the first time, my child felt comfortable, confident, and excited to communicate. We finally feel seen — not just supported."
              author="Maria V."
              role="Parent"
              rating={5}
            />
            <TestimonialCard
              quote="After my stroke, I didn’t just lose my ability to speak — I lost a part of myself. My therapist at Rooted Voices didn’t just help me communicate again. They helped me reconnect with who I am. That meant everything."
              author="David L."
              role="Adult Client"
              rating={5}
            />
            <TestimonialCard
              quote="What stood out most was how much care and intention went into understanding our daughter as a whole person. They didn’t try to change how she communicates — they supported her in a way that honors who she is. That is something we had never experienced before."
              author="Sarah & Tom"
              role="Parents"
              rating={5}
            />
          </div>
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-bold text-[#132D22] text-xl mb-4">Your story matters here, too.</p>
            <p className="text-lg text-[#203936]/80 mb-8">
              Whether you are just beginning your journey or searching for support that truly aligns with your needs, Rooted Voices is here to walk alongside you.<br /><br />
              Start with a comprehensive evaluation and let us build a plan that supports your voice, your goals, and your growth.
            </p>
          </div>
        </div>
      </section>

      {/* ── 8. FINAL CTA ──────────────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8 bg-[#F7EBD3] border-t border-[#203936]/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[#132D22] mb-6">Ready to Feel Heard and Supported?</h2>
          <div className="text-lg text-[#203936]/80 mb-10 space-y-4">
            <p>Starting speech therapy can feel like a big step — but you don’t have to navigate it alone.</p>
            <p>At Rooted Voices, we take the time to truly understand you — your experiences, your background, and your goals — so we can build a care plan that actually fits your life.</p>
            <p>Your journey begins with a comprehensive evaluation designed with care, intention, and clarity. From there, your licensed Speech-Language Pathologist will guide you every step of the way.</p>
          </div>
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
              For Clinicians Who Want to Do This Work Differently
            </motion.h2>
            <motion.div variants={fadeUp} className="text-[#F7EBD3]/80 leading-relaxed mb-8 max-w-lg space-y-4">
              <p className="font-bold text-white text-lg">Build your practice in a space that values both clinical excellence and human connection.</p>
              <p>At Rooted Voices, we believe therapists deserve the same level of care, intention, and support that we provide to our clients. This is more than a platform — it is a community of clinicians committed to culturally responsive, meaningful, high-quality care.</p>
              <p>We handle the logistics so you can focus on what matters most: your clients and the work that brought you to this field in the first place.</p>
            </motion.div>
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
          >
            <div className="bg-[#1C3B2D] border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">WHAT YOU CAN EXPECT:</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#B97B40] shrink-0" />
                  <span className="text-[#F7EBD3]/90">Streamlined scheduling and session management</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#B97B40] shrink-0" />
                  <span className="text-[#F7EBD3]/90">Secure, reliable payment processing — no chasing invoices</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#B97B40] shrink-0" />
                  <span className="text-[#F7EBD3]/90">Built-in tools for documentation and client tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#B97B40] shrink-0" />
                  <span className="text-[#F7EBD3]/90">A supportive, growth-centered environment</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#B97B40] shrink-0" />
                  <span className="text-[#F7EBD3]/90">Flexibility to build your caseload on your terms</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#B97B40] shrink-0" />
                  <span className="text-[#F7EBD3]/90">A mission-driven community aligned with your values</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}