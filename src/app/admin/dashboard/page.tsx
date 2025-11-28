'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, Calendar, CreditCard, TrendingUp, 
  ArrowUp, ArrowDown, Activity, DollarSign,
  Package, UserCheck, Clock, AlertCircle,
  ChevronRight, Download, Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data - Replace with API calls
const mockMetrics = {
  totalUsers: 12543,
  userGrowth: 12.5,
  activeUsers: 3421,
  activeGrowth: 8.2,
  totalBookings: 8934,
  bookingGrowth: 15.3,
  totalRevenue: 485670,
  revenueGrowth: 22.8,
  platformFees: 72850,
  avgBookingValue: 54.32,
  totalServices: 456,
  activeServices: 423,
  completionRate: 92.3,
  avgResponseTime: '2.3 hrs'
};

const revenueData = [
  { date: 'Mon', revenue: 12500, bookings: 45 },
  { date: 'Tue', revenue: 18900, bookings: 67 },
  { date: 'Wed', revenue: 15600, bookings: 52 },
  { date: 'Thu', revenue: 22300, bookings: 78 },
  { date: 'Fri', revenue: 19800, bookings: 71 },
  { date: 'Sat', revenue: 28400, bookings: 96 },
  { date: 'Sun', revenue: 31200, bookings: 102 }
];

const categoryPerformance = [
  { name: 'Net Bowler', bookings: 234, revenue: 45600, growth: 12.3 },
  { name: 'Coach', bookings: 189, revenue: 78900, growth: 18.7 },
  { name: 'Match Player', bookings: 167, revenue: 34500, growth: -5.2 },
  { name: 'Sidearm', bookings: 145, revenue: 28900, growth: 8.9 },
  { name: 'Trainer', bookings: 98, revenue: 19800, growth: 22.1 }
];

const recentActivity = [
  { id: 1, type: 'booking', message: 'New booking for Net Bowler service', time: '5 min ago', status: 'new' },
  { id: 2, type: 'user', message: 'New freelancer registration', time: '12 min ago', status: 'pending' },
  { id: 3, type: 'payment', message: 'Payment received ₹2,500', time: '25 min ago', status: 'success' },
  { id: 4, type: 'dispute', message: 'Dispute raised for booking #8234', time: '1 hour ago', status: 'urgent' },
  { id: 5, type: 'verification', message: 'KYC verification pending (3)', time: '2 hours ago', status: 'pending' }
];

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
  prefix?: string;
}

function MetricCard({ title, value, change, icon: Icon, color, prefix = '' }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-[#1a1a1a] border-gray-800 p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-white">
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
              </h3>
              {change !== undefined && (
                <div className={`flex items-center gap-1 text-sm ${
                  change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {Math.abs(change)}%
                </div>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function RevenueChart({ data }: { data: typeof revenueData }) {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  
  return (
    <Card className="bg-[#1a1a1a] border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-gray-400">
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-2 h-48">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-[#2a2a2a] rounded-t-lg relative flex items-end justify-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg"
                  style={{ minHeight: '2px' }}
                />
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">{item.date}</p>
                <p className="text-xs font-medium text-white">₹{(item.revenue / 1000).toFixed(1)}k</p>
              </div>
            </div>
          ))}
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
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={mockMetrics.totalUsers}
          change={mockMetrics.userGrowth}
          icon={Users}
          color="bg-blue-600"
        />
        <MetricCard
          title="Active Bookings"
          value={mockMetrics.totalBookings}
          change={mockMetrics.bookingGrowth}
          icon={Calendar}
          color="bg-green-600"
        />
        <MetricCard
          title="Revenue"
          value={mockMetrics.totalRevenue}
          change={mockMetrics.revenueGrowth}
          icon={DollarSign}
          color="bg-purple-600"
          prefix="₹"
        />
        <MetricCard
          title="Platform Fees"
          value={mockMetrics.platformFees}
          change={15.2}
          icon={CreditCard}
          color="bg-orange-600"
          prefix="₹"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <RevenueChart data={revenueData} />

        {/* Category Performance */}
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Category Performance</h3>
          <div className="space-y-3">
            {categoryPerformance.map((category, index) => (
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
                <div className={`flex items-center gap-1 text-sm ${
                  category.growth >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {category.growth >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {Math.abs(category.growth)}%
                </div>
              </motion.div>
            ))}
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
              <p className="text-2xl font-bold text-white">{mockMetrics.activeUsers.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-white">{mockMetrics.completionRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Avg Response Time</p>
              <p className="text-2xl font-bold text-white">{mockMetrics.avgResponseTime}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <Button variant="ghost" size="sm" className="text-purple-400">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  activity.status === 'urgent' ? 'bg-red-600/20' :
                  activity.status === 'pending' ? 'bg-yellow-600/20' :
                  activity.status === 'success' ? 'bg-green-600/20' :
                  'bg-blue-600/20'
                }`}>
                  {activity.status === 'urgent' && <AlertCircle className="w-4 h-4 text-red-400" />}
                  {activity.status === 'pending' && <Clock className="w-4 h-4 text-yellow-400" />}
                  {activity.status === 'success' && <Activity className="w-4 h-4 text-green-400" />}
                  {activity.status === 'new' && <TrendingUp className="w-4 h-4 text-blue-400" />}
                </div>
                <div>
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400">
                View
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
