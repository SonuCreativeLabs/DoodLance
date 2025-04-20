'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CalendarIcon, ClockIcon, IndianRupeeIcon } from 'lucide-react';

// Mock data for demonstration
const mockUpcomingJobs = [
  {
    id: '1',
    title: 'House Cleaning',
    clientName: 'Raj Kumar',
    date: '2024-04-25',
    time: '14:00',
    status: 'confirmed',
    payment: 1500,
    location: 'Anna Nagar, Chennai'
  },
  {
    id: '2',
    title: 'Garden Maintenance',
    clientName: 'Priya S',
    date: '2024-04-26',
    time: '10:00',
    status: 'pending',
    payment: 800,
    location: 'T Nagar, Chennai'
  }
];

const mockApplications = [
  {
    id: '1',
    jobTitle: 'Office Cleaning',
    appliedDate: '2024-04-20',
    status: 'interviewing',
    clientName: 'TechCorp Ltd',
    budget: { min: 1000, max: 2000 },
    progress: 66
  },
  {
    id: '2',
    jobTitle: 'Home Gardening',
    appliedDate: '2024-04-19',
    status: 'applied',
    clientName: 'Meera R',
    budget: { min: 500, max: 1000 },
    progress: 33
  }
];

const mockEarnings = {
  totalEarnings: 15000,
  pendingPayouts: 3000,
  recentTransactions: [
    {
      id: '1',
      amount: 1500,
      status: 'completed',
      date: '2024-04-18',
      jobTitle: 'House Cleaning'
    },
    {
      id: '2',
      amount: 1000,
      status: 'pending',
      date: '2024-04-17',
      jobTitle: 'Garden Work'
    }
  ]
};

export function JobDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const getStatusColor = (status: string) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      interviewing: 'bg-blue-100 text-blue-800',
      applied: 'bg-gray-100 text-gray-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="earnings">Earnings</TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <TabsContent value="upcoming" className="mt-0">
            <div className="space-y-4">
              {mockUpcomingJobs.map((job) => (
                <Card key={job.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-gray-600">{job.clientName}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {job.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {job.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Badge>
                      <p className="mt-2 font-medium flex items-center justify-end">
                        <IndianRupeeIcon className="w-4 h-4" />
                        {job.payment}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="mt-0">
            <div className="space-y-4">
              {mockApplications.map((application) => (
                <Card key={application.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{application.jobTitle}</h3>
                        <p className="text-gray-600">{application.clientName}</p>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Application Progress</span>
                        <span>{application.progress}%</span>
                      </div>
                      <Progress value={application.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Budget Range:</span>
                      <span className="font-medium">₹{application.budget.min} - ₹{application.budget.max}</span>
                    </div>
                  </div>
                </Card>
              ))}
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
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
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