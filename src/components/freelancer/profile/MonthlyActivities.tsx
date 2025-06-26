import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Flame, ArrowUpRight, Activity, Calendar, BarChart2 } from "lucide-react";
import { useState, useEffect, useMemo } from 'react';
import { 
  format, 
  isToday, 
  isSameDay, 
  isSameMonth, 
  addMonths, 
  subMonths, 
  addYears, 
  subYears, 
  addWeeks, 
  subWeeks, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek, 
  isSameYear, 
  isSameWeek, 
  startOfDay, 
  isWeekend, 
  addDays, 
  subDays,
  isSameWeek as dateFnsIsSameWeek,
  isSameMonth as dateFnsIsSameMonth
} from 'date-fns';

// Helper function to generate consistent hash from a string
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Generate a consistent number between min and max based on a seed
const seededRandom = (seed: string, min: number, max: number): number => {
  const hash = simpleHash(seed);
  const random = (Math.sin(hash) * 10000) % 1;
  return Math.floor(random * (max - min + 1)) + min;
};

type TimeRange = 'daily' | 'weekly' | 'monthly';

interface ActivityData {
  label: string;
  value: number;
  isCurrent?: boolean;
  date?: Date;
}

interface ActivityChartProps {
  data: ActivityData[];
  timeRange: TimeRange;
  currentDate: Date;
  weekDays: Date[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  activeTab: TimeRange;
}

const ActivityChart = ({ 
  data, 
  timeRange, 
  currentDate, 
  weekDays,
  selectedDate,
  onDateSelect,
  activeTab 
}: ActivityChartProps) => {
  // Debug log the incoming data
  console.log('ActivityChart data:', {
    data: data,
    weekDays: weekDays,
    hasData: data && data.length > 0,
    firstItem: data[0],
    dataValues: data.map(d => d.value)
  });

  // Ensure we have valid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center">
        <p className="text-white/60">No activity data available</p>
      </div>
    );
  }

  // Calculate maximum value for scaling (ensure it's at least 1 to avoid division by zero)
  const maxValue = Math.max(...data.map(item => item.value), 1);
  
  // Define colors using CSS variables
  const colors = {
    bar: 'var(--purple, #8B66D1)',
    barHover: 'var(--purple-light, #9B76E1)',
    barActive: 'var(--purple-dark, #4C1D95)'
  };

  return (
    <div className="mt-2">
      {/* Chart Container */}
      <div className="flex items-end justify-between h-40 mb-2 px-1 gap-1 relative">
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 25, 50, 75, 100].map((percent, i) => (
            <div key={`grid-${i}`} className="w-full h-px bg-white/5"></div>
          ))}
        </div>
        
        {/* Removed debug info */}
        
        {/* Bars */}
        {data.map((item, i) => {
          // Ensure we have a valid value
          const value = Math.max(0, Number(item.value) || 0);
          // Calculate bar height (at least 5% of container height, max 95%)
          const height = Math.min(95, Math.max(5, (value / maxValue) * 95));
          const isActive = value > 0;
          const isCurrent = item.date ? isToday(item.date) : false;
          
          return (
            <div 
              key={`bar-${i}`} 
              className="flex-1 flex flex-col items-center group h-full"
              style={{
                padding: '0 2px',
                zIndex: 1
              }}
            >
              <div 
                className={`w-full rounded-t-md transition-all duration-300 ease-out ${
                  isCurrent 
                    ? 'shadow-[0_0_15px_rgba(139,92,246,0.5)]' 
                    : 'opacity-90 group-hover:opacity-100 group-hover:shadow-md'
                }`}
                style={{
                  height: `${height}%`,
                  minHeight: '4px',
                  background: `linear-gradient(to top, ${colors.barActive}, ${colors.bar} 100%)`,
                  marginTop: 'auto',
                  transform: 'scaleY(1)',
                  transformOrigin: 'bottom',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {/* Simple Tooltip */}
                {isActive && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50">
                    <div className="bg-black/90 text-white text-xs px-3 py-1.5 rounded-md whitespace-nowrap shadow-2xl border border-white/10">
                      {value} {value === 1 ? 'activity' : 'activities'}
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-black/90 rotate-45 -z-10 border-b border-r border-white/10"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Days/Months Grid */}
      <div className="w-full overflow-x-auto">
        <div className="flex justify-between px-1 w-full">
          {weekDays.map((day, i) => {
            // Ensure day and selectedDate are valid Date objects
            const today = new Date();
            const currentDay = day instanceof Date ? day : new Date(day);
            const currentSelectedDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
            
            let isSelected = false;
            let isCurrent = false;
            
            if (activeTab === 'daily') {
              isCurrent = isToday(currentDay);
              isSelected = isSameDay(currentDay, currentSelectedDate) || (isCurrent && !isSameDay(currentSelectedDate, currentDay));
            } else if (activeTab === 'weekly') {
              isCurrent = dateFnsIsSameWeek(currentDay, today);
              isSelected = dateFnsIsSameWeek(currentDay, currentSelectedDate) || 
                          (isCurrent && !dateFnsIsSameWeek(currentSelectedDate, currentDay));
            } else {
              isCurrent = dateFnsIsSameMonth(currentDay, today) && currentDay.getFullYear() === today.getFullYear();
              isSelected = (dateFnsIsSameMonth(currentDay, currentSelectedDate) && 
                          currentDay.getFullYear() === currentSelectedDate.getFullYear()) || 
                          (isCurrent && !(dateFnsIsSameMonth(currentSelectedDate, currentDay) && 
                          currentSelectedDate.getFullYear() === currentDay.getFullYear()));
            }
            
            return (
              <div key={i} className="w-[calc(100%/12)] flex justify-center">
                <button
                  onClick={() => onDateSelect(day)}
                  className={`flex flex-col items-center justify-center w-full transition-colors ${
                    isSelected 
                      ? 'text-white' 
                      : 'text-white/60 hover:text-white/90'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className={`text-xs whitespace-nowrap ${isSelected ? 'text-purple-400' : ''}`}>
                      {activeTab === 'monthly' 
                        ? format(day, 'MMM')[0]
                        : activeTab === 'weekly'
                          ? `W${i + 1}`
                          : format(day, 'EEE')[0]}
                    </span>
                    {activeTab === 'daily' && (
                      <span className="text-xs mt-0.5">
                        {format(day, 'd')}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <div className="w-1 h-1 rounded-full bg-purple-400 mt-0.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const generateData = (timeRange: TimeRange, currentDate: Date): ActivityData[] => {
  // Create a consistent seed based on the current date and time range
  const seed = `${timeRange}-${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  const today = new Date();
  
  switch (timeRange) {
    case 'daily': {
      const hour = currentDate.getHours();
      return Array.from({ length: 24 }).map((_, i) => ({
        label: `${i}:00`,
        value: seededRandom(`${seed}-hour-${i}`, 10, 110),
        isCurrent: i === hour,
        date: new Date(currentDate.setHours(i, 0, 0, 0))
      }));
    }
      
    case 'weekly': {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      return daysInMonth.map((date, i) => {
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const baseValue = isWeekend ? 10 : 30;
        const range = isWeekend ? 40 : 70;
        const dateKey = format(date, 'yyyy-MM-dd');
        
        return {
          label: format(date, 'd'),
          value: seededRandom(`${seed}-${dateKey}`, baseValue, baseValue + range),
          date,
          isCurrent: isToday(date)
        };
      });
    }
      
    case 'monthly':
    default: {
      return Array.from({ length: 12 }).map((_, i) => {
        const date = new Date(currentDate.getFullYear(), i, 1);
        const monthKey = format(date, 'yyyy-MM');
        return {
          label: format(date, 'MMM'),
          value: seededRandom(`${seed}-${monthKey}`, 30, 130),
          isCurrent: i === currentDate.getMonth(),
          date
        };
      });
    }
  }
};

const ActivityTab = ({ 
  active, 
  onClick, 
  children,
  icon: Icon 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <button
    onClick={onClick}
    className={`relative flex-1 py-3 flex flex-col items-center transition-colors ${
      active ? 'text-white' : 'text-white/40 hover:text-white/70'
    }`}
  >
    <Icon className={`h-5 w-5 mb-1 ${active ? 'text-primary' : ''}`} />
    <span className="text-xs font-medium">{children}</span>
    {active && (
      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-t-full" />
    )}
  </button>
);

export function MonthlyActivities() {
  const [activeTab, setActiveTab] = useState<TimeRange>('daily');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  

  const percentChange = activeTab === 'daily' ? 25 : activeTab === 'weekly' ? 18 : 42;

  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));
  
  const handleDateSelect = (date: Date | string) => {
    // Ensure we have a valid Date object
    const selectedDateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(selectedDateObj.getTime())) {
      console.error('Invalid date selected:', date);
      return;
    }
    
    setSelectedDate(selectedDateObj);
    
    // Update currentDate to match the selected period
    if (activeTab === 'daily') {
      setCurrentDate(startOfDay(selectedDateObj));
    } else if (activeTab === 'weekly') {
      setCurrentDate(startOfWeek(selectedDateObj, { weekStartsOn: 1 })); // Start week on Monday
    } else {
      setCurrentDate(startOfMonth(selectedDateObj));
    }
  };

  const getHeaderTitle = () => {
    const { days } = getDaysAndDataForTab();
    if (activeTab === 'daily' && days.length > 0) {
      const firstDay = days[0];
      const lastDay = days[days.length - 1];
      if (isSameMonth(firstDay, lastDay)) {
        // Same month: 'MMM d-d, yyyy' (e.g., 'Apr 23-29, 2023')
        return `${format(firstDay, 'MMM d')}-${format(lastDay, 'd, yyyy')}`;
      } else {
        // Crosses month boundary: 'MMM d - MMM d, yyyy' (e.g., 'Mar 27 - Apr 2, 2023')
        return `${format(firstDay, 'MMM d')} - ${format(lastDay, 'MMM d, yyyy')}`;
      }
    }
    // For weekly and monthly views, show month and year
    return activeTab === 'monthly' ? format(currentDate, 'yyyy') : format(currentDate, 'MMMM yyyy');
  };

  const handlePrevPeriod = () => {
    switch (activeTab) {
      case 'daily':
        setCurrentDate(prev => subWeeks(prev, 1));
        break;
      case 'weekly':
        setCurrentDate(prev => subMonths(prev, 1));
        break;
      case 'monthly':
        setCurrentDate(prev => subYears(prev, 1));
        break;
    }
  };

  const handleNextPeriod = () => {
    switch (activeTab) {
      case 'daily':
        setCurrentDate(prev => addWeeks(prev, 1));
        break;
      case 'weekly':
        setCurrentDate(prev => addMonths(prev, 1));
        break;
      case 'monthly':
        setCurrentDate(prev => addYears(prev, 1));
        break;
    }
  };

  // Generate days and corresponding data based on active tab
  const getDaysAndDataForTab = () => {
    const days = [];
    const data = [];
    
    switch (activeTab) {
      case 'daily': {
        // Get the current day of week (0 = Sunday, 1 = Monday, etc.)
        const currentDay = currentDate.getDay();
        // Calculate the start of the week (Monday)
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
        
        // Generate all 7 days of the week
        for (let i = 0; i < 7; i++) {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          days.push(date);
          
          // Generate data for each day
          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const baseValue = isWeekend ? 30 : 50;
          const range = isWeekend ? 40 : 60;
          const dateKey = format(date, 'yyyy-MM-dd');
          
          data.push({
            label: format(date, 'EEE'),
            value: seededRandom(`daily-${dateKey}`, baseValue, baseValue + range),
            isCurrent: isToday(date),
            date
          });
        }
        break;
      }
        
      case 'weekly': {
        // 4 weeks of current month
        for (let i = 0; i < 4; i++) {
          const date = new Date(currentDate);
          date.setDate(1);
          date.setMonth(currentDate.getMonth());
          date.setDate(1 + (i * 7));
          days.push(date);
          
          // Generate data for each week
          data.push({
            label: `Week ${i + 1}`,
            value: seededRandom(`week-${i}-${currentDate.getMonth()}`, 40, 100),
            isCurrent: i === Math.floor((currentDate.getDate() - 1) / 7),
            date
          });
        }
        break;
      }
        
      case 'monthly':
        // All months of the year
        for (let i = 0; i < 12; i++) {
          const date = new Date(currentDate.getFullYear(), i, 1);
          days.push(date);
          
          // Generate data for each month
          data.push({
            label: format(date, 'MMM'),
            value: seededRandom(`month-${i}`, 50, 120),
            isCurrent: i === currentDate.getMonth(),
            date
          });
        }
        break;
    }
    
    return { days, data };
  };
  
  // Generate activity data based on current view
  const generateActivityData = () => {
    const { days } = getDaysAndDataForTab();
    
    return days.map((date, index) => {
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseValue = isWeekend ? 30 : 50;
      const range = isWeekend ? 40 : 60;
      const dateKey = format(date, 'yyyy-MM-dd');
      
      return {
        label: format(date, 'EEE'),
        value: seededRandom(`activity-${dateKey}`, baseValue, baseValue + range),
        isCurrent: isToday(date),
        date
      };
    });
  };

  // Update days and activity data when currentDate or activeTab changes
  const { days: daysForTab } = useMemo(() => {
    return getDaysAndDataForTab();
  }, [currentDate, activeTab]);
  
  // Generate activity data based on current view
  const activityData = useMemo<ActivityData[]>(() => {
    console.log('Generating activity data for days:', daysForTab);
    
    if (!daysForTab || daysForTab.length === 0) {
      console.log('No days available for activity data');
      return [];
    }
    
    const today = new Date();
    const validData: ActivityData[] = [];
    
    daysForTab.forEach((date, index) => {
      try {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
          console.error('Invalid date at index', index, date);
          return;
        }
        
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const baseValue = isWeekend ? 30 : 50;
        const range = isWeekend ? 40 : 60;
        const dateKey = format(date, 'yyyy-MM-dd');
        const value = Math.max(10, seededRandom(`activity-${dateKey}`, baseValue, baseValue + range));
        
        validData.push({
          label: format(date, 'EEE'),
          value: value,
          isCurrent: isToday(date),
          date: date
        });
      } catch (error) {
        console.error('Error generating activity data for date:', date, error);
      }
    });
    
    console.log('Generated activity data:', {
      data: validData,
      hasData: validData.length > 0,
      firstItem: validData[0],
      values: validData.map(d => d.value)
    });
    
    return validData;
  }, [daysForTab]);
  
  // Filter out any invalid data points
  const validActivityData = useMemo(() => {
    const valid = activityData.filter(item => 
      item && 
      typeof item.value === 'number' && 
      item.value > 0 &&
      item.date instanceof Date &&
      !isNaN(item.date.getTime())
    );
    
    console.log('Valid activity data:', {
      count: valid.length,
      totalValue: valid.reduce((sum, item) => sum + item.value, 0),
      firstItem: valid[0]
    });
    
    return valid;
  }, [activityData]);
  
  // Calculate total activities from valid data
  const totalActivities = useMemo(() => {
    const total = validActivityData.reduce((sum, item) => sum + item.value, 0);
    console.log('Total activities:', total);
    return total;
  }, [validActivityData]);

  return (
    <div className="space-y-4">
      {/* Title Section */}
      <div className="px-1">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Performance Activity</h2>
        <p className="text-xs sm:text-sm text-white/60">Track your daily progress</p>
      </div>
      
      {/* Card Content */}
      <div className="overflow-hidden">
        <div className="p-0">
          <div className="p-4 sm:p-6 bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl">
            <div className="flex flex-col gap-4">
              {/* Calendar Navigation */}
              <div className="relative flex items-center justify-between w-full p-1">
                <button
                  onClick={handlePrevPeriod}
                  className="p-1.5 text-white/60 hover:text-white transition-colors"
                  aria-label={`Previous ${activeTab}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="absolute left-1/2 transform -translate-x-1/2 text-sm font-medium text-white/80 whitespace-nowrap">
                  {getHeaderTitle()}
                </span>
                <button
                  onClick={handleNextPeriod}
                  className="p-1.5 text-white/60 hover:text-white transition-colors"
                  aria-label={`Next ${activeTab}`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex bg-white/5 rounded-xl overflow-hidden w-full">
                <ActivityTab 
                  active={activeTab === 'daily'} 
                  onClick={() => setActiveTab('daily')}
                  icon={Activity}
                >
                  Daily
                </ActivityTab>
                <ActivityTab 
                  active={activeTab === 'weekly'} 
                  onClick={() => setActiveTab('weekly')}
                  icon={BarChart2}
                >
                  Weekly
                </ActivityTab>
                <ActivityTab 
                  active={activeTab === 'monthly'} 
                  onClick={() => setActiveTab('monthly')}
                  icon={Calendar}
                >
                  Monthly
                </ActivityTab>
              </div>
              
              {/* Stats */}
              <div className="flex flex-col gap-4">
                {/* Activity count with percentage */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-3xl sm:text-4xl font-bold text-white">{totalActivities}</p>
                    <p className="text-sm text-white/60">Total {activeTab} activities</p>
                  </div>
                  
                  {/* Percentage indicator */}
                  <div className="flex items-center px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-xs sm:text-sm h-fit mt-1">
                    <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    {percentChange}% from last {activeTab === 'daily' ? 'week' : activeTab === 'weekly' ? 'month' : 'year'}
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="mt-2">
                <div className="relative -mx-2 sm:mx-0">
                  {/* Custom scrollbar styles */}
                  <style jsx>{`
                    .hide-scrollbar::-webkit-scrollbar {
                      height: 4px;
                    }
                    .hide-scrollbar::-webkit-scrollbar-thumb {
                      background-color: rgba(255, 138, 61, 0.3);
                      border-radius: 4px;
                    }
                    .hide-scrollbar::-webkit-scrollbar-track {
                      background-color: rgba(255, 255, 255, 0.05);
                      border-radius: 4px;
                    }
                  `}</style>
                  <div className="w-full">
                    {validActivityData.length > 0 ? (
                      <ActivityChart 
                        data={validActivityData} 
                        timeRange={activeTab} 
                        currentDate={currentDate}
                        weekDays={daysForTab}
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        activeTab={activeTab}
                      />
                    ) : (
                      <div className="h-40 flex items-center justify-center">
                        <p className="text-white/60">No activity data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
