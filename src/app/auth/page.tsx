"use client"

import { useState, useEffect } from "react"
import SplashScreen from "@/components/auth/splash-screen"
import PhoneInput from "@/components/auth/phone-input"
import OTPVerification from "@/components/auth/otp-verification"
import RoleSelection from "@/components/auth/role-selection"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/authentication-context"

type AuthStep = "splash" | "phone" | "otp" | "role"

export default function AuthPage() {
  const [step, setStep] = useState<AuthStep>("splash")
  const [phoneNumber, setPhoneNumber] = useState("")
  const router = useRouter()
  const { isAuthenticated, login } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (step === "splash") {
      const timer = setTimeout(() => {
        setStep("phone")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [step])

  const handlePhoneSubmit = (phone: string) => {
    setPhoneNumber(phone)
    setStep("otp")
  }

  const handleOTPVerify = (otp: string) => {
    // Here you would typically verify the OTP with your backend
    console.log("Verifying OTP:", otp)
    setStep("role")
  }

  const handleOTPResend = () => {
    // Here you would typically resend the OTP
    console.log("Resending OTP to:", phoneNumber)
  }

  const handleRoleSelect = (role: "client" | "freelancer") => {
    login(phoneNumber, role)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {step === "splash" && <SplashScreen />}
      {step === "phone" && <PhoneInput onNext={handlePhoneSubmit} />}
      {step === "otp" && (
        <OTPVerification
          phoneNumber={phoneNumber}
          onVerify={handleOTPVerify}
          onResend={handleOTPResend}
        />
      )}
      {step === "role" && <RoleSelection onSelect={handleRoleSelect} />}
    </div>
  )
} 