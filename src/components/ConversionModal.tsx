'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X, Sparkles, ArrowRight } from 'lucide-react'
import { useState } from 'react'

interface ConversionModalProps {
    isOpen: boolean
    onClose: () => void
    onSelectPlan: (planId: string) => void
}

export default function ConversionModal({ isOpen, onClose, onSelectPlan }: ConversionModalProps) {
    // Toggleable promo text constant
    const SHOW_PROMO_TEXT = true

    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>

                    <div className="p-8 md:p-12">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-black mb-2">
                                Congratulations on completing your Initial Evaluation!
                            </h2>
                            <p className="text-xl text-gray-600">
                                How would you like to proceed with your care?
                            </p>
                        </div>

                        {/* Plan Options */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* Option A: Subscription */}
                            <div
                                className={`relative border-2 rounded-2xl p-6 transition-all cursor-pointer ${hoveredPlan === 'subscription'
                                        ? 'border-purple-600 bg-purple-50 shadow-lg'
                                        : 'border-purple-200 hover:border-purple-400'
                                    }`}
                                onMouseEnter={() => setHoveredPlan('subscription')}
                                onMouseLeave={() => setHoveredPlan(null)}
                                onClick={() => onSelectPlan('flourish')} // Default to Flourish or let them choose later? Let's send them to pricing with a flag or just 'flourish' for now.
                            >
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md flex items-center">
                                        <Sparkles className="w-3 h-3 mr-1" /> Best Value
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-black mb-2 text-center mt-2">Monthly Subscription</h3>
                                <div className="text-3xl font-bold text-center text-purple-600 mb-1">
                                    $229<span className="text-lg text-gray-600 font-normal">/mo</span>
                                </div>
                                <p className="text-sm text-gray-500 text-center mb-6">Rooted Tier</p>

                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm">2 sessions per month included</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm">Evaluation Included ($195 value)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm">Personalized treatment plan</span>
                                    </li>
                                </ul>

                                <button className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center">
                                    Switch to Subscription <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </div>

                            {/* Option B: Bloom */}
                            <div
                                className={`relative border-2 rounded-2xl p-6 transition-all cursor-pointer ${hoveredPlan === 'bloom'
                                        ? 'border-gray-400 bg-gray-50 shadow-lg'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onMouseEnter={() => setHoveredPlan('bloom')}
                                onMouseLeave={() => setHoveredPlan(null)}
                                onClick={() => onClose()} // Just close to stay on Bloom
                            >
                                <h3 className="text-xl font-bold text-black mb-2 text-center mt-4">Bloom (Pay-as-you-go)</h3>
                                <div className="text-3xl font-bold text-center text-gray-900 mb-1">
                                    $125<span className="text-lg text-gray-600 font-normal">/session</span>
                                </div>
                                <p className="text-sm text-gray-500 text-center mb-6">Flexible Scheduling</p>

                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm">Pay only when you book</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm">No monthly commitment</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700 text-sm">Standard support</span>
                                    </li>
                                </ul>

                                <button className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                                    Continue with Bloom
                                </button>
                            </div>
                        </div>

                        {/* Promo Text */}
                        {SHOW_PROMO_TEXT && (
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                                <p className="text-blue-800 text-sm font-medium">
                                    Ref: If you enroll in a subscription within 7 days, your evaluation fee can be credited toward your first month.
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
