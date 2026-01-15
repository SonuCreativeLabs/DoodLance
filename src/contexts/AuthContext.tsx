'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react'
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
  isVerified?: boolean
}

// 🎯 Stable auth identity (never changes except on login/logout)
interface AuthUser {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  authUser: AuthUser | null  // 🆕 Stable identity for React Query keys
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (provider?: string) => void
  signOut: () => Promise<void>
  verifyOTP: (identifier: string, code: string, type?: 'email' | 'phone') => Promise<void>
  sendOTP: (identifier: string, type?: 'email' | 'phone') => Promise<void>
  refreshUser: (userData?: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (user) console.log('👤 AuthContext User Updated:', user.id, user.name);
  }, [user]);

  const [isLoading, setIsLoading] = useState(true)
  const [supabase] = useState(() => createClient())
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

        //Fetch DB data in background via API
        // Fetch DB data in background via API - only if needed or after 5 minutes
        const lastAuthFetch = parseInt(sessionStorage.getItem('lastAuthFetch') || '0');
        const now = Date.now();
        const shouldFetch = !user?.phone || (now - lastAuthFetch > 5 * 60 * 1000);

        if (shouldFetch) {
          setTimeout(async () => {
            try {
              console.log('🔍 Fetching user data from API...');
              const response = await fetch('/api/user/profile');

              if (response.ok) {
                const data = await response.json();
                console.log('✅ Updating user with API data:', {
                  phone: data.phone,
                  name: data.name
                });

                setUser(prev => ({
                  ...prev!,
                  phone: data.phone || prev!.phone,
                  name: data.name || prev!.name,
                  avatar: data.avatar || prev!.avatar,
                  profileImage: data.avatar || prev!.profileImage,
                  location: data.location || prev!.location,
                  email: data.email || prev!.email || '',
                  createdAt: data.createdAt || prev!.createdAt,
                }));

                sessionStorage.setItem('lastAuthFetch', Date.now().toString());
              } else if (response.status === 404) {
                console.log('👤 User not found in DB - will be created on first profile update');
              }
            } catch (dbError) {
              console.warn('Failed to fetch user data:', dbError);
            }
          }, 0);
        } else {
          console.log('📦 Using cached auth user data');
        }

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

  // 🎯 Create stable auth identity (only recreates when id/email changes)
  const authUser = useMemo<AuthUser | null>(
    () => user ? { id: user.id, email: user.email || '' } : null,
    [user?.id, user?.email]
  )

  const signIn = useCallback(async (provider?: string) => {
    // Legacy support or OAuth
    if (provider === 'google') {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      })
    }
  }, [supabase])

  const sendOTP = useCallback(async (identifier: string, type: 'email' | 'phone' = 'email') => {
    // Only support email OTP
    const { error } = await supabase.auth.signInWithOtp({
      email: identifier,
      options: {
        shouldCreateUser: true,
      }
    })
    if (error) throw error
  }, [supabase])

  const verifyOTP = useCallback(async (identifier: string, code: string, type: 'email' | 'phone' = 'email') => {
    // Only support email OTP verification
    const { error } = await supabase.auth.verifyOtp({
      email: identifier,
      token: code,
      type: 'email'
    })
    if (error) throw error
    // User is set automatically by onAuthStateChange
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }, [supabase, router])

  const refreshUser = useCallback(async (userData?: Partial<User>) => {
    // If userData is provided directly, use it to update state immediately (Optimistic/Sync)
    if (userData && user) {
      console.log('✅ Updating auth user with provided data:', userData);
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          ...userData
        };
      });
      return;
    }

    // Allow manual refresh of user data via API
    if (user?.id) {
      try {
        console.log('🔍 Manually refreshing user data...')
        const response = await fetch('/api/user/profile')

        if (response.ok) {
          const data = await response.json()
          console.log('✅ Updating user with API data:', {
            phone: data.phone,
            name: data.name,
            location: data.location
          })
          setUser(prev => {
            if (!prev) return null;
            return {
              ...prev,
              ...data, // Spread all data including isVerified, phoneVerified etc
              // Explicitly map specific fields if needed, but spread is safer for completeness
              phone: data.phone || prev.phone,
              name: data.name || prev.name,
              avatar: data.avatar || prev.avatar,
              profileImage: data.avatar || prev.profileImage,
              location: data.location || prev.location,
              email: data.email || prev.email || '',
              createdAt: data.createdAt || prev.createdAt,
              role: data.role || prev.role,
              isVerified: data.isVerified ?? prev.isVerified,
            }
          })
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error)
        // Don't throw invalidation errors to UI
      }
    }
  }, [user?.id]); // Only recreate if user ID changes (login different user) - STABLE across updates

  // ✅ Memoize value to prevent cascade refetches when user object reference changes
  const value = useMemo(() => ({
    user,
    authUser,  // 🆕 Expose stable identity
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    verifyOTP,
    sendOTP,
    refreshUser
  }), [user, authUser, isLoading, signIn, signOut, verifyOTP, sendOTP, refreshUser]) // Re-create value when user object updates

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
