'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

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
}

const initialDays: DayAvailability[] = [
  { id: 'monday', name: 'Monday', available: true, timeSlots: [{ id: '1', start: '09:00', end: '18:00', isEditing: false }] },
  { id: 'tuesday', name: 'Tuesday', available: true, timeSlots: [{ id: '1', start: '09:00', end: '18:00', isEditing: false }] },
  { id: 'wednesday', name: 'Wednesday', available: true, timeSlots: [{ id: '1', start: '09:00', end: '18:00', isEditing: false }] },
  { id: 'thursday', name: 'Thursday', available: true, timeSlots: [{ id: '1', start: '09:00', end: '18:00', isEditing: false }] },
  { id: 'friday', name: 'Friday', available: true, timeSlots: [{ id: '1', start: '09:00', end: '18:00', isEditing: false }] },
  { id: 'saturday', name: 'Saturday', available: false, timeSlots: [] },
  { id: 'sunday', name: 'Sunday', available: false, timeSlots: [] },
];

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(undefined);

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [days, setDays] = useState<DayAvailability[]>(initialDays);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('availability');
      if (saved) {
        setDays(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to parse availability:', error);
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('availability', JSON.stringify(days));
  }, [days]);

  const updateDays = useCallback((newDays: DayAvailability[]) => {
    setDays(newDays);
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
