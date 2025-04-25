'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

export default function VerifyEmail() {
  const [email, setEmail] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { resendVerificationEmail } = useAuth()

  useEffect(() => {
    // Get the email from localStorage
    const storedEmail = localStorage.getItem('pendingVerificationEmail')
    if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [])

  const handleResend = async () => {
    if (!email) return

    setLoading(true)
    setMessage('')
    
    try {
      const { error } = await resendVerificationEmail(email)
      if (error) {
        setMessage('Failed to resend verification email. Please try again.')
      } else {
        setMessage('Verification email has been resent. Please check your inbox.')
      }
    } catch (err) {
      setMessage('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent you an email with a verification link. Please check your inbox and click the link to verify your account.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          {message && (
            <div className={`text-sm text-center ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </div>
          )}
          <div className="text-sm text-center">
            <p className="text-gray-600">
              Didn't receive the email? Check your spam folder or
            </p>
            <Button
              onClick={handleResend}
              disabled={loading || !email}
              className="mt-2 font-medium text-purple-600 hover:text-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Resend verification email'}
            </Button>
          </div>
          <div className="text-sm text-center">
            <Link href="/auth/signin" className="font-medium text-purple-600 hover:text-purple-500">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 