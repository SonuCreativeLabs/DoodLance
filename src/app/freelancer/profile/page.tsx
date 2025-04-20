"use client"

import Image from "next/image"
import { Star } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl p-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative h-20 w-20 rounded-full overflow-hidden">
            <Image
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold">John Doe</h1>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span>4.8</span>
              <span className="text-gray-500 text-sm">(12 reviews)</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Total Earnings</p>
            <p className="text-xl font-semibold">₹24,500</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm">Jobs Completed</p>
            <p className="text-xl font-semibold">15</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
              Plumbing
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
              Electrical
            </span>
          </div>
        </div>

        {/* Settings Button */}
        <button className="w-full py-2 px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
          Settings
        </button>
      </div>
    </div>
  )
} 