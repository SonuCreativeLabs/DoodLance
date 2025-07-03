'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { format } from 'date-fns';

interface DateRangeContextType {
  dateRange: {
    start: Date;
    end: Date;
  };
  updateDateRange: (start: Date, end: Date) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [dateRange, setDateRange] = useState({
    start: new Date(2025, 5, 1), // June 1, 2025
    end: new Date(2025, 5, 30)   // June 30, 2025
  });

  const updateDateRange = (start: Date, end: Date) => {
    setDateRange({ start, end });
    // Optionally save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('dateRange', JSON.stringify({
        start: start.toISOString(),
        end: end.toISOString()
      }));
    }
  };

  return (
    <DateRangeContext.Provider value={{ dateRange, updateDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error('useDateRange must be used within a DateRangeProvider');
  }
  return context;
}
