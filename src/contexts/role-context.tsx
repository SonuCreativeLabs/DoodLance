"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Role = "client" | "freelancer"

interface RoleContextType {
  role: Role
  switchRole: () => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("client")

  const switchRole = () => {
    setRole(prev => prev === "client" ? "freelancer" : "client")
  }

  return (
    <RoleContext.Provider value={{ role, switchRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  // Fallback to a safe default to avoid runtime crashes when the provider
  // isn't mounted yet (e.g., in dev during fast refresh or isolated renders)
  if (context === undefined) {
    return { role: "client", switchRole: () => {} }
  }
  return context
} 