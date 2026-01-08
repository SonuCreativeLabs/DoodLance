'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users, Calendar, CreditCard, TrendingUp,
  ArrowUp, ArrowDown, Activity, DollarSign,
  Package, UserCheck, Clock, AlertCircle,
  ChevronRight, Download, Filter, ShieldAlert,
  MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Skeleton component for loading states
function MetricSkeleton() {
  return (
    <Card className="bg-[#1a1a1a] border-gray-800 p-4 sm:p-6 h-[120px] animate-pulse">
      <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-700/50 rounded w-3/4"></div>
    </Card>
  );
}

// categoryPerformance removed - replaced by API data


interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
  prefix?: string;
  isInverse?: boolean; // For metrics where lower is better, or neutral
}

function MetricCard({ title, value, change, icon: Icon, color, prefix = '', isInverse = false }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-[#1a1a1a] border-gray-800">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-gray-400">{title}</p>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
              </h3>
              {change !== undefined && (
                <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                  {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {Math.abs(change)}%
                </div>
              )}
            </div>
          </div>
          <div className={`p-2 sm:p-3 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

interface RevenueChartProps {
  data: any[];
  timeRange: string;
  setTimeRange: (range: string) => void;
}

function RevenueChart({ data, timeRange, setTimeRange }: RevenueChartProps) {
  const maxRevenue = data.length > 0 ? Math.max(100000, ...data.map(d => d.revenue)) : 100000;

  const handleExport = () => {
    if (!data || data.length === 0) return;

    // Create CSV content
    const headers = ['Date', 'Revenue', 'Bookings'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => `${item.date},${item.revenue},${item.bookings}`)
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `revenue_report_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="bg-[#1a1a1a] border-gray-800 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
        <h3 className="text-base sm:text-lg font-semibold text-white">Revenue Overview</h3>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
                <Filter className="w-4 h-4 mr-1" />
                {timeRange === 'day' ? 'Today' : timeRange === 'week' ? 'Last 7 Days' : 'This Month'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-gray-800 text-white">
              <DropdownMenuItem onClick={() => setTimeRange('day')} className="hover:bg-gray-800 cursor-pointer">
                Today
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('week')} className="hover:bg-gray-800 cursor-pointer">
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('month')} className="hover:bg-gray-800 cursor-pointer">
                This Month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Scrollable container for chart bars */}
        <div className="overflow-x-auto pb-2 pt-12 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div className="flex justify-between gap-2 h-48 min-w-[600px] px-1">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="w-full bg-[#2a2a2a] rounded-t-lg relative flex items-end justify-center hover:bg-[#333] transition-colors flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg relative group-hover:from-purple-500 group-hover:to-purple-300 transition-all duration-500 ease-out"
                    style={{
                      height: `${maxRevenue > 0 ? (Number(item.revenue) / maxRevenue) * 100 : 0}%`,
                      minHeight: '4px'
                    }}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-gray-800">
                      ₹{item.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-center w-full">
                  <p className="text-[10px] sm:text-xs text-gray-400 truncate px-0.5">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
          <div>
            <p className="text-sm text-gray-400">Total Revenue</p>
            <p className="text-xl font-bold text-white">
              ₹{data.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Bookings</p>
            <p className="text-xl font-bold text-white">
              {data.reduce((sum, d) => sum + d.bookings, 0)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true); // Show skeleton on range change
      try {
        const res = await fetch(`/api/admin/stats?range=${timeRange}`);
        if (res.ok) {
          const data = await res.json();
          // No need to reverse revenueData, API sends chronological
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
          <MetricSkeleton />
        </div>
        <div className="text-gray-400">Loading dashboard data...</div>
      </div>
    );
  }

  if (!stats) return <div className="p-6 text-white">Failed to load dashboard data.</div>;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={timeRange === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('day')}
            className={timeRange === 'day' ? 'bg-purple-600' : ''}
          >
            Today
          </Button>
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('week')}
            className={timeRange === 'week' ? 'bg-purple-600' : ''}
          >
            Week
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('month')}
            className={timeRange === 'month' ? 'bg-purple-600' : ''}
          >
            Month
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Total Users"
          value={stats.totalUsers}
          change={stats.userGrowth}
          icon={Users}
          color="bg-blue-600"
        />
        <MetricCard
          title="Active Bookings"
          value={stats.activeBookings}
          change={stats.bookingGrowth}
          icon={Calendar}
          color="bg-green-600"
        />
        <MetricCard
          title="Revenue"
          value={stats.totalRevenue}
          change={stats.revenueGrowth}
          icon={DollarSign}
          color="bg-purple-600"
          prefix="₹"
        />
        <MetricCard
          title="Platform Fees"
          value={stats.platformFees}
          change={stats.revenueGrowth}
          icon={CreditCard}
          color="bg-orange-600"
          prefix="₹"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Revenue Chart */}
        {/* Revenue Chart */}
        <RevenueChart
          data={stats.revenueData || []}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />

        {/* Category Performance */}
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Category Performance</h3>
          <div className="space-y-3">
            {stats.categoryPerformance && stats.categoryPerformance.length > 0 ? (
              stats.categoryPerformance.map((category: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{category.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-400">{category.bookings} bookings</span>
                      <span className="text-xs text-gray-400">₹{category.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  {/* Hide growth if it's 0 to avoid clutter */}
                  {category.growth !== 0 && (
                    <div className={`flex items-center gap-1 text-sm ${category.growth >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                      {category.growth >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      {Math.abs(category.growth)}%
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No category data available.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Freelancers</p>
              <p className="text-2xl font-bold text-white">{stats.activeUsers.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-white">{stats.completionRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600/20 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Pending Verifications</p>
              <p className="text-2xl font-bold text-white">{stats.pendingVerifications}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <Link href="/admin/bookings">
            <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-400/10">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {stats.recentActivity && stats.recentActivity.map((activity: any) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activity.status === 'urgent' ? 'bg-red-600/20' :
                  activity.status === 'pending' ? 'bg-yellow-600/20' :
                    activity.status === 'success' ? 'bg-green-600/20' :
                      'bg-blue-600/20'
                  }`}>
                  {activity.status === 'urgent' && <AlertCircle className="w-4 h-4 text-red-400" />}
                  {activity.status === 'pending' || activity.status === 'new' ? <Clock className="w-4 h-4 text-blue-400" /> : null}
                  {activity.status === 'success' && <Activity className="w-4 h-4 text-green-400" />}
                </div>
                <div>
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="text-xs text-gray-400">{new Date(activity.time).toLocaleTimeString()} • {activity.user}</p>
                </div>
              </div>
              <Link href={`/admin/bookings`}>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  View
                </Button>
              </Link>
            </motion.div>
          ))}
          {(!stats.recentActivity || stats.recentActivity.length === 0) && (
            <p className="text-gray-500 text-sm">No recent activity.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
