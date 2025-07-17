import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Flame, ArrowUpRight, Activity, Calendar, BarChart2 } from "lucide-react";
import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isWeekend, isSameDay, addDays, subDays } from 'date-fns';

type TimeRange = 'daily' | 'weekly' | 'monthly';

interface ActivityData {
  label: string;
  value: number;
  isCurrent?: boolean;
  date?: Date;
}

const ActivityChart = ({ data, timeRange, currentDate }: { data: ActivityData[], timeRange: TimeRange, currentDate: Date }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1);
  
  // Ensure we have data to display
  if (!data || data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center">
        <p className="text-white/60">No activity data available</p>
      </div>
    );
  }
  
  return (
    <div className="mt-6">
      <div className="flex items-end justify-between h-40 px-1">
        {data.map((item, index) => {
          const height = maxValue > 0 ? 20 + (item.value / maxValue) * 60 : 0;
          const isCurrent = isToday(item.date || new Date());
          const isWeekendDay = item.date && isWeekend(item.date);
          const isActive = item.value > 0;
          
          // Apple Fitness style purple gradient
          const gradientStart = '#8A2BE2'; // Purple
          const gradientEnd = '#4B0082';   // Indigo
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 group">
              <div className="w-full flex flex-col items-center h-full">
                <div className="relative w-6 flex justify-center" style={{ height: '100%' }}>
                  <div 
                    className={`w-full rounded-t-full transition-all duration-300 ease-out ${
                      isCurrent
                        ? 'shadow-[0_0_15px_rgba(138,43,226,0.5)]'
                        : 'opacity-80 group-hover:opacity-100'
                    }`}
                    style={{
                      height: isActive ? `${height}%` : '2px',
                      background: isActive 
                        ? `linear-gradient(to top, ${gradientStart}, ${gradientEnd})`
                        : 'rgba(255, 255, 255, 0.1)',
                      minHeight: '2px',
                      alignSelf: 'flex-end',
                      marginTop: 'auto'
                    }}
                  >
                    {isActive && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-medium text-white/80 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 px-2 py-1 rounded whitespace-nowrap">
                        {item.value} {item.value === 1 ? 'activity' : 'activities'}
                      </div>
                    )}
                  </div>
                </div>
                <span className={`text-xs mt-2 ${
                  isCurrent 
                    ? 'text-purple-300 font-medium' 
                    : isWeekendDay 
                      ? 'text-white/50' 
                      : 'text-white/60'
                }`}>
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const generateData = (timeRange: TimeRange, currentDate: Date): ActivityData[] => {
  const today = new Date();
  
  switch (timeRange) {
    case 'daily':
      const weekStart = new Date(currentDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start from Sunday
      
      return Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        return {
          label: format(date, 'EEE'),
          value: Math.floor(Math.random() * 20) + 5, // Random activity count
          date: date
        };
      });
      
    case 'weekly':
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const weeksInMonth = Math.ceil((monthEnd.getDate() + monthStart.getDay()) / 7);
      
      return Array.from({ length: weeksInMonth }).map((_, i) => {
        const weekStart = new Date(monthStart);
        weekStart.setDate(i * 7 - monthStart.getDay() + 1);
        return {
          label: `W${i + 1}`,
          value: Math.floor(Math.random() * 50) + 20,
          isCurrent: isSameMonth(new Date(), currentDate) && i === Math.floor((new Date().getDate() + monthStart.getDay() - 1) / 7)
        };
      });
      
    case 'monthly':
    default:
      return Array.from({ length: 12 }).map((_, i) => {
        const date = new Date(currentDate.getFullYear(), i, 1);
        return {
          label: format(date, 'MMM'),
          value: Math.floor(Math.random() * 100) + 30,
          isCurrent: i === currentDate.getMonth()
        };
      });
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
  
  const activityData = generateData(activeTab, currentDate);
  const totalActivities = activityData.reduce((sum, item) => sum + item.value, 0);
  const percentChange = activeTab === 'daily' ? 25 : activeTab === 'weekly' ? 18 : 42;

  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'daily':
        return format(currentDate, 'MMMM yyyy');
      case 'weekly':
        return format(currentDate, 'MMMM yyyy');
      case 'monthly':
        return format(currentDate, 'yyyy');
      default:
        return '';
    }
  };

  // Generate week days for the top bar
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + i);
    return date;
  });

  return (
    <div className="space-y-4">
      {/* Title Section */}
      <div className="px-1">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Performance Activity</h2>
        <p className="text-xs sm:text-sm text-white/60">Track your daily progress</p>
      </div>
      
      {/* Card Content */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-6 bg-gradient-to-br from-[#1E1E1E] to-[#121212] rounded-2xl">
          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center justify-between sm:justify-end space-x-2 w-full sm:w-auto">
              <button 
                onClick={handlePrevMonth}
                className="p-2 rounded-full hover:bg-white/5 text-white/60 hover:text-white"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-white/80 min-w-[120px] text-center">
                {getHeaderTitle()}
              </span>
              <button 
                onClick={handleNextMonth}
                className="p-2 rounded-full hover:bg-white/5 text-white/60 hover:text-white"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Week Days */}
          <div className="flex justify-between mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-2 px-2">
            <div className="flex flex-nowrap gap-1 sm:gap-2">
              {weekDays.map((day, i) => {
                const isSelected = isSameDay(day, selectedDate);
                return (
                  <button
                    key={i}
                    onClick={() => handleDateSelect(day)}
                    className={`flex flex-col items-center w-10 h-14 sm:h-16 rounded-xl justify-center transition-colors flex-shrink-0 ${
                      isSelected 
                        ? 'bg-primary/20 text-white' 
                        : 'text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xs">{format(day, 'EEE')[0]}</span>
                    <span className={`text-sm font-medium mt-1 ${isSelected ? 'text-primary' : ''}`}>
                      {format(day, 'd')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-white">{totalActivities}</p>
                <p className="text-sm text-white/60">Total {activeTab} activities</p>
              </div>
              <div className="flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start">
                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                {percentChange}% from last {activeTab === 'daily' ? 'week' : activeTab === 'weekly' ? 'month' : 'year'}
              </div>
            </div>
            
            <div className="relative h-40 sm:h-48 -mx-2 sm:mx-0">
              <ActivityChart 
                data={activityData} 
                timeRange={activeTab} 
                currentDate={currentDate}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white/5 rounded-t-xl overflow-hidden mt-6">
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
          
          {/* Purple accent bar */}
          <div className="h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500"></div>
        </div>
      </div>
    </div>
  );
}
