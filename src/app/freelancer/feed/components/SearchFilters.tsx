"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { X, Clock, Briefcase, MapPin, Code } from 'lucide-react';

import { WorkMode } from '../types';

interface SearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  location: string;
  setLocation: (location: string) => void;
  serviceCategory: string;
  setServiceCategory: (category: string) => void;
  workMode: WorkMode | '';
  setWorkMode: (mode: WorkMode | '') => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  distance: number;
  setDistance: (distance: number) => void;
  filtersApplied: boolean;
  currentLocation: string;
  selectedSkills: string[];
  setSelectedSkills: (skills: string[] | ((prevSkills: string[]) => string[])) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

const serviceCategories = [
  { id: 'all', name: 'All Services', online: true, offline: true },
  { id: 'design', name: 'Design & Creative', online: true, offline: true },
  { id: 'development', name: 'Development & IT', online: true, offline: false },
  { id: 'marketing', name: 'Sales & Marketing', online: true, offline: true },
  { id: 'writing', name: 'Writing & Translation', online: true, offline: false },
  { id: 'admin', name: 'Admin Support', online: true, offline: true },
  { id: 'finance', name: 'Finance & Accounting', online: true, offline: true },
  { id: 'engineering', name: 'Engineering', online: true, offline: true },
  { id: 'legal', name: 'Legal', online: true, offline: true },
  { id: 'beauty', name: 'Beauty & Wellness', online: false, offline: true },
  { id: 'fitness', name: 'Fitness Training', online: false, offline: true },
  { id: 'tutoring', name: 'Tutoring', online: true, offline: true },
  { id: 'consulting', name: 'Business Consulting', online: true, offline: true },
  { id: 'photography', name: 'Photography', online: true, offline: true },
  { id: 'events', name: 'Event Planning', online: true, offline: true },
];

// const jobTypes = [
//   { id: 'fulltime', label: 'Full-time', icon: <Clock className="w-4 h-4" /> },
//   { id: 'parttime', label: 'Part-time', icon: <Clock className="w-4 h-4" /> },
//   { id: 'contract', label: 'Contract', icon: <Briefcase className="w-4 h-4" /> },
//   { id: 'freelance', label: 'Freelance', icon: <Code className="w-4 h-4" /> }
// ]; // Unused

const workModes = [
  { id: 'hybrid', label: 'Hybrid', icon: <MapPin className="w-4 h-4" /> },
  { id: 'onsite', label: 'On-site', icon: <MapPin className="w-4 h-4" /> },
  { id: 'remote', label: 'Remote', icon: <MapPin className="w-4 h-4" /> }
];

// const experienceLevels = [
//   { id: 'entry', label: 'Entry Level' },
//   { id: 'mid', label: 'Mid Level' },
//   { id: 'senior', label: 'Senior' },
//   { id: 'expert', label: 'Expert' }
// ]; // Unused

// const skills = [
//   'Web Development', 'Mobile Development', 'UI/UX Design',
//   'Graphic Design', 'Content Writing', 'Digital Marketing',
//   'Video Editing', 'Data Entry', 'Customer Service'
// ]; // Unused

