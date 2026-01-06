'use client'

import { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { CricketLoader } from '@/components/ui/cricket-loader'
import { isValidEmail } from '@/lib/validation'
import { OTPVerificationForm } from './OTPVerificationForm'

interface LoginDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
    redirectTo?: string
}

export default function LoginDialog({ open, onOpenChange, onSuccess, redirectTo }: LoginDialogProps) {
    const router = useRouter()
    const { sendOTP } = useAuth()

    const [email, setEmail] = useState('')
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
            setError(null)
        }
        onOpenChange(open)
    }

    if (showOTP) {
        return (
            <Dialog open={open} onOpenChange={handleDialogChange}>
                <DialogContent className="sm:max-w-md bg-[#111111] border-white/10 z-[10000]">
                    <DialogDescription className="sr-only">
                        Enter the verification code sent to your email to log in
                    </DialogDescription>
                    <OTPVerificationForm
                        email={email}
                        onVerified={handleOTPSuccess}
                        onChangeNumber={() => setShowOTP(false)}
                        onResendOTP={() => sendOTP(email, 'email')}
                    />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="sm:max-w-md bg-[#111111] border-white/10 z-[10000]">
                <DialogHeader>
                    <DialogTitle className="text-white text-2xl font-bold text-center">Welcome to DoodLance</DialogTitle>
                    <DialogDescription className="text-white/50 text-sm text-center">
                        Sign in to continue
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleEmailSubmit} className="space-y-4 mt-4">
                    {error && (
                        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-white/70">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="bg-white/5 border-white/10 text-white pl-10"
                                autoFocus
                            />
                        </div>
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
