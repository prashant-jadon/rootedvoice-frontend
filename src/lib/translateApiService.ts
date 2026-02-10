'use client'

/**
 * TranslateAPI.ai Service
 * Provides dynamic text translation using TranslateAPI.ai
 * API Key: Uses NEXT_PUBLIC_TRANSLATE_API_KEY from environment
 */

const API_KEY = process.env.NEXT_PUBLIC_TRANSLATE_API_KEY || ''
const API_BASE_URL = 'https://api.translateapi.ai/v1'

// Cache for translations to reduce API calls
const translationCache: Map<string, string> = new Map()

// Generate cache key
const getCacheKey = (text: string, targetLang: string): string => {
  return `${targetLang}:${text.substring(0, 100)}`
}

// Load cache from localStorage
const loadCache = (): void => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('translation_cache')
      if (cached) {
        const parsed = JSON.parse(cached)
        Object.entries(parsed).forEach(([key, value]) => {
          translationCache.set(key, value as string)
        })
      }
    } catch (error) {
      console.error('Failed to load translation cache:', error)
    }
  }
}

// Save cache to localStorage
const saveCache = (): void => {
  if (typeof window !== 'undefined') {
    try {
      const cacheObj: Record<string, string> = {}
      translationCache.forEach((value, key) => {
        cacheObj[key] = value
      })
      // Limit cache size
      const entries = Object.entries(cacheObj)
      if (entries.length > 500) {
        const limitedCache: Record<string, string> = {}
        entries.slice(-500).forEach(([k, v]) => {
          limitedCache[k] = v
        })
        localStorage.setItem('translation_cache', JSON.stringify(limitedCache))
      } else {
        localStorage.setItem('translation_cache', JSON.stringify(cacheObj))
      }
    } catch (error) {
      console.error('Failed to save translation cache:', error)
    }
  }
}

// Initialize cache on module load
if (typeof window !== 'undefined') {
  loadCache()
}

export interface TranslateResponse {
  translated: string
  source_language?: string
  target_language?: string
}

/**
 * Translate text to target language using TranslateAPI.ai
 * @param text - Text to translate
 * @param targetLanguage - Target language code (e.g., 'es', 'fr', 'de')
 * @param sourceLanguage - Source language code (defaults to 'en')
 * @returns Translated text or original text on error
 */
export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'en'
): Promise<string> {
  // Don't translate if target is same as source or English
  if (targetLanguage === sourceLanguage || targetLanguage === 'en') {
    return text
  }

  // Check cache first
  const cacheKey = getCacheKey(text, targetLanguage)
  const cached = translationCache.get(cacheKey)
  if (cached) {
    return cached
  }

  // Skip empty or very short text
  if (!text || text.trim().length < 2) {
    return text
  }

  try {
    const response = await fetch(`${API_BASE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        text: text,
        source: sourceLanguage,
        target: targetLanguage,
      }),
    })

    if (!response.ok) {
      console.error('Translation API error:', response.status)
      return text
    }

    const data = await response.json()
    const translatedText = data.translated || data.translation || data.text || text

    // Cache the result
    translationCache.set(cacheKey, translatedText)
    saveCache()

    return translatedText
  } catch (error) {
    console.error('Translation error:', error)
    return text
  }
}

/**
 * Batch translate multiple texts
 * @param texts - Array of texts to translate
 * @param targetLanguage - Target language code
 * @param sourceLanguage - Source language code
 * @returns Array of translated texts
 */
export async function translateBatch(
  texts: string[],
  targetLanguage: string,
  sourceLanguage: string = 'en'
): Promise<string[]> {
  if (targetLanguage === sourceLanguage || targetLanguage === 'en') {
    return texts
  }

  const results = await Promise.all(
    texts.map(text => translateText(text, targetLanguage, sourceLanguage))
  )

  return results
}

/**
 * Get supported languages
 */
export function getSupportedLanguages() {
  return [
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
}

/**
 * Clear translation cache
 */
export function clearTranslationCache(): void {
  translationCache.clear()
  if (typeof window !== 'undefined') {
    localStorage.removeItem('translation_cache')
  }
}

export default {
  translateText,
  translateBatch,
  getSupportedLanguages,
  clearTranslationCache,
}
