'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { 
  CalendarIcon, 
  ClockIcon, 
  IndianRupeeIcon, 
  Search, 
  Filter as FilterIcon, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  MessageSquare, 
  FileText, 
  Star, 
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';

// Types
type JobStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';
type ApplicationStatus = 'applied' | 'interviewing' | 'hired' | 'rejected';
type TransactionStatus = 'completed' | 'pending' | 'cancelled' | 'failed';

interface Job {
  id: string;
  title: string;
  category?: string;
  date: string;
  time: string;
  status: JobStatus;
  payment: number;
  location: string;
  description?: string;
  skills?: string[];
  duration?: string;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Expert';
}

interface Application {
  id: string;
  jobTitle: string;
  appliedDate: string;
  status: ApplicationStatus;
  clientName: string;
  budget: { min: number; max: number };
  progress: number;
  clientImage?: string;
  location: string;
  postedDate: string;
  description: string;
}

interface Transaction {
  id: string;
  amount: number;
  status: TransactionStatus;
  date: string;
  jobTitle: string;
  type?: 'credit' | 'debit';
  paymentMethod?: string;
}

interface EarningsData {
  totalEarnings: number;
  pendingPayouts: number;
  completedJobs: number;
  averageRating: number;
  recentTransactions: Transaction[];
  earningsByMonth: { month: string; earnings: number }[];
}

// Mock data for demonstration
const mockUpcomingJobs: Job[] = [
  {
    id: '1',
    title: 'House Cleaning',
    category: 'Cleaning',
    date: '2024-06-25',
    time: '14:00',
    status: 'confirmed',
    payment: 1500,
    location: 'Anna Nagar, Chennai',
    description: 'Deep cleaning of 2BHK apartment including kitchen and bathroom. Need someone with attention to detail and own cleaning supplies.',
    skills: ['House Cleaning', 'Deep Cleaning', 'Organization'],
    duration: '3-4 hours',
    experienceLevel: 'Intermediate'
  },
  {
    id: '2',
    title: 'Garden Maintenance',
    category: 'Gardening',
    date: '2024-06-26',
    time: '10:00',
    status: 'pending',
    payment: 800,
    location: 'T Nagar, Chennai',
    description: 'Weekly garden maintenance including mowing, pruning, and weeding. Must have experience with both manual and power tools.',
    skills: ['Lawn Mowing', 'Pruning', 'Landscaping'],
    duration: '2-3 hours',
    experienceLevel: 'Beginner'
  },
  {
    id: '3',
    title: 'AC Service Technician Needed',
    category: 'Appliance Repair',
    date: '2024-06-27',
    time: '11:30',
    status: 'confirmed',
    payment: 1200,
    location: 'Adyar, Chennai',
    description: 'Annual maintenance service for 2 split AC units. Must be certified and provide service report.',
    skills: ['AC Repair', 'Maintenance', 'HVAC'],
    duration: '2 hours',
    experienceLevel: 'Expert'
  },
  {
    id: '4',
    title: 'Interior Painting Work',
    category: 'Painting',
    date: '2024-06-28',
    time: '09:00',
    status: 'completed',
    payment: 3500,
    location: 'Velachery, Chennai',
    description: 'Interior painting for living room (400 sq ft). Must provide all materials and clean up after completion.',
    skills: ['Wall Painting', 'Color Mixing', 'Surface Prep'],
    duration: '6-8 hours',
    experienceLevel: 'Intermediate'
  }
];

const mockApplications: Application[] = [
  {
    id: '1',
    jobTitle: 'Office Cleaning',
    appliedDate: '2024-06-20',
    status: 'interviewing',
    clientName: 'TechCorp Ltd',
    budget: { min: 1000, max: 2000 },
    progress: 66,
    clientImage: '/avatars/company1.jpg',
    location: 'Tidel Park, Chennai',
    postedDate: '2024-06-18',
    description: 'Daily cleaning for 2000 sq ft office space. Must be available weekdays after 7 PM.'
  },
  {
    id: '2',
    jobTitle: 'Home Gardening',
    appliedDate: '2024-06-19',
    status: 'applied',
    clientName: 'Meera R',
    budget: { min: 500, max: 1000 },
    progress: 33,
    clientImage: '/avatars/avatar5.jpg',
    location: 'Besant Nagar, Chennai',
    postedDate: '2024-06-17',
    description: 'Monthly maintenance for small garden with native plants. Knowledge of organic gardening preferred.'
  },
  {
    id: '3',
    jobTitle: 'Plumbing Repair',
    appliedDate: '2024-06-21',
    status: 'hired',
    clientName: 'Rahul K',
    budget: { min: 800, max: 1500 },
    progress: 100,
    clientImage: '/avatars/avatar6.jpg',
    location: 'Nungambakkam, Chennai',
    postedDate: '2024-06-20',
    description: 'Fix leaking pipes in kitchen and bathroom. Immediate attention required.'
  }
];

