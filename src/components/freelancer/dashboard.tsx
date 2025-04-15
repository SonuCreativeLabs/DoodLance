"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Application {
  id: string;
  jobTitle: string;
  clientName: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedDate: string;
  budget: number;
}

interface Earnings {
  total: number;
  pending: number;
  completed: number;
}

export default function FreelancerDashboard() {
  const [availability, setAvailability] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  });

  const [applications] = useState<Application[]>([
    {
      id: '1',
      jobTitle: 'Bathroom Renovation',
      clientName: 'John Smith',
      status: 'pending',
      appliedDate: '2024-03-20',
      budget: 1200
    },
    {
      id: '2',
      jobTitle: 'Kitchen Plumbing Fix',
      clientName: 'Sarah Johnson',
      status: 'accepted',
      appliedDate: '2024-03-18',
      budget: 800
    }
  ]);

  const [earnings] = useState<Earnings>({
    total: 2500,
    pending: 800,
    completed: 1700
  });

  const toggleAvailability = (day: keyof typeof availability) => {
    setAvailability(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  return (
    <div className="space-y-6 p-4">
      {/* Earnings Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">Total Earnings</h3>
          </div>
          <p className="text-2xl font-bold mt-2">${earnings.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold">Pending</h3>
          </div>
          <p className="text-2xl font-bold mt-2">${earnings.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">Completed</h3>
          </div>
          <p className="text-2xl font-bold mt-2">${earnings.completed}</p>
        </div>
      </motion.div>

      {/* Availability Calendar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-4 rounded-lg shadow"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5" />
          <h3 className="font-semibold">Availability</h3>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Object.entries(availability).map(([day, isAvailable]) => (
            <button
              key={day}
              onClick={() => toggleAvailability(day as keyof typeof availability)}
              className={`p-2 rounded-lg text-center ${
                isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {day.charAt(0).toUpperCase() + day.slice(1, 3)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Applications */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-4 rounded-lg shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5" />
            <h3 className="font-semibold">Recent Applications</h3>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">{app.jobTitle}</h4>
                <p className="text-sm text-gray-500">{app.clientName}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm">${app.budget}</span>
                {app.status === 'pending' && (
                  <Clock className="w-5 h-5 text-yellow-500" />
                )}
                {app.status === 'accepted' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {app.status === 'rejected' && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Portfolio Upload */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-4 rounded-lg shadow"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Upload className="w-5 h-5" />
          <h3 className="font-semibold">Portfolio</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-500">Upload new work</p>
          </div>
          {/* Add existing portfolio items here */}
        </div>
      </motion.div>
    </div>
  );
} 