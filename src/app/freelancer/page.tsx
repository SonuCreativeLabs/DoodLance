"use client"

import Image from "next/image"
import { CircleDollarSign, Calendar, ChevronRight, Star, MapPin, Wallet } from "lucide-react"

export default function FreelancerHome() {
  return (
    <div>
      {/* Hero Banner */}
      <div className="relative min-h-[300px] bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <svg
            className="absolute bottom-0 w-full h-32"
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
              fill="#111111"
            />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 pt-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
            <p className="text-lg text-white/80">
              You have 3 new job recommendations matching your skills
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 bg-[#111111] relative z-0">
        {/* Earnings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-600/20 via-purple-500/20 to-purple-400/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Today's Earnings</h2>
              <CircleDollarSign className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">₹2,000</p>
            <p className="text-sm text-white/60">From 3 completed jobs</p>
          </div>

          <div className="bg-gradient-to-r from-purple-600/20 via-purple-500/20 to-purple-400/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Total Earnings</h2>
              <Wallet className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-2">₹24,500</p>
            <p className="text-sm text-white/60">Lifetime earnings</p>
          </div>
        </div>

        {/* Your Profile Section */}
        <div className="bg-gradient-to-r from-purple-600/10 via-purple-500/10 to-purple-400/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-xl overflow-hidden ring-2 ring-purple-500/20">
                <Image
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">John Doe</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-white/80">4.8 (120 reviews)</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white rounded-lg transition-all duration-300">
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
              <Calendar className="h-5 w-5 text-purple-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Availability Calendar</p>
                <p className="text-xs text-white/60">Set your working hours</p>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                <span className="absolute h-4 w-4 rounded-full bg-white right-1 transition-all duration-300" />
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
              <MapPin className="h-5 w-5 text-purple-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Service Area</p>
                <p className="text-xs text-white/60">Within 10km radius</p>
              </div>
              <button className="text-sm text-purple-400">Edit →</button>
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recommended Jobs</h2>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="grid gap-4">
            {[1, 2].map((job) => (
              <div key={job} className="bg-gradient-to-r from-purple-600/10 via-purple-500/10 to-purple-400/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">Plumbing Work</h3>
                  <span className="text-purple-400 font-medium">₹2000</span>
                </div>
                <p className="text-sm text-white/60 mb-4">Need help fixing a leaky faucet and bathroom installation</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-500/20 ring-2 ring-purple-500/20" />
                    <div>
                      <p className="text-sm font-medium text-white">Sarah Wilson</p>
                      <p className="text-xs text-white/60">2.5 km away</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white text-sm font-medium rounded-lg transition-all duration-300">
                    Quick Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Progress */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-6">Your Skills</h2>
          <div className="bg-gradient-to-r from-purple-600/10 via-purple-500/10 to-purple-400/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">Plumbing</span>
                <span className="text-sm text-white/60">Expert</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div className="h-full w-[90%] bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">Electrical</span>
                <span className="text-sm text-white/60">Intermediate</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full">
                <div className="h-full w-[60%] bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 