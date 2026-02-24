'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token') || ''

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long.')
            return
        }

        if (!token) {
            setError('Invalid or missing reset token. Please request a new password reset link.')
            return
        }

        setIsLoading(true)

        try {
            await authAPI.resetPassword(token, formData.newPassword)
            setSuccess(true)
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } catch (err: any) {
            setError(
                err.response?.data?.message || 'Failed to reset password. The link may have expired.'
            )
        } finally {
            setIsLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-6">
                    <Lock className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-[#132D22] mb-3">Invalid Link</h2>
                <p className="text-[#203936]/70 mb-8">
                    This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Link
                    href="/forgot-password"
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-[#F7EBD3] bg-[#203936] hover:bg-[#132D22] transition-colors"
                >
                    Request New Link
                </Link>
            </div>
        )
    }

    if (success) {
        return (
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-black text-[#132D22] mb-3">Password Reset!</h2>
                <p className="text-[#203936]/70 mb-8">
                    Your password has been reset successfully. You&apos;ll be redirected to the login page shortly.
                </p>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-[#F7EBD3] bg-[#203936] hover:bg-[#132D22] transition-colors"
                >
                    Go to Login
                </Link>
            </div>
        )
    }

    return (
        <>
            <div className="mb-10">
                <h1 className="text-3xl font-black text-[#132D22] mb-3 tracking-tight">Reset your password</h1>
                <p className="text-[#203936]/70">
                    Enter your new password below.
                </p>
                {error && (
                    <div className="mt-5 p-4 bg-red-50 border border-red-100 rounded-xl">
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-semibold text-[#132D22] mb-2">
                        New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-[#203936]/40" />
                        </div>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            className="block w-full pl-11 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-[#132D22] placeholder:text-[#203936]/40 focus:outline-none focus:ring-2 focus:ring-[#203936] focus:border-transparent transition-all"
                            placeholder="Enter new password"
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

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#132D22] mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-[#203936]/40" />
                        </div>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirm ? 'text' : 'password'}
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="block w-full pl-11 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-[#132D22] placeholder:text-[#203936]/40 focus:outline-none focus:ring-2 focus:ring-[#203936] focus:border-transparent transition-all"
                            placeholder="Confirm new password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            {showConfirm ? (
                                <EyeOff className="h-5 w-5 text-[#203936]/40 hover:text-[#132D22] transition-colors" />
                            ) : (
                                <Eye className="h-5 w-5 text-[#203936]/40 hover:text-[#132D22] transition-colors" />
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-[#F7EBD3] bg-[#203936] hover:bg-[#132D22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#203936] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </>
    )
}

export default function ResetPasswordPage() {
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
                        <Suspense fallback={<div className="text-center py-10 text-[#203936]/60">Loading...</div>}>
                            <ResetPasswordForm />
                        </Suspense>
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
                            A fresh start.
                        </h2>
                        <p className="text-[#203936]/80 text-lg leading-relaxed">
                            Choose a strong password to keep your account secure. We recommend at least 8 characters with a mix of letters and numbers.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
