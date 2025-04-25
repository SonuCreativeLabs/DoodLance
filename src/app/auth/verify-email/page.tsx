'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react'

export default function VerifyEmail() {
  const [email, setEmail] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resendCount, setResendCount] = useState(0)
  const { resendVerificationEmail } = useAuth()

  useEffect(() => {
    // Get the email from localStorage
    const storedEmail = localStorage.getItem('pendingVerificationEmail')
    if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [])

  const handleResend = async () => {
    if (!email || loading) return
    
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const { error } = await resendVerificationEmail(email)
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setResendCount(prev => prev + 1)
      }
    } catch (err) {
      setError('Failed to resend verification email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-purple-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">
              We've sent a verification email to{' '}
              <span className="font-medium text-purple-600">{email}</span>
            </p>
            <p className="text-sm text-gray-600">
              Please check your inbox (and spam folder) and click the verification link to continue.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="flex items-center justify-center space-x-2 text-red-500 text-sm">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center justify-center space-x-2 text-green-500 text-sm">
              <CheckCircle2 className="h-5 w-5" />
              <span>Verification email has been resent successfully.</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="text-center">
              <Button
                onClick={handleResend}
                disabled={loading || resendCount >= 3}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Resend verification email'}
              </Button>
            </div>

            {resendCount > 0 && (
              <p className="text-xs text-center text-gray-500">
                Resent {resendCount} {resendCount === 1 ? 'time' : 'times'}. 
                {resendCount >= 3 && ' Maximum attempts reached.'}
              </p>
            )}

            <div className="text-center text-sm space-y-2">
              <p className="text-gray-600">
                Already verified?{' '}
                <Link href="/auth/signin" className="font-medium text-purple-600 hover:text-purple-500">
                  Sign in
                </Link>
              </p>
              <p className="text-gray-600">
                Wrong email?{' '}
                <Link href="/auth/signup" className="font-medium text-purple-600 hover:text-purple-500">
                  Sign up again
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 