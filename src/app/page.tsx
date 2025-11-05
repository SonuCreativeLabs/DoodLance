"use client"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-8 text-white">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome to DoodLance
        </h1>
        <p className="text-lg text-purple-100">
          DoodLance is evolving into a simpler experience. Authentication has been disabled while we rework the platform.
        </p>
        <p className="text-base text-purple-100">
          Explore the client and freelancer areas using the navigation menu to see the latest design updates and product flows.
        </p>
      </div>
    </main>
  )
}
 