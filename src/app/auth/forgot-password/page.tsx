'use client'

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-8 text-white">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-3xl font-bold">Password Reset Disabled</h1>
        <p className="text-purple-100">
          Automated password recovery relied on Supabase and has been removed along with the rest of the authentication system.
        </p>
        <p className="text-purple-100">
          No credentials are necessary—freely browse the product areas without signing in.
        </p>
      </div>
    </div>
  )
}