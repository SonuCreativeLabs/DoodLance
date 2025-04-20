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
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
} 