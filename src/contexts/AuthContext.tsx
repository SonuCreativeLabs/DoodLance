'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
  profileImage?: string
  phone?: string
  location?: string
  phoneVerified?: boolean
  role?: string
  createdAt?: string
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Set user immediately to unblock login
        setUser({
          id: session.user.id,
          email: session.user.email,
          phone: session.user.user_metadata?.phone || '',
          role: session.user.user_metadata?.role || 'client',
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
          avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.avatar || '',
          profileImage: session.user.user_metadata?.avatar_url || session.user.user_metadata?.avatar || '',
          location: session.user.user_metadata?.location || '',
          createdAt: session.user.created_at,
        })
        setIsLoading(false)

        //Fetch DB data in background
        setTimeout(async () => {
          try {
            console.log('🔍 Fetching user data from database...')
            const { data, error: fetchError } = await supabase
              .from('users')
              .select('name,phone,location,avatar,createdAt,email,gender')
              .eq('id', session.user.id)
              .single()

            console.log('📊 Database response:', { data, error: fetchError })

            if (fetchError && fetchError.code === 'PGRST116') {
              console.log('👤 User not found in DB, creating...')
              await supabase.from('users').insert({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || 'User',
                avatar: session.user.user_metadata?.avatar_url || '',
                created_at: new Date().toISOString(),
              })
            } else if (data) {
              console.log('✅ Updating user with DB data:', {
                phone: data.phone,
                name: data.name,
                location: data.location
              })
              setUser(prev => ({
                ...prev!,
                phone: data.phone || prev!.phone,
                name: data.name || prev!.name,
                avatar: data.avatar || prev!.avatar,
                profileImage: data.avatar || prev!.profileImage,
                location: data.location || prev!.location,
                email: data.email || prev!.email || '',
                createdAt: (data as any).created_at || prev!.createdAt,
              }))
            }
          } catch (dbError) {
            console.warn('Failed to fetch user data:', dbError)
          }
        }, 0)

        // Sync session
        try {
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user: {
                id: session.user.id,
                email: session.user.email,
                role: session.user.user_metadata?.role || 'client'
              }
            })
          });
        } catch (err) {
          console.error('Failed to sync session:', err);
        }
      } else {
        setUser(null)
        setIsLoading(false)
      }
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
    // Only support email OTP
    const { error } = await supabase.auth.signInWithOtp({
      email: identifier,
      options: {
        shouldCreateUser: true,
      }
    })
    if (error) throw error
  }

  const verifyOTP = async (identifier: string, code: string, type: 'email' | 'phone' = 'email') => {
    // Only support email OTP verification
    const { error } = await supabase.auth.verifyOtp({
      email: identifier,
      token: code,
      type: 'email'
    })
    if (error) throw error

    // User is set automatically by onAuthStateChange
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
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
