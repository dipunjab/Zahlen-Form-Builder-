'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const steps = [
  {
    title: '1. View Your Dashboard',
    description: 'See all your forms and click on "Create Form" to begin.',
    src: '/images/started/gt-1.jpg',
    alt: 'Dashboard View',
  },
  {
    title: '2. Setup Form Details',
    description: 'Add a title, description, cover image, and logo for your form.',
    src: '/images/started/gt-2.jpg',
    alt: 'Form Setup',
  },
  {
    title: '3. Add Fields',
    description: 'Choose from multiple field types like text, email, date, file, etc. You can also mark them as required.',
    src: '/images/started/gt-4.png',
    alt: 'Add Fields',
  },
  {
    title: '4. Preview & Publish',
    description: 'Use preview to test your form. You can save it as draft or publish it when ready.',
    src: '/images/started/btn.png',
    alt: 'Preview and Publish',
  },
  {
    title: '5. Manage Form Settings',
    description: 'Edit, delete or unpublish your form. Copy the published URL from the “About” tab.',
    src: '/images/started/gt-5.jpg',
    alt: 'Form Settings',
  },
  {
    title: '6. Share & Collect Responses',
    description: 'Users can open the published URL and submit their responses easily.',
    src: '/images/started/gt-6.png',
    alt: 'Submit Response',
  },
  {
    title: '7. View Responses',
    description: 'As the form creator, see all responses in real-time under the “Responses” tab. Download everything as CSV.',
    src: '/images/started/gt-7.jpg',
    alt: 'View Responses',
  },
  {
    title: '8. CSV Format Explained',
    description: 'The downloaded CSV includes all form fields as columns. Even uploaded file links are clickable!',
    src: '/images/started/gt-8.jpg',
    alt: 'CSV File',
  },
]

const GettingStarted = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 font-sans">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold" style={{ color: '#FFBF00' }}>
          Welcome to Zahlen
        </h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Build, publish, and manage your forms in minutes.
        </p>
      </header>

      {/* About */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900">📌 What is Zahlen?</h2>
        <p className="text-gray-700 leading-relaxed">
          Zahlen is a powerful form builder that lets you create, manage, and analyze forms with real-time response tracking, file uploads, and CSV exports. Whether you’re collecting data, running surveys, or just need clean UX — we&apos;ve got you covered.
        </p>
      </section>

      {/* Steps */}
      <section className="space-y-16">
        <h2 className="text-2xl font-semibold text-gray-900">🚀 Getting Started</h2>
        {steps.map((step, idx) => (
          <div key={idx}>
            <h3 className="text-xl font-medium text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-700 mb-4">{step.description}</p>
            <div className="relative w-full max-w-full overflow-hidden rounded-md border border-gray-200 shadow-sm bg-white" style={{ minHeight: '300px', maxHeight: '600px' }}>
              <div className="relative w-full h-full min-h-[300px] max-h-[600px]">
                <Image
                  src={step.src}
                  alt={step.alt}
                  fill
                  className="object-contain w-full h-full"
                />
              </div>
            </div>

          </div>
        ))}
      </section>

      {/* Final CTA */}
      <section className="mt-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">You&apos;re all set 🎉</h2>
        <p className="text-muted-foreground mt-1">Start building your first form now.</p>
        <Link href="/dashboard">
          <Button
            className="mt-6 px-6 py-3 text-lg font-semibold"
            style={{ backgroundColor: '#FFBF00', color: '#000' }}
          >
            Create Your First Form
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default GettingStarted
