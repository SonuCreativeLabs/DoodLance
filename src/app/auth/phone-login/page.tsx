'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Smartphone, ArrowRight, ShieldCheck, Mail, Info } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { CricketLoader } from '@/components/ui/cricket-loader'

export default function PhoneLogin() {
    const router = useRouter()
    const { sendOTP } = useAuth()

    const [phone, setPhone] = useState('')
    const [countryCode, setCountryCode] = useState('+91') // Default to India
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isValidPhone = (val: string) => /^[1-9]\d{1,14}$/.test(val)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // Format phone number with country code
        let formattedPhone = phone.trim().replace(/[\s-]/g, '');

        // Add country code
        formattedPhone = countryCode + formattedPhone;

        if (!isValidPhone(formattedPhone.replace('+', ''))) {
            setError('Please enter a valid 10-digit phone number')
            return
        }

        setIsLoading(true)
        try {
            // Send OTP via API
            await sendOTP(formattedPhone, 'phone')

            router.push(`/auth/otp?phone=${encodeURIComponent(formattedPhone)}`)
        } catch (err) {
            setError('Failed to send verification code. Please try again.')
            setIsLoading(false)
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
                        <div className="relative w-32 h-32 mx-auto mb-0 overflow-hidden">
                            <Image
                                src="/images/LOGOS/Doodlance Logo.svg"
                                alt="DoodLance"
                                fill
                                className="object-cover scale-110"
                                priority
                            />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white -mt-10">
                            Developer Login
                        </h1>
                        <p className="text-white/50 text-sm">
                            Phone login with mock data access
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex items-start gap-3">
                        <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-white/70">
                            <p className="font-medium text-white mb-1">Mock Data Access</p>
                            
                        </div>
                    </div>

                    {/* Card */}
                    <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-purple-900/20">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 flex items-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                    {error}
                                </motion.div>
                            )}

                            {/* Country Code & Phone Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/70 ml-1">Phone Number</label>
                                <div className="flex gap-2">
                                    {/* Country Code Dropdown */}
                                    <select
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                        className="w-24 px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                                    >
                                        <option value="+91">🇮🇳 +91</option>
                                        <option value="+1">🇺🇸 +1</option>
                                        <option value="+44">🇬🇧 +44</option>
                                        <option value="+61">🇦🇺 +61</option>
                                        <option value="+971">🇦🇪 +971</option>
                                        <option value="+65">🇸🇬 +65</option>
                                        <option value="+86">🇨🇳 +86</option>
                                        <option value="+81">🇯🇵 +81</option>
                                    </select>

                                    {/* Phone Input */}
                                    <div className="relative group flex-1">
                                        <Smartphone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                            placeholder="6379496755"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-base text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
                                            autoComplete="tel"
                                            autoFocus
                                            maxLength={10}
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-white/30 ml-1">
                                    OTP will use fixed code: <span className="font-mono font-bold">123456</span>
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || !phone}
                                className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] text-white hover:opacity-90 shadow-lg hover:shadow-md hover:shadow-[#4C1D95]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <CricketLoader size={20} color="white" /> Sending...
                                    </>
                                ) : (
                                    <>
                                        Get OTP <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-[#111111] px-3 text-white/40">OR</span>
                            </div>
                        </div>

                        {/* Email Login Link */}
                        <Link
                            href="/auth/login"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                        >
                            <Mail className="w-4 h-4" />
                            Sign in with Email
                        </Link>

                        <div className="mt-6 pt-6 border-t border-white/5 text-center">
                            <div className="flex items-center justify-center gap-2 text-xs text-white/30">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Secure & Passwordless Login</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-white/30 max-w-xs mx-auto">
                        By continuing, you agree to our{' '}
                        <Link href="/legal/terms" className="text-white/50 hover:text-white transition-colors underline decoration-white/20 hover:decoration-white/50">Terms of Service</Link>
                        {' '}and{' '}
                        <Link href="/legal/privacy" className="text-white/50 hover:text-white transition-colors underline decoration-white/20 hover:decoration-white/50">Privacy Policy</Link>
                    </p>
                </motion.div>
            </main>
        </div>
    )
}