export default function SearchFilters({
  isOpen,
  onClose,
  location,
  setLocation,
  serviceCategory,
  setServiceCategory,
  workMode,
  setWorkMode,
  priceRange,
  setPriceRange,
  distance,
  setDistance,
  filtersApplied,
  currentLocation,
  // selectedSkills, // Unused
  setSelectedSkills,
  clearFilters,
  applyFilters,
}: SearchFiltersProps) {
  const [localLocation, setLocalLocation] = useState(location);
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update local location when prop changes
  React.useEffect(() => {
    setLocalLocation(location);
  }, [location]);

  // Search for location suggestions in Chennai
  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setLocationSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}` +
        `&types=locality,neighborhood,place,address` +
        `&proximity=80.2707,13.0827` +  // Chennai coordinates
        `&bbox=80.0,12.8,80.3,13.2` +  // Bounding box around Chennai
        `&limit=5`
      );
      const data = await response.json();
      
      // Filter to ensure we only get Chennai-related results
      const chennaiResults = (data.features || []).filter((feature: any) => {
        const context = feature.context || [];
        return context.some((ctx: any) => 
          (ctx.id && ctx.id.includes('place') && ctx.text.toLowerCase().includes('chennai')) ||
          (ctx.id && ctx.id.includes('region') && ctx.text.toLowerCase().includes('tamil'))
        );
      });
      
      setLocationSuggestions(chennaiResults);
    } catch (error) {
      console.error('Error searching locations:', error);
      setLocationSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (suggestion: any) => {
    const locationName = suggestion.place_name || suggestion.text || 'Selected Location';
    setLocalLocation(locationName);
    setLocation(locationName);
    setShowSuggestions(false);
    const input = document.activeElement as HTMLElement;
    if (input) input.blur();
  };

  // Helper function to safely handle work mode selection from UI
  const handleWorkModeSelect = (mode: string) => {
    if (isWorkMode(mode)) {
      setWorkMode(mode as WorkMode);
    } else {
      setWorkMode('');
    }
  };

  // Handle work mode button click with type safety
  const handleWorkModeButtonClick = (mode: WorkMode) => {
    setWorkMode(mode);
  };
  
  // Type guard for WorkMode
  const isWorkMode = (value: string): value is WorkMode => {
    return ['remote', 'onsite', 'hybrid'].includes(value);
  };

  const handleClear = () => {
    setLocalLocation('');
    setServiceCategory('all');
    setWorkMode('');
    setPriceRange([0, 1000]);
    setDistance(50);
    setSelectedSkills([]);
    clearFilters();
  };

  const handleUseCurrentLocation = () => {
    setLocalLocation(currentLocation);
    setLocation(currentLocation);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocalLocation(newLocation);
  };

  // Update selected skills with proper type safety
  const toggleSkill = (skill: string) => {
    setSelectedSkills(currentSkills => {
      // Create a new array to ensure we're not mutating the state directly
      const updatedSkills = [...currentSkills];
      const skillIndex = updatedSkills.indexOf(skill);
      
      if (skillIndex > -1) {
        // Remove the skill if it exists
        updatedSkills.splice(skillIndex, 1);
      } else {
        // Add the skill if it doesn't exist
        updatedSkills.push(skill);
      }
      
      return updatedSkills;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-[#121212] text-white overflow-y-auto"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            position: 'fixed',
            zIndex: 50
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 p-4 border-b border-white/5 bg-[#1A1A1A]/95 backdrop-blur-md flex justify-between items-center pt-12">
            <h2 className="text-lg font-medium">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close filters"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-8 pb-24 max-w-3xl mx-auto w-full">
            {/* Location */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-white/80">Location</h3>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Use Current Location
                </button>
              </div>
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={localLocation}
                    onChange={(e) => {
                      const value = e.target.value;
                      setLocalLocation(value);
                      searchLocation(value);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Search areas in Chennai..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-purple-400 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                {/* Location suggestions */}
                <AnimatePresence>
                  {showSuggestions && (locationSuggestions.length > 0 || isLoading) && (
                    <motion.div 
                      className="absolute z-50 w-full mt-1 bg-[#1E1E1E] border border-white/10 rounded-lg shadow-xl overflow-hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isLoading ? (
                        <div className="px-4 py-3 text-sm text-white/60 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-purple-400 rounded-full animate-spin mr-2"></div>
                          Searching...
                        </div>
                      ) : locationSuggestions.length > 0 ? (
                        locationSuggestions.map((suggestion) => {
                          // Get the full place name
                          const placeName = suggestion.place_name || suggestion.text || '';
                          
                          // Split into parts and clean up
                          const parts = placeName.split(',')
                            .map((part: string) => part.trim())
                            .filter((part: string) => part);
                          
                          // If no parts, show default
                          if (parts.length === 0) {
                            return (
                              <div key="no-location" className="px-4 py-3 text-sm text-white/60">
                                No location details
                              </div>
                            );
                          }
                          
                          // First part is the main area
                          const mainArea = parts[0];
                          
                          // Get unique location parts (excluding the main area)
                          const uniqueParts = parts
                            .slice(1) // Skip the main area
                            .filter((part: string) => part !== mainArea) // Remove duplicates of main area
                            .filter((part: string, index: number, self: string[]) => self.indexOf(part) === index); // Remove duplicates
                          
                          // Join the remaining parts for the hierarchy
                          const hierarchy = uniqueParts.join(', ');
                          
                          return (
                            <button
                              key={suggestion.id}
                              type="button"
                              className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/5 cursor-pointer flex items-center"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleLocationSelect(suggestion)}
                            >
                              <MapPin className="w-4 h-4 mr-2 text-purple-400 flex-shrink-0" />
                              <div className="truncate">
                                <div className="font-medium text-white">{mainArea}</div>
                                {hierarchy && (
                                  <div className="text-xs text-white/60 truncate">
                                    {hierarchy}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3 text-sm text-white/60">
                          No locations found. Try another search.
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Search Radius */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white/80">Search Radius</h3>
                <span className="text-sm text-white/70">{distance} km</span>
              </div>
              <div className="px-2">
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={[distance]}
                  onValueChange={(value) => setDistance(value[0])}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-white/50 px-1">
                <span>1 km</span>
                <span>100 km</span>
              </div>
            </div>

            {/* Work Mode */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white/80">Work Mode</h3>
              <div className="grid grid-cols-3 gap-2">
                {workModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleWorkModeButtonClick(mode.id as WorkMode)}
                    className={`flex flex-col items-center justify-center py-3 rounded-xl transition-colors ${
                      workMode === mode.id
                        ? 'bg-gradient-to-br from-purple-500/90 to-purple-600/90 text-white shadow-lg shadow-purple-500/20'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {mode.icon}
                    <span className="text-xs mt-1">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Service Category */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white/80">Service Category</h3>
              <div className="grid grid-cols-2 gap-2">
                {serviceCategories
                  .filter(cat => workMode !== 'remote' || cat.online)
                  .filter(cat => workMode !== 'onsite' || cat.offline)
                  .map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setServiceCategory(category.id)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                        serviceCategory === category.id
                          ? 'bg-purple-500/90 text-white shadow-lg shadow-purple-500/20'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white/80">Price Range</h3>
                <span className="text-sm text-white/70">
                  ₹{priceRange[0]} - ₹{priceRange[1]}{priceRange[1] === 10000 ? '+' : ''}
                </span>
              </div>
              <div className="px-2">
                <Slider
                  min={0}
                  max={10000}
                  step={100}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange([value[0], value[1]])}
                  minStepsBetweenThumbs={1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-white/50 px-1">
                <span>₹0</span>
                <span>₹10,000+</span>
              </div>
            </div>

            {/* Footer with action buttons */}
            <div className="sticky bottom-0 left-0 right-0 p-5 border-t border-white/5 bg-[#1A1A1A] mt-auto">
              <div className="flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white/90 bg-white/5 hover:bg-white/10 transition-colors rounded-xl"
                >
                  Clear All
                </button>
                <button
                  onClick={() => {
                    applyFilters();
                    onClose();
                  }}
                  className={`flex-1 px-4 py-3 text-sm font-medium text-white transition-colors rounded-xl ${
                    filtersApplied
                      ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'
                      : 'bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500'
                  }`}
                >
                  {filtersApplied ? 'Update Filters' : 'Apply Filters'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
