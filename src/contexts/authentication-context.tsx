"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

type AuthContextType = {
  isAuthenticated: boolean
  role: "client" | "freelancer" | null
  phoneNumber: string | null
  login: (phone: string, role: "client" | "freelancer") => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role, setRole] = useState<"client" | "freelancer" | null>(null)
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated in localStorage
    const storedAuth = localStorage.getItem("auth")
    if (storedAuth) {
      const { isAuthenticated, role, phoneNumber } = JSON.parse(storedAuth)
      setIsAuthenticated(isAuthenticated)
      setRole(role)
      setPhoneNumber(phoneNumber)
    }
  }, [])

  const login = (phone: string, userRole: "client" | "freelancer") => {
    setIsAuthenticated(true)
    setRole(userRole)
    setPhoneNumber(phone)
    localStorage.setItem(
      "auth",
      JSON.stringify({ isAuthenticated: true, role: userRole, phoneNumber: phone })
    )
    router.push("/")
  }

  const logout = () => {
    setIsAuthenticated(false)
    setRole(null)
    setPhoneNumber(null)
    localStorage.removeItem("auth")
    router.push("/auth")
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, phoneNumber, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 