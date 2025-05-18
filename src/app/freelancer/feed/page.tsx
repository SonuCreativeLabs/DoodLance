"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, Star, Check, ChevronDown, Map } from 'lucide-react';
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

interface Job {
  id: number;
  title: string;
  client: string;
  clientRating: number;
  budget: number;
  currency: string;
  description: string;
  location: string;
  distance: number;
  posted: string;
  duration: string;
  coords: [number, number];
  availability: string[];
  skills: string[];
  category: string;
  proposals: number;
}

import { jobs } from './data/jobs';

export default function FeedPage() {
  // Sheet and UI state
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isDragTextVisible, setIsDragTextVisible] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('For You');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedService, setSelectedService] = useState("All");
  const [range, setRange] = useState([50]);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [availability, setAvailability] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeOptions, setSelectedTimeOptions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter jobs based on category and search query
  useEffect(() => {
    console.log('Selected category:', selectedCategory);
    console.log('Total jobs:', jobs.length);

    let filtered = [...jobs];

    // First apply category filter
    if (selectedCategory === 'For You') {
      const userSkills = ['developer', 'cricketer'];
      filtered = filtered.filter((job: Job) => {
        const jobSkills = job.skills.map(s => s.toLowerCase());
        const hasMatchingSkill = jobSkills.some(skill => userSkills.includes(skill));
        console.log(`Job ${job.title}: Skills ${jobSkills.join(', ')} - Match: ${hasMatchingSkill}`);
        return hasMatchingSkill;
      });
    }

    console.log('After category filter:', filtered.length, 'jobs');

    // Then apply search query if exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((job: Job) => (
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query))
      ));
      console.log('After search query filter:', filtered.length, 'jobs');
    }

    // Apply location filter if not "All"
    if (selectedArea !== "All") {
      filtered = filtered.filter((job: Job) => job.location === selectedArea);
      console.log('After location filter:', filtered.length, 'jobs');
    }

    // Apply service type filter if not "All"
    if (selectedService !== "All") {
      filtered = filtered.filter((job: Job) => job.category === selectedService);
      console.log('After service filter:', filtered.length, 'jobs');
    }

    // Apply distance range filter
    if (range[0] < 50) {
      filtered = filtered.filter((job: Job) => job.distance <= range[0]);
      console.log('After range filter:', filtered.length, 'jobs');
    }

    // Apply rating filter
    if (minRating > 0) {
      filtered = filtered.filter((job: Job) => job.clientRating >= minRating);
      console.log('After rating filter:', filtered.length, 'jobs');
    }

    // Apply price range filter
    if (priceRange[0] > 0 || priceRange[1] < 100000) {
      filtered = filtered.filter((job: Job) => {
        const budget = job.budget;
        return budget >= priceRange[0] && budget <= priceRange[1];
      });
      console.log('After price range filter:', filtered.length, 'jobs');
    }

    // Apply availability filter
    if (availability) {
      filtered = filtered.filter((job: Job) =>
        job.availability.includes(availability)
      );
      console.log('After availability filter:', filtered.length, 'jobs');
    }

    // Apply date filter
    if (selectedDate) {
      filtered = filtered.filter((job: Job) =>
        job.posted.includes(selectedDate)
      );
      console.log('After date filter:', filtered.length, 'jobs');
    }

    // Apply time options filter
    if (selectedTimeOptions.length > 0) {
      filtered = filtered.filter((job: Job) =>
        job.availability.some(time =>
          selectedTimeOptions.includes(time)
        )
      );
      console.log('After time options filter:', filtered.length, 'jobs');
    }

    console.log(`Final: Found ${filtered.length} jobs after applying all filters`);
    setFilteredJobs(filtered);
  }, [
    selectedCategory,
    searchQuery,
    selectedArea,
    selectedService,
    range,
    minRating,
    priceRange,
    availability,
    selectedDate,
    selectedTimeOptions,
    jobs
  ]);

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Map View */}
      <div className="absolute inset-0 z-0">
        <MapView jobs={filteredJobs} selectedCategory={selectedCategory} />
      </div>

      {/* Header */}
      <div className={`fixed top-0 left-0 right-0 z-10 px-4 pt-2 pb-1 transition-all duration-300 ${
        isSheetCollapsed ? 'bg-transparent' : 'bg-[#121212]'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <button 
            onClick={() => router.back()}
            className="p-1.5 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <div className="flex-1 max-w-xs mx-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full bg-black/60 backdrop-blur-md text-white text-sm px-4 py-2 pl-10 rounded-full border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg className="w-3.5 h-3.5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <button className="p-1.5 rounded-full bg-black/60 backdrop-blur-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
        
        {/* Categories */}
        <div className="overflow-x-auto py-2 hide-scrollbar">
          <div className="flex justify-center space-x-2 px-4">
            {[
              { name: 'For You', icon: '👤' },
              { name: 'Explore All Jobs', icon: '🌍' }
            ].map(({ name, icon }) => (
              <button
                key={name}
                className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                  selectedCategory === name
                    ? 'bg-purple-600 text-white'
                    : 'bg-black/40 text-white/80 hover:bg-black/60 border border-white/10'
                }`}
                onClick={() => setSelectedCategory(name)}
              >
                <span className="text-base">{icon}</span>
                <span>{name}</span>
              </button>
            ))}
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
          y: isSheetCollapsed ? 'calc(100vh - 180px)' : '0', // Adjusted to remove gap
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
        className="fixed bottom-[15%] left-0 right-0 z-50 flex justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
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