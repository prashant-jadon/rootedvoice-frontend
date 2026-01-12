'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Users, Calendar, Shield, Star, CheckCircle, Video, FileText, CreditCard, Palette, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import DemoModal from '../components/DemoModal'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useTranslation } from '@/hooks/useTranslation'
import { subscriptionAPI, publicAPI } from '@/lib/api'

export default function LandingPage() {
  const [currentPalette, setCurrentPalette] = useState('1')
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [pricingTiers, setPricingTiers] = useState<any[]>([])
  const [loadingPricing, setLoadingPricing] = useState(true)
  const [landingStats, setLandingStats] = useState([
    { number: "10,000+", label: "Active Therapists", icon: "🎯" },
    { number: "50,000+", label: "Sessions Completed", icon: "⚡" },
    { number: "99.9%", label: "Platform Uptime", icon: "⭐" },
    { number: "4.9/5", label: "Client Rating", icon: "⭐" }
  ])
  const t = useTranslation()

  useEffect(() => {
    // Set the data attribute on the html element to control CSS variables
    document.documentElement.setAttribute('data-palette', currentPalette)
  }, [currentPalette])

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
          {
            number: stats.landingPageStats.activeTherapists.number,
            label: stats.landingPageStats.activeTherapists.label,
            icon: stats.landingPageStats.activeTherapists.icon
          },
          {
            number: stats.landingPageStats.sessionsCompleted.number,
            label: stats.landingPageStats.sessionsCompleted.label,
            icon: stats.landingPageStats.sessionsCompleted.icon
          },
          {
            number: stats.landingPageStats.platformUptime.number,
            label: stats.landingPageStats.platformUptime.label,
            icon: stats.landingPageStats.platformUptime.icon
          },
          {
            number: stats.landingPageStats.clientRating.number,
            label: stats.landingPageStats.clientRating.label,
            icon: stats.landingPageStats.clientRating.icon
          }
        ])
      }
    } catch (error) {
      console.error('Failed to fetch landing stats:', error)
      // Keep default stats on error
    }
  }

  const fetchPricing = async () => {
    try {
      setLoadingPricing(true)
      const response = await subscriptionAPI.getPricing()
      const backendPricing = response.data.data

      // Map backend pricing structure to frontend format
      const iconMap: Record<string, string> = {
        rooted: '🌱',
        flourish: '🌿',
        bloom: '🌸',
        'pay-as-you-go': '💳',
        evaluation: '📋'
      }

      const descriptionMap: Record<string, string> = {
        rooted: 'Build a strong foundation where growth begins',
        flourish: 'Grow, thrive, and expand your voice with care',
        bloom: 'Sustain your growth and keep your voice in full bloom'
      }

      const taglineMap: Record<string, string> = {
        rooted: 'For clients starting their therapy journey, establishing essential skills and confidence.',
        flourish: 'For clients ready to dive deeper, strengthen abilities, and see meaningful progress.',
        bloom: 'For clients seeking intensive therapy support with maximum flexibility.'
      }

      const billingCycleMap: Record<string, string> = {
        'every-4-weeks': 'billed monthly',
        'monthly': 'billed monthly',
        'pay-as-you-go': 'per session',
        'one-time': 'one-time payment'
      }

      const transformedPricing = Object.entries(backendPricing).map(([tierId, tierData]: [string, any]) => {
        const tierName = tierData.name.replace(' Tier', '').replace(' tier', '')
        
        // For monthly subscriptions, show monthly rate clearly
        let priceDisplay = `$${tierData.price}`
        let periodDisplay = ''
        let billingText = billingCycleMap[tierData.billingCycle] || tierData.billingCycle
        
        if (tierData.billingCycle === 'monthly') {
          priceDisplay = `$${tierData.price}`
          periodDisplay = '/month'
          billingText = 'billed monthly'
        } else if (tierData.billingCycle === 'pay-as-you-go') {
          priceDisplay = `$${tierData.price}`
          periodDisplay = '/session'
          billingText = 'per session'
        } else if (tierData.billingCycle === 'one-time') {
          priceDisplay = `$${tierData.price}`
          periodDisplay = ''
          billingText = 'one-time payment'
        } else {
          // Legacy support for every-4-weeks (show as monthly)
          priceDisplay = `$${tierData.price}`
          periodDisplay = '/month'
          billingText = 'billed monthly'
        }

        return {
          id: tierId,
          name: tierName,
          icon: tierData.icon || iconMap[tierId] || '💎',
          price: priceDisplay,
          period: periodDisplay,
          billing: billingText,
          description: tierData.description || descriptionMap[tierId] || '',
          tagline: taglineMap[tierId] || '',
          features: tierData.features || [],
          popular: tierData.popular || false,
          sessionsPerMonth: tierData.sessionsPerMonth || 0,
          duration: tierData.duration || 45
        }
      })

      // Filter to show only main subscription tiers (rooted, flourish, bloom) for landing page
      const mainTiers = transformedPricing.filter(tier => 
        ['rooted', 'flourish', 'bloom'].includes(tier.id)
      )

      setPricingTiers(mainTiers)
    } catch (error) {
      console.error('Failed to fetch pricing:', error)
      // Fallback to empty array on error
      setPricingTiers([])
    } finally {
      setLoadingPricing(false)
    }
  }

  const switchPalette = (palette: string) => {
    setCurrentPalette(palette)
  }
  return (
    <div className="min-h-screen palette-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img 
                src="/logorooted 1.png" 
                alt="Rooted Voices Speech & Language Therapy" 
                 className="w-18 h-20 mr-2"
              />
             
            </Link>
            
            {/* Main Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6">
              <Link 
                href="/services" 
                className="text-sm font-semibold transition-all duration-300 hover:scale-105 relative group"
                style={{
                  color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'rgba(255,255,255,0.9)'
                }}
              >
                Services
                <span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{
                    backgroundColor: currentPalette === '3' ? '#4D7D7D' : 'white'
                  }}
                ></span>
              </Link>
              <Link 
                href="/who-we-are" 
                className="text-sm font-semibold transition-all duration-300 hover:scale-105 relative group"
                style={{
                  color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'rgba(255,255,255,0.9)'
                }}
              >
                Who We Are
                <span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{
                    backgroundColor: currentPalette === '3' ? '#4D7D7D' : 'white'
                  }}
                ></span>
              </Link>
              <Link 
                href="/for-therapists" 
                className="text-sm font-semibold transition-all duration-300 hover:scale-105 relative group"
                style={{
                  color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'rgba(255,255,255,0.9)'
                }}
              >
                For Therapists
                <span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{
                    backgroundColor: currentPalette === '3' ? '#4D7D7D' : 'white'
                  }}
                ></span>
              </Link>
              <Link 
                href="/meet-our-therapists" 
                className="text-sm font-semibold transition-all duration-300 hover:scale-105 relative group"
                style={{
                  color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'rgba(255,255,255,0.9)'
                }}
              >
                {t('nav.therapists')}
                <span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{
                    backgroundColor: currentPalette === '3' ? '#4D7D7D' : 'white'
                  }}
                ></span>
              </Link>
              <Link 
                href="/pricing" 
                className="text-sm font-semibold transition-all duration-300 hover:scale-105 relative group"
                style={{
                  color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'rgba(255,255,255,0.9)'
                }}
              >
                {t('nav.pricing')}
                <span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{
                    backgroundColor: currentPalette === '3' ? '#4D7D7D' : 'white'
                  }}
                ></span>
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
              style={{
                color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'rgba(255,255,255,0.9)'
              }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            {/* Color Palette Switcher */}
            <div 
              className="hidden md:flex items-center mx-4 space-x-1 backdrop-blur-sm rounded-full p-1"
              style={{
                backgroundColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.1)' : currentPalette === '1' ? 'rgba(145, 158, 148, 0.1)' : 'rgba(255,255,255,0.1)'
              }}
            >
              <Palette 
                className="w-4 h-4 ml-2" 
                style={{
                  color: currentPalette === '3' ? '#202D3E' : 'rgba(255,255,255,0.7)'
                }}
              />
              <button
                onClick={() => switchPalette('1')}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                  currentPalette === '1' 
                    ? 'palette-primary text-white shadow-lg scale-105' 
                    : 'hover:bg-white/10'
                }`}
                style={{
                  color: currentPalette === '3' ? '#202D3E' : 'rgba(255,255,255,0.7)'
                }}
              >
                Fresh
              </button>
              <button
                onClick={() => switchPalette('2')}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                  currentPalette === '2' 
                    ? 'palette-primary text-white shadow-lg scale-105' 
                    : 'hover:bg-white/10'
                }`}
                style={{
                  color: currentPalette === '3' ? '#202D3E' : 'rgba(0, 0, 0, 0.7)'
                }}
              >
                Earthy
              </button>
              <button
                onClick={() => switchPalette('3')}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                  currentPalette === '3' 
                    ? 'palette-primary shadow-lg scale-105' 
                    : 'hover:bg-white/10'
                }`}
                style={{
                  color: currentPalette === '3' ? '#202D3E' : 'rgba(0, 0, 0, 0.7)',
                  backgroundColor: currentPalette === '3' ? '#4D7D7D' : 'transparent'
                }}
              >
                Warm
              </button>
            </div>

            {/* Language Switcher */}
            <div className="hidden md:flex items-center mx-4">
              <LanguageSwitcher variant="compact" />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Link 
                href="/login" 
                className="hidden sm:block text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-full"
                style={{
                  color: currentPalette === '3' ? '#202D3E' : 'rgba(255,255,255,0.9)',
                  backgroundColor: currentPalette === '3' ? 'transparent' : 'transparent'
                }}
              >
                {t('nav.signIn')}
              </Link>
              <Link 
                href="/signup" 
                className="backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-lg border"
                style={{
                  backgroundColor: currentPalette === '3' ? '#4D7D7D' : currentPalette === '1' ? '#203936' : 'rgba(255,255,255,0.2)',
                  color: currentPalette === '3' ? '#F5EDE0' : currentPalette === '1' ? '#F7EBD3' : 'white',
                  borderColor: currentPalette === '3' ? '#4D7D7D' : currentPalette === '1' ? '#203936' : 'rgba(255,255,255,0.2)'
                }}
              >
                {t('nav.getStarted')}
              </Link>
            </div>
          </div>
          
          {/* Demo Access Bar - Below main nav */}
          <div className="flex items-center justify-center space-x-4 pb-3 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">Quick Demo Access:</span>
            <Link href="/dashboard" className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
              Therapist Dashboard →
            </Link>
            <Link href="/client-dashboard" className="text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors">
              Client Dashboard →
            </Link>
            <Link href="/my-practice" className="text-xs font-medium text-green-600 hover:text-green-800 transition-colors">
              My Practice →
            </Link>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/20 bg-white/10 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-4">
                <Link
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold transition-colors"
                  style={{
                    color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'rgba(255,255,255,0.9)'
                  }}
                >
                  Services
                </Link>
                <Link
                  href="/who-we-are"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold transition-colors"
                  style={{
                    color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'rgba(255,255,255,0.9)'
                  }}
                >
                  Who We Are
                </Link>
                <Link
                  href="/for-therapists"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold transition-colors"
                  style={{
                    color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'rgba(255,255,255,0.9)'
                  }}
                >
                  For Therapists
                </Link>
                <Link
                  href="/meet-our-therapists"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold transition-colors"
                  style={{
                    color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'rgba(255,255,255,0.9)'
                  }}
                >
                  {t('nav.therapists')}
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold transition-colors"
                  style={{
                    color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'rgba(255,255,255,0.9)'
                  }}
                >
                  {t('nav.pricing')}
                </Link>
                <div className="pt-4 border-t border-white/20 flex flex-col space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-semibold transition-colors"
                    style={{
                      color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'rgba(255,255,255,0.9)'
                    }}
                  >
                    {t('nav.signIn')}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block bg-black text-white px-4 py-2 rounded-lg font-semibold text-center"
                  >
                    {t('nav.signUp')}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center backdrop-blur-sm rounded-full px-6 py-2 mb-8 border"
              style={{
                backgroundColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.1)' : currentPalette === '1' ? 'rgba(145, 158, 148, 0.1)' : 'rgba(255,255,255,0.1)',
                borderColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.3)' : currentPalette === '1' ? 'rgba(145, 158, 148, 0.3)' : 'rgba(255,255,255,0.2)'
              }}
            >
              <span 
                className="text-sm font-medium"
                style={{
                  color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : '#D4AF37'
                }}
              >
                ✨ AI-Powered Therapy Platform
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight tracking-tight"
              style={{ 
                color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'white',
                textShadow: currentPalette === '3' ? 'none' : '0 4px 8px rgba(0,0,0,0.3)'
              }}
            >
              Make speech & language therapy
              <br />
              <span className="text-palette-primary drop-shadow-2xl">accessible, private, and effective</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl mb-8 max-w-4xl mx-auto leading-relaxed"
              style={{ 
                color: currentPalette === '3' ? '#202D3E' : 'rgba(40, 34, 34, 0.8)'
              }}
            >
              {t('landing.hero.subtitle')}
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
              style={{ 
                color: currentPalette === '3' ? '#202D3E' : 'rgba(40, 34, 34, 0.9)'
              }}
            >
              {t('landing.dualAudience')}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link 
                href="/signup" 
                className="px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 flex items-center group shadow-2xl hover:scale-105"
                style={{
                  backgroundColor: currentPalette === '3' ? '#4D7D7D' : currentPalette === '1' ? '#203936' : 'white',
                  color: currentPalette === '3' ? '#F5EDE0' : currentPalette === '1' ? '#F7EBD3' : 'var(--primary-dark)',
                  boxShadow: currentPalette === '3' ? '0 25px 50px -12px rgba(77, 125, 125, 0.4)' : currentPalette === '1' ? '0 25px 50px -12px rgba(32, 57, 54, 0.4)' : '0 25px 50px -12px rgba(255, 255, 255, 0.25)'
                }}
              >
                {t('landing.hero.cta')}
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => setShowDemoModal(true)}
                className="flex items-center transition-all duration-300 hover:scale-105 backdrop-blur-sm px-8 py-4 rounded-full border"
                style={{
                  color: currentPalette === '3' ? '#202D3E' : 'rgba(255,255,255,0.9)',
                  backgroundColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.1)' : currentPalette === '1' ? 'rgba(32, 57, 54, 0.1)' : 'rgba(255,255,255,0.1)',
                  borderColor: currentPalette === '3' ? '#4D7D7D' : currentPalette === '1' ? '#203936' : 'rgba(255,255,255,0.2)'
                }}
              >
                <Play className="mr-3 w-6 h-6" />
                <span className="font-semibold">{t('landing.hero.watchDemo')}</span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Showcase Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-palette-background via-palette-light to-palette-accent opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 
                  className="text-4xl md:text-5xl font-black leading-tight"
                  style={{
                    color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'white'
                  }}
                >
                  Experience the future of
                  <span className="text-palette-primary block">therapy delivery</span>
                </h2>
                <p 
                  className="text-xl leading-relaxed"
                  style={{
                    color: currentPalette === '3' ? '#202D3E' : 'rgba(0, 0, 0, 0.8)'
                  }}
                >
                  Our platform combines cutting-edge AI with human expertise to create 
                  personalized therapy experiences that deliver real results.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div 
                  className="backdrop-blur-sm rounded-2xl p-6 border"
                  style={{
                    backgroundColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.1)' : currentPalette === '1' ? 'rgba(32, 57, 54, 0.1)' : 'rgba(255,255,255,0.1)',
                    borderColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.3)' : currentPalette === '1' ? 'rgba(32, 57, 54, 0.3)' : 'rgba(255,255,255,0.2)'
                  }}
                >
                  <div 
                    className="text-3xl font-bold mb-2"
                    style={{
                      color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'white'
                    }}
                  >
                    {landingStats[0]?.number || '10,000+'}
                  </div>
                  <div 
                    className="text-sm"
                    style={{
                      color: currentPalette === '3' ? '#202D3E' : 'rgba(255,255,255,0.7)'
                    }}
                  >
                    {landingStats[0]?.label || 'Active Therapists'}
                  </div>
                </div>
                <div 
                  className="backdrop-blur-sm rounded-2xl p-6 border"
                  style={{
                    backgroundColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.1)' : currentPalette === '1' ? 'rgba(32, 57, 54, 0.1)' : 'rgba(255,255,255,0.1)',
                    borderColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.3)' : currentPalette === '1' ? 'rgba(32, 57, 54, 0.3)' : 'rgba(255,255,255,0.2)'
                  }}
                >
                  <div 
                    className="text-3xl font-bold mb-2"
                    style={{
                      color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'white'
                    }}
                  >
                    {landingStats[1]?.number || '50,000+'}
                  </div>
                  <div 
                    className="text-sm"
                    style={{
                      color: currentPalette === '3' ? '#202D3E' : 'rgba(255,255,255,0.7)'
                    }}
                  >
                    {landingStats[1]?.label || 'Sessions Completed'}
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center">
                  <Video className="w-24 h-24 text-white/60" />
                </div>
                <div className="mt-6 space-y-3">
                  <div className="h-3 bg-white/20 rounded-full"></div>
                  <div className="h-3 bg-white/10 rounded-full w-3/4"></div>
                  <div className="h-3 bg-white/15 rounded-full w-1/2"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-palette-light via-palette-accent to-palette-background opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div 
              className="inline-flex items-center backdrop-blur-sm rounded-full px-6 py-2 mb-8 border"
              style={{
                backgroundColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.1)' : currentPalette === '1' ? 'rgba(145, 158, 148, 0.1)' : 'rgba(255,255,255,0.1)',
                borderColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.3)' : currentPalette === '1' ? 'rgba(145, 158, 148, 0.3)' : 'rgba(255,255,255,0.2)'
              }}
            >
              <span 
                className="text-sm font-medium"
                style={{
                  color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'rgba(255,255,255,0.9)'
                }}
              >
                🚀 Powerful Features
              </span>
            </div>
            <h2 
              className="text-5xl md:text-6xl font-black mb-8 leading-tight"
              style={{
                color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'white'
              }}
            >
              Everything you need for
              <br />
              <span className="text-palette-primary drop-shadow-lg">effective therapy</span>
            </h2>
            <p 
              className="text-xl max-w-4xl mx-auto leading-relaxed"
              style={{
                color: currentPalette === '3' ? '#202D3E' : 'rgba(0, 0, 0, 0.8)'
              }}
            >
              From AI-powered session notes to automated billing, our platform provides 
              everything therapists and clients need for successful therapy outcomes.
            </p>
          </motion.div>
          
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
                whileHover={{ y: -10, scale: 1.02 }}
                className="backdrop-blur-xl p-8 rounded-3xl border transition-all duration-500 hover:shadow-2xl group"
                style={{
                  backgroundColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.1)' : currentPalette === '1' ? 'rgba(32, 57, 54, 0.1)' : 'rgba(255,255,255,0.1)',
                  borderColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.3)' : currentPalette === '1' ? 'rgba(32, 57, 54, 0.3)' : 'rgba(255,255,255,0.2)'
                }}
              >
                <div className="text-palette-primary mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 
                  className="text-2xl font-bold mb-4 group-hover:text-palette-primary transition-colors duration-300"
                  style={{
                    color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'white'
                  }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="leading-relaxed transition-colors duration-300"
                  style={{
                    color: currentPalette === '3' ? '#202D3E' : 'rgba(255,255,255,0.8)'
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-palette-background via-palette-light to-palette-accent opacity-20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            {landingStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="backdrop-blur-xl rounded-3xl p-8 text-center border transition-all duration-500 group"
                style={{
                  backgroundColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.1)' : currentPalette === '1' ? 'rgba(32, 57, 54, 0.1)' : 'rgba(255,255,255,0.1)',
                  borderColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.3)' : currentPalette === '1' ? 'rgba(32, 57, 54, 0.3)' : 'rgba(255,255,255,0.2)'
                }}
              >
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div 
                  className="text-5xl md:text-6xl font-black mb-3 group-hover:text-palette-primary transition-colors duration-300"
                  style={{
                    color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'white'
                  }}
                >
                  {stat.number}
                </div>
                <div 
                  className="font-semibold transition-colors duration-300"
                  style={{
                    color: currentPalette === '3' ? '#202D3E' : 'rgba(255,255,255,0.8)'
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-palette-accent via-palette-light to-palette-background opacity-40"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div 
              className="inline-flex items-center backdrop-blur-sm rounded-full px-6 py-2 mb-8 border"
              style={{
                backgroundColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.1)' : currentPalette === '1' ? 'rgba(145, 158, 148, 0.1)' : 'rgba(255,255,255,0.1)',
                borderColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.3)' : currentPalette === '1' ? 'rgba(145, 158, 148, 0.3)' : 'rgba(255,255,255,0.2)'
              }}
            >
              <span 
                className="text-sm font-medium"
                style={{
                  color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'rgba(255,255,255,0.9)'
                }}
              >
                💰 {t('landing.pricingTitle')}
              </span>
            </div>
            <h2 
              className="text-5xl md:text-6xl font-black mb-8 leading-tight"
              style={{
                color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'white'
              }}
            >
              {t('landing.pricingTitle')}
            </h2>
            <p 
              className="text-xl max-w-4xl mx-auto leading-relaxed mb-8"
              style={{
                color: currentPalette === '3' ? '#202D3E' : 'rgba(0, 0, 0, 0.8)'
              }}
            >
              {t('landing.pricingSubtitle')}
            </p>
            
            {/* Insurance Banner */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center backdrop-blur-sm border rounded-full px-8 py-3 transition-all duration-300"
              style={{
                backgroundColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.1)' : currentPalette === '1' ? 'rgba(145, 158, 148, 0.1)' : 'rgba(255,255,255,0.1)',
                borderColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.3)' : 'rgba(255,255,255,0.3)'
              }}
            >
              <span 
                className="font-semibold text-sm"
                style={{
                  color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'white'
                }}
              >
                🏥 Insurance billing coming soon! 
                <span className="text-palette-primary ml-2">(60-90 day credentialing timeline)</span>
              </span>
            </motion.div>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8" >
            {loadingPricing ? (
              <div className="col-span-3 flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-palette-primary"></div>
              </div>
            ) : pricingTiers.length === 0 ? (
              <div className="col-span-3 text-center py-16">
                <p className="text-gray-600">No pricing tiers available</p>
              </div>
            ) : (
              pricingTiers.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`backdrop-blur-xl p-8 rounded-3xl relative border transition-all duration-500 group ${
                  plan.popular 
                    ? 'ring-2 ring-palette-primary border-palette-primary shadow-2xl' 
                    : ''
                }`}
                style={{
                  backgroundColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.1)' : currentPalette === '1' ? 'rgba(32, 57, 54, 0.1)' : 'rgba(255,255,255,0.1)',
                  borderColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.3)' : currentPalette === '1' ? 'rgba(32, 57, 54, 0.3)' : 'rgba(255,255,255,0.2)'
                }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span 
                      className="px-6 py-2 rounded-full text-sm font-bold shadow-lg"
                      style={{
                        backgroundColor: currentPalette === '3' ? '#4D7D7D' : currentPalette === '1' ? '#203936' : 'var(--primary)',
                        color: currentPalette === '3' ? '#F5EDE0' : currentPalette === '1' ? '#F7EBD3' : 'white'
                      }}
                    >
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{plan.icon}</div>
                  <h3 
                    className="text-3xl font-black mb-3 group-hover:text-palette-primary transition-colors duration-300"
                    style={{
                      color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'white'
                    }}
                  >
                    {plan.name} Tier
                  </h3>
                  <div 
                    className="text-5xl font-black mb-3"
                    style={{
                      color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? '#132D22' : 'white'
                    }}
                  >
                    {plan.price}
                    <span 
                      className="text-xl"
                      style={{
                        color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? 'black' : 'rgba(255,255,255,0.7)'
                      }}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p 
                    className="text-sm mb-2"
                    style={{
                      color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? 'black' : 'rgba(255,255,255,0.6)'
                    }}
                  >
                    {plan.billing}
                  </p>
                  {plan.sessionsPerMonth > 0 && (
                    <p 
                      className="text-sm font-semibold mb-2"
                      style={{
                        color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? 'black' : 'rgba(255,255,255,0.9)'
                      }}
                    >
                      {plan.sessionsPerMonth} {plan.sessionsPerMonth === 1 ? 'session' : 'sessions'} per month ({plan.duration} min each)
                    </p>
                  )}
                  <p 
                    className="font-semibold mb-2"
                    style={{
                      color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? 'black' : 'rgba(255,255,255,0.9)'
                    }}
                  >
                    {plan.description}
                  </p>
                  <p 
                    className="text-sm"
                    style={{
                      color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? 'black' : 'rgba(255,255,255,0.6)'
                    }}
                  >
                    {plan.tagline}
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-palette-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span 
                        className="leading-relaxed"
                        style={{
                          color: currentPalette === '3' ? '#202D3E' : currentPalette === '1' ? 'black' : 'rgba(255,255,255,0.8)'
                        }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/pricing"
                  className="w-full py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 block text-center"
                  style={{
                    backgroundColor: currentPalette === '3' 
                      ? (plan.popular ? '#4D7D7D' : 'rgba(77, 125, 125, 0.1)')
                      : currentPalette === '1'
                      ? (plan.popular ? '#203936' : 'rgba(32, 57, 54, 0.1)')
                      : (plan.popular ? 'white' : 'rgba(255,255,255,0.1)'),
                    color: currentPalette === '3' 
                      ? (plan.popular ? '#F5EDE0' : '#202D3E')
                      : currentPalette === '1'
                      ? (plan.popular ? '#F7EBD3' : '#132D22')
                      : (plan.popular ? 'var(--primary-dark)' : 'white'),
                    borderColor: currentPalette === '3' ? '#4D7D7D' : currentPalette === '1' ? '#203936' : 'rgba(255,255,255,0.2)',
                    border: currentPalette === '3' ? '1px solid' : '1px solid'
                  }}
                >
                  Get Started
                </Link>
              </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-palette-background via-palette-primary-dark to-palette-primary opacity-80"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center backdrop-blur-sm rounded-full px-6 py-2 mb-8 border"
            style={{
              backgroundColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.1)' : 'rgba(255,255,255,0.1)',
              borderColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.3)' : 'rgba(255,255,255,0.2)'
            }}
          >
            <span 
              className="text-sm font-medium"
              style={{
                color: currentPalette === '3' ? '#202D3E' : 'rgba(255,255,255,0.9)'
              }}
            >
              🚀 Ready to Get Started?
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-black mb-8 leading-tight"
            style={{
              color: currentPalette === '3' ? '#202D3E' : 'black'
            }}
          >
            Ready to transform your
            <br />
            <span className="text-palette-accent drop-shadow-lg" style={{
              color: currentPalette === '3' ? '#202D3E' : 'black'
            }}>therapy practice?</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed"
            style={{
              color: currentPalette === '3' ? '#202D3E' : 'rgba(0, 0, 0, 0.8)'
            }}
          >
            Join thousands of therapists who are already using Rooted Voices to grow their practice 
            and deliver exceptional care to their clients.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link 
              href="/signup" 
              className="px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 flex items-center group shadow-2xl hover:scale-105"
              style={{
                backgroundColor: currentPalette === '3' ? '#4D7D7D' : currentPalette === '1' ? '#203936' : 'white',
                color: currentPalette === '3' ? '#F5EDE0' : currentPalette === '1' ? '#F7EBD3' : 'var(--primary-dark)',
                boxShadow: currentPalette === '3' ? '0 25px 50px -12px rgba(77, 125, 125, 0.4)' : currentPalette === '1' ? '0 25px 50px -12px rgba(32, 57, 54, 0.4)' : '0 25px 50px -12px rgba(255, 255, 255, 0.25)'
              }}
            >
              Start Your Free Trial
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
              <button 
                onClick={() => setShowDemoModal(true)}
                className="flex items-center transition-all duration-300 hover:scale-105 backdrop-blur-sm px-8 py-4 rounded-full border"
                style={{
                  color: currentPalette === '3' ? '#202D3E' : 'rgba(255,255,255,0.9)',
                  backgroundColor: currentPalette === '3' ? 'rgba(77, 125, 125, 0.1)' : currentPalette === '1' ? 'rgba(145, 158, 148, 0.1)' : 'rgba(255,255,255,0.1)',
                  borderColor: currentPalette === '3' ? '#4D7D7D' : 'rgba(255,255,255,0.2)'
                }}
              >
                <Calendar className="mr-3 w-6 h-6" />
                <span className="font-semibold">Schedule a Demo</span>
              </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="palette-primary-dark text-white py-16 px-4 sm:px-6 lg:px-8">
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

      {/* Demo Modal */}
      <DemoModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </div>
  )
}