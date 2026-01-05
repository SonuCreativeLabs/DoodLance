"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, Star, Check, ChevronDown, Map, Sparkles, Compass } from 'lucide-react';
import type { PanInfo } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ComingSoonOverlay } from '@/components/common/ComingSoonOverlay';

const MapView = dynamic(
  () => import('./components/MapViewComponent').then(mod => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#111111]">
        <div className="animate-pulse text-white/40">Loading map...</div>
      </div>
    )
  }
);

import ProfessionalsFeed from './components/ProfessionalsFeed';
import SearchFilters from './components/SearchFilters';
import { useSkills } from '@/contexts/SkillsContext';
import { useForYouJobs } from '@/contexts/ForYouJobsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import LoginDialog from '@/components/auth/LoginDialog';
import { Job, WorkMode } from './types';

export default function FeedPage() {
  const { user, isAuthenticated: authIsAuthenticated } = useAuth();
  const { requireAuth, openLoginDialog, setOpenLoginDialog, isAuthenticated } = useRequireAuth();
  // Sheet and UI state
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const router = useRouter();
  const { skills } = useSkills();
  const { forYouJobs } = useForYouJobs();
  // UI State
  const [isDragging, setIsDragging] = useState(false);
  const [isDragTextVisible, setIsDragTextVisible] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Data State
  const [selectedCategory, setSelectedCategory] = useState('For You');
  const [allJobs, setAllJobs] = useState<Job[]>([]); // Store all jobs fetched from API
  // Define JobWithCoordinates type that matches the MapView component's expectations
  type JobWithCoordinates = {
    // Required properties from Job
    id: string;
    title: string;
    description: string;
    category: string;
    rate: number;
    budget: number;
    priceUnit: string;
    location: string;
    skills: string[];
    workMode: 'remote' | 'onsite' | 'all';
    type: 'freelance' | 'part-time' | 'full-time' | 'contract';
    postedAt: string;
    company: string;
    companyLogo: string;
    clientName: string;
    clientImage?: string;
    clientRating: string | number;
    clientJobs: number;
    proposals: number;
    duration: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'one-time';
    experience: 'Entry Level' | 'Intermediate' | 'Expert';
    // Coordinate properties (required by MapView)
    coords: [number, number];
    coordinates: [number, number];
    // Optional properties
    client?: any;
    // Allow additional properties
    [key: string]: any;
  }
  const [filteredJobs, setFilteredJobs] = useState<JobWithCoordinates[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [appliedJobTitle, setAppliedJobTitle] = useState('');

  // Fetch applied job IDs
  const fetchAppliedStatus = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`/api/applications?myApplications=true&userId=${user.id}`);
      if (res.ok) {
        const applications = await res.json();
        const ids = applications.map((app: any) => app.jobId || (app.job ? app.job.id : null)).filter(Boolean);
        setAppliedJobIds(new Set(ids));
      }
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    }
  };

  useEffect(() => {
    fetchAppliedStatus();

    const handleAppCreated = () => fetchAppliedStatus();
    window.addEventListener('applicationCreated', handleAppCreated);
    return () => window.removeEventListener('applicationCreated', handleAppCreated);
  }, [user?.id]);

  // State for filters
  const [location, setLocation] = useState<string>('Chennai, Tamil Nadu, India');
  const [serviceCategory, setServiceCategory] = useState<string>('all');
  const [workMode, setWorkMode] = useState<WorkMode | ''>('');
  // Price range in INR per hour (aligned with job.rate values)
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 2500]);
  const [distance, setDistance] = useState<number>(50);
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
    const handleGeolocation = async () => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by your browser');
        setCurrentLocation('Chennai, India');
        setLocation('Chennai, India');
        return;
      }

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          });
        });

        const { latitude, longitude } = position.coords;
        const address = await reverseGeocode(latitude, longitude);
        setCurrentLocation(address);
        setLocation(address);
      } catch (error) {
        // Handle different types of geolocation errors
        const geolocationError = error as GeolocationPositionError;
        let errorMessage = 'Unable to retrieve your location';

        switch (geolocationError.code) {
          case geolocationError.PERMISSION_DENIED:
            errorMessage = 'Location access was denied. Using default location.';
            break;
          case geolocationError.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Using default location.';
            break;
          case geolocationError.TIMEOUT:
            errorMessage = 'Location request timed out. Using default location.';
            break;
        }

        console.warn(errorMessage, geolocationError);
        setCurrentLocation('Chennai, India');
        setLocation('Chennai, India');
      }
    };

    handleGeolocation();
  }, []);

  // Constants for sheet positions
  const COLLAPSED_HEIGHT = 180;
  const HEADER_HEIGHT = 104;

  const resetDragTextVisibility = () => {
    setTimeout(() => setIsDragTextVisible(true), 1000);
  };

  // Handle filter button click
  const handleFilterClick = () => {
    setShowFilterModal(!showFilterModal);
  };

  // Handle filter application
  const applyFilters = async () => {
    setFiltersApplied(true);
    setShowFilterModal(false);
    // Trigger a re-filter
    const filtered = await filterJobs();
    setFilteredJobs(filtered);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setLocation('Current Location');
    setServiceCategory('all');
    setWorkMode('');
    setPriceRange([0, 10000]);
    setDistance(50);
    setFiltersApplied(false);
  };

  // Filter jobs based on selected tab and filters
  const filterJobs = async (): Promise<JobWithCoordinates[]> => {
    // Start with all jobs and ensure they have coordinates
    let filtered = allJobs.map(job => {
      // Check if job has coordinates in any form
      let coords: [number, number];

      // First check for coords array
      if (Array.isArray(job.coords) && job.coords.length === 2) {
        coords = [job.coords[0], job.coords[1]] as [number, number];
      }
      // If no coordinates found, use default (Chennai)
      else {
        coords = [80.2707, 13.0827];
      }

      // Create a new job object with the required properties
      const jobWithCoords: JobWithCoordinates = {
        // Spread all existing job properties
        ...job,
        // Ensure coordinates are set
        coordinates: coords,
        coords: coords,
        // Ensure all required properties have default values
        id: job.id ?? '',
        title: job.title ?? '',
        description: job.description ?? '',
        category: job.category ?? '',
        rate: job.rate ?? 0,
        budget: job.budget ?? 0,
        priceUnit: job.priceUnit ?? 'project',
        location: job.location ?? 'Chennai, India',
        skills: Array.isArray(job.skills) ? job.skills : [],
        workMode: (job.workMode === 'remote' || job.workMode === 'onsite')
          ? job.workMode
          : 'onsite',
        type: (job.type === 'freelance' || job.type === 'part-time' || job.type === 'full-time' || job.type === 'contract')
          ? job.type
          : 'freelance',
        postedAt: job.postedAt ?? new Date().toISOString(),
        company: job.company ?? 'Unknown',
        companyLogo: job.companyLogo ?? '',
        clientName: job.clientName ?? 'Anonymous',
        clientImage: job.clientImage,
        clientRating: typeof job.clientRating === 'number' || typeof job.clientRating === 'string'
          ? job.clientRating
          : 0,
        clientJobs: typeof job.clientJobs === 'number' ? job.clientJobs : 0,
        proposals: typeof job.proposals === 'number' ? job.proposals : 0,
        duration: job.duration || 'one-time',
        experience: (job.experience === 'Entry Level' || job.experience === 'Intermediate' || job.experience === 'Expert')
          ? job.experience
          : 'Intermediate',
        client: job.client
      };

      return jobWithCoords;
    });

    // For "For You" tab - use the shared forYouJobs from context
    if (selectedCategory === 'For You') {
      // Convert forYouJobs to JobWithCoordinates format
      const forYouJobsWithCoords = forYouJobs.map(job => {
        // Check if job has coordinates in any form
        let coords: [number, number];

        // First check for coords array
        if (Array.isArray(job.coords) && job.coords.length === 2) {
          coords = [job.coords[0], job.coords[1]] as [number, number];
        }
        // If no coordinates found, use default (Chennai)
        else {
          coords = [80.2707, 13.0827];
        }

        return {
          ...job,
          coordinates: coords,
          coords: coords,
        } as JobWithCoordinates;
      });

      filtered = forYouJobsWithCoords;

      // Apply search query if one exists
      if (searchQuery) {
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

      // Filter out jobs user has already applied to
      filtered = filtered.filter(job => !appliedJobIds.has(job.id));

      return filtered;
    }

    // For Explore tab - show all jobs by default, apply filters only if explicitly set
    if (selectedCategory === 'Explore') {
      // Apply filters if any are set
      if (filtersApplied) {

        // Filter by service category
        if (serviceCategory && serviceCategory !== 'all') {
          const categoryKey = serviceCategory.toLowerCase().replace(/\s*\/\s*/g, '-').replace(/\s+/g, '-');
          filtered = filtered.filter(job => {
            const jobCategoryKey = job.category.toLowerCase().replace(/\s*\/\s*/g, '-').replace(/\s+/g, '-');
            return jobCategoryKey === categoryKey || job.category.toLowerCase().includes(serviceCategory.toLowerCase());
          });
        }

        // Filter by workMode
        if (workMode && workMode !== 'all') {
          filtered = filtered.filter(job => job.workMode === workMode);
        }

        // Filter by price range
        if (priceRange && priceRange[0] !== 0 && priceRange[1] !== 10000) {
          filtered = filtered.filter(job => {
            const jobPrice = job.rate || job.budget || 0;
            return jobPrice >= priceRange[0] && jobPrice <= priceRange[1];
          });
        }

        // Filter by location (basic text match for now)
        if (location && location !== 'Current Location' && location !== 'Chennai, India') {
          const locationQuery = location.toLowerCase();
          filtered = filtered.filter(job =>
            job.location.toLowerCase().includes(locationQuery) ||
            job.title.toLowerCase().includes(locationQuery) ||
            job.description.toLowerCase().includes(locationQuery)
          );
        }

        // Filter by distance (basic implementation - could be improved with actual distance calculation)
        if (distance && distance < 100) {
          // For now, just keep all jobs since we don't have proper distance calculation
          // This could be enhanced with actual geographic distance calculations
        }
      }

      // Apply search query if one exists (same logic as For You tab)
      if (searchQuery) {
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

      // Filter out jobs user has already applied to
      filtered = filtered.filter(job => !appliedJobIds.has(job.id));

      return filtered;
    }

    // Default case - filter out applied jobs and return
    filtered = filtered.filter(job => !appliedJobIds.has(job.id));

    return filtered;
  };

  // Fetch all jobs from API on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        let apiJobs: Job[] = [];

        if (response.ok) {
          apiJobs = await response.json();
          setAllJobs(apiJobs);
        } else {
          console.error('Failed to fetch API jobs:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const initializeJobs = async () => {
      // Apply initial filtering to remove applied jobs
      const filtered = await filterJobs();
      setFilteredJobs(filtered);
    };

    initializeJobs();
  }, [allJobs, appliedJobIds]);

  // Re-filter jobs when category changes or forYouJobs updates
  useEffect(() => {
    const reFilterJobs = async () => {
      const filtered = await filterJobs();
      setFilteredJobs(filtered);
    };

    reFilterJobs();
  }, [selectedCategory, searchQuery, forYouJobs]);

  // Re-filter jobs when filters are applied or filter values change
  useEffect(() => {
    if (filtersApplied || selectedCategory === 'Explore') {
      const reFilterJobs = async () => {
        const filtered = await filterJobs();
        setFilteredJobs(filtered);
      };
      reFilterJobs();
    }
  }, [filtersApplied, serviceCategory, workMode, priceRange, location, distance]);

  const handleApply = async (jobId: string, proposal: string, rate: string, rateType: string, attachments: File[]) => {
    // Check authentication first - store this specific job application
    requireAuth(`apply-job-${jobId}`, { redirectTo: `/freelancer/feed` });

    // If user is not authenticated or profile incomplete, requireAuth handles it
    // If we reach here, they are ready to apply
    if (!isAuthenticated || !user?.id) {
      return; // Login dialog will open or profile redirect will happen
    }

    try {
      // Find the job to get its title
      const job = allJobs.find(j => j.id === jobId);

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId,
          freelancerId: user.id,
          coverLetter: proposal || 'I am interested in this job and believe I can deliver quality work.',
          proposedRate: parseFloat(rate) || 2500,
          estimatedDays: 7,
          skills: [],
          attachments: attachments.map(f => f.name)
        })
      });

      if (response.ok) {
        const newApplication = await response.json();
        console.log('Application submitted successfully:', newApplication.id);

        window.dispatchEvent(new CustomEvent('applicationCreated', { detail: { jobId } }));
        window.dispatchEvent(new CustomEvent('applicationsUpdated'));

        fetchAppliedStatus();

        setAppliedJobTitle(job?.title || 'this job');
        setShowSuccessModal(true);
      } else {
        const err = await response.json();
        alert(`Failed to submit application: ${err.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    }
  };

  // Auto-close success modal after 3 seconds and return to feed
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        // Optional: navigate back if needed
        // router.push('/freelancer/feed');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  return (
    <ComingSoonOverlay
      title="Drinks Break!"
      description={
        <>
          The Feed is rehydrating and will be back with fresh opportunities.<br />
          Stay tuned for the next session!
        </>
      }
    >
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
          clearFilters={clearAllFilters}
          applyFilters={applyFilters}
        />

        {/* Map View */}
        <div className="absolute inset-0 z-0">
          <MapView
            jobs={filteredJobs}
            selectedCategory={selectedCategory}
            onApply={handleApply}
            appliedJobIds={appliedJobIds}
          />
        </div>

        {/* Header - Fixed height to account for search and tabs */}
        <div className={`fixed top-0 left-0 right-0 z-10 px-4 pt-4 pb-0 transition-all duration-300 h-[120px] flex flex-col justify-start bg-[#121212] ${isSheetCollapsed ? 'bg-transparent' : 'bg-[#121212]'
          }`}>
          {/* Search Bar */}
          <div className="flex items-center mb-1">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/30 backdrop-blur-md text-white text-sm px-4 py-2.5 pl-10 pr-4 rounded-full border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-white/70"
              />
              <svg className="w-3.5 h-3.5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Categories with Filter Button */}
          <div className="relative flex items-center justify-center py-1.5 w-full overflow-visible">
            <div className={`relative transition-transform duration-300 ease-in-out ${selectedCategory === 'Explore' ? '-translate-x-8' : 'translate-x-0'
              }`}>
              <div className="flex items-center space-x-3">
                {/* For You Tab */}
                <button
                  className={`px-4 py-1.5 text-sm font-medium rounded whitespace-nowrap transition-all duration-200 flex items-center space-x-2 h-8
                    backdrop-blur-sm border transform scale-100 ${selectedCategory === 'For You'
                      ? 'bg-gradient-to-r from-purple-600/90 to-purple-500/90 text-white border-purple-500/30 shadow-lg shadow-purple-500/20'
                      : 'bg-black/30 text-white/90 border-white/5'
                    }`}
                  onClick={() => setSelectedCategory('For You')}
                >
                  <Sparkles className="w-3 h-3" />
                  <span className="font-medium">For You</span>
                </button>

                {/* Explore All Tab */}
                <div className="relative flex items-center">
                  <button
                    className={`px-4 py-1.5 text-sm font-medium rounded whitespace-nowrap transition-all duration-200 flex items-center space-x-2 h-8
                      backdrop-blur-sm border transform scale-100 ${selectedCategory === 'Explore'
                        ? 'bg-gradient-to-r from-purple-600/90 to-purple-500/90 text-white border-purple-500/30 shadow-lg shadow-purple-500/20'
                        : 'bg-black/30 text-white/90 border-white/5'
                      }`}
                    onClick={() => setSelectedCategory('Explore')}
                  >
                    <Compass className="w-3 h-3" strokeWidth={1.5} />
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
                      className={`w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 border ${filtersApplied
                        ? 'bg-gradient-to-r from-purple-600/90 to-purple-500/90 border-purple-500/30 shadow-lg shadow-purple-500/10'
                        : 'bg-black/30 border-white/10 hover:border-white/20'
                        }`}
                    >
                      <svg
                        className={`w-4 h-4 ${filtersApplied ? 'text-white' : 'text-white/90'}`}
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
          className={`bg-[#121212] backdrop-blur-lg ${isSheetCollapsed ? 'rounded-t-3xl' : 'rounded-none'} shadow-none`}
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            top: '119px',
            bottom: 0,
            touchAction: 'pan-y',
            willChange: 'transform',
            overflow: 'hidden',
          }}
          initial={{ y: 'calc(100vh - 160px)' }}
          animate={{
            y: isSheetCollapsed ? 'calc(100vh - 160px)' : '0',
            borderTopLeftRadius: isSheetCollapsed ? '1.5rem' : '0',
            borderTopRightRadius: isSheetCollapsed ? '1.5rem' : '0',
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
            className="flex flex-col items-center pt-1 pb-2 cursor-grab active:cursor-grabbing touch-none select-none bg-[#121212]"
            style={{ touchAction: 'none' }}
            onPointerDown={() => setIsDragTextVisible(false)}
            onPointerUp={() => resetDragTextVisibility()}
          >
            <div className="w-10 h-1 bg-white/30 rounded-full mb-1.5" />
            <div className="text-white/80 text-sm font-semibold">
              {filteredJobs.length} jobs available
            </div>
          </div>

          {/* Content container */}
          <div
            className={`flex-1 ${isSheetCollapsed ? 'overflow-hidden' : 'overflow-y-auto'} overscroll-contain`}
            style={{
              maxHeight: isSheetCollapsed ? '0' : 'calc(100vh - 140px)'
            }}
          >
            <div className="container max-w-2xl mx-auto px-0 pb-6">
              {/* Jobs list */}
              <div className="space-y-2 px-4">
                <ProfessionalsFeed
                  jobs={filteredJobs}
                  onApply={handleApply}
                  appliedJobIds={appliedJobIds}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Toggle Map/List Button - Positioned 15% from bottom and centered */}
        <motion.div
          className={`fixed bottom-[15%] left-0 right-0 z-50 flex justify-center transition-opacity duration-200 ${showFilterModal ? 'opacity-0 pointer-events-none' : 'opacity-100'
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
                <ChevronDown className="w-4 h-4 mr-2" />
                <span>Show List</span>
              </>
            ) : (
              <>
                <Map className="w-4 h-4 mr-2" />
                <span>Show Map</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#1e1e1e] rounded-2xl p-6 md:p-8 max-w-sm w-full border border-white/10 shadow-2xl relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Application Sent!</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Your application for <span className="text-white font-medium">{appliedJobTitle}</span> has been submitted successfully to the coach.
                  </p>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Continuue Browsing
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Dialog */}
        <LoginDialog
          open={openLoginDialog}
          onOpenChange={setOpenLoginDialog}
          onSuccess={() => {
            // After login, user can continue with their intended action
            // The requireAuth hook will handle executing the pending action
          }}
        />
      </div>
    </ComingSoonOverlay>
  );
}