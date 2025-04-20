"use client"

import Image from "next/image"
import { CircleDollarSign, Calendar } from "lucide-react"

export default function FreelancerHome() {
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-4">
      {/* Earnings Summary */}
      <div className="bg-white rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Earnings</h2>
          <button className="text-sm text-[#FF8A3D]">View Details →</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Today's Earnings</p>
            <p className="text-xl font-semibold mt-1">₹2,000</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Earnings</p>
            <p className="text-xl font-semibold mt-1">₹24,500</p>
          </div>
        </div>
      </div>

      {/* Your Listing Section */}
      <div className="bg-white rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden">
              <Image
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-medium">Your Skills</h2>
              <p className="text-sm text-gray-500">Plumbing, Electrical</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#FF8A3D]">⭐ 4.8</span>
            <button className="text-sm text-[#FF8A3D]">View More →</button>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <Calendar className="h-5 w-5 text-gray-500" />
          <div className="flex-1">
            <p className="text-sm font-medium">Availability Calendar</p>
            <p className="text-xs text-gray-500">Set your working hours</p>
          </div>
          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
            <span className="absolute h-4 w-4 rounded-full bg-white left-1" />
          </div>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recommended Jobs</h2>
          <button className="text-sm text-[#FF8A3D]">View All</button>
        </div>
        <div className="grid gap-4">
          {[1, 2].map((job) => (
            <div key={job} className="bg-white p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Plumbing Work</h3>
                <span className="text-[#FF8A3D] font-medium">₹2000</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">Need help fixing a leaky faucet and bathroom installation</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-100" />
                  <div>
                    <p className="text-sm font-medium">Sarah Wilson</p>
                    <p className="text-xs text-gray-500">2.5 km away</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-[#FF8A3D] text-white text-sm font-medium rounded-full">
                  Quick Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Progress */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Skills</h2>
        <div className="bg-white p-4 rounded-xl space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Plumbing</span>
              <span className="text-sm text-gray-500">Expert</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-full w-[90%] bg-[#FF8A3D] rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Electrical</span>
              <span className="text-sm text-gray-500">Intermediate</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-full w-[60%] bg-[#FF8A3D] rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 