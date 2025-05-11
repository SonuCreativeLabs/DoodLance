"use client";
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface SearchFiltersProps {
  showFilterModal: boolean;
  setShowFilterModal: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedJobType: string;
  setSelectedJobType: (type: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  handleSaveFilters: () => void;
  handleClearFilters: () => void;
}

const jobTypes = [
  "All",
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Remote"
];

const locations = [
  "All Locations",
  "Remote",
  "Mumbai",
  "Bangalore",
  "Delhi",
  "Hybrid"
];

export default function SearchFilters({
  showFilterModal,
  setShowFilterModal,
  selectedLocation,
  setSelectedLocation,
  selectedJobType,
  setSelectedJobType,
  priceRange,
  setPriceRange,
  handleSaveFilters,
  handleClearFilters
}: SearchFiltersProps) {
  if (!showFilterModal) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
    >
      <div className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="relative w-full bg-[#111111] rounded-2xl shadow-xl p-6"
        >
          {/* Close Button */}
          <button
            onClick={() => setShowFilterModal(false)}
            className="absolute right-4 top-4 text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Filters</h2>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Location
              </label>
              <div className="grid grid-cols-2 gap-2">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedLocation === location
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Job Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {jobTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedJobType(type)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedJobType === type
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Budget Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    placeholder="Min"
                    className="w-full px-4 h-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/30"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    placeholder="Max"
                    className="w-full px-4 h-10 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/30"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={handleClearFilters}
                className="flex-1 h-12 rounded-xl bg-white/5 text-white/60 hover:bg-white/10 font-medium transition-all"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  handleSaveFilters();
                  setShowFilterModal(false);
                }}
                className="flex-1 h-12 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-600 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
