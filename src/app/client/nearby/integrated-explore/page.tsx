"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import MapView from '../MapViewComponent';
import ProfessionalsFeed from '../ProfessionalsFeedComponent';
import { Search, Map } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { categories } from '../constants';
import { professionals } from '../mockData';
import type { Freelancer } from '../types';
import SearchFilters from '../components/SearchFilters';

export default function IntegratedExplorePage() {
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDragging, setIsDragging] = useState(false);
  const [sheetOffset, setSheetOffset] = useState(0);
  const [isDragTextVisible, setIsDragTextVisible] = useState(true);
  const [initialSheetY, setInitialSheetY] = useState(0);
  
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
  const [filteredProfessionals, setFilteredProfessionals] = useState<Freelancer[]>(professionals);
  
  const router = useRouter();

  // Calculate sheet offset on mount and window resize
  useEffect(() => {
    const updateSheetOffset = () => {
      if (typeof window !== 'undefined') {
        setInitialSheetY(window.innerHeight * 0.7);
      }
    };

    updateSheetOffset();
    window.addEventListener('resize', updateSheetOffset);
    return () => window.removeEventListener('resize', updateSheetOffset);
  }, []);

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
    
    // Apply area filter
    if (selectedArea) {
      filtered = filtered.filter(pro => pro.location === selectedArea);
    }
    
    // Apply service filter
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
    
    setFilteredProfessionals(filtered);
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
    setFilteredProfessionals(professionals);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setIsDragTextVisible(target.scrollTop === 0);
  };

  return (
    <div className="h-screen w-full bg-black relative overflow-hidden">
      {/* Map View */}
      <MapView />

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
                    {professionals.slice(0, 4).map((freelancer, index) => (
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
                    {professionals.length > 4 && (
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
                            <span className="text-xs font-bold text-white/70">+{professionals.length - 4}</span>
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
                      {professionals.length} nearby experts
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
                    {professionals.length} Nearby Experts
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
          className="fixed bottom-[15%] left-1/2 transform -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <button 
            onClick={() => setIsSheetCollapsed(true)}
            className="group flex items-center h-10 px-4 bg-white/95 backdrop-blur-sm text-gray-700 rounded-full shadow-lg hover:bg-white transition-all border border-gray-100"
          >
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              <span className="text-[13px] font-medium">Map</span>
            </div>
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