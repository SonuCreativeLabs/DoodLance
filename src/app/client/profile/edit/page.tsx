"use client"

import React, { useState } from 'react'
import { User, Camera, ArrowLeft, Trash2, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useNavbar } from '@/contexts/NavbarContext'

export default function EditProfile() {
  const { setNavbarVisibility } = useNavbar()
  const router = useRouter()
  const [saved, setSaved] = useState(false)

  // Mock data - in real app, this would come from your user context/API
  const [formData, setFormData] = useState({
    name: 'Sonu',
    email: 'sonu@email.com',
    phone: '+91 98765 43210',
    location: 'Chennai, TN',
    avatar: '/images/profile-sonu.jpg'
  })

  React.useEffect(() => {
    setNavbarVisibility(false)
    return () => setNavbarVisibility(true)
  }, [setNavbarVisibility])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Show success state
      setSaved(true)

      // Navigate back after a short delay
      setTimeout(() => {
        router.push('/client/profile')
      }, 1500)
    } catch (error) {
      console.error('Failed to save profile:', error)
      // Handle error state here
    }
  }

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-30 bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] border-b border-white/10 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center relative">
          <Link href="/client/profile" aria-label="Back to Profile" className="relative z-10">
            <button className="flex items-center justify-center text-white/80 hover:text-white/100 p-2 -ml-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400/40" aria-label="Back">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>

          {/* Absolute centered title */}
          <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
            <span className="text-lg font-bold text-white">Edit Profile</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 max-w-2xl mx-auto">
        <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Image
                src={formData.avatar}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full border-2 border-purple-400/50 object-cover shadow-lg"
              />
              <button
                type="button"
                className="absolute bottom-2 right-2 p-2 bg-[#18181b] border border-white/20 rounded-full shadow-lg hover:bg-white/10 transition-colors group-hover:scale-110"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>
            <button
              type="button"
              className="text-red-400 text-sm hover:text-red-300 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Remove Photo
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/50"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/50"
                placeholder="Enter your email"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white/70 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/50"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-white/70 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#18181b] border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-400/50"
                placeholder="Enter your location"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white py-3 rounded-lg font-medium transition-all"
            >
              {saved ? (
                <>
                  <Check className="w-5 h-5" />
                  Profile Updated Successfully!
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="pt-6 border-t border-white/10">
            <h2 className="text-red-400 font-medium mb-4">Danger Zone</h2>
            <button
              type="button"
              className="px-4 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium w-full"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
