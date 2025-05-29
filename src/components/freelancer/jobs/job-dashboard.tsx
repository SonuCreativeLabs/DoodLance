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
  X,
  AlertCircle
} from 'lucide-react';

// Status Types
type JobStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';
type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
type TransactionStatus = 'pending' | 'failed' | 'completed';

type StatusType = JobStatus | ApplicationStatus | TransactionStatus;

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

interface Proposal {
  coverLetter: string;
  proposedRate: number;
  estimatedDays: number;
  skills: string[];
  attachments: string[];
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
  clientId: string;
  proposal: Proposal;
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

// Your skills that will be matched with jobs
const mySkills = [
  'House Cleaning', 'Deep Cleaning', 'Organization', 'AC Repair', 'Maintenance',
  'Wall Painting', 'Color Mixing', 'Office Maintenance', 'Sanitization',
  'Organic Gardening', 'Landscape Design', 'Plant Care',
  'React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'Git',
  'Cricket Coaching', 'Batting Techniques', 'Bowling Techniques', 'Team Management'
];

// Function to find matching skills between your skills and job requirements
const getMatchingSkills = (jobSkills: string[] = []) => {
  return mySkills.filter(skill => 
    jobSkills.some(jobSkill => 
      jobSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(jobSkill.toLowerCase())
    )
  );
};

// Mock data for demonstration
const mockUpcomingJobs: Job[] = [
  {
    id: 'cricket-1',
    title: 'Cricket Coach for U-16 Team',
    category: 'Sports Coaching',
    date: '2024-07-10',
    time: '16:00',
    status: 'pending',
    payment: 2500,
    location: 'Mylapore, Chennai',
    description: 'Looking for an experienced cricket coach for our U-16 academy team. Must have prior coaching experience and knowledge of modern cricket techniques. Will be responsible for conducting training sessions 3 times a week.',
    skills: ['Cricket Coaching', 'Batting Techniques', 'Bowling Techniques', 'Fielding Drills', 'Team Management'],
    duration: '2 hours per session',
    experienceLevel: 'Expert'
  },
  {
    id: 'dev-1',
    title: 'Full Stack Web Developer',
    category: 'Web Development',
    date: '2024-07-05',
    time: '10:00',
    status: 'confirmed',
    payment: 15000,
    location: 'Remote',
    description: 'Need an experienced Full Stack Developer to build and maintain web applications. Must be proficient in React, Node.js, and have experience with databases. This is a contract position with potential for extension.',
    skills: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'JavaScript', 'TypeScript', 'Git'],
    duration: '3 months',
    experienceLevel: 'Expert'
  },
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
  },
  {
    id: 'cricket-bowling-1',
    title: 'Bowling Coach for Cricket Academy',
    category: 'Sports Coaching',
    date: '2024-07-15',
    time: '17:00',
    status: 'cancelled',
    payment: 2000,
    location: 'Nungambakkam, Chennai',
    description: 'Required experienced bowling coach for our cricket academy. Must specialize in fast bowling techniques and have experience working with young cricketers.',
    skills: ['Bowling Techniques', 'Pace Bowling', 'Swing Bowling', 'Coaching'],
    duration: '2 hours',
    experienceLevel: 'Expert'
  }
];