const mockEarnings: EarningsData = {
  totalEarnings: 45600,
  pendingPayouts: 7800,
  completedJobs: 24,
  averageRating: 4.7,
  recentTransactions: [
    {
      id: '1',
      amount: 2500,
      status: 'completed',
      date: '2024-06-20',
      jobTitle: 'Office Deep Cleaning',
      type: 'credit',
      paymentMethod: 'UPI'
    },
    {
      id: '2',
      amount: 1800,
      status: 'pending',
      date: '2024-06-21',
      jobTitle: 'Garden Maintenance',
      type: 'credit',
      paymentMethod: 'Cash'
    },
    {
      id: '3',
      amount: 1200,
      status: 'completed',
      date: '2024-06-19',
      jobTitle: 'AC Service',
      type: 'credit',
      paymentMethod: 'UPI'
    },
    {
      id: '4',
      amount: 500,
      status: 'completed',
      date: '2024-06-18',
      jobTitle: 'Plumbing Repair',
      type: 'credit',
      paymentMethod: 'Cash'
    }
  ],
  earningsByMonth: [
    { month: 'Jan', earnings: 12000 },
    { month: 'Feb', earnings: 9800 },
    { month: 'Mar', earnings: 14200 },
    { month: 'Apr', earnings: 15600 },
    { month: 'May', earnings: 18900 },
    { month: 'Jun', earnings: 21300 },
  ]
};

// Status colors mapping
const statusColors = {
  // Job statuses
  confirmed: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-100' },
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-100' },
  completed: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-100' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-100' },
  
  // Application statuses
  applied: { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-100' },
  interviewing: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-100' },
  hired: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-100' },
  rejected: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-100' },
  
  // Transaction statuses
  failed: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-100' }
} as const;

type StatusType = keyof typeof statusColors;

const getStatusStyles = (status: StatusType) => {
  return statusColors[status] || statusColors.pending;
};

