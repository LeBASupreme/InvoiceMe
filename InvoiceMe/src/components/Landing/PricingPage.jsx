import React from 'react'
import Navbar from './Navbar'

function PricingPage() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium">Under Maintenance</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Pricing Coming Soon
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            Our payment system is currently under maintenance. We're working hard to bring you flexible pricing plans. Stay tuned!
          </p>

          <div className="bg-dark-light rounded-2xl p-8 md:p-12 border border-gray-700">
            <div className="flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-4">
              Free During Beta
            </h2>

            <p className="text-gray-400 mb-8">
              Enjoy all features for free while we're in beta. No credit card required.
            </p>

            <ul className="text-left max-w-sm mx-auto space-y-3 mb-8">
              <li className="flex items-center gap-3 text-gray-300">
                <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Unlimited invoices
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Unlimited clients
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                PDF export
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Dashboard analytics
              </li>
            </ul>

            <a
              href="/register"
              className="inline-block px-8 py-3 bg-white text-dark font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingPage