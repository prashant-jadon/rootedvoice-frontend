'use client'

import { useState, useEffect, useRef } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageSwitcher({ variant = 'default' }: { variant?: 'default' | 'compact' | 'minimal' }) {
  const { currentLanguage, languages, changeLanguage, isLoading } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const currentLanguageName = languages.find(l => l.code === currentLanguage)?.name || 'English'

  const handleLanguageChange = async (languageCode: string) => {
    await changeLanguage(languageCode)
    setIsOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2">
        <Globe className="w-4 h-4 text-gray-600 animate-pulse" />
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1 px-2 py-1 text-sm hover:bg-white/10 rounded transition-colors"
          aria-label="Change language"
        >
          <Globe className="w-4 h-4" />
          <span className="text-xs font-medium">{currentLanguage.toUpperCase()}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
            <div className="p-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left ${
                    currentLanguage === language.code ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">{language.name}</span>
                    <span className="text-xs text-gray-500">({language.code.toUpperCase()})</span>
                  </div>
                  {currentLanguage === language.code && (
                    <Check className="w-4 h-4 text-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
          style={{
            color: 'rgba(255,255,255,0.9)',
          }}
          aria-label="Change language"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">{currentLanguageName}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Select Language
              </div>
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left ${
                    currentLanguage === language.code ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">{language.name}</span>
                    <span className="text-xs text-gray-500">({language.code.toUpperCase()})</span>
                  </div>
                  {currentLanguage === language.code && (
                    <Check className="w-4 h-4 text-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{currentLanguageName}</span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-96 overflow-y-auto">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                Select Language
              </div>
              <div className="mt-1">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left ${
                      currentLanguage === language.code ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">{language.name}</span>
                      <span className="text-xs text-gray-500">({language.code.toUpperCase()})</span>
                    </div>
                    {currentLanguage === language.code && (
                      <Check className="w-4 h-4 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
