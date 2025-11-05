'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (provider?: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // TODO: Check AuthKit session state
        // For now, we'll assume no session exists
        // const response = await fetch('/api/auth/session')
        // if (response.ok) {
        //   const sessionData = await response.json()
        //   setUser(sessionData.user)
        // }
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

  const signOut = async () => {
    try {
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
