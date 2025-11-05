'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface DateRangeContextType {
  dateRange: {
    start: Date;
    end: Date;
  };
  updateDateRange: (start: Date, end: Date) => void;
}

// Default date range
const defaultDateRange = {
  start: new Date(2025, 5, 1), // June 1, 2025
  end: new Date(2025, 5, 30)   // June 30, 2025
};

const DateRangeContext = createContext<DateRangeContextType>({
  dateRange: defaultDateRange,
  updateDateRange: () => {}
});

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [dateRange, setDateRange] = useState(defaultDateRange);
  const [isMounted, setIsMounted] = useState(false);

  // Load saved date range from localStorage on mount
  useEffect(() => {
    try {
      const savedDateRange = typeof window !== 'undefined' ? localStorage.getItem('dateRange') : null;
      if (savedDateRange) {
        const { start, end } = JSON.parse(savedDateRange);
        setDateRange({
          start: new Date(start),
          end: new Date(end)
        });
      }
    } catch (error) {
      console.error('Error loading date range from localStorage:', error);
    }
    setIsMounted(true);
  }, []);

  const updateDateRange = (start: Date, end: Date) => {
    if (!start || !end) return;
    
    const newDateRange = { 
      start: new Date(start), 
      end: new Date(end) 
    };
    
    setDateRange(newDateRange);
    
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('dateRange', JSON.stringify({
          start: newDateRange.start.toISOString(),
          end: newDateRange.end.toISOString()
        }));
      } catch (error) {
        console.error('Error saving date range to localStorage:', error);
      }
    }
  };

  // Don't render children until we've loaded the saved date range
  if (!isMounted) {
    return null;
  }

  return (
    <DateRangeContext.Provider value={{ dateRange, updateDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  
  // This should never happen because of the default context value
  if (!context) {
    console.error('useDateRange must be used within a DateRangeProvider');
    return {
      dateRange: defaultDateRange,
      updateDateRange: () => {}
    };
  }
  
  return context;
}
