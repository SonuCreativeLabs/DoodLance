'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Lock, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function ResetPassword() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Check if token exists on mount
  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset.')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!token) {
      setError('Invalid reset token. Please request a new password reset.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      // TODO: Wire to password reset API with token validation
      // await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   body: JSON.stringify({ token, password })
      // })
      await new Promise((r) => setTimeout(r, 1000))
      setSuccess(true)
    } catch (err) {
      setError('Failed to reset password. Please try again.')
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
              <h2 className="text-lg font-semibold mb-2">Password reset successful</h2>
              <p className="text-white/70 text-sm mb-6">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!token) {
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

          {/* Error Card */}
          <div className="px-4 py-6">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 shadow-[0_8px_40px_rgba(0,0,0,0.25)] text-center">
              <div className="text-red-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold mb-2">Invalid reset link</h2>
              <p className="text-white/70 text-sm mb-6">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Link
                href="/auth/forgot-password"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors"
              >
                Request new link
              </Link>
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
            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Reset password</h1>
          </div>
        </div>

        {/* Card */}
        <div className="px-4 py-6">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Set new password</h2>
              <p className="text-white/70 text-sm">
                Enter your new password below. Make sure it's strong and secure.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs text-white/70">New password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 placeholder:text-white/40"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-white/10 text-white/70"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs text-white/70">Confirm new password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 placeholder:text-white/40"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-white/10 text-white/70"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 rounded-lg text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Updating...</span>
                ) : (
                  'Update password'
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
