'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
  phone?: string
  phoneVerified?: boolean
  role?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (provider?: string) => void
  signOut: () => void
  verifyOTP: (identifier: string, code: string, type?: 'email' | 'phone') => Promise<void>
  sendOTP: (identifier: string, type?: 'email' | 'phone') => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for mock session in localStorage for dev flow
        const storedUser = localStorage.getItem('doodlance_mock_user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
        // TODO: Check AuthKit session state
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = (provider?: string) => {
    // Redirect to AuthKit login (will redirect to client home after auth)
    const url = provider ? `/api/auth/login?provider=${provider}&returnTo=/client` : '/api/auth/login?returnTo=/client'
    window.location.href = url
  }

  const sendOTP = async (identifier: string, type: 'email' | 'phone' = 'email') => {
    const payload = type === 'email' ? { email: identifier } : { phone: identifier }

    const response = await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('Failed to send OTP')
    }
  }

  const verifyOTP = async (identifier: string, code: string, type: 'email' | 'phone' = 'email') => {
    const payload = type === 'email' ? { email: identifier, code } : { phone: identifier, code }

    const response = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Verification failed')
    }

    const data = await response.json()
    const verifiedUser = data.user

    // Set user session
    setUser(verifiedUser)
    localStorage.setItem('doodlance_mock_user', JSON.stringify(verifiedUser))
  }

  const signOut = async () => {
    try {
      // Clear mock session
      localStorage.removeItem('doodlance_mock_user')

      // Call AuthKit logout and redirect to home
      await fetch('/api/auth/logout?returnTo=/', { method: 'POST' })
      setUser(null)
      // Redirect to home page
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out failed:', error)
      // Fallback redirect
      window.location.href = '/'
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    verifyOTP,
    sendOTP,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Legacy export for backward compatibility
export const signUp = async () => ({
  error: {
    message: 'Use AuthKit for authentication.',
    status: 501,
  },
  data: null,
})
