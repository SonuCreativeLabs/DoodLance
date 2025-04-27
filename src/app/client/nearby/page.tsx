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
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const timeOptions = ['Any', 'Morning', 'Afternoon', 'Evening', 'Night']
  const [selectedTimeOptions, setSelectedTimeOptions] = useState<string[]>([])

  const handleTimeOptionClick = (option: string) => {
    if (option === 'Any') {
      // If Any is clicked and already selected, clear all selections
      if (selectedTimeOptions.includes('Any')) {
        setSelectedTimeOptions([]);
      } else {
        // Otherwise, just select Any
        setSelectedTimeOptions(['Any']);
      }
    } else {
      setSelectedTimeOptions(prev => {
        // If Any is selected, remove it
        const newSelection = prev.includes('Any') ? [] : [...prev];
        
        // Toggle the selected option
        if (newSelection.includes(option)) {
          return newSelection.filter(item => item !== option);
        } else {
          return [...newSelection, option];
        }
      });
    }
  };

  // Filter freelancers based on applied filters
  const filteredFreelancers = nearbyFreelancers.filter(freelancer => {
    // Search query filter
    const matchesSearch = searchQuery === "" || 
      freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freelancer.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Service type filter
    const matchesService = appliedFilters.service === "All" || appliedFilters.service === "" || 
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
      preferredTime: selectedTimeOptions.length > 0 ? selectedTimeOptions.join(', ') : 'Any'
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
    setSelectedTimeOptions([]);
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

  const handleToggleFavorite = (id: number) => {
    setFavoriteIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(fId => fId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/client" 
            className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 transition-all duration-200 rounded-full text-white/80 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          
          <div className="relative">
            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-400/20 hover:from-purple-600/30 hover:to-purple-400/30 transition-all duration-200 px-4 py-2 rounded-xl border border-white/10">
              <MapPin className="w-4 h-4 text-purple-400" />
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="bg-transparent text-white text-sm focus:outline-none cursor-pointer appearance-none pr-6"
              >
                {areas.map((area) => (
                  <option key={area} value={area} className="bg-[#1a1a1a]">{area}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-white/60 absolute right-3" />
            </button>
          </div>
        </div>
        
        {/* Page Name below header */}
        <h1 className="text-2xl font-semibold text-white mb-6">Nearby Professionals</h1>

        {/* Filter Button and Selected Filters Row */}
        <div className="flex items-center justify-between mb-4">
          {/* All Filters as Chips (except Area/Location) */}
          <div className="flex-1 overflow-x-auto flex gap-2 pr-4 py-1 scrollbar-hide">
            {/* Service Filter */}
            <div className="flex items-center bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-xs whitespace-nowrap">
              {appliedFilters.service === 'All' || appliedFilters.service === '' ? 'All Services' : appliedFilters.service}
              {appliedFilters.service !== 'All' && appliedFilters.service !== '' && (
                <button className="ml-2" onClick={() => { setSelectedService('All'); setAppliedFilters({ ...appliedFilters, service: 'All' }); }}>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            {/* Price Range Filter */}
            <div className="flex items-center bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-xs whitespace-nowrap">
              ₹{appliedFilters.priceRange[0]} - ₹{appliedFilters.priceRange[1] === 20000 ? '20,000+' : appliedFilters.priceRange[1]}
              {(appliedFilters.priceRange[0] !== 0 || appliedFilters.priceRange[1] !== 20000) && (
                <button className="ml-2" onClick={() => { setPriceRange([0, 20000]); setAppliedFilters({ ...appliedFilters, priceRange: [0, 20000] }); }}>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            {/* Rating Filter */}
            <div className="flex items-center bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-xs whitespace-nowrap">
              {appliedFilters.minRating === 0 ? 'Any Rating' : `${appliedFilters.minRating}+`}
              {appliedFilters.minRating !== 0 && (
                <button className="ml-2" onClick={() => { setMinRating(0); setAppliedFilters({ ...appliedFilters, minRating: 0 }); }}>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            {/* Availability Filter */}
            <div className="flex items-center bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-xs whitespace-nowrap">
              {appliedFilters.availability === '' ? 'Any Availability' : (appliedFilters.availability === 'Pick Date' && appliedFilters.date ? new Date(appliedFilters.date).toLocaleDateString() : appliedFilters.availability)}
              {appliedFilters.availability !== '' && (
                <button className="ml-2" onClick={() => { setAvailability(''); setSelectedDate(null); setAppliedFilters({ ...appliedFilters, availability: '', date: null }); }}>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            {/* Preferred Time Filter */}
            <div className="flex items-center bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-xs whitespace-nowrap">
              {appliedFilters.preferredTime === 'Any' || !appliedFilters.preferredTime ? 'Any Time' : appliedFilters.preferredTime}
              {appliedFilters.preferredTime && appliedFilters.preferredTime !== 'Any' && (
                <button className="ml-2" onClick={() => { setPreferredTime('Any'); setAppliedFilters({ ...appliedFilters, preferredTime: 'Any' }); }}>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          {/* Filter Button on the right */}
          <button
            onClick={() => setShowAllFilters(!showAllFilters)}
            className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg text-white/60 transition-colors ml-2"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
          <Input
            type="text"
            placeholder="Search service or professionals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          {/* Expanded Filters */}
          {showAllFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white/5 rounded-xl p-8 space-y-6 relative"
            >
              {/* Close button for filters */}
              <button 
                onClick={() => setShowAllFilters(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Service Type Filter */}
              <div className="space-y-6">
                <div className="mb-2 text-white/70 text-sm font-medium">Service Type</div>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white h-11">
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
              <div className="space-y-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-white/70 text-sm font-medium">Distance Range</span>
                  <span className="text-white text-sm font-medium">{range[0] === 50 ? '50+ km' : `${range[0]} km`}</span>
                </div>
                <div>
                  <Slider
                    value={range}
                    onValueChange={setRange}
                    max={50}
                    step={1}
                    className="w-full [&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&_[role=track]]:bg-white/20 [&_[role=track]]:h-2 [&_[role=range]]:bg-purple-500"
                  />
                </div>
              </div>

              {/* Price Type and Range */}
              <div className="space-y-6">
                <div className="space-y-6">
                  <div className="mb-2 text-white/70 text-sm font-medium">Price Type</div>
                  <div className="grid grid-cols-3 gap-3">
                    {['Any', 'Per Work', 'Per Hour'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setPriceType(type)}
                        className={`flex items-center justify-center gap-1 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 h-11 whitespace-nowrap ${
                          priceType === type
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {type !== 'Any' && <IndianRupee className="w-4 h-4" />}
                        <span className="whitespace-nowrap">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-white/70 text-sm font-medium">Price Range</span>
                    <span className="text-white text-sm font-medium">₹{priceRange[0]} - ₹{priceRange[1] === 20000 ? '20,000+' : priceRange[1]}</span>
                  </div>
                  <div>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={20000}
                      step={100}
                      className="w-full [&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&_[role=track]]:bg-white/20 [&_[role=track]]:h-2 [&_[role=range]]:bg-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-6">
                <div className="mb-2 text-white/70 text-sm font-medium">Minimum Rating</div>
                <div className="flex gap-3">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                        minRating === rating
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {rating > 0 && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                      <span>{rating === 0 ? 'Any' : rating + '+'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="space-y-6">
                <div className="mb-2 text-white/70 text-sm font-medium">Availability</div>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Now Button */}
                  <button
                    onClick={() => {
                      setAvailability('Available Now')
                      setSelectedDate(null)
                      setPreferredTime('Any')
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                      availability === 'Available Now'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
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
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                      availability === 'Available Today'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
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
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all duration-200 relative ${
                      availability === 'Pick Date'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
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
                
                {/* Time Options with multi-select capability */}
                {(availability === 'Available Today' || availability === 'Pick Date') && (
                  <div>
                    <div className="mb-2 text-sm text-white/70 font-medium">Preferred Times</div>
                    <div className="flex flex-wrap items-center gap-3">
                      {timeOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleTimeOptionClick(option)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                            selectedTimeOptions.includes(option)
                              ? 'bg-purple-500 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-3 pt-3">
                {/* Save Filters Button */}
                <button
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                  onClick={handleSaveFilters}
                >
                  Save Filters
                </button>

                {/* Clear Filters */}
                <button
                  onClick={handleClearFilters}
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 text-white/70 text-sm transition-colors w-full"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFreelancers.map((freelancer) => (
            <motion.div
              key={freelancer.id}
              whileHover={{ y: -5 }}
              className="bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl rounded-xl p-4 border border-white/10 hover:border-purple-300/30 transition-all duration-200 relative"
            >
              {/* Transparent heart icon in the top right corner of the card, turns red on click, with feedback */}
              <motion.button
                whileTap={{ scale: 1.2 }}
                className={`absolute top-3 right-3 z-20 p-1 transition-colors ${favoriteIds.includes(freelancer.id) ? 'text-red-500' : 'text-white/60 hover:text-red-400'}`}
                style={{ background: 'transparent', border: 'none' }}
                onClick={() => handleToggleFavorite(freelancer.id)}
                aria-label="Add to favorites"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill={favoriteIds.includes(freelancer.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a5.25 5.25 0 00-4.5 2.472A5.25 5.25 0 007.5 3.75 5.25 5.25 0 003 9c0 7.25 9 11.25 9 11.25s9-4 9-11.25a5.25 5.25 0 00-5.25-5.25z" />
                </svg>
              </motion.button>
              <div className="flex items-start gap-4">
                <div className="relative flex flex-col items-center w-20">
                  <div className="relative mt-2">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-md"></div>
                    <img
                      src={freelancer.image}
                      alt={freelancer.name}
                      className="w-16 h-16 rounded-full border-2 border-purple-200/50 relative z-10"
                    />
                  </div>
                  {/* Updated Rating Design */}
                  <div className="flex flex-col items-center mt-3">
                    <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-white">{freelancer.rating}</span>
                    </div>
                    <span className="text-xs text-white/60 mt-1">({freelancer.reviews} reviews)</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{freelancer.name}</h3>
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