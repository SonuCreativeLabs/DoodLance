'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isValidEmail = (val: string) => /.+@.+\..+/.test(val)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    setIsLoading(true)
    try {
      // TODO: Wire to password reset API (WorkOS supports password reset via email)
      // await fetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
      await new Promise((r) => setTimeout(r, 1000))
      setSuccess(true)
    } catch (err) {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen w-full bg-[#111111] text-white">
        <div className="max-w-md mx-auto w-full flex flex-col">
          {/* Sticky Header */}
          <div className="p-4 border-b border-white/5 sticky top-0 z-10 bg-gradient-to-b from-[#111111] to-[#0a0a0a] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <Link href="/auth/signin" aria-label="Back" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10">
                <ArrowLeft className="w-4 h-4 text-white/80" />
              </Link>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Reset password</h1>
            </div>
          </div>

          {/* Success Card */}
          <div className="px-4 py-6">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.25)] text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">Check your email</h2>
              <p className="text-white/70 text-sm mb-4">
                We've sent a password reset link to <strong className="text-white">{email}</strong>
              </p>
              <p className="text-white/60 text-xs">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setSuccess(false)}
                  className="text-purple-300 hover:text-purple-200 underline"
                >
                  try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full bg-[#111111] text-white">
      <div className="max-w-md mx-auto w-full flex flex-col">
        {/* Sticky Header */}
        <div className="p-4 border-b border-white/5 sticky top-0 z-10 bg-gradient-to-b from-[#111111] to-[#0a0a0a] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" aria-label="Back" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <ArrowLeft className="w-4 h-4 text-white/80" />
            </Link>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Forgot password</h1>
          </div>
        </div>

        {/* Card */}
        <div className="px-4 py-6">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Reset your password</h2>
              <p className="text-white/70 text-sm">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs text-white/70">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 placeholder:text-white/40"
                    autoComplete="email"
                    inputMode="email"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 rounded-lg text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Sending...</span>
                ) : (
                  'Send reset link'
                )}
              </button>

              {/* Back to signin */}
              <div className="text-center text-sm text-white/70">
                Remember your password?{' '}
                <Link href="/auth/signin" className="text-purple-300 hover:text-purple-200 font-medium">Sign in</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
