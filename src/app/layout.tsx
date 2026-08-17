import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LiveChatWidget from '../components/LiveChatWidget'
import Footer from '../components/Footer'
import AccessibilityFeatures from '../components/AccessibilityFeatures'
import GoogleTranslateWidget from '../components/GoogleTranslateWidget'
import { AuthProvider } from '../contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rooted Voices - Telehealth & Practice Management',
  description: 'Make speech & language therapy accessible, private, and effective for everyone.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Footer />
          <LiveChatWidget />
          <AccessibilityFeatures />
          <GoogleTranslateWidget />
        </AuthProvider>
      </body>
    </html>
  )
}