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
  },
  {
    id: 6,
    title: 'Web Developer Needed',
    client: 'TechStart Inc',
    clientRating: 4.8,
    budget: 25000,
    currency: '₹',
    description: 'Looking for a skilled React/Node.js developer to build an e-commerce platform. Experience with Next.js and MongoDB preferred.',
    location: 'OMR',
    distance: 4.2,
    posted: '5h ago',
    duration: '1 month',
    coords: [80.2507, 12.9027] as [number, number],
    availability: ['Remote', 'Flexible'],
    skills: ['React', 'Node.js', 'MongoDB', 'Next.js'],
    category: 'Technology',
    proposals: 7
  },
  {
    id: 7,
    title: 'Graphic Designer for Social Media',
    client: 'Foodie Delights',
    clientRating: 4.7,
    budget: 8000,
    currency: '₹',
    description: 'Need creative social media posts for our restaurant. Must have experience with food photography and content creation.',
    location: 'Nungambakkam',
    distance: 1.5,
    posted: '3h ago',
    duration: '2 weeks',
    coords: [80.2407, 13.0527] as [number, number],
    availability: ['ASAP', 'Weekdays'],
    skills: ['Photoshop', 'Illustrator', 'Social Media', 'Content Creation'],
    category: 'Design',
    proposals: 5
  },
  {
    id: 8,
    title: 'Math & Science Tutor',
    client: 'Parent of 9th Grader',
    clientRating: 4.9,
    budget: 600,
    currency: '₹',
    description: 'Looking for an experienced tutor for CBSE 9th standard Math and Science. Must have prior teaching experience.',
    location: 'Anna Nagar',
    distance: 2.8,
    posted: '2d ago',
    duration: '3 months',
    coords: [80.2107, 13.0827] as [number, number],
    availability: ['Evenings', 'Weekends'],
    skills: ['Mathematics', 'Science', 'CBSE', 'Teaching'],
    category: 'Education',
    proposals: 6
  },
  {
    id: 9,
    title: 'Car Wash & Detailing',
    client: 'Car Enthusiast',
    clientRating: 4.8,
    budget: 2000,
    currency: '₹',
    description: 'Professional car wash and detailing service needed for my SUV. Interior cleaning and waxing required.',
    location: 'Thoraipakkam',
    distance: 3.5,
    posted: '1d ago',
    duration: '1 day',
    coords: [80.2507, 12.9227] as [number, number],
    availability: ['Weekends'],
    skills: ['Car Detailing', 'Interior Cleaning', 'Waxing'],
    category: 'Automotive',
    proposals: 3
  },
  {
    id: 10,
    title: 'Content Writer for Tech Blog',
    client: 'Tech Insights',
    clientRating: 4.9,
    budget: 5000,
    currency: '₹',
    description: 'Need engaging content writer for our technology blog. Must be knowledgeable about latest tech trends and able to write in simple language.',
    location: 'Remote',
    distance: 0,
    posted: '6h ago',
    duration: 'Ongoing',
    coords: [80.2707, 13.0827] as [number, number],
    availability: ['Remote', 'Flexible'],
    skills: ['Content Writing', 'Technology', 'Blogging', 'SEO'],
    category: 'Writing',
    proposals: 8
  }
];

export default function FeedPage() {
  // Sheet and UI state
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const router = useRouter();
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
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Map View */}
      <div className="absolute inset-0 z-0">
        <MapView jobs={jobs} />
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
          <div className="flex space-x-2 px-4">
            {['All', 'Home', 'Education', 'Fitness', 'Beauty', 'Technology', 'Health', 'Business', 'Design', 'Writing', 'Marketing'].map((category) => (
              <button
                key={category}
                className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
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