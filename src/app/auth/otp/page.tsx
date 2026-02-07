'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, RotateCcw, Info } from 'lucide-react'
import { CricketLoader } from '@/components/ui/cricket-loader'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

function OTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams?.get('phone') || ''
  const email = searchParams?.get('email') || ''
  const identifier = email || phone // Use email first, then phone
  const { verifyOTP, sendOTP } = useAuth()

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timer, setTimer] = useState(60)
  const [showDemoHint, setShowDemoHint] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Show demo hint after a short delay
    const timer = setTimeout(() => {
      setShowDemoHint(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    if (!identifier) {
      setError('Email/Phone and code are required')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('🔐 Starting OTP verification...', { identifier, code })

      // Determine type based on identifier
      const type = email ? 'email' : 'phone'
      await verifyOTP(identifier, code, type)

      console.log('✅ OTP verified successfully!')

      // Check for pending referral code in localStorage
      const pendingRefCode = localStorage.getItem('pending_referral_code')
      if (pendingRefCode) {
        console.log('💾 Found pending referral code:', pendingRefCode)

        // Save to database via API
        try {
          const res = await fetch('/api/user/set-referral', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ referralCode: pendingRefCode })
          })

          if (res.ok) {
            console.log('✅ Referral code saved to database!')
            localStorage.removeItem('pending_referral_code')
          } else {
            console.error('❌ Failed to save referral code')
          }
        } catch (refErr) {
          console.error('❌ Error saving referral code:', refErr)
        }
      }

      console.log('🚀 Redirecting to /client...')

      // Redirect to main app
      router.push('/')
    } catch (err: any) {
      console.error('❌ OTP verification failed:', err)
      setError(err.message || 'Invalid verification code. Please try again.')
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setTimer(60)
    setOtp(['', '', '', '', '', ''])
    setError(null)
    inputRefs.current[0]?.focus()
    try {
      const type = email ? 'email' : 'phone'
      await sendOTP(identifier, type)
      setShowDemoHint(true)
    } catch (err) {
      setError('Failed to resend code')
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white relative overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-[#0a0a0a] to-[#0a0a0a]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link href="/auth/login" className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/10 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center px-4 sm:px-6 pt-2 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-2"
        >
          {/* Logo & Title */}
          <div className="text-center space-y-2">
            <div className="relative w-64 h-64 mx-auto -mb-12 overflow-hidden">
              <Image
                src="/images/LOGOS/BAILS TG.png"
                alt="BAILS"
                fill
                className="object-cover scale-110"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white -mt-10">
              Enter Verification Code
            </h1>
            <p className="text-white/50 text-sm">
              We've sent a 6-digit code to {email || phone}
            </p>
          </div>

          {/* Card */}
          <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-purple-900/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {error}
                </div>
              )}

              {/* OTP Inputs */}
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    maxLength={1}
                    inputMode="numeric"
                    pattern="\d*"
                    autoComplete="one-time-code"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || otp.some(d => !d)}
                className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] text-white shadow-lg hover:shadow-md hover:shadow-[#4C1D95]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#6B46C1]"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <CricketLoader size={16} color="white" /> Verifying...
                  </span>
                ) : 'Verify & Continue'}
              </button>

              {/* Resend */}
              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-white/40">
                    Resend code in <span className="text-purple-400 font-medium">{timer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Resend Verification Code
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default function OTP() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex items-center justify-center">
        <CricketLoader size={32} color="white" />
      </div>
    }>
      <OTPContent />
    </Suspense>
  )
}
