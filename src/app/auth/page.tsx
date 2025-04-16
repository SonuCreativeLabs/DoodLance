"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, ArrowRight } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'

export default function Auth() {
  const [step, setStep] = useState<'login' | 'otp'>('login')
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone')

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome to LocalSkills</h1>
            <p className="text-gray-600">
              Connect with local service providers or monetize your skills
            </p>
          </div>

          {step === 'login' ? (
            <>
              {/* Login Method Toggle */}
              <div className="flex gap-4 mb-6">
                <button
                  className={`flex-1 py-2 rounded-lg ${
                    loginMethod === 'phone'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setLoginMethod('phone')}
                >
                  Phone
                </button>
                <button
                  className={`flex-1 py-2 rounded-lg ${
                    loginMethod === 'email'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setLoginMethod('email')}
                >
                  Email
                </button>
              </div>

              {/* Login Form */}
              <div className="space-y-4">
                <div className="relative">
                  {loginMethod === 'phone' ? (
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  ) : (
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  )}
                  <input
                    type={loginMethod === 'phone' ? 'tel' : 'email'}
                    placeholder={
                      loginMethod === 'phone'
                        ? 'Enter your phone number'
                        : 'Enter your email'
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => setStep('otp')}
                >
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>

              {/* Social Login */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full">
                    <img
                      src="/google.svg"
                      alt="Google"
                      className="w-5 h-5 mr-2"
                    />
                    Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    <img
                      src="/apple.svg"
                      alt="Apple"
                      className="w-5 h-5 mr-2"
                    />
                    Apple
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* OTP Verification */}
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                    Enter Verification Code
                  </h2>
                  <p className="text-gray-600">
                    We've sent a code to your {loginMethod}
                  </p>
                </div>

                <div className="flex gap-2 justify-center mb-6">
                  {[1, 2, 3, 4].map((digit) => (
                    <input
                      key={digit}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl font-semibold rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ))}
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    // Handle OTP verification
                    console.log('Verify OTP')
                  }}
                >
                  Verify
                </Button>

                <button
                  className="w-full text-center text-sm text-gray-600"
                  onClick={() => setStep('login')}
                >
                  Back to login
                </button>
              </div>
            </>
          )}

          <p className="text-sm text-muted-foreground">Don&apos;t have an account?</p>
        </motion.div>
      </div>
    </MainLayout>
  )
} 