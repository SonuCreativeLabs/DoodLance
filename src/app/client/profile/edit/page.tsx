"use client"

import React, { useState, useEffect } from 'react'
import { User, Camera, ArrowLeft, Trash2, Check, Loader2, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useNavbar } from '@/contexts/NavbarContext'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"

export default function EditProfile() {
  const { setNavbarVisibility } = useNavbar()
  const { user, signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') // Get the return path if exists
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    avatar: ''
  })

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    location?: string;
    avatar?: string;
  }>({})

  // Initialize form data from AuthContext user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: (user as any)?.location || '',
        avatar: user.avatar || ''
      })
    }
  }, [user])

  useEffect(() => {
    setNavbarVisibility(false)
    return () => setNavbarVisibility(true)
  }, [setNavbarVisibility])

  const validateForm = () => {
    const newErrors: typeof errors = {}
    let isValid = true

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required'
      isValid = false
    } else if (formData.name.trim().toLowerCase() === 'new user') {
      newErrors.name = 'Please enter your real name'
      isValid = false
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required'
      isValid = false
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be exactly 10 digits'
      isValid = false
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
      isValid = false
    }

    // Avatar validation
    if (!formData.avatar) {
      newErrors.avatar = 'Profile picture is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!validateForm()) {
      toast.error("Please fix the errors before saving")
      return
    }

    setSaving(true)
    try {
      console.log('💾 Saving profile with data:', formData)

      // 1. Update User table via API (Bypasses RLS issues)
      const response = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          avatarUrl: formData.avatar
        })
      });

      if (!response.ok) throw new Error('Failed to update profile');

      console.log('✅ Database updated successfully')

      // 2. Update Supabase Auth Metadata (to reflect in other parts of app immediately)
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.name,
          avatar_url: formData.avatar,
          location: formData.location,
          phone: formData.phone
        }
      })

      if (authError) {
        console.error('❌ Auth update error:', authError)
        throw authError
      }

      console.log('✅ Auth metadata updated successfully')

      // Manually update AuthContext instead of reloading
      if (user) {
        user.name = formData.name
        user.phone = formData.phone
        user.location = formData.location
        user.avatar = formData.avatar
      }

      // Show success state
      setSaved(true)
      toast.success("Profile updated successfully")

      // Navigate back after delay
      setTimeout(() => {
        router.push(returnTo ? decodeURIComponent(returnTo) : '/client/profile')
      }, 1500)
    } catch (error) {
      console.error('Failed to save profile:', error)
      toast.error("Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  // Compress image before upload
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new window.Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')!

          // Max width/height for profile pictures
          const MAX_SIZE = 400
          let width = img.width
          let height = img.height

          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_SIZE) {
              height = (height * MAX_SIZE) / width
              width = MAX_SIZE
            }
          } else {
            if (height > MAX_SIZE) {
              width = (width * MAX_SIZE) / height
              height = MAX_SIZE
            }
          }

          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                })
                resolve(compressedFile)
              } else {
                reject(new Error('Canvas to Blob conversion failed'))
              }
            },
            'image/jpeg',
            0.7 // 70% quality - good balance between size and quality
          )
        }
        img.onerror = reject
      }
      reader.onerror = reject
    })
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setUploading(true)
    setUploadProgress(20)
    try {
      // Compress image first
      toast.info('Compressing image...')
      const compressedFile = await compressImage(file)
      setUploadProgress(60)

      // Create unique filename
      const fileExt = 'jpg' // Always use jpg after compression
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase storage
      toast.info('Uploading...')
      setUploadProgress(80)
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath)

      setUploadProgress(100)
      // Update form data with optimistic update
      setFormData(prev => ({ ...prev, avatar: publicUrl }))
      setErrors(prev => ({ ...prev, avatar: undefined })) // Clear avatar error
      toast.success('Profile picture uploaded!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 300)
    }
  }

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-30 bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] border-b border-white/10 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center relative">
          {/* Smart Back Button */}
          {returnTo ? (
            <button
              onClick={() => router.push(decodeURIComponent(returnTo))}
              className="relative z-10 flex items-center justify-center text-white/80 hover:text-white/100 p-2 -ml-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400/40"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <Link href="/client/profile" aria-label="Back to Profile" className="relative z-10">
              <button className="flex items-center justify-center text-white/80 hover:text-white/100 p-2 -ml-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400/40" aria-label="Back">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
          )}

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
                src={formData.avatar || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect width="120" height="120" fill="%23333"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="48" fill="%23999"%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E'}
                alt="Profile"
                width={120}
                height={120}
                className={`rounded-full border-2 object-cover shadow-lg bg-[#18181b] ${errors.avatar ? 'border-red-500' : 'border-purple-400/50'}`}
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect width="120" height="120" fill="%23333"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="48" fill="%23999"%3E%F0%9F%91%A4%3C/text%3E%3C/svg%3E';
                }}
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-2 right-2 p-2 bg-[#18181b] border border-white/20 rounded-full shadow-lg hover:bg-white/10 transition-colors group-hover:scale-110 cursor-pointer"
              >
                {uploading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            {errors.avatar && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.avatar}
              </p>
            )}
            {formData.avatar && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, avatar: '' })}
                className="text-red-400 text-sm hover:text-red-300 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Remove Photo
              </button>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  if (errors.name) setErrors({ ...errors, name: undefined })
                }}
                className={`w-full px-4 py-3 rounded-xl bg-[#18181b] border text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/40 transition-all ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-purple-400/50'
                  }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email - Read Only */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-[#18181b]/50 border border-white/5 text-white/50 cursor-not-allowed"
                title="Email cannot be changed"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-white/70 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value })
                  if (errors.phone) setErrors({ ...errors, phone: undefined })
                }}
                className={`w-full px-4 py-3 rounded-xl bg-[#18181b] border text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/40 transition-all ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-purple-400/50'
                  }`}
                placeholder="Enter your phone number (10 digits)"
              />
              {errors.phone && (
                <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-white/70 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => {
                  setFormData({ ...formData, location: e.target.value })
                  if (errors.location) setErrors({ ...errors, location: undefined })
                }}
                className={`w-full px-4 py-3 rounded-xl bg-[#18181b] border text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/40 transition-all ${errors.location ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-purple-400/50'
                  }`}
                placeholder="Enter your location"
              />
              {errors.location && (
                <p className="mt-1 text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={saving || !formData.name || !formData.phone || !formData.location || !formData.avatar}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="w-5 h-5" />
                  Saved!
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>



          {/* Danger Zone */}
          <div className="pt-6 border-t border-white/10">
            <h2 className="text-red-400 font-medium mb-4">Danger Zone</h2>

            <Dialog>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="px-4 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium w-full"
                >
                  Delete Account
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[#18181b] text-white border-white/10">
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription className="text-white/60">
                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
                      Cancel
                    </button>
                  </DialogClose>
                  <button
                    onClick={() => toast.error("Account deletion is not available in demo")}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Delete Account
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </div>
    </div>
  )
}
