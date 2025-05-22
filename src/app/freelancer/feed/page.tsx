"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, Star, Check, ChevronDown, Map, Sparkles, Compass } from 'lucide-react';
import type { PanInfo } from 'framer-motion';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('./components/MapViewComponent'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#111111]">
      <div className="animate-pulse text-white/40">Loading map...</div>
    </div>
  )
});

import ProfessionalsFeed from './components/ProfessionalsFeed';
import SearchFilters from './components/SearchFilters';



import { jobs } from './data/jobs';
import type { Job, WorkMode } from './types';

export default function FeedPage() {
  // Sheet and UI state
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const router = useRouter();
  // UI State
  const [isDragging, setIsDragging] = useState(false);
  const [isDragTextVisible, setIsDragTextVisible] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data State
  const [selectedCategory, setSelectedCategory] = useState('For You');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  
  // State for filters
  const [location, setLocation] = useState<string>('Chennai, Tamil Nadu, India');
  const [serviceCategory, setServiceCategory] = useState<string>('all');
  const [workMode, setWorkMode] = useState<WorkMode | ''>('');
  // Price range in INR per hour (aligned with job.rate values)
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 2500]);
  const [distance, setDistance] = useState<number>(50);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState('Getting location...');

  // Function to reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&types=locality,place,neighborhood,address`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        // Try to get the most relevant address
        return data.features[0].place_name || 'Current Location';
      }
      return 'Current Location';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Current Location';
    }
  };

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Get human-readable address
          const address = await reverseGeocode(latitude, longitude);
          setCurrentLocation(address);
          setLocation(address);
        },
        (error) => {
          console.error('Error getting location:', error);
          setCurrentLocation('Chennai, India'); // Default to Chennai if location access is denied
          setLocation('Chennai, India');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setCurrentLocation('Chennai, India');
      setLocation('Chennai, India');
    }
  }, []);

  // Constants for sheet positions
  const COLLAPSED_HEIGHT = 180;
  const HEADER_HEIGHT = 104;

  // Set initial sheet position to collapsed state (70vh)
  const initialSheetY = typeof window !== 'undefined' ? window.innerHeight * 0.7 : 0;

  const resetDragTextVisibility = () => {
    setTimeout(() => setIsDragTextVisible(true), 1000);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setTimeout(() => setIsDragTextVisible(true), 1000);
  };

  // Handle filter button click
  const handleFilterClick = () => {
    setShowFilterModal(!showFilterModal);
  };

  // Handle filter application
  const applyFilters = () => {
    setFiltersApplied(true);
    setShowFilterModal(false);
    // Trigger a re-filter
    setFilteredJobs(filterJobs());
  };

  // Clear all filters
  const clearAllFilters = () => {
    setLocation('Current Location');
    setServiceCategory('all');
    setWorkMode('');
    setPriceRange([0, 1000]);
    setDistance(50);
    setSelectedSkills([]);
    setFiltersApplied(false);
  };

  // User's skills for personalized job matching
  const userSkills = ['cricket', 'developer'];

  // Filter jobs based on selected tab and filters
  const filterJobs = () => {
    console.log('\n=== Starting job filtering ===');
    
    // Start with all jobs
    let filtered = [...jobs];
    
    // For "For You" tab - show jobs matching user's skills
    if (selectedCategory === 'For You') {
      filtered = filtered.filter(job => {
        // Combine all job text for matching
        const jobText = [
          job.title,
          job.description,
          job.category,
          ...(job.skills || [])
        ].join(' ').toLowerCase();
        
        // Match developer jobs
        const isDeveloperJob = [
          'developer', 'programming', 'code', 'software', 'frontend', 'backend',
          'fullstack', 'web', 'app', 'mobile', 'react', 'javascript', 'typescript',
          'node', 'python', 'java', 'api', 'engineer'
        ].some(keyword => jobText.includes(keyword.toLowerCase()));
        
        // Match cricket/sports jobs
        const isCricketJob = [
          'cricket', 'coach', 'training', 'sports', 'player',
          'fitness', 'athlete', 'fielding', 'batting', 'bowling'
        ].some(keyword => jobText.includes(keyword.toLowerCase()));
        
        return isDeveloperJob || isCricketJob;
      });
      
      console.log(`For You tab: Found ${filtered.length} jobs matching your skills`);
    }
    
    // For Explore tab - show all jobs by default, apply filters only if explicitly set
    if (selectedCategory === 'Explore') {
      let filtersApplied = false;
      const appliedFilters: Record<string, string> = {};

      // Only apply search if user has typed something
      if (searchQuery) {
        filtersApplied = true;
        appliedFilters.searchQuery = searchQuery;
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(job => 
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.category.toLowerCase().includes(query) ||
          (job.skills && job.skills.some(skill => 
            skill.toLowerCase().includes(query)
          ))
        );
      }
      
      // Only apply location filter if user has selected a location other than Chennai
      if (location && !location.toLowerCase().includes('chennai')) {
        filtersApplied = true;
        appliedFilters.location = location;
        const locality = location.split(',')[0].trim().toLowerCase();
        filtered = filtered.filter(job => {
          if (!job.location) return false; // Don't show jobs without location when filtering by location
          return job.location.toLowerCase().includes(locality);
        });
      }
      
      // Only apply category filter if user has selected a specific category
      if (serviceCategory !== 'all') {
        filtersApplied = true;
        appliedFilters.category = serviceCategory;
        filtered = filtered.filter(job => job.category === serviceCategory);
      }
      
      // Only apply work mode filter if user has selected one
      if (workMode) {
        filtersApplied = true;
        appliedFilters.workMode = workMode;
        filtered = filtered.filter(job => job.workMode === workMode);
      }
      
      // Only apply skills filter if user has selected skills
      if (selectedSkills.length > 0) {
        filtersApplied = true;
        appliedFilters.skills = selectedSkills.join(', ');
        filtered = filtered.filter(job =>
          selectedSkills.every(skill => 
            job.skills.some(jobSkill => 
              jobSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }
      
      // Only apply price range filter if user has changed it
      if (priceRange[0] !== 500 || priceRange[1] !== 2500) {
        filtersApplied = true;
        appliedFilters.priceRange = `₹${priceRange[0]}-₹${priceRange[1]}`;
        filtered = filtered.filter(job => 
          job.rate >= priceRange[0] && job.rate <= priceRange[1]
        );
      }
      
      if (filtersApplied) {
        console.log('Explore tab: Filters applied:', appliedFilters);
      } else {
        console.log('Explore tab: Showing all jobs (no filters applied)');
      }
      console.log(`Total jobs shown: ${filtered.length}`);
    }
    
    return filtered;
  };

  // Initialize with all jobs on mount
  useEffect(() => {
    setFilteredJobs([...jobs]);
  }, []);

  // Filter jobs when any filter changes
  useEffect(() => {
    // Only filter if the component is mounted and jobs are loaded
    if (jobs.length > 0) {
      const timer = setTimeout(() => {
        const results = filterJobs();
        setFilteredJobs(results);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [selectedCategory, searchQuery, location, serviceCategory, workMode, priceRange, selectedSkills, jobs.length]);

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* SearchFilters Modal */}
      <SearchFilters
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        location={location}
        setLocation={setLocation}
        serviceCategory={serviceCategory}
        setServiceCategory={setServiceCategory}
        workMode={workMode}
        setWorkMode={setWorkMode}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        distance={distance}
        setDistance={setDistance}
        filtersApplied={filtersApplied}
        currentLocation={currentLocation}
        selectedSkills={selectedSkills}
        setSelectedSkills={setSelectedSkills}
        clearFilters={clearAllFilters}
        applyFilters={applyFilters}
      />

      {/* Map View */}
      <div className="absolute inset-0 z-0">
        <MapView jobs={filteredJobs} selectedCategory={selectedCategory} />
      </div>

      {/* Header */}
      <div className={`fixed top-0 left-0 right-0 z-10 px-4 pt-2 pb-1 transition-all duration-300 ${
        isSheetCollapsed ? 'bg-transparent' : 'bg-[#121212]'
      }`}>
        {/* Search Bar */}
        <div className="flex items-center mb-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full bg-black/60 backdrop-blur-md text-white text-sm px-4 py-2 pl-10 pr-4 rounded-full border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <svg className="w-3.5 h-3.5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Categories with Filter Button */}
        <div className="relative flex items-center justify-center py-2 w-full overflow-visible">
          <div className={`relative transition-transform duration-300 ease-in-out ${
            selectedCategory === 'Explore' ? '-translate-x-8' : 'translate-x-0'
          }`}>
            <div className="flex items-center space-x-3">
              {/* For You Tab */}
              <button
                className={`px-5 py-2 text-sm font-medium rounded whitespace-nowrap transition-all duration-200 flex items-center space-x-2 h-10
                  backdrop-blur-sm border transform ${
                    selectedCategory === 'For You'
                      ? 'bg-gradient-to-r from-purple-600/90 to-purple-500/90 text-white border-purple-500/30 shadow-lg shadow-purple-500/20 scale-100'
                      : 'bg-black/30 text-white/90 hover:bg-white/10 border-white/5 hover:border-white/10 scale-95 hover:scale-100'
                  }`}
                onClick={() => setSelectedCategory('For You')}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-medium">For You</span>
              </button>
              
              {/* Explore All Tab */}
              <div className="relative flex items-center">
                <button
                  className={`px-5 py-2 text-sm font-medium rounded whitespace-nowrap transition-all duration-200 flex items-center space-x-2 h-10
                    backdrop-blur-sm border transform ${
                      selectedCategory === 'Explore'
                        ? 'bg-gradient-to-r from-purple-600/90 to-purple-500/90 text-white border-purple-500/30 shadow-lg shadow-purple-500/20 scale-100'
                        : 'bg-black/30 text-white/90 hover:bg-white/10 border-white/5 hover:border-white/10 scale-95 hover:scale-100'
                    }`}
                  onClick={() => setSelectedCategory('Explore')}
                >
                  <Compass className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span className="font-medium">Explore All</span>
                </button>
                
                {/* Filter Button */}
                <motion.div 
                  className="absolute left-full ml-3 top-0 h-full flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: selectedCategory === 'Explore' ? 1 : 0,
                    x: selectedCategory === 'Explore' ? 0 : -10,
                    pointerEvents: selectedCategory === 'Explore' ? 'auto' : 'none'
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFilterModal(true);
                    }}
                    className={`w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 border ${
                      filtersApplied 
                        ? 'bg-gradient-to-r from-purple-600/90 to-purple-500/90 border-purple-500/30 shadow-lg shadow-purple-500/10'
                        : 'bg-black/30 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <svg 
                      className={`w-5 h-5 ${filtersApplied ? 'text-white' : 'text-white/90'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </button>
                  {filtersApplied && selectedCategory === 'Explore' && (
                    <motion.span 
                      className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Bottom Sheet */}
      <motion.div
        className={`bg-[#121212] backdrop-blur-lg shadow-2xl transition-all duration-300 ${
          isSheetCollapsed ? 'rounded-t-3xl' : 'rounded-none'
        }`}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          height: 'calc(100vh - 100px)', // Adjusted to remove gap
          touchAction: 'pan-y',
          willChange: 'transform',
          overflow: 'hidden',
          borderTopLeftRadius: isSheetCollapsed ? '1.5rem' : '0',
          borderTopRightRadius: isSheetCollapsed ? '1.5rem' : '0',
        }}
        initial={{ y: '70vh' }}
        animate={{
          y: isSheetCollapsed ? 'calc(100vh - 20px)' : '0', // 2% up from bottom
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300
        }}
        drag="y"
        dragElastic={0.1}
        dragConstraints={{
          top: 0,
          bottom: typeof window !== 'undefined' ? window.innerHeight * 0.7 : 0
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
          resetDragTextVisibility();
        }}
        onDragStart={() => {
          setIsDragTextVisible(false);
        }}
        onClick={() => {
          setIsDragTextVisible(false);
          resetDragTextVisibility();
        }}
      >
        {/* Drag handle */}
        <div 
          className="flex flex-col items-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none select-none"
          style={{ touchAction: 'none' }}
          onPointerDown={() => setIsDragTextVisible(false)}
          onPointerUp={() => resetDragTextVisibility()}
        >
          <div className="w-10 h-1 bg-white/30 rounded-full" />
          <div className="text-white/70 text-sm font-semibold mt-1">
            {filteredJobs.length} jobs available
          </div>
        </div>

        {/* Content container */}
        <div 
          className={`flex-1 ${isSheetCollapsed ? 'overflow-hidden' : 'overflow-y-auto'} overscroll-contain`}
          style={{
            maxHeight: isSheetCollapsed ? 'auto' : 'calc(100vh - 140px)'
          }}
        >
          <div className="container max-w-2xl mx-auto px-0 pb-6">

            {/* Jobs list */}
            <div className="space-y-2 px-4">
              <ProfessionalsFeed jobs={filteredJobs} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Toggle Map/List Button - Positioned 15% from bottom and centered */}
      <motion.div 
        className={`fixed bottom-[15%] left-0 right-0 z-50 flex justify-center transition-opacity duration-200 ${
          showFilterModal ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        initial={{ opacity: 1 }}
        animate={{ opacity: showFilterModal ? 0 : 1 }}
      >
        <button 
          onClick={() => setIsSheetCollapsed(!isSheetCollapsed)}
          className="flex items-center h-9 px-5 bg-white/95 backdrop-blur-sm text-gray-700 rounded-full shadow-lg hover:bg-white transition-all border border-white/20 shadow-black/20 whitespace-nowrap text-sm"
        >
          {isSheetCollapsed ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="text-sm font-medium ml-2">List</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="text-sm font-medium ml-2">Map</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}