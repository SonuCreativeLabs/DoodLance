"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import MapView from '../MapViewComponent';
import ProfessionalsFeed from '../ProfessionalsFeedComponent';
import { Search, X, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Freelancer {
  id: number;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  completedJobs: number;
  location: string;
  responseTime: string;
  image: string;
  distance: number;
  price: number;
  priceUnit: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

const categories: Category[] = [
  { id: 1, name: 'All', icon: '🌟' },
  { id: 2, name: 'Home Services', icon: '🏠' },
  { id: 3, name: 'Education', icon: '📚' },
  { id: 4, name: 'Health', icon: '💪' },
  { id: 5, name: 'Pet Care', icon: '🐾' },
  { id: 6, name: 'Professional', icon: '💼' },
  { id: 7, name: 'Tech', icon: '💻' },
  { id: 8, name: 'Personal Care', icon: '💅' },
  { id: 9, name: 'Events', icon: '🎉' },
];
const areas = ["Velachery", "Anna Nagar", "T Nagar", "Adyar", "Mylapore", "Porur", "Vadapalani", "Chromepet"];
const serviceTypes = ["Plumbing", "Electrical", "Cleaning", "Gardening", "Pet Care", "Tutoring", "Cooking", "Moving", "Painting", "Carpentry", "HVAC", "Photography", "Videography", "Graphic Design", "Content Writing"];
const availabilityOptions = ["Available Now", "Available Today", "Available This Week", "Available Next Week"];
const timeOptions = ['Any', 'Morning', 'Afternoon', 'Evening', 'Night'];

// Copy the nearbyFreelancers array from ProfessionalsFeedComponent for now
const nearbyFreelancers: Freelancer[] = [
  {
    id: 1,
    name: "John Doe",
    service: "Plumbing",
    rating: 4.8,
    reviews: 156,
    completedJobs: 230,
    location: "Velachery",
    responseTime: "< 30 mins",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 1.2,
    price: 500,
    priceUnit: "hour"
  },
  {
    id: 2,
    name: "Jane Smith",
    service: "House Cleaning",
    rating: 4.9,
    reviews: 203,
    completedJobs: 180,
    location: "Anna Nagar",
    responseTime: "< 1 hour",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 2.5,
    price: 1000,
    priceUnit: "day"
  },
  {
    id: 3,
    name: "Mike Johnson",
    service: "Electrician",
    rating: 4.7,
    reviews: 128,
    completedJobs: 150,
    location: "T Nagar",
    responseTime: "< 45 mins",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 3.1,
    price: 600,
    priceUnit: "hour"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    service: "Pet Grooming",
    rating: 4.9,
    reviews: 178,
    completedJobs: 200,
    location: "Adyar",
    responseTime: "< 2 hours",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 1.8,
    price: 800,
    priceUnit: "visit"
  },
  {
    id: 5,
    name: "David Brown",
    service: "AC Repair",
    rating: 4.6,
    reviews: 142,
    completedJobs: 165,
    location: "Mylapore",
    responseTime: "< 1 hour",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 2.7,
    price: 700,
    priceUnit: "visit"
  },
  {
    id: 6,
    name: "Lisa Anderson",
    service: "Home Tutor",
    rating: 4.8,
    reviews: 189,
    completedJobs: 210,
    location: "Porur",
    responseTime: "< 3 hours",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces&auto=format&q=80",
    distance: 4.2,
    price: 400,
    priceUnit: "hour"
  }
];

export default function IntegratedExplorePage() {
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDragging, setIsDragging] = useState(false);
  const [sheetOffset, setSheetOffset] = useState(0);
  // Filter state
  const [selectedArea, setSelectedArea] = useState("Velachery");
  const [selectedService, setSelectedService] = useState("All");
  const [range, setRange] = useState([10]);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [availability, setAvailability] = useState("");
  const [priceType, setPriceType] = useState('Any');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [preferredTime, setPreferredTime] = useState('Any');
  const dateInputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTimeOptions, setSelectedTimeOptions] = useState<string[]>([]);
  const router = useRouter();
  const [sheetHeight, setSheetHeight] = useState("15vh");
  const [isDragTextVisible, setIsDragTextVisible] = useState(true);

  // Number of professionals (mock for now)
  const professionalsCount = 6;

  // Calculate sheet offset on mount and window resize
  useEffect(() => {
    const updateSheetOffset = () => {
      setSheetOffset(window.innerHeight * 0.7);
    };
    
    updateSheetOffset();
    window.addEventListener('resize', updateSheetOffset);
    return () => window.removeEventListener('resize', updateSheetOffset);
  }, []);

  const handleTimeOptionClick = (option: string) => {
    if (option === 'Any') {
      if (selectedTimeOptions.includes('Any')) {
        setSelectedTimeOptions([]);
      } else {
        setSelectedTimeOptions(['Any']);
      }
    } else {
      setSelectedTimeOptions(prev => {
        const newSelection = prev.includes('Any') ? [] : [...prev];
        if (newSelection.includes(option)) {
          return newSelection.filter(item => item !== option);
        } else {
          return [...newSelection, option];
        }
      });
    }
  };

  // Save and clear filter handlers
  const handleSaveFilters = () => {
    setShowFilterModal(false);
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
  };

  // Update HEADER_HEIGHT to match the actual header height
  const HEADER_HEIGHT = 144; // 64px for search bar + 80px for category bar

  const handleSheetDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const height = Math.max(
      15,
      Math.min(85, 100 - (info.point.y / window.innerHeight) * 100)
    );
    setSheetHeight(`${height}vh`);
  };

  // Add scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop > 20) {
      setIsDragTextVisible(false);
    } else {
      setIsDragTextVisible(true);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#111111] text-white">
      {/* Background Map */}
      <div className="absolute inset-0 z-[1]">
        <MapView />
      </div>

      {/* Fixed Header - Always at top */}
      <div className="fixed top-0 left-0 right-0 z-[3] px-0 pt-3 flex flex-col items-center bg-[#111111]">
        <div className="w-full max-w-md flex items-center gap-2 mb-2 px-3">
          <button
            className="p-1.5 rounded-full bg-[#111111] border border-white/10 text-white/80 hover:bg-[#111111] hover:text-white shadow flex-shrink-0"
            onClick={() => router.back()}
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            className="flex-1 flex items-center gap-2 px-4 py-2 rounded-full bg-[#111111] border border-white/10 shadow hover:bg-[#111111]/80 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={() => setShowFilterModal(true)}
          >
            <Search className="w-5 h-5 text-purple-400" />
            <span className="flex-1 text-base text-white/80 font-medium text-left">Start your search</span>
          </button>
        </div>
        <div className="w-full flex flex-col">
          <div className="flex gap-2 w-full max-w-md justify-start px-3 pb-2 mx-auto">
            <div className="flex gap-1.5 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm whitespace-nowrap border transition-all duration-200 font-medium ${
                    selectedCategory === cat.name 
                      ? 'bg-purple-600 text-white border-purple-600' 
                      : 'bg-[#111111] text-white/90 border-white/10 hover:bg-purple-900/40'
                  }`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="w-full h-[1px] bg-white/10" />
        </div>
      </div>

      {/* Background overlay for header */}
      <div className="fixed top-0 left-0 right-0 h-[100px] bg-[#111111] z-[2]" />

      {/* Add global styles for no-scrollbar */}
      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          overflow-x: auto;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Bottom Sheet */}
      <motion.div
        className="fixed left-0 right-0 bg-[#111111] shadow-xl z-[2] flex flex-col"
        style={{
          top: '100px',
          height: 'calc(100vh - 100px)',
          touchAction: "pan-y",
          transform: `translateY(${isSheetCollapsed ? '70vh' : '0px'})`,
          willChange: 'transform',
          overflow: isSheetCollapsed ? 'hidden' : 'visible'
        }}
        initial={{ y: window.innerHeight * 0.7 }}
        animate={{
          y: isSheetCollapsed ? window.innerHeight * 0.7 : 0
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 350
        }}
        drag="y"
        dragElastic={0.1}
        dragConstraints={{
          top: 0,
          bottom: window.innerHeight * 0.7
        }}
        dragMomentum={false}
        onDragEnd={(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
          const dragDistance = info.offset.y;
          const dragVelocity = info.velocity.y;
          
          if (dragDistance > 50 || dragVelocity > 300) {
            setIsSheetCollapsed(true);
          } else if (dragDistance < -50 || dragVelocity < -300) {
            setIsSheetCollapsed(false);
          } else {
            setIsSheetCollapsed(dragDistance > 0);
          }
        }}
      >
        {/* Drag Handle */}
        <div className="sticky top-0 pt-3 pb-2 flex flex-col items-center bg-[#111111] cursor-grab active:cursor-grabbing z-10">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
          <AnimatePresence>
            {isDragTextVisible && (
              <motion.div 
                initial={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-white/50 text-xs py-1.5"
              >
                {isSheetCollapsed ? "↑ Pull up for list view" : "↓ Pull down for map view"}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div 
          className={`flex-1 ${isSheetCollapsed ? 'overflow-hidden' : 'overflow-y-auto'} overscroll-contain`}
          onScroll={handleScroll}
          style={{
            maxHeight: isSheetCollapsed ? 'auto' : 'calc(100vh - 100px - 48px)' // 48px accounts for the drag handle
          }}
        >
          <div className="container max-w-2xl mx-auto px-3 pb-6">
            {isSheetCollapsed ? (
              <div className="flex items-center justify-center py-3">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {nearbyFreelancers.slice(0, 4).map((freelancer, index) => (
                      <motion.div
                        key={freelancer.id}
                        className="relative"
                        style={{ zIndex: 4 - index }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="relative w-10 h-10">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-sm"></div>
                          <div className="relative w-10 h-10 rounded-full border-2 border-purple-200/20 overflow-hidden backdrop-blur-sm shadow-lg">
                            <img
                              src={freelancer.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {nearbyFreelancers.length > 4 && (
                      <motion.div
                        className="relative"
                        style={{ zIndex: 0 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="relative w-10 h-10">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full blur-sm"></div>
                          <div className="relative w-10 h-10 rounded-full border-2 border-purple-200/20 overflow-hidden backdrop-blur-sm bg-[#111111]/90 flex items-center justify-center">
                            <span className="text-xs font-bold text-white/70">+{nearbyFreelancers.length - 4}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <motion.div 
                    className="flex flex-col"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="text-white font-medium text-[15px]">
                      {nearbyFreelancers.length} nearby experts
                    </div>
                    <div className="flex items-center gap-1.5 text-white/60 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>available now</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center mb-5 pt-1">
                <div className="flex items-center gap-4">
                  <div className="text-white font-semibold tracking-tight text-[15px]">
                    {nearbyFreelancers.length} Nearby Experts
                  </div>
                  <div className="text-white/20 font-light">|</div>
                  <div className="flex items-center gap-1.5 text-white/60 capitalize tracking-tight text-[15px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    <span>Available Now</span>
                  </div>
                </div>
              </div>
            )}
            {!isSheetCollapsed && (
              <div className="space-y-2.5 px-1">
                <ProfessionalsFeed />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-[4] flex flex-col bg-[#111111] text-white animate-fadeIn">
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#111111]">
            <h2 className="text-xl font-extrabold">Search & Filters</h2>
            <button
              className="p-2 rounded-full bg-[#111111] hover:bg-[#111111]/80 text-white/60 hover:text-white"
              onClick={() => setShowFilterModal(false)}
              aria-label="Close filters"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {/* Modal content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Search input */}
            <div className="mb-6">
              <div className="flex items-center gap-2 bg-[#111111] rounded-full px-4 py-3 border border-white/10">
                <Search className="w-5 h-5 text-purple-400" />
                <input
                  type="text"
                  placeholder="Search for services, professionals, or areas..."
                  className="flex-1 bg-transparent outline-none text-lg text-white font-semibold placeholder:text-white/60"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {/* Area Filter */}
            <div className="mb-6">
              <label className="block mb-1 text-white/90 font-bold">Area</label>
              <select
                value={selectedArea}
                onChange={e => setSelectedArea(e.target.value)}
                className="w-full px-3 py-3 rounded-lg bg-[#111111] text-white border border-white/10 text-lg font-semibold"
              >
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
            {/* Service Type Filter */}
            <div className="mb-6">
              <label className="block mb-1 text-white/90 font-bold">Service Type</label>
              <select
                value={selectedService}
                onChange={e => setSelectedService(e.target.value)}
                className="w-full px-3 py-3 rounded-lg bg-[#111111] text-white border border-white/10 text-lg font-semibold"
              >
                <option value="All">All Services</option>
                {serviceTypes.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            {/* Distance Filter */}
            <div className="mb-6">
              <label className="block mb-1 text-white/90 font-bold">Distance (km)</label>
              <input
                type="range"
                min={1}
                max={50}
                value={range[0]}
                onChange={e => setRange([parseInt(e.target.value)])}
                className="w-full accent-purple-500"
              />
              <div className="text-right text-base text-white/80 font-bold">{range[0]} km</div>
            </div>
            {/* Price Range Filter */}
            <div className="mb-6">
              <label className="block mb-1 text-white/90 font-bold">Price Range (₹)</label>
              <input
                type="range"
                min={0}
                max={20000}
                step={100}
                value={priceRange[0]}
                onChange={e => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="w-full accent-purple-500"
              />
              <input
                type="range"
                min={0}
                max={20000}
                step={100}
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-purple-500 mt-1"
              />
              <div className="text-right text-base text-white/80 font-bold">₹{priceRange[0]} - ₹{priceRange[1] === 20000 ? '20,000+' : priceRange[1]}</div>
            </div>
            {/* Rating Filter */}
            <div className="mb-6">
              <label className="block mb-1 text-white/90 font-bold">Minimum Rating</label>
              <div className="flex gap-2">
                {[0, 3, 4, 4.5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`px-4 py-2 rounded-lg text-base font-bold ${minRating === rating ? 'bg-purple-600 text-white' : 'bg-[#111111] text-white/70 border border-white/10'}`}
                  >
                    {rating === 0 ? 'Any' : `${rating}+`}
                  </button>
                ))}
              </div>
            </div>
            {/* Availability Filter */}
            <div className="mb-6">
              <label className="block mb-1 text-white/90 font-bold">Availability</label>
              <div className="flex gap-2 flex-wrap">
                {availabilityOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => setAvailability(option)}
                    className={`px-4 py-2 rounded-lg text-base font-bold ${availability === option ? 'bg-purple-600 text-white' : 'bg-[#111111] text-white/70 border border-white/10'}`}
                  >
                    {option}
                  </button>
                ))}
                <button
                  onClick={() => setAvailability('Pick Date')}
                  className={`px-4 py-2 rounded-lg text-base font-bold flex items-center gap-1 ${availability === 'Pick Date' ? 'bg-purple-600 text-white' : 'bg-[#111111] text-white/70 border border-white/10'}`}
                >
                  <Calendar className="w-5 h-5" /> Pick Date
                </button>
                {availability === 'Pick Date' && (
                  <input
                    ref={dateInputRef}
                    type="date"
                    className="ml-2 px-2 py-2 rounded bg-[#111111] text-white border border-white/10"
                    value={selectedDate ?? ''}
                    onChange={e => setSelectedDate(e.target.value)}
                  />
                )}
              </div>
            </div>
            {/* Preferred Time Filter */}
            {(availability === 'Available Today' || availability === 'Pick Date') && (
              <div className="mb-6">
                <label className="block mb-1 text-white/90 font-bold">Preferred Time</label>
                <div className="flex gap-2 flex-wrap">
                  {timeOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => handleTimeOptionClick(option)}
                      className={`px-4 py-2 rounded-lg text-base font-bold ${selectedTimeOptions.includes(option) ? 'bg-purple-600 text-white' : 'bg-[#111111] text-white/70 border border-white/10'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Action Buttons */}
            <div className="flex gap-2 mt-8">
              <button
                className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-lg text-lg transition-colors"
                onClick={handleSaveFilters}
              >
                Show Results
              </button>
              <button
                onClick={handleClearFilters}
                className="flex-1 flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#111111]/80 rounded-lg px-4 py-4 text-white/70 text-lg border border-white/10 transition-colors font-bold"
              >
                <X className="w-5 h-5" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 