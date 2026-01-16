'use client';

import { useState, useEffect } from 'react';
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
  Activity, Download, RefreshCw, ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import {
  LineChart as RechartsLineChart, Line, BarChart, Bar, PieChart as RechartsPieChart,
  Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart, ComposedChart
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE', '#F5F3FF'];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7days');
  const [metric, setMetric] = useState('revenue');
  const [loading, setLoading] = useState(true);

  // State for API data
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [userMetrics, setUserMetrics] = useState<any[]>([]);
  const [serviceDistribution, setServiceDistribution] = useState<any[]>([]);
  const [conversionData, setConversionData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);
      if (res.ok) {
        const data = await res.json();
        setPerformanceData(data.performanceData || []);
        setServiceDistribution((data.serviceDistribution || []).map((item: any, index: number) => ({
          ...item,
          fill: COLORS[index % COLORS.length]
        })));
        setStats(data.stats || {});
        setConversionData(data.conversionData || []);

        // Format user metrics
        setUserMetrics([
          { name: 'Active Users', value: data.userMetrics.activeUsers || 0, change: 0, trending: 'neutral' },
          { name: 'New Signups', value: data.userMetrics.newSignups || 0, change: 0, trending: 'neutral' },
          { name: 'Retention Rate', value: parseFloat(data.userMetrics.retentionRate) || 0, change: 0, trending: 'neutral' },
          { name: 'Engagement Rate', value: parseFloat(data.userMetrics.engagementRate) || 0, change: 0, trending: 'neutral' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!performanceData.length) return;

    // Create CSV content
    const headers = ['Date', 'Users', 'Revenue', 'Bookings'];
    const csvContent = [
      headers.join(','),
      ...performanceData.map(row =>
        `"${row.name}",${row.users},${row.revenue},${row.bookings}`
      )
    ].join('\n');

    // Create and click download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics_report_${timeRange}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
          <Button variant="outline" className="text-gray-300" onClick={fetchAnalytics}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Key Metrics */}

        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-[#1a1a1a] border-gray-800 p-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-[#2a2a2a]" />
                <Skeleton className="h-8 w-32 bg-[#2a2a2a]" />
                <Skeleton className="h-4 w-16 bg-[#2a2a2a]" />
              </div>
            </Card>
          ))
        ) : userMetrics.map((metric, index) => (
          <Card key={index} className="bg-[#1a1a1a] border-gray-800 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-400">{metric.name}</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {typeof metric.value === 'number' && metric.name.includes('Rate')
                    ? `${metric.value}%`
                    : metric.value.toLocaleString()}
                </p>
                {/* Trend indicator omitted as backend doesn't provide historical comparison yet */}
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
          {loading ? (
            <div className="w-full h-[300px] flex items-end justify-between gap-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="w-full bg-[#2a2a2a] rounded-t" style={{ height: `${Math.random() * 60 + 20}%` }} />
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
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
          )}
        </Card>

        {/* Service Distribution */}
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Service Distribution</h3>
          {loading ? (
            <div className="w-full h-[300px] flex items-center justify-center">
              <Skeleton className="w-64 h-64 rounded-full bg-[#2a2a2a]" />
            </div>
          ) : serviceDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                  itemStyle={{ color: '#fff' }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No service data available
            </div>
          )}
        </Card>

        {/* Conversion Funnel */}
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Conversion Funnel</h3>
          {loading ? (
            <div className="w-full h-[300px] flex items-end justify-between gap-2 px-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-full bg-[#2a2a2a] rounded-t" style={{ height: `${Math.random() * 60 + 20}%` }} />
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                  labelStyle={{ color: '#fff' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* User Growth */}
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">User Growth Trend</h3>
          {loading ? (
            <div className="w-full h-[300px] flex items-end justify-between gap-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="w-full bg-[#2a2a2a] rounded-t" style={{ height: `${Math.random() * 60 + 20}%` }} />
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis yAxisId="left" stroke="#6b7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar yAxisId="left" dataKey="bookings" barSize={20} fill="#10B981" name="Bookings" />
                <Line yAxisId="right" type="monotone" dataKey="users" stroke="#EC4899" strokeWidth={2} name="Active Users" />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Detailed Stats Table */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="text-center p-4 bg-[#2a2a2a] rounded-lg">
                <Skeleton className="h-4 w-20 mx-auto mb-2 bg-[#333]" />
                <Skeleton className="h-6 w-16 mx-auto bg-[#333]" />
              </div>
            ))
          ) : [
            { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}` },
            { label: 'Avg Booking Value', value: `₹${Math.round(stats.avgBookingValue || 0).toLocaleString()}` },
            { label: 'Booking Completion', value: `${stats.bookingCompletionRate || 0}%` },
            { label: 'Total Bookings', value: (stats.totalBookings || 0).toLocaleString() },
            { label: 'Conversion Rate', value: `${stats.conversionRate || 0}%` },
            { label: 'Active Services', value: (stats.totalServices || 0).toLocaleString() },
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-[#2a2a2a] rounded-lg">
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
