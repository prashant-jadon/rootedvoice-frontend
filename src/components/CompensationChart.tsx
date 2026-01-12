'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Target, Clock, DollarSign } from 'lucide-react'

interface CompensationChartProps {
  credentialType: 'SLP' | 'SLPA'
  hoursAccumulated: number
  currentHourlyRate: number
}

export default function CompensationChart({ 
  credentialType, 
  hoursAccumulated, 
  currentHourlyRate 
}: CompensationChartProps) {
  // Compensation tiers configuration
  const SLP_TIERS = [
    { hours: 0, rate: 35 },
    { hours: 5, rate: 40 },
    { hours: 10, rate: 45 },
    { hours: 15, rate: 50 },
    { hours: 20, rate: 55 },
    { hours: 25, rate: 60 },
    { hours: 30, rate: 65 },
    { hours: 35, rate: 70 },
    { hours: 40, rate: 75 },
  ]

  const SLPA_TIERS = [
    { hours: 0, rate: 30 },
    { hours: 5, rate: 35 },
    { hours: 10, rate: 40 },
    { hours: 15, rate: 45 },
    { hours: 20, rate: 50 },
    { hours: 25, rate: 55 },
  ]

  const tiers = credentialType === 'SLP' ? SLP_TIERS : SLPA_TIERS
  const maxRate = credentialType === 'SLP' ? 75 : 55
  const startingRate = credentialType === 'SLP' ? 35 : 30

  // Find current tier
  const currentTierIndex = tiers.findIndex((tier, index) => {
    const nextTier = tiers[index + 1]
    if (!nextTier) return hoursAccumulated >= tier.hours
    return hoursAccumulated >= tier.hours && hoursAccumulated < nextTier.hours
  })
  const currentTier = currentTierIndex >= 0 ? tiers[currentTierIndex] : tiers[0]
  const nextTier = tiers[currentTierIndex + 1]

  // Calculate progress to next tier
  const hoursToNextTier = nextTier ? nextTier.hours - hoursAccumulated : 0
  const progressToNextTier = nextTier 
    ? Math.min(100, ((hoursAccumulated - currentTier.hours) / (nextTier.hours - currentTier.hours)) * 100)
    : 100

  // Calculate total hours needed to reach max
  const totalHoursToMax = tiers[tiers.length - 1].hours
  const overallProgress = Math.min(100, (hoursAccumulated / totalHoursToMax) * 100)

  return (
    <div className="bg-white rounded-2xl premium-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-black">Compensation Progression</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{hoursAccumulated} hours worked</span>
        </div>
      </div>

      {/* Current Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Current Rate</div>
          <div className="text-2xl font-bold text-blue-600">${currentHourlyRate}/hr</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Hours Accumulated</div>
          <div className="text-2xl font-bold text-green-600">{hoursAccumulated}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">Current Tier</div>
          <div className="text-2xl font-bold text-purple-600">
            Tier {currentTierIndex + 1}
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-xs text-gray-600 mb-1">
            {nextTier ? 'Hours to Next Tier' : 'Maximum Rate Reached'}
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {nextTier ? hoursToNextTier : '✓'}
          </div>
        </div>
      </div>

      {/* Progress Bar to Next Tier */}
      {nextTier && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress to ${nextTier.rate}/hour
            </span>
            <span className="text-sm text-gray-600">
              {hoursAccumulated - currentTier.hours} / {nextTier.hours - currentTier.hours} hours
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextTier}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {hoursToNextTier > 0 
              ? `${hoursToNextTier} more hours needed for next $5 increase`
              : 'Ready for next tier increase!'}
          </p>
        </div>
      )}

      {/* Overall Progress to Maximum */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Overall Progress to Maximum Rate (${maxRate}/hour)
          </span>
          <span className="text-sm text-gray-600">
            {hoursAccumulated} / {totalHoursToMax} hours
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-end pr-2"
          >
            {overallProgress > 15 && (
              <span className="text-xs font-semibold text-white">
                {Math.round(overallProgress)}%
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Tier Visualization */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Compensation Tiers</h3>
        <div className="space-y-3">
          {tiers.map((tier, index) => {
            const isCurrentTier = index === currentTierIndex
            const isPastTier = hoursAccumulated >= tier.hours && index < currentTierIndex
            const isFutureTier = index > currentTierIndex

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  isCurrentTier
                    ? 'bg-blue-50 border-blue-500 shadow-md'
                    : isPastTier
                    ? 'bg-green-50 border-green-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      isCurrentTier
                        ? 'bg-blue-600 text-white'
                        : isPastTier
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {isPastTier ? '✓' : index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      ${tier.rate}/hour
                    </div>
                    <div className="text-xs text-gray-600">
                      {tier.hours === 0 ? 'Starting rate' : `${tier.hours} hours`}
                    </div>
                  </div>
                </div>
                {isCurrentTier && (
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                    Current
                  </span>
                )}
                {isPastTier && (
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                    Achieved
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Key Information */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <Target className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900 mb-1">
              How It Works
            </p>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Starting rate: ${startingRate}/hour</li>
              <li>• Maximum rate: ${maxRate}/hour</li>
              <li>• Every 5 hours worked = +$5/hour increase</li>
              <li>• You are paid your current hourly rate for each session</li>
              <li>• No percentage splits - fixed hourly compensation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

