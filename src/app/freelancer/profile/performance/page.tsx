"use client"

import { useState, useEffect, useCallback } from 'react';
// import { ProfileStatsCard } from '@/components/freelancer/profile/ProfileStatsCard' // Unused;
import { MonthlyActivities } from '@/components/freelancer/profile/MonthlyActivities';
import { TimeRangeSelector } from '@/components/freelancer/profile/TimeRangeSelector';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

// StatCard component for the quick stats section
// function StatCard({ label, value, change, isPositive }: { label: string; value: string; change: string; isPositive: boolean }) {
//   return (
//     <div className="bg-[#111111] p-4 rounded-xl shadow-[0_4px_24px_0_rgba(60,60,60,0.30)]">
//       <p className="text-sm text-white/60 mb-1">{label}</p>
//       <div className="flex items-baseline justify-between">
//         <p className="text-lg font-semibold">{value}</p>
//         <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
//       </div>
//     </div>
//   );
// }

export default function PerformancePage() {
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    completedJobs: 0,
    rating: 0,
    reviewCount: 0,
    completionRate: 0,
    avgProjectValue: 0,
    monthlyStats: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/freelancer/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [dateRange]);

  const handleRangeChange = useCallback((range: { start: Date; end: Date }) => {
    setIsLoading(true);
    setDateRange(range);
    // In a future update, you could pass date range to the API to filter stats
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Link
              href="/freelancer/profile"
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </Link>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-white">Performance Analytics</h1>
              <p className="text-white/50 text-xs">Track your performance metrics and analytics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          {/* Main Content with Stats */}
          {/* Main Content with Stats */}
          <div className="grid grid-cols-1 gap-6">
            {/* Date Range Selector */}
            <div className="flex justify-end">
              <TimeRangeSelector onRangeChange={handleRangeChange} />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1E1E1E] p-4 rounded-xl border border-white/10">
                <p className="text-sm text-white/50">Total Earnings</p>
                <p className="text-2xl font-bold text-white mt-1">₹{stats.totalEarnings}</p>
              </div>
              <div className="bg-[#1E1E1E] p-4 rounded-xl border border-white/10">
                <p className="text-sm text-white/50">Completed Jobs</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.completedJobs}</p>
              </div>
              <div className="bg-[#1E1E1E] p-4 rounded-xl border border-white/10">
                <p className="text-sm text-white/50">Avg. Rating</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-2xl font-bold text-white">{stats.rating.toFixed(1)}</span>
                  <span className="text-sm text-yellow-500">★</span>
                  <span className="text-xs text-white/40 ml-1">({stats.reviewCount})</span>
                </div>
              </div>
              <div className="bg-[#1E1E1E] p-4 rounded-xl border border-white/10">
                <p className="text-sm text-white/50">Completion Rate</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.completionRate}%</p>
              </div>
            </div>

            {/* MonthlyActivities Chart */}
            <MonthlyActivities
              isLoading={isLoading}
              monthlyStats={stats.monthlyStats}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
