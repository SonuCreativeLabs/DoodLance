'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useModal } from '@/contexts/ModalContext';
import { format, addMonths, isSameDay, isWithinInterval, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ModalMode = 'select' | 'pause';

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (startDate: Date, endDate: Date) => void;
  onPauseDates?: (dates: Date[]) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
  pausedDates?: Date[];
  fixedStartDate?: boolean;
  mode?: ModalMode;
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
  onPauseDates = () => {},
  initialStartDate = new Date(2025, 5, 1), // June 1, 2025
  initialEndDate = new Date(2025, 5, 30),   // June 30, 2025
  pausedDates: initialPausedDates = [],
  fixedStartDate = false,
  mode = 'select'
}: DateRangeModalProps) {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
  const [pausedDates, setPausedDates] = useState<Date[]>(initialPausedDates);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartDate, setDragStartDate] = useState<Date | null>(null);
  const [visibleMonths, setVisibleMonths] = useState<Date[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Handle drag start
  const handleDragStart = useCallback((date: Date) => {
    if (mode === 'pause') return;
    setIsDragging(true);
    setDragStartDate(date);
  }, [mode]);
  
  // Handle drag over
  const handleDragOver = useCallback((e: React.MouseEvent, date: Date) => {
    if (!isDragging || !dragStartDate || mode === 'pause') return;
    e.preventDefault();
    
    // Only update if the date is different and in the future
    if (endDate && !isSameDay(date, endDate) && !isPastDate(date)) {
      setEndDate(date);
    }
  }, [isDragging, dragStartDate, endDate, mode]);
  
  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDragStartDate(null);
    }
  }, [isDragging]);
  
  // Reset dates when modal is opened/closed or when initial dates change
  useEffect(() => {
    if (isOpen) {
      // Create new date objects to avoid reference issues
      const start = initialStartDate ? new Date(initialStartDate) : null;
      const end = initialEndDate ? new Date(initialEndDate) : null;
      
      // Ensure dates are valid
      if (start && isNaN(start.getTime())) {
        console.error('Invalid start date:', initialStartDate);
        setStartDate(null);
      } else {
        setStartDate(start);
      }
      
      if (end && isNaN(end.getTime())) {
        console.error('Invalid end date:', initialEndDate);
        setEndDate(null);
      } else {
        setEndDate(end);
      }
      
      setTempEndDate(null);
      
      // If we have both dates, ensure they're in the correct order
      if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
        if (start > end) {
          setStartDate(new Date(end));
          setEndDate(new Date(start));
        }
      }
    }
  }, [isOpen, initialStartDate, initialEndDate]);

  // Initialize with months starting from June 2025
  useEffect(() => {
    if (!isOpen) return;
    
    const months = new Set();
    
    // Set the minimum start date to June 1, 2025
    const minStartDate = new Date(2025, 5, 1); // Note: months are 0-indexed, so 5 = June
    
    // Always include June 2025 and July 2025 as default months
    months.add('2025-06');
    months.add('2025-07');
    
    // Include months from start to end date if available
    if (startDate && !isNaN(startDate.getTime())) {
      const start = new Date(Math.max(startDate.getTime(), minStartDate.getTime()));
      start.setHours(0, 0, 0, 0);
      
      const end = endDate && !isNaN(endDate.getTime()) 
        ? new Date(endDate) 
        : addMonths(start, 2);
      
      end.setHours(23, 59, 59, 999);
      
      // Add all months from start to end of the selected range
      let currentMonthInRange = new Date(start);
      currentMonthInRange.setDate(1);
      currentMonthInRange.setHours(0, 0, 0, 0);
      
      const endMonth = new Date(end);
      endMonth.setDate(1);
      endMonth.setHours(0, 0, 0, 0);
      
      // Ensure we don't go before June 2025
      if (currentMonthInRange < minStartDate) {
        currentMonthInRange = new Date(minStartDate);
      }
      
      while (currentMonthInRange <= endMonth) {
        months.add(format(currentMonthInRange, 'yyyy-MM'));
        currentMonthInRange = addMonths(currentMonthInRange, 1);
      }
    }
    
    // Convert to array and sort
    const sortedMonths = Array.from(months)
      .map(dateStr => new Date(dateStr + '-01'))
      .sort((a, b) => a.getTime() - b.getTime());
    
    // Ensure we have at least 2 months visible
    while (sortedMonths.length < 2) {
      const lastMonth = sortedMonths.length > 0 
        ? new Date(sortedMonths[sortedMonths.length - 1])
        : new Date(2025, 5, 1); // Default to June 2025 if no months exist
      sortedMonths.push(addMonths(lastMonth, 1));
    }
    
    setVisibleMonths(sortedMonths);
  }, [isOpen, startDate, endDate]);

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
  const handleDateClick = useCallback((date: Date) => {
    if (mode === 'pause') {
      // Create a new date object for comparison
      const clickedDate = new Date(date);
      clickedDate.setHours(0, 0, 0, 0);
      
      // Check if the clicked date is already paused
      const isDatePaused = pausedDates.some((pausedDate: Date) => {
        const d = new Date(pausedDate);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === clickedDate.getTime();
      });
      
      if (isDatePaused) {
        // If date is already paused, unselect it
        setPausedDates((prev: Date[]) => 
          prev.filter(pausedDate => {
            const d = new Date(pausedDate);
            d.setHours(0, 0, 0, 0);
            return d.getTime() !== clickedDate.getTime();
          })
        );
        return;
      }
      
      // If date is not paused, proceed with selection
      if (!isSelecting) {
        setIsSelecting(true);
        setSelectionStart(date);
        
        // Create a new date object to avoid reference issues
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        
        // Add the new date to paused dates
        setPausedDates((prev: Date[]) => [...prev, newDate]);
      } else if (selectionStart) {
        // Batch state updates
        requestAnimationFrame(() => {
          // Create new date objects to avoid reference issues
          const start = new Date(selectionStart);
          const end = new Date(date);
          
          // Reset times to avoid timezone issues
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          
          // Ensure start is before end
          const [rangeStart, rangeEnd] = start < end ? [start, end] : [end, start];
          
          // Use a Set for faster lookups
          const existingDates = new Set(pausedDates.map(dateItem => {
            const normalizedDate = new Date(dateItem);
            normalizedDate.setHours(0, 0, 0, 0);
            return normalizedDate.getTime();
          }));
          
          // Collect new dates to add
          const datesToAdd: Date[] = [];
          const currentDate = new Date(rangeStart);
          
          while (currentDate <= rangeEnd) {
            const timestamp = currentDate.getTime();
            if (!existingDates.has(timestamp)) {
              datesToAdd.push(new Date(currentDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
          
          // Update state once with all new dates
          if (datesToAdd.length > 0) {
            setPausedDates(prev => [...prev, ...datesToAdd]);
          }
          
          // Reset selection state
          setIsSelecting(false);
          setSelectionStart(null);
        });
      }
      return;
    }

    if (fixedStartDate && startDate) {
      // When start date is fixed, only allow selecting end date
      const newEndDate = new Date(date);
      newEndDate.setHours(23, 59, 59, 999);
      
      // Ensure the end date is after start date
      if (newEndDate > startDate) {
        setEndDate(newEndDate);
        setTempEndDate(null);
      }
      return;
    }
    
    // For new selection or resetting selection
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
  }, [
    mode,
    isSelecting,
    selectionStart,
    pausedDates,
    fixedStartDate,
    startDate,
    endDate,
    onSelect,
    onPauseDates
  ]);

  const handleMouseEnter = (day: Date) => {
    if (mode === 'pause' && isSelecting && selectionStart) {
      // Highlight the range being selected for pausing
      setTempEndDate(day);
      return;
    }
    
    if (fixedStartDate && startDate) {
      if (day > startDate) setTempEndDate(day);
    } else if (startDate && !endDate) {
      setTempEndDate(day);
    }
  };

  const handleApply = () => {
    if (mode === 'pause') {
      onPauseDates(pausedDates);
    } else if (startDate) {
      onSelect(startDate, endDate || startDate);
    } else {
      return; // Don't close if no selection
    }
    onClose();
  };

  // Handle pause mode changes
  const togglePauseDate = useCallback((date: Date) => {
    setPausedDates(prev => {
      // Normalize dates to compare just the date part (ignoring time)
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);
      
      const isPaused = prev.some(d => {
        const normalizedD = new Date(d);
        normalizedD.setHours(0, 0, 0, 0);
        return normalizedD.getTime() === normalizedDate.getTime();
      });
      
      if (isPaused) {
        return prev.filter(d => {
          const normalizedD = new Date(d);
          normalizedD.setHours(0, 0, 0, 0);
          return normalizedD.getTime() !== normalizedDate.getTime();
        });
      } else {
        return [...prev, new Date(normalizedDate)]; // Ensure we store a new Date object
      }
    });
  }, []);

  // Handle modal close
  const handleClose = () => {
    if (mode !== 'pause') {
      // Only reset these for date range selection mode
      setStartDate(initialStartDate);
      setEndDate(initialEndDate);
      setTempEndDate(null);
    }
    // Don't reset pausedDates to maintain selection when reopening
    onClose();
  };

  // Handle save
  const handleSave = () => {
    if (mode === 'pause') {
      // Ensure we're passing proper Date objects
      const validPausedDates = pausedDates
        .filter(date => date instanceof Date && !isNaN(date.getTime()))
        .map(date => new Date(date)); // Create new Date objects to avoid reference issues
      
      onPauseDates(validPausedDates);
    } else if (startDate && endDate) {
      onSelect(startDate, endDate);
    }
    onClose();
  };

  // Check if a date is in the selected range
  const isDateInRange = (date: Date): boolean => {
    if (mode === 'pause') {
      // Check if date is in paused dates
      return pausedDates.some(d => isSameDay(d, date));
    }
    
    if (!startDate) return false;
    
    const effectiveEndDate = endDate || tempEndDate;
    
    if (!effectiveEndDate) return isSameDay(date, startDate);
    
    // For same day selection
    if (isSameDay(startDate, effectiveEndDate)) {
      return isSameDay(date, startDate);
    }
    
    // For range selection
    const start = startDate < effectiveEndDate ? startDate : effectiveEndDate;
    const end = startDate < effectiveEndDate ? effectiveEndDate : startDate;
    
    // Include both start and end dates in the range
    return isWithinInterval(date, { start, end });
  };

  const calculateDaysBetween = (start: Date, end: Date) => {
    if (!start || !end) return 0;
    
    // Reset hours to avoid timezone issues
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / oneDay) + 1; // +1 to include both start and end dates
    
    return Math.max(1, diffDays); // Ensure at least 1 day
  };

  const formatRangeDisplay = () => {
    if (mode === 'pause') {
      if (pausedDates.length === 0) return 'Select dates to pause';
      return (
        <div className="w-full">
          <div className="text-lg font-semibold text-center text-gray-900 dark:text-white">
            {pausedDates.length} {pausedDates.length === 1 ? 'date' : 'dates'} selected
          </div>
          <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-0.5">
            Click to select date ranges to pause
          </div>
        </div>
      );
    }

    // For extend mode
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

  // Check if a date is in the past (before today)
  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create a clean date object for comparison
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    // Any date before today is considered past
    return checkDate < today;
  };

  // Check if a date is within the available range of the selected availability
  const isDateInAvailableRange = (date: Date): boolean => {
    // Get the date range from the modal's state
    const start = startDate ? new Date(startDate) : initialStartDate ? new Date(initialStartDate) : new Date();
    const end = endDate ? new Date(endDate) : initialEndDate ? new Date(initialEndDate) : new Date();
    
    // Reset hours for accurate date comparison
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    // Normalize the range dates
    const normalizedStart = new Date(start);
    normalizedStart.setHours(0, 0, 0, 0);
    
    const normalizedEnd = new Date(end);
    normalizedEnd.setHours(23, 59, 59, 999);
    
    return checkDate >= normalizedStart && checkDate <= normalizedEnd;
  };

  // Check if a date is selectable (within available range or already paused)
  const isDateSelectable = (date: Date): boolean => {
    // Disable all past dates (before today)
    if (isPastDate(date)) {
      return false;
    }
    
    // In pause mode, only allow dates within the available range or already paused dates
    if (mode === 'pause') {
      return isDateInAvailableRange(date) || pausedDates.some(d => isSameDay(d, date));
    }
    
    // In normal mode, all future dates are selectable
    return true;
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
            const isPast = isPastDate(date);

            // Base button styles
            let buttonClasses = [
              'relative h-10 w-10 flex items-center justify-center text-sm font-medium mx-auto',
              'transition-all duration-200',
              isTodayDate && !isSelected && !isPast ? 'font-bold text-[#6B46C1] dark:text-[#8B66D1]' : '',
              // Start date styling
              mode !== 'pause' && isStart ? 'bg-[#8B5CF6] text-white font-medium border-2 border-[#8B5CF6] z-10 rounded-l-full' : '',
              // End date styling
              mode !== 'pause' && isEnd ? 'bg-[#8B5CF6] text-white font-medium border-2 border-[#8B5CF6] z-10 rounded-r-full' : '',
              // Single day selection
              mode !== 'pause' && isSelected && isStart && isEnd ? 'rounded-full bg-[#8B5CF6] text-white font-medium border-2 border-[#8B5CF6] z-10' : '',
              // Hover state for unselected dates
              !isSelected && !isInRange && !isPast && !(mode === 'pause' && pausedDates.some(d => isSameDay(d, date))) ? 'hover:bg-gray-50 dark:hover:bg-gray-700/30' : '',
              // Range background (in-between dates)
              mode !== 'pause' && isInRange && !isPast && !isStart && !isEnd ? 'bg-[#F5F3FF] dark:bg-[#2D1B69]/30' : '',
              // Pause mode styling
              mode === 'pause' && !isPast && pausedDates.some(d => isSameDay(d, date)) ? 'before:absolute before:bg-yellow-500/20 before:border before:border-yellow-400/30 before:rounded-full before:w-8 before:h-8 before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2' : ''
            ];

            // For past dates (excluding the start date if it's today)
            if (isPast && !isStart) {
              buttonClasses = [
                'relative h-10 w-10 flex items-center justify-center text-sm font-medium mx-auto',
                'text-gray-500/80 dark:text-gray-400/80',
                'opacity-60 cursor-not-allowed',
                'transition-all duration-200'
              ];
            } 
            // For selected dates (start or end date)
            else if (isSelected) {
              // Keep all the selected date styling
              buttonClasses = buttonClasses.filter(cls => !cls.includes('opacity') && !cls.includes('cursor-not-allowed'));
            }
            // For non-past dates that are selectable
            else if (isInRange || (mode === 'pause' && isDateInAvailableRange(date))) {
              buttonClasses = buttonClasses.filter(cls => !cls.includes('opacity') && !cls.includes('cursor-not-allowed'));
            } 
            // For non-past dates that are not selectable (only in pause mode)
            else if (mode === 'pause') {
              buttonClasses.push('text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60');
            }

            return (
              <div 
                key={`day-${index}`} 
                className="relative w-10 h-10 mx-auto"
                onMouseMove={(e) => handleDragOver(e, date)}
              >
                {isEnd && !isPast && mode !== 'pause' && (
                  <div 
                    className="absolute right-0 top-0 h-full w-3 z-20 cursor-ew-resize flex items-center justify-center space-x-px"
                    onMouseDown={() => handleDragStart(date)}
                    onDoubleClick={(e) => e.stopPropagation()}
                  >
                    <div className="h-2 w-px bg-white/50 group-hover/endDate:bg-white transition-colors" />
                    <div className="h-2 w-px bg-white/50 group-hover/endDate:bg-white transition-colors" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (mode === 'pause') {
                      if (isDateSelectable(date)) {
                        handleDateClick(date);
                      }
                    } else if (!isPast) {
                      handleDateClick(date);
                    }
                  }}
                  onMouseEnter={() => {
                    if (mode === 'pause') {
                      if (isDateSelectable(date)) {
                        handleMouseEnter(date);
                      }
                    } else if (!isPast) {
                      handleMouseEnter(date);
                    }
                  }}
                  disabled={mode === 'pause' ? !isDateSelectable(date) : isPast}
                  className={`absolute inset-0 w-full h-full flex items-center justify-center ${buttonClasses.filter(Boolean).join(' ')} ${
                    isEnd && !isPast && mode !== 'pause' ? 'group/endDate' : ''
                  }`}
                style={mode !== 'pause' ? {
                  ...(isInRange && !isStart && !isEnd && {
                    background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(139, 92, 246, 0.1) 100%)',
                    borderRadius: 0,
                  }),
                  ...(isStart && {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderTopLeftRadius: '6px',
                    borderBottomLeftRadius: '6px',
                  }),
                  ...(isEnd && {
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: '6px',
                    borderBottomRightRadius: '6px',
                  }),
                } : {}}
                aria-label={`${format(date, 'EEEE, MMMM d, yyyy')}${isSelected ? ' (selected)' : ''}${isPast ? ' (past date)' : ''}`}
                aria-disabled={isPast || undefined}
              >
                <span className={`relative z-20 ${(isStart || isEnd) ? 'font-semibold' : ''} ${isPast ? 'text-gray-500/80 dark:text-gray-400/80' : ''} transition-all duration-200`}>
                  {isPast ? (
                    <span className="relative inline-flex items-center justify-center w-full h-full">
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-[1.75px] w-7 bg-gray-500/80 dark:bg-gray-400/80 rounded-full"></span>
                      </span>
                      <span className="relative z-10 font-medium text-sm">
                        {day}
                      </span>
                    </span>
                  ) : (
                    day
                  )}
                </span>
                </button>
              </div>
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

  // Add mouse up and mouse leave events to handle drag end
  useEffect(() => {
    const handleMouseUp = () => handleDragEnd();
    const handleMouseLeave = () => handleDragEnd();
    
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleDragEnd]);

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

  // Don't render anything if not open or dates aren't loaded yet
  if (!isOpen || (mode === 'select' && !startDate)) return null;

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
            disabled={mode === 'select' ? (!startDate || !endDate) : (pausedDates.length === 0)}
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
