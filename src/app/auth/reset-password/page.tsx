"use client";

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-8 text-white">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-3xl font-bold">Reset Password Disabled</h1>
        <p className="text-purple-100">
          Password recovery previously depended on Supabase sessions and has been removed along with the authentication stack.
        </p>
        <p className="text-purple-100">
          Browse the product without logging in—no credentials are required.
        </p>
      </div>
    </div>
  );
}
 