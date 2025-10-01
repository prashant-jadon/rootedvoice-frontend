import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LiveChatWidget from '../components/LiveChatWidget'
import Footer from '../components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rooted Voices - Telehealth & Practice Management',
  description: 'Make speech & language therapy accessible, private, and effective for everyone.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Footer />
        <LiveChatWidget />
      </body>
    </html>
  )
}