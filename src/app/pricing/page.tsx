'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
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
import { useAuth } from '@/contexts/AuthContext'
import { subscriptionAPI, stripeAPI, clientAPI } from '@/lib/api'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'

function PricingContent() {
  const [selectedPlan, setSelectedPlan] = useState('flourish')
  const [currentSubscription, setCurrentSubscription] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [pricingTiers, setPricingTiers] = useState<any[]>([])
  const [loadingPricing, setLoadingPricing] = useState(true)
  const [intakeCompleted, setIntakeCompleted] = useState(false)
  const [checkingIntake, setCheckingIntake] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslation()

  useEffect(() => {
    fetchPricing()
    if (isAuthenticated && user?.role === 'client') {
      checkIntakeStatus()
      fetchCurrentSubscription()
    } else {
      setCheckingIntake(false)
    }

    // Check if returning from Stripe checkout
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')

    if (success === 'true') {
      setSuccessMessage('Payment successful! Your subscription is being activated...')

      // Poll for subscription status (webhook might take a moment)
      let attempts = 0
      const maxAttempts = 20
      const pollInterval = setInterval(async () => {
        attempts++
        try {
          const subscription = await fetchCurrentSubscription()
          console.log('Polling attempt', attempts, 'Subscription:', subscription)

          // If subscription found and active, stop polling
          if (subscription && subscription.status === 'active') {
            clearInterval(pollInterval)
            setSuccessMessage(`Payment successful! Your ${subscription.tierName} subscription is now active.`)
            // Clear URL params
            setTimeout(() => {
              router.replace('/pricing', { scroll: false })
            }, 3000)
            return
          }
        } catch (error) {
          console.error('Error polling subscription:', error)
        }

        if (attempts >= maxAttempts) {
          clearInterval(pollInterval)
          setSuccessMessage('Payment successful! If your subscription doesn\'t appear, please click "Refresh Status" below.')
        }
      }, 1000) // Check every second

      // Also check immediately and after delays
      fetchCurrentSubscription()
      setTimeout(() => fetchCurrentSubscription(), 2000)
      setTimeout(() => fetchCurrentSubscription(), 5000)

      // Cleanup on unmount
      return () => clearInterval(pollInterval)
    } else if (canceled === 'true') {
      setSuccessMessage('Payment was canceled. You can try again anytime.')
      // Remove canceled parameter from URL after showing message
      setTimeout(() => {
        router.replace('/pricing', { scroll: false })
      }, 3000)
    }
  }, [isAuthenticated, searchParams, user])

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
        bloom: 'For clients maintaining progress through flexible, pay-as-you-go sessions.'
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
          icon: iconMap[tierId] || '💎',
          price: priceDisplay,
          period: periodDisplay,
          billing: billingText,
          description: descriptionMap[tierId] || tierData.description || '',
          tagline: taglineMap[tierId] || '',
          features: tierData.features || [],
          popular: tierData.popular || false,
          color: tierData.popular ? 'border-black ring-2 ring-black' : 'border-gray-200',
          sessionsPerMonth: tierData.sessionsPerMonth || 0,
          duration: tierData.duration || 45,
          durationRange: tierData.durationRange || ''
        }
      })

      setPricingTiers(transformedPricing)
    } catch (error) {
      console.error('Failed to fetch pricing:', error)
      // Fallback to default pricing if fetch fails
      setPricingTiers([
        {
          id: 'rooted',
          name: 'Rooted',
          icon: '🌱',
          price: '$229',
          period: '/month',
          billing: 'billed monthly',
          description: 'Build a strong foundation where growth begins',
          tagline: 'For clients starting their therapy journey, establishing essential skills and confidence.',
          features: [
            '2 sessions per month (45 minutes each)',
            'Personalized treatment plan',
            'Progress updates every 8-10 weeks',
            'Caregiver tips',
            'HIPAA-compliant platform',
            'Email support'
          ],
          popular: false,
          color: 'border-gray-200',
          sessionsPerMonth: 2,
          duration: 45
        },
        {
          id: 'flourish',
          name: 'Flourish',
          icon: '🌿',
          price: '$439',
          period: '/month',
          billing: 'billed monthly',
          description: 'Grow, thrive, and expand your voice with care',
          tagline: 'For clients ready to dive deeper, strengthen abilities, and see meaningful progress.',
          features: [
            '4 sessions per month (45 minutes each)',
            'Advanced treatment strategies',
            'Detailed monthly progress reports',
            'Monthly family coaching',
            'Priority scheduling',
            'Provider collaboration',
            'Direct messaging'
          ],
          popular: true,
          color: 'border-black ring-2 ring-black',
          sessionsPerMonth: 4,
          duration: 45
        },
        {
          id: 'bloom',
          name: 'Bloom',
          icon: '🌸',
          price: '$749',
          period: '/month',
          billing: 'billed monthly',
          description: 'Sustain your growth and keep your voice in full bloom',
          tagline: 'For clients maintaining progress through flexible, pay-as-you-go sessions.',
          features: [
            '8 sessions per month (45 minutes each)',
            'Intensive therapy support',
            'Flexible scheduling',
            'Priority access to therapists',
            'Comprehensive progress tracking',
            'Monthly family coaching',
            'Direct messaging access'
          ],
          popular: false,
          color: 'border-gray-200',
          sessionsPerMonth: 8,
          duration: 45
        }
      ])
    } finally {
      setLoadingPricing(false)
    }
  }

  const checkIntakeStatus = async () => {
    try {
      setCheckingIntake(true)
      const response = await clientAPI.getIntakeStatus()
      const isCompleted = response.data.data?.intakeCompleted || false
      setIntakeCompleted(isCompleted)

      if (!isCompleted) {
        // Redirect to intake form if not completed
        router.push('/client-intake')
      }
    } catch (error) {
      console.error('Failed to check intake status:', error)
      // If error, assume not completed to be safe
      setIntakeCompleted(false)
    } finally {
      setCheckingIntake(false)
    }
  }

  const fetchCurrentSubscription = async () => {
    try {
      const response = await subscriptionAPI.getCurrent()
      const subscription = response.data.data

      // Only update if subscription exists and is active
      if (subscription && subscription.status === 'active') {
        setCurrentSubscription(subscription)
        console.log('Subscription found:', subscription)
        return subscription
      } else {
        setCurrentSubscription(null)
        return null
      }
    } catch (error: any) {
      // 404 means no subscription, which is fine
      if (error.response?.status !== 404) {
        console.error('Failed to fetch subscription:', error)
      }
      setCurrentSubscription(null)
      return null
    }
  }

  const handleSelectPlan = async (tierId: string) => {
    if (!isAuthenticated) {
      // Redirect to signup with selected plan
      router.push(`/signup?plan=${tierId}`)
      return
    }

    // Check intake status for clients
    if (user?.role === 'client' && !intakeCompleted) {
      setSuccessMessage('Please complete your intake form before selecting a plan.')
      router.push('/client-intake')
      return
    }

    setIsLoading(true)
    setSuccessMessage('')

    try {
      // Create Stripe checkout session
      const stripeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ tier: tierId }),
      })

      const stripeData = await stripeResponse.json()

      if (stripeData.success && stripeData.data.url) {
        // Store session ID for later verification
        if (stripeData.data.sessionId) {
          localStorage.setItem('lastCheckoutSessionId', stripeData.data.sessionId)
        }
        // Redirect to Stripe checkout
        window.location.href = stripeData.data.url
      } else {
        throw new Error(stripeData.message || 'Failed to create checkout session')
      }
    } catch (error: any) {
      alert(error.message || 'Failed to start payment process')
      setIsLoading(false)
    }
  }


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
      answer: 'At this time, Rooted Voices operates as a private-pay practice. This allows us to provide high-quality, flexible, and affirming care while building sustainable systems that support both clients and clinicians.\n\nWe also offer multiple pathways to care, including tiered options and pay-as-you-go services, so individuals and families can choose support that aligns with their needs and circumstances. As our ecosystem grows, we remain committed to expanding access through additional offerings, partnerships, and community-based initiatives.'
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
              <Link href="/" className="flex items-center">
                <img
                  src="/logorooted 1.png"
                  alt="Rooted Voices Speech & Language Therapy"
                  className="w-18 h-20 mr-2"
                />
                <span className="text-2xl font-bold text-black">Rooted Voices</span>
              </Link>
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
        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center"
          >
            <CheckCircle className="w-6 h-6 text-green-600 inline-block mr-2" />
            <span className="text-green-800 font-medium">{successMessage}</span>
            <p className="text-sm text-green-600 mt-1">Redirecting to your dashboard...</p>
          </motion.div>
        )}

        {/* Current Subscription Alert */}
        {/* Success Message with Refresh Button */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center"
          >
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-green-800 mb-2">Payment Successful!</h2>
            <p className="text-green-600 mb-4">{successMessage}</p>
            {!currentSubscription && (
              <div className="space-y-2">
                <button
                  onClick={async () => {
                    // Try to get session ID from URL or localStorage
                    const sessionId = localStorage.getItem('lastCheckoutSessionId')
                    if (sessionId) {
                      try {
                        // Verify checkout session manually
                        const verifyResponse = await stripeAPI.verifyCheckoutSession(sessionId)
                        if (verifyResponse.data.success) {
                          // Refresh subscription
                          await fetchCurrentSubscription()
                          setSuccessMessage(`Payment successful! Your subscription is now active.`)
                          setTimeout(() => {
                            router.replace('/pricing', { scroll: false })
                          }, 3000)
                        } else {
                          alert(verifyResponse.data.message || 'Failed to verify payment')
                        }
                      } catch (error: any) {
                        console.error('Verify error:', error)
                        // Fallback to regular refresh
                        const subscription = await fetchCurrentSubscription()
                        if (subscription && subscription.status === 'active') {
                          setSuccessMessage(`Payment successful! Your ${subscription.tierName} subscription is now active.`)
                          setTimeout(() => {
                            router.replace('/pricing', { scroll: false })
                          }, 3000)
                        } else {
                          alert('Subscription not found yet. The webhook may still be processing. Please wait a moment and try again, or contact support.')
                        }
                      }
                    } else {
                      // No session ID, just refresh
                      const subscription = await fetchCurrentSubscription()
                      if (subscription && subscription.status === 'active') {
                        setSuccessMessage(`Payment successful! Your ${subscription.tierName} subscription is now active.`)
                        setTimeout(() => {
                          router.replace('/pricing', { scroll: false })
                        }, 3000)
                      } else {
                        alert('Subscription not found yet. The webhook may still be processing. Please wait a moment and try again, or contact support.')
                      }
                    }
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Verify Payment & Refresh
                </button>
                <p className="text-xs text-gray-500">Click to manually verify your payment if the webhook hasn't processed yet</p>
              </div>
            )}
          </motion.div>
        )}

        {currentSubscription && !successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center"
          >
            <span className="text-blue-800 font-medium">
              You're currently on the <strong>{currentSubscription.tierName}</strong>
            </span>
            <p className="text-sm text-blue-600 mt-1">Select a different plan below to switch</p>
          </motion.div>
        )}

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t('pricing.subtitle')}
          </p>
          {!isAuthenticated && (
            <p className="text-sm text-gray-500">
              Please <Link href="/login" className="text-black font-semibold hover:underline">login</Link> or <Link href="/signup" className="text-black font-semibold hover:underline">create an account</Link> to select a plan
            </p>
          )}
        </motion.div>

        {/* Pricing Tiers */}
        {loadingPricing ? (
          <div className="flex items-center justify-center h-64 mb-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white p-8 rounded-2xl premium-shadow relative ${tier.color} ${tier.popular ? 'ring-2 ring-black' : ''
                  }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-semibold">
                      {t('pricing.mostPopular')}
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
                  {tier.sessionsPerMonth > 0 && (
                    <p className="text-sm font-semibold text-black mb-2">
                      {tier.sessionsPerMonth} {tier.sessionsPerMonth === 1 ? 'session' : 'sessions'} per month ({tier.duration} min each)
                    </p>
                  )}
                  <p className="text-gray-600 font-medium mb-2">{tier.description}</p>
                  <p className="text-sm text-gray-500">{tier.tagline}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature: string, featureIndex: number) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {currentSubscription?.tier === tier.id ? (
                  <div className="w-full py-3 rounded-full font-semibold bg-green-500 text-white text-center">
                    ✓ {t('pricing.currentPlan')}
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectPlan(tier.id)}
                    disabled={isLoading || (isAuthenticated && user?.role === 'client' && !intakeCompleted) || checkingIntake}
                    className={`w-full py-3 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${tier.popular
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'border-2 border-black text-black hover:bg-black hover:text-white'
                      }`}
                  >
                    {checkingIntake
                      ? 'Checking...'
                      : isLoading
                        ? t('common.loading')
                        : (isAuthenticated && user?.role === 'client' && !intakeCompleted)
                          ? 'Complete Intake First'
                          : isAuthenticated
                            ? t('pricing.selectPlan')
                            : t('nav.getStarted')}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}

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
                  {pricingTiers.map((tier) => (
                    <th key={tier.id} className="text-center py-4 px-4 font-semibold text-black">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingPricing ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <>
                    {pricingTiers.length > 0 ? (
                      <>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-4 font-medium text-black">Price</td>
                          {pricingTiers.map((tier) => (
                            <td key={tier.id} className="py-4 px-4 text-center text-gray-600">
                              {tier.price}{tier.period}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-4 font-medium text-black">Monthly Rate</td>
                          {pricingTiers.map((tier) => (
                            <td key={tier.id} className="py-4 px-4 text-center text-gray-600">
                              {tier.price}{tier.period}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-4 font-medium text-black">Billing Cycle</td>
                          {pricingTiers.map((tier) => (
                            <td key={tier.id} className="py-4 px-4 text-center text-gray-600">
                              {tier.billing}
                            </td>
                          ))}
                        </tr>
                        {pricingTiers.some(t => t.sessionsPerMonth > 0) && (
                          <tr className="border-b border-gray-100">
                            <td className="py-4 px-4 font-medium text-black">Sessions per Month</td>
                            {pricingTiers.map((tier) => (
                              <td key={tier.id} className="py-4 px-4 text-center text-gray-600">
                                {tier.sessionsPerMonth > 0 ? `${tier.sessionsPerMonth} sessions` : 'N/A'}
                              </td>
                            ))}
                          </tr>
                        )}
                        <tr className="border-b border-gray-100">
                          <td className="py-4 px-4 font-medium text-black">Session Duration</td>
                          {pricingTiers.map((tier) => (
                            <td key={tier.id} className="py-4 px-4 text-center text-gray-600">
                              {tier.durationRange ? tier.durationRange : (tier.duration ? `${tier.duration} minutes` : 'N/A')}
                            </td>
                          ))}
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">
                          No pricing tiers available
                        </td>
                      </tr>
                    )}
                  </>
                )}
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
                <p className="text-gray-600 whitespace-pre-line">{item.answer}</p>
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
              <p className="text-gray-600 text-sm">Contact Us</p>
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

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PricingContent />
    </Suspense>
  )
}
