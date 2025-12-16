'use client'

import { useState, useEffect } from 'react'
import { Calendar, CheckCircle, X, ExternalLink, Download } from 'lucide-react'
import { calendarAPI } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

interface CalendarSyncProps {
  sessionId?: string
  sessionData?: {
    scheduledDate: string
    scheduledTime: string
    duration: number
    sessionType: string
    meetingLink?: string
  }
}

export default function CalendarSync({ sessionId, sessionData }: CalendarSyncProps) {
  const { user, isAuthenticated } = useAuth()
  const [calendarStatus, setCalendarStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [eventUrls, setEventUrls] = useState<any>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchCalendarStatus()
      if (sessionId) {
        fetchEventUrls()
      }
    }
  }, [isAuthenticated, sessionId])

  const fetchCalendarStatus = async () => {
    try {
      const response = await calendarAPI.getStatus()
      setCalendarStatus(response.data.data)
    } catch (error) {
      console.error('Failed to fetch calendar status:', error)
    }
  }

  const fetchEventUrls = async () => {
    if (!sessionId) return
    try {
      const response = await calendarAPI.getEventUrl(sessionId)
      setEventUrls(response.data.data)
    } catch (error) {
      console.error('Failed to fetch event URLs:', error)
    }
  }

  const handleConnectGoogle = () => {
    // In production, redirect to Google OAuth
    // For now, show instructions
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'
    const redirectUri = `${window.location.origin}/calendar/callback/google`
    const scope = 'https://www.googleapis.com/auth/calendar.events'
    const responseType = 'code'
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`
    
    window.location.href = authUrl
  }

  const handleConnectOutlook = () => {
    // In production, redirect to Microsoft OAuth
    const clientId = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || 'YOUR_MICROSOFT_CLIENT_ID'
    const redirectUri = `${window.location.origin}/calendar/callback/outlook`
    const scope = 'https://graph.microsoft.com/Calendars.ReadWrite'
    const responseType = 'code'
    
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=${encodeURIComponent(scope)}`
    
    window.location.href = authUrl
  }

  const handleDisconnect = async () => {
    try {
      setIsLoading(true)
      await calendarAPI.disconnect()
      await fetchCalendarStatus()
    } catch (error) {
      console.error('Failed to disconnect calendar:', error)
      alert('Failed to disconnect calendar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSyncSession = async () => {
    if (!sessionId) return
    try {
      setIsLoading(true)
      await calendarAPI.syncSession(sessionId)
      alert('Session synced to calendar successfully!')
    } catch (error: any) {
      console.error('Failed to sync session:', error)
      alert(error.response?.data?.message || 'Failed to sync session to calendar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadICS = () => {
    if (!eventUrls?.appleCalendarIcs) return
    
    const blob = new Blob([eventUrls.appleCalendarIcs], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `therapy-session-${sessionId || 'event'}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-black">Calendar Integration</h3>
        </div>
        {calendarStatus?.syncEnabled && (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            {calendarStatus.provider === 'google' ? 'Google' : calendarStatus.provider === 'outlook' ? 'Outlook' : 'Connected'}
          </span>
        )}
      </div>

      {!calendarStatus?.syncEnabled ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Connect your calendar to automatically sync therapy sessions
          </p>
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleConnectGoogle}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Connect Google Calendar</span>
            </button>
            <button
              onClick={handleConnectOutlook}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Connect Outlook Calendar</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Connected to {calendarStatus.provider === 'google' ? 'Google' : 'Outlook'} Calendar
            </p>
            <button
              onClick={handleDisconnect}
              disabled={isLoading}
              className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              Disconnect
            </button>
          </div>

          {sessionId && (
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <button
                onClick={handleSyncSession}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
              >
                <Calendar className="w-4 h-4" />
                <span>{isLoading ? 'Syncing...' : 'Sync This Session'}</span>
              </button>

              {eventUrls && (
                <div className="flex flex-wrap gap-2">
                  <a
                    href={eventUrls.googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Add to Google</span>
                  </a>
                  <a
                    href={eventUrls.outlookCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Add to Outlook</span>
                  </a>
                  <button
                    onClick={handleDownloadICS}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download .ics</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

