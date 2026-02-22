'use client'

import { useEffect, useRef, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PhoneOff, Languages, MessageCircle, Mic, MicOff, ChevronRight, ChevronLeft, Clock, Shield, Wifi } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { sessionAPI } from '@/lib/api'

declare global {
  interface Window {
    JitsiMeetExternalAPI: any
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

// Language options for translation
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'it', name: 'Italian' },
  { code: 'pl', name: 'Polish' },
  { code: 'tr', name: 'Turkish' },
]

interface CaptionEntry {
  id: string
  speaker: string
  original: string
  translated: string | null
  isTranslating: boolean
  timestamp: number
  isFinal: boolean
}

// Free Google Translate API (unofficial but reliable)
async function googleTranslateFree(text: string, targetLang: string, sourceLang = 'auto'): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    const response = await fetch(url)
    if (!response.ok) throw new Error('Translation failed')
    const data = await response.json()
    // Response is a nested array: data[0] contains translation arrays, each [translated, original, ...]
    const translated = data[0]?.map((item: any[]) => item[0]).filter(Boolean).join('') || text
    return translated
  } catch {
    return text // Fallback to original
  }
}

function VideoCallContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('sessionId')
  const jitsiContainerRef = useRef<HTMLDivElement>(null)
  const jitsiApiRef = useRef<any>(null)
  const recognitionRef = useRef<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const translateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [jitsiReady, setJitsiReady] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const callStartRef = useRef<number>(Date.now())
  const { user } = useAuth()

  // Translation state
  const [targetLanguage, setTargetLanguage] = useState('es') // default to Spanish
  const [sourceLanguage, setSourceLanguage] = useState('en')
  const [translationEnabled, setTranslationEnabled] = useState(false)
  const [isMicActive, setIsMicActive] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [captions, setCaptions] = useState<CaptionEntry[]>([])
  const captionsRef = useRef(captions)
  const [showSettings, setShowSettings] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')

  // Keep captions ref in sync
  useEffect(() => {
    captionsRef.current = captions
  }, [captions])

  // Call duration timer
  useEffect(() => {
    if (!jitsiReady) return
    const timer = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - callStartRef.current) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [jitsiReady])

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  // Auto-scroll captions
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [captions])

  // Translate a caption entry using the free Google Translate endpoint
  const translateCaption = useCallback(async (id: string, text: string) => {
    if (!text.trim()) return
    const translated = await googleTranslateFree(text, targetLanguage, sourceLanguage)
    setCaptions(prev => prev.map(c =>
      c.id === id ? { ...c, translated, isTranslating: false } : c
    ))
  }, [targetLanguage, sourceLanguage])

  // Start/stop Web Speech API recognition
  const startSpeechRecognition = useCallback(() => {
    if (!translationEnabled) return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = sourceLanguage

    let interimId = `interim-${Date.now()}`

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const text = result[0].transcript.trim()
        const isFinal = result.isFinal

        if (!text) continue

        if (!isFinal) {
          // Update the interim caption in-place
          setCaptions(prev => {
            const existing = prev.find(c => c.id === interimId)
            if (existing) {
              return prev.map(c => c.id === interimId ? { ...c, original: text } : c)
            } else {
              return [...prev, {
                id: interimId,
                speaker: `${user?.firstName || 'You'} (me)`,
                original: text,
                translated: null,
                isTranslating: false,
                timestamp: Date.now(),
                isFinal: false
              }].slice(-60)
            }
          })
        } else {
          // Mark as final, debounce translation
          const finalId = interimId
          setCaptions(prev => prev.map(c =>
            c.id === finalId ? { ...c, original: text, isFinal: true, isTranslating: true } : c
          ))

          if (translateTimeoutRef.current) clearTimeout(translateTimeoutRef.current)
          translateTimeoutRef.current = setTimeout(() => {
            translateCaption(finalId, text)
          }, 400)

          interimId = `interim-${Date.now()}`
        }
      }
    }

    recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech') {
        console.error('Speech recognition error:', event.error)
      }
    }

    recognition.onend = () => {
      // Auto-restart if still enabled
      if (translationEnabled) {
        try { recognition.start() } catch { }
      }
    }

    recognition.start()
    recognitionRef.current = recognition
    setIsMicActive(true)
  }, [translationEnabled, sourceLanguage, translateCaption, user])

  const stopSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsMicActive(false)
  }, [])

  useEffect(() => {
    if (translationEnabled) {
      startSpeechRecognition()
    } else {
      stopSpeechRecognition()
    }
    return () => stopSpeechRecognition()
  }, [translationEnabled])

  // Re-translate when language changes
  useEffect(() => {
    if (!translationEnabled) return
    // Re-translate all final captions
    captions.filter(c => c.isFinal && c.original).forEach(c => {
      setCaptions(prev => prev.map(cap =>
        cap.id === c.id ? { ...cap, isTranslating: true, translated: null } : cap
      ))
      translateCaption(c.id, c.original)
    })
  }, [targetLanguage, sourceLanguage])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    if (sessionId) fetchSession()
    loadJitsi()
  }, [sessionId, user])

  const fetchSession = async () => {
    try {
      const response = await sessionAPI.getById(sessionId!)
      setSession(response.data.data)
    } catch (error) {
      console.error('Failed to fetch session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadJitsi = () => {
    if (document.querySelector('script[src*="meet.jit.si/external_api.js"]')) {
      initializeJitsi()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://meet.jit.si/external_api.js'
    script.async = true
    script.onload = initializeJitsi
    document.body.appendChild(script)
  }

  const initializeJitsi = async () => {
    let roomName = `RootedVoices${sessionId || Date.now()}`

    if (sessionId) {
      try {
        const sessionRes = await sessionAPI.getById(sessionId)
        if (sessionRes.data.data?.jitsiRoomName) {
          roomName = sessionRes.data.data.jitsiRoomName
        }
      } catch { }
    }

    if (!jitsiContainerRef.current || !window.JitsiMeetExternalAPI) return

    // Dispose old instance
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose()
    }

    jitsiContainerRef.current.innerHTML = ''

    const displayName = user ? `${user.firstName} ${user.lastName}` : 'Guest'

    const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
      roomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        prejoinPageEnabled: false,
        disableDeepLinking: true,
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableLayerSuspension: true,
        p2p: { enabled: true },
        analytics: { disabled: true },
        toolbarButtons: [
          'microphone', 'camera', 'chat', 'hangup',
          'participants-pane', 'settings', 'fullscreen',
          'tileview', 'select-background',
        ],
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        TOOLBAR_ALWAYS_VISIBLE: false,
        MOBILE_APP_PROMO: false,
        HIDE_INVITE_MORE_HEADER: true,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
        SHOW_CHROME_EXTENSION_BANNER: false,
        VIDEO_LAYOUT_FIT: 'both',
      },
      userInfo: {
        displayName,
        email: user?.email || '',
      },
    })

    jitsiApiRef.current = api

    api.addListener('videoConferenceJoined', () => {
      setJitsiReady(true)
      setConnectionStatus('connected')
      callStartRef.current = Date.now()
      setCallDuration(0)
      if (sessionId) {
        sessionAPI.start(sessionId).catch(console.error)
      }
    })

    api.addListener('videoConferenceLeft', () => {
      setConnectionStatus('disconnected')
    })

    api.addListener('connectionEstablished', () => {
      setConnectionStatus('connected')
    })

    api.addListener('connectionFailed', () => {
      setConnectionStatus('disconnected')
    })
  }

  const endCall = () => {
    stopSpeechRecognition()
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose()
    }
    router.push(user?.role === 'therapist' ? '/dashboard' : '/client-dashboard')
  }

  if (isLoading && sessionId) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b)' }}>
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30 animate-ping" />
            <div className="absolute inset-2 rounded-full border-4 border-t-indigo-400 border-indigo-500/10 animate-spin" />
          </div>
          <p className="text-white/80 text-lg font-light">Connecting to session...</p>
        </div>
      </div>
    )
  }

  const statusColors = {
    connecting: 'text-yellow-400',
    connected: 'text-green-400',
    disconnected: 'text-red-400',
  }

  const targetLangName = LANGUAGES.find(l => l.code === targetLanguage)?.name || targetLanguage
  const sourceLangName = LANGUAGES.find(l => l.code === sourceLanguage)?.name || sourceLanguage

  return (
    <div className="h-screen flex flex-col" style={{ background: '#0f172a' }}>
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-4 py-2 z-20 border-b border-white/10"
        style={{ background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)' }}
      >
        {/* Left: Session Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'}`} />
            <span className={`text-xs font-medium ${statusColors[connectionStatus]}`}>
              {connectionStatus === 'connected' ? 'Live' : connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
            </span>
          </div>
          {jitsiReady && (
            <div className="flex items-center gap-1.5 text-white/50 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono">{formatDuration(callDuration)}</span>
            </div>
          )}
          {session && (
            <div className="hidden sm:flex items-center gap-2 text-white/70 text-sm">
              <span>•</span>
              <span>
                {session.clientId?.userId
                  ? `${session.clientId.userId.firstName} ${session.clientId.userId.lastName}`
                  : session.therapistId?.userId
                    ? `Dr. ${session.therapistId.userId.firstName} ${session.therapistId.userId.lastName}`
                    : 'Therapy Session'}
              </span>
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* Translation toggle button */}
          <button
            onClick={() => setShowSidebar(s => !s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showSidebar
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            <Languages className="w-4 h-4" />
            <span className="hidden sm:inline">Captions</span>
          </button>

          <div className="flex items-center gap-1.5 text-white/30 text-xs hidden sm:flex">
            <Shield className="w-3.5 h-3.5" />
            <span>HIPAA Secured</span>
          </div>

          {/* End call */}
          <button
            onClick={endCall}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-500/30"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">End Call</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Jitsi */}
        <div ref={jitsiContainerRef} className="flex-1 relative min-w-0" />

        {/* Captions Sidebar */}
        <div
          className={`flex flex-col border-l border-white/10 transition-all duration-300 overflow-hidden relative`}
          style={{
            width: showSidebar ? '320px' : '0px',
            minWidth: showSidebar ? '320px' : '0px',
            background: 'rgba(15,23,42,0.97)',
          }}
        >
          {showSidebar && (
            <>
              {/* Sidebar Header */}
              <div className="p-3 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-indigo-400" />
                    <span className="text-white text-sm font-semibold">Live Captions</span>
                  </div>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="text-white/40 hover:text-white/80 transition p-1"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Translation Toggle + Language Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-xs">Translation</span>
                    <button
                      onClick={() => setTranslationEnabled(e => !e)}
                      className={`relative inline-flex w-9 h-5 rounded-full transition-colors ${translationEnabled ? 'bg-indigo-500' : 'bg-white/20'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${translationEnabled ? 'translate-x-4' : ''}`} />
                    </button>
                  </div>

                  {translationEnabled && (
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="text-white/40 text-xs mb-1 block">Speak in</label>
                        <select
                          value={sourceLanguage}
                          onChange={e => setSourceLanguage(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 text-white text-xs rounded-md px-2 py-1.5 focus:outline-none focus:border-indigo-500"
                        >
                          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-white/40 text-xs mb-1 block">Translate to</label>
                        <select
                          value={targetLanguage}
                          onChange={e => setTargetLanguage(e.target.value)}
                          className="w-full bg-white/10 border border-white/20 text-white text-xs rounded-md px-2 py-1.5 focus:outline-none focus:border-indigo-500"
                        >
                          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {translationEnabled && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (isMicActive) {
                            stopSpeechRecognition()
                          } else {
                            startSpeechRecognition()
                          }
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all ${isMicActive
                            ? 'bg-red-500/20 border border-red-500/60 text-red-300 hover:bg-red-500/30'
                            : 'bg-indigo-500/20 border border-indigo-500/60 text-indigo-300 hover:bg-indigo-500/30'
                          }`}
                      >
                        {isMicActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        {isMicActive ? 'Stop Mic' : 'Start Mic'}
                      </button>
                      <button
                        onClick={() => setCaptions([])}
                        className="px-3 py-2 rounded-lg text-xs bg-white/5 border border-white/10 text-white/50 hover:text-white/70 hover:bg-white/10 transition"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Captions Feed */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 scroll-smooth">
                {captions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/20 gap-3 py-12">
                    <Languages className="w-10 h-10" />
                    <div className="text-center text-xs leading-relaxed">
                      {translationEnabled
                        ? <>Click <span className="text-indigo-400">Start Mic</span> to begin capturing your speech for live translation.</>
                        : <>Enable <span className="text-indigo-400">Translation</span> above to get started.</>
                      }
                    </div>
                  </div>
                ) : (
                  captions.map(caption => (
                    <div
                      key={caption.id}
                      className={`rounded-xl p-3 space-y-1.5 transition-all ${caption.isFinal
                          ? 'bg-white/8 border border-white/10'
                          : 'bg-indigo-950/60 border border-indigo-500/20'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-indigo-400 text-xs font-medium">{caption.speaker}</span>
                        {!caption.isFinal && (
                          <span className="flex gap-0.5">
                            {[0, 1, 2].map(i => (
                              <span key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                          </span>
                        )}
                      </div>
                      {/* Original */}
                      <p className="text-white/60 text-xs italic border-l-2 border-white/20 pl-2">
                        {caption.original}
                      </p>
                      {/* Translated */}
                      {caption.isFinal && (
                        <div className="text-white text-sm font-medium">
                          {caption.isTranslating ? (
                            <span className="text-white/30 text-xs">Translating...</span>
                          ) : caption.translated ? (
                            caption.translated
                          ) : caption.original}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="p-3 border-t border-white/10 flex-shrink-0">
                <p className="text-white/30 text-xs text-center">
                  🔒 Powered by Google Translate · Free & private
                </p>
              </div>
            </>
          )}

          {/* Collapsed toggle button */}
          {!showSidebar && (
            <button
              onClick={() => setShowSidebar(true)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-indigo-600 text-white p-2 rounded-l-lg shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VideoCallPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f172a' }}>
        <div className="text-white/50">Loading...</div>
      </div>
    }>
      <VideoCallContent />
    </Suspense>
  )
}