const mockApplications = [
  {
    id: 'cricket-proposal',
    jobTitle: 'Cricket Coach for School Team',
    appliedDate: '2024-06-28',
    status: 'pending',
    clientName: 'Chennai Public School',
    budget: { min: 2000, max: 3000 },
    progress: 0,
    clientImage: '/avatars/school.jpg',
    location: 'Nungambakkam, Chennai',
    postedDate: '2024-06-25',
    description: 'Looking for a part-time cricket coach for our school team. Must have experience coaching children aged 10-14.',
    clientId: 'school123',
    proposal: {
      coverLetter: 'I have 5+ years of experience coaching young cricketers and have helped teams win district-level tournaments. I focus on both technical skills and team building.',
      proposedRate: 2500,
      estimatedDays: 30,
      skills: ['Cricket Coaching', 'Batting Techniques', 'Bowling Techniques', 'Team Management', 'Youth Development'],
      attachments: ['coaching_certificate.pdf', 'resume.pdf']
    }
  },
  {
    id: 'dev-proposal',
    jobTitle: 'Frontend Developer for E-commerce Site',
    appliedDate: '2024-06-29',
    status: 'pending',
    clientName: 'TechStart Inc',
    budget: { min: 15000, max: 25000 },
    progress: 0,
    clientImage: '/avatars/company2.jpg',
    location: 'Remote',
    postedDate: '2024-06-26',
    description: 'Need a skilled frontend developer to build a responsive e-commerce site using React and TypeScript.',
    clientId: 'techstart456',
    proposal: {
      coverLetter: 'I am a full-stack developer with 3+ years of experience in React and TypeScript. I have built multiple e-commerce platforms and can ensure a smooth, responsive user experience.',
      proposedRate: 20000,
      estimatedDays: 45,
      skills: ['React', 'TypeScript', 'Redux', 'Responsive Design', 'UI/UX'],
      attachments: ['portfolio.pdf', 'resume_dev.pdf']
    }
  },
  {
    id: '1',
    jobTitle: 'Office Cleaning',
    appliedDate: '2024-06-20',
    status: 'pending',
    clientName: 'TechCorp Ltd',
    budget: { min: 1800, max: 2000 },
    progress: 0,
    clientImage: '/avatars/company1.jpg',
    location: 'Tidel Park, Chennai',
    postedDate: '2024-06-18',
    description: 'Daily cleaning for 2000 sq ft office space',
    clientId: 'client1',
    proposal: {
      coverLetter: 'I have 5+ years of experience in commercial cleaning and can ensure your office space is spotless. I have all necessary equipment and can work during your preferred hours.',
      proposedRate: 2000,
      estimatedDays: 3,
      skills: ['Deep Cleaning', 'Office Maintenance', 'Sanitization'],
      attachments: ['Resume.pdf', 'Certification.pdf']
    }
  },
  {
    id: '2',
    jobTitle: 'Home Gardening',
    appliedDate: '2024-06-19',
    status: 'accepted',
    clientName: 'Meera R',
    budget: { min: 800, max: 1000 },
    progress: 0,
    clientImage: '/avatars/avatar5.jpg',
    location: 'Besant Nagar, Chennai',
    postedDate: '2024-06-17',
    description: 'Monthly maintenance for small garden with native plants',
    clientId: 'client2',
    proposal: {
      coverLetter: 'As a certified horticulturist with expertise in native plants, I can help maintain your garden with organic methods. I specialize in sustainable gardening practices.',
      proposedRate: 900,
      estimatedDays: 1,
      skills: ['Organic Gardening', 'Landscape Design', 'Plant Care'],
      attachments: ['Portfolio.pdf', 'Certification.pdf']
    }
  },
  {
    id: '3',
    jobTitle: 'Plumbing Repair',
    appliedDate: '2024-06-21',
    status: 'rejected',
    clientName: 'Rahul K',
    budget: { min: 1200, max: 1800 },
    progress: 0,
    clientImage: '/avatars/avatar6.jpg',
    location: 'Nungambakkam, Chennai',
    postedDate: '2024-06-20',
    description: 'Fix leaking pipes in kitchen and bathroom',
    clientId: 'client3',
    proposal: {
      coverLetter: 'Licensed plumber with 8 years of experience in residential repairs. I can diagnose and fix your leaking pipes efficiently with minimal disruption.',
      proposedRate: 1500,
      estimatedDays: 1,
      skills: ['Pipe Repair', 'Leak Detection', 'Bathroom Plumbing'],
      attachments: ['License.pdf', 'References.pdf']
    }
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

// Function to format time remaining
const formatTimeRemaining = (dateString: string) => {
  const now = new Date();
  const jobDate = new Date(dateString);
  const diffMs = jobDate.getTime() - now.getTime();
  
  if (diffMs <= 0) return '00:00:00';
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Status colors mapping with modern design
const statusColors = {
  // Job status colors
  pending: { 
    bg: 'bg-amber-500/10', 
    text: 'text-amber-400', 
    border: 'border-amber-500/20',
    shadow: 'shadow-amber-500/10'
  },
  confirmed: { 
    bg: 'bg-blue-500/10', 
    text: 'text-blue-400', 
    border: 'border-blue-500/20',
    shadow: 'shadow-blue-500/10'
  },
  completed: { 
    bg: 'bg-emerald-500/10', 
    text: 'text-emerald-400', 
    border: 'border-emerald-500/20',
    shadow: 'shadow-emerald-500/10'
  },
  cancelled: { 
    bg: 'bg-rose-500/10', 
    text: 'text-rose-400', 
    border: 'border-rose-500/20',
    shadow: 'shadow-rose-500/10'
  },
  // Application status colors
  accepted: { 
    bg: 'bg-emerald-500/10', 
    text: 'text-emerald-400', 
    border: 'border-emerald-500/20',
    shadow: 'shadow-emerald-500/10'
  },
  rejected: { 
    bg: 'bg-rose-500/10', 
    text: 'text-rose-400', 
    border: 'border-rose-500/20',
    shadow: 'shadow-rose-500/10'
  },
  // Transaction status colors
  paid: { 
    bg: 'bg-emerald-500/10', 
    text: 'text-emerald-400', 
    border: 'border-emerald-500/20',
    shadow: 'shadow-emerald-500/10'
  },
  failed: { 
    bg: 'bg-rose-500/10', 
    text: 'text-rose-400', 
    border: 'border-rose-500/20',
    shadow: 'shadow-rose-500/10'
  },
  pending_payment: { 
    bg: 'bg-amber-500/10', 
    text: 'text-amber-400', 
    border: 'border-amber-500/20',
    shadow: 'shadow-amber-500/10'
  }
};



const getStatusStyles = (status: StatusType) => {
  // @ts-ignore - We know the status is valid
  return statusColors[status] || statusColors.pending;
};

export function JobDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [statusFilter, setStatusFilter] = useState(activeTab === 'upcoming' ? 'upcoming' : 'pending');
  const [dateRange, setDateRange] = useState<DateRange>();
  
  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filter jobs and applications based on search and status
  const filteredJobs = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return mockUpcomingJobs.filter(job => {
      const matchesSearch = searchQuery === '' ||
        job.title.toLowerCase().includes(searchLower) ||
        (job.category && job.category.toLowerCase().includes(searchLower)) ||
        (job.location && job.location.toLowerCase().includes(searchLower)) ||
        (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchLower)));

      // Map UI status filter to data status values
      let statusMatches = false;
      if (statusFilter === 'all') {
        statusMatches = true;
      } else if (statusFilter === 'upcoming') {
        // Show both pending and confirmed jobs as 'Upcoming'
        statusMatches = job.status === 'pending' || job.status === 'confirmed';
      } else if (statusFilter === 'completed') {
        statusMatches = job.status === 'completed';
      } else if (statusFilter === 'cancelled') {
        statusMatches = job.status === 'cancelled';
      }
      
      const jobDate = new Date(job.date);
      const matchesDate = !dateRange?.from || (jobDate >= dateRange.from && 
        (!dateRange?.to || jobDate <= new Date(dateRange.to.getTime() + 24 * 60 * 60 * 1000)));
      
      return matchesSearch && statusMatches && matchesDate;
    });
  }, [searchQuery, statusFilter, dateRange]);

  const filteredApplications = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    let filtered = mockApplications.filter(app => {
      const matchesSearch = searchQuery === '' ||
        app.jobTitle.toLowerCase().includes(searchLower) ||
        app.location.toLowerCase().includes(searchLower) ||
        (app.description && app.description.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;

      // Handle status filtering based on active tab
      if (activeTab === 'upcoming') {
        // For jobs tab
        if (statusFilter === 'upcoming') {
          return app.status === 'pending' || app.status === 'confirmed';
        }
        return app.status === statusFilter;
      } else {
        // For applications tab
        if (statusFilter === 'upcoming') {
          return app.status === 'pending' || app.status === 'accepted';
        }
        return app.status === statusFilter;
      }
    });

    return filtered;
  }, [searchQuery, statusFilter, activeTab]);

  // Paginate filtered jobs and applications
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredJobs, currentPage]);

  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApplications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApplications, currentPage]);

  // Calculate total pages
  const totalPages = (tab: string) => {
    const totalItems = tab === 'upcoming' ? mockUpcomingJobs.length : mockApplications.length;
    return Math.ceil(totalItems / itemsPerPage);
  };

  // Handle pagination
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = (tab: string) => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages(tab)));
  };

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Status filter options
  const statusOptions = useMemo(() => {
    if (activeTab === 'upcoming') {
      return [
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ] as const;
    } else if (activeTab === 'applications') {
      return [
        { value: 'pending', label: 'Pending' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'rejected', label: 'Rejected' }
      ] as const;
    }
    return [] as const;
  }, [activeTab]);

  const selectedStatus = statusOptions.find((option: { value: string }) => option.value === statusFilter) || statusOptions[0];

  // Handle filter change
  const handleFilterChange = (newFilter: string) => {
    setStatusFilter(newFilter);
    setCurrentPage(1);
  };

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

  const onViewDetails = (application: Application) => {
    console.log('View details of application:', application);
  };

  const onMessageClient = (clientId: string) => {
    console.log('Message client with ID:', clientId);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
    setSearchQuery('');
    // Set default status based on the selected tab
    setStatusFilter(value === 'upcoming' ? 'upcoming' : 'pending');
  };

  return (
    <Tabs defaultValue="upcoming" className="w-full text-foreground bg-[#111111] min-h-screen pb-24" onValueChange={handleTabChange}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pt-6 px-6 sm:px-8 gap-4">
        <TabsList className="grid w-full sm:w-auto grid-cols-2 h-10">
          <TabsTrigger value="upcoming">My Jobs</TabsTrigger>
          <TabsTrigger value="applications">My Proposals</TabsTrigger>
        </TabsList>
        
        {activeTab !== 'earnings' && (
          <div className={`flex items-center w-full gap-3 ${!showSearch ? '-ml-2' : ''}`}>
            <div className={`transition-all duration-300 ease-in-out ${showSearch ? 'flex-1' : 'w-10'}`}>
              {!showSearch && <div className="w-2"></div>}
              {showSearch ? (
                <div className="relative w-full flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search jobs..."
                    className="pl-10 pr-10 w-full bg-background text-foreground h-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button
                    className="absolute right-2 h-8 w-8 p-0 text-gray-500 hover:text-foreground flex items-center justify-center"
                    onClick={(e) => {
                      e.preventDefault();
                      setSearchQuery('');
                      setShowSearch(false);
                    }}
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Cancel search</span>
                  </button>
                </div>
              ) : (
                <button
                  className="h-10 w-10 p-0 text-muted-foreground hover:text-foreground flex items-center justify-center"
                  onClick={() => setShowSearch(true)}
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </button>
              )}
            </div>
            {!showSearch && (
              <div className="flex items-center gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      statusFilter === option.value
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-gray-800/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
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
                    className="p-6 rounded-2xl bg-white/5 border-white/10 hover:border-purple-500/30 backdrop-blur-xl border-gray-800 hover:border-purple-500/30 transition-all duration-300 shadow-2xl shadow-black/50"
                  >
                    <div className="space-y-5">
                      {/* Job Header */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors duration-300">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`${getStatusStyles(job.status === 'confirmed' ? 'pending' : job.status).bg} ${getStatusStyles(job.status === 'confirmed' ? 'pending' : job.status).text} text-xs font-medium px-3 py-1.5 rounded-full border ${getStatusStyles(job.status === 'confirmed' ? 'pending' : job.status).border} ${getStatusStyles(job.status === 'confirmed' ? 'pending' : job.status).shadow} backdrop-blur-sm`}>
                                {job.status === 'pending' || job.status === 'confirmed' ? 'Upcoming' : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                              </div>
                              {(job.status === 'pending' || job.status === 'confirmed') && (
                                <div className="text-xs font-medium bg-gray-800/50 text-gray-300 px-2.5 py-1.5 rounded-full border border-gray-700/50 backdrop-blur-sm flex items-center gap-1.5">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="font-mono">{formatTimeRemaining(`${job.date}T${job.time}`)}</span>
                                </div>
                              )}
                            </div>
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
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-white/60">Skills:</span>
                            <span className="text-xs text-white/40">
                              {getMatchingSkills(job.skills).length} of {job.skills?.length || 0} match
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {job.skills?.slice(0, 6).map((skill, i) => {
                              const isMatching = getMatchingSkills(job.skills).includes(skill);
                              return (
                                <span 
                                  key={i} 
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${
                                    isMatching 
                                      ? 'bg-green-900/30 text-green-400 border border-green-800/50' 
                                      : 'bg-white/5 text-white/60 border border-white/10'
                                  }`}
                                >
                                  {skill}
                                </span>
                              );
                            })}
                            {job.skills && job.skills.length > 6 && (
                              <span className="text-xs text-white/40 self-center">
                                +{job.skills.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
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
            <div className="grid gap-6">
              {mockApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 backdrop-blur-xl border-gray-800 hover:border-purple-500/30 transition-all duration-300 shadow-2xl shadow-black/50"
                  >
                    <div className="space-y-5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 border border-white/10">
                            <span className="text-sm font-medium">
                              {application.clientName ? application.clientName.charAt(0).toUpperCase() : 'C'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors duration-300">
                              {application.jobTitle}
                            </h3>
                            <p className="text-sm text-white/60">
                              {application.clientName || 'Client'}
                            </p>
                          </div>
                        </div>
                        <div className={`${getStatusStyles(application.status as ApplicationStatus).bg} ${getStatusStyles(application.status as ApplicationStatus).text} text-xs font-medium px-3 py-1 rounded-full border ${getStatusStyles(application.status as ApplicationStatus).border} w-fit`}>
                          {application.status === 'accepted' ? 'Accepted' : 
                           application.status === 'rejected' ? 'Rejected' : 'Pending'}
                        </div>
                      </div>
                      
                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center text-white/60">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-purple-400" />
                          {application.location}
                        </div>
                        <div className="text-white/30">•</div>
                        <div className="text-white/60">
                          Applied on {format(new Date(application.appliedDate), 'MMM d, yyyy')}
                        </div>
                        <div className="text-white/30">•</div>
                        <div className="text-white/60">
                          Posted {format(new Date(application.postedDate), 'MMM d, yyyy')}
                        </div>
                      </div>

                        {/* Proposal Details */}
                        <div className="space-y-3">
                          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <h4 className="text-sm font-medium text-white/90 mb-2">Your Proposal</h4>
                            <p className="text-sm text-white/80 mb-3">{application.proposal.coverLetter}</p>
                            
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="bg-white/5 p-2 rounded">
                                <p className="text-white/60 text-xs">Proposed Rate</p>
                                <p className="text-white/90 font-medium">₹{application.proposal.proposedRate.toLocaleString()}</p>
                              </div>
                              <div className="bg-white/5 p-2 rounded">
                                <p className="text-white/60 text-xs">Estimated Days</p>
                                <p className="text-white/90 font-medium">{application.proposal.estimatedDays} day{application.proposal.estimatedDays > 1 ? 's' : ''}</p>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              <p className="text-xs text-white/60 mb-1">Skills</p>
                              <div className="flex flex-wrap gap-2">
                                {application.proposal.skills.map((skill, i) => (
                                  <span key={i} className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            {application.proposal.attachments && application.proposal.attachments.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs text-white/60 mb-1">Attachments</p>
                                <div className="space-y-1">
                                  {application.proposal.attachments.map((file, i) => (
                                    <div key={i} className="flex items-center text-xs text-purple-400 hover:text-purple-300 cursor-pointer">
                                      <FileText className="w-3 h-3 mr-1" />
                                      {file}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Budget */}
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center text-white/80">
                            <IndianRupeeIcon className="w-4 h-4 mr-1 text-purple-400" />
                            <span className="font-medium">
                              ₹{application.budget.min.toLocaleString()}
                              {application.budget.max > application.budget.min ? ` - ₹${application.budget.max.toLocaleString()}` : ''}
                            </span>
                            <span className="ml-1 text-white/60">/job</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-white/80 leading-relaxed">
                          {application.description}
                        </p>

                      {/* Action Buttons */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="grid grid-cols-2 gap-3 w-full">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-10 w-full px-4 py-2 text-sm font-medium bg-black/30 border border-gray-700 hover:bg-gray-800/50 hover:border-purple-500/50 text-white/90 transition-all duration-200 flex items-center justify-center"
                          >
                            <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>Edit Proposal</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-10 w-full px-4 py-2 text-sm font-medium bg-red-900/30 border border-red-800/50 hover:bg-red-800/50 hover:border-red-700/50 text-red-400 hover:text-red-300 transition-all duration-200 flex items-center justify-center"
                          >
                            <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>Withdraw</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
              
              {mockApplications.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <p className="text-white/60 mb-4">No proposals found</p>
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
        </motion.div>
      </AnimatePresence>
    </Tabs>
  );
}