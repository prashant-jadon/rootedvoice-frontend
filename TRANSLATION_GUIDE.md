# Translation Guide

This guide explains how to use the translation system in the Rooted Voices application.

## Overview

The application supports full website text translation in multiple languages. The translation system is built on top of the `LanguageContext` and uses a simple key-based translation approach.

## Supported Languages

Currently supported languages:
- English (en) - Default
- Spanish (es)
- French (fr)
- German (de)

More languages can be easily added by extending the translation files.

## How to Use Translations

### 1. In React Components

Use the `useTranslation` hook to get the translation function:

```tsx
import { useTranslation } from '@/hooks/useTranslation'

export default function MyComponent() {
  const t = useTranslation()
  
  return (
    <div>
      <h1>{t('landing.hero.title')}</h1>
      <button>{t('common.save')}</button>
    </div>
  )
}
```

### 2. Translation Keys

Translation keys use dot notation for nested objects:

- `nav.services` → "Services" (or "Servicios" in Spanish)
- `common.welcome` → "Welcome" (or "Bienvenido" in Spanish)
- `landing.hero.title` → Main hero title
- `dashboard.welcome` → Dashboard welcome message

### 3. Adding New Translations

#### Step 1: Add to Translation File

Edit `/src/lib/translations/index.ts` and add your translation key to all languages:

```typescript
export const translations = {
  en: {
    mySection: {
      myKey: 'My English Text',
    },
  },
  es: {
    mySection: {
      myKey: 'Mi Texto en Español',
    },
  },
  // ... other languages
}
```

#### Step 2: Use in Component

```tsx
const t = useTranslation()
<p>{t('mySection.myKey')}</p>
```

### 4. Fallback Behavior

- If a translation is not found for the current language, it falls back to English
- If English translation is also missing, it returns the key itself (or a provided fallback)

```tsx
// With fallback
t('some.key', 'Default text if not found')
```

## Translation Structure

Translations are organized by sections:

- `nav.*` - Navigation items
- `common.*` - Common UI elements (buttons, labels)
- `landing.*` - Landing page content
- `dashboard.*` - Dashboard content
- `sessions.*` - Session-related text
- `profile.*` - Profile page content
- `chat.*` - Chat widget content
- `errors.*` - Error messages

## Adding a New Language

1. Add language to `LanguageContext.tsx`:
```typescript
const DEFAULT_LANGUAGES: Language[] = [
  // ... existing languages
  { code: 'it', name: 'Italiano' },
]
```

2. Add translations to `/src/lib/translations/index.ts`:
```typescript
export const translations = {
  // ... existing languages
  it: {
    nav: { /* Italian translations */ },
    common: { /* Italian translations */ },
    // ... all sections
  },
}
```

3. The language will automatically appear in the language switcher!

## Best Practices

1. **Use descriptive keys**: `landing.hero.title` is better than `title1`
2. **Group related translations**: Keep related text in the same section
3. **Avoid hardcoded text**: Always use `t()` for user-facing text
4. **Provide fallbacks**: Use fallback text for important content
5. **Test all languages**: Make sure translations work in all supported languages

## Examples

### Navigation
```tsx
<Link href="/services">{t('nav.services')}</Link>
<Link href="/pricing">{t('nav.pricing')}</Link>
```

### Buttons
```tsx
<button>{t('common.save')}</button>
<button>{t('common.cancel')}</button>
```

### Dynamic Content
```tsx
<h1>{t('dashboard.welcome')}, {user.name}!</h1>
```

## Current Translation Coverage

✅ **Fully Translated:**
- Navigation (Header, Landing Page)
- Common UI elements
- Landing page hero section
- Chat widget
- Dashboard basics

🔄 **Partially Translated:**
- Some pages may still have hardcoded English text

📝 **To Do:**
- Add translations for all pages
- Add more languages
- Translate error messages
- Translate form labels and placeholders

## Need Help?

If you need to add translations or have questions:
1. Check existing translations in `/src/lib/translations/index.ts`
2. Follow the pattern of existing translations
3. Test your changes by switching languages in the UI
