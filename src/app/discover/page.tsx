"use client"

import { useState } from 'react'
import { Search, Filter, MapPin, Star, Clock, ChevronDown } from 'lucide-react'
import MainLayout from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'

const filters = [
  { name: 'Distance', options: ['Within 1km', 'Within 5km', 'Within 10km'] },
  { name: 'Rating', options: ['4+ Stars', '4.5+ Stars', '5 Stars'] },
  { name: 'Price', options: ['$', '$$', '$$$'] },
  { name: 'Availability', options: ['Available Now', 'Today', 'This Week'] },
]

const services = [
  {
    id: 1,
    name: 'John Smith',
    service: 'Plumbing',
    rating: 4.8,
    reviews: 127,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    location: '2.5 km away',
    responseTime: 'Usually responds in 1 hour',
    price: '$$',
    availability: 'Available Now',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    service: 'Math Tutoring',
    rating: 4.9,
    reviews: 89,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    location: '1.8 km away',
    responseTime: 'Usually responds in 30 mins',
    price: '$$$',
    availability: 'Today',
  },
  // Add more services as needed
]

export default function Discover() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Search and Filter Bar */}
        <div className="sticky top-0 z-10 bg-background pb-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for services..."
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <div key={filter.name} className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 whitespace-nowrap"
                >
                  {filter.name}
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block">
                  {filter.options.map((option) => (
                    <button
                      key={option}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={() => {
                        setActiveFilters((prev) =>
                          prev.includes(option)
                            ? prev.filter((f) => f !== option)
                            : [...prev, option]
                        )
                      }
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map((filter) => (
              <div
                key={filter}
                className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
              >
                {filter}
                <button
                  onClick={() =>
                    setActiveFilters((prev) =>
                      prev.filter((f) => f !== filter)
                    )
                  }
                  className="hover:text-primary/80"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Service Listings */}
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{service.name}</h3>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-sm">{service.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{service.service}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {service.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.responseTime}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1">
                      Book Now
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      View Profile
                    </Button>
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