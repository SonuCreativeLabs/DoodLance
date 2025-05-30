'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter as FilterIcon, ChevronLeft, ChevronRight, MoreVertical, X, Calendar as CalendarIcon, Clock as ClockIcon, MapPin, FileText, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

// Import components, types, utils, and mock data from our modular files
import { JobCard, ApplicationCard } from './index';
import { Job, Application, EarningsData, StatusType, ApplicationStatus, JobStatus } from './types';
import { formatDate, getStatusStyles, formatTimeRemaining } from './utils';
import { mockUpcomingJobs, mockApplications, mockEarnings } from './mock-data';

export function JobDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [statusFilter, setStatusFilter] = useState(activeTab === 'upcoming' ? 'upcoming' : 'pending');

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
      
      return matchesSearch && statusMatches;
    });
  }, [searchQuery, statusFilter]);

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
          return app.status === 'pending' || app.status === 'accepted';
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
  };

  const renderRating = (rating: number) => {
    return (
      <div className="inline-flex items-center">
        {[1, 2, 3, 4, 5].map(star => (
          <svg 
            key={star}
            className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-400">{rating.toFixed(1)}</span>
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
    setSearchQuery('');
    // Set default status based on the selected tab
    setStatusFilter(value === 'upcoming' ? 'upcoming' : 'pending');
  };

  return (
    <div className="w-full text-foreground bg-[#111111] min-h-screen">
      <Tabs defaultValue="upcoming" className="w-full" onValueChange={handleTabChange}>
        <div className="w-full max-w-[1800px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pt-6 gap-4 px-6">
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

          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="w-full"
              >


          <TabsContent value="upcoming" className="mt-0 w-full">
            {/* Upcoming Jobs Section */}
            <div className="w-full space-y-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <div key={job.id} className="w-full">
                    <JobCard job={job} index={index} />
                  </div>
                ))
              ) : (
                <Card className="p-8 border-gray-800 bg-gray-900/50 text-center">
                  <h3 className="text-xl font-medium text-white mb-2">No jobs found</h3>
                  <p className="text-gray-400">
                    {searchQuery ? 'Try adjusting your search query.' : 'You have no upcoming jobs.'}
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="mt-0 w-full">
            {/* Applications Section */}
            <div className="w-full space-y-6">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((application, index) => (
                  <div key={application.id} className="w-full">
                    <ApplicationCard 
                      application={application}
                      index={index}
                      onViewDetails={() => onViewDetails(application)}
                    />
                  </div>
                ))
              ) : (
                <Card className="p-8 border-gray-800 bg-gray-900/50 text-center">
                  <h3 className="text-xl font-medium text-white mb-2">No applications found</h3>
                  <p className="text-gray-400">
                    {searchQuery ? 'Try adjusting your search query.' : 'You have not applied to any jobs yet.'}
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="mt-0">
            {/* Earnings Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-900/50 border-gray-800 p-6 flex flex-col">
                <h3 className="text-gray-400 font-medium mb-2">Total Earnings</h3>
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee className="h-5 w-5 text-purple-500" />
                  <span className="text-3xl font-semibold text-white">
                    {mockEarnings.totalEarnings.toLocaleString()}
                  </span>
                </div>
                <p className="text-green-500 text-sm">+12% from last month</p>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-800 p-6 flex flex-col">
                <h3 className="text-gray-400 font-medium mb-2">Pending Payouts</h3>
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee className="h-5 w-5 text-purple-500" />
                  <span className="text-3xl font-semibold text-white">
                    {mockEarnings.pendingPayouts.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-500 text-sm">Expected in 3-5 days</p>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-800 p-6 flex flex-col">
                <h3 className="text-gray-400 font-medium mb-2">Completed Jobs</h3>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-semibold text-white">
                    {mockEarnings.completedJobs}
                  </span>
                </div>
                <div className="flex items-center">
                  <p className="text-gray-500 text-sm mr-2">Average Rating:</p>
                  {renderRating(mockEarnings.averageRating)}
                </div>
              </Card>
            </div>

            <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
            <Card className="bg-gray-900/50 border-gray-800 overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">Date</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">Job</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">Client</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">Amount</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockEarnings.recentTransactions.map((transaction, index) => (
                      <tr 
                        key={transaction.id} 
                        className={`border-b border-gray-800 ${index === mockEarnings.recentTransactions.length - 1 ? 'border-b-0' : ''}`}
                      >
                        <td className="py-4 px-6 text-gray-300">{format(new Date(transaction.date), 'MMM d, yyyy')}</td>
                        <td className="py-4 px-6 text-white font-medium">{transaction.jobTitle}</td>
                        <td className="py-4 px-6 text-gray-300">{transaction.client}</td>
                        <td className="py-4 px-6 text-white font-medium">₹{transaction.amount.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transaction.status === 'completed' 
                              ? 'bg-green-900/30 text-green-500 border border-green-800'
                              : 'bg-yellow-900/30 text-yellow-500 border border-yellow-800'
                          }`}>
                            {transaction.status === 'completed' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="flex items-center justify-center mt-4">
              <Button variant="outline" size="sm" className="flex items-center gap-1 bg-gray-900/50 border-gray-800 text-gray-400 hover:text-white">
                <ChevronLeft className="h-4 w-4" /> 
                Previous
              </Button>
              <span className="px-6 text-gray-400">Page 1 of 1</span>
              <Button variant="outline" size="sm" className="flex items-center gap-1 bg-gray-900/50 border-gray-800 text-gray-400 hover:text-white">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
                  </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default JobDashboard;
