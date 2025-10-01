'use client'

export default function AuthCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-8 text-white">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-3xl font-semibold">Authentication Disabled</h1>
        <p className="text-purple-100">
          Email verification and the previous Supabase callback flow have been removed.
        </p>
        <p className="text-purple-100">
          Use the navigation menu to explore the app without signing in.
        </p>
      </div>
    </div>
  )
}