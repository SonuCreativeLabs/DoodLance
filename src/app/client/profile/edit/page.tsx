"use client"

import { useState } from 'react'
import { User, Camera, ArrowLeft, Trash2 } from 'lucide-react'
import Image from 'next/image'
// import Link from 'next/link' // Unused
import { useRouter } from 'next/navigation'

export default function EditProfile() {
  const router = useRouter()
  // Mock data - in real app, this would come from your user context/API
  const [formData, setFormData] = useState({
    name: 'Sonu',
    email: 'sonu@email.com',
    phone: '+91 98765 43210',
    location: 'Chennai, TN',
    avatar: '/images/profile-sonu.jpg'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically:
    // 1. Validate the form data
    // 2. Make an API call to update the profile
    // 3. Handle success/error states
    // For now, we'll just redirect back
    router.push('/client/profile')
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#18192A] to-[#23243a]">
      {/* App Bar Header */}
      <header className="fixed top-0 left-0 w-full z-30 bg-[#111111] border-b border-white/10 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-xl font-semibold text-white">Edit Profile</h1>
          </div>
          <button
            type="submit"
            form="edit-profile-form"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </header>
      <div className="h-16 md:h-20" /> {/* Spacer for fixed header */}

      <main className="container max-w-2xl mx-auto px-4 py-8">
        <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-md" />
              <Image 
                src={formData.avatar} 
                alt="Profile" 
                width={120} 
                height={120} 
                className="rounded-full border-4 border-white/20 object-cover relative"
              />
              <button
                type="button"
                className="absolute bottom-2 right-2 p-2 bg-[#111111] border border-white/20 rounded-full shadow-lg hover:bg-white/10 transition-colors group-hover:scale-110"
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
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/60 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your email"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white/60 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-white/60 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your location"
              />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-8 border-t border-white/10">
            <h2 className="text-red-400 font-medium mb-4">Danger Zone</h2>
            <button
              type="button"
              className="px-4 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium w-full"
            >
              Delete Account
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
