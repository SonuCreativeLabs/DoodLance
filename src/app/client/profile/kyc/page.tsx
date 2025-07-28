"use client"

import { useState } from 'react'
import { ArrowLeft, Upload, ShieldCheck, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function KYCVerification() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    idType: '',
    idNumber: '',
    frontImage: null as File | null,
    backImage: null as File | null,
    selfie: null as File | null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would:
    // 1. Validate all required fields
    // 2. Upload images to your storage
    // 3. Submit KYC data to your API
    // 4. Handle success/error states
    // For now, we'll just show success and redirect
    setTimeout(() => {
      router.push('/client/profile')
    }, 2000)
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-400 text-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p>Please ensure your documents are:<br/>
                   • Clear and legible<br/>
                   • Not expired<br/>
                   • Shows all corners<br/>
                   • Under 5MB in size</p>
              </div>
            </div>

            <div>
              <label htmlFor="idType" className="block text-sm font-medium text-white/60 mb-2">
                ID Type
              </label>
              <select
                id="idType"
                value={formData.idType}
                onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                required
              >
                <option value="">Select ID Type</option>
                <option value="aadhar">Aadhar Card</option>
                <option value="pan">PAN Card</option>
                <option value="dl">Driving License</option>
                <option value="voter">Voter ID</option>
              </select>
            </div>

            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-white/60 mb-2">
                ID Number
              </label>
              <input
                type="text"
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your ID number"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!formData.idType || !formData.idNumber}
              className="w-full px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              Continue
            </button>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            {/* Front Side */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Front Side of {formData.idType.toUpperCase()}
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, frontImage: e.target.files?.[0] || null })}
                  className="hidden"
                  id="front-image"
                  required
                />
                <label
                  htmlFor="front-image"
                  className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Upload className="w-6 h-6 text-white/60 mb-2" />
                  <span className="text-sm text-white/60">
                    {formData.frontImage ? formData.frontImage.name : 'Click to upload front side'}
                  </span>
                </label>
              </div>
            </div>

            {/* Back Side */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Back Side of {formData.idType.toUpperCase()}
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, backImage: e.target.files?.[0] || null })}
                  className="hidden"
                  id="back-image"
                  required
                />
                <label
                  htmlFor="back-image"
                  className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Upload className="w-6 h-6 text-white/60 mb-2" />
                  <span className="text-sm text-white/60">
                    {formData.backImage ? formData.backImage.name : 'Click to upload back side'}
                  </span>
                </label>
              </div>
            </div>

            {/* Selfie */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Your Selfie
              </label>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, selfie: e.target.files?.[0] || null })}
                  className="hidden"
                  id="selfie"
                  required
                />
                <label
                  htmlFor="selfie"
                  className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Upload className="w-6 h-6 text-white/60 mb-2" />
                  <span className="text-sm text-white/60">
                    {formData.selfie ? formData.selfie.name : 'Click to upload selfie'}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#18192A] to-[#23243a]">
      {/* App Bar Header */}
      <header className="fixed top-0 left-0 w-full z-30 bg-[#111111] border-b border-white/5 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
              aria-label="Back"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </button>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-white">KYC Verification</h1>
              <p className="text-white/50 text-xs">Complete your identity verification</p>
            </div>
            <div className="ml-auto flex items-center gap-2 text-sm text-white/60">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>Step {step}/2</span>
            </div>
          </div>
        </div>
      </header>
      <div className="h-20" /> {/* Spacer for fixed header */}

      <main className="container max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Progress Bar */}
          <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-green-500 transition-all duration-300 rounded-full"
              style={{ width: `${(step/2) * 100}%` }}
            />
          </div>

          {renderStep()}
        </form>
      </main>
    </div>
  )
}
