'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { isValidEmail } from '@/lib/validation'

interface EmailLoginFormProps {
    onSuccess: (email: string) => void
}

export function EmailLoginForm({ onSuccess }: EmailLoginFormProps) {
    const { sendOTP } = useAuth()
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [countdown, setCountdown] = useState(0)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address')
            return
        }

        setIsLoading(true)
        try {
            await sendOTP(email, 'email')
            onSuccess(email)

            // Start 60-second countdown
            setCountdown(60)
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        } catch (err) {
            setError('Failed to send verification code. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-xs font-medium text-white/70 ml-1">Email Address</label>
                <div className="relative group">
                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-base text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                        autoComplete="email"
                        autoFocus
                        disabled={isLoading || countdown > 0}
                    />
                </div>
                <p className="text-[10px] text-white/30 ml-1">
                    We'll send you a 6-digit verification code.
                </p>
            </div>

            <button
                type="submit"
                disabled={isLoading || countdown > 0 || !email}
                className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] text-white hover:opacity-90 shadow-lg hover:shadow-md hover:shadow-[#4C1D95]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform active:scale-[0.98]"
            >
                {countdown > 0 ? `Resend in ${countdown}s` : isLoading ? 'Sending...' : 'Send OTP'}
            </button>
        </form>
    )
}
