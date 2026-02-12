import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg text-gray-600">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you create an account, update your profile, book an appointment, or communicate with us. This information may include:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Name and contact information</li>
            <li>Date of birth</li>
            <li>Medical history and health information (protected under HIPAA)</li>
            <li>Payment information</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Comply with legal obligations, including HIPAA regulations</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Information Sharing</h2>
          <p className="mb-4">
            We do not share your personal information with third parties except as described in this privacy policy or as required by law. We may share your information with:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>Healthcare providers involved in your care</li>
            <li>Service providers who need access to such information to perform work on our behalf</li>
            <li>Professional advisors, such as lawyers, auditors, and insurers</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Data Security</h2>
          <p className="mb-4">
            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. All health information is stored in compliance with HIPAA standards.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at info@rootedvoices.com.
          </p>
        </div>
      </div>
    </div>
  );
}
