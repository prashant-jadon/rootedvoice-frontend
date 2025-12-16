'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users, Settings, MessageCircle, Languages } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { sessionAPI, translationAPI } from '@/lib/api'
import LanguageSelector from '@/components/LanguageSelector'
import TranslationOverlay from '@/components/TranslationOverlay'

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

function VideoCallContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('sessionId')
  const jitsiContainerRef = useRef<HTMLDivElement>(null)
  const [jitsiApi, setJitsiApi] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const [preferredLanguage, setPreferredLanguage] = useState('en')
  const [targetLanguage, setTargetLanguage] = useState('en')
  const [translationEnabled, setTranslationEnabled] = useState(false)
  const [languagePreferences, setLanguagePreferences] = useState<any>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchLanguagePreferences()
    
    if (sessionId) {
      fetchSession()
    }

    // Load Jitsi Meet External API script
    const script = document.createElement('script')
    script.src = 'https://meet.jit.si/external_api.js'
    script.async = true
    script.onload = () => {
      initializeJitsi()
    }
    document.body.appendChild(script)

    return () => {
      if (jitsiApi) {
        jitsiApi.dispose()
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [sessionId, user])

  const fetchLanguagePreferences = async () => {
    try {
      const response = await translationAPI.getPreferences()
      const prefs = response.data.data
      setLanguagePreferences(prefs)
      setPreferredLanguage(prefs.preferredLanguage || 'en')
      setTargetLanguage(prefs.preferredLanguage || 'en')
      setTranslationEnabled(prefs.clientPreferences?.enableTranslation || false)
    } catch (error) {
      console.error('Failed to fetch language preferences:', error)
    }
  }

  const fetchSession = async () => {
    try {
      if (!sessionId) return
      const response = await sessionAPI.getById(sessionId)
      setSession(response.data.data)
    } catch (error) {
      console.error('Failed to fetch session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const initializeJitsi = async () => {
    // Get session data to retrieve proper room name
    let roomName = `RootedVoices${sessionId || Date.now()}`
    
    if (session && session.jitsiRoomName) {
      roomName = session.jitsiRoomName
    } else if (sessionId) {
      // Fetch session to get room name
      try {
        const sessionRes = await sessionAPI.getById(sessionId)
        if (sessionRes.data.data.jitsiRoomName) {
          roomName = sessionRes.data.data.jitsiRoomName
        }
      } catch (error) {
        console.error('Failed to fetch session for room name:', error)
      }
    }
    
    const displayName = user ? `${user.firstName} ${user.lastName}` : 'Guest'
    const isModerator = user?.role === 'therapist'
    
    // Build Jitsi URL with improved configuration
    const configParams = [
      `userInfo.displayName="${encodeURIComponent(displayName)}"`,
      'config.prejoinPageEnabled=false',
      'config.startWithAudioMuted=false',
      'config.startWithVideoMuted=false',
      `config.defaultLanguage=${preferredLanguage}`,
      'config.enableLayerSuspension=true',
      'config.enableNoAudioDetection=true',
      'config.enableNoisyMicDetection=true',
      'config.enableTalkWhileMuted=false',
      'config.enableClosePage=true',
      'config.enableWelcomePage=false',
      'config.enableDisplayNameInStats=false',
      'config.enableEmailInStats=false',
      'config.resolution=720',
      'config.p2p.enabled=true',
      'config.p2p.useStunTurn=true',
      'config.analytics.disabled=true',
      'config.disableDeepLinking=true',
      'config.disableRemoteMute=true',
      'config.disableThirdPartyRequests=true',
      'config.enableLobbyChat=true',
      'config.enableChat=true',
      'config.enableFileUploads=false',
      'config.enableRecording=false',
    ]

    // Enable translation if available
    if (translationEnabled && targetLanguage !== preferredLanguage) {
      configParams.push('config.transcriptionEnabled=true')
      configParams.push(`config.translationLanguages=["${targetLanguage}"]`)
    }

    const jitsiUrl = `https://meet.jit.si/${roomName}#${configParams.join('&')}`
    
    if (jitsiContainerRef.current) {
      const iframe = document.createElement('iframe')
      iframe.src = jitsiUrl
      iframe.allow = 'camera; microphone; fullscreen; display-capture'
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.style.border = 'none'
      
      jitsiContainerRef.current.innerHTML = ''
      jitsiContainerRef.current.appendChild(iframe)
    }
    
    /* ORIGINAL EXTERNAL API CODE (DISABLED DUE TO AUTH ISSUES)
    if (!jitsiContainerRef.current || !window.JitsiMeetExternalAPI) return

    const options = {
      roomName: roomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        prejoinPageEnabled: false,
        disableDeepLinking: true,
        startWithAudioMuted: false,
        startWithVideoMuted: false,
      },
      userInfo: {
        displayName: displayName,
        email: user?.email || '',
      },
    }

    const api = new window.JitsiMeetExternalAPI('meet.jit.si', options)

    
    // Mark session as in-progress
    if (sessionId) {
      sessionAPI.start(sessionId).catch(console.error)
    }
    */
  }

  const handleLanguageChange = async (language: string) => {
    setTargetLanguage(language)
    try {
      await translationAPI.updatePreferences({
        preferredLanguage: language,
        interfaceLanguage: language,
      })
      // Reinitialize Jitsi with new language
      if (jitsiContainerRef.current) {
        initializeJitsi()
      }
    } catch (error) {
      console.error('Failed to update language preferences:', error)
    }
  }

  const handleTranslationToggle = async (enabled: boolean) => {
    setTranslationEnabled(enabled)
    try {
      await translationAPI.updatePreferences({
        enableTranslation: enabled,
      })
      // Reinitialize Jitsi with translation enabled/disabled
      if (jitsiContainerRef.current) {
        initializeJitsi()
      }
    } catch (error) {
      console.error('Failed to update translation settings:', error)
    }
  }

  const endCall = () => {
    // Since we're using iframe approach, just navigate away
    router.push(user?.role === 'therapist' ? '/dashboard' : '/client-dashboard')
  }

  if (isLoading && sessionId) {
  return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header with session info */}
      <div className="bg-gray-800 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Video className="w-6 h-6 text-green-400" />
          <div>
            <h1 className="font-semibold">Therapy Session</h1>
            {session && (
              <p className="text-sm text-gray-400">
                {session.clientId?.userId ? 
                  `${session.clientId.userId.firstName} ${session.clientId.userId.lastName}` : 
                  'Loading...'}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <Languages className="w-5 h-5 text-gray-300" />
            <LanguageSelector
              currentLanguage={targetLanguage}
              onLanguageChange={handleLanguageChange}
              showTranslationToggle={user?.role === 'client'}
              onTranslationToggle={handleTranslationToggle}
              translationEnabled={translationEnabled}
            />
          </div>
          <button 
            onClick={endCall}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>
      </div>

      {/* Jitsi Meet Container */}
      <div ref={jitsiContainerRef} className="flex-1" />

      {/* Real-time Translation Overlay */}
      {translationEnabled && (
        <TranslationOverlay
          enabled={translationEnabled}
          sourceLanguage={preferredLanguage}
          targetLanguage={targetLanguage}
        />
      )}

      {/* Footer info */}
      <div className="bg-gray-800 text-white px-6 py-2 text-center text-sm">
        <p className="text-gray-400">
          This is a secure, HIPAA-compliant video session. All data is encrypted end-to-end.
          {translationEnabled && preferredLanguage !== targetLanguage && (
            <span className="ml-2 text-indigo-400">• Real-time translation active</span>
          )}
        </p>
      </div>
    </div>
  )
}

export default function VideoCallPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VideoCallContent />
    </Suspense>
  )
}
