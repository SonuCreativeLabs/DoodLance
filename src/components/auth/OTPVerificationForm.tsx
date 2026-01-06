'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface OTPVerificationFormProps {
    email: string;
    onVerified: () => void;
    onChangeNumber: () => void;
    onResendOTP: () => void;
}

export function OTPVerificationForm({
    email,
    onVerified,
    onChangeNumber,
    onResendOTP,
}: OTPVerificationFormProps) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { verifyOTP } = useAuth();

    useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits are entered
        if (index === 5 && value) {
            const code = [...newOtp.slice(0, 5), value].join('');
            handleVerify(code);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];

        pastedData.split('').forEach((char, index) => {
            if (index < 6) {
                newOtp[index] = char;
            }
        });

        setOtp(newOtp);

        // Focus last filled input
        const lastIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastIndex]?.focus();

        // Auto-verify if complete
        if (pastedData.length === 6) {
            handleVerify(pastedData);
        }
    };

    const handleVerify = async (otpCode?: string) => {
        const code = otpCode || otp.join('');

        if (code.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await verifyOTP(email, code, 'email');
            setSuccess(true);
            setTimeout(() => {
                onVerified();
            }, 500);
        } catch (err: any) {
            setError(err?.message || 'Verification failed. Please try again.');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">Enter Verification Code</h2>
                <p className="text-white/60 text-sm">
                    We've sent a 6-digit code to
                    <br />
                    <span className="font-semibold text-white">{email}</span>
                </p>
                <button
                    type="button"
                    onClick={onChangeNumber}
                    className="text-sm text-purple-400 hover:text-purple-300 underline"
                >
                    Change email
                </button>
            </div>

            <div className="space-y-4">
                <div className="flex gap-2 justify-center">
                    {otp.map((digit, index) => (
                        <Input
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            className="w-12 h-12 text-center text-lg font-semibold bg-white/5 border-white/10 text-white focus:border-purple-500"
                            disabled={loading || success}
                        />
                    ))}
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 text-center">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-md bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-400 text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified successfully!
                </div>
            )}

            <div className="space-y-3">
                <Button
                    type="button"
                    onClick={() => handleVerify()}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:opacity-90"
                    disabled={loading || success || otp.some((d) => !d)}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                        </>
                    ) : success ? (
                        'Verified!'
                    ) : (
                        'Verify OTP'
                    )}
                </Button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={onResendOTP}
                        className="text-sm text-white/50 hover:text-white/70"
                        disabled={loading || success}
                    >
                        Didn't receive code? <span className="text-purple-400 underline">Resend</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
