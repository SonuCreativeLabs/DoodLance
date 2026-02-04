"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, ArrowRight, ShoppingCart, Star, MapPin, MessageSquare, Plus, Minus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHire } from '@/contexts/HireContext';
import { useNavbar } from '@/contexts/NavbarContext';
import { useAuth } from '@/contexts/AuthContext';
import { CricketWhiteBallSpinner } from '@/components/ui/CricketWhiteBallSpinner';

export default function BookingDatePage() {
  const router = useRouter();
  const { state: hireState, setBookingDetails, setBookingNotes, addToCart, clearCart, isLoaded, increaseSelectedServiceQuantity, decreaseSelectedServiceQuantity } = useHire();
  const { setNavbarVisibility } = useNavbar();
  const { user } = useAuth();

  // Dynamic Availability State
  const [freelancerId, setFreelancerId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<any[]>([]);
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [pausedDates, setPausedDates] = useState<string[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);

  // Initialize freelancerId from context
  useEffect(() => {
    if (hireState.freelancerId) {
      setFreelancerId(hireState.freelancerId);
    }
  }, [hireState.freelancerId]);

  // Hide bottom navbar on mount
  useEffect(() => {
    setNavbarVisibility(false);
    return () => setNavbarVisibility(true);
  }, [setNavbarVisibility]);

  // Fetch Availability
  useEffect(() => {
    if (!freelancerId) return;

    const fetchAvailability = async () => {
      setIsLoadingAvailability(true);
      try {
        const res = await fetch(`/api/client/hire/availability?freelancerId=${freelancerId}`);
        if (res.ok) {
          const data = await res.json();
          setAvailability(data.availability || []);
          setBookedSlots(data.bookedSlots || []);
          setPausedDates(data.pausedDates || []);
        }
      } catch (error) {
        console.error("Failed to fetch availability", error);
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [freelancerId]);

  // Helper to check if a date is a working day
  const isWorkingDay = (date: Date) => {
    if (!availability.length) return true; // Default to open if no settings configured at all

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayConfig = availability.find((d: any) => d.id === dayName || d.name.toLowerCase() === dayName);

    // Strict Booking: If configuration exists, respect it. If day is missing in config, assume unavailable.
    return dayConfig ? dayConfig.available : false;
  };

  // Helper to check if a date is paused
  const isPausedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayNum = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayNum}`;
    return pausedDates.includes(dateStr);
  };

  // Generate next 14 days starting from tomorrow
  const dates = React.useMemo(() => {
    const d = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) { // Next 14 days
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const isAvailable = isWorkingDay(date) && !isPausedDate(date);

      // Construct YYYY-MM-DD manually from local time to avoid UTC shifts
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const dayNum = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${dayNum}`;

      d.push({
        date: dateStr,
        day: date.getDate(),
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isAvailable: isAvailable
      });
    }
    return d;
  }, [availability, pausedDates]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isNavigating, setIsNavigating] = useState(false);

  // Auto-select the first available date if none selected or if current selection is unavailable/invalid
  useEffect(() => {
    if (dates.length > 0 && !isLoadingAvailability) {
      // If currently selected date is not available or null, pick first available
      const currentIsValid = selectedDate && dates.find(d => d.date === selectedDate)?.isAvailable;

      if (!currentIsValid) {
        const firstAvailable = dates.find(d => d.isAvailable);
        if (firstAvailable) {
          setSelectedDate(firstAvailable.date);
          setSelectedTimeSlot(null); // Reset time when date changes automatically
        }
      }
    }
  }, [dates, selectedDate, isLoadingAvailability]);

  // Generate Time Slots based on selected date
  const timeSlots = React.useMemo(() => {
    if (!selectedDate) return [];

    // Force local midnight to ensure correct weekday derivation
    const dateObj = new Date(`${selectedDate}T00:00:00`);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayConfig = availability.find((d: any) => d.id === dayName || d.name.toLowerCase() === dayName);

    console.log('🗓️ [SLOTS] Generating for:', {
      selectedDate,
      dayName,
      hasConfig: !!dayConfig,
      isAvailable: dayConfig?.available,
      slotsCount: dayConfig?.timeSlots?.length,
      rawSlots: dayConfig?.timeSlots
    });

    // If configuration exists but no config for this day or day is not available, return empty
    if (availability.length > 0 && (!dayConfig || !dayConfig.available)) {
      console.log(`🗓️ [SLOTS] Day ${dayName} blocked. Config exists: ${!!dayConfig}, Available: ${dayConfig?.available}`);
      return [];
    }

    // Default slots if ABSOLUTELY no configuration exists
    let configSlots: any[] = [];
    if (availability.length === 0) {
      configSlots = [];
    } else if (dayConfig && dayConfig.timeSlots && dayConfig.timeSlots.length > 0) {
      configSlots = dayConfig.timeSlots;
    } else {
      console.warn(`⚠️ [SLOTS] Day ${dayName} is marked available but has NO time slots configured!`);
      // User explicitly requested NO defaults.
      configSlots = [];
    }

    let generatedSlots: string[] = [];

    // Process EACH configured time slot range (e.g. 6am-9am AND 5pm-8pm)
    // Process EACH configured time slot range
    configSlots.forEach((slot, slotIndex) => {
      let [startH, startM] = slot.start.split(':').map(Number);
      let [endH, endM] = slot.end.split(':').map(Number);

      console.log(`🔍 [SLOTS] Processing config slot #${slotIndex}: ${slot.start}-${slot.end} (${startH}:${startM}-${endH}:${endM})`);

      // Handle midnight wrapping (e.g., 18:00 to 00:00)
      if (endH === 0 && (startH > endH || (startH === endH && startM >= endM))) {
        endH = 24;
      }

      // Explicit Fix for User Input "6 PM to 12 PM" (Meaning Midnight)
      // If start is PM (>=12) and end is EXACTLY 12 (Noon), treat end as Midnight (24)
      if (startH >= 12 && endH === 12) {
        console.log(`  ✨ [SLOTS] Interpreting End '12:00' (Noon) as Midnight (24:00) because Start is PM (${startH}:00)`);
        endH = 24;
      }

      // Handle explicit overnight (e.g. 18:00 to 12:00 next day)
      // If end time is strictly less than start time, and not handled above, it wraps.
      if (endH < startH) {
        endH += 24;
      }

      let currentH = startH;
      // Adjust start if minutes > 0? For hourly slots starting at 00, simple logic is start at next full hour?
      // Or just start at current hour if startM is 0.
      // If start is 6:30, first hourly slot 6:00-7:00 is technically invalid?
      // Let's assume hourly alignments for simplicity or start at currentH.
      if (startM > 0) currentH++; // If 6:30, start slots at 7:00

      while (currentH < endH) {
        // Calculate slot end time
        const slotEndH = currentH + 1;

        const slotEndTimeVal = slotEndH * 60; // minutes from midnight
        // configEndTime is endH * 60 + endM. If endH > 24, this is > 1440.
        const configEndTimeVal = endH * 60 + endM;

        if (slotEndTimeVal > configEndTimeVal) {
          console.log(`  🛑 [SLOTS] Skipping ${currentH}:00 - Slot ends at ${slotEndTimeVal}m, Config ends at ${configEndTimeVal}m`);
          break;
        }

        const displayH = currentH % 24;
        const timeString = new Date(new Date().setHours(displayH, 0, 0, 0)).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

        // Collision Detection
        const slotStart = new Date(`${selectedDate}T${displayH.toString().padStart(2, '0')}:00:00`);

        const isBooked = bookedSlots.some((booking: any) => {
          const bStart = new Date(booking.start);
          const bEnd = new Date(booking.end);
          const slotEnd = new Date(slotStart.getTime() + 60 * 60000);

          const collision = slotStart < bEnd && slotEnd > bStart;
          if (collision) {
            console.log(`  🚫 [SLOTS] Collision detected! Slot: ${slotStart.toLocaleTimeString()} - ${slotEnd.toLocaleTimeString()}`);
            console.log(`     Booking: ${bStart.toLocaleTimeString()} - ${bEnd.toLocaleTimeString()}`);
          }
          return collision;
        });

        if (!isBooked) {
          generatedSlots.push(timeString);
          console.log(`  ✅ [SLOTS] Added ${timeString}`);
        } else {
          // Already logged in collision check
        }

        currentH++;
      }
    });

    console.log(`📊 [SLOTS] Final generated count: ${generatedSlots.length}`);

    // Filter out past times if selectedDate is TODAY
    const now = new Date();
    const isToday = new Date(selectedDate).toDateString() === now.toDateString();

    if (isToday) {
      console.log(`🗓️ [SLOTS] Filtering past slots for today. Now: ${now.toLocaleTimeString()}`);
      generatedSlots = generatedSlots.filter(timeStr => {
        // Simply construct date from the string
        const slotDate = new Date(`${selectedDate} ${timeStr}`);
        return slotDate > now;
      });
      console.log(`📊 [SLOTS] After past-filter count: ${generatedSlots.length}`);
    }

    // Deduplicate and sort
    return [...new Set(generatedSlots)].sort((a, b) => {
      // simple sort by AM/PM or convert to date
      return new Date(`2000/01/01 ${a}`).getTime() - new Date(`2000/01/01 ${b}`).getTime();
    });

  }, [selectedDate, availability, bookedSlots]);



  const handleContinue = () => {
    if (selectedDate && selectedTimeSlot && location.trim()) {
      setIsNavigating(true);

      // Try to parse duration from service deliveryTime (e.g. "60 mins", "1 hour") or default to 60 mins
      const duration = 60; // Default to 60 if parsing fails

      // Set the booking details
      setBookingDetails(selectedDate, selectedTimeSlot, duration, location, notes);

      if (notes.trim()) {
        setBookingNotes(notes.trim());
      }

      clearCart();

      // Add services to cart
      hireState.selectedServices.forEach(service => {
        // Attempt to parse duration from deliveryTime string if possible
        // Simple heuristic: "X hour" -> X * 60, "X mins" -> X
        let serviceDuration = 60;
        if (service.deliveryTime) {
          const lower = service.deliveryTime.toLowerCase();
          const match = lower.match(/(\d+)\s*(hour|min|day)/);
          if (match) {
            const val = parseInt(match[1]);
            const unit = match[2];
            if (unit.startsWith('hour')) serviceDuration = val * 60;
            else if (unit.startsWith('date') || unit.startsWith('day')) serviceDuration = val * 60 * 24; // Maybe too long for 'duration' field which is usually session length?
            else serviceDuration = val; // mins
          }
        }

        addToCart(service, selectedDate, selectedTimeSlot, serviceDuration);
      });

      // Navigate immediately - relying on react state updates being synchronous for context in this scope usually
      // But context updates are async. However, since we are moving to a new page that READS context, 
      // ensuring the context provider has processed the update is safer. 
      // But typically setTimeout creates race conditions with unmount.
      // We will perform navigation in next tick.
      requestAnimationFrame(() => {
        router.push('/client/hire/cart');
      });
    }
  };

  return (
    <div className="h-screen bg-[#0F0F0F] overflow-y-auto">
      {/* Header - Personal Details Style */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-white/5 pt-2">
        <div className="container mx-auto px-4 py-3 max-w-3xl">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </button>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-white">Book Service</h1>
              <p className="text-white/50 text-xs">Select Date & Time</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-32 max-w-3xl mx-auto">
        {/* Selected Services Card with Freelancer Info */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          {/* Freelancer Header */}
          <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-[#1b1b1b]">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10">
              <img
                src={String(hireState.freelancerImage || '')}
                alt={String(hireState.freelancerName || '')}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-white">{String(hireState.freelancerName)}</h3>
              {(hireState.freelancerRating || 0) > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(Number(hireState.freelancerRating) || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-white/20'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-white/70 ml-1">
                    {String((hireState.freelancerRating || 0))} ({String(hireState.freelancerReviewCount || 0)} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Services List */}
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="w-4 h-4 text-purple-400" />
              <h4 className="text-white/90 font-semibold text-sm">Selected Services</h4>
            </div>

            <div className="space-y-3">
              {hireState.selectedServices.map((service) => (
                <div key={service.id} className="bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                  <div className="p-3 flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h5 className="text-white font-medium mb-1 text-sm">{service.title}</h5>
                      <div className="text-purple-400 font-bold text-sm">₹{service.price} / {service.deliveryTime}</div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                      <button
                        onClick={() => decreaseSelectedServiceQuantity(service.id)}
                        className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-white" />
                      </button>

                      <span className="text-white font-medium w-4 text-center text-sm">
                        {service.quantity}
                      </span>

                      <button
                        onClick={() => increaseSelectedServiceQuantity(service.id)}
                        className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <h4 className="text-white font-bold">Select Date <span className="text-red-500">*</span></h4>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {isLoadingAvailability ? (
              // Skeleton Loading for Dates
              [...Array(7)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-16 h-16 rounded-xl bg-white/5 border border-white/5 animate-pulse flex flex-col items-center justify-center gap-2">
                  <div className="w-6 h-4 bg-white/10 rounded"></div>
                  <div className="w-8 h-3 bg-white/10 rounded"></div>
                </div>
              ))
            ) : (
              dates.map((date) => (
                <button
                  key={date.date}
                  onClick={() => date.isAvailable && setSelectedDate(date.date)}
                  disabled={!date.isAvailable}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl border transition-all flex flex-col items-center justify-center ${selectedDate === date.date
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : date.isAvailable
                      ? 'border-white/20 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10'
                      : 'border-white/5 bg-white/5 text-white/20 cursor-not-allowed opacity-50'
                    }`}
                >
                  <span className="text-sm font-medium">{date.day}</span>
                  <span className="text-xs">{date.weekday}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Time Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <h4 className="text-white font-bold">Select Time <span className="text-red-500">*</span></h4>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">

            {isLoadingAvailability ? (
              // Skeleton Loading for Time Slots
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-24 h-12 rounded-xl bg-white/5 border border-white/5 animate-pulse" />
              ))
            ) : timeSlots.length > 0 ? (
              timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTimeSlot(time)}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl border transition-all text-center whitespace-nowrap ${selectedTimeSlot === time
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-white/20 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10'
                    }`}
                >
                  <span className="text-sm font-medium">{time}</span>
                </button>
              ))
            ) : (
              <div className="text-white/50 text-sm italic px-1">
                {selectedDate ? "No slots available for this date." : "Please select a date first."}
              </div>
            )}
          </div>
        </div>

        {/* Location Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-400" />
            <h4 className="text-white font-bold">Service Location <span className="text-red-500">*</span></h4>
          </div>

          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter ground location or paste link"
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
            />
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <h4 className="text-white font-bold">Booking Notes</h4>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any special instructions or notes for the cricketer..."
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
            rows={6}
          />
        </div>

      </div>
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#0F0F0F]/95 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <Button
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTimeSlot || !location.trim() || isNavigating}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isNavigating ? (
              <>
                <CricketWhiteBallSpinner className="w-4 h-4" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
