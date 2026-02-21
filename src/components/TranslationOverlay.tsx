'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Languages, X, Volume2, Mic, MicOff } from 'lucide-react'

// In-memory translation cache to avoid repeated API calls
const translationCache = new Map<string, string>()
const MAX_CACHE_SIZE = 200

function getCacheKey(text: string, source: string, target: string): string {
  return `${source}:${target}:${text.toLowerCase().trim()}`
}

/**
 * Translate text using Google Translate free endpoint.
 * Falls back gracefully on errors.
 */
async function translateWithGoogle(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  if (!text || text.trim().length === 0) return text
  if (sourceLanguage === targetLanguage) return text

  // Check cache first
  const cacheKey = getCacheKey(text, sourceLanguage, targetLanguage)
  const cached = translationCache.get(cacheKey)
  if (cached) return cached

  const sl = sourceLanguage === 'auto' ? 'auto' : sourceLanguage
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Google Translate HTTP ${response.status}`)
  }

  const data = await response.json()
  // Google returns [[["translated","original",...], ...], ...]
  const translated = data[0]
    ?.map((segment: any[]) => segment[0])
    .filter(Boolean)
    .join('') || text

  // Store in cache (evict oldest if full)
  if (translationCache.size >= MAX_CACHE_SIZE) {
    const firstKey = translationCache.keys().next().value
    if (firstKey) translationCache.delete(firstKey)
  }
  translationCache.set(cacheKey, translated)

  return translated
}

interface TranslationOverlayProps {
  enabled: boolean
  sourceLanguage: string
  targetLanguage: string
  onClose?: () => void
}

interface TranslationItem {
  original: string
  translated: string
  timestamp: Date
  isInterim?: boolean
}

export default function TranslationOverlay({
  enabled,
  sourceLanguage,
  targetLanguage,
}: TranslationOverlayProps) {
  const [translations, setTranslations] = useState<TranslationItem[]>([])
  const [currentInterim, setCurrentInterim] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)
  const translationsEndRef = useRef<HTMLDivElement>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastFinalTextRef = useRef<string>('')

  useEffect(() => {
    if (enabled && sourceLanguage !== targetLanguage) {
      startSpeechRecognition()
    } else {
      stopSpeechRecognition()
    }

    return () => {
      stopSpeechRecognition()
    }
  }, [enabled, sourceLanguage, targetLanguage])

  useEffect(() => {
    scrollToBottom()
  }, [translations, currentInterim])

  const scrollToBottom = () => {
    translationsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported in this browser')
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = sourceLanguage === 'auto' ? 'en-US' : getLanguageCode(sourceLanguage)

    recognition.onstart = () => {
      setIsListening(true)
      console.log('Speech recognition started')
    }

    recognition.onresult = async (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      // Process all results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      // Show interim results in real-time
      if (interimTranscript.trim()) {
        setCurrentInterim(interimTranscript.trim())
      }

      // Clear silence timer when we get new results
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }

      // Handle final transcript
      if (finalTranscript.trim()) {
        const finalText = finalTranscript.trim()

        // Only process if it's different from the last final text
        if (finalText !== lastFinalTextRef.current) {
          lastFinalTextRef.current = finalText
          setCurrentInterim('') // Clear interim when we get final

          // Translate the final text
          await translateAndDisplay(finalText)
        }
      } else if (interimTranscript.trim()) {
        // If we have interim but no final, set a timer to translate after silence
        // This handles cases where user stops speaking but no final result yet
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }

        silenceTimerRef.current = setTimeout(async () => {
          if (interimTranscript.trim() && interimTranscript.trim() !== lastFinalTextRef.current) {
            const textToTranslate = interimTranscript.trim()
            lastFinalTextRef.current = textToTranslate
            setCurrentInterim('')
            await translateAndDisplay(textToTranslate)
          }
        }, 1500) // Wait 1.5 seconds of silence before translating
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'no-speech') {
        // User stopped speaking, translate any pending interim text
        if (currentInterim.trim() && currentInterim.trim() !== lastFinalTextRef.current) {
          const textToTranslate = currentInterim.trim()
          lastFinalTextRef.current = textToTranslate
          setCurrentInterim('')
          translateAndDisplay(textToTranslate)
        }
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      // Restart recognition if still enabled
      if (enabled && sourceLanguage !== targetLanguage) {
        setTimeout(() => {
          try {
            recognition.start()
          } catch (error) {
            console.error('Failed to restart recognition:', error)
          }
        }, 100)
      }
    }

    try {
      recognition.start()
      recognitionRef.current = recognition
    } catch (error) {
      console.error('Failed to start speech recognition:', error)
    }
  }

  const stopSpeechRecognition = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.error('Error stopping recognition:', error)
      }
      recognitionRef.current = null
    }

    setIsListening(false)
    setCurrentInterim('')
  }

  const translateAndDisplay = async (text: string) => {
    if (!text || text.trim().length === 0) return

    setIsProcessing(true)
    try {
      const translated = await translateWithGoogle(text, sourceLanguage, targetLanguage)

      setTranslations(prev => [
        ...prev.slice(-19), // Keep last 20 translations
        {
          original: text,
          translated,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error('Translation error:', error)
      // Still show the original text even if translation fails
      setTranslations(prev => [
        ...prev.slice(-19),
        {
          original: text,
          translated: '[Translation failed]',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const getLanguageCode = (lang: string): string => {
    const langMap: Record<string, string> = {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      zh: 'zh-CN',
      ja: 'ja-JP',
      ko: 'ko-KR',
      ar: 'ar-SA',
      pt: 'pt-BR',
      ru: 'ru-RU',
      it: 'it-IT',
      hi: 'hi-IN',
      nl: 'nl-NL',
      pl: 'pl-PL',
      tr: 'tr-TR',
      vi: 'vi-VN',
    }
    return langMap[lang] || 'en-US'
  }

  if (!enabled || sourceLanguage === targetLanguage) {
    return null
  }

  return (
    <div className="fixed bottom-20 right-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[500px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-indigo-50">
        <div className="flex items-center space-x-2">
          <Languages className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-900">Speech-to-Text & Translation</span>
        </div>
        <div className="flex items-center space-x-2">
          {isListening && (
            <div className="flex items-center space-x-1">
              <Mic className="w-4 h-4 text-green-600 animate-pulse" />
              <span className="text-xs text-green-600">Listening</span>
            </div>
          )}
          {isProcessing && (
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Translations */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {translations.length === 0 && !currentInterim ? (
          <div className="text-center text-gray-500 text-sm py-8">
            <Volume2 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>Listening for speech...</p>
            <p className="text-xs mt-1">Speak and translations will appear here</p>
          </div>
        ) : (
          <>
            {translations.map((translation, index) => (
              <div key={index} className="space-y-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                {/* Original Speech-to-Text */}
                <div className="space-y-1">
                  <div className="text-xs text-gray-500 font-medium uppercase">Original</div>
                  <div className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                    {translation.original}
                  </div>
                </div>

                {/* Translated Text */}
                <div className="space-y-1">
                  <div className="text-xs text-indigo-600 font-medium uppercase">Translated</div>
                  <div className="text-sm font-medium text-gray-900 bg-indigo-50 p-2 rounded border border-indigo-200">
                    {translation.translated}
                  </div>
                </div>

                <div className="text-xs text-gray-400 pt-1 border-t border-gray-200">
                  {translation.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}

            {/* Current Interim Result (Real-time speech-to-text) */}
            {currentInterim && (
              <div className="space-y-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200 animate-pulse">
                <div className="space-y-1">
                  <div className="text-xs text-yellow-700 font-medium uppercase flex items-center space-x-1">
                    <Mic className="w-3 h-3" />
                    <span>Speaking...</span>
                  </div>
                  <div className="text-sm text-gray-700 bg-white p-2 rounded border border-yellow-200">
                    {currentInterim}
                  </div>
                  <div className="text-xs text-yellow-600 italic">
                    Translation will appear when you stop speaking
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={translationsEndRef} />
      </div>

      {/* Footer with status */}
      <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600 text-center">
        {isListening ? (
          <span className="text-green-600">● Listening</span>
        ) : (
          <span className="text-gray-400">Not listening</span>
        )}
        {' • '}
        {sourceLanguage !== 'auto' ? getLanguageCode(sourceLanguage).split('-')[0].toUpperCase() : 'Auto'} → {getLanguageCode(targetLanguage).split('-')[0].toUpperCase()}
      </div>
    </div>
  )
}
