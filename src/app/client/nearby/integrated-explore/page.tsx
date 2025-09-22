"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import MapView from '../MapViewComponent';
import ProfessionalsFeed, { BaseProfessional } from '@/app/freelancer/feed/components/ProfessionalsFeed';
import { Search, Map, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { categories } from '../constants';
import { professionals } from '../mockData';
import { Freelancer } from '../types';
import SearchFilters from '../components/SearchFilters';

export default function IntegratedExplorePage() {
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDragging, setIsDragging] = useState(false);
  const [sheetOffset, setSheetOffset] = useState(0);
  const [isDragTextVisible, setIsDragTextVisible] = useState(true);
  const router = useRouter();

  // Filter state
  const [selectedArea, setSelectedArea] = useState("Velachery");
  const [selectedService, setSelectedService] = useState("All");
  const [range, setRange] = useState([10]);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [availability, setAvailability] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeOptions, setSelectedTimeOptions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProfessionals, setFilteredProfessionals] = useState<BaseProfessional[]>([]);
  
  // Map Freelancer to BaseProfessional with default values for required fields
  const mapToProfessional = (freelancer: Freelancer): BaseProfessional => ({
    ...freelancer,
    id: freelancer.id.toString(),
    name: freelancer.name,
    title: freelancer.name,
    service: freelancer.service,
    availability: ['Available now'],
    avatar: freelancer.image,
    image: freelancer.image, // Keep both for compatibility
    skills: freelancer.expertise || [], // Use expertise as skills
    description: freelancer.description || `${freelancer.name} is a ${freelancer.experience} cricket professional specializing in ${freelancer.service.toLowerCase()} with expertise in ${freelancer.expertise?.slice(0, 3).join(', ')}${freelancer.expertise && freelancer.expertise.length > 3 ? ' & more' : ''}. ${freelancer.completedJobs}+ successful sessions completed.`,
    // Map price fields correctly for the freelancer feed component
    budget: freelancer.price,
    price: freelancer.price, // Also set price for client nearby component
    priceUnit: freelancer.priceUnit,
    category: freelancer.service, // Use the specific service as category
    // Include the new fields
    expertise: freelancer.expertise,
    experience: freelancer.experience
  });
  
  // Initialize filtered professionals and set initial sheet position
  useEffect(() => {
    const mappedProfessionals = professionals.map(mapToProfessional);
    setFilteredProfessionals(mappedProfessionals);
    setInitialSheetY(getInitialSheetY());
  }, [professionals]);

  // Filter professionals based on selected category
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "All") {
      const categoryServices: { [key: string]: string[] } = {
        'Playing': ['Fast Bowler', 'Batting Coach', 'Wicket Keeper', 'Spin Bowler'],
        'Coaching': ['Batting Coach', 'Sports Conditioning Trainer', 'Fitness Trainer', 'Coach'],
        'Support': ['Sports Physio', 'Groundsman'],
        'Media': ['Cricket Analyst', 'Cricket Photo/Videography', 'Cricket Content Creator', 'Commentator'],
        'Grounds': ['Groundsman']
      };
      
      const allowedServices = categoryServices[selectedCategory] || [];
      if (allowedServices.length > 0) {
        const filtered = professionals.filter(pro => allowedServices.includes(pro.service));
        // Map filtered professionals to include cricket descriptions
        const mappedFiltered = filtered.map(mapToProfessional);
        setFilteredProfessionals(mappedFiltered);
      } else {
        // Map all professionals if no category filter
        const mappedProfessionals = professionals.map(mapToProfessional);
        setFilteredProfessionals(mappedProfessionals);
      }
    } else {
      // Show all professionals if "All" is selected or no category selected
      const mappedProfessionals = professionals.map(mapToProfessional);
      setFilteredProfessionals(mappedProfessionals);
    }
  }, [selectedCategory, professionals]);
  
  // Set initial sheet position to collapsed state (responsive to screen size)
  const getInitialSheetY = () => {
    if (typeof window === 'undefined') return 0;
    // On mobile devices, position higher to account for smaller effective viewport
    const isMobile = window.innerWidth < 768;
    const collapsedPosition = isMobile ? 0.58 : 0.62; // 58% on mobile, 62% on desktop
    return window.innerHeight * collapsedPosition;
  };

  const [initialSheetY, setInitialSheetY] = useState(0);

  const handleTimeOptionClick = (option: string) => {
    setSelectedTimeOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(t => t !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleSaveFilters = () => {
    // Apply filters to professionals
    let filtered = [...professionals];
    
    // Apply category filter first (if not "All")
    if (selectedCategory && selectedCategory !== "All") {
      const categoryServices: { [key: string]: string[] } = {
        'Playing': ['Fast Bowler', 'Batting Coach', 'Wicket Keeper', 'Spin Bowler'],
        'Coaching': ['Batting Coach', 'Sports Conditioning Trainer', 'Fitness Trainer', 'Coach'],
        'Support': ['Sports Physio', 'Groundsman'],
        'Media': ['Cricket Analyst', 'Cricket Photo/Videography', 'Cricket Content Creator', 'Commentator'],
        'Grounds': ['Groundsman']
      };
      
      const allowedServices = categoryServices[selectedCategory] || [];
      if (allowedServices.length > 0) {
        filtered = filtered.filter(pro => allowedServices.includes(pro.service));
      }
    }
    
    // Apply area filter
    if (selectedArea) {
      filtered = filtered.filter(pro => pro.location === selectedArea);
    }
    
    // Apply service filter (only if specific service selected and not already filtered by category)
    if (selectedService && selectedService !== "All") {
      filtered = filtered.filter(pro => pro.service === selectedService);
    }
    
    // Apply distance filter
    if (range[0]) {
      filtered = filtered.filter(pro => pro.distance <= range[0]);
    }
    
    // Apply rating filter
    if (minRating > 0) {
      filtered = filtered.filter(pro => pro.rating >= minRating);
    }
    
    // Apply price range filter
    filtered = filtered.filter(pro => 
      pro.price >= priceRange[0] && pro.price <= priceRange[1]
    );
    
    // Map filtered professionals to BaseProfessional format with cricket descriptions
    const mappedFiltered = filtered.map(mapToProfessional);
    setFilteredProfessionals(mappedFiltered);
    setShowFilterModal(false);
  };

  const handleClearFilters = () => {
    setSelectedArea("Velachery");
    setSelectedService("All");
    setRange([10]);
    setMinRating(0);
    setPriceRange([0, 20000]);
    setAvailability("");
    setSelectedTimeOptions([]);
    // Reset to all mapped professionals
    const mappedProfessionals = professionals.map(mapToProfessional);
    setFilteredProfessionals(mappedProfessionals);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setIsDragTextVisible(target.scrollTop === 0);
  };

  return (
    <div className="h-screen w-full bg-transparent relative overflow-hidden">
      {/* Map View */}
      <MapView professionals={filteredProfessionals} />

      {/* Fixed Header - Always at top */}
      <div className="fixed top-0 left-0 right-0 z-[3] px-0 pt-3 flex flex-col items-center bg-transparent">
        <div className="w-full max-w-md mb-2 px-3">
          <button
            className="w-full flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 shadow hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={() => setShowFilterModal(true)}
          >
            <Search className="w-5 h-5 text-purple-400" />
            <span className="text-base text-white font-medium text-left">Start your search</span>
          </button>
        </div>
        <div className="w-full flex flex-col px-3">
          <div className="flex gap-2 w-full justify-start pb-2">
            <div className="flex gap-1.5 no-scrollbar overflow-x-auto w-full">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm whitespace-nowrap border transition-all duration-200 font-medium ${
                    selectedCategory === cat.name 
                      ? 'bg-purple-600 text-white border-purple-600' 
                      : 'bg-black/60 text-white border-white/20 hover:bg-black/70 backdrop-blur-sm'
                  }`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="w-full h-[1px] bg-white/20" />
        </div>
      </div>

      {/* Background overlay for header - Removed black background */}

      {/* Bottom Sheet */}
      <motion.div
        className="fixed left-0 right-0 bg-[#111111] shadow-xl z-[2] flex flex-col"
        style={{
          top: '100px',
          height: 'calc(100vh - 100px)',
          touchAction: "pan-y",
          transform: `translateY(${isSheetCollapsed ? `${(initialSheetY / (typeof window !== 'undefined' ? window.innerHeight : 1)) * 100}vh` : '0px'})`,
          willChange: 'transform',
          overflow: isSheetCollapsed ? 'hidden' : 'visible'
        }}
        initial={{ y: initialSheetY }}
        animate={{
          y: isSheetCollapsed ? initialSheetY : 0
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
          bottom: initialSheetY
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
        <div className="sticky top-0 pt-3 pb-1 flex flex-col items-center z-10">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
          <AnimatePresence>
            {isDragTextVisible && (
              <motion.div 
                initial={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-white/50 text-xs py-1"
              >
                {isSheetCollapsed ? "↑ Pull up for list view" : "↓ Pull down to minimize"}
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
              <div className="flex items-center justify-between w-full max-w-3xl mx-auto px-4 pt-4">
                <div className="flex flex-col items-start gap-1.5">
                  <div className="flex -space-x-3">
                    {filteredProfessionals.slice(0, 4).map((freelancer, index) => (
                      <motion.div
                        key={freelancer.id}
                        className="relative"
                        style={{ zIndex: 4 - index }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="relative w-9 h-9">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-sm"></div>
                          <div className="relative w-9 h-9 rounded-full border-2 border-purple-200/20 overflow-hidden backdrop-blur-sm shadow-lg">
                            <img
                              src={freelancer.avatar || freelancer.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {filteredProfessionals.length > 4 && (
                      <motion.div
                        className="relative"
                        style={{ zIndex: 0 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="relative w-9 h-9">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full blur-sm"></div>
                          <div className="relative w-9 h-9 rounded-full border-2 border-purple-200/20 overflow-hidden backdrop-blur-sm bg-[#111111]/90 flex items-center justify-center">
                            <span className="text-xs font-bold text-white/70">+{filteredProfessionals.length - 4}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <div className="text-white/80 text-sm font-medium">
                    <span>{filteredProfessionals.length} experts available</span>
                  </div>
                </div>
                <div className="self-center">
                  <button
                    onClick={() => router.push('/client/post')}
                    className="group relative flex items-center gap-1.5 px-4 py-2 bg-white/95 backdrop-blur-xl rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white shadow-lg hover:shadow-xl"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-purple-600/5 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 rounded-xl border border-purple-200/20 group-hover:border-purple-300/30 transition-colors" />
                    <div className="absolute inset-0 rounded-xl shadow-inner shadow-purple-100/10" />
                    <Plus className="w-3.5 h-3.5 text-purple-600 group-hover:text-purple-700 transition-colors relative z-10" />
                    <span className="text-purple-600 group-hover:text-purple-700 relative z-10 transition-colors">Post A Job</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full max-w-3xl mx-auto px-4 mb-5 pt-1">
                <div className="text-white/80 text-sm font-medium">
                  <span>{filteredProfessionals.length} experts available</span>
                </div>
                <button
                  onClick={() => router.push('/client/post')}
                  className="group relative flex items-center gap-1.5 px-4 py-2 bg-white/95 backdrop-blur-xl rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white shadow-lg hover:shadow-xl"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 to-purple-600/5 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 rounded-xl border border-purple-200/20 group-hover:border-purple-300/30 transition-colors" />
                  <div className="absolute inset-0 rounded-xl shadow-inner shadow-purple-100/10" />
                  <Plus className="w-3.5 h-3.5 text-purple-600 group-hover:text-purple-700 transition-colors relative z-10" />
                  <span className="text-purple-600 group-hover:text-purple-700 relative z-10 transition-colors">Post A Job</span>
                </button>
              </div>
            )}
            {!isSheetCollapsed && (
              <div className="space-y-2.5 px-1">
                <ProfessionalsFeed filteredProfessionals={filteredProfessionals} />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Search Filters */}
      <SearchFilters
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        range={range}
        setRange={setRange}
        minRating={minRating}
        setMinRating={setMinRating}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        availability={availability}
        setAvailability={setAvailability}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTimeOptions={selectedTimeOptions}
        handleTimeOptionClick={handleTimeOptionClick}
        handleSaveFilters={handleSaveFilters}
        handleClearFilters={handleClearFilters}
      />

      {/* Floating Map Button - Only visible when list is expanded */}
      {!isSheetCollapsed && (
        <motion.div 
          className="fixed bottom-[10%] inset-x-0 mx-auto flex justify-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <button 
            onClick={() => setIsSheetCollapsed(true)}
            className="inline-flex items-center h-10 px-4 bg-white/95 backdrop-blur-sm text-gray-700 rounded-full shadow-lg hover:bg-white transition-all border border-gray-100"
          >
            <Map className="w-4 h-4" />
            <span className="text-[13px] font-medium ml-2">Map</span>
          </button>
        </motion.div>
      )}

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
    </div>
  );
} 