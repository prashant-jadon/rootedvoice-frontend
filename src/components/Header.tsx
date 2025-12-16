'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Bell, Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import LanguageSelector from './LanguageSelector'
import LanguageSwitcher from './LanguageSwitcher'
import CredentialsBadge from './CredentialsBadge'
import { translationAPI, therapistAPI } from '@/lib/api'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslation } from '@/hooks/useTranslation'

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const { currentLanguage, changeLanguage } = useLanguage()
  const t = useTranslation()
  const [isDetectingLanguage, setIsDetectingLanguage] = useState(false)
  const [therapistCredentials, setTherapistCredentials] = useState<'SLP' | 'SLPA' | null>(null)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchLanguagePreferences()
      if (user.role === 'therapist') {
        fetchTherapistCredentials()
      }
    }
  }, [isAuthenticated, user])

  const fetchTherapistCredentials = async () => {
    try {
      const response = await therapistAPI.getMyProfile()
      setTherapistCredentials(response.data.data?.credentials || null)
    } catch (error) {
      console.error('Failed to fetch therapist credentials:', error)
    }
  }

  const fetchLanguagePreferences = async () => {
    try {
      const response = await translationAPI.getPreferences()
      const prefs = response.data.data
      if (prefs?.interfaceLanguage && prefs.interfaceLanguage !== currentLanguage) {
        await changeLanguage(prefs.interfaceLanguage)
      }
    } catch (error) {
      console.error('Failed to fetch language preferences:', error)
    }
  }

  const handleLanguageChange = async (language: string) => {
    await changeLanguage(language)
      // Reload page to apply interface translation
      window.location.reload()
  }

  const detectLanguageFromText = async (text: string) => {
    if (!text || text.trim().length < 10) return
    
    setIsDetectingLanguage(true)
    try {
      const response = await translationAPI.detectLanguage(text)
      const detectedLang = response.data.data.language
      if (detectedLang && detectedLang !== currentLanguage) {
        // Auto-switch interface language if detected language is different
        await handleLanguageChange(detectedLang)
      }
    } catch (error) {
      console.error('Language detection failed:', error)
    } finally {
      setIsDetectingLanguage(false)
    }
  }

  const getInitials = () => {
    if (!user) return 'U'
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  }

  const getUserColor = () => {
    if (user?.role === 'therapist') return 'bg-blue-600'
    if (user?.role === 'client') return 'bg-purple-600'
    return 'bg-gray-600'
  }

  // Therapist Navigation - Simplified to 6 items max
  const therapistLinks = [
    { label: t('nav.dashboard'), href: '/dashboard' },
    { label: t('nav.sessions'), href: '/sessions' },
    { label: t('nav.clients'), href: '/dashboard?tab=clients' },
    { label: t('nav.resources'), href: '/resources' },
    { label: t('nav.myPractice'), href: '/my-practice' },
    { label: t('nav.community'), href: '/community' },
  ]

  // Client Navigation - Simplified to 5 items max
  const clientLinks = [
    { label: t('nav.dashboard'), href: '/client-dashboard' },
    { label: t('nav.sessions'), href: '/sessions' },
    { label: t('nav.findTherapists'), href: '/meet-our-therapists' },
    { label: t('nav.myProfile'), href: '/client-profile' },
    { label: t('nav.resources'), href: '/resources' },
  ]

  const links = user?.role === 'therapist' ? therapistLinks : clientLinks

  if (!isAuthenticated) {
    return (
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <img 
                src="/logorooted 1.png" 
                alt="Rooted Voices" 
                className="w-18 h-20 mr-2"
              />
              <span className="text-2xl font-bold text-black">Rooted Voices</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-black transition-colors">
                {t('nav.signIn')}
              </Link>
              <Link href="/signup" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                {t('nav.signUp')}
              </Link>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <img 
                src="/logorooted 1.png" 
                alt="Rooted Voices" 
                className="w-18 h-20 mr-2"
              />
              <span className="text-2xl font-bold text-black">Rooted Voices</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-black transition-colors text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher variant="default" />
            
            {/* Credentials Badge for Therapists */}
            {user?.role === 'therapist' && therapistCredentials && (
              <CredentialsBadge credentials={therapistCredentials} size="sm" />
            )}
            
            <button className="relative p-2 text-gray-600 hover:text-black transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${getUserColor()} rounded-full flex items-center justify-center`}>
                <span className="text-white text-sm font-semibold">{getInitials()}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-black">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-black transition-colors"
              title="Logout"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

