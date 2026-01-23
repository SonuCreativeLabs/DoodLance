"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import MapView from '../MapViewComponent';
import ProfessionalsFeed, { BaseProfessional } from '@/app/freelancer/feed/components/ProfessionalsFeed';
import { Search, Map, Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { categories } from '../constants';
import { useNearbyProfessionals, Professional } from '@/contexts/NearbyProfessionalsContext';
import SearchFilters from '../components/SearchFilters';
import { CricketWhiteBallSpinner } from '@/components/ui/CricketWhiteBallSpinner';

export default function IntegratedExplorePage() {
  const searchParams = useSearchParams();
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDragging, setIsDragging] = useState(false);
  const [sheetOffset, setSheetOffset] = useState(0);
  const [isDragTextVisible, setIsDragTextVisible] = useState(true);
  const router = useRouter();
  const { professionals, loading, currentCoordinates } = useNearbyProfessionals();
  const mapViewRef = useRef<any>(null);

  // Check URL parameters to determine initial sheet state and pin to open
  useEffect(() => {
    const view = searchParams.get('view');
    const pinId = searchParams.get('pinId');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    if (view === 'list' || search || category) {
      setIsSheetCollapsed(false);
      setIsDragTextVisible(false);
    }

    if (search) {
      setSearchQuery(search);
    }

    if (category) {
      // Map basic categories to the display categories
      const categoryMap: { [key: string]: string } = {
        'playing': 'Players',
        'coaching': 'Coaching & Training',
        'support': 'Support Staff & Others',
        'media': 'Media & Content',
        // Popular Services IDs mappings
        'net-bowler': 'Players',
        'sidearm-thrower': 'Players',
        'cricket-coach': 'Coaching & Training',
        'physio': 'Support Staff & Others',
        'umpire': 'Support Staff & Others',

        // Other ClientServices IDs
        'net-batter': 'Players',
        'match-player': 'Players',
        'cricket-trainer': 'Coaching & Training',
        'scorer': 'Support Staff & Others',
        'analyst': 'Support Staff & Others', // Mapped here because keywords are in Support
        'commentator': 'Media & Content',
        'photographer': 'Media & Content',
        'influencer': 'Media & Content',

        'other': 'All' // Fallback
      };

      const mappedCategory = categoryMap[category.toLowerCase()] || category;
      // Verify if valid category, otherwise default or keep current
      if (['All', 'Players', 'Coaching & Training', 'Support Staff & Others', 'Media & Content'].includes(mappedCategory)) {
        setSelectedCategory(mappedCategory);
      }
    }

    // If there's a pinId, we need to open that specific pin on the map
    if (pinId && mapViewRef.current) {
      // Trigger the pin opening after a short delay to ensure map is loaded
      setTimeout(() => {
        mapViewRef.current.openPin(pinId);
      }, 1000);
    }
  }, [searchParams]);

  // Filter state
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedService, setSelectedService] = useState("All");
  const [range, setRange] = useState([50]);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [availability, setAvailability] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeOptions, setSelectedTimeOptions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProfessionals, setFilteredProfessionals] = useState<BaseProfessional[]>([]);

  // Map Freelancer to BaseProfessional - pricing is handled by ProfessionalsFeed using services array
  const mapToProfessional = (freelancer: Professional): BaseProfessional => {
    // Map service to cricket role
    const getCricketRole = (service: string): string => {
      const roleMapping: { [key: string]: string } = {
        'Fast Bowler': 'Fast Bowler',
        'Net Bowler': 'Fast Bowler',
        'Sidearm Specialist': 'WK-Batsman',
        'Batting Coach': 'Batting Coach',
        'Sports Conditioning Trainer': 'Fitness Trainer',
        'Fitness Trainer': 'Fitness Trainer',
        'Cricket Analyst': 'Cricket Analyst',
        'Physio': 'Physiotherapist',
        'Scorer': 'Scorer',
        'Umpire': 'Umpire',
        'Cricket Photo/Videography': 'Videographer',
        'Cricket Content Creator': 'Content Creator',
        'Commentator': 'Commentator',
        'Match Player': 'All Rounder',
        'Net Batsman': 'Batsman',
        'Coach': 'Coach',
        'Spin Bowler': 'Spin Bowler',
        'Sports Physiotherapist': 'Physiotherapist',
        'Cricket Commentator': 'Commentator'
      };

      return roleMapping[service] || 'Role not set';
    };

    const cricketRole = freelancer.cricketRole || getCricketRole(freelancer.service);

    // Format location: Area, City (if available) -> Location (DB) -> City -> Fallback
    let displayLocation = freelancer.area && freelancer.city
      ? `${freelancer.area}, ${freelancer.city}`
      : (freelancer.location || '').split(',').slice(0, 2).join(',');

    return {
      ...freelancer, // This includes the services array for pricing calculation
      id: freelancer.id.toString(),
      name: freelancer.name,
      title: freelancer.name,
      service: freelancer.service,
      availability: ['Available now'],
      avatar: freelancer.image,
      image: freelancer.image,
      skills: freelancer.expertise || [],
      description: freelancer.description || `${freelancer.name} is a ${freelancer.experience} cricket professional specializing in ${freelancer.service.toLowerCase()} with expertise in ${freelancer.expertise?.slice(0, 3).join(', ')}${freelancer.expertise && freelancer.expertise.length > 3 ? ' & more' : ''}.`,
      // Price will be calculated dynamically by ProfessionalsFeed from services array
      budget: freelancer.price, // Fallback price if no services
      price: freelancer.price,
      priceUnit: freelancer.priceUnit,
      category: freelancer.service,
      cricketRole: cricketRole,
      expertise: freelancer.expertise,
      experience: freelancer.experience,
      location: displayLocation, // Use the formatted location
      area: freelancer.area,
      city: freelancer.city
    };
  };

  // Helper function to sort professionals by distance (nearest first)
  const sortByDistance = (profs: BaseProfessional[]) => {
    return [...profs].sort((a, b) => (a.distance || 999) - (b.distance || 999));
  };

  // Initialize filtered professionals and set initial sheet position
  useEffect(() => {
    const mappedProfessionals = professionals.map(mapToProfessional);
    setFilteredProfessionals(sortByDistance(mappedProfessionals));
    setInitialSheetY(getInitialSheetY());
  }, [professionals]);

  // Filter professionals based on selected category, search, and location
  useEffect(() => {
    // 1. Map all professionals first to ensure consistent data structure
    let result = professionals.map(mapToProfessional);

    // 2. Apply Category Filter
    if (selectedCategory && selectedCategory !== "All") {
      const categoryKeywords: { [key: string]: string[] } = {
        'Players': [
          'match player', 'net bowler', 'net batsman', 'sidearm', 'sidearm specialist',
          'bowler', 'batsman', 'player', 'cricketer', 'all rounder',
          'wicket keeper', 'spinner', 'pacer', 'leg spinner', 'off spinner', 'fast bowler'
        ],
        'Coaching & Training': [
          'coach', 'coaching', 'training', 'trainer', 'conditioning',
          'fitness', 'drill', 'practice', 'mentor', 'strength'
        ],
        'Support Staff & Others': [
          'analyst', 'analysis', 'physio', 'physiotherapist', 'scorer',
          'umpire', 'groundsman', 'manager', 'support', 'medic', 'doctor',
          'statistician', 'masseur', 'other'
        ],
        'Media & Content': [
          'photo', 'video', 'videography', 'content', 'commentator',
          'media', 'social', 'editor', 'creator', 'streaming',
          'photographer', 'videographer'
        ]
      };

      const keywords = categoryKeywords[selectedCategory] || [];
      if (keywords.length > 0) {
        result = result.filter(pro => {
          // Check services array categories
          if (pro.services && pro.services.length > 0) {
            return pro.services.some((svc: any) => {
              const svcCategory = (svc.category || '').toLowerCase();
              const svcTitle = (svc.title || '').toLowerCase();
              return keywords.some(keyword =>
                svcCategory.includes(keyword) || svcTitle.includes(keyword)
              );
            });
          }
          // Fallback to main service field
          const proService = (pro.service || '').toLowerCase();
          return keywords.some(keyword => proService.includes(keyword));
        });
      }
    }

    // 3. Apply Search Query Filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(pro =>
        (pro.name && pro.name.toLowerCase().includes(query)) ||
        (pro.service && pro.service.toLowerCase().includes(query)) ||
        pro.expertise?.some(skill => skill.toLowerCase().includes(query)) ||
        (pro.description && pro.description.toLowerCase().includes(query)) ||
        (pro.location && pro.location.toLowerCase().includes(query)) ||
        (pro.area && pro.area.toLowerCase().includes(query)) ||
        (pro.city && pro.city.toLowerCase().includes(query)) ||
        pro.services?.some((svc: any) =>
          (svc.title && svc.title.toLowerCase().includes(query)) ||
          (svc.description && svc.description.toLowerCase().includes(query)) ||
          svc.features?.some((f: string) => f.toLowerCase().includes(query))
        )
      );
    }

    // 4. Apply Location/Area Filter
    if (selectedArea && selectedArea !== "All") {
      const areaQuery = selectedArea.toLowerCase().trim();
      result = result.filter(pro => {
        const locationLower = (pro.location || '').toLowerCase();
        const areaLower = (pro.area || '').toLowerCase();
        const cityLower = (pro.city || '').toLowerCase();

        // Split area query into parts to allow partial matching (e.g. "Chennai" matching "Velachery, Chennai")
        const queryParts = areaQuery.split(/[\s,]+/);

        return queryParts.some(part =>
          locationLower.includes(part) ||
          areaLower.includes(part) ||
          cityLower.includes(part)
        );
      });
    }

    // 5. Apply Service Type Filter (from Modal)
    if (selectedService && selectedService !== "All") {
      result = result.filter(pro => {
        const proService = (pro.service || '').toLowerCase();
        const filterService = selectedService.toLowerCase();
        return proService.includes(filterService) || filterService.includes(proService);
      });
    }

    // 6. Apply Distance Filter
    if (range[0] < 50) {
      result = result.filter(pro => (pro.distance || 0) <= range[0]);
    }

    // 7. Apply Rating Filter
    if (minRating > 0) {
      result = result.filter(pro => (pro.rating || 0) >= minRating);
    }

    // 8. Apply Price Filter
    const minPrice = priceRange[0];
    const maxPrice = priceRange[1];

    result = result.filter(pro => {
      const price = pro.price || 0;
      if (maxPrice >= 20000) {
        return price >= minPrice; // No upper limit
      }
      return price >= minPrice && price <= maxPrice;
    });

    // 9. Sort by distance (nearest first) and update state
    setFilteredProfessionals(sortByDistance(result));
  }, [selectedCategory, professionals, searchQuery, selectedArea, selectedService, range, minRating, priceRange]);

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
    // Formatting is handled reactively by the main useEffect
    // This button just acts as a confirmation/close action
    setShowFilterModal(false);
  };

  // Get user's current location for default - Commented out as per user request to show "India" (All) by default
  // The list is already sorted by distance so nearby professionals appear first
  /*
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // ... code removed ...
        }
      );
    }
  }, []);
  */

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setSelectedArea("All");
    setSelectedService("All");
    setRange([50]);
    setMinRating(0);
    setPriceRange([0, 20000]);
    setAvailability("");
    setSelectedTimeOptions([]);
    // The main useEffect will handle re-filtering automatically when these states change
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setIsDragTextVisible(target.scrollTop === 0);
  };

  return (
    <div className="h-screen w-full bg-transparent relative overflow-hidden">
      {/* Map View */}
      <MapView
        ref={mapViewRef}
        professionals={filteredProfessionals}
        customCenter={currentCoordinates ? [currentCoordinates.lng, currentCoordinates.lat] : null}
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none"
            style={{ paddingBottom: '20vh' }}
          >
            <div className="bg-[#111111]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl flex items-center gap-3">
              <CricketWhiteBallSpinner className="w-5 h-5" />
              <span className="text-white text-sm font-medium">Finding nearby experts...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Header - Always at top */}
      <div className={`fixed top-0 left-0 right-0 z-[3] px-0 pt-3 flex flex-col items-center transition-all duration-200 ${isSheetCollapsed
        ? 'bg-transparent'
        : 'bg-[#111111]'
        }`}>
        <div className="w-full max-w-md mb-2 px-3">
          <div className="flex gap-2">
            <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-full border shadow transition-all duration-200 ${isSheetCollapsed
              ? 'bg-black/60 backdrop-blur-sm border-white/20'
              : 'bg-[#111111] border-white/30'
              }`}>
              <Search className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search services, professionals, or areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-white font-medium placeholder:text-white/60"
              />
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 border ${isSheetCollapsed
                ? 'bg-black/60 border-white/20 hover:bg-black/70'
                : 'bg-[#111111] border-white/30 hover:bg-[#111111]/80'
                }`}
            >
              <svg
                className="w-4 h-4 text-white/90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col px-0">
          <div className="flex gap-2 w-full justify-start pb-2">
            <div className="flex gap-1.5 no-scrollbar overflow-x-auto w-full px-3">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-sm whitespace-nowrap border transition-all duration-200 font-medium ${selectedCategory === cat.name
                    ? 'bg-purple-600 text-white border-purple-600'
                    : isSheetCollapsed
                      ? 'bg-black/60 text-white border-white/20 hover:bg-black/70 backdrop-blur-sm'
                      : 'bg-[#111111] text-white border-white/30 hover:bg-[#111111]/80'
                    }`}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setSelectedService("All");
                  }}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background overlay for header - Removed black background */}

      {/* Bottom Sheet */}
      <motion.div
        className="fixed left-0 right-0 bg-[#111111] shadow-xl z-[2] flex flex-col"
        style={{
          top: '85px',
          height: 'calc(100vh - 85px)',
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
          className={`flex-1 ${isSheetCollapsed ? 'overflow-hidden' : 'overflow-y-auto smooth-scroll'} `}
          onScroll={handleScroll}
          style={{
            maxHeight: isSheetCollapsed ? 'auto' : 'calc(100vh - 85px - 48px)' // 48px accounts for the drag handle
          }}
        >
          <div className="container max-w-2xl mx-auto px-3 pb-6">
            {isSheetCollapsed ? (
              <div className="flex items-center justify-between w-full max-w-3xl mx-auto px-4 pt-4">
                <div className="flex flex-col items-start gap-1.5">
                  <div
                    className="flex -space-x-3 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setIsSheetCollapsed(false)}
                  >
                    {loading ? (
                      // Skeleton Loader for collapsed avatars
                      [...Array(4)].map((_, index) => (
                        <div key={index} className="relative w-9 h-9 rounded-full border-2 border-white/5 bg-white/10 animate-pulse" style={{ zIndex: 4 - index }} />
                      ))
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                  <div className="text-white/80 text-sm font-medium">
                    {loading ? (
                      <span className="animate-pulse">Finding experts...</span>
                    ) : (
                      <span>{filteredProfessionals.length} experts available</span>
                    )}
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
              // Expanded List Header
              <div className="flex items-center justify-between w-full max-w-3xl mx-auto px-4 mb-5 pt-1">
                <div className="text-white/80 text-sm font-medium">
                  {loading ? (
                    <span className="animate-pulse">Finding experts...</span>
                  ) : (
                    <span>{filteredProfessionals.length} experts available</span>
                  )}
                </div>
                <button
                  onClick={() => router.push('/client/post')}
                  className="group relative flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-xl rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white shadow-lg hover:shadow-xl"
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
                <ProfessionalsFeed
                  filteredProfessionals={filteredProfessionals}
                  searchQuery={searchQuery}
                  selectedCategory={selectedCategory}
                  loading={loading}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Search Filters */}
      <SearchFilters
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
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
        .smooth-scroll {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
} 