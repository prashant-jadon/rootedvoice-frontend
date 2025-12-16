'use client'

import { useState } from 'react'
import { X, Play, Calendar, Video } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [activeTab, setActiveTab] = useState<'watch' | 'schedule'>('watch')
  const [scheduleForm, setScheduleForm] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    type: 'platform' as 'platform' | 'therapist' | 'client',
  })

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would send to backend
    alert(`Demo scheduled! We'll send a confirmation to ${scheduleForm.email}`)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">Demo Access</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('watch')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                  activeTab === 'watch'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                <Video className="w-5 h-5 inline mr-2" />
                Watch Demo
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                  activeTab === 'schedule'
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                <Calendar className="w-5 h-5 inline mr-2" />
                Schedule Demo
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'watch' && (
                <div className="space-y-6">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Demo Video Coming Soon</p>
                      <p className="text-sm text-gray-500">
                        In the meantime, explore our platform with demo access
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                      href="/dashboard"
                      className="p-6 border-2 border-gray-200 rounded-lg hover:border-black transition-colors text-center"
                    >
                      <h3 className="font-semibold text-black mb-2">Therapist Demo</h3>
                      <p className="text-sm text-gray-600">
                        Explore therapist dashboard and features
                      </p>
                    </a>
                    <a
                      href="/client-dashboard"
                      className="p-6 border-2 border-gray-200 rounded-lg hover:border-black transition-colors text-center"
                    >
                      <h3 className="font-semibold text-black mb-2">Client Demo</h3>
                      <p className="text-sm text-gray-600">
                        See the client experience
                      </p>
                    </a>
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <form onSubmit={handleScheduleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={scheduleForm.name}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={scheduleForm.email}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Demo Type
                    </label>
                    <select
                      value={scheduleForm.type}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, type: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="platform">Platform Overview</option>
                      <option value="therapist">Therapist Features</option>
                      <option value="client">Client Experience</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        value={scheduleForm.date}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time
                      </label>
                      <input
                        type="time"
                        required
                        value={scheduleForm.time}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Schedule Demo
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

