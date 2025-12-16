'use client'

import { useState, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { translationAPI } from '@/lib/api'

interface Language {
  code: string
  name: string
}

interface LanguageSelectorProps {
  currentLanguage: string
  onLanguageChange: (language: string) => void
  showInterfaceLanguage?: boolean
  showTranslationToggle?: boolean
  onTranslationToggle?: (enabled: boolean) => void
  translationEnabled?: boolean
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  showInterfaceLanguage = false,
  showTranslationToggle = false,
  onTranslationToggle,
  translationEnabled = false,
}: LanguageSelectorProps) {
  const [languages, setLanguages] = useState<Language[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLanguages()
  }, [])

  const fetchLanguages = async () => {
    try {
      const response = await translationAPI.getLanguages()
      setLanguages(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch languages:', error)
      // Fallback languages
      setLanguages([
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'zh', name: 'Chinese' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'ar', name: 'Arabic' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'hi', name: 'Hindi' },
        { code: 'asl', name: 'American Sign Language' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const currentLanguageName = languages.find(l => l.code === currentLanguage)?.name || 'English'

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        {showTranslationToggle && (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={translationEnabled}
              onChange={(e) => onTranslationToggle?.(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Enable Translation</span>
          </label>
        )}
        
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Globe className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{currentLanguageName}</span>
          </button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-64 overflow-y-auto">
                <div className="p-2">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        onLanguageChange(language.code)
                        setIsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                        currentLanguage === language.code ? 'bg-indigo-50' : ''
                      }`}
                    >
                      <span className="text-sm text-gray-700">{language.name}</span>
                      {currentLanguage === language.code && (
                        <Check className="w-4 h-4 text-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

