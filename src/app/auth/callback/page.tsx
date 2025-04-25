'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the session to check if the user is authenticated
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Check if user has a profile with role
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()

          if (profile?.role) {
            // If user has a role, redirect to their interface
            const redirectPath = profile.role === 'client' ? '/client' : '/freelancer'
            localStorage.setItem('lastUsedInterface', redirectPath)
            router.push(redirectPath)
          } else {
            // If no role is set, redirect to complete profile
            router.push('/auth/complete-profile')
          }
        } else {
          // If no session, redirect to sign in
          router.push('/auth/signin')
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        router.push('/auth/signin')
      }
    }

    handleEmailConfirmation()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Verifying your email...
        </h2>
        <p className="text-gray-600 text-center">
          Please wait while we confirm your email address.
        </p>
      </div>
    </div>
  )
} 