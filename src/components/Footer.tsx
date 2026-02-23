'use client'

import Link from 'next/link'
import { Heart, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - Rooted Voices */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Rooted Voices</h3>
            <p className="text-gray-400 mb-4 italic">
              “Clinical excellence. Compassionate care. Lasting communication growth.”
            </p>
            <div className="space-y-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@rootedvoices.com</span>
              </div>
            </div>
          </div>

          {/* Column 2 - Get Care */}
          <div>
            <h4 className="font-semibold text-white mb-4">Get Care</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/client-services" className="hover:text-white transition-colors">
                  Pediatric Services
                </Link>
              </li>
              <li>
                <Link href="/client-services" className="hover:text-white transition-colors">
                  Adult Services
                </Link>
              </li>
              <li>
                <Link href="/meet-our-therapists" className="hover:text-white transition-colors">
                  Find a Therapist
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:text-white transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/telehealth-consent" className="hover:text-white transition-colors">
                  Telehealth Consent
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Access Your Account */}
          <div>
            <h4 className="font-semibold text-white mb-4">Access Your Account</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/client-dashboard" className="hover:text-white transition-colors">
                  Client Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Therapist Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Resource Library
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white transition-colors">
                  Community Forum
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - About Rooted Voices */}
          <div>
            <h4 className="font-semibold text-white mb-4">About Rooted Voices</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/who-we-are" className="hover:text-white transition-colors">
                  Who We Are
                </Link>
              </li>
              <li>
                <Link href="/for-therapists" className="hover:text-white transition-colors">
                  For Therapists
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Rooted Voices. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0 text-sm text-gray-400">
            <span className="flex items-center">
              Made with <Heart className="w-3 h-3 mx-1 text-red-500" /> for therapists
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
