'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Calendar, Clock, MapPin, DollarSign, User, Shield,
  MoreVertical, Eye, Edit, XCircle, CheckCircle, AlertTriangle,
  MessageSquare, FileText, TrendingUp, Filter, Download,
  ChevronLeft, ChevronRight, RefreshCw, Phone, Mail, Search, HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BookingDetailsModal } from '@/components/admin/BookingDetailsModal';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  CONFIRMED: 'bg-blue-500',
  IN_PROGRESS: 'bg-purple-500',
  COMPLETED: 'bg-green-500',
  CANCELLED: 'bg-gray-500',
  DISPUTED: 'bg-red-500',
  REFUNDED: 'bg-orange-500',
};

const statusIcons: Record<string, React.ElementType> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  IN_PROGRESS: TrendingUp,
  COMPLETED: CheckCircle,
  CANCELLED: XCircle,
  DISPUTED: AlertTriangle,
  REFUNDED: DollarSign,
};

export default function BookingManagementPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Stats state
  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    confirmed: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    disputed: 0,
    totalRevenue: 0,
    platformEarnings: 0,
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: debouncedSearch,
        status: statusFilter
      });
      const res = await fetch(`/api/admin/bookings?${params}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings);
        setTotalPages(data.totalPages);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch, statusFilter]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        await fetchBookings(); // Refresh list to get new stats and data
        // Update selectedBooking if it's open, so modal reflects new status immediately
        if (selectedBooking && selectedBooking.id === bookingId) {
          setSelectedBooking((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (e) { console.error(e); }
  };

  const handleExport = () => {
    // Define headers
    const headers = [
      'Booking ID', 'Service', 'Client', 'Freelancer', 'Status',
      'Total Price', 'Platform Fee', 'Scheduled At', 'Created At'
    ];

    // Convert bookings to CSV rows
    const rows = bookings.map(b => [
      b.id,
      `"${b.serviceTitle}"`,
      `"${b.clientName}"`,
      `"${b.freelancerName}"`,
      b.status,
      b.totalPrice,
      b.platformFee,
      b.scheduledAt,
      b.createdAt
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Booking Management</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Monitor and manage all platform bookings</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="text-gray-300 w-full sm:w-auto"
            onClick={handleExport}
            disabled={bookings.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Bookings</p>
              {loading ? <Skeleton className="h-8 w-16 bg-gray-800" /> : (
                <p className="text-2xl font-bold text-white">{stats.totalBookings}</p>
              )}
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              {loading ? <Skeleton className="h-8 w-24 bg-gray-800" /> : (
                <p className="text-2xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
              )}
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              {loading ? <Skeleton className="h-8 w-16 bg-gray-800" /> : (
                <p className="text-xl font-bold text-white">{stats.completed}</p>
              )}
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Upcoming</p>
              {loading ? <Skeleton className="h-8 w-16 bg-gray-800" /> : (
                <p className="text-xl font-bold text-white">{stats.confirmed}</p>
              )}
            </div>
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Ongoing</p>
              {loading ? <Skeleton className="h-8 w-16 bg-gray-800" /> : (
                <p className="text-xl font-bold text-white">{stats.inProgress}</p>
              )}
            </div>
            <TrendingUp className="w-6 h-6 text-purple-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Cancelled</p>
              {loading ? <Skeleton className="h-8 w-16 bg-gray-800" /> : (
                <p className="text-xl font-bold text-white">{stats.cancelled}</p>
              )}
            </div>
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by ID, service, client, or freelancer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#2a2a2a] border-gray-700 text-white"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="DISPUTED">Disputed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="text-gray-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      {/* Bookings Table */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr className="text-left">
                <th className="p-4 text-sm font-medium text-gray-400">Booking ID</th>
                <th className="p-4 text-sm font-medium text-gray-400">Service</th>
                <th className="p-4 text-sm font-medium text-gray-400">Client</th>
                <th className="p-4 text-sm font-medium text-gray-400">Freelancer</th>
                <th className="p-4 text-sm font-medium text-gray-400">Schedule</th>
                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="p-4 text-sm font-medium text-gray-400">Progress</th>
                <th className="p-4 text-sm font-medium text-gray-400">Amount</th>
                <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="p-4"><Skeleton className="h-4 w-20 bg-gray-800" /></td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-gray-800" />
                        <Skeleton className="h-3 w-24 bg-gray-800" />
                      </div>
                    </td>
                    <td className="p-4"><Skeleton className="h-4 w-24 bg-gray-800" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-24 bg-gray-800" /></td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24 bg-gray-800" />
                        <Skeleton className="h-3 w-16 bg-gray-800" />
                      </div>
                    </td>
                    <td className="p-4"><Skeleton className="h-6 w-20 rounded-full bg-gray-800" /></td>
                    <td className="p-4"><Skeleton className="h-2 w-20 bg-gray-800" /></td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16 bg-gray-800" />
                        <Skeleton className="h-3 w-12 bg-gray-800" />
                      </div>
                    </td>
                    <td className="p-4"><Skeleton className="h-8 w-8 rounded bg-gray-800" /></td>
                  </tr>
                ))
              ) : bookings.map((booking, index) => {
                const StatusIcon = statusIcons[booking.status] || HelpCircle;
                return (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors"
                  >
                    <td className="p-4">
                      <span className="text-white font-mono">{booking.id.substring(0, 8)}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white text-sm">{booking.serviceTitle}</p>
                        <p className="text-xs text-gray-400">{booking.serviceCategory}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-white text-sm">{booking.clientName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white text-sm">{booking.freelancerName}</p>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm text-white">{booking.scheduledAt}</p>
                        <p className="text-xs text-gray-400">{booking.duration} min</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${statusColors[booking.status] || 'bg-gray-600'} text-white`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="w-20">
                        <Progress value={booking.progress} className="h-2" />
                        <p className="text-xs text-gray-400 mt-1">{booking.progress}%</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-white">₹{booking.totalPrice}</p>
                        <p className="text-xs text-purple-400">Fee: ₹{booking.platformFee}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-gray-800">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedBooking(booking);
                              setDetailsModalOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                );
              })}
              {!loading && bookings.length === 0 && (
                <tr><td colSpan={9} className="p-4 text-center text-gray-400">No bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-gray-400">Page {currentPage} of {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedBooking(null);
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
