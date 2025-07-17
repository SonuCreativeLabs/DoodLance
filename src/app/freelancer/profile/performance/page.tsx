"use client"

import { useState, useEffect } from 'react';
import { ProfileStatsCard } from '@/components/freelancer/profile/ProfileStatsCard';
import { MonthlyActivities } from '@/components/freelancer/profile/MonthlyActivities';
import { TimeRangeSelector } from '@/components/freelancer/profile/TimeRangeSelector';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

// StatCard component for the quick stats section
function StatCard({ label, value, change, isPositive }: { label: string; value: string; change: string; isPositive: boolean }) {
  return (
    <div className="bg-[#111111] p-4 rounded-xl shadow-[0_4px_24px_0_rgba(60,60,60,0.30)]">
      <p className="text-sm text-white/60 mb-1">{label}</p>
      <div className="flex items-baseline justify-between">
        <p className="text-lg font-semibold">{value}</p>
        <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
      </div>
    </div>
  );
}

export default function PerformancePage() {
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // This would be replaced with actual data fetching in a real app
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [dateRange]);

  const handleRangeChange = (range: { start: Date; end: Date }) => {
    setIsLoading(true);
    setDateRange(range);
    // In a real app, you would fetch data for the new date range here
  };

  // Calculate summary data based on date range
  const getSummaryData = () => {
    // In a real app, this would be calculated from your actual data
    // For now, we're using mock data
    const monthsDiff = Math.ceil(
      (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24 * 30)
    ) || 1;
    
    return {
      completed: Math.round(124 * (monthsDiff / 12)),
      inProgress: Math.round(5 * (monthsDiff / 12)),
      pendingJobs: Math.round(3 * (monthsDiff / 12)),
      totalWorkingHours: Math.round(1240 * (monthsDiff / 12)),
      totalEarnings: Math.round(945000 * (monthsDiff / 12))
    };
  };

  const summaryData = getSummaryData();

  return (
    <div className="min-h-screen bg-[#111111] text-white pb-20 md:pb-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link 
                href="/freelancer/profile" 
                className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-200">
                  <ArrowLeft className="h-4 w-4" />
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Performance Analytics</h1>
                <p className="text-white/60 text-sm mt-0.5">Track your performance metrics and analytics</p>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content with Stats */}
        <div className="grid grid-cols-1">
          {/* MonthlyActivities (bars) first */}
          <MonthlyActivities isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
