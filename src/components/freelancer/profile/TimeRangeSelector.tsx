"use client"

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { format, subMonths, addMonths, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';

type TimeRange = 'week' | 'month' | 'year' | 'custom';

interface TimeRangeSelectorProps {
  onRangeChange: (range: { start: Date; end: Date }) => void;
  defaultRange?: TimeRange;
}

const rangeOptions = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

export function TimeRangeSelector({ onRangeChange, defaultRange = 'month' }: TimeRangeSelectorProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [rangeType, setRangeType] = useState<TimeRange>(defaultRange);
  const [selectedOption, setSelectedOption] = useState(() => {
    const found = rangeOptions.find(opt => opt.value === defaultRange);
    return found || rangeOptions[1];
  });

  useEffect(() => {
    updateRange();
  }, [currentDate, rangeType]);

  const updateRange = () => {
    let startDate: Date;
    let endDate: Date = new Date();

    switch (rangeType) {
      case 'week':
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 6);
        break;
      case 'month':
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
        break;
      case 'year':
        startDate = new Date(currentDate.getFullYear(), 0, 1);
        endDate = new Date(currentDate.getFullYear(), 11, 31);
        break;
      case 'custom':
        // For custom range, we'll use the current date range
        // and open a date picker when implemented
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
        break;
      default:
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
    }

    onRangeChange({ start: startDate, end: endDate });
  };

  const handleRangeChange = (value: TimeRange) => {
    const option = rangeOptions.find(opt => opt.value === value) || rangeOptions[1];
    setSelectedOption(option);
    setRangeType(value);
  };

  const handlePrev = () => {
    if (rangeType === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    } else if (rangeType === 'year') {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate()));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (isSameMonth(currentDate, new Date()) && rangeType !== 'year') {
      return; // Don't go into the future
    }
    
    if (rangeType === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    } else if (rangeType === 'year') {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate()));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const formatDateRange = () => {
    if (rangeType === 'week') {
      return format(startOfMonth(currentDate), 'MMM yyyy');
    }
    if (rangeType === 'month') {
      return format(currentDate, 'MMM yyyy');
    }
    if (rangeType === 'year') {
      return format(currentDate, 'yyyy');
    }
    return 'Custom Range';
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          className="text-white/60 hover:text-white hover:bg-white/5 p-2 h-8 w-8"
          disabled={isSameMonth(currentDate, new Date()) && rangeType === 'month'}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-sm font-medium text-white/80 min-w-[120px] text-center">
          {formatDateRange()}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          disabled={isSameMonth(currentDate, new Date()) && rangeType !== 'year'}
          className="text-white/60 hover:text-white hover:bg-white/5 p-2 h-8 w-8 disabled:opacity-50 disabled:pointer-events-none"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
