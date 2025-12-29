'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { translationAPI } from '@/lib/api'
import { useLanguage } from '@/contexts/LanguageContext'

type Translations = Record<string, string>

interface TranslationContextType {
  t: (key: string) => string
  isLoading: boolean
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: ReactNode }) {
  const { currentLanguage } = useLanguage()
  const [translations, setTranslations] = useState<Translations>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true)
      try {
        const res = await translationAPI.getTranslations(currentLanguage)
        setTranslations(res.data?.data ?? res.data ?? {})
      } catch (err) {
        console.error('Translation load failed', err)
        setTranslations({})
      } finally {
        setIsLoading(false)
      }
    }

    loadTranslations()
  }, [currentLanguage])

  const t = (key: string) => translations[key] || key

  return (
    <TranslationContext.Provider value={{ t, isLoading }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useT() {
  const ctx = useContext(TranslationContext)
  if (!ctx) {
    throw new Error('useT must be used inside TranslationProvider')
  }
  return ctx
}
