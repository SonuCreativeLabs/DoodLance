"use client";
import React, { useState, useEffect } from 'react';
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





const jobs: Job[] = [
  {
    id: 1,
    title: 'House Cleaning Needed',
    client: 'John D.',
    clientRating: 4.9,
    budget: 120,
    currency: '₹',
    description: 'Looking for a professional cleaner for a 3BHK apartment. Need deep cleaning for kitchen and bathrooms.',
    location: 'T. Nagar',
    distance: 1.2,
    posted: '2h ago',
    duration: '3-4 hours',
    coords: [80.2407, 13.0627] as [number, number],
    availability: ['ASAP', 'Weekdays'],
    skills: ['Cleaning', 'Home Maintenance'],
    category: 'Cleaning',
    proposals: 3
  },
  {
    id: 2,
    title: 'Math Tutor for Grade 10',
    client: 'Priya M.',
    clientRating: 4.7,
    budget: 500,
    currency: '₹',
    description: 'Need an experienced math tutor for CBSE 10th standard. 3 times a week, 1.5 hours per session.',
    location: 'Anna Nagar',
    distance: 2.8,
    posted: '5h ago',
    duration: '1 month',
    coords: [80.2107, 13.0827] as [number, number],
    availability: ['Evenings', 'Weekends'],
    skills: ['Mathematics', 'Teaching', 'CBSE'],
    category: 'Education',
    proposals: 2
  },
  {
    id: 3,
    title: 'Personal Trainer',
    client: 'Raj K.',
    clientRating: 4.8,
    budget: 800,
    currency: '₹',
    description: 'Looking for a certified personal trainer for weight loss program. 3 sessions per week.',
    location: 'Velachery',
    distance: 1.8,
    posted: '1d ago',
    duration: '3 months',
    coords: [80.2207, 13.0227] as [number, number],
    availability: ['Morning', 'Evening'],
    skills: ['Fitness Training', 'Weight Loss', 'Nutrition'],
    category: 'Fitness',
    proposals: 5
  },
  {
    id: 4,
    title: 'Home Painting',
    client: 'Meena R.',
    clientRating: 4.6,
    budget: 15000,
    currency: '₹',
    description: 'Need to repaint 2BHK apartment. Includes walls, windows and doors. Must provide own materials.',
    location: 'Adyar',
    distance: 3.5,
    posted: '3h ago',
    duration: '5 days',
    coords: [80.2607, 13.0127] as [number, number],
    availability: ['Next Week'],
    skills: ['Painting', 'Interior Design'],
    category: 'Home',
    proposals: 8
  },
  {
    id: 5,
    title: 'Yoga Instructor',
    client: 'Community Center',
    clientRating: 4.9,
    budget: 1000,
    currency: '₹',
    description: 'Looking for a certified yoga instructor for weekly classes at our community center.',
    location: 'Besant Nagar',
    distance: 2.1,
    posted: '1d ago',
    duration: 'Ongoing',
    coords: [80.2707, 13.0027] as [number, number],
    availability: ['Weekend Mornings'],
    skills: ['Yoga', 'Meditation', 'Breathing Exercises'],
    category: 'Fitness',
    proposals: 4
  }
];

