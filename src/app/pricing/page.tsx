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
  HelpCircle,
  Globe,
  Target,
  CreditCard
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
  const [evaluationCredit, setEvaluationCredit] = useState<any>(null)
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslation()
  const recommendedTier = searchParams.get('recommended') || ''

  useEffect(() => {
    fetchPricing()
    if (isAuthenticated && user?.role === 'client') {
      checkIntakeStatus()
      fetchCurrentSubscription()
      fetchEvaluationCredit()
    } else {
      setCheckingIntake(false)
    }

    // Check if returning from Stripe checkout
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')

    if (success === 'true') {
      setSuccessMessage('Payment successful! Your subscription is being activated...')

      // Immediately attempt to verify the checkout session
      // This ensures the subscription + evaluation records are created
      // even if Stripe webhooks aren't configured (e.g., local dev)
      const storedSessionId = localStorage.getItem('lastCheckoutSessionId')
      if (storedSessionId) {
        stripeAPI.verifyCheckoutSession(storedSessionId)
          .then((res: any) => {
            console.log('Auto-verify result:', res.data)
          })
          .catch((err: any) => {
            console.warn('Auto-verify failed (may already be processed):', err?.response?.data?.message || err.message)
          })
      }

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
      setTimeout(() => {
        router.replace('/pricing', { scroll: false })
      }, 3000)
    }

    // Handle upgrade success
    const upgradeSuccess = searchParams.get('upgrade_success')
    if (upgradeSuccess === 'true') {
      setSuccessMessage('Upgrade successful! Your new subscription is being activated...')
      fetchCurrentSubscription()
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
        bloom: 'Flexible support when you need it',
        evaluation: 'Comprehensive initial assessment'
      }

      const taglineMap: Record<string, string> = {
        rooted: 'For clients starting their therapy journey, establishing essential skills and confidence.',
        flourish: 'For clients ready to dive deeper, strengthen abilities, and see meaningful progress.',
        bloom: 'Pay-as-you-go sessions for flexible maintenance.',
        evaluation: 'Required first step for all new clients.'
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
        }

        // Special display for Bloom to highlight Eval requirement
        let extraTagline = taglineMap[tierId] || ''

        if (tierId === 'bloom') {
          // Bloom specific text
          const evalPrice = backendPricing['evaluation']?.price || 195;
          extraTagline = `Initial Evaluation (required): $${evalPrice} one-time`
        } else if (tierId === 'rooted' || tierId === 'flourish') {
          // Subscription specific text
          extraTagline = 'Initial Evaluation: Included'
        }

        return {
          id: tierId,
          name: tierName,
          icon: iconMap[tierId] || '💎',
          price: priceDisplay,
          period: periodDisplay,
          billing: billingText,
          description: descriptionMap[tierId] || tierData.description || '',
          tagline: extraTagline,
          features: tierData.features || [],
          popular: tierData.popular || false,
          color: tierData.popular ? 'border-black ring-2 ring-black' : 'border-gray-200',
          sessionsPerMonth: tierData.sessionsPerMonth || 0,
          duration: tierData.duration || 45,
          durationRange: tierData.durationRange || ''
        }
      })

      // Filter out 'pay-as-you-go' legacy if 'bloom' is covering it
      // But keep 'evaluation' if we want to show it? Maybe not as a card to SELECT, but informed.
      // Actually, showing 'evaluation' card is good so they know the price.

      // Sort logic: Rooted, Flourish, Bloom, Evaluation
      const sortOrder = ['rooted', 'flourish', 'bloom', 'evaluation']
      transformedPricing.sort((a, b) => sortOrder.indexOf(a.id) - sortOrder.indexOf(b.id))

      setPricingTiers(transformedPricing)
    } catch (error) {
      console.error('Failed to fetch pricing:', error)
      // Fallback (omitted for brevity, relying on backend)
      setLoadingPricing(false)
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

  const fetchEvaluationCredit = async () => {
    try {
      const response = await subscriptionAPI.getEvaluationCredit()
      setEvaluationCredit(response.data.data)
    } catch (error) {
      console.error('Failed to fetch evaluation credit:', error)
    }
  }

  const handleSelectPlan = async (tierId: string) => {
    if (authLoading) return
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
      let stripeData: any;

      // If user already has an active subscription, use upgrade flow
      if (currentSubscription && currentSubscription.tier !== tierId) {
        const upgradeResponse = await stripeAPI.createUpgradeCheckout(tierId)
        stripeData = upgradeResponse.data
      } else {
        // Create Stripe checkout session
        const stripeResponse = await stripeAPI.createCheckoutSession(tierId)
        stripeData = stripeResponse.data
      }

      if (stripeData.success && stripeData.data.url) {
        if (stripeData.data.sessionId) {
          localStorage.setItem('lastCheckoutSessionId', stripeData.data.sessionId)
        }
        window.location.href = stripeData.data.url
      } else {
        throw new Error(stripeData.message || 'Failed to create checkout session')
      }
    } catch (error: any) {
      alert(error.response?.data?.message || error.message || 'Failed to start payment process')
      setIsLoading(false)
    }
  }


  const faqItems = [
    {
      question: 'Is speech therapy covered by insurance?',
      answer: 'At this time, Rooted Voices operates as a private-pay practice. This allows us to provide high-quality, flexible care—free from insurance-dictated timelines, session limits, or mandatory diagnoses.'
    },
    {
      question: 'Can I use HSA or FSA funds?',
      answer: 'Yes! You can use your Health Savings Account (HSA) or Flexible Spending Account (FSA) cards to pay for evaluations and ongoing therapy subscriptions.'
    },
    {
      question: 'Do you provide superbills?',
      answer: 'Yes. Upon request, we provide detailed monthly superbills. You can submit these directly to your insurance provider for potential out-of-network reimbursement.'
    },
    {
      question: 'What payment options are available?',
      answer: 'We accept all major credit and debit cards, as well as HSA and FSA cards. Payments are processed securely via our platform.'
    },
    {
      question: 'Can I stop therapy at any time?',
      answer: 'Yes! You can cancel or change your subscription at any time. Changes will be reflected in your next billing cycle, without long-term lock-in contracts.'
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
            <p className="text-sm text-blue-600 mt-1">Select a different plan below to upgrade</p>
          </motion.div>
        )}

        {/* Recommended Tier Banner */}
        {recommendedTier && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-6 h-6 text-emerald-600" />
              <span className="text-xl font-bold text-emerald-800">Therapist Recommendation</span>
            </div>
            <p className="text-emerald-700">
              Based on your evaluation, your therapist recommends the <strong className="capitalize">{recommendedTier}</strong> tier.
            </p>
          </motion.div>
        )}

        {/* Evaluation Credit Banner */}
        {evaluationCredit && evaluationCredit.status === 'available' && evaluationCredit.amount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl">🎁</span>
              <span className="text-lg font-bold text-yellow-900">${evaluationCredit.amount} Evaluation Credit Available!</span>
            </div>
            <p className="text-sm text-yellow-700">Your evaluation fee will be automatically deducted from your first subscription payment.</p>
          </motion.div>
        )}
        {evaluationCredit && evaluationCredit.status === 'applied' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center"
          >
            <span className="text-green-800 font-medium">
              ✅ Your ${evaluationCredit.amount} evaluation credit has been applied to your subscription.
            </span>
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
            Your Care Starts with Understanding
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Every journey begins with a comprehensive evaluation. Based on your needs, your clinician will recommend the therapy structure that best supports your communication goals.
          </p>
          {!isAuthenticated && (
            <p className="text-sm text-gray-500">
              Please <Link href="/login" className="text-black font-semibold hover:underline">login</Link> or <Link href="/signup" className="text-black font-semibold hover:underline">create an account</Link> to start your evaluation
            </p>
          )}
        </motion.div>

        {/* Pricing Tiers */}
        {loadingPricing ? (
          <div className="flex items-center justify-center h-64 mb-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto mb-16 space-y-16">

            {/* Evaluation Highlight Card */}
            {pricingTiers.find(t => t.id === 'evaluation') && (
              <div className="max-w-3xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white p-8 md:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-2 border-[#132D22] relative overflow-hidden text-center"
                >
                  <div className="absolute top-0 right-0 p-4">
                    <span className="bg-[#132D22] text-[#F7EBD3] px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
                      Step 1
                    </span>
                  </div>

                  <div className="text-5xl mb-6">📋</div>
                  <h3 className="text-3xl font-black text-[#132D22] mb-4">
                    Comprehensive Evaluation
                  </h3>

                  <div className="text-5xl font-black text-[#132D22] mb-3">
                    {pricingTiers.find(t => t.id === 'evaluation')?.price}
                    <span className="text-xl font-medium text-gray-500 block mt-1">
                      (one-time fee)
                    </span>
                  </div>

                  <div className="text-left max-w-2xl mx-auto mb-8 bg-[#132D22]/5 p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mt-6">
                    <h4 className="font-bold text-[#132D22] mb-4 text-lg">What an evaluation includes:</h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-[#B97B40] shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-medium">Clinical assessment using structured tools to understand how you communicate and what support would help most</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-[#B97B40] shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-medium">A look at how communication challenges show up in everyday life — at home, at school, or at work</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-[#B97B40] shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-medium">Comprehensive written report detailing findings</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-[#B97B40] shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-medium">Consultation / review session to discuss next steps</span>
                      </li>
                    </ul>
                  </div>


                  <button
                    onClick={() => handleSelectPlan('evaluation')}
                    disabled={isLoading || (isAuthenticated && user?.role === 'client' && !intakeCompleted) || checkingIntake}
                    className="w-full md:w-auto px-8 py-4 bg-[#132D22] text-[#F7EBD3] rounded-xl font-bold text-lg hover:bg-[#203936] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    {checkingIntake
                      ? 'Checking...'
                      : isLoading
                        ? t('common.loading')
                        : (isAuthenticated && user?.role === 'client' && !intakeCompleted)
                          ? 'Complete Intake First'
                          : 'Schedule Your Evaluation →'}
                  </button>
                </motion.div>
              </div>
            )}

            {/* Subscriptions Section */}
            <div className="pt-8 border-t border-gray-200">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[#132D22] mb-4">Recommended Therapy Structures</h2>
                <p className="text-lg text-[#203936]/70 mb-4">Following your evaluation, your clinician may recommend one of the following care options:</p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm font-medium max-w-2xl mx-auto">
                  Note: The prices below do not include the one-time evaluation fee, which is required prior to beginning any ongoing therapy plan.
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {pricingTiers.filter(t => t.id !== 'evaluation').map((tier, index) => (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`bg-white p-8 rounded-2xl premium-shadow relative ${recommendedTier === tier.id
                      ? 'ring-2 ring-emerald-500 border-emerald-500'
                      : tier.popular ? 'ring-2 ring-black' : 'border border-gray-100'
                      }`}
                  >
                    {recommendedTier === tier.id && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-full text-center">
                        <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold inline-flex items-center gap-1 shadow-md">
                          <Star className="w-4 h-4" /> Recommended for You
                        </span>
                      </div>
                    )}
                    {tier.popular && !recommendedTier && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-full text-center">
                        <span className="bg-[#132D22] text-[#F7EBD3] px-4 py-1.5 rounded-full text-sm font-semibold shadow-md inline-block">
                          {t('pricing.mostPopular')}
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-8 pt-2">
                      <div className="text-4xl mb-3">{tier.icon}</div>
                      <h3 className="text-2xl font-bold text-black mb-2">{tier.name}</h3>
                      <div className="text-4xl font-bold text-black mb-2 flex items-baseline justify-center">
                        {tier.price}
                        <span className="text-lg text-gray-500 ml-1 font-medium">{tier.period}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-500 mb-4">{tier.billing}</p>

                      {evaluationCredit && evaluationCredit.status === 'available' && evaluationCredit.amount > 0 && tier.id !== 'bloom' && (
                        <div className="bg-green-50 text-green-700 text-sm font-semibold py-2 px-3 rounded-lg mb-4">
                          After credit: ${Math.max(0, parseInt(tier.price.replace('$', '')) - evaluationCredit.amount)}{tier.period} first month
                        </div>
                      )}

                      {tier.sessionsPerMonth > 0 && (
                        <div className="bg-gray-50 py-2 px-3 rounded-lg mb-4">
                          <p className="text-sm font-semibold text-[#132D22]">
                            {tier.sessionsPerMonth} session{tier.sessionsPerMonth !== 1 ? 's' : ''} / month
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{tier.duration} min each</p>
                        </div>
                      )}

                      <p className="text-gray-600 font-medium mb-3 min-h-[48px] flex items-center justify-center">{tier.description}</p>
                      <p className="text-sm text-gray-500 italic bg-gray-50 py-2 rounded-lg">{tier.tagline}</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {tier.features.map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-6">
                      {currentSubscription?.tier === tier.id ? (
                        <div className="w-full py-4 rounded-xl font-semibold bg-green-50 text-green-700 border border-green-200 text-center flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 mr-2" /> Current Plan
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSelectPlan(tier.id)}
                          disabled={isLoading || (isAuthenticated && user?.role === 'client' && !intakeCompleted) || checkingIntake}
                          className={`w-full py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${tier.popular || recommendedTier === tier.id
                            ? 'bg-[#132D22] text-[#F7EBD3] hover:bg-[#203936] shadow-md hover:shadow-lg hover:-translate-y-0.5'
                            : 'bg-white border-2 border-[#132D22] text-[#132D22] hover:bg-[#132D22] hover:text-[#F7EBD3]'
                            }`}
                        >
                          {checkingIntake
                            ? 'Checking...'
                            : isLoading
                              ? t('common.loading')
                              : (isAuthenticated && user?.role === 'client' && !intakeCompleted)
                                ? 'Complete Intake First'
                                : isAuthenticated
                                  ? currentSubscription
                                    ? `Switch to ${tier.name}`
                                    : 'Select Structure'
                                  : t('nav.getStarted')}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
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

        {/* Financial Accessibility */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#132D22] text-[#F7EBD3] rounded-2xl p-8 lg:p-12 mb-16 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-3xl font-bold mb-8 text-white text-center">Out-of-Network & Private Pay</h2>
            
            <p className="text-[#F7EBD3]/90 text-lg mb-10 text-center max-w-2xl mx-auto">
              Rooted Voices operates as a private-pay, out-of-network practice. This model allows us to focus entirely on what's best for you — free from insurance-dictated timelines, arbitrary session limits, or mandatory diagnoses.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-6 h-6 text-[#B97B40]" />
                  <h3 className="text-xl font-semibold text-white">HSA & FSA Eligible</h3>
                </div>
                <p className="text-[#F7EBD3]/80 leading-relaxed">
                  You can use your Health Savings Account (HSA) or Flexible Spending Account (FSA) cards to pay for your evaluations and ongoing therapy sessions seamlessly.
                </p>
              </div>

              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-[#B97B40]" />
                  <h3 className="text-xl font-semibold text-white">Superbills Provided</h3>
                </div>
                <p className="text-[#F7EBD3]/80 leading-relaxed">
                  Upon request, we provide detailed monthly superbills. You can submit these directly to your insurance provider for potential out-of-network reimbursement.
                </p>
              </div>
              

            </div>
          </div>
        </motion.div>

        {/* How Superbills Work */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="bg-white rounded-2xl premium-shadow p-8 mb-16 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-black text-center mb-8">How Superbills Work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-black border-2 border-[#132D22]">1</div>
              <h3 className="font-semibold text-black mb-2">You Pay Direct</h3>
              <p className="text-sm text-gray-600">You pay for your session at the time of service via our secure portal.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-black border-2 border-[#132D22]">2</div>
              <h3 className="font-semibold text-black mb-2">We Provide the Bill</h3>
              <p className="text-sm text-gray-600">On the 1st of each month, we provide a detailed receipt (superbill) containing all necessary diagnostic and treatment codes.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-black border-2 border-[#132D22]">3</div>
              <h3 className="font-semibold text-black mb-2">You Submit for Reimbursement</h3>
              <p className="text-sm text-gray-600">You submit the superbill to your insurance company. If you have out-of-network benefits, they will reimburse you directly based on your plan.</p>
            </div>
          </div>
          <div className="mt-8 bg-gray-50 p-4 rounded-lg text-sm text-gray-600 text-center">
            <strong>Note:</strong> We highly recommend calling your insurance provider before starting therapy to ask: <br/>"What are my out-of-network benefits for speech-language evaluation (CPT 92523) and treatment (CPT 92507)?"
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
                title: 'Grounded in Research & Compassionate',
                description: 'Therapy methods backed by research delivered with warmth, respect, and care that understands who you are and where you come from — honoring your communication style and the life you have lived.'
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

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
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
            <Link href="/services" className="border border-gray-300 text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center group">
              View Services & Pricing
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

          <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">

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
