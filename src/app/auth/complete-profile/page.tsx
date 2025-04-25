'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'

type UserRole = 'client' | 'freelancer'

export default function CompleteProfile() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: '' as UserRole
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!user) {
      setError('You must be signed in to complete your profile')
      return
    }

    if (!formData.firstName || !formData.lastName) {
      setError('Please enter your full name')
      return
    }
    if (!formData.phoneNumber) {
      setError('Phone number is required')
      return
    }
    if (!formData.role) {
      setError('Please select a role')
      return
    }

    setLoading(true)
    try {
      if (!user?.id) {
        setError('You must be signed in to complete your profile')
        setLoading(false)
        return
      }

      // First, check if a profile already exists
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .limit(1)

      const existingProfile = profiles?.[0]

      // Prepare the profile data
      const profileData = {
        id: user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        role: formData.role,
        email: user.email,
        updated_at: new Date().toISOString()
      }

      let profileError
      if (existingProfile) {
        // Update existing profile
        console.log('Updating existing profile for user:', user.id)
        const { error } = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('id', user.id)
        profileError = error
      } else {
        // Insert new profile
        console.log('Creating new profile for user:', user.id)
        const { error } = await supabase
          .from('user_profiles')
          .insert({
            ...profileData,
            created_at: new Date().toISOString()
          })
        profileError = error
      }

      if (profileError) {
        console.error('Profile creation/update error:', JSON.stringify(profileError))
        setError('Failed to save profile. Please try again.')
        setLoading(false)
        return
      }

      console.log('Profile saved successfully')

      // Store the last used interface
      const redirectPath = formData.role === 'client' ? '/client' : '/freelancer'
      localStorage.setItem('lastUsedInterface', redirectPath)
      
      // Redirect to the appropriate dashboard
      router.push(redirectPath)
    } catch (err) {
      console.error('Error during profile completion:', JSON.stringify(err))
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please provide some additional information to complete your profile
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="First Name"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm bg-white"
              />
              <Input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Last Name"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm bg-white"
              />
            </div>
            
            <Input
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="Phone Number"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm bg-white"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">I want to:</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'client' })}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  formData.role === 'client'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Hire
              </Button>
              <Button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'freelancer' })}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  formData.role === 'freelancer'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Work
              </Button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 