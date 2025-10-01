'use client'

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-8 text-white">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-3xl font-bold">Sign-in Disabled</h1>
        <p className="text-purple-100">
          The Supabase authentication flow has been removed. User accounts are no longer required to explore the DoodLance experience.
        </p>
        <p className="text-purple-100">
          Use the navigation menu to browse client and freelancer features directly.
        </p>
      </div>
    </div>
  )
}
 