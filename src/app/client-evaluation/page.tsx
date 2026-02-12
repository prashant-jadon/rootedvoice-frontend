'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { evaluationAPI } from '@/lib/api'
import { CheckCircle, AlertCircle, FileText, Send } from 'lucide-react'

export default function ClientEvaluationPage() {
    const { user, isAuthenticated } = useAuth()
    const router = useRouter()
    const [evaluation, setEvaluation] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
            return
        }
        if (user?.role !== 'client') {
            router.push('/dashboard')
            return
        }
        fetchEvaluation()
    }, [isAuthenticated, user])

    const fetchEvaluation = async () => {
        try {
            setLoading(true)
            const response = await evaluationAPI.getMyEvaluation()
            setEvaluation(response.data.data)

            // Initialize answers if existing
            if (response.data.data?.answers) {
                const initialAnswers: Record<string, any> = {};
                response.data.data.answers.forEach((ans: any) => {
                    initialAnswers[ans.questionId] = ans.answer;
                });
                setAnswers(initialAnswers);
            }
        } catch (err) {
            console.error('Failed to fetch evaluation:', err)
            // Don't set error string generally, just means no evaluation found probably
        } finally {
            setLoading(false)
        }
    }

    const handleAnswerChange = (questionId: string, value: any) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!evaluation) return

        setSubmitting(true)
        setError('')

        try {
            // Format answers for backend
            const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
                questionId: qId,
                answer: val,
                submittedAt: new Date()
            }))

            await evaluationAPI.submit(evaluation._id, formattedAnswers)
            setSuccess(true)
            setTimeout(() => {
                router.push('/client-dashboard')
            }, 3000)
        } catch (err: any) {
            console.error('Submit error:', err)
            setError(err.response?.data?.message || 'Failed to submit evaluation')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
                >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Evaluation Submitted!</h2>
                    <p className="text-gray-600 mb-6">
                        Thank you for completing your evaluation. Your therapist will review it shortly.
                        You can now book your regular therapy sessions.
                    </p>
                    <button
                        onClick={() => router.push('/client-dashboard')}
                        className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        Go to Dashboard
                    </button>
                </motion.div>
            </div>
        )
    }

    // No active evaluation found
    if (!evaluation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Pending Evaluation</h2>
                    <p className="text-gray-600 mb-6">
                        You don't have any pending evaluation questionnaires at this time.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/book-session')}
                            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            Book a Session
                        </button>
                        <button
                            onClick={() => router.push('/client-dashboard')}
                            className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // If evaluation is already completed
    if (evaluation.status === 'completed' || evaluation.status === 'reviewed') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Evaluation Completed</h2>
                    <p className="text-gray-600 mb-6">
                        You have already submitted this evaluation.
                    </p>
                    <button
                        onClick={() => router.push('/client-dashboard')}
                        className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Initial Evaluation</h1>
                    <p className="mt-2 text-gray-600">Please answer the following questions to help us create your personalized treatment plan.</p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                {error}
                            </div>
                        )}

                        {evaluation.questions?.length > 0 ? (
                            evaluation.questions.map((q: any) => (
                                <div key={q.id} className="space-y-2">
                                    <label className="block text-lg font-medium text-gray-900">
                                        {q.text} {q.required && <span className="text-red-500">*</span>}
                                    </label>

                                    {q.type === 'textarea' ? (
                                        <textarea
                                            required={q.required}
                                            value={answers[q.id] || ''}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            placeholder="Type your answer here..."
                                        />
                                    ) : q.type === 'select' ? (
                                        <select
                                            required={q.required}
                                            value={answers[q.id] || ''}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                        >
                                            <option value="">Select an option...</option>
                                            {q.options?.map((opt: string) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : q.type === 'radio' ? (
                                        <div className="space-y-2">
                                            {q.options?.map((opt: string) => (
                                                <label key={opt} className="flex items-center space-x-3 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={q.id}
                                                        value={opt}
                                                        checked={answers[q.id] === opt}
                                                        onChange={() => handleAnswerChange(q.id, opt)}
                                                        required={q.required}
                                                        className="h-4 w-4 text-black focus:ring-black border-gray-300"
                                                    />
                                                    <span className="text-gray-700">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            required={q.required}
                                            value={answers[q.id] || ''}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                            placeholder="Type your answer here..."
                                        />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No questions assigned yet. Please contact support if you believe this is an error.</p>
                            </div>
                        )}

                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting || !evaluation.questions?.length}
                                className="px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg flex items-center"
                            >
                                {submitting ? 'Submitting...' : 'Submit Evaluation'}
                                {!submitting && <Send className="w-5 h-5 ml-2" />}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
