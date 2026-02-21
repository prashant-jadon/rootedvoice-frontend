'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { evaluationAPI, stripeAPI, clientAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, CreditCard, UserSearch, CalendarCheck,
    Clock, Star, Award, ArrowRight, ArrowLeft, Loader2,
    AlertCircle, ShieldCheck, GraduationCap, Globe,
} from 'lucide-react';

interface Therapist {
    _id: string;
    userId: { _id: string; firstName: string; lastName: string; avatar?: string };
    specializations: string[];
    bio: string;
    experience: number;
    rating: number;
    totalReviews: number;
    credentials: string;
    spokenLanguages: string[];
    availableSlots: Array<{
        date: string;
        dayName: string;
        startTime: string;
        endTime: string;
    }>;
}

const STEPS = [
    { id: 1, label: 'Intake Form', icon: CheckCircle },
    { id: 2, label: 'Pay $195', icon: CreditCard },
    { id: 3, label: 'Select Therapist', icon: UserSearch },
    { id: 4, label: 'Confirmation', icon: CalendarCheck },
];

function BookingContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [evaluation, setEvaluation] = useState<any>(null);
    const [intakeCompleted, setIntakeCompleted] = useState(false);
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const [bookingComplete, setBookingComplete] = useState(false);

    // Check for payment success callback
    useEffect(() => {
        const paymentSuccess = searchParams.get('payment_success');
        const evaluationId = searchParams.get('evaluation_id');
        const sessionId = searchParams.get('session_id');

        if (paymentSuccess === 'true' && evaluationId && sessionId) {
            handlePaymentVerification(sessionId, evaluationId);
        }
    }, [searchParams]);

    const handlePaymentVerification = async (sessionId: string, evaluationId: string) => {
        try {
            setLoading(true);
            await stripeAPI.verifyEvaluationPayment(sessionId, evaluationId);
            // Reload evaluation
            loadEvaluation();
        } catch (err: any) {
            console.error('Payment verification error:', err);
            setError('Payment verification failed. Please contact support.');
        }
    };

    const loadEvaluation = useCallback(async () => {
        try {
            setLoading(true);
            // Check intake status
            const intakeRes = await clientAPI.getIntakeStatus();
            const intakeStatus = intakeRes.data?.data?.intakeCompleted;
            setIntakeCompleted(intakeStatus);

            // Get existing evaluation
            const evalRes = await evaluationAPI.getMyEvaluation();
            const evalData = evalRes.data?.data;
            setEvaluation(evalData);

            // Determine current step based on evaluation status
            if (!intakeStatus) {
                setCurrentStep(1);
            } else if (!evalData || evalData.status === 'pending_payment') {
                setCurrentStep(2);
            } else if (evalData.status === 'paid') {
                setCurrentStep(3);
                loadAvailableTherapists();
            } else if (['therapist_assigned', 'therapist_reviewing', 'ready_for_meeting', 'meeting_scheduled', 'in_progress', 'completed', 'recommendations_sent'].includes(evalData.status)) {
                setCurrentStep(4);
                setBookingComplete(true);
            }
        } catch (err: any) {
            console.error('Error loading evaluation:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEvaluation();
    }, [loadEvaluation]);

    const loadAvailableTherapists = async () => {
        try {
            const res = await evaluationAPI.getAvailableTherapists();
            setTherapists(res.data?.data?.therapists || []);
        } catch (err: any) {
            console.error('Error loading therapists:', err);
            setError('Failed to load available therapists.');
        }
    };

    // Step 1: Redirect to intake form
    const goToIntake = () => {
        router.push('/client-intake');
    };

    // Step 2: Create evaluation and proceed to payment
    const handleBookAndPay = async () => {
        try {
            setSubmitting(true);
            setError('');

            // Create evaluation if not exists
            let evalId = evaluation?._id;
            if (!evaluation) {
                const bookRes = await evaluationAPI.book();
                evalId = bookRes.data?.data?._id;
                setEvaluation(bookRes.data?.data);
            }

            // Create Stripe checkout for $195
            const stripeRes = await stripeAPI.createEvaluationCheckout(evalId);
            const checkoutUrl = stripeRes.data?.data?.url;

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                setError('Unable to create payment session.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to initiate payment.');
        } finally {
            setSubmitting(false);
        }
    };

    // Step 3: Select therapist and slot
    const handleSelectTherapist = async () => {
        if (!selectedTherapist || !selectedSlot || !evaluation) return;

        try {
            setSubmitting(true);
            setError('');

            await evaluationAPI.selectTherapist({
                evaluationId: evaluation._id,
                therapistId: selectedTherapist,
                scheduledDate: selectedSlot.date,
                scheduledTime: selectedSlot.startTime,
            });

            setBookingComplete(true);
            setCurrentStep(4);
            loadEvaluation(); // Refresh evaluation data
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to select therapist.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Diagnostic Evaluation</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        A 60-minute evaluation with a licensed Speech-Language Pathologist (SLP).
                        Your $195 fee will be credited toward your subscription purchase.
                    </p>
                </motion.div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-12">
                    {STEPS.map((step, index) => {
                        const StepIcon = step.icon;
                        const isActive = currentStep === step.id;
                        const isComplete = currentStep > step.id || bookingComplete;
                        return (
                            <div key={step.id} className="flex items-center">
                                <div className={`flex flex-col items-center ${isActive ? 'scale-110' : ''}`}>
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isComplete ? 'bg-green-600 text-white' :
                                            isActive ? 'bg-green-500 text-white ring-4 ring-green-200' :
                                                'bg-gray-200 text-gray-400'
                                            }`}
                                    >
                                        <StepIcon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-xs mt-2 font-medium ${isActive ? 'text-green-700' : 'text-gray-400'}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className={`w-16 md:w-28 h-1 mx-2 rounded ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Error Display */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    {/* Step 1: Intake Form Check */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-2xl shadow-lg border p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-yellow-600" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Complete Your Intake Form First</h2>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Before booking your evaluation, please complete your intake form. This helps your therapist prepare for your assessment.
                            </p>
                            <button
                                onClick={goToIntake}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition-all"
                            >
                                Complete Intake Form <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    )}

                    {/* Step 2: Payment */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-2xl shadow-lg border p-8"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CreditCard className="w-8 h-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Evaluation Fee</h2>
                                <p className="text-gray-600">One-time fee for your 60-minute diagnostic evaluation</p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-200">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-700 font-medium">Diagnostic Evaluation (60 min)</span>
                                    <span className="text-3xl font-bold text-green-700">$195</span>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Licensed SLP assessment</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Personalized recommendations</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Access to resource library</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Evaluation report uploaded to profile</li>
                                </ul>
                                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <p className="text-yellow-800 text-sm font-medium flex items-center gap-2">
                                        💰 This $195 will be credited toward your subscription purchase!
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleBookAndPay}
                                disabled={submitting}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold text-lg inline-flex items-center justify-center gap-2 transition-all"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                                {submitting ? 'Processing...' : 'Pay $195 & Continue'}
                            </button>
                        </motion.div>
                    )}

                    {/* Step 3: Select Therapist */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold mb-2">Select Your Therapist</h2>
                                <p className="text-gray-600">Choose a licensed SLP and a time slot for your evaluation (slots available after 3 business days)</p>
                            </div>

                            {therapists.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-lg border p-8 text-center">
                                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No therapists available at this time. Please check back later.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {therapists.map((therapist) => (
                                        <div
                                            key={therapist._id}
                                            className={`bg-white rounded-2xl shadow-lg border transition-all cursor-pointer ${selectedTherapist === therapist._id ? 'ring-2 ring-green-500 border-green-300' : 'hover:shadow-xl'
                                                }`}
                                            onClick={() => {
                                                setSelectedTherapist(therapist._id);
                                                setSelectedSlot(null);
                                            }}
                                        >
                                            <div className="p-6">
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-lg">
                                                        {therapist.userId.firstName[0]}{therapist.userId.lastName[0]}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-gray-900">
                                                            {therapist.userId.firstName} {therapist.userId.lastName}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                            <span className="flex items-center gap-1">
                                                                <ShieldCheck className="w-4 h-4 text-green-500" /> {therapist.credentials}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <GraduationCap className="w-4 h-4" /> {therapist.experience}+ years
                                                            </span>
                                                            {therapist.rating > 0 && (
                                                                <span className="flex items-center gap-1">
                                                                    <Star className="w-4 h-4 text-yellow-500" /> {therapist.rating.toFixed(1)} ({therapist.totalReviews})
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {selectedTherapist === therapist._id && (
                                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                                    )}
                                                </div>

                                                {therapist.bio && (
                                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{therapist.bio}</p>
                                                )}

                                                {therapist.specializations?.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {therapist.specializations.slice(0, 4).map((spec) => (
                                                            <span key={spec} className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                                                                {spec}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {therapist.spokenLanguages?.length > 0 && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                                                        <Globe className="w-3 h-3" />
                                                        {therapist.spokenLanguages.join(', ')}
                                                    </div>
                                                )}

                                                {/* Available Slots */}
                                                {selectedTherapist === therapist._id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="border-t pt-4 mt-4"
                                                    >
                                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Available Slots:</h4>
                                                        {therapist.availableSlots.length > 0 ? (
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                                {therapist.availableSlots.slice(0, 12).map((slot, idx) => (
                                                                    <button
                                                                        key={idx}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedSlot(slot);
                                                                        }}
                                                                        className={`p-3 rounded-lg text-sm border transition-all ${selectedSlot?.date === slot.date && selectedSlot?.startTime === slot.startTime
                                                                            ? 'bg-green-600 text-white border-green-600'
                                                                            : 'bg-white hover:bg-green-50 border-gray-200'
                                                                            }`}
                                                                    >
                                                                        <div className="font-medium">{new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                                                        <div className="text-xs opacity-80">{slot.dayName}</div>
                                                                        <div className="text-xs mt-1">{slot.startTime} - {slot.endTime}</div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 text-center">
                                                                No slots currently available for this therapist.
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Confirm Button */}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleSelectTherapist}
                                            disabled={!selectedTherapist || !selectedSlot || submitting}
                                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition-all"
                                        >
                                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                                            {submitting ? 'Booking...' : 'Confirm Selection'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Step 4: Confirmation */}
                    {currentStep === 4 && bookingComplete && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl shadow-lg border p-8 text-center"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CalendarCheck className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Evaluation Booked!</h2>
                            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                                Your therapist will review your details over the next 3 business days.
                                You&apos;ll receive a notification when they&apos;re ready for your evaluation meeting.
                            </p>

                            {evaluation && (
                                <div className="bg-green-50 rounded-xl p-6 mb-6 max-w-md mx-auto text-left">
                                    {evaluation.scheduledDate && (
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-600 text-sm">Meeting Date</span>
                                            <span className="font-semibold">{new Date(evaluation.scheduledDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {evaluation.scheduledTime && (
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-600 text-sm">Meeting Time</span>
                                            <span className="font-semibold">{evaluation.scheduledTime}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-600 text-sm">Duration</span>
                                        <span className="font-semibold">60 minutes</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm">Status</span>
                                        <span className="bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                                            {evaluation.status?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                                <p className="text-yellow-800 text-sm">
                                    💰 Your <strong>$195 evaluation credit</strong> is now available!
                                    It will be automatically applied when you purchase a subscription.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => router.push('/client-evaluation')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition-all"
                                >
                                    View Evaluation Status
                                </button>
                                <button
                                    onClick={() => router.push('/client-dashboard')}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition-all"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function EvaluationBookingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        }>
            <BookingContent />
        </Suspense>
    );
}
