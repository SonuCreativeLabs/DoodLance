"use client";

import React, { useRef, useEffect, useState } from 'react';
import { X, Clock, Calendar } from "lucide-react";
import { useNavbar } from "@/contexts/NavbarContext";
import { areas, serviceTypes, availabilityOptions, timeOptions } from '../constants';

interface SearchFiltersProps {
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
  const { setNavbarVisibility } = useNavbar();

  useEffect(() => {
    if (showFilterModal) {
      document.body.style.overflow = 'hidden';
      setNavbarVisibility(false);
    } else {
      document.body.style.overflow = 'unset';
      setNavbarVisibility(true);
    }

    return () => {
      document.body.style.overflow = 'unset';
      setNavbarVisibility(true);
    };
  }, [showFilterModal, setNavbarVisibility]);

  if (!showFilterModal) return null;

  return (
    <div className="fixed inset-0 z-[4] flex flex-col bg-[#111111] text-white overflow-y-auto pb-16">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-white/10 bg-[#111111]">
        <h2 className="text-lg font-extrabold">Filter</h2>
        <button
          className="p-1.5 rounded-full bg-[#111111] hover:bg-[#111111]/80 text-white/60 hover:text-white"
          onClick={() => setShowFilterModal(false)}
          aria-label="Close filters"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 max-w-2xl w-full mx-auto">
        {/* Area Filter */}
        <div className="mb-6">
          <label className="block mb-2 text-sm text-white/90 font-medium">Area</label>
          <select
            value={selectedArea}
            onChange={e => setSelectedArea(e.target.value)}
            className="w-full px-4 py-3 text-sm rounded-xl bg-[#111111] text-white border border-white/10 font-medium"
          >
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        {/* Service Type Filter */}
        <div className="mb-6">
          <label className="block mb-2 text-sm text-white/90 font-medium">Service Type</label>
          <select
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
            className="w-full px-4 py-3 text-sm rounded-xl bg-[#111111] text-white border border-white/10 font-medium"
          >
            <option value="All">All Services</option>
            {serviceTypes.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        {/* Distance Filter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-white/90 font-medium">Distance (km)</label>
            <span className="text-sm text-white/80 font-medium">{range[0]} km</span>
          </div>
          <input
            type="range"
            min={1}
            max={50}
            value={range[0]}
            onChange={e => setRange([parseInt(e.target.value)])}
            className="w-full h-2 accent-purple-500"
          />
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-white/90 font-medium">Price Range</label>
            <span className="text-sm text-white/80 font-medium">
              ₹{priceRange[0]} - ₹{priceRange[1] === 20000 ? '20k+' : priceRange[1]}
            </span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min={0}
              max={20000}
              step={100}
              value={priceRange[0]}
              onChange={e => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="w-full h-2 accent-purple-500"
            />
            <input
              type="range"
              min={0}
              max={20000}
              step={100}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 accent-purple-500"
            />
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <label className="block mb-2 text-sm text-white/90 font-medium">Min. Rating</label>
          <div className="grid grid-cols-4 gap-2">
            {[0, 3, 4, 4.5].map(rating => (
              <button
                key={rating}
                onClick={() => setMinRating(rating)}
                className={`py-2 rounded-xl text-sm font-medium ${
                  minRating === rating
                    ? 'bg-purple-600 text-white'
                    : 'bg-transparent text-white/70 border border-white/10 hover:bg-white/5'
                }`}
              >
                {rating === 0 ? 'Any' : `${rating}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div className="mb-6">
          <label className="block mb-2 text-sm text-white/90 font-medium">Availability</label>
          <div className="grid grid-cols-2 gap-2">
            {availabilityOptions.map(option => (
              <button
                key={option}
                onClick={() => setAvailability(option)}
                className={`py-2 rounded-xl text-sm font-medium ${
                  availability === option
                    ? 'bg-purple-600 text-white'
                    : 'bg-transparent text-white/70 border border-white/10 hover:bg-white/5'
                }`}
              >
                {option}
              </button>
            ))}
            <button
              onClick={() => setAvailability('Pick Date')}
              className={`py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 ${
                availability === 'Pick Date'
                  ? 'bg-purple-600 text-white'
                  : 'bg-transparent text-white/70 border border-white/10 hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Pick Date
            </button>
            {availability === 'Pick Date' && (
              <div className="relative">
                <input
                  ref={dateInputRef}
                  type="date"
                  className="py-2 px-3 text-sm rounded-xl bg-[#111111] text-white border border-white/10 w-full appearance-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-100"
                  value={selectedDate ?? ''}
                  onChange={e => setSelectedDate(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Preferred Time Filter */}
        {(availability === 'Available Today' || availability === 'Pick Date') && (
          <div className="mb-6">
            <label className="block mb-2 text-sm text-white/90 font-medium">Time</label>
            <div className="grid grid-cols-3 gap-2">
              {timeOptions.map(option => (
                <button
                  key={option}
                  onClick={() => handleTimeOptionClick(option)}
                  className={`py-2 rounded-xl text-sm font-medium ${
                    selectedTimeOptions.includes(option)
                      ? 'bg-purple-600 text-white'
                      : 'bg-transparent text-white/70 border border-white/10 hover:bg-white/5 transition-colors'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons - No Background Card */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className="max-w-md mx-auto w-full">
          <div className="flex gap-2.5">
            <button
              onClick={handleClearFilters}
              className="flex-1 py-3 rounded-xl bg-[#111111] hover:bg-[#111111]/80 text-white/90 text-sm font-medium border border-white/10 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
            <button
              onClick={handleSaveFilters}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-600 hover:to-purple-500/90 text-white text-sm font-medium transition-all duration-200 active:scale-[0.98] shadow-lg shadow-purple-500/20"
            >
              Show Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}