"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, ArrowRight, ShoppingCart, Star, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHire } from '@/contexts/HireContext';
import { useNavbar } from '@/contexts/NavbarContext';

export default function BookingDatePage() {
  const router = useRouter();
  const { state, setBookingDetails, setBookingNotes, addToCart, clearCart, isLoaded } = useHire();
  const { setNavbarVisibility } = useNavbar();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Wait for hydration
  if (!isLoaded) {
    return (
      <div className="h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Hide navbar when component mounts
  useEffect(() => {
    setNavbarVisibility(false);

    // Show navbar when component unmounts
    return () => {
      setNavbarVisibility(true);
    };
  }, [setNavbarVisibility]);

  // Generate next 7 days starting from tomorrow
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
      });
    }
    return dates;
  };

  const dates = generateDates();

  // Time slots
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  const handleContinue = () => {
    if (selectedDate && selectedTimeSlot && location.trim()) {
      // Try to parse duration from service deliveryTime (e.g. "60 mins", "1 hour") or default to 60 mins
      const duration = 60; // Default to 60 if parsing fails

      // Set the booking details
      setBookingDetails(selectedDate, selectedTimeSlot, duration, location, notes);

      if (notes.trim()) {
        setBookingNotes(notes.trim());
      }

      clearCart();

      // Add services to cart
      state.selectedServices.forEach(service => {
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

      router.push('/client/hire/cart');
    }
  };

  return (
    <div className="h-screen bg-[#0F0F0F] overflow-y-auto">
      {/* Header - Personal Details Style */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-white/5 pt-2">
        <div className="container mx-auto px-4 py-3">
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

      <div className="p-6 space-y-6 pb-32">
        {/* Freelancer Info */}
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10">
            <img
              src={state.freelancerImage || ''}
              alt={state.freelancerName || ''}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-white">{state.freelancerName}</h3>
            {(state.freelancerRating || 0) > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(state.freelancerRating!)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-white/20'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-white/70 ml-1">
                  {(state.freelancerRating || 0).toFixed(1)} ({state.freelancerReviewCount || 0} reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Selected Services Summary - Full Width */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="w-5 h-5 text-purple-400" />
            <h4 className="text-white font-bold">Added Services</h4>
            <span className="text-white/40 text-sm font-medium">({state.selectedServices.length})</span>
          </div>

          <div className="space-y-2">
            {state.selectedServices.map((service) => (
              <div key={service.id}>
                <div className="py-2">
                  <h5 className="font-medium text-white text-sm">{service.title}</h5>
                  <div className="text-sm font-semibold text-white/80 mt-0.5">
                    ₹{typeof service.price === 'string'
                      ? parseFloat(service.price.replace(/[^\d.]/g, ''))
                      : service.price} / {service.deliveryTime}
                  </div>
                </div>
                {state.selectedServices.indexOf(service) < state.selectedServices.length - 1 && (
                  <div className="border-b border-white/10"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <h4 className="text-white font-bold">Select Date <span className="text-red-500">*</span></h4>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {dates.map((date) => (
              <button
                key={date.date}
                onClick={() => setSelectedDate(date.date)}
                className={`flex-shrink-0 w-16 h-16 rounded-xl border transition-all flex flex-col items-center justify-center ${selectedDate === date.date
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-white/20 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10'
                  }`}
              >
                <span className="text-sm font-medium">{date.day}</span>
                <span className="text-xs">{date.weekday}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            <h4 className="text-white font-bold">Select Time <span className="text-red-500">*</span></h4>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {timeSlots.map((time) => (
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
            ))}
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
        <Button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTimeSlot || !location.trim()}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
