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
    image: "/assets/professionals/1.jpg",
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
    image: "/assets/professionals/2.jpg",
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
    image: "/assets/professionals/3.jpg",
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
    image: "/assets/professionals/4.jpg",
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
    image: "/assets/professionals/5.jpg",
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
    image: "/assets/professionals/6.jpg",
    distance: 4.2,
    price: 400,
    priceUnit: "hour"
  }
];

export default function IntegratedExplorePage() {
  const [showMap, setShowMap] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
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
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);

  // Number of professionals (mock for now)
  const professionalsCount = 6;

  // Reset sheet state when switching views
  useEffect(() => {
    if (!showMap) {
      setIsSheetExpanded(false);
    }
  }, [showMap]);

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

  // Height of sticky top bar (search+categories)
  const TOP_BAR_HEIGHT = 112; // px (adjust if needed)

  const handleSheetDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const height = Math.max(
      15,
      Math.min(85, 100 - (info.point.y / window.innerHeight) * 100)
    );
    setSheetHeight(`${height}vh`);
  };

  const handleMapToggle = () => {
    setShowMap(true);
    setIsSheetExpanded(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#18181b] text-white">
      {/* Sticky top: Search bar and categories */}
      <header className="sticky top-0 w-full z-50 bg-[#23232a] px-0 pt-4 pb-2 flex flex-col items-center border-b border-white/10">
        <div className="w-full max-w-2xl flex items-center gap-2 mb-2 px-4">
          <button
            className="p-2 rounded-full bg-[#23232a] border border-white/10 text-white/80 hover:bg-[#18181b] hover:text-white shadow flex-shrink-0"
            onClick={() => router.back()}
            aria-label="Back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            className="flex-1 flex items-center gap-3 px-5 py-4 rounded-full bg-[#23232a] border border-white/10 shadow hover:bg-[#23232a]/80 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={() => setShowFilterModal(true)}
          >
            <Search className="w-6 h-6 text-purple-400" />
            <span className="flex-1 text-lg text-white font-semibold text-left">Start your search</span>
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 w-full max-w-2xl justify-center">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-base whitespace-nowrap border transition-all duration-200 font-bold ${selectedCategory === cat.name ? 'bg-purple-600 text-white border-purple-600' : 'bg-[#23232a] text-white/90 border-white/10 hover:bg-purple-900/40'}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 h-[calc(100vh-112px)] overflow-hidden">
        <AnimatePresence mode="wait">
          {!showMap ? (
            // Feed view
            <motion.div 
              key="list"
              className="h-full overflow-y-auto pb-24"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300
              }}
            >
              <ProfessionalsFeed />
              <button
                className="fixed bottom-24 right-6 z-40 bg-black/80 text-white px-6 py-3 rounded-full shadow-lg"
                onClick={handleMapToggle}
              >
                Show Map
              </button>
            </motion.div>
          ) : (
            // Map view with draggable sheet
            <motion.div
              key="map"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2
              }}
            >
              <div className="absolute inset-0">
                <MapView />
              </div>
              <motion.div
                className="fixed left-0 right-0 bottom-0 w-full z-50"
                style={{ 
                  height: "85vh",
                  y: isSheetExpanded ? "15vh" : "70vh"
                }}
                initial={{ y: "70vh" }}
                animate={{
                  y: isSheetExpanded ? "15vh" : "70vh"
                }}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 300
                }}
                drag="y"
                dragElastic={0.2}
                dragConstraints={{ bottom: window.innerHeight * 0.7, top: window.innerHeight * 0.15 }}
                onDragEnd={(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
                  const dragDistance = info.offset.y;
                  if (dragDistance < -50) {
                    setIsSheetExpanded(true);
                    if (dragDistance < -200) {
                      setShowMap(false);
                    }
                  } else {
                    setIsSheetExpanded(false);
                  }
                }}
              >
                <div className="bg-[#18181b] rounded-t-3xl shadow-xl h-full flex flex-col border-t border-white/10">
                  <div className="pt-3 pb-2 flex justify-center">
                    <div className="w-12 h-1 bg-white/20 rounded-full" />
                  </div>
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex flex-col items-center justify-center px-4 py-2">
                      <div className="text-white font-bold text-lg">{nearbyFreelancers.length} nearby professionals</div>
                      <div className="text-white/50 text-sm mt-1">↑ Swipe up to view list</div>
                    </div>
                    <AnimatePresence>
                      {isSheetExpanded && (
                        <motion.div 
                          className="flex-1 overflow-y-auto px-4 pb-24"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 200
                          }}
                        >
                          <ProfessionalsFeed />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen Filter/Search Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#18181b] text-white animate-fadeIn">
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#18181b]">
            <h2 className="text-xl font-extrabold">Search & Filters</h2>
            <button
              className="p-2 rounded-full bg-[#23232a] hover:bg-[#23232a]/80 text-white/60 hover:text-white"
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
              <div className="flex items-center gap-2 bg-[#23232a] rounded-full px-4 py-3 border border-white/10">
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
                className="w-full px-3 py-3 rounded-lg bg-[#23232a] text-white border border-white/10 text-lg font-semibold"
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
                className="w-full px-3 py-3 rounded-lg bg-[#23232a] text-white border border-white/10 text-lg font-semibold"
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
                    className={`px-4 py-2 rounded-lg text-base font-bold ${minRating === rating ? 'bg-purple-600 text-white' : 'bg-[#23232a] text-white/70 border border-white/10'}`}
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
                    className={`px-4 py-2 rounded-lg text-base font-bold ${availability === option ? 'bg-purple-600 text-white' : 'bg-[#23232a] text-white/70 border border-white/10'}`}
                  >
                    {option}
                  </button>
                ))}
                <button
                  onClick={() => setAvailability('Pick Date')}
                  className={`px-4 py-2 rounded-lg text-base font-bold flex items-center gap-1 ${availability === 'Pick Date' ? 'bg-purple-600 text-white' : 'bg-[#23232a] text-white/70 border border-white/10'}`}
                >
                  <Calendar className="w-5 h-5" /> Pick Date
                </button>
                {availability === 'Pick Date' && (
                  <input
                    ref={dateInputRef}
                    type="date"
                    className="ml-2 px-2 py-2 rounded bg-[#23232a] text-white border border-white/10"
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
                      className={`px-4 py-2 rounded-lg text-base font-bold ${selectedTimeOptions.includes(option) ? 'bg-purple-600 text-white' : 'bg-[#23232a] text-white/70 border border-white/10'}`}
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
                className="flex-1 flex items-center justify-center gap-2 bg-[#23232a] hover:bg-[#23232a]/80 rounded-lg px-4 py-4 text-white/70 text-lg border border-white/10 transition-colors font-bold"
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