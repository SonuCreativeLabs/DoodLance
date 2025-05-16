"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, Star, Check, ChevronDown } from 'lucide-react';
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
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [sheetOffset, setSheetOffset] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Search and category state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('Any');
  const [selectedService, setSelectedService] = useState('Any');
  const [range, setRange] = useState(10);
  const [minRating, setMinRating] = useState(0);
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 10000]);
  // Using 'budgetRange' consistently
  const budgeRange = budgetRange; // Alias to match the dependency array
  const [availability, setAvailability] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeOptions, setSelectedTimeOptions] = useState<string[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);

  // Filtering logic
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
    filtered = filtered.filter(job => job.distance <= range);

    // Filter by client rating
    filtered = filtered.filter(job => job.clientRating >= minRating);

    // Filter by budget
    filtered = filtered.filter(
      job => job.budget >= budgetRange[0] && job.budget <= budgetRange[1]
    );

    // Filter by availability
    if (availability.length > 0) {
      filtered = filtered.filter(job =>
        availability.every(avail => job.availability.includes(avail))
      );
    }

    // Filter by selected date
    if (selectedDate) {
      // Simple date filtering - in a real app, you'd want to check actual availability
      const day = selectedDate.getDay();
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
    budgeRange,
    availability,
    selectedDate,
    selectedTimeOptions,
  ]);

  // Handle category tab click
  const handleCategoryTab = (category: string) => {
    setSelectedCategory(category);
    setSelectedService('All'); // Reset service filter when category changes
  };

  // Filter modal logic
  const handleSaveFilters = () => {
    setShowFilters(false);
    // Filtering is handled by useEffect
  };

  const handleResetFilters = () => {
    setSelectedArea('Any');
    setSelectedService('Any');
    setRange(10);
    setMinRating(0);
    setBudgetRange([0, 10000]);
    setAvailability([]);
    setSelectedDate(null);
    setSelectedTimeOptions([]);
    setSearchQuery('');
    setSelectedCategory('All');
    setFilteredJobs(jobs);
  };

  useEffect(() => {
    handleSaveFilters();
  }, [
    selectedArea,
    selectedService,
    range,
    minRating,
    budgetRange,
    availability,
    selectedDate,
    selectedTimeOptions,
    selectedCategory,
    searchQuery
  ]);

  return (
    <div className="relative h-[100dvh] bg-[#0A0A0A] overflow-hidden">
      {/* Map View - Full screen */}
      <div className="absolute inset-0 w-full h-full">
        <MapView jobs={filteredJobs} />
      </div>

      {/* Search and Filters Overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 pt-2 pb-2 px-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center rounded-2xl bg-[#18181C] shadow-lg px-4 py-2 mb-2">
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
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {['All', 'Home', 'Education', 'Cleaning', 'Tutoring', 'Fitness'].map((category) => (
            <button
              key={category}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-black/40 text-white/80 hover:bg-black/60 border border-white/10'
              }`}
              onClick={() => handleCategoryTab(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Collapsible Sheet Placeholder */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-20 bg-[#18181C] rounded-t-2xl shadow-2xl border-t border-white/10"
        initial={{ y: 0 }}
        animate={{ y: isSheetCollapsed ? '70vh' : 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        {/* Drag handle and pull-up indicator */}
        <div className="flex flex-col items-center pt-2 pb-1 cursor-pointer" onClick={() => setIsSheetCollapsed(!isSheetCollapsed)}>
          <div className="w-12 h-1.5 bg-white/30 rounded-full mb-1" />
          <div className="text-xs text-white/40 font-medium">↑ Pull up for list view</div>
        </div>
        {/* Jobs count */}
        <div className="px-4 py-2">
          <div className="text-sm font-medium text-white/80">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} nearby
          </div>
        </div>
        {/* Professionals Feed List */}
        <div className="max-h-[50vh] overflow-y-auto px-2 pb-4">
          <ProfessionalsFeed jobs={filteredJobs} />
        </div>
        {/* Professionals count at bottom */}
        <p className="text-sm text-white/60">
          Showing <span className="font-medium">{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'job' : 'jobs'} nearby
        </p>
      </motion.div>
    </div>
  );
}