export function JobDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange>();
  
  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filter and search functions
  const filteredJobs = useMemo(() => {
    return mockUpcomingJobs.filter(job => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        job.title.toLowerCase().includes(searchLower) ||
        (job.category && job.category.toLowerCase().includes(searchLower)) ||
        (job.location && job.location.toLowerCase().includes(searchLower)) ||
        (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchLower))) ||
        (job.description && job.description.toLowerCase().includes(searchLower));

      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      
      const jobDate = new Date(job.date);
      const matchesDate = !dateRange?.from || (jobDate >= dateRange.from && 
        (!dateRange?.to || jobDate <= new Date(dateRange.to.getTime() + 24 * 60 * 60 * 1000)));
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [searchQuery, statusFilter, dateRange]);

  const filteredApplications = useMemo(() => {
    return mockApplications.filter(app => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        app.jobTitle.toLowerCase().includes(searchLower) ||
        app.location.toLowerCase().includes(searchLower) ||
        (app.description && app.description.toLowerCase().includes(searchLower));

      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Pagination
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredJobs, currentPage]);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApplications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApplications, currentPage]);

  const totalPages = (tab: string) => {
    const totalItems = tab === 'upcoming' ? filteredJobs.length : filteredApplications.length;
    return Math.ceil(totalItems / itemsPerPage);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = (tab: string) => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages(tab)));
  };

  // Reset pagination when filters change
  const handleFilterChange = (newFilter: string) => {
    setStatusFilter(newFilter);
    setCurrentPage(1);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Get status options based on active tab
  const getStatusOptions = () => {
    if (activeTab === 'upcoming') {
      return [
        { value: 'all', label: 'All Status' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ];
    } else if (activeTab === 'applications') {
      return [
        { value: 'all', label: 'All Applications' },
        { value: 'applied', label: 'Applied' },
        { value: 'interviewing', label: 'Interviewing' },
        { value: 'hired', label: 'Hired' },
        { value: 'rejected', label: 'Rejected' }
      ];
    }
    return [];
  };

  // Render star rating
  const renderRating = (rating: number) => {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#111111]">
        {[1, 2, 3, 4, 5].map(star => (
          <Star 
            key={star} 
            className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Tabs defaultValue="upcoming" className="w-full text-foreground bg-[#111111] min-h-screen" onValueChange={(value) => {
      setActiveTab(value);
      setCurrentPage(1);
    }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <TabsList className="grid w-full sm:w-auto grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>
        
        {activeTab !== 'earnings' && (
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs..."
                className="pl-10 w-full bg-background text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <FilterIcon className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {getStatusOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')}
                        </>
                      ) : (
                        format(dateRange.from, 'MMM dd, yyyy')
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={handleDateSelect}
                    numberOfMonths={2}
                    className="rounded-md border"
                    initialFocus
                    defaultMonth={dateRange?.from}
                    disabled={{ before: new Date() }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="text-foreground"
        >
          <TabsContent value="upcoming" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              {mockUpcomingJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-purple-500/30 transition-all duration-300 shadow-2xl shadow-black/50"
                  >
                    <div className="space-y-5">
                      {/* Job Header */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors duration-300">
                            {job.title}
                          </h3>
                          <div className={getStatusStyles(job.status).bg + ' ' + getStatusStyles(job.status).text + ' text-xs font-medium px-3 py-1 rounded-full border ' + getStatusStyles(job.status).border + ' w-fit'}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </div>
                        </div>
                        
                        {/* Job Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          {job.category && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/30 text-purple-400 border border-purple-800/50">
                              {job.category}
                            </span>
                          )}
                          {job.experienceLevel && (
                            <span className="text-white/60">
                              {job.experienceLevel}
                            </span>
                          )}
                          {job.duration && (
                            <span className="flex items-center text-white/60">
                              <Clock className="w-3.5 h-3.5 mr-1" />
                              {job.duration}
                            </span>
                          )}
                        </div>
                        
                        {/* Skills */}
                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {job.skills.slice(0, 3).map((skill, i) => (
                              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white/5 text-white/80 border border-white/10">
                                {skill}
                              </span>
                            ))}
                            {job.skills.length > 3 && (
                              <span className="text-xs text-white/40">
                                +{job.skills.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {job.description && (
                        <p className="text-sm text-white/80 leading-relaxed">{job.description}</p>
                      )}

                      {/* Job Details */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-white/60">
                          <CalendarIcon className="w-4 h-4 text-purple-400" />
                          <span>{format(new Date(job.date), 'MMM d, yyyy')} • {job.time}</span>
                        </div>
                        {job.location && (
                          <div className="flex items-center gap-2 text-white/60">
                            <MapPin className="w-4 h-4 text-purple-400" />
                            <span>{job.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-white/60">
                          <IndianRupeeIcon className="w-4 h-4 text-purple-400" />
                          <span className="font-medium text-white/80">₹{job.payment}</span>
                          <span className="text-sm">/job</span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full bg-black/30 border-gray-700 hover:bg-gray-800/50 hover:border-purple-500/50 text-white/90 transition-colors"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              {mockApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-purple-500/30 transition-all duration-300 shadow-2xl shadow-black/50"
                  >
                    <div className="space-y-5">
                      {/* Job Header */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors duration-300">
                            {application.jobTitle}
                          </h3>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            application.status === 'hired' ? 'bg-green-900/30 text-green-400 border border-green-800/50' :
                            application.status === 'interviewing' ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' :
                            application.status === 'rejected' ? 'bg-red-900/30 text-red-400 border border-red-800/50' :
                            'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50'
                          }`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </div>
                        </div>
                        
                        {/* Application Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="flex items-center text-white/60">
                            <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                            Applied on {format(new Date(application.appliedDate), 'MMM d, yyyy')}
                          </span>
                          {application.location && (
                            <span className="flex items-center text-white/60">
                              <MapPin className="w-3.5 h-3.5 mr-1" />
                              {application.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="pt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/60">Application Progress</span>
                          <span className="font-medium text-purple-400">{application.progress}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${application.progress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>

                      {/* Application Details */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-white/60">
                          <CalendarIcon className="w-4 h-4 text-purple-400" />
                          <span>Applied on {application.appliedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                          <MapPin className="w-4 h-4 text-purple-400" />
                          <span>{application.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                          <IndianRupeeIcon className="w-4 h-4 text-purple-400" />
                          <span className="font-medium text-white/80">
                            ₹{application.budget.min} - ₹{application.budget.max}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30 text-white/90"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message Client
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30 text-white/90"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
              
              {mockApplications.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <p className="text-white/60 mb-4">No applications found</p>
                    <Button 
                      variant="outline" 
                      className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30 text-white/90"
                    >
                      Browse Available Jobs
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="mt-0">
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-semibold text-green-600 mt-1">₹{mockEarnings.totalEarnings}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Pending Payouts</p>
                  <p className="text-2xl font-semibold text-blue-600 mt-1">₹{mockEarnings.pendingPayouts}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {mockEarnings.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{transaction.jobTitle}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{transaction.amount}</p>
                        <div className={getStatusStyles(transaction.status).bg + ' ' + getStatusStyles(transaction.status).text + ' text-xs font-medium px-2.5 py-0.5 rounded-full border ' + getStatusStyles(transaction.status).border}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </motion.div>
      </AnimatePresence>
    </Tabs>
  );
} 