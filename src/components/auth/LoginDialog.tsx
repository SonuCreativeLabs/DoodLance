'use client'

import { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { CricketLoader } from '@/components/ui/cricket-loader'
import { isValidEmail } from '@/lib/validation'
import OTPVerificationForm from './OTPVerificationForm'

interface LoginDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
    redirectTo?: string
}

export default function LoginDialog({ open, onOpenChange, onSuccess, redirectTo }: LoginDialogProps) {
    const router = useRouter()
    const { sendOTP } = useAuth()

    const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [countryCode, setCountryCode] = useState('+91')
    const [showOTP, setShowOTP] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address')
            return
        }

        setIsLoading(true)
        try {
            await sendOTP(email, 'email')
            setShowOTP(true)
        } catch (err) {
            setError('Failed to send verification code. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const formattedPhone = countryCode + phone.replace(/\D/g, '')

        if (!/^[1-9]\d{1,14}$/.test(formattedPhone.replace('+', ''))) {
            setError('Please enter a valid phone number')
            return
        }

        setIsLoading(true)
        try {
            await sendOTP(formattedPhone, 'phone')
            setShowOTP(true)
        } catch (err) {
            setError('Failed to send verification code. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleOTPSuccess = useCallback(() => {
        // Close dialog
        onOpenChange(false)

        // Call success callback if provided
        if (onSuccess) {
            onSuccess()
        }

        // Redirect if path provided
        if (redirectTo) {
            router.push(redirectTo)
        }
    }, [onOpenChange, onSuccess, redirectTo, router])

    const handleDialogChange = (open: boolean) => {
        if (!open) {
            // Reset state when closing
            setShowOTP(false)
            setEmail('')
            setPhone('')
            setError(null)
        }
        onOpenChange(open)
    }

    if (showOTP) {
        const identifier = activeTab === 'email' ? email : countryCode + phone
        return (
            <Dialog open={open} onOpenChange={handleDialogChange}>
                <DialogContent className="sm:max-w-md bg-[#111111] border-white/10">
                    <OTPVerificationForm
                        identifier={identifier}
                        type={activeTab}
                        onSuccess={handleOTPSuccess}
                        onBack={() => setShowOTP(false)}
                    />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="sm:max-w-md bg-[#111111] border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-white text-2xl font-bold text-center">Welcome to DoodLance</DialogTitle>
                    <p className="text-white/50 text-sm text-center">Sign in to continue</p>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'email' | 'phone')} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/5">
                        <TabsTrigger value="email" className="data-[state=active]:bg-purple-600">
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                        </TabsTrigger>
                        <TabsTrigger value="phone" className="data-[state=active]:bg-purple-600">
                            <Smartphone className="w-4 h-4 mr-2" />
                            Phone
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email" className="space-y-4 mt-4">
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            {error && (
                                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/70">Email Address</label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="bg-white/5 border-white/10 text-white"
                                    autoFocus
                                />
                                <p className="text-[10px] text-white/30">
                                    We'll send you a 6-digit verification code
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading || !email}
                                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:opacity-90"
                            >
                                {isLoading ? (
                                    <>
                                        <CricketLoader size={20} color="white" /> Sending...
                                    </>
                                ) : (
                                    <>
                                        Get OTP <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="phone" className="space-y-4 mt-4">
                        <form onSubmit={handlePhoneSubmit} className="space-y-4">
                            {error && (
                                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-white/70">Phone Number</label>
                                <div className="flex gap-2">
                                    <select
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                        className="w-24 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                                    >
                                        <option value="+91">🇮🇳 +91</option>
                                        <option value="+1">🇺🇸 +1</option>
                                        <option value="+44">🇬🇧 +44</option>
                                    </select>
                                    <Input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        placeholder="6379496755"
                                        maxLength={10}
                                        className="flex-1 bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading || !phone}
                                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:opacity-90"
                            >
                                {isLoading ? (
                                    <>
                                        <CricketLoader size={20} color="white" /> Sending...
                                    </>
                                ) : (
                                    <>
                                        Get OTP <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>

                <div className="mt-4 pt-4 border-t border-white/5 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-white/30">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Secure & Passwordless Login</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
