'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp, Users, Package, DollarSign, Activity,
  BarChart3, PieChart, LineChart, Download, RefreshCw,
  Calendar, Clock, ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import {
  LineChart as RechartsLineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, 
  Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  Area, AreaChart, RadialBarChart, RadialBar, ComposedChart
} from 'recharts';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7days');
  const [metric, setMetric] = useState('revenue');

  // Performance metrics
  const performanceData = [
    { name: 'Mon', users: 420, revenue: 24000, bookings: 45 },
    { name: 'Tue', users: 480, revenue: 28000, bookings: 52 },
    { name: 'Wed', users: 520, revenue: 32000, bookings: 61 },
    { name: 'Thu', users: 390, revenue: 21000, bookings: 38 },
    { name: 'Fri', users: 590, revenue: 35000, bookings: 68 },
    { name: 'Sat', users: 680, revenue: 42000, bookings: 78 },
    { name: 'Sun', users: 720, revenue: 45000, bookings: 82 },
  ];

  // User metrics
  const userMetrics = [
    { name: 'Active Users', value: 1234, change: 12.5, trending: 'up' },
    { name: 'New Signups', value: 89, change: -5.2, trending: 'down' },
    { name: 'Retention Rate', value: 78.5, change: 3.1, trending: 'up' },
    { name: 'Engagement Rate', value: 65.2, change: 0, trending: 'neutral' },
  ];

  // Service distribution
  const serviceDistribution = [
    { name: 'Net Bowler', value: 35, fill: '#8B5CF6' },
    { name: 'Coach', value: 28, fill: '#EC4899' },
    { name: 'Match Player', value: 20, fill: '#10B981' },
    { name: 'Physio', value: 10, fill: '#F59E0B' },
    { name: 'Others', value: 7, fill: '#6B7280' },
  ];

  // Conversion funnel
  const conversionData = [
    { name: 'Page Views', value: 5000, fill: '#8B5CF6' },
    { name: 'Sign Ups', value: 1200, fill: '#A78BFA' },
    { name: 'Active Users', value: 800, fill: '#C4B5FD' },
    { name: 'Bookings', value: 450, fill: '#DDD6FE' },
    { name: 'Completed', value: 380, fill: '#EDE9FE' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400 mt-1">Track performance metrics and insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24hours">24 Hours</SelectItem>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="90days">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="text-gray-300">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {userMetrics.map((metric, index) => (
          <Card key={index} className="bg-[#1a1a1a] border-gray-800 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">{metric.name}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {typeof metric.value === 'number' && metric.value % 1 !== 0 
                    ? `${metric.value}%` 
                    : metric.value.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  {metric.trending === 'up' ? (
                    <ArrowUp className="w-4 h-4 text-green-400" />
                  ) : metric.trending === 'down' ? (
                    <ArrowDown className="w-4 h-4 text-red-400" />
                  ) : (
                    <Minus className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={`text-sm ${
                    metric.trending === 'up' ? 'text-green-400' : 
                    metric.trending === 'down' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {Math.abs(metric.change)}%
                  </span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Performance Overview</h3>
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="w-[120px] bg-[#2a2a2a] border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="bookings">Bookings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey={metric}
                stroke="#8B5CF6"
                fillOpacity={1}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Service Distribution */}
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Service Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={serviceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {serviceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </Card>

        {/* Conversion Funnel */}
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Conversion Funnel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* User Growth */}
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">User Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="bookings" barSize={20} fill="#10B981" />
              <Line type="monotone" dataKey="users" stroke="#EC4899" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Stats Table */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: 'Bounce Rate', value: '32.5%', trend: 'down' },
            { label: 'Session Duration', value: '4m 23s', trend: 'up' },
            { label: 'Page Views', value: '12.3K', trend: 'up' },
            { label: 'Conversion Rate', value: '3.8%', trend: 'up' },
            { label: 'Cart Abandonment', value: '28%', trend: 'down' },
            { label: 'Customer LTV', value: '₹8,500', trend: 'up' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-gray-400">{stat.label}</p>
              <p className="text-lg font-semibold text-white mt-1">{stat.value}</p>
              <span className={`text-xs ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {stat.trend === 'up' ? '↑' : '↓'}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
