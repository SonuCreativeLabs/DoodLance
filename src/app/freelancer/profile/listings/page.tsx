'use client';

import { useState, useEffect } from 'react';
import { useDateRange } from '@/contexts/DateRangeContext';
import { Button } from "@/components/ui/button";
import { Calendar, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { format } from 'date-fns';
import { DateRangeModal } from "@/components/calendar/DateRangeModal";

interface Availability {
  id: string;
  title: string;
  fromDate: Date;
  toDate: Date;
  totalDays: number;
  isActive: boolean;
  gigs: number; // Changed from sessions to gigs
  hours: number;
  pausedCount: number;
}

const calculateDaysBetween = (start: Date, end: Date): number => {
  // Normalize both dates to the start of the day (midnight)
  const startDate = new Date(start);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);
  
  // Calculate the difference in days
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Add 1 to include both start and end dates if they're different
  return diffDays === 0 ? 1 : diffDays + 1;
};

export default function AvailabilityListingsPage() {
  // State declarations
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | null>(null);
  const [pausedDates, setPausedDates] = useState<Date[]>([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  // Debug effect for modal state
  useEffect(() => {
    console.log('Modal state updated:', {
      isDateRangeModalOpen,
      isPauseModalOpen,
      isCreatingNew,
      selectedAvailability: selectedAvailability?.id || null
    });
  }, [isDateRangeModalOpen, isPauseModalOpen, isCreatingNew, selectedAvailability]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([
    {
      id: '1',
      title: 'Summer Coaching Availability',
      fromDate: new Date(2025, 6, 1),
      toDate: new Date(2025, 6, 15),
      totalDays: 15,
      isActive: true,
      gigs: 45,
      hours: 67.5,
      pausedCount: 2
    },
    {
      id: '2',
      title: 'Weekend Special',
      fromDate: new Date(2025, 5, 1),
      toDate: new Date(2025, 5, 30),
      totalDays: 30,
      isActive: false,
      gigs: 90,
      hours: 135,
      pausedCount: 0
    },
    {
      id: '3',
      title: 'Summer Break Camp',
      fromDate: new Date(2025, 5, 15),
      toDate: new Date(2025, 5, 25),
      totalDays: 11,
      isActive: false,
      gigs: 33,
      hours: 49.5,
      pausedCount: 1
    },
  ]);
  
  const { updateDateRange } = useDateRange();

  const handleExtendClick = (availability: Availability) => {
    setSelectedAvailability(availability);
    setIsDateRangeModalOpen(true);
  };

  const handlePauseClick = (availability: Availability) => {
    setSelectedAvailability(availability);
    // Load any previously paused dates for this availability
    const savedPausedDates = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem(`pausedDates_${availability.id}`) || '[]')
          .map((dateStr: string) => new Date(dateStr))
      : [];
    setPausedDates(savedPausedDates);
    setIsPauseModalOpen(true);
  };

  const handlePauseDates = (dates: Date[]) => {
    if (selectedAvailability) {
      // Save paused dates to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            `pausedDates_${selectedAvailability.id}`,
            JSON.stringify(dates.map(date => date.toISOString()))
          );
        } catch (error) {
          console.error('Error saving paused dates:', error);
        }
      }
      
      // Update the availability with paused dates
      const updatedAvailabilities = availabilities.map(avail => 
        avail.id === selectedAvailability.id 
          ? { 
              ...avail, 
              pausedCount: dates.length,
              // Here you would typically send this to your API
              // and update the backend with the paused dates
            } 
          : avail
      );
      
      setAvailabilities(updatedAvailabilities);
      setPausedDates([...dates]); // Create a new array reference
      setIsPauseModalOpen(false);
    }
  };



  const handleDateRangeSelect = (start: Date, end: Date) => {
    const totalDays = calculateDaysBetween(start, end);
    const totalGigs = totalDays * 3;
    const totalHours = parseFloat((totalGigs * 1.5).toFixed(1));
    
    if (isCreatingNew) {
      // Create a new availability
      const newAvailability: Availability = {
        id: Date.now().toString(),
        title: `New Availability ${availabilities.length + 1}`,
        fromDate: start,
        toDate: end,
        totalDays,
        isActive: true,
        gigs: totalGigs,
        hours: totalHours,
        pausedCount: 0
      };
      
      setAvailabilities([newAvailability, ...availabilities]);
      setIsCreatingNew(false);
    } else if (selectedAvailability) {
      // Update existing availability
      const updatedAvailabilities = availabilities.map(avail => 
        avail.id === selectedAvailability.id 
          ? { 
              ...avail, 
              fromDate: start, 
              toDate: end,
              totalDays,
              gigs: totalGigs,
              hours: totalHours
            } 
          : avail
      );
      
      setAvailabilities(updatedAvailabilities);
    }
    
    updateDateRange(start, end);
    setIsDateRangeModalOpen(false);
  };
  
  // Update initial availabilities with calculated days and hours
  useEffect(() => {
    setAvailabilities(prevAvailabilities => 
      prevAvailabilities.map(avail => {
        const days = calculateDaysBetween(avail.fromDate, avail.toDate);
        return {
          ...avail,
          totalDays: days,
          // Calculate gigs (3 per day)
          gigs: days * 3,
          // Calculate hours based on gigs (1.5 hours per gig)
          hours: parseFloat((days * 3 * 1.5).toFixed(1))
        };
      })
    );
  }, []);

  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };

  const handleCreateNew = () => {
    setSelectedAvailability(null);
    setIsCreatingNew(true);
    setIsDateRangeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/freelancer/profile/availability" 
                className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                  <ArrowLeft className="h-4 w-4" />
                </div>
              </Link>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-white">Your Listings</h1>
                <p className="text-white/50 text-xs">Manage all your availability listings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <Button
            onClick={handleCreateNew}
            className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-[8px] [&>button]:rounded-[8px]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Availability
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-8">
        {availabilities
          .filter(avail => avail.isActive)
          .map((availability) => (
            <AvailabilityCard 
              key={availability.id} 
              availability={availability} 
              formatDate={formatDate}
              onPause={handlePauseClick}
              onExtend={handleExtendClick}
            />
          ))}
        {availabilities.filter(avail => !avail.isActive).length > 0 && (
          <>
            {availabilities
              .filter(avail => !avail.isActive)
              .map((availability) => (
                <AvailabilityCard 
                  key={availability.id} 
                  availability={availability} 
                  formatDate={formatDate}
                  onPause={handlePauseClick}
                  onExtend={handleExtendClick}
                />
              ))}
          </>
        )}
        {availabilities.length === 0 && (
          <div className="col-span-3 py-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-white/40" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No availability yet</h3>
            <p className="text-white/60 max-w-md mx-auto">Create your first availability window to start accepting bookings</p>
          </div>
        )}
      </div>
      
      <DateRangeModal 
        isOpen={isDateRangeModalOpen}
        onClose={() => {
          setIsDateRangeModalOpen(false);
          setIsCreatingNew(false);
        }}
        onSelect={handleDateRangeSelect}
        initialStartDate={isCreatingNew ? new Date() : selectedAvailability?.fromDate}
        initialEndDate={isCreatingNew ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : selectedAvailability?.toDate}
        fixedStartDate={!isCreatingNew}
      />
      
      <DateRangeModal 
        isOpen={isPauseModalOpen}
        onClose={() => setIsPauseModalOpen(false)}
        onSelect={() => {}} // Empty function since we're using onPauseDates
        onPauseDates={handlePauseDates}
        initialStartDate={selectedAvailability?.fromDate || new Date()}
        initialEndDate={selectedAvailability?.toDate || new Date()}
        pausedDates={pausedDates}
        mode="pause"
      />
    </div>
  );
}

