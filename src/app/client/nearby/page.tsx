"use client"

import { motion } from 'framer-motion'
import ClientLayout from '@/components/layouts/client-layout'
import { Search, MapPin, Star, Clock, Briefcase, ChevronLeft, Filter, X, ChevronDown, Calendar, IndianRupee } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar as CalendarIcon } from 'lucide-react'

// Mock data for areas
const areas = [
  "Velachery",
  "Anna Nagar",
  "T Nagar",
  "Adyar",
  "Mylapore",
  "Porur",
  "Vadapalani",
  "Chromepet"
]

// Mock data for service types
const serviceTypes = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Gardening",
  "Pet Care",
  "Tutoring",
  "Cooking",
  "Moving",
  "Painting",
  "Carpentry",
  "HVAC",
  "Photography",
  "Videography",
  "Graphic Design",
  "Content Writing"
]

// Mock data for availability
const availabilityOptions = [
  "Available Now",
  "Available Today",
  "Available This Week",
  "Available Next Week"
]

// Mock data for service categories
const serviceCategories = [
  { name: 'All Services', icon: '🌟' },
  { name: 'Home Services', icon: '🏠' },
  { name: 'Education', icon: '📚' },
  { name: 'Health & Wellness', icon: '💪' },
  { name: 'Pet Care', icon: '🐾' },
  { name: 'Professional', icon: '💼' },
  { name: 'Tech', icon: '💻' },
  { name: 'Personal Care', icon: '💅' },
  { name: 'Events', icon: '🎉' }
]

// Mock data for freelancers
const nearbyFreelancers = [
  {
    id: 1,
    name: "John Smith",
    service: "Plumbing Services",
    rating: 4.8,
    reviews: 156,
    completedJobs: 156,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    location: "2.5 km away",
    responseTime: "Usually responds in 30 mins"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    service: "House Cleaning",
    rating: 4.9,
    reviews: 203,
    completedJobs: 203,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    location: "1.8 km away",
    responseTime: "Usually responds in 15 mins"
  },
  {
    id: 3,
    name: "Mike Wilson",
    service: "Electrical Work",
    rating: 4.7,
    reviews: 128,
    completedJobs: 128,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    location: "3.2 km away",
    responseTime: "Usually responds in 45 mins"
  },
  {
    id: 4,
    name: "Emma Davis",
    service: "Pet Sitting",
    rating: 4.9,
    reviews: 89,
    completedJobs: 89,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    location: "1.5 km away",
    responseTime: "Usually responds in 20 mins"
  },
  {
    id: 5,
    name: "David Brown",
    service: "Gardening",
    rating: 4.6,
    reviews: 112,
    completedJobs: 112,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    location: "2.8 km away",
    responseTime: "Usually responds in 1 hour"
  },
  {
    id: 6,
    name: "Lisa Anderson",
    service: "Tutoring",
    rating: 4.9,
    reviews: 167,
    completedJobs: 167,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    location: "3.5 km away",
    responseTime: "Usually responds in 25 mins"
  }
]

