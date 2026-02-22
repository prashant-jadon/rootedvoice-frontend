'use client'

import { translations, getNestedTranslation } from '@/lib/translations'

/**
 * Hook to translate text (now simplified to just return English base strings)
 * @param key - Translation key (e.g., 'nav.services' or 'common.welcome')
 * @param fallback - Optional fallback text if translation not found
 * @returns Translated text
 */
export function useTranslation() {
  const t = (key: string, fallback?: string): string => {
    const enTranslation = getNestedTranslation(translations.en, key)
    if (enTranslation !== key) {
      return enTranslation
    }
    return fallback || key
  }

  return t
}

/**
 * Direct translation function (for use outside React components)
 */
export function translate(key: string, language: string = 'en', fallback?: string): string {
  const enTranslation = getNestedTranslation(translations.en, key)
  if (enTranslation !== key) {
    return enTranslation
  }
  return fallback || key
}
