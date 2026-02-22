'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(formData.email, formData.password)
      // Redirect based on user role
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user.role === 'therapist') {
        router.push('/dashboard')
      } else if (user.role === 'client') {
        router.push('/client-dashboard')
      } else {
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex selection:bg-[#203936]/10">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Back to Home */}
          <Link href="/" className="flex items-center text-[#203936]/60 hover:text-[#132D22] transition-colors mb-8 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
          >
            <div className="mb-10">
              <h1 className="text-3xl font-black text-[#132D22] mb-3 tracking-tight">Welcome back.</h1>
              <p className="text-[#203936]/70">Sign in to your Rooted Voices account.</p>
              {error && (
                <div className="mt-5 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#132D22] mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#203936]/40" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-[#132D22] placeholder:text-[#203936]/40 focus:outline-none focus:ring-2 focus:ring-[#203936] focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#132D22] mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#203936]/40" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full pl-11 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-[#132D22] placeholder:text-[#203936]/40 focus:outline-none focus:ring-2 focus:ring-[#203936] focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-[#203936]/40 hover:text-[#132D22] transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-[#203936]/40 hover:text-[#132D22] transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#203936] focus:ring-[#203936] border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-[#203936]/70 cursor-pointer">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="text-[#203936] font-semibold hover:text-[#132D22] transition-colors">
                    Forgot simple password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-[#F7EBD3] bg-[#203936] hover:bg-[#132D22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#203936] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
                  <span className="px-3 bg-white text-[#203936]/40">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-[#132D22] hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="ml-2">Google</span>
                </button>

                <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-[#132D22] hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="ml-2">Facebook</span>
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-[#203936]/60">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#203936] hover:text-[#132D22] transition-colors font-bold border-b border-[#203936]/30 hover:border-[#132D22]">
                Sign up for free
              </Link>
            </p>

            <div className="mt-10 pt-8 border-t border-gray-100">
              <p className="text-center text-xs uppercase tracking-wider font-semibold text-[#203936]/40 mb-4">Quick Demo Access</p>
              <div className="flex space-x-3">
                <Link href="/dashboard" className="flex-1 bg-gray-50 border border-gray-100 text-[#132D22] px-4 py-2.5 rounded-lg text-center text-sm font-semibold hover:bg-gray-100 transition-colors">
                  Therapist
                </Link>
                <Link href="/client-dashboard" className="flex-1 bg-gray-50 border border-gray-100 text-[#132D22] px-4 py-2.5 rounded-lg text-center text-sm font-semibold hover:bg-gray-100 transition-colors">
                  Client
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Image/Content */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-[#F7EBD3] relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#203936 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' as const }}
          className="max-w-md text-left relative z-10 px-8"
        >
          <div className="bg-[#132D22]/5 border border-[#132D22]/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-black text-[#132D22] mb-4 leading-tight">
              Where growth happens.
            </h2>
            <p className="text-[#203936]/80 text-lg mb-8 leading-relaxed">
              Log in to seamlessly manage your sessions, access resources, and continue your journey to better communication.
            </p>

            <div className="space-y-4 pt-6 border-t border-[#132D22]/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#132D22] text-[#F7EBD3]">
                  <ArrowLeft className="w-3 h-3 rotate-180" />
                </div>
                <span className="text-[#132D22]/80 font-medium">Secure, HIPAA-compliant platform</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#132D22] text-[#F7EBD3]">
                  <ArrowLeft className="w-3 h-3 rotate-180" />
                </div>
                <span className="text-[#132D22]/80 font-medium">Streamlined scheduling & billing</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
