'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Clock, Save, AlertCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { therapistAPI } from '@/lib/api'

interface TimeSlot {
    startTime: string
    endTime: string
}

interface DayAvailability {
    day: string
    slots: TimeSlot[]
    isActive: boolean
}

interface AvailabilityManagerProps {
    therapistId: string
    initialAvailability?: any[]
    onUpdate?: () => void
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function AvailabilityManager({ therapistId, initialAvailability, onUpdate }: AvailabilityManagerProps) {
    const [availability, setAvailability] = useState<DayAvailability[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        // Initialize availability with defaults if not present
        const initialized: DayAvailability[] = DAYS.map(day => {
            let daySlots: any[] = [];

            if (initialAvailability) {
                // If it's legacy format (array of {day, slots, isActive}):
                const oldFmt = initialAvailability.find(a => a.day === day && a.slots);
                if (oldFmt) {
                    daySlots = oldFmt.slots || [];
                } else {
                    // New format (flat array of {day, startTime, endTime}):
                    daySlots = initialAvailability
                        .filter(a => a.day === day && a.startTime && a.endTime)
                        .map(a => ({ startTime: a.startTime, endTime: a.endTime }));
                }
            }

            const isActive = daySlots.length > 0;
            return {
                day,
                slots: daySlots,
                isActive
            }
        })
        setAvailability(initialized)
    }, [initialAvailability])

    const handleAddSlot = (dayIndex: number) => {
        const newAvailability = [...availability]
        newAvailability[dayIndex].slots.push({ startTime: '09:00', endTime: '17:00' })
        newAvailability[dayIndex].isActive = true
        setAvailability(newAvailability)
    }

    const handleRemoveSlot = (dayIndex: number, slotIndex: number) => {
        const newAvailability = [...availability]
        newAvailability[dayIndex].slots.splice(slotIndex, 1)
        if (newAvailability[dayIndex].slots.length === 0) {
            newAvailability[dayIndex].isActive = false
        }
        setAvailability(newAvailability)
    }

    const handleTimeChange = (dayIndex: number, slotIndex: number, field: 'startTime' | 'endTime', value: string) => {
        const newAvailability = [...availability]
        newAvailability[dayIndex].slots[slotIndex][field] = value
        setAvailability(newAvailability)
    }

    const toggleDayActive = (dayIndex: number) => {
        setAvailability(prevAvail => {
            const newAvail = [...prevAvail];
            const updatedDay = { ...newAvail[dayIndex] };
            updatedDay.isActive = !updatedDay.isActive;

            if (updatedDay.isActive && (!updatedDay.slots || updatedDay.slots.length === 0)) {
                updatedDay.slots = [{ startTime: '09:00', endTime: '17:00' }];
            }

            newAvail[dayIndex] = updatedDay;
            return newAvail;
        });
    }

    const saveAvailability = async () => {
        setIsLoading(true)
        setMessage(null)
        try {
            // Filter out empty slots or inactive days if needed, but schema supports empty arrays
            // We send the full structure
            // Flatten the availability into the backend's expected schema
            // [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }, ...]
            const validAvailability = availability
                .filter(a => a.isActive && a.slots && a.slots.length > 0)
                .flatMap(a => a.slots.map(slot => ({
                    day: a.day,
                    startTime: slot.startTime,
                    endTime: slot.endTime
                })))

            await therapistAPI.updateAvailability(therapistId, validAvailability)
            setMessage({ type: 'success', text: 'Availability updated successfully' })
            if (onUpdate) onUpdate()
        } catch (error) {
            console.error('Failed to update availability', error)
            setMessage({ type: 'error', text: 'Failed to update availability. Please try again.' })
        } finally {
            setIsLoading(false)
            setTimeout(() => setMessage(null), 3000)
        }
    }

    return (
        <div className="bg-white rounded-2xl premium-shadow p-6">
            {/* Force HMR Trigger - v2 */}
            <div style={{ display: 'none' }}>Availability toggle loaded</div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-black flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        Weekly Availability
                    </h2>
                    <p className="text-sm text-gray-600">Set your available hours for incoming sessions.</p>
                </div>
                <button
                    onClick={saveAvailability}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                </button>
            </div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg mb-6 flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}
                >
                    {message.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 mr-2" />
                    ) : (
                        <AlertCircle className="w-5 h-5 mr-2" />
                    )}
                    {message.text}
                </motion.div>
            )}

            <div className="space-y-4">
                {availability.map((dayData, dayIndex) => (
                    <div key={dayData.day} className={`border rounded-xl p-4 transition-all ${dayData.isActive ? 'border-gray-300 bg-white' : 'border-gray-100 bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                {/* Toggle Switch */}
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={dayData.isActive}
                                    onClick={() => toggleDayActive(dayIndex)}
                                    style={{
                                        width: '44px',
                                        height: '24px',
                                        borderRadius: '12px',
                                        backgroundColor: dayData.isActive ? '#22c55e' : '#d1d5db',
                                        position: 'relative',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s ease',
                                        padding: 0,
                                        flexShrink: 0,
                                    }}
                                >
                                    <span
                                        style={{
                                            display: 'block',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            backgroundColor: '#ffffff',
                                            position: 'absolute',
                                            top: '2px',
                                            left: dayData.isActive ? '22px' : '2px',
                                            transition: 'left 0.3s ease',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                        }}
                                    />
                                </button>
                                <span className={`font-semibold ${dayData.isActive ? 'text-black' : 'text-gray-400'}`}>
                                    {dayData.day}
                                </span>
                            </div>

                            {dayData.isActive && (
                                <button
                                    onClick={() => handleAddSlot(dayIndex)}
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add Slot
                                </button>
                            )}
                        </div>

                        <AnimatePresence>
                            {dayData.isActive && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-3 pl-14"
                                >
                                    {dayData.slots.length === 0 && (
                                        <p className="text-sm text-gray-500 italic">No time slots added. Use &quot;Add Slot&quot; to define hours.</p>
                                    )}
                                    {dayData.slots.map((slot, slotIndex) => (
                                        <motion.div
                                            key={slotIndex}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="flex items-center space-x-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="time"
                                                    value={slot.startTime}
                                                    onChange={(e) => handleTimeChange(dayIndex, slotIndex, 'startTime', e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                                />
                                                <span className="text-gray-400">to</span>
                                                <input
                                                    type="time"
                                                    value={slot.endTime}
                                                    onChange={(e) => handleTimeChange(dayIndex, slotIndex, 'endTime', e.target.value)}
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleRemoveSlot(dayIndex, slotIndex)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                title="Remove slot"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    )
}