export default function NearbyProfessionals() {
  const [selectedArea, setSelectedArea] = useState("Velachery")
  const [selectedService, setSelectedService] = useState("All")
  const [range, setRange] = useState([10])
  const [minRating, setMinRating] = useState(0)
  const [showAllFilters, setShowAllFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 20000])
  const [availability, setAvailability] = useState("")
  const [priceType, setPriceType] = useState('Any')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [preferredTime, setPreferredTime] = useState('Any')
  const dateInputRef = useRef<HTMLInputElement | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [appliedFilters, setAppliedFilters] = useState({
    area: "Velachery",
    service: "",
    distance: 5,
    priceType: 'Per Hour',
    priceRange: [500, 5000],
    minRating: 0,
    availability: "",
    date: null as string | null,
    preferredTime: ""
  })

  const timeOptions = ['Any', 'Morning', 'Afternoon', 'Evening', 'Night']

  // Filter freelancers based on applied filters
  const filteredFreelancers = nearbyFreelancers.filter(freelancer => {
    // Search query filter
    const matchesSearch = searchQuery === "" || 
      freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freelancer.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Service type filter
    const matchesService = appliedFilters.service === "" || 
      freelancer.service.toLowerCase().includes(appliedFilters.service.toLowerCase());
    
    // Rating filter
    const matchesRating = freelancer.rating >= appliedFilters.minRating;
    
    // Price range filter (assuming price is in the service description)
    const priceMatch = true; // TODO: Implement price matching when price data is available
    
    return matchesSearch && matchesService && matchesRating && priceMatch;
  });

  const handleSaveFilters = () => {
    setAppliedFilters({
      area: selectedArea,
      service: selectedService,
      distance: range[0],
      priceType,
      priceRange,
      minRating,
      availability,
      date: selectedDate,
      preferredTime
    });
    setShowAllFilters(false);
  };

  const handleClearFilters = () => {
    setSelectedArea("Velachery");
    setSelectedService("All");
    setRange([10]);
    setMinRating(0);
    setPriceRange([0, 20000]);
    setPriceType('Any');
    setAvailability("");
    setSelectedDate(null);
    setPreferredTime("Any");
    setSearchQuery("");
    setAppliedFilters({
      area: "Velachery",
      service: "",
      distance: 5,
      priceType: 'Per Hour',
      priceRange: [500, 5000],
      minRating: 0,
      availability: "",
      date: null,
      preferredTime: "Any"
    });
  };

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/client" className="text-white/60 hover:text-white">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-semibold text-white">Nearby Professionals</h1>
          </div>
          {/* Area Filter - Moved to top right */}
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
            <MapPin className="w-4 h-4 text-purple-400" />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="bg-transparent text-white text-sm focus:outline-none"
            >
              {areas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          {/* Search Bar with All Filters */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
            <Input
              type="text"
              placeholder="Search professionals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-32 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={() => setShowAllFilters(!showAllFilters)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg text-white/60 transition-colors"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Expanded Filters */}
          {showAllFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white/5 rounded-xl p-6 space-y-6"
            >
              {/* Service Type Filter */}
              <div className="space-y-2">
                <label className="text-white/60 text-sm font-medium">Service Type</label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select Service" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-[#1a1a1a] border border-white/20 max-h-[300px] overflow-y-auto">
                    <div className="p-2">
                      <Input
                        type="text"
                        placeholder="Search services..."
                        className="mb-2 bg-white/10 border-white/20"
                      />
                    </div>
                    <SelectItem value="All" className="text-white hover:bg-white/10">
                      All Services
                    </SelectItem>
                    {serviceTypes.map((service) => (
                      <SelectItem key={service} value={service} className="text-white hover:bg-white/10">
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Range Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-white/60 text-sm font-medium">Distance Range</label>
                  <span className="text-white text-sm">{range[0] === 50 ? '50+ km' : `${range[0]} km`}</span>
                </div>
                <div className="px-2">
                  <Slider
                    value={range}
                    onValueChange={setRange}
                    max={50}
                    step={1}
                    className="w-full [&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_[role=track]]:bg-white [&_[role=track]]:h-5 [&_[role=range]]:bg-purple-500"
                  />
                </div>
              </div>

              {/* Price Type and Range */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-white/60 text-sm font-medium">Price Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Any', 'Per Work', 'Per Hour'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setPriceType(type)}
                        className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 h-10 min-w-[90px] whitespace-nowrap ${
                          priceType === type
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/10 text-white/60 hover:bg-white/20'
                        }`}
                      >
                        {type !== 'Any' && <IndianRupee className="w-4 h-4" />}
                        <span className="whitespace-nowrap">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-white/60 text-sm font-medium">Price Range</label>
                    <span className="text-white text-sm">₹{priceRange[0]} - ₹{priceRange[1] === 20000 ? '20,000+' : priceRange[1]}</span>
                  </div>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={20000}
                      step={100}
                      className="w-full [&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_[role=track]]:bg-white [&_[role=track]]:h-5 [&_[role=range]]:bg-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="text-white/60 text-sm font-medium">Minimum Rating</label>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                        minRating === rating
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      {rating > 0 && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                      <span>{rating === 0 ? 'Any' : rating + '+'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="space-y-2">
                <label className="text-white/60 text-sm font-medium">Availability</label>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Now Button */}
                  <button
                    onClick={() => {
                      setAvailability('Available Now')
                      setSelectedDate(null)
                      setPreferredTime('Any')
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all duration-200 ${
                      availability === 'Available Now'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    Now
                  </button>
                  {/* Today Button */}
                  <button
                    onClick={() => {
                      setAvailability('Available Today')
                      setSelectedDate(null)
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all duration-200 ${
                      availability === 'Available Today'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    Today
                  </button>
                  {/* Pick Date Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setAvailability('Pick Date')
                      setTimeout(() => {
                        dateInputRef.current?.showPicker?.() || dateInputRef.current?.focus()
                      }, 0)
                    }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all duration-200 relative ${
                      availability === 'Pick Date'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {selectedDate
                        ? new Date(selectedDate).toLocaleDateString()
                        : 'Pick Date'}
                    </span>
                    <input
                      ref={dateInputRef}
                      type="date"
                      className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                      value={selectedDate ?? ''}
                      onChange={e => {
                        setSelectedDate(e.target.value)
                        setAvailability('Pick Date')
                      }}
                      tabIndex={-1}
                      style={{ pointerEvents: 'auto' }}
                    />
                  </button>
                </div>
                {/* Time Options (no Date & Time label) */}
                {(availability === 'Available Today' || availability === 'Pick Date') && (
                  <div className="mt-4">
                    <div className="mb-1 text-xs text-white/60 font-medium">Preferred Time</div>
                    <div className="flex items-center gap-2">
                      {timeOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => setPreferredTime(option)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-all duration-200 ${
                            preferredTime === option
                              ? 'bg-purple-500 text-white'
                              : 'bg-white/10 text-white/60 hover:bg-white/20'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Save Filters Button */}
              <button
                className="w-full mb-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors"
                onClick={handleSaveFilters}
              >
                Save Filters
              </button>

              {/* Clear Filters */}
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 text-white/60 text-sm transition-colors w-full justify-center"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            </motion.div>
          )}
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFreelancers.map((freelancer) => (
            <motion.div
              key={freelancer.id}
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl rounded-xl p-4 border border-white/10 hover:border-purple-300/30 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-md"></div>
                  <img
                    src={freelancer.image}
                    alt={freelancer.name}
                    className="w-16 h-16 rounded-full border-2 border-purple-200/50 relative z-10"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{freelancer.name}</h3>
                    <div className="flex items-center text-sm text-white/60">
                      <Star className="w-4 h-4 text-purple-500 fill-current" />
                      <span className="ml-1">{freelancer.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-white/60 mt-1">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{freelancer.service}</span>
                  </div>
                  <div className="flex items-center text-sm text-white/60 mt-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{freelancer.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-white/60 mt-1">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{freelancer.responseTime}</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white py-1.5 px-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:from-purple-700 hover:to-purple-500 text-sm">
                      Book Now
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-purple-600/20 to-purple-400/20 hover:from-purple-600/30 hover:to-purple-400/30 text-white py-1.5 px-3 rounded-lg transition-all duration-300 border border-white/10 text-sm">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ClientLayout>
  )
} 