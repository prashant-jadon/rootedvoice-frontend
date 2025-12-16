'use client'

import { useState, useEffect } from 'react'
import { Bell, Mail, MessageSquare, Smartphone, Save, Loader2 } from 'lucide-react'
import { clientAPI } from '@/lib/api'

interface ReminderPreferencesProps {
  clientId: string
  currentPreferences?: any
  onUpdate?: () => void
}

export default function ReminderPreferences({
  clientId,
  currentPreferences,
  onUpdate,
}: ReminderPreferencesProps) {
  const [preferences, setPreferences] = useState({
    enabled: currentPreferences?.enabled ?? true,
    email24h: currentPreferences?.email24h ?? true,
    email45m: currentPreferences?.email45m ?? true,
    sms24h: currentPreferences?.sms24h ?? false,
    sms45m: currentPreferences?.sms45m ?? true,
    push24h: currentPreferences?.push24h ?? true,
    push45m: currentPreferences?.push45m ?? true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [pushSupported, setPushSupported] = useState(false)
  const [pushSubscribed, setPushSubscribed] = useState(false)

  useEffect(() => {
    // Check if browser supports push notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setPushSupported(true)
      checkPushSubscription()
    }
  }, [])

  const checkPushSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setPushSubscribed(!!subscription)
    } catch (error) {
      console.error('Error checking push subscription:', error)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      // Get current client profile
      const clientRes = await clientAPI.getMyProfile()
      const clientData = clientRes.data.data
      
      // Update preferences
      await clientAPI.createOrUpdate({
        ...clientData,
        preferences: {
          ...clientData.preferences,
          sessionReminders: preferences,
        },
      })

      alert('Reminder preferences saved successfully!')
      onUpdate?.()
    } catch (error: any) {
      console.error('Failed to save preferences:', error)
      alert('Failed to save preferences: ' + (error.response?.data?.message || 'Unknown error'))
    } finally {
      setIsSaving(false)
    }
  }

  const handlePushSubscribe = async () => {
    try {
      if (!pushSupported) {
        alert('Push notifications are not supported in your browser')
        return
      }

      const registration = await navigator.serviceWorker.ready
      
      // Request notification permission
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        alert('Notification permission denied')
        return
      }

      // Get VAPID public key from backend
      const { pushAPI } = await import('@/lib/api')
      const response = await pushAPI.getVapidPublicKey()
      const publicKey = response.data.publicKey

      // Convert VAPID key
      const applicationServerKey = urlBase64ToUint8Array(publicKey)

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      })

      // Send subscription to backend
      await pushAPI.subscribe(subscription)

      setPushSubscribed(true)
      alert('Push notifications enabled!')
    } catch (error) {
      console.error('Error subscribing to push:', error)
      alert('Failed to enable push notifications')
    }
  }

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  return (
    <div className="bg-white rounded-2xl premium-shadow p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Bell className="w-6 h-6 text-black" />
        <h2 className="text-xl font-bold text-black">Session Reminder Preferences</h2>
      </div>

      {/* Enable/Disable All */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={preferences.enabled}
            onChange={(e) => setPreferences({ ...preferences, enabled: e.target.checked })}
            className="w-5 h-5 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
          />
          <span className="font-semibold text-black">Enable Session Reminders</span>
        </label>
        <p className="text-sm text-gray-600 mt-2 ml-8">
          When enabled, you'll receive reminders before your therapy sessions
        </p>
      </div>

      {preferences.enabled && (
        <div className="space-y-6">
          {/* 24-Hour Reminder */}
          <div>
            <h3 className="font-semibold text-black mb-4">24-Hour Reminder</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.email24h}
                  onChange={(e) => setPreferences({ ...preferences, email24h: e.target.checked })}
                  className="w-5 h-5 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
                />
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">Email notification</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.sms24h}
                  onChange={(e) => setPreferences({ ...preferences, sms24h: e.target.checked })}
                  className="w-5 h-5 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
                />
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">SMS notification</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.push24h}
                  onChange={(e) => setPreferences({ ...preferences, push24h: e.target.checked })}
                  disabled={!pushSupported}
                  className="w-5 h-5 text-black border-gray-300 rounded focus:ring-2 focus:ring-black disabled:opacity-50"
                />
                <Smartphone className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">Push notification</span>
                {!pushSupported && (
                  <span className="text-xs text-gray-500">(Not supported in your browser)</span>
                )}
              </label>
            </div>
          </div>

          {/* 45-Minute Reminder */}
          <div>
            <h3 className="font-semibold text-black mb-4">45-Minute Reminder</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.email45m}
                  onChange={(e) => setPreferences({ ...preferences, email45m: e.target.checked })}
                  className="w-5 h-5 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
                />
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">Email notification</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.sms45m}
                  onChange={(e) => setPreferences({ ...preferences, sms45m: e.target.checked })}
                  className="w-5 h-5 text-black border-gray-300 rounded focus:ring-2 focus:ring-black"
                />
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">SMS notification</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.push45m}
                  onChange={(e) => setPreferences({ ...preferences, push45m: e.target.checked })}
                  disabled={!pushSupported}
                  className="w-5 h-5 text-black border-gray-300 rounded focus:ring-2 focus:ring-black disabled:opacity-50"
                />
                <Smartphone className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">Push notification</span>
                {!pushSupported && (
                  <span className="text-xs text-gray-500">(Not supported in your browser)</span>
                )}
              </label>
            </div>
          </div>

          {/* Push Notification Setup */}
          {pushSupported && !pushSubscribed && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                Enable push notifications to receive reminders even when the app is closed.
              </p>
              <button
                onClick={handlePushSubscribe}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Enable Push Notifications
              </button>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

