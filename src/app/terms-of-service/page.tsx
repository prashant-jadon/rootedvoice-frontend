import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg text-gray-600">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily download one copy of the materials (information or software) on Rooted Voices' website for personal, non-commercial transitory viewing only.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Medical Disclaimer</h2>
          <p className="mb-4">
            The services provided by Rooted Voices are for speech and language therapy purposes. While our therapists are licensed professionals, the content on this site is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Cancellation Policy</h2>
          <p className="mb-4">
            We require 24 hours notice for cancellations. Missed appointments or cancellations made with less than 24 hours notice may be subject to a cancellation fee.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. User Accounts</h2>
          <p className="mb-4">
            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Governing Law</h2>
          <p className="mb-4">
            These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </p>
        </div>
      </div>
    </div>
  );
}
