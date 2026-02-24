'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Send, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { authAPI } from '@/lib/api'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await authAPI.forgotPassword(email)
            setSuccess(true)
        } catch (err: any) {
            setError(
                err.response?.data?.message || 'Something went wrong. Please try again.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white flex selection:bg-[#203936]/10">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    {/* Back to Login */}
                    <Link href="/login" className="flex items-center text-[#203936]/60 hover:text-[#132D22] transition-colors mb-8 font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' as const }}
                    >
                        {!success ? (
                            <>
                                <div className="mb-10">
                                    <h1 className="text-3xl font-black text-[#132D22] mb-3 tracking-tight">Forgot password?</h1>
                                    <p className="text-[#203936]/70">
                                        Enter your email address and we&apos;ll send you a link to reset your password.
                                    </p>
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
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-[#132D22] placeholder:text-[#203936]/40 focus:outline-none focus:ring-2 focus:ring-[#203936] focus:border-transparent transition-all"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-[#F7EBD3] bg-[#203936] hover:bg-[#132D22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#203936] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            'Sending...'
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Send Reset Link
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-6">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-black text-[#132D22] mb-3">Check your email</h2>
                                <p className="text-[#203936]/70 mb-8">
                                    We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
                                </p>
                                <p className="text-sm text-[#203936]/50 mb-6">
                                    The link will expire in 1 hour. If you don&apos;t see the email, check your spam folder.
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 py-3 px-6 border border-[#203936]/20 rounded-xl text-sm font-semibold text-[#132D22] hover:bg-gray-50 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Decorative */}
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-[#F7EBD3] relative overflow-hidden">
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
                            It happens to everyone.
                        </h2>
                        <p className="text-[#203936]/80 text-lg leading-relaxed">
                            No worries — we&apos;ll get you back into your account in no time. Just enter your email and follow the link we send you.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
