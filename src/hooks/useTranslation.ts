'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { translations, getNestedTranslation } from '@/lib/translations'

/**
 * Hook to translate text based on current language
 * @param key - Translation key (e.g., 'nav.services' or 'common.welcome')
 * @param fallback - Optional fallback text if translation not found
 * @returns Translated text
 * 
 * @example
 * const t = useTranslation()
 * <h1>{t('landing.hero.title')}</h1>
 * <button>{t('common.save', 'Save')}</button>
 */
export function useTranslation() {
  const { currentLanguage } = useLanguage()

  const t = (key: string, fallback?: string): string => {
    const langTranslations = translations[currentLanguage as keyof typeof translations] || translations.en
    const translation = getNestedTranslation(langTranslations, key)
    
    // If translation not found and it's not the same as key, return fallback or key
    if (translation === key) {
      // Try English as fallback
      const enTranslation = getNestedTranslation(translations.en, key)
      if (enTranslation !== key) {
        return enTranslation
      }
      return fallback || key
    }
    
    return translation
  }

  return t
}

/**
 * Direct translation function (for use outside React components)
 */
export function translate(key: string, language: string = 'en', fallback?: string): string {
  const langTranslations = translations[language as keyof typeof translations] || translations.en
  const translation = getNestedTranslation(langTranslations, key)
  
  if (translation === key) {
    const enTranslation = getNestedTranslation(translations.en, key)
    if (enTranslation !== key) {
      return enTranslation
    }
    return fallback || key
  }
  
  return translation
}
