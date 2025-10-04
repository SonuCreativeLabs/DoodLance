'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2, Chrome, Apple } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function SignIn() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isValidEmail = (val: string) => /.+@.+\..+/.test(val)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setIsLoading(true)
    try {
      // Use auth context to handle signin (redirects to client home after auth)
      signIn()
    } catch (err) {
      setError('Sign in failed. Please try again.')
      setIsLoading(false)
    }
  }

  const handleSocial = async (provider: 'google' | 'apple') => {
    setIsLoading(true)
    try {
      // Use auth context for social signin (redirects to client home after auth)
      signIn(provider)
    } catch (err) {
      setIsLoading(false)
      setError(`${provider} sign in failed. Please try again.`)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-[#111111] text-white">
      <div className="max-w-md mx-auto w-full flex flex-col">
        {/* Sticky Header (matches client inbox) */}
        <div className="p-4 border-b border-white/5 sticky top-0 z-10 bg-gradient-to-b from-[#111111] to-[#0a0a0a] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Back" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <ArrowLeft className="w-4 h-4 text-white/80" />
            </Link>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Sign in</h1>
          </div>
        </div>

        {/* Card */}
        <div className="px-4 py-6">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
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
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs text-white/70">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 placeholder:text-white/40"
                    autoComplete="current-password"
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
                <div className="text-right">
                  <Link href="/auth/forgot-password" className="text-xs text-purple-300 hover:text-purple-200">Forgot password?</Link>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 rounded-lg text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</span>
                ) : (
                  'Sign in'
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/50">or continue with</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocial('google')}
                  className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm"
                >
                  <Chrome className="w-4 h-4" /> Google
                </button>
                <button
                  type="button"
                  onClick={() => handleSocial('apple')}
                  className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm"
                >
                  <Apple className="w-4 h-4" /> Apple
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-5 text-center text-sm text-white/70">
              Don’t have an account?{' '}
              <Link href="/auth/signup" className="text-purple-300 hover:text-purple-200 font-medium">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
