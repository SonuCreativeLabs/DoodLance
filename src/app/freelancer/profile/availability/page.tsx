'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { usePersonalDetails } from '@/contexts/PersonalDetailsContext';
import { useAvailability } from '@/contexts/AvailabilityContext';
import { useListings } from '@/contexts/ListingsContext';
import { ArrowLeft, Clock, Calendar, Plus, X, Pencil, Check, List, Zap, Navigation, Bell, Minus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { format, addDays, startOfWeek } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

// Initial days data with time slots


export default function AvailabilityPage() {
  const { personalDetails, toggleReadyToWork } = usePersonalDetails();
  const { days, updateDays, isLoading } = useAvailability();
  const { listings } = useListings();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Booking notice state
  const [enableAdvanceNotice, setEnableAdvanceNotice] = useState(false);
  const [noticeHours, setNoticeHours] = useState(2);
  const [noticeInput, setNoticeInput] = useState('2');

  // Service radius state (in kilometers)
  const [serviceRadius, setServiceRadius] = useState(10);



  // Track if data is loaded to prevent initial auto-save
  const isLoaded = useRef(false);

  // Load settings from API on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/freelancer/availability-settings');
        if (response.ok) {
          const data = await response.json();
          if (data.serviceRadius !== undefined) {
            setServiceRadius(data.serviceRadius);
          }
          if (data.advanceNoticeHours !== undefined) {
            const hours = data.advanceNoticeHours;
            setEnableAdvanceNotice(hours > 0);
            setNoticeHours(hours || 2);
            setNoticeInput(String(hours || 2));
          }
        }
      } catch (error) {
        console.error('Failed to load availability settings:', error);
      }
    };
    // Set loaded to true after initial fetch attempt
    loadSettings().finally(() => {
      // Small delay to ensure state updates function properly before allowing saves
      setTimeout(() => {
        isLoaded.current = true;
      }, 500);
    });
  }, []);

  // Auto-save service radius when it changes
  useEffect(() => {
    // Skip if not loaded yet
    if (!isLoaded.current) return;

    const saveServiceRadius = async () => {
      try {
        await fetch('/api/freelancer/availability-settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ serviceRadius })
        });
      } catch (error) {
        console.error('Failed to save service radius:', error);
      }
    };

    // Debounce save (800ms)
    const timer = setTimeout(saveServiceRadius, 800);
    return () => clearTimeout(timer);
  }, [serviceRadius]);

  // Auto-save advance notice when it changes
  useEffect(() => {
    // Skip if not loaded yet
    if (!isLoaded.current) return;

    const saveAdvanceNotice = async () => {
      const hoursToSave = enableAdvanceNotice ? noticeHours : 0;
      try {
        await fetch('/api/freelancer/availability-settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ advanceNoticeHours: hoursToSave })
        });
      } catch (error) {
        console.error('Failed to save advance notice:', error);
      }
    };

    // Debounce save (800ms)
    const timer = setTimeout(saveAdvanceNotice, 800);
    return () => clearTimeout(timer);
  }, [enableAdvanceNotice, noticeHours]);

  // Date range for display
  const dateRange = {
    start: new Date(),
    end: addDays(new Date(), 30)
  };


  const toggleDayAvailability = (dayId: string) => {
    updateDays(days.map(day =>
      day.id === dayId
        ? {
          ...day,
          available: !day.available,
          timeSlots: !day.available
            ? [{ id: Date.now().toString(), start: '09:00', end: '18:00', isEditing: false }]
            : []
        }
        : day
    ));
  };

  const addTimeSlot = (dayId: string) => {
    updateDays(days.map(day =>
      day.id === dayId
        ? {
          ...day,
          timeSlots: [
            ...day.timeSlots,
            { id: Date.now().toString(), start: '09:00', end: '18:00', isEditing: true }
          ]
        }
        : day
    ));
  };

  const removeTimeSlot = (dayId: string, slotId: string) => {
    updateDays(days.map(day =>
      day.id === dayId
        ? {
          ...day,
          timeSlots: day.timeSlots.filter(slot => slot.id !== slotId)
        }
        : day
    ));
  };

  const toggleEditTimeSlot = (dayId: string, slotId: string) => {
    updateDays(days.map(day =>
      day.id === dayId
        ? {
          ...day,
          timeSlots: day.timeSlots.map(slot =>
            slot.id === slotId
              ? { ...slot, isEditing: !slot.isEditing }
              : { ...slot, isEditing: false }
          )
        }
        : day
    ));
  };

  const updateTimeSlot = (dayId: string, slotId: string, field: 'start' | 'end', value: string) => {
    updateDays(days.map(day =>
      day.id === dayId
        ? {
          ...day,
          timeSlots: day.timeSlots.map(slot =>
            slot.id === slotId
              ? { ...slot, [field]: value }
              : slot
          )
        }
        : day
    ));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-white/5">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="ml-3">
                <Skeleton className="h-5 w-40 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 space-y-6">
            <div className="mb-4">
              <Skeleton className="h-6 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>

            <div className="bg-[#1E1E1E] border border-white/5 rounded-xl p-6 space-y-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="bg-[#1E1E1E] border border-white/5 rounded-xl p-6 flex justify-between items-center">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <Skeleton className="h-8 w-14 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Link
              href="/freelancer/profile"
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </Link>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-white">My Availability</h1>
              <p className="text-white/50 text-xs">Set your working hours and timezone</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">

          {/* Date Range Section */}
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <Calendar className="h-5 w-5 text-purple-400 mr-2" />
              <h2 className="text-lg font-medium">Manage Your Availability Listings</h2>
            </div>
            <p className="text-sm text-white/60 mb-4">Create availability windows for clients to book your services</p>
          </div>

          {/* Listings Card */}
          <Card className="bg-[#1E1E1E] border border-white/5 mb-6">
            <CardContent className="pt-6">
              {listings && listings.length > 0 ? (
                <div className="space-y-4">
                  {listings.map((listing, index) => (
                    <div key={listing.id}>
                      {index > 0 && (
                        <div className="w-full border-t border-white/5 my-4"></div>
                      )}

                      {/* Title */}
                      <div className="mb-3">
                        <h3 className="text-sm font-medium text-white/80">Availability {index + 1}</h3>
                      </div>

                      {/* Header with status */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center text-sm text-white/80">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{format(listing.fromDate, 'MMM d, yyyy')} - {format(listing.toDate, 'MMM d, yyyy')}</span>
                        </div>
                        <span className={`inline-flex items-center px-2 h-5 rounded text-xs font-medium ${listing.isActive
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-white/5 text-white/60'
                          }`}>
                          {listing.isActive ? 'Live' : 'Completed'}
                        </span>
                      </div>

                      {/* Stats grid */}
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-white/5 rounded-lg p-2 flex flex-col items-center">
                          <div className="text-xs mb-1 text-white/60">Days</div>
                          <div className="text-sm font-medium">{listing.totalDays}</div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-2 flex flex-col items-center">
                          <div className="text-xs mb-1 text-white/60">Gigs</div>
                          <div className="text-sm font-medium">{listing.gigs}</div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-2 flex flex-col items-center">
                          <div className="text-xs mb-1 text-white/60">Hours</div>
                          <div className="text-sm font-medium">{listing.hours}</div>
                        </div>

                        <div className="bg-white/5 rounded-lg p-2 flex flex-col items-center">
                          <div className="text-xs mb-1 text-white/60">Paused</div>
                          <div className="text-sm font-medium">
                            {listing.pausedCount > 0 ? (
                              <span className="text-yellow-400">{listing.pausedCount}</span>
                            ) : (
                              <span>0</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Manage button */}
                  <div className="pt-3 mt-4 border-t border-white/5">
                    <Link href="/freelancer/profile/listings" className="block">
                      <button className="w-full h-10 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 transition-all duration-200 flex items-center justify-center gap-2 border border-purple-500/20">
                        <List className="h-4 w-4" />
                        <span className="text-sm font-medium">Manage All Listings</span>
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-3">
                    <List className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-base font-medium text-white mb-1">No Active Listings</h3>
                  <p className="text-sm text-white/60 mb-4 max-w-sm mx-auto">
                    Create availability windows to let clients know when you're available for bookings
                  </p>
                  <Link href="/freelancer/profile/listings" className="inline-block">
                    <button
                      className="h-10 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white transition-all duration-200 flex items-center justify-center gap-2 group px-6 shadow-md hover:shadow-lg"
                    >
                      <List className="h-4 w-4" />
                      <span className="text-sm font-medium">Manage Listings</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:translate-x-1 transition-transform"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>


          {/* Ready to Work Toggle Section */}
          <div className="mb-6">
            <Card className="bg-[#1E1E1E] border border-white/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-purple-500/10">
                      <Zap className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Ready to Work</h3>
                      <p className="text-sm text-white/60">{personalDetails.readyToWork ? 'You are available for new jobs' : 'You are currently unavailable'}</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleReadyToWork}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${personalDetails.readyToWork ? 'bg-green-600' : 'bg-[#2A2A2A]'}`}
                  >
                    <span className="sr-only">Toggle ready to work</span>
                    <span
                      className={`${personalDetails.readyToWork ? 'translate-x-7' : 'translate-x-1'} inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm`}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Working Hours Section - Only show when ready to work */}
          {personalDetails.readyToWork && (
            <>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <h2 className="text-lg font-medium">Working Hours</h2>
                </div>
                <p className="text-sm text-white/60 mb-4">Set your weekly availability for client bookings</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-[#1E1E1E] border border-white/5">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {days.map((day) => (
                          <div key={day.id} className="rounded-lg bg-[#2A2A2A] overflow-hidden">
                            <div className="flex items-center justify-between p-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${day.available ? 'bg-green-500' : 'bg-[#3D3D3D]'}`}
                                  onClick={() => toggleDayAvailability(day.id)}
                                  role="switch"
                                  aria-checked={day.available}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${day.available ? 'translate-x-5' : 'translate-x-0'}`}
                                  />
                                </div>
                                <Label htmlFor={day.id} className="font-medium">
                                  {day.name}
                                </Label>
                              </div>
                              {day.available && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs h-7 px-2 text-purple-400 hover:bg-white/5 hover:text-purple-300"
                                  onClick={() => addTimeSlot(day.id)}
                                >
                                  <Plus className="h-3.5 w-3.5 mr-1" />
                                  Add Time Slot
                                </Button>
                              )}
                            </div>

                            {day.available && (
                              <div className="px-3 pb-3 space-y-2">
                                {day.timeSlots.length === 0 ? (
                                  <div className="text-sm text-white/60 italic">No time slots added</div>
                                ) : (
                                  day.timeSlots.map((slot) => (
                                    <div key={slot.id} className="flex items-center gap-2 p-2 bg-[#333333] rounded-lg">
                                      {slot.isEditing ? (
                                        <>
                                          <input
                                            type="time"
                                            value={slot.start}
                                            onChange={(e) => updateTimeSlot(day.id, slot.id, 'start', e.target.value)}
                                            className="bg-[#2A2A2A] border border-white/10 rounded px-2 py-1 text-sm w-24 text-white [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-100"
                                          />
                                          <span className="text-white/60">to</span>
                                          <input
                                            type="time"
                                            value={slot.end}
                                            onChange={(e) => updateTimeSlot(day.id, slot.id, 'end', e.target.value)}
                                            className="bg-[#2A2A2A] border border-white/10 rounded px-2 py-1 text-sm w-24 text-white [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-100"
                                          />
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 ml-auto text-green-400 hover:bg-white/5"
                                            onClick={() => toggleEditTimeSlot(day.id, slot.id)}
                                          >
                                            <Check className="h-3.5 w-3.5" />
                                          </Button>
                                        </>
                                      ) : (
                                        <>
                                          <span className="text-sm">
                                            {formatTime(slot.start)} - {formatTime(slot.end)}
                                          </span>
                                          <div className="flex ml-auto space-x-1">
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="icon"
                                              className="h-6 w-6 text-white/60 hover:bg-white/5 hover:text-white/80"
                                              onClick={() => toggleEditTimeSlot(day.id, slot.id)}
                                            >
                                              <Pencil className="h-3.5 w-3.5" />
                                            </Button>
                                            {day.timeSlots.length > 1 && (
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-red-400/80 hover:bg-red-500/10 hover:text-red-400"
                                                onClick={() => removeTimeSlot(day.id, slot.id)}
                                              >
                                                <X className="h-3.5 w-3.5" />
                                              </Button>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-[#1E1E1E] border border-white/5">
                    <div className="p-5">
                      <div className="relative mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-purple-400" />
                            <h3 className="text-base font-medium text-white">Booking Notice</h3>
                          </div>
                          <button
                            onClick={() => setEnableAdvanceNotice(!enableAdvanceNotice)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${enableAdvanceNotice ? 'bg-purple-600' : 'bg-[#2A2A2A]'}`}
                          >
                            <span className="sr-only">Enable advance notice</span>
                            <span
                              className={`${enableAdvanceNotice ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                            />
                          </button>
                        </div>
                      </div>

                      {enableAdvanceNotice ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-[#2A2A2A]/50 rounded-lg">
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-white/90">Minimum notice period</span>
                                <div className="flex items-center gap-2 bg-[#1E1E1E] border border-white/5 rounded-lg p-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newValue = Math.max(1, noticeHours - 1);
                                      setNoticeHours(newValue);
                                      setNoticeInput(newValue.toString());
                                    }}
                                    className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-white/5 transition-colors text-white/80 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                                    aria-label="Decrease hours"
                                    disabled={noticeHours <= 1}
                                  >
                                    <Minus className="h-3.5 w-3.5" />
                                  </button>

                                  <div className="relative w-12">
                                    <input
                                      type="number"
                                      min="1"
                                      max="24"
                                      value={noticeInput}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setNoticeInput(value);

                                        if (value === '') return;

                                        const num = parseInt(value, 10);
                                        if (!isNaN(num) && num >= 1 && num <= 24) {
                                          setNoticeHours(num);
                                        }
                                      }}
                                      onBlur={() => {
                                        if (noticeInput === '') {
                                          setNoticeHours(1);
                                          setNoticeInput('1');
                                        } else {
                                          const num = parseInt(noticeInput, 10);
                                          if (isNaN(num) || num < 1) {
                                            setNoticeHours(1);
                                            setNoticeInput('1');
                                          } else if (num > 24) {
                                            setNoticeHours(24);
                                            setNoticeInput('24');
                                          } else {
                                            setNoticeHours(num);
                                            setNoticeInput(num.toString());
                                          }
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (['-', '.', 'e', 'E'].includes(e.key)) {
                                          e.preventDefault();
                                        }
                                      }}
                                      className="w-full text-center bg-transparent text-sm font-medium text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pr-6"
                                    />
                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-white/60 pointer-events-none pl-1">hrs</span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newValue = Math.min(24, noticeHours + 1);
                                      setNoticeHours(newValue);
                                      setNoticeInput(newValue.toString());
                                    }}
                                    className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-white/5 transition-colors text-white/80 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
                                    aria-label="Increase hours"
                                    disabled={noticeHours >= 24}
                                  >
                                    <Plus className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-white/50 leading-tight mt-2">
                                {noticeHours === 1
                                  ? 'Clients must book at least 1 hour in advance.'
                                  : `Clients must book at least ${noticeHours} hours in advance.`}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-[#2A2A2A]/30 rounded-lg border border-dashed border-white/10">
                          <div className="p-2 rounded-full bg-purple-500/10">
                            <Zap className="h-4 w-4 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">Instant Bookings</p>
                            <p className="text-xs text-white/50">Clients can book your time immediately</p>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 p-3 bg-[#2A2A2A]/50 rounded-md">
                        <p className="text-xs text-white/60">
                          <span className="font-medium text-white/80">Tip:</span> {enableAdvanceNotice
                            ? 'Set a notice period to manage your schedule better.'
                            : 'Turn on advance notice to prevent last-minute bookings.'}
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Service Radius Section */}
                  <Card className="bg-[#1E1E1E] border border-white/5 mt-6">
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Navigation className="h-5 w-5 text-purple-400" />
                        <h3 className="text-base font-medium text-white">Service Radius</h3>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/80">Maximum distance for clients</span>
                          <div className="text-sm font-medium text-white">
                            {serviceRadius} km
                          </div>
                        </div>

                        <div className="px-2 relative">
                          <div className="relative w-full h-8 flex items-center">
                            <div className="absolute w-full h-1 bg-[#2A2A2A] rounded-full">
                              <div className="absolute top-0 left-0 h-full bg-purple-500 rounded-full"
                                style={{ width: `${serviceRadius}%` }}></div>

                              {/* Tick marks */}
                              {[0, 25, 50, 75, 100].map((tick) => (
                                <div
                                  key={tick}
                                  className={`absolute top-1/2 w-0.5 h-2 -mt-1 -ml-0.5 ${tick <= serviceRadius ? 'bg-purple-400' : 'bg-white/20'}`}
                                  style={{ left: `${tick}%` }}
                                />
                              ))}
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="100"
                              value={serviceRadius}
                              onChange={(e) => setServiceRadius(parseInt(e.target.value))}
                              className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
                            />
                            <div
                              className="absolute h-4 w-4 rounded-full bg-purple-500 -ml-2 z-20 shadow-lg"
                              style={{ left: `${serviceRadius}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-white/50 mt-3 px-1">
                            <span>1 km</span>
                            <span>25 km</span>
                            <span>50 km</span>
                            <span>75 km</span>
                            <span>100+ km</span>
                          </div>
                        </div>

                        <p className="text-xs text-white/50">
                          Clients within {serviceRadius} km will be able to find and book your services.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
