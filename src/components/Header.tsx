import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Bell, Settings, LogOut, X, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import CredentialsBadge from './CredentialsBadge'
import { therapistAPI, notificationsAPI } from '@/lib/api'
import { useTranslation } from '@/hooks/useTranslation'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'urgent' | 'success'
  icon: string
  title: string
  message: string
  link: string
  time: string
  read: boolean
}

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const t = useTranslation()
  const [therapistCredentials, setTherapistCredentials] = useState<'SLP' | 'SLPA' | null>(null)
  const [canSupervise, setCanSupervise] = useState<boolean>(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const notifRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await notificationsAPI.getAll()
      const data = res.data.data
      setNotifications(data.notifications || [])
      // Subtract already-read ones from local state
      const unread = (data.notifications || []).filter((n: Notification) => !n.read && !readIds.has(n.id))
      setUnreadCount(unread.length)
    } catch (error) {
      // Silently fail
    }
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'therapist') fetchTherapistCredentials()
      fetchNotifications()
      // Poll every 60s
      const interval = setInterval(fetchNotifications, 60000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, user])

  const fetchTherapistCredentials = async () => {
    try {
      const response = await therapistAPI.getMyProfile()
      setTherapistCredentials(response.data.data?.credentials || null)
      setCanSupervise(response.data.data?.canSupervise || false)
    } catch (error) {
      console.error('Failed to fetch therapist credentials:', error)
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
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center gap-3 group">
                <img
                  src="/logorooted 1.png"
                  alt="Rooted Voices"
                  className="h-[80px] w-auto drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                />
                <span className="text-2xl font-bold text-gray-900 tracking-tight">Rooted Voices</span>
              </Link>

              {/* Navigation Links for Unauthenticated Users */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/services" className="text-gray-600 hover:text-black transition-colors text-sm font-medium">
                  Services
                </Link>
                <Link href="/who-we-are" className="text-gray-600 hover:text-black transition-colors text-sm font-medium">
                  Who We Are
                </Link>
                <Link href="/for-therapists" className="text-gray-600 hover:text-black transition-colors text-sm font-medium">
                  For Therapists
                </Link>
                <Link href="/meet-our-therapists" className="text-gray-600 hover:text-black transition-colors text-sm font-medium">
                  {t('nav.therapists')}
                </Link>
                <Link href="/pricing" className="text-gray-600 hover:text-black transition-colors text-sm font-medium">
                  {t('nav.pricing')}
                </Link>
              </nav>
            </div>

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
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logorooted 1.png"
                alt="Rooted Voices"
                className="h-[104px] w-auto drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-2xl font-bold text-gray-900 tracking-tight hidden sm:block">Rooted Voices</span>
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
            {/* Credentials Badge for Therapists */}
            {user?.role === 'therapist' && therapistCredentials && (
              <CredentialsBadge credentials={therapistCredentials} canSupervise={canSupervise} size="sm" />
            )}


            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setShowNotifications(prev => !prev)
                  if (!showNotifications) {
                    // Mark all visible as read locally
                    const allIds = new Set([...readIds, ...notifications.map(n => n.id)])
                    setReadIds(allIds)
                    setUnreadCount(0)
                  }
                }}
                className="relative p-2 text-gray-600 hover:text-black transition-colors rounded-lg hover:bg-gray-100"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-gray-700" />
                      <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 font-semibold px-1.5 py-0.5 rounded-full">{unreadCount} new</span>
                      )}
                    </div>
                    <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-700 p-1 rounded">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* List */}
                  <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="text-center py-10 text-gray-400">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">You're all caught up!</p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const borderColors = {
                          urgent: 'border-l-red-500',
                          warning: 'border-l-yellow-500',
                          success: 'border-l-green-500',
                          info: 'border-l-blue-500',
                        }
                        const bgColors = {
                          urgent: 'bg-red-50 hover:bg-red-100',
                          warning: 'bg-yellow-50 hover:bg-yellow-100',
                          success: 'bg-green-50 hover:bg-green-100',
                          info: 'bg-blue-50 hover:bg-blue-100',
                        }
                        const isRead = n.read || readIds.has(n.id)
                        return (
                          <Link
                            key={n.id}
                            href={n.link}
                            onClick={() => setShowNotifications(false)}
                            className={`flex items-start gap-3 px-4 py-3 border-l-4 transition-colors cursor-pointer ${bgColors[n.type]
                              } ${borderColors[n.type]} ${isRead ? 'opacity-60' : ''}`}
                          >
                            <span className="text-xl mt-0.5 flex-shrink-0">{n.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-semibold text-gray-800 truncate">{n.title}</span>
                                {!isRead && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{n.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <ExternalLink className="w-3 h-3 text-gray-300 flex-shrink-0 mt-1" />
                          </Link>
                        )
                      })
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
                    <Link
                      href="/sessions"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View all sessions →
                    </Link>
                  </div>
                </div>
              )}
            </div>

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

