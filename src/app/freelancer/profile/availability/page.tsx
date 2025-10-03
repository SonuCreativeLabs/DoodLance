'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, Plus, X, Pencil, Check, List, Zap, Navigation, Bell, Minus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { format, addDays, startOfWeek } from 'date-fns';

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  isEditing: boolean;
}

interface DayAvailability {
  id: string;
  name: string;
  available: boolean;
  timeSlots: TimeSlot[];
}

// Initial days data with time slots
const initialDays: DayAvailability[] = [
  { id: 'monday', name: 'Monday', available: true, timeSlots: [{ id: '1', start: '09:00', end: '18:00', isEditing: false }] },
  { id: 'tuesday', name: 'Tuesday', available: true, timeSlots: [{ id: '1', start: '09:00', end: '18:00', isEditing: false }] },
  { id: 'wednesday', name: 'Wednesday', available: true, timeSlots: [{ id: '1', start: '09:00', end: '18:00', isEditing: false }] },
  { id: 'thursday', name: 'Thursday', available: true, timeSlots: [{ id: '1', start: '09:00', end: '18:00', isEditing: false }] },
  { id: 'friday', name: 'Friday', available: true, timeSlots: [{ id: '1', start: '09:00', end: '18:00', isEditing: false }] },
  { id: 'saturday', name: 'Saturday', available: false, timeSlots: [] },
  { id: 'sunday', name: 'Sunday', available: false, timeSlots: [] },
];


export default function AvailabilityPage() {
  const [days, setDays] = useState<DayAvailability[]>(initialDays);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  
  // Booking notice state
  const [enableAdvanceNotice, setEnableAdvanceNotice] = useState(false);
  const [noticeHours, setNoticeHours] = useState(2);
  const [noticeInput, setNoticeInput] = useState('2');
  
  // Service radius state (in kilometers)
  const [serviceRadius, setServiceRadius] = useState(10);
  
  // Date range for display
  const dateRange = {
    start: new Date(),
    end: addDays(new Date(), 30)
  };
  
  
  const toggleDayAvailability = (dayId: string) => {
    setDays(days.map(day => 
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
    setDays(days.map(day => 
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
    setDays(days.map(day => 
      day.id === dayId 
        ? { 
            ...day, 
            timeSlots: day.timeSlots.filter(slot => slot.id !== slotId)
          }
        : day
    ));
  };

  const toggleEditTimeSlot = (dayId: string, slotId: string) => {
    setDays(days.map(day => 
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
    setDays(days.map(day => 
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
          <h2 className="text-lg font-medium">Select Your Availability Window</h2>
        </div>
        <p className="text-sm text-white/60 mb-4">Choose the dates you&apos;ll be available for bookings</p>
      </div>
      
      {/* Date Range Card */}
      <Card className="bg-[#1E1E1E] border border-white/5 mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="text-xs text-white/60 mb-1">From</div>
              <div className="font-medium">{format(dateRange.start, 'MMM d, yyyy')}</div>
              <div className="text-xs text-white/60 mt-1">{format(dateRange.start, 'EEEE')}</div>
            </div>
            <div className="h-12 w-px bg-white/10 mx-2"></div>
            <div className="text-center flex-1">
              <div className="text-xs text-white/60 mb-1">To</div>
              <div className="font-medium">{format(dateRange.end, 'MMM d, yyyy')}</div>
              <div className="text-xs text-white/60 mt-1">{format(dateRange.end, 'EEEE')}</div>
            </div>
          </div>
          <Link href="/freelancer/profile/listings" className="w-full block">
            <button 
              className="w-full mt-4 h-12 rounded-xl bg-[#2A2A2A] hover:bg-[#333] border border-white/5 text-white/90 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 group px-6 shadow-sm hover:shadow-purple-500/10"
            >
              <List className="h-4 w-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <span className="text-sm font-medium">Manage Your Listings</span>
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
                className="ml-1 text-white/60 group-hover:translate-x-1 transition-transform"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </Link>
        </CardContent>
      </Card>
      


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
        </div>
      </div>
    </div>
  );
}