interface AvailabilityCardProps {
  availability: Availability;
  formatDate: (date: Date) => string;
  onPause: (availability: Availability) => void;
  onExtend: (availability: Availability) => void;
}

function AvailabilityCard({ availability, formatDate, onPause, onExtend }: AvailabilityCardProps) {
  const isActive = availability.isActive;
  
  return (
    <div className={`transition-all ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <Card 
        className={`h-full flex flex-col ${
          isActive 
            ? 'bg-[#1E1E1E] border border-white/5 hover:border-white/10 cursor-pointer transition-colors pb-1'
            : 'bg-[#1A1A1A] border border-white/[0.03] cursor-default pb-1'
        }`}
      >
        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Header with status */}
          <div className="flex justify-between items-start mb-4">
            <div className={`flex items-center text-sm ${isActive ? 'text-white/80' : 'text-white/50'}`}>
              <Calendar className={`h-4 w-4 mr-2 ${isActive ? 'text-gray-400' : 'text-white/30'}`} />
              <span>{formatDate(availability.fromDate)} - {formatDate(availability.toDate)}</span>
            </div>
            <span className={`inline-flex items-center px-2 h-5 rounded text-xs font-medium ${
              isActive 
                ? 'bg-green-500/10 text-green-400' 
                : 'bg-white/5 text-white/60'
            }`}>
              {isActive ? 'Live' : 'Completed'}
            </span>
          </div>
          
          {/* Stats grid */}
          <div className="mt-2">
            <div className="grid grid-cols-4 gap-2">
              <div className={`${isActive ? "bg-white/5" : "bg-white/[0.03]"} rounded-lg p-2 flex flex-col items-center`}>
                <div className={`text-xs mb-1 ${isActive ? "text-white/60" : "text-white/40"}`}>Days</div>
                <div className={`text-sm font-medium ${!isActive && "text-white/60"}`}>
                  {availability.totalDays}
                </div>
              </div>
              
              <div className={`${isActive ? "bg-white/5" : "bg-white/[0.03]"} rounded-lg p-2 flex flex-col items-center`}>
                <div className={`text-xs mb-1 ${isActive ? "text-white/60" : "text-white/40"}`}>Gigs</div>
                <div className={`text-sm font-medium ${!isActive && "text-white/60"}`}>
                  {availability.gigs}
                </div>
              </div>
              
              <div className={`${isActive ? "bg-white/5" : "bg-white/[0.03]"} rounded-lg p-2 flex flex-col items-center`}>
                <div className={`text-xs mb-1 ${isActive ? "text-white/60" : "text-white/40"}`}>Hours</div>
                <div className={`text-sm font-medium ${!isActive && "text-white/60"}`}>
                  {availability.hours}
                </div>
              </div>
              
              <div className={`${isActive ? "bg-white/5" : "bg-white/[0.03]"} rounded-lg p-2 flex flex-col items-center`}>
                <div className={`text-xs mb-1 ${isActive ? "text-white/60" : "text-white/40"}`}>Paused</div>
                <div className={`text-sm font-medium ${!isActive && "text-white/60"}`}>
                  {availability.pausedCount > 0 ? (
                    <span className="text-yellow-400">{availability.pausedCount}</span>
                  ) : (
                    <span>0</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Spacer to create consistent bottom padding */}
          <div className="h-2"></div>
        </CardContent>
        
        {isActive && (
          <CardFooter className="px-4 pb-4 pt-0">
            <div className="w-full flex gap-3">
              <button 
                onClick={() => onExtend(availability)}
                className="group relative flex-1 h-10 rounded-xl overflow-hidden bg-gradient-to-r from-white/5 to-white/[0.03] hover:from-white/10 hover:to-white/5 transition-all duration-300 flex items-center justify-center gap-2 px-4 text-sm font-medium text-white/90 hover:text-white border border-white/5 hover:border-white/10 shadow-sm"
              >
                <svg className="h-3.5 w-3.5 text-[#8B5CF6] group-hover:text-[#A78BFA] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>Extend</span>
              </button>
              <button 
                onClick={() => onPause(availability)}
                className="group relative flex-1 h-10 rounded-xl overflow-hidden bg-gradient-to-r from-white/5 to-white/[0.03] hover:from-white/10 hover:to-white/5 transition-all duration-300 flex items-center justify-center gap-2 px-4 text-sm font-medium text-white/90 hover:text-white border border-white/5 hover:border-white/10 shadow-sm hover:shadow-yellow-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="h-3.5 w-3.5 text-yellow-400 group-hover:text-yellow-300 transition-colors z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="z-10">Pause</span>
              </button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
