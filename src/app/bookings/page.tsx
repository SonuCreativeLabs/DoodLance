"use client"

import { useState } from 'react'
import { Calendar, Clock, MapPin, Star, MessageSquare } from 'lucide-react'
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
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600'
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
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <img
                  src={booking.image}
                  alt={booking.provider}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{booking.service}</h3>
                    <span className="text-sm font-medium text-primary">
                      {booking.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{booking.provider}</p>
                  <div className="flex flex-col gap-2 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {booking.date} at {booking.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {booking.location}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {booking.status === 'upcoming' && (
                      <>
                        <Button size="sm" className="flex-1">
                          Reschedule
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Cancel
                        </Button>
                      </>
                    )}
                    {booking.status === 'completed' && (
                      <>
                        <Button size="sm" className="flex-1">
                          Rate & Review
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
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
    </MainLayout>
  )
} 