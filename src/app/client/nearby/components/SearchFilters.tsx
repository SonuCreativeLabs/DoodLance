"use client";

import React, { useRef } from 'react';
import { Search, X, Calendar } from 'lucide-react';
import { areas, serviceTypes, availabilityOptions, timeOptions } from '../constants';

interface SearchFiltersProps {
  showFilterModal: boolean;
  setShowFilterModal: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  selectedTimeOptions: string[];
  handleTimeOptionClick: (option: string) => void;
  handleSaveFilters: () => void;
  handleClearFilters: () => void;
}

export default function SearchFilters({
  showFilterModal,
  setShowFilterModal,
  searchQuery,
  setSearchQuery,
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
  handleTimeOptionClick,
  handleSaveFilters,
  handleClearFilters,
}: SearchFiltersProps) {
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  if (!showFilterModal) return null;

  return (
    <div className="fixed inset-0 z-[4] flex flex-col bg-[#111111] text-white animate-fadeIn">
      {/* Modal header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#111111]">
        <h2 className="text-xl font-extrabold">Search & Filters</h2>
        <button
          className="p-2 rounded-full bg-[#111111] hover:bg-[#111111]/80 text-white/60 hover:text-white"
          onClick={() => setShowFilterModal(false)}
          aria-label="Close filters"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Modal content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Search input */}
        <div className="mb-6">
          <div className="flex items-center gap-2 bg-[#111111] rounded-full px-4 py-3 border border-white/10">
            <Search className="w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search for services, professionals, or areas..."
              className="flex-1 bg-transparent outline-none text-lg text-white font-semibold placeholder:text-white/60"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Area Filter */}
        <div className="mb-6">
          <label className="block mb-1 text-white/90 font-bold">Area</label>
          <select
            value={selectedArea}
            onChange={e => setSelectedArea(e.target.value)}
            className="w-full px-3 py-3 rounded-lg bg-[#111111] text-white border border-white/10 text-lg font-semibold"
          >
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        {/* Service Type Filter */}
        <div className="mb-6">
          <label className="block mb-1 text-white/90 font-bold">Service Type</label>
          <select
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
            className="w-full px-3 py-3 rounded-lg bg-[#111111] text-white border border-white/10 text-lg font-semibold"
          >
            <option value="All">All Services</option>
            {serviceTypes.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        {/* Distance Filter */}
        <div className="mb-6">
          <label className="block mb-1 text-white/90 font-bold">Distance (km)</label>
          <input
            type="range"
            min={1}
            max={50}
            value={range[0]}
            onChange={e => setRange([parseInt(e.target.value)])}
            className="w-full accent-purple-500"
          />
          <div className="text-right text-base text-white/80 font-bold">{range[0]} km</div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <label className="block mb-1 text-white/90 font-bold">Price Range (₹)</label>
          <input
            type="range"
            min={0}
            max={20000}
            step={100}
            value={priceRange[0]}
            onChange={e => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            className="w-full accent-purple-500"
          />
          <input
            type="range"
            min={0}
            max={20000}
            step={100}
            value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-purple-500 mt-1"
          />
          <div className="text-right text-base text-white/80 font-bold">
            ₹{priceRange[0]} - ₹{priceRange[1] === 20000 ? '20,000+' : priceRange[1]}
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <label className="block mb-1 text-white/90 font-bold">Minimum Rating</label>
          <div className="flex gap-2">
            {[0, 3, 4, 4.5].map(rating => (
              <button
                key={rating}
                onClick={() => setMinRating(rating)}
                className={`px-4 py-2 rounded-lg text-base font-bold ${
                  minRating === rating
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#111111] text-white/70 border border-white/10'
                }`}
              >
                {rating === 0 ? 'Any' : `${rating}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div className="mb-6">
          <label className="block mb-1 text-white/90 font-bold">Availability</label>
          <div className="flex gap-2 flex-wrap">
            {availabilityOptions.map(option => (
              <button
                key={option}
                onClick={() => setAvailability(option)}
                className={`px-4 py-2 rounded-lg text-base font-bold ${
                  availability === option
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#111111] text-white/70 border border-white/10'
                }`}
              >
                {option}
              </button>
            ))}
            <button
              onClick={() => setAvailability('Pick Date')}
              className={`px-4 py-2 rounded-lg text-base font-bold flex items-center gap-1 ${
                availability === 'Pick Date'
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#111111] text-white/70 border border-white/10'
              }`}
            >
              <Calendar className="w-5 h-5" /> Pick Date
            </button>
            {availability === 'Pick Date' && (
              <input
                ref={dateInputRef}
                type="date"
                className="ml-2 px-2 py-2 rounded bg-[#111111] text-white border border-white/10"
                value={selectedDate ?? ''}
                onChange={e => setSelectedDate(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Preferred Time Filter */}
        {(availability === 'Available Today' || availability === 'Pick Date') && (
          <div className="mb-6">
            <label className="block mb-1 text-white/90 font-bold">Preferred Time</label>
            <div className="flex gap-2 flex-wrap">
              {timeOptions.map(option => (
                <button
                  key={option}
                  onClick={() => handleTimeOptionClick(option)}
                  className={`px-4 py-2 rounded-lg text-base font-bold ${
                    selectedTimeOptions.includes(option)
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#111111] text-white/70 border border-white/10'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-8">
          <button
            className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-lg text-lg transition-colors"
            onClick={handleSaveFilters}
          >
            Show Results
          </button>
          <button
            onClick={handleClearFilters}
            className="flex-1 flex items-center justify-center gap-2 bg-[#111111] hover:bg-[#111111]/80 rounded-lg px-4 py-4 text-white/70 text-lg border border-white/10 transition-colors font-bold"
          >
            <X className="w-5 h-5" />
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
} 