'use client'

// import Link from "next/link"
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

          {/* Column 2 - FOR CLIENTS */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">For Clients</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="/services" className="hover:text-white transition-colors">Services</a>
              </li>
              <li>
                <a href="/meet-our-therapists" className="hover:text-white transition-colors">Meet Our Therapists</a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <a href="/evaluation-booking" className="hover:text-white transition-colors">Schedule Evaluation</a>
              </li>
              <li>
                <a href="/login?role=client" className="hover:text-white transition-colors">Client Login</a>
              </li>
            </ul>
          </div>

          {/* Column 3 - FOR CLINICIANS */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">For Clinicians</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="/for-therapists" className="hover:text-white transition-colors">Join Our Team</a>
              </li>
              <li>
                <a href="/for-therapists" className="hover:text-white transition-colors">For Therapists</a>
              </li>
              <li>
                <a href="/login?role=therapist" className="hover:text-white transition-colors">Therapist Portal</a>
              </li>
            </ul>
          </div>

          {/* Column 4 - About Rooted Voices */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">About Rooted Voices</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="/who-we-are" className="hover:text-white transition-colors">Who We Are</a>
              </li>
              <li>
                <a href="/cancellation-policy" className="hover:text-white transition-colors">Cancellation Policy</a>
              </li>
              <li>
                <a href="/telehealth-consent" className="hover:text-white transition-colors">Telehealth Consent</a>
              </li>
              <li>
                <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">Contact Us</a>
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
