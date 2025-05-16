"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';

interface SearchFiltersProps {
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  selectedService: string;
  setSelectedService: (service: string) => void;
  range: [number];
  setRange: React.Dispatch<React.SetStateAction<[number]>>;
  minRating: number;
  setMinRating: (rating: number) => void;
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  availability: string;
  setAvailability: (availability: string) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  selectedTimeOptions: string[];
  setSelectedTimeOptions: (options: string[]) => void;
  onSave: () => void;
  onClose: () => void;
  onClear: () => void;
}

const areas = [
  "Velachery",
  "Anna Nagar",
  "T Nagar",
  "Adyar",
  "Mylapore",
  "Nungambakkam",
  "Guindy",
  "Tambaram",
  "Porur"
];

const services = [
  "All",
  "AC Repair & Service",
  "Home Cleaning",
  "Cricket Coach",
  "Music Teacher",
  "Driving Instructor",
  "Dance Teacher",
  "Fitness Trainer"
];

const timeOptions = [
  "Morning",
  "Afternoon",
  "Evening",
  "Night"
];

export default function SearchFilters({
  selectedArea,
  setSelectedArea,
  selectedService,
  setSelectedService,
  range,
  setRange,
  minRating,
  setMinRating,
  priceRange,
  setPriceRange,
  availability,
  setAvailability,
  selectedDate,
  setSelectedDate,
  selectedTimeOptions,
  setSelectedTimeOptions,
  onSave,
  onClose,
  onClear
}: SearchFiltersProps) {
  const handleTimeOptionClick = (option: string) => {
    if (selectedTimeOptions.includes(option)) {
      setSelectedTimeOptions(selectedTimeOptions.filter(t => t !== option));
    } else {
      setSelectedTimeOptions([...selectedTimeOptions, option]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#111111] shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 h-[calc(100vh-60px)] overflow-y-auto">
          {/* Area */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Area</label>
            <div className="grid grid-cols-2 gap-2">
              {areas.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedArea === area
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Service</label>
            <div className="grid grid-cols-2 gap-2">
              {services.map((service) => (
                <button
                  key={service}
                  onClick={() => setSelectedService(service)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedService === service
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          {/* Distance Range */}
          <div className="space-y-4">
            <label className="text-sm text-white/60">Distance (km)</label>
            <Slider
              defaultValue={range}
              max={50}
              step={1}
              onValueChange={(value) => setRange([value[0]])}
            />
            <div className="text-sm text-white/60">
              Within {range[0]} km
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-4">
            <label className="text-sm text-white/60">Minimum Rating</label>
            <Slider
              defaultValue={[minRating]}
              max={5}
              step={0.1}
              onValueChange={([value]) => setMinRating(value)}
            />
            <div className="text-sm text-white/60">
              {minRating.toFixed(1)} stars and above
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <label className="text-sm text-white/60">Price Range (₹)</label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange(prev => [parseInt(e.target.value) || 0, prev[1]])}
                className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50"
              />
              <span className="text-white/60">to</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange(prev => [prev[0], parseInt(e.target.value) || 0])}
                className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50"
              />
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <label className="text-sm text-white/60">Availability</label>
            <input
              type="date"
              value={selectedDate || ''}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50"
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              {timeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleTimeOptionClick(option)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedTimeOptions.includes(option)
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#111111]">
          <div className="flex items-center gap-4">
            <button
              onClick={onClear}
              className="flex-1 h-12 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onSave}
              className="flex-1 h-12 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
