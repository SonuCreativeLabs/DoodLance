'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPhoneNumber, validatePhoneNumber } from '@/lib/phone-utils';
import { Loader2, Phone } from 'lucide-react';

interface PhoneLoginFormProps {
    onOTPSent: (phone: string) => void;
}

export function PhoneLoginForm({ onOTPSent }: PhoneLoginFormProps) {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [canResend, setCanResend] = useState(true);
    const [countdown, setCountdown] = useState(0);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and + sign
        const cleaned = value.replace(/[^\d+]/g, '');
        setPhone(cleaned);
        setError('');
    };

    const startCountdown = () => {
        setCanResend(false);
        setCountdown(60);

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate phone number
        if (!phone) {
            setError('Please enter your phone number');
            return;
        }

        if (!validatePhoneNumber(phone)) {
            setError('Please enter a valid phone number (e.g., +919876543210)');
            return;
        }

        setLoading(true);

        try {
            const formattedPhone = formatPhoneNumber(phone);

            const response = await fetch('/api/auth/otp/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: formattedPhone }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send OTP');
            }

            startCountdown();
            onOTPSent(formattedPhone!);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="pl-10"
                        disabled={loading}
                        autoComplete="tel"
                    />
                </div>
                <p className="text-xs text-gray-500">
                    Enter your phone number with country code (e.g., +91 for India)
                </p>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={loading || !canResend}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                    </>
                ) : countdown > 0 ? (
                    `Resend OTP in ${countdown}s`
                ) : (
                    'Send OTP'
                )}
            </Button>
        </form>
    );
}
