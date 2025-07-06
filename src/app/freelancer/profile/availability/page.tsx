'use client';

import { useState, useEffect } from 'react';
import { useDateRange } from '@/contexts/DateRangeContext';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, Plus, X, Pencil, Check, ChevronLeft, ChevronRight, List, Info, Zap } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { DateRangeModal } from "@/components/calendar/DateRangeModal";

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

const timezones = [
  { value: 'ist', label: 'Indian Standard Time (IST) - GMT+5:30' },
  { value: 'est', label: 'Eastern Time (ET) - GMT-5:00' },
  { value: 'pst', label: 'Pacific Time (PT) - GMT-8:00' },
  { value: 'gmt', label: 'Greenwich Mean Time (GMT) - GMT+0:00' },
];

export default function AvailabilityPage() {
  const [days, setDays] = useState<DayAvailability[]>(initialDays);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const { dateRange, updateDateRange } = useDateRange();
  
  // Booking notice state
  const [enableAdvanceNotice, setEnableAdvanceNotice] = useState(false);
  const [noticeHours, setNoticeHours] = useState(2);
  
  const handleDateRangeSelect = (start: Date, end: Date) => {
    updateDateRange(start, end);
  };
  
  // Generate dates for the current week
  const weekDays = Array.from({ length: 7 }).map((_, index) => ({
    date: addDays(currentWeekStart, index),
    dayName: format(addDays(currentWeekStart, index), 'EEE'),
    dayNumber: format(addDays(currentWeekStart, index), 'd'),
  }));
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeekStart(prev => 
      direction === 'prev' 
        ? addDays(prev, -7) 
        : addDays(prev, 7)
    );
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-4">
            <Link 
              href="/freelancer/profile" 
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold">My Availability</h1>
              <p className="text-white/60 text-sm mt-0.5">Set your working hours and timezone</p>
            </div>
          </div>
        </div>
      </div>

      {/* Date Range Section */}
      <div className="mb-4">
        <div className="flex items-center mb-1">
          <Calendar className="h-5 w-5 text-purple-400 mr-2" />
          <h2 className="text-lg font-medium">Select Your Availability Window</h2>
        </div>
        <p className="text-sm text-white/60 mb-4">Choose the dates you'll be available for bookings</p>
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
                            <div key={slot.id} className="flex items-center gap-2 p-2 bg-[#333333] rounded-md">
                              {slot.isEditing ? (
                                <>
                                  <input
                                    type="time"
                                    value={slot.start}
                                    onChange={(e) => updateTimeSlot(day.id, slot.id, 'start', e.target.value)}
                                    className="bg-[#2A2A2A] border border-white/10 rounded px-2 py-1 text-sm w-24"
                                  />
                                  <span className="text-white/60">to</span>
                                  <input
                                    type="time"
                                    value={slot.end}
                                    onChange={(e) => updateTimeSlot(day.id, slot.id, 'end', e.target.value)}
                                    className="bg-[#2A2A2A] border border-white/10 rounded px-2 py-1 text-sm w-24"
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
                  <h3 className="text-base font-medium text-white">Booking Notice</h3>
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
                  <div className="space-y-3 p-3 bg-[#2A2A2A]/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={noticeHours}
                        onChange={(e) => setNoticeHours(parseInt(e.target.value) || 1)}
                        className="w-20 bg-[#2A2A2A] border border-white/10 rounded-md p-2 text-sm focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                      />
                      <span className="text-sm text-white/60">hours notice</span>
                    </div>
                    <p className="text-xs text-white/50">
                      {noticeHours === 1 
                        ? 'Clients must book at least 1 hour in advance.'
                        : `Clients must book at least ${noticeHours} hours in advance.`}
                    </p>
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

          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
