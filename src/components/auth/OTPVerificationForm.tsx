'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { maskPhoneNumber } from '@/lib/phone-utils';

interface OTPVerificationFormProps {
    phone: string;
    onVerified: (user: any, token: string) => void;
    onChangeNumber: () => void;
    onResendOTP: () => void;
}

export function OTPVerificationForm({
    phone,
    onVerified,
    onChangeNumber,
    onResendOTP,
}: OTPVerificationFormProps) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

        if (pastedData.length === 6) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);
            inputRefs.current[5]?.focus();
            handleVerify(pastedData);
        }
    };

    const handleVerify = async (code?: string) => {
        const otpCode = code || otp.join('');

        if (otpCode.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/otp/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, code: otpCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            setSuccess(true);
            setTimeout(() => {
                onVerified(data.user, data.token);
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Verification failed');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const maskedPhone = maskPhoneNumber(phone);

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Enter Verification Code</h2>
                <p className="text-gray-600">
                    We've sent a 6-digit code to
                    <br />
                    <span className="font-semibold">{maskedPhone}</span>
                </p>
                <button
                    type="button"
                    onClick={onChangeNumber}
                    className="text-sm text-purple-600 hover:text-purple-700 underline"
                >
                    Change number
                </button>
            </div>

            <div className="space-y-4">
                <Label className="text-center block">Enter OTP</Label>
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
                            className="w-12 h-12 text-center text-lg font-semibold"
                            disabled={loading || success}
                        />
                    ))}
                </div>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 text-center">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified successfully!
                </div>
            )}

            <div className="space-y-3">
                <Button
                    type="button"
                    onClick={() => handleVerify()}
                    className="w-full"
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
                        className="text-sm text-gray-600 hover:text-gray-800"
                        disabled={loading || success}
                    >
                        Didn't receive code? <span className="text-purple-600 underline">Resend</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
