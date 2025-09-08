"use client"

import { Button } from '@/components/ui/button'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
  FileText,
  Download,
  Share2,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { redirect } from 'next/navigation'

const Home = () => {
  const { data: session } = useSession()

  return (
    <div className='m-5'>
      {/* Nav bar */}
      <section className='flex justify-between items-center px-6 py-4'>
        <div className='flex-shrink-0'>
          <Image src="/images/logo.png" alt="logo" width={100} height={40} />
        </div>

        <div className='flex items-center space-x-4'>
          <Link href="/getting-started" className="hover:underline">
            Getting Started
          </Link>

          {session?.user?.image ? (
            <div className='flex items-center space-x-2'>
              <Link href="/dashboard">
                <Image
                  src={session.user.image}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className='rounded-full'
                />
              </Link>
              <button
                onClick={() => signOut()}
                className='text-sm text-gray-500 hover:underline'
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => redirect('/sign-in')}
              className='bg-[#FFBF00] text-black px-4 py-2 rounded hover:bg-orange-400 text-sm'
            >
              Login
            </button>
          )}
        </div>
      </section>

      {/* Hero */}
      <section className='bg-[#FFBF00] p-4 rounded-3xl'>
        <div className='text-center w-[80%] m-auto'>
          <h1 className='text-4xl lg:text-[60px] text-white font-bold'>You thought forms were boring? Plot twist.</h1>
          <p className='text-[#273B4A] font-semibold text-[15px] lg:text-xl w-[80%] m-auto'>Build dazzling forms, collect smart responses, and feel like a genius all before your coffee gets cold.</p>
          <Button className='mt-5 md:p-5 md:text-2xl'>Try Form</Button>
        </div>

        <div className='flex justify-center items-center mt-10 relative mb-5'>
          <Image src="/images/fire.png" alt='firehero' width={500} height={100} />
          <Image src="/images/shothero.png" alt='shothero' width={600} height={100} className='absolute mt-60' />
        </div>
      </section>

      {/* Features Section */}
      <section className='mt-28 bg-white p-8 rounded-3xl shadow-sm border border-gray-100'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl lg:text-5xl font-bold text-gray-900 mb-4'>
            What you can do with <span className='text-[#FFBF00]'>Zählen</span>
          </h2>
          <p className='text-[#273B4A] text-lg w-[70%] m-auto'>
            Build forms, collect data, and manage everything in one place.
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {/* Create Form */}
          <div className='text-center p-6 rounded-2xl bg-gradient-to-br from-[#FFBF00]/10 to-orange-100/20 border border-[#FFBF00]/20'>
            <div className='w-16 h-16 bg-[#FFBF00] rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <FileText className='text-black' size={32} />
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-3'>Create Stunning Forms</h3>
            <p className='text-[#273B4A]'>Design professional forms with ease. Simple, clean, and effective.</p>
          </div>

          {/* Share Form */}
          <div className='text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200'>
            <div className='w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <Share2 className='text-white' size={32} />
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-3'>Share & Collect</h3>
            <p className='text-[#273B4A]'>Share via link and start collecting responses instantly.</p>
          </div>

          {/* Download Responses */}
          <div className='text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200'>
            <div className='w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <Download className='text-white' size={32} />
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-3'>Download Responses</h3>
            <p className='text-[#273B4A]'>Export your collected responses as CSV with a click.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='mt-16 bg-gradient-to-r from-[#FFBF00] to-orange-400 p-12 rounded-3xl text-center'>
        <h2 className='text-3xl lg:text-5xl font-bold text-black mb-6'>
          Ready to build your first form?
        </h2>
        <p className='text-[#273B4A] text-xl mb-8 w-[70%] m-auto font-semibold'>
          Join thousands of users who trust Zählen for their form building needs. Start creating beautiful forms today!
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          {session ? (
            <Link href="/dashboard">
              <Button className='bg-black hover:bg-gray-800 text-white font-semibold text-lg px-12 py-6 rounded-full flex items-center gap-2'>
                Go to Dashboard
                <ArrowRight size={20} />
              </Button>
            </Link>
          ) : (
            <Button
              onClick={() => redirect('/sign-in')}
              className='bg-black hover:bg-gray-800 text-white font-semibold text-lg px-12 py-6 rounded-full flex items-center gap-2'
            >
              Get Started Free
              <ArrowRight size={20} />
            </Button>
          )}

          <Link href="/getting-started">
            <Button variant="outline" className='border-2 border-black text-black hover:bg-black hover:text-white font-semibold text-lg px-8 py-6 rounded-full'>
              Learn More
            </Button>
          </Link>
        </div>

        <div className='flex items-center justify-center gap-8 mt-8 text-sm text-[#273B4A] font-semibold'>
          <div className='flex items-center gap-2'>
            <CheckCircle className='text-green-600' size={20} />
            <span>Free to start</span>
          </div>
          <div className='flex items-center gap-2'>
            <CheckCircle className='text-green-600' size={20} />
            <span>No credit card required</span>
          </div>
          <div className='flex items-center gap-2'>
            <CheckCircle className='text-green-600' size={20} />
            <span>Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
      <footer className='mt-16 bg-white py-6 border-t border-gray-200'>
        <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4'>

          {/* Left: Logo and Text */}
          <div className='flex items-center gap-2'>
            <Image
              src="/images/logo.png"
              alt="Zählen Logo"
              width={100}
              height={20}
            />
          </div>

          <div className='text-sm text-gray-500 mt-2 md:mt-0'>
            © {new Date().getFullYear()} Zählen. All rights reserved.
          </div>

          <div className='flex items-center gap-4 mt-2 md:mt-0'>
            <a
              href="https://github.com/dipunjab/Zahlen-Form-Builder-"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-black transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 .5C5.66.5.5 5.66.5 12a11.5 11.5 0 008.02 10.95c.6.11.82-.26.82-.58v-2.14c-3.26.71-3.95-1.57-3.95-1.57a3.12 3.12 0 00-1.32-1.73c-1.08-.74.08-.73.08-.73a2.5 2.5 0 011.83 1.23 2.53 2.53 0 003.44 1 2.52 2.52 0 01.75-1.58c-2.6-.3-5.34-1.3-5.34-5.77a4.52 4.52 0 011.2-3.13 4.2 4.2 0 01.12-3.09s.98-.31 3.2 1.2a11.1 11.1 0 015.82 0c2.22-1.5 3.2-1.2 3.2-1.2a4.2 4.2 0 01.12 3.09 4.51 4.51 0 011.2 3.13c0 4.48-2.75 5.46-5.36 5.75a2.84 2.84 0 01.81 2.2v3.27c0 .32.21.7.83.58A11.5 11.5 0 0023.5 12C23.5 5.66 18.34.5 12 .5z" />
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/in/usmanghani-js/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-black transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.45 20.45h-3.6v-5.4c0-1.29-.03-2.94-1.79-2.94-1.79 0-2.06 1.4-2.06 2.85v5.49h-3.6V9h3.45v1.56h.05c.48-.91 1.65-1.87 3.4-1.87 3.63 0 4.3 2.39 4.3 5.5v6.26zM5.34 7.43a2.08 2.08 0 110-4.15 2.08 2.08 0 010 4.15zM7.14 20.45H3.54V9h3.6v11.45zM22.23 0H1.77C.8 0 0 .77 0 1.72v20.55C0 23.23.8 24 1.77 24h20.45c.97 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.23 0z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Home
