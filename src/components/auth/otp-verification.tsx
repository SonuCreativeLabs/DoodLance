"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function OTPVerification({ 
  phoneNumber, 
  onVerify, 
  onResend 
}: { 
  phoneNumber: string
  onVerify: (otp: string) => void
  onResend: () => void
}) {
  const [otp, setOtp] = useState("")
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const handleResend = () => {
    onResend()
    setTimer(60)
    setCanResend(false)
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your phone</h2>
      <p className="text-gray-600 mb-6">
        We sent a verification code to {phoneNumber}
      </p>
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="text-center text-xl tracking-widest"
        />
        <Button
          onClick={() => onVerify(otp)}
          className="w-full bg-[#FF8A3D] hover:bg-[#ff7a24] text-white"
          disabled={otp.length !== 6}
        >
          Verify
        </Button>
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-[#FF8A3D] hover:text-[#ff7a24] font-medium"
            >
              Resend code
            </button>
          ) : (
            <p className="text-gray-500">
              Resend code in {timer} seconds
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 