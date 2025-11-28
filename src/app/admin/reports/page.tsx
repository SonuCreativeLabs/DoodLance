'use client';

import { useState } from 'react';
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

// Mock data for reports
const revenueData = [
  { month: 'Jan', revenue: 125000, bookings: 145, users: 23 },
  { month: 'Feb', revenue: 145000, bookings: 178, users: 45 },
  { month: 'Mar', revenue: 178000, bookings: 198, users: 67 },
  { month: 'Apr', revenue: 156000, bookings: 167, users: 34 },
  { month: 'May', revenue: 189000, bookings: 212, users: 56 },
  { month: 'Jun', revenue: 198000, bookings: 234, users: 78 },
];

const categoryData = [
  { name: 'Net Bowler', value: 35, color: '#8B5CF6' },
  { name: 'Coach', value: 25, color: '#EC4899' },
  { name: 'Match Player', value: 20, color: '#10B981' },
  { name: 'Physio', value: 10, color: '#F59E0B' },
  { name: 'Others', value: 10, color: '#6B7280' },
];

const userGrowthData = [
  { date: '1', clients: 120, freelancers: 89 },
  { date: '5', clients: 145, freelancers: 98 },
  { date: '10', clients: 167, freelancers: 112 },
  { date: '15', clients: 189, freelancers: 123 },
  { date: '20', clients: 212, freelancers: 145 },
  { date: '25', clients: 234, freelancers: 156 },
  { date: '30', clients: 256, freelancers: 167 },
];

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

  const handleExport = (format: string) => {
    console.log(`Exporting ${selectedReport} report as ${format}`);
    // In production, this would generate and download the report
  };

  const stats = {
    totalRevenue: '₹8,27,500',
    totalBookings: '1,456',
    totalUsers: '523',
    avgOrderValue: '₹2,500',
    conversionRate: '23.5%',
    growthRate: '+15.3%',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400 mt-1">Generate comprehensive reports and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-gray-300">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
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
            <p className="text-2xl font-bold text-white">{stats.totalRevenue}</p>
            <p className="text-xs text-green-400 mt-1">{stats.growthRate}</p>
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div>
            <p className="text-sm text-gray-400">Total Bookings</p>
            <p className="text-2xl font-bold text-white">{stats.totalBookings}</p>
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div>
            <p className="text-sm text-gray-400">Total Users</p>
            <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div>
            <p className="text-sm text-gray-400">Avg Order Value</p>
            <p className="text-2xl font-bold text-white">{stats.avgOrderValue}</p>
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div>
            <p className="text-sm text-gray-400">Conversion Rate</p>
            <p className="text-2xl font-bold text-white">{stats.conversionRate}</p>
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div>
            <p className="text-sm text-gray-400">Growth Rate</p>
            <p className="text-2xl font-bold text-white">{stats.growthRate}</p>
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
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
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
          {[
            { name: 'Monthly Revenue Report - March 2024', date: '2024-03-25', format: 'PDF', size: '2.4 MB' },
            { name: 'User Analytics Q1 2024', date: '2024-03-24', format: 'Excel', size: '1.8 MB' },
            { name: 'Booking Performance Report', date: '2024-03-23', format: 'PDF', size: '3.2 MB' },
            { name: 'Platform Metrics Dashboard', date: '2024-03-22', format: 'CSV', size: '456 KB' },
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white text-sm font-medium">{report.name}</p>
                  <p className="text-xs text-gray-400">{report.date} • {report.format} • {report.size}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-purple-400">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
