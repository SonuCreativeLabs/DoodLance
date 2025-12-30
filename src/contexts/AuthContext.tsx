'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
  phone?: string
  location?: string
  phoneVerified?: boolean
  role?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (provider?: string) => void
  signOut: () => Promise<void>
  verifyOTP: (identifier: string, code: string, type?: 'email' | 'phone') => Promise<void>
  sendOTP: (identifier: string, type?: 'email' | 'phone') => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          phone: session.user.phone,
          role: session.user.user_metadata?.role || 'client',
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
          avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.avatar || '',
          location: session.user.user_metadata?.location || '',
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signIn = async (provider?: string) => {
    // Legacy support or OAuth
    if (provider === 'google') {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      })
    }
  }

  const sendOTP = async (identifier: string, type: 'email' | 'phone' = 'email') => {
    if (type === 'email') {
      const { error } = await supabase.auth.signInWithOtp({
        email: identifier,
        options: {
          shouldCreateUser: true,
        }
      })
      if (error) throw error
    } else {
      const { error } = await supabase.auth.signInWithOtp({ phone: identifier })
      if (error) throw error
    }
  }

  const verifyOTP = async (identifier: string, code: string, type: 'email' | 'phone' = 'email') => {
    if (type === 'email') {
      const { error } = await supabase.auth.verifyOtp({
        email: identifier,
        token: code,
        type: 'email'
      })
      if (error) throw error
    } else {
      const { error } = await supabase.auth.verifyOtp({
        phone: identifier,
        token: code,
        type: 'sms'
      })
      if (error) throw error
    }

    // User is set automatically by onAuthStateChange
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
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
    message: 'Use Supabase for authentication.',
    status: 501,
  },
  data: null,
})
