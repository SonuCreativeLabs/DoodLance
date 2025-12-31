'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText, Download, Calendar, TrendingUp, Users,
  DollarSign, Package, AlertCircle, BarChart, PieChart,
  Filter, RefreshCw, FileSpreadsheet, FilePlus
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart,
  Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';

const reportTypes = [
  {
    id: 'revenue',
    title: 'Revenue Report',
    description: 'Detailed revenue analytics and transactions',
    icon: DollarSign,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 'users',
    title: 'User Analytics',
    description: 'User growth, retention, and activity metrics',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'bookings',
    title: 'Booking Report',
    description: 'Booking trends, completion rates, and patterns',
    icon: Package,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'performance',
    title: 'Performance Report',
    description: 'Platform performance and service metrics',
    icon: TrendingUp,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [reportType, setReportType] = useState('all');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [loading, setLoading] = useState(true);

  // State for API data
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    fetchReports();
  }, [reportType]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?type=${reportType}`);
      if (res.ok) {
        const data = await res.json();
        setRevenueData(data.revenueData || []);
        setCategoryData(data.categoryData || []);
        setUserGrowthData(data.userGrowthData || []);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: string) => {
    console.log(`Exporting ${selectedReport} report as ${format}`);
    // In production, this would generate and download the report
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Generate comprehensive reports and insights</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" className="text-gray-300 w-full sm:w-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
            <FilePlus className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div>
            <p className="text-sm text-gray-400">Total Revenue</p>
            <p className="text-2xl font-bold text-white">₹{(stats.totalRevenue || 0).toLocaleString()}</p>
            <p className="text-xs text-green-400 mt-1">{stats.growthRate || '+0%'}</p>
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div>
            <p className="text-sm text-gray-400">Total Bookings</p>
            <p className="text-2xl font-bold text-white">{(stats.totalBookings || 0).toLocaleString()}</p>
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div>
            <p className="text-sm text-gray-400">Total Users</p>
            <p className="text-2xl font-bold text-white">{(stats.totalUsers || 0).toLocaleString()}</p>
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div>
            <p className="text-sm text-gray-400">Avg Order Value</p>
            <p className="text-2xl font-bold text-white">₹{Math.round(stats.avgOrderValue || 0).toLocaleString()}</p>
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div>
            <p className="text-sm text-gray-400">Conversion Rate</p>
            <p className="text-2xl font-bold text-white">{(stats.conversionRate || 0).toFixed(1)}%</p>
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div>
            <p className="text-sm text-gray-400">Growth Rate</p>
            <p className="text-2xl font-bold text-white">+{(stats.growthRate || 0).toFixed(1)}%</p>
          </div>
        </Card>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="bg-[#1a1a1a] border-gray-800 p-4 cursor-pointer hover:border-purple-600 transition-colors"
              onClick={() => setSelectedReport(report.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-lg ${report.bgColor}`}>
                  <report.icon className={`w-6 h-6 ${report.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{report.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{report.description}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-purple-400 hover:text-purple-300 p-0"
                  >
                    Generate Report →
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <Label className="text-gray-300">From Date</Label>
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-300">To Date</Label>
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-300">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-[180px] bg-[#2a2a2a] border-gray-700 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="bookings">Bookings</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-300">Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="w-[150px] bg-[#2a2a2a] border-gray-700 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={() => handleExport(exportFormat)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                labelStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8B5CF6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Service Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </Card>

        {/* User Growth */}
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="clients"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="freelancers"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: '#F59E0B', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Booking Stats */}
        <Card className="bg-[#1a1a1a] border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Booking Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="bookings" fill="#EC4899" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Recent Reports</h3>
        </div>
        <div className="p-4 space-y-3">
          {loading ? (
            <p className="text-gray-400 text-sm">Loading reports...</p>
          ) : (
            <p className="text-gray-500 text-sm">No recent reports generated.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
