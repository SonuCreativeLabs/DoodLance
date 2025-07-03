'use client';

import { useState, useEffect } from 'react';
import { useDateRange } from '@/contexts/DateRangeContext';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Calendar, Clock, Check, X } from "lucide-react";
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

export default function AvailabilityListingsPage() {
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<Availability | null>(null);
  const [pausedDates, setPausedDates] = useState<Date[]>([]);

  const handleExtendClick = (availability: Availability) => {
    setSelectedAvailability(availability);
    setIsDateRangeModalOpen(true);
  };

  const handlePauseClick = (availability: Availability) => {
    setSelectedAvailability(availability);
    setPausedDates([]);
    setIsPauseModalOpen(true);
  };

  const handlePauseDates = (dates: Date[]) => {
    if (selectedAvailability) {
      // Update the availability with paused dates
      setAvailabilities(availabilities.map(avail => 
        avail.id === selectedAvailability.id 
          ? { 
              ...avail, 
              pausedCount: dates.length,
              // Here you would typically send this to your API
              // and update the backend with the paused dates
            } 
          : avail
      ));
      setIsPauseModalOpen(false);
    }
  };

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

  const handleDateRangeSelect = (start: Date, end: Date) => {
    if (selectedAvailability) {
      const totalDays = calculateDaysBetween(start, end);
      
      // Update the availability with new date range and calculated days
      const updatedAvailabilities = availabilities.map(avail => 
        avail.id === selectedAvailability.id 
          ? { 
              ...avail, 
              fromDate: start, 
              toDate: end,
              totalDays: totalDays,
              // Recalculate gigs (3 per day)
              gigs: totalDays * 3,
              // Recalculate hours based on gigs (1.5 hours per gig)
              hours: parseFloat((totalDays * 3 * 1.5).toFixed(1))
            } 
          : avail
      );
      
      setAvailabilities(updatedAvailabilities);
      updateDateRange(start, end);
      setIsDateRangeModalOpen(false);
    }
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

  const { dateRange, updateDateRange } = useDateRange();
  const [availabilities, setAvailabilities] = useState<Availability[]>([
    {
      id: '1',
      title: 'Summer Coaching Availability',
      fromDate: new Date(2025, 6, 1),
      toDate: new Date(2025, 6, 15),
      totalDays: 15,
      isActive: true,
      gigs: 45, // 3 gigs per day * 15 days
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
      gigs: 90, // 3 gigs per day * 30 days
      hours: 135, // 90 gigs * 1.5 hours per gig
      pausedCount: 0
    },
    {
      id: '3',
      title: 'Summer Break Camp',
      fromDate: new Date(2025, 5, 15),
      toDate: new Date(2025, 5, 25),
      totalDays: 11,
      isActive: false,
      gigs: 33, // 3 gigs per day * 11 days
      hours: 49.5,
      pausedCount: 1
    },
  ]);

  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-4">
            <Link 
              href="/freelancer/profile/availability" 
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Your Listings</h1>
              <p className="text-sm text-white/60 mb-4">Manage all your availability listings</p>
            </div>
          </div>
        </div>
        <div className="w-full max-w-2xl mx-auto mt-2">
          <div className="relative group w-full">
            <Button 
              className="relative z-10 w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white 
                       py-3 rounded-lg font-medium text-sm shadow-lg shadow-purple-900/20
                       transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-900/30
                       border border-purple-400/20 flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Availability
            </Button>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-purple-400/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        onClose={() => setIsDateRangeModalOpen(false)}
        onSelect={handleDateRangeSelect}
        initialStartDate={selectedAvailability?.fromDate}
        initialEndDate={selectedAvailability?.toDate}
        fixedStartDate={true}
      />
      
      <DateRangeModal 
        isOpen={isPauseModalOpen}
        onClose={() => setIsPauseModalOpen(false)}
        onSelect={() => {}} // Empty function since we're using onPauseDates
        onPauseDates={handlePauseDates}
        initialStartDate={selectedAvailability?.fromDate || new Date()}
        initialEndDate={selectedAvailability?.toDate || new Date()}
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
              <Calendar className={`h-4 w-4 mr-2 ${isActive ? 'text-purple-400' : 'text-white/30'}`} />
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
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-9 bg-transparent hover:bg-white/5 border-white/10 text-purple-300 hover:text-purple-200 transition-colors"
                onClick={() => onExtend(availability)}
              >
                <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Extend
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-9 bg-transparent hover:bg-white/5 border-white/10 text-white/80 hover:text-white transition-colors"
                onClick={() => onPause(availability)}
              >
                <svg className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pause
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
