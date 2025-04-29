"use client";

import React from 'react';
import { X } from 'lucide-react';
import { areas, serviceTypes, availabilityOptions, timeOptions } from '../constants';

interface FilterModalProps {
  showFilterModal: boolean;
  setShowFilterModal: (show: boolean) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  selectedService: string;
  setSelectedService: (service: string) => void;
  range: number[];
  setRange: (range: number[]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  availability: string;
  setAvailability: (availability: string) => void;
  priceType: string;
  setPriceType: (type: string) => void;
  selectedTimeOptions: string[];
  setSelectedTimeOptions: (options: string[]) => void;
  onSave: () => void;
  onClear: () => void;
}

export default function FilterModal({
  showFilterModal,
  setShowFilterModal,
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
  priceType,
  setPriceType,
  selectedTimeOptions,
  setSelectedTimeOptions,
  onSave,
  onClear
}: FilterModalProps) {
  if (!showFilterModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#111111] rounded-2xl w-full max-w-lg p-6 relative">
        <button
          onClick={() => setShowFilterModal(false)}
          className="absolute right-4 top-4 text-white/60 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">Filters</h2>
        
        {/* Area Selection */}
        <div className="mb-6">
          <h3 className="text-white text-lg font-semibold mb-3">Area</h3>
          <div className="grid grid-cols-2 gap-2">
            {areas.map(area => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                  selectedArea === area
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Service Type */}
        <div className="mb-6">
          <h3 className="text-white text-lg font-semibold mb-3">Service Type</h3>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {serviceTypes.map(service => (
              <button
                key={service}
                onClick={() => setSelectedService(service)}
                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                  selectedService === service
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        {/* Distance Range */}
        <div className="mb-6">
          <h3 className="text-white text-lg font-semibold mb-3">Distance (km)</h3>
          <input
            type="range"
            min="1"
            max="20"
            value={range[0]}
            onChange={(e) => setRange([parseInt(e.target.value)])}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-white/70 text-sm mt-2">Up to {range[0]} km</div>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <h3 className="text-white text-lg font-semibold mb-3">Availability</h3>
          <div className="grid grid-cols-2 gap-2">
            {availabilityOptions.map(option => (
              <button
                key={option}
                onClick={() => setAvailability(option)}
                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                  availability === option
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Time */}
        <div className="mb-6">
          <h3 className="text-white text-lg font-semibold mb-3">Preferred Time</h3>
          <div className="grid grid-cols-3 gap-2">
            {timeOptions.map(time => (
              <button
                key={time}
                onClick={() => {
                  if (selectedTimeOptions.includes(time)) {
                    setSelectedTimeOptions(selectedTimeOptions.filter(t => t !== time));
                  } else {
                    setSelectedTimeOptions([...selectedTimeOptions, time]);
                  }
                }}
                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTimeOptions.includes(time)
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onClear}
            className="flex-1 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
          >
            Clear All
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold hover:from-purple-700 hover:to-purple-500 transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
} 