export default function FeedPage() {
  // Sheet and UI state
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragTextVisible, setIsDragTextVisible] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const [selectedArea, setSelectedArea] = useState("Velachery");
  const [selectedService, setSelectedService] = useState("All");
  const [range, setRange] = useState([10]);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 20000]);
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

  useEffect(() => {
    let filtered = [...jobs];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        job =>
          job.title.toLowerCase().includes(query) ||
          job.client.toLowerCase().includes(query) ||
          job.skills.some(skill => skill.toLowerCase().includes(query)) ||
          job.description.toLowerCase().includes(query)
      );
    }

    // Filter by distance
    filtered = filtered.filter(job => job.distance <= range[0]);

    // Filter by client rating
    filtered = filtered.filter(job => job.clientRating >= minRating);

    // Filter by budget
    filtered = filtered.filter(
      job => job.budget >= priceRange[0] && job.budget <= priceRange[1]
    );

    // Filter by availability
    if (availability) {
      filtered = filtered.filter(job =>
        job.availability.includes(availability)
      );
    }

    // Filter by selected date
    if (selectedDate) {
      // Simple date filtering - in a real app, you'd want to check actual availability
      const day = new Date(selectedDate).getDay();
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = days[day];
      
      filtered = filtered.filter(job => 
        job.availability.includes(dayName) || 
        job.availability.includes('Any Day') ||
        job.availability.includes('ASAP')
      );
    }

    // Filter by time options
    if (selectedTimeOptions.length > 0) {
      filtered = filtered.filter(job =>
        selectedTimeOptions.some(option => job.availability.includes(option))
      );
    }

    setFilteredJobs(filtered);
  }, [
    selectedCategory,
    searchQuery,
    range,
    minRating,
    priceRange,
    availability,
    selectedDate,
    selectedTimeOptions,
  ]);

  return (
    <div className="relative h-[100dvh] bg-[#0A0A0A] overflow-hidden">
      {/* Map View - Full screen */}
      <div className="absolute inset-0 w-full h-full">
        <MapView jobs={filteredJobs} />
      </div>

      {/* Search and Categories Container with conditional background */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          !isSheetCollapsed ? 'bg-[#0A0A0A]/95 backdrop-blur-md shadow-xl' : ''
        }`}
      >
        {/* Search Bar */}
        <div className="px-4 pt-2">
          <div className="flex items-center rounded-2xl bg-[#18181C] shadow-lg px-4 py-2">
            <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search professionals..."
              className="flex-1 bg-transparent text-white placeholder-white/60 border-none outline-none text-base"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 py-2 overflow-x-auto">
          <div className="flex gap-2 no-scrollbar">
            {['All', 'Home', 'Education', 'Cleaning', 'Tutoring', 'Fitness'].map((category) => (
              <button
                key={category}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-purple-500 text-white'
                    : 'bg-black/40 text-white/80 hover:bg-black/60 border border-white/10'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Collapsible Sheet */}
      <motion.div
        className="fixed z-40 bg-[#18181C] rounded-t-2xl shadow-2xl left-0 right-0 bottom-0 overflow-hidden"
        style={{
          top: '0',
          height: '100vh',
          touchAction: "pan-y",
          transform: `translateY(${isSheetCollapsed ? '70vh' : '0px'})`,
          willChange: 'transform',
          overflow: isSheetCollapsed ? 'hidden' : 'visible'
        }}
        initial={{ y: initialSheetY }}
        animate={{
          y: isSheetCollapsed ? (typeof window !== 'undefined' ? window.innerHeight * 0.7 : 0) : 0
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
          className="flex flex-col items-center py-3 cursor-grab active:cursor-grabbing touch-none select-none border-b border-white/10"
          style={{ touchAction: 'none' }}
          onPointerDown={() => setIsDragTextVisible(false)}
          onPointerUp={() => resetDragTextVisibility()}
        >
          <div className="w-12 h-1 bg-white/20 rounded-full" />
          <AnimatePresence>
            {isDragTextVisible && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="text-white/40 text-xs font-medium tracking-wide mt-2 px-3 py-1 rounded-full bg-white/5"
              >
                {isSheetCollapsed ? '↑ Pull up for list view' : '↓ Pull down to minimize'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content container */}
        <div 
          className={`flex-1 ${isSheetCollapsed ? 'overflow-hidden' : 'overflow-y-auto'} overscroll-contain`}
          style={{
            maxHeight: isSheetCollapsed ? 'auto' : 'calc(100vh - 104px)'
          }}
        >
          <div className="container max-w-2xl mx-auto px-3 pb-6">
            <div className="px-1">
              {/* Jobs count */}
              <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto mb-6 pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <div className="text-white/90 text-sm font-medium">
                    {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} available
                  </div>
                </div>
              </div>

              {/* Jobs list */}
              <div className="space-y-2.5">
                <ProfessionalsFeed jobs={filteredJobs} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Map Button */}
      <motion.div 
        className="fixed bottom-4 right-4 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <button 
          onClick={() => setIsSheetCollapsed(!isSheetCollapsed)}
          className="inline-flex items-center h-10 px-4 bg-white/95 backdrop-blur-sm text-gray-700 rounded-full shadow-lg hover:bg-white transition-all border border-gray-100"
        >
          <Map className="w-4 h-4" />
          <span className="text-[13px] font-medium ml-2">Map</span>
        </button>
      </motion.div>

      {/* Floating List Button - Only visible when sheet is collapsed (map view) */}
      {isSheetCollapsed && (
        <motion.div 
          className="fixed bottom-[10%] inset-x-0 mx-auto flex justify-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <button 
            onClick={() => setIsSheetCollapsed(false)}
            className="inline-flex items-center h-10 px-4 bg-white/95 backdrop-blur-sm text-gray-700 rounded-full shadow-lg hover:bg-white transition-all border border-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="text-[13px] font-medium ml-2">List</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}