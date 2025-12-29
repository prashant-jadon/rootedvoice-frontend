// 'use client'

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// import { translationAPI } from '@/lib/api'

// interface Language {
//   code: string
//   name: string
// }

// interface LanguageContextType {
//   currentLanguage: string
//   languages: Language[]
//   changeLanguage: (languageCode: string) => Promise<void>
//   isLoading: boolean
// }

// const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// const DEFAULT_LANGUAGES: Language[] = [
//   { code: 'en', name: 'English' },
//   { code: 'es', name: 'Español' },
//   { code: 'fr', name: 'Français' },
//   { code: 'de', name: 'Deutsch' },
//   { code: 'zh', name: '中文' },
//   { code: 'ja', name: '日本語' },
//   { code: 'ko', name: '한국어' },
//   { code: 'ar', name: 'العربية' },
//   { code: 'pt', name: 'Português' },
//   { code: 'hi', name: 'हिन्दी' },
//   { code: 'ru', name: 'Русский' },
//   { code: 'it', name: 'Italiano' },
//   { code: 'nl', name: 'Nederlands' },
//   { code: 'pl', name: 'Polski' },
//   { code: 'tr', name: 'Türkçe' },
//   { code: 'vi', name: 'Tiếng Việt' },
// ]

// export function LanguageProvider({ children }: { children: ReactNode }) {
//   const [currentLanguage, setCurrentLanguage] = useState<string>('en')
//   const [languages, setLanguages] = useState<Language[]>(DEFAULT_LANGUAGES)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     // Load language preference from localStorage
//     const savedLanguage = localStorage.getItem('website_language') || 'en'
//     setCurrentLanguage(savedLanguage)

//     // Fetch available languages from API
//     fetchLanguages()

//     // Update HTML lang attribute
//     if (typeof document !== 'undefined') {
//       document.documentElement.lang = savedLanguage
//     }
//   }, [])

//   // Update HTML lang attribute when language changes
//   useEffect(() => {
//     if (typeof document !== 'undefined') {
//       document.documentElement.lang = currentLanguage
//     }
//   }, [currentLanguage])

//   const fetchLanguages = async () => {
//     try {
//       const response = await translationAPI.getLanguages()
//       if (response.data.data && response.data.data.length > 0) {
//         setLanguages(response.data.data)
//       }
//     } catch (error) {
//       console.error('Failed to fetch languages, using defaults:', error)
//       // Use default languages if API fails
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const changeLanguage = async (languageCode: string) => {
//     try {
//       // Update local state
//       setCurrentLanguage(languageCode)
//       localStorage.setItem('website_language', languageCode)
//       document.documentElement.lang = languageCode

//       // If user is authenticated, update their preferences
//       const token = localStorage.getItem('token')
//       if (token) {
//         try {
//           await translationAPI.updatePreferences({ interfaceLanguage: languageCode })
//         } catch (error) {
//           console.error('Failed to update user language preferences:', error)
//           // Continue anyway - language is still changed locally
//         }
//       }

//       // Trigger a custom event for components that need to react to language change
//       window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: languageCode } }))
//     } catch (error) {
//       console.error('Failed to change language:', error)
//     }
//   }

//   const value = {
//     currentLanguage,
//     languages,
//     changeLanguage,
//     isLoading,
//   }

//   return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
// }

// export function useLanguage() {
//   const context = useContext(LanguageContext)
//   if (context === undefined) {
//     throw new Error('useLanguage must be used within a LanguageProvider')
//   }
//   return context
// }


'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translationAPI } from '@/lib/api'

interface Language {
  code: string
  name: string
}

interface LanguageContextType {
  currentLanguage: string
  languages: Language[]
  changeLanguage: (languageCode: string) => Promise<void>
  t: (key: string) => string
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const DEFAULT_LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ar', name: 'العربية' },
  { code: 'pt', name: 'Português' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ru', name: 'Русский' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pl', name: 'Polski' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'vi', name: 'Tiếng Việt' },
]

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [languages, setLanguages] = useState<Language[]>(DEFAULT_LANGUAGES)
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  /* -------------------- INITIAL LOAD -------------------- */
  useEffect(() => {
    const savedLanguage = localStorage.getItem('website_language') || 'en'
    setCurrentLanguage(savedLanguage)
    document.documentElement.lang = savedLanguage

    fetchLanguages()
    fetchTranslations(savedLanguage)
  }, [])

  /* -------------------- LANGUAGE CHANGE -------------------- */
  useEffect(() => {
    document.documentElement.lang = currentLanguage
    fetchTranslations(currentLanguage)
  }, [currentLanguage])

  /* -------------------- FETCH LANGUAGES -------------------- */
  const fetchLanguages = async () => {
    try {
      const response = await translationAPI.getLanguages()
  
      // supports both:
      // { data: [...] }
      // { data: { data: [...] } }
      const languagesData =
        response.data?.data ?? response.data
  
      if (Array.isArray(languagesData) && languagesData.length > 0) {
        setLanguages(languagesData)
      }
    } catch (error) {
      console.error('Failed to fetch languages, using defaults:', error)
    } finally {
      setIsLoading(false)
    }
  }
  

  /* -------------------- FETCH TRANSLATIONS -------------------- */
  const fetchTranslations = async (languageCode: string) => {
    try {
      const response = await translationAPI.getTranslations(languageCode)
      setTranslations(response?.data?.data || {})
    } catch (error) {
      console.error('Failed to fetch translations', error)
      setTranslations({})
    }
  }

  /* -------------------- CHANGE LANGUAGE -------------------- */
  const changeLanguage = async (languageCode: string) => {
    try {
      setCurrentLanguage(languageCode)
      localStorage.setItem('website_language', languageCode)

      const token = localStorage.getItem('token')
      if (token) {
        try {
          await translationAPI.updatePreferences({
            interfaceLanguage: languageCode,
          })
        } catch (error) {
          console.error('Failed to update user language preference', error)
        }
      }
    } catch (error) {
      console.error('Failed to change language', error)
    }
  }

  /* -------------------- TRANSLATE FUNCTION -------------------- */
  const t = (key: string) => {
    return translations[key] || key
  }

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        languages,
        changeLanguage,
        t,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

/* -------------------- HOOK -------------------- */
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
