'use client'

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-8 text-white">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-3xl font-bold">Email Verification Disabled</h1>
        <p className="text-purple-100">
          Supabase-powered email verification is no longer part of this build. There is nothing you need to confirm before exploring the app.
        </p>
        <p className="text-purple-100">
          Use the global navigation to jump straight into the freelancer or client journeys.
        </p>
      </div>
    </div>
  )
}
 