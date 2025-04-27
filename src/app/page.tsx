"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Home() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // If user is logged in, check if they have completed their profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role, is_profile_complete')
          .eq('id', session.user.id)
          .single()

        if (!profile || !profile.is_profile_complete) {
          router.push('/auth/complete-profile')
        } else if (profile.role === 'freelancer') {
          router.push('/freelancer/feed')
        } else {
          router.push('/client/home')
        }
      } else {
        // If no session, redirect to sign in after splash screen
        router.push('/auth/signin')
      }
    }

    // Wait for splash screen animation to complete
    const timer = setTimeout(checkSession, 3500) // 3s for splash + 0.5s for fade out
    return () => clearTimeout(timer)
  }, [router, supabase])

  // Return empty div as splash screen is handled by layout
  return <div />
} 