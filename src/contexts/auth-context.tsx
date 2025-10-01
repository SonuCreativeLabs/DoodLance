'use client'

import { createContext, useContext } from 'react'

type AuthContextType = {
  user: null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: { message: string } }>
  signUp: (email: string, password: string) => Promise<{ error: { message: string }, data?: undefined }>
  signOut: () => Promise<void>
  resendVerificationEmail: (email: string) => Promise<{ error: { message: string } }>
}

const disabledResponse = { error: { message: 'Authentication is disabled in this demo build.' } }

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value: AuthContextType = {
    user: null,
    loading: false,
    signIn: async () => disabledResponse,
    signUp: async () => disabledResponse,
    signOut: async () => {},
    resendVerificationEmail: async () => disabledResponse,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
 