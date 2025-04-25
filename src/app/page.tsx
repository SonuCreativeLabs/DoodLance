"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRole } from '@/contexts/role-context'

export default function Home() {
  const router = useRouter()
  const { role, switchRole } = useRole()

  useEffect(() => {
    // Check if this is first time after signup
    const isFirstTimeAfterSignup = sessionStorage.getItem('isNewSignup')
    const selectedRole = sessionStorage.getItem('selectedRole')
    
    if (isFirstTimeAfterSignup === 'true' && selectedRole) {
      // Clear the first-time flag
      sessionStorage.removeItem('isNewSignup')
      
      // Set the role based on signup selection
      if (selectedRole !== role) {
        switchRole()
      }
      
      // Redirect to appropriate interface
      const redirectPath = selectedRole === 'freelancer' ? '/freelancer' : '/client'
      // Store as last used interface
      localStorage.setItem('lastUsedInterface', redirectPath)
      router.push(redirectPath)
      return
    }

    // For subsequent sign-ins, use last used interface
    const lastUsedInterface = localStorage.getItem('lastUsedInterface')
    if (lastUsedInterface) {
      // Ensure role matches the interface
      const shouldBeFreelancer = lastUsedInterface === '/freelancer'
      if ((shouldBeFreelancer && role !== 'freelancer') || 
          (!shouldBeFreelancer && role !== 'client')) {
        switchRole()
      }
      router.push(lastUsedInterface)
      return
    }

    // Default fallback (first time ever or no stored preference)
    const defaultPath = role === 'freelancer' ? '/freelancer' : '/client'
    localStorage.setItem('lastUsedInterface', defaultPath)
    router.push(defaultPath)
  }, [router, role, switchRole])

  // Return null or loading state while redirecting
  return null
} 