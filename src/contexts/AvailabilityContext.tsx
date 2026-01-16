'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  isEditing?: boolean;
}

export interface DayAvailability {
  id: string;
  name: string;
  available: boolean;
  timeSlots: TimeSlot[];
}

interface AvailabilityContextType {
  days: DayAvailability[];
  updateDays: (days: DayAvailability[]) => void;
  getAvailableDays: () => DayAvailability[];
  getWorkingHoursText: () => string;
  isLoading: boolean;
}

const initialDays: DayAvailability[] = [
  { id: 'monday', name: 'Monday', available: false, timeSlots: [] },
  { id: 'tuesday', name: 'Tuesday', available: false, timeSlots: [] },
  { id: 'wednesday', name: 'Wednesday', available: false, timeSlots: [] },
  { id: 'thursday', name: 'Thursday', available: false, timeSlots: [] },
  { id: 'friday', name: 'Friday', available: false, timeSlots: [] },
  { id: 'saturday', name: 'Saturday', available: false, timeSlots: [] },
  { id: 'sunday', name: 'Sunday', available: false, timeSlots: [] },
];

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [days, setDays] = useState<DayAvailability[]>(initialDays);
  const [isHydrated, setIsHydrated] = useState(false);
  const supabase = createClient();

  // Load from localStorage on mount and fetch from Supabase
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const saved = localStorage.getItem('availability');
        if (saved) {
          setDays(JSON.parse(saved));
        }

        // Only fetch from API if authenticated
        if (isAuthenticated) {
          const response = await fetch('/api/freelancer/availability');
          if (response.ok) {
            const { availability: dbAvailability } = await response.json();

            if (Array.isArray(dbAvailability) && dbAvailability.length > 0) {
              setDays(dbAvailability);
              localStorage.setItem('availability', JSON.stringify(dbAvailability));
            }
          }
        }
      } catch (error) {
        console.error('Failed to load availability:', error);
      } finally {
        setIsHydrated(true);
      }
    };

    fetchAvailability();
  }, [isAuthenticated]);

  // Save to localStorage whenever it changes
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('availability', JSON.stringify(days));
  }, [days, isHydrated]);

  const updateDays = useCallback(async (newDays: DayAvailability[]) => {
    setDays(newDays);

    // Persist via API
    try {
      await fetch('/api/freelancer/availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: newDays })
      });
    } catch (error) {
      console.error('Failed to save availability to database:', error);
    }
  }, []);

  const getAvailableDays = useCallback(() => {
    return days.filter(day => day.available);
  }, [days]);

  const getWorkingHoursText = useCallback(() => {
    const availableDays = days.filter(day => day.available);
    if (availableDays.length === 0) return 'Not available';

    const dayNames = availableDays.map(day => day.name.substring(0, 3)).join(', ');

    // Get time slots for the first available day as an example
    const firstAvailableDay = availableDays[0];
    const timeSlots = firstAvailableDay.timeSlots;

    if (timeSlots.length > 0) {
      const firstSlot = timeSlots[0];
      const startTime = formatTime(firstSlot.start);
      const endTime = formatTime(firstSlot.end);
      return `${dayNames} • ${startTime} - ${endTime}`;
    }

    return `${dayNames} • 9 AM - 6 PM`; // Fallback
  }, [days]);

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}${ampm}`;
  };

  const value: AvailabilityContextType = {
    days,
    updateDays,
    getAvailableDays,
    getWorkingHoursText,
    isLoading: !isHydrated,
  };

  return (
    <AvailabilityContext.Provider value={value}>
      {children}
    </AvailabilityContext.Provider>
  );
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (context === undefined) {
    throw new Error('useAvailability must be used within an AvailabilityProvider');
  }
  return context;
}
