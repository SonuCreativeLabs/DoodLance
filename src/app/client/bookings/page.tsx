"use client"

import { useState } from 'react'
import { Calendar, MapPin } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'

const tabs = ['Upcoming', 'Completed', 'Cancelled']

const bookings = [
  {
    id: 1,
    service: 'Plumbing',
    provider: 'John Smith',
    date: '2024-04-20',
    time: '10:00 AM',
    status: 'upcoming',
    location: '123 Main St, City',
    price: '$75',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    id: 2,
    service: 'Math Tutoring',
    provider: 'Sarah Johnson',
    date: '2024-04-18',
    time: '2:00 PM',
    status: 'completed',
    location: '456 Oak Ave, City',
    price: '$50',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  // Add more bookings as needed
]

export default function Bookings() {
  const [activeTab, setActiveTab] = useState('Upcoming')

  const filteredBookings = bookings.filter(
    (booking) => booking.status === activeTab.toLowerCase()
  )

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">My Bookings</h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white shadow-lg hover:shadow-xl'
                    : 'bg-white/5 text-white/60 hover:text-white/90 hover:bg-white/10'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-purple-500/10 hover:border-purple-500/20 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-10 blur-md"></div>
                    <img
                      src={booking.image}
                      alt={booking.provider}
                      className="w-16 h-16 rounded-full border-2 border-purple-200 relative z-10"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white/90">{booking.service}</h3>
                      <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                        {booking.price}
                      </span>
                    </div>
                    <p className="text-sm text-white/60">{booking.provider}</p>
                    <div className="flex flex-col gap-2 mt-2 text-sm text-white/50">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                        {booking.date} at {booking.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                        {booking.location}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      {booking.status === 'upcoming' && (
                        <>
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white border-0 hover:shadow-lg hover:from-purple-700 hover:to-purple-500 transition-all duration-300"
                          >
                            Reschedule
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 border-purple-500/20 text-white/70 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === 'completed' && (
                        <>
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white border-0 hover:shadow-lg hover:from-purple-700 hover:to-purple-500 transition-all duration-300"
                          >
                            Rate & Review
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 border-purple-500/20 text-white/70 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300"
                          >
                            Book Again
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 