'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { format, addMonths, isSameDay, isWithinInterval, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (startDate: Date, endDate: Date) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
}

interface DayInfo {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
}

export function DateRangeModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  initialStartDate = new Date(),
  initialEndDate = new Date()
}: DateRangeModalProps) {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
  const [visibleMonths, setVisibleMonths] = useState<Date[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize with current month and next 5 months
  useEffect(() => {
    const months = [];
    for (let i = 0; i < 6; i++) {
      months.push(addMonths(new Date(), i));
    }
    setVisibleMonths(months);
  }, []);

  // Handle scroll to load more months
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const scrollThreshold = 100; // pixels from bottom
      
      if (scrollHeight - (scrollTop + clientHeight) < scrollThreshold) {
        // Load more months when near bottom
        const lastMonth = new Date(visibleMonths[visibleMonths.length - 1]);
        const newMonths: Date[] = [];
        for (let i = 1; i <= 3; i++) {
          newMonths.push(addMonths(new Date(lastMonth), i));
        }
        setVisibleMonths(prev => [...prev, ...newMonths]);
      }
    }
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      // If no start date is selected or both start and end dates are selected, set new start date
      setStartDate(date);
      setEndDate(null);
      setTempEndDate(null);
    } else {
      // If start date is selected, set end date
      if (date > startDate) {
        setEndDate(date);
      } else {
        // If clicked date is before start date, swap them
        setEndDate(startDate);
        setStartDate(date);
      }
      setTempEndDate(null);
    }
  };

  const handleMouseEnter = (day: Date) => {
    if (startDate && !endDate) setTempEndDate(day);
  };

  const handleApply = () => {
    if (startDate) {
      onSelect(startDate, endDate || startDate);
      onClose();
    }
  };

  // Check if a date is in the selected range
  const isDateInRange = (date: Date): boolean => {
    if (!startDate || !endDate) return false;
    
    // For same day selection
    if (isSameDay(startDate, endDate)) {
      return false;
    }
    
    // For range selection
    return isWithinInterval(date, { 
      start: startDate, 
      end: endDate 
    });
    return false;
  };

  const calculateDaysBetween = (start: Date, end: Date) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((end.getTime() - start.getTime()) / oneDay)) + 1; // +1 to include both start and end dates
    return diffDays;
  };

  const formatRangeDisplay = () => {
    if (!startDate) return 'Select start and end dates';
    if (!endDate) return `${format(startDate, 'MMM d, yyyy')} - Select end date`;
    
    const days = calculateDaysBetween(startDate, endDate);
    return (
      <div className="w-full">
        <div className="text-lg font-semibold text-center text-gray-900 dark:text-white">
          {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
        </div>
        <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-0.5">
          <span className="text-[#8B5CF6] font-medium">{days} {days === 1 ? 'day' : 'days'}</span> selected
        </div>
      </div>
    );
  };

  // Day headers component - Single letter day headers
  const DayHeaders = () => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    
    return (
      <div className="grid grid-cols-7 w-full px-3">
        {days.map((day, i) => (
          <div 
            key={i}
            className="flex justify-center"
          >
            <span className="text-xs font-medium text-[#9CA3AF] w-10 h-6 flex items-center justify-center">
              {day}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  // Get day of week with Monday as first day (0 = Monday, 6 = Sunday)
  const getAdjustedDay = (date: Date) => {
    const day = date.getDay();
    // Convert to 0-6 where 0 is Monday, 6 is Sunday
    return (day + 6) % 7;
  };

  const renderCalendar = (month: Date, skipHeaders: boolean = false) => {
    if (!skipHeaders) {
      return (
        <div className="w-full mb-6">
          <DayHeaders />
          {renderCalendarGrid(month)}
        </div>
      );
    }
    return renderCalendarGrid(month);
  };

  const renderCalendarGrid = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    
    // Get the day of week (0 = Monday, 6 = Sunday)
    const firstDayOfWeek = getAdjustedDay(firstDay);
    const daysInMonth = lastDay.getDate();
    
    // Calculate total cells needed (full weeks)
    const daysToShow = daysInMonth + firstDayOfWeek;
    const totalWeeks = Math.ceil(daysToShow / 7);
    const totalCells = totalWeeks * 7;

    return (
      <div className="w-full">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 w-full px-3">
          {Array.from({ length: totalCells }).map((_, index) => {
            // Skip days before the 1st of the month
            if (index < firstDayOfWeek) {
              return <div key={`empty-${index}`} className="h-10 w-10 mx-auto" />;
            }
            
            // Calculate the day number (1-based)
            const dayNumber = index - firstDayOfWeek + 1;
            const isCurrentMonth = dayNumber <= daysInMonth;
            
            if (!isCurrentMonth) {
              return <div key={`empty-${index}`} className="h-10 w-10 mx-auto" />;
            }
            
            const date = new Date(year, monthIndex, dayNumber);
            const day = dayNumber;
            const isStart = startDate && isSameDay(date, startDate);
            const isEnd = endDate ? isSameDay(date, endDate) : false;
            const isSelected = isStart || isEnd;
            const isInRange = isDateInRange(date);
            const isTodayDate = isToday(date);

            return (
              <button
                key={`day-${index}`}
                type="button"
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => handleMouseEnter(date)}
                className={`
                  relative h-10 w-10 flex items-center justify-center text-sm font-medium mx-auto
                  ${isTodayDate && !isSelected ? 'font-bold text-[#6B46C1] dark:text-[#8B66D1]' : ''}
                  ${isStart ? 'rounded-l-full bg-[#8B5CF6] text-white font-medium border-2 border-[#8B5CF6] z-10' : ''}
                  ${isEnd ? 'rounded-r-full bg-[#8B5CF6] text-white font-medium border-2 border-[#8B5CF6] z-10' : ''}
                  ${isSelected && isStart && isEnd ? 'rounded-full bg-[#8B5CF6] text-white font-medium border-2 border-[#8B5CF6] z-10' : ''}
                  ${isInRange ? 'bg-gradient-to-r from-[#F5F3FF] to-[#EDE9FE] dark:from-[#2D1B69]/10 dark:to-[#1E1045]/10' : ''}
                  ${!isSelected && !isInRange ? 'hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-full' : ''}
                  transition-all duration-200
                `}
                style={{
                  ...(isInRange && !isStart && !isEnd && {
                    background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(139, 92, 246, 0.1) 100%)',
                    borderRadius: 0,
                  }),
                  ...(isStart && {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }),
                  ...(isEnd && {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }),
                }}
                aria-label={`${format(date, 'EEEE, MMMM d, yyyy')}${isSelected ? ' (selected)' : ''}`}
                aria-selected={isSelected || undefined}
              >
                <span className={`relative z-20 ${(isStart || isEnd) ? 'font-semibold' : ''} transition-all duration-200`}>
                  {day}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Use try-catch to handle cases where useModal might not be available
  type ModalContextType = {
    setIsModalOpen?: (isOpen: boolean) => void;
  };
  
  let modalContext: ModalContextType = {};
  try {
    modalContext = useModal();
  } catch (e) {
    // If useModal throws, we'll proceed without modal context
    console.warn('ModalContext not available, proceeding without it');
  }

  // Handle modal state changes
  useEffect(() => {
    if (isOpen) {
      modalContext?.setIsModalOpen?.(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      modalContext?.setIsModalOpen?.(false);
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = '';
    };
  }, [isOpen, modalContext]);

  // Don't render anything if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-[#111111] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 border-b border-white/10 bg-[#111111] backdrop-blur-sm">
        <div className="flex items-center">
          <button
            onClick={onClose}
            className="p-2 -ml-2 mr-2 hover:bg-[#8B5CF6]/10 rounded-full transition-colors text-[#8B5CF6]"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-base font-medium">
            Set Your Availability
          </h2>
        </div>
      </div>
      
      {/* Fixed Days Header */}
      <div className="sticky top-14 z-10 bg-[#111111] border-b border-white/10 pt-2">
        <div className="max-w-6xl mx-auto px-6">
          <DayHeaders />
        </div>
      </div>
      
      {/* Calendar Content */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 pt-2"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          {visibleMonths.map((month, index) => (
            <div key={month.toString()} className="mb-8">
              <h3 className="text-lg font-medium mb-3 px-2">
                {format(month, 'MMMM yyyy')}
              </h3>
              {renderCalendar(month, true)}  {/* Pass true to skip rendering DayHeaders */}
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer with date range and actions */}
      <div className="sticky bottom-0 z-10 bg-white dark:bg-[#111111] border-t border-gray-100 dark:border-gray-800">
        <div className="px-6 py-3">
          {formatRangeDisplay()}
        </div>
        <div className="px-6 pb-4 flex justify-center space-x-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-6 h-10 text-sm font-medium rounded-full border-2 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/5 hover:border-[#8B5CF6] hover:shadow-sm transition-all duration-200"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleApply}
            disabled={!startDate || !endDate}
            className="px-6 h-10 text-sm font-medium rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white shadow-md hover:shadow-[#8B5CF6]/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DateRangeModal;
