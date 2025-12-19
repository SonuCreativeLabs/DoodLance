'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Briefcase, Search, Filter, Download, Calendar,
  DollarSign, MapPin, Clock, Users, TrendingUp,
  AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock job data
const mockJobs = [
  {
    id: '1',
    title: 'Full Stack Web Developer',
    client: 'John Doe',
    category: 'Development',
    budget: 50000,
    status: 'active',
    applications: 12,
    postedDate: '2024-03-15',
    deadline: '2024-04-15',
    location: 'Remote',
    experience: 'Senior',
    skills: ['React', 'Node.js', 'MongoDB']
  },
  {
    id: '2', 
    title: 'Mobile App Designer',
    client: 'Jane Smith',
    category: 'Design',
    budget: 30000,
    status: 'active',
    applications: 8,
    postedDate: '2024-03-14',
    deadline: '2024-04-10',
    location: 'Hybrid',
    experience: 'Intermediate',
    skills: ['Figma', 'UI/UX', 'Mobile']
  },
  {
    id: '3',
    title: 'Content Writer',
    client: 'Mike Johnson',
    category: 'Writing',
    budget: 15000,
    status: 'closed',
    applications: 15,
    postedDate: '2024-03-10',
    deadline: '2024-03-30',
    location: 'Remote',
    experience: 'Junior',
    skills: ['SEO', 'Blog', 'Technical']
  }
];

const statusColors = {
  active: 'bg-green-500',
  closed: 'bg-gray-500',
  draft: 'bg-yellow-500',
};

export default function JobsPage() {
  const [jobs] = useState(mockJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || job.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'active').length,
    totalApplications: jobs.reduce((sum, j) => sum + j.applications, 0),
    avgBudget: Math.round(jobs.reduce((sum, j) => sum + j.budget, 0) / jobs.length)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Job Management</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage job postings and applications</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="text-gray-300 w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
            <Briefcase className="w-4 h-4 mr-2" />
            Post Job
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Jobs</p>
              <p className="text-2xl font-bold text-white">{stats.totalJobs}</p>
            </div>
            <Briefcase className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Jobs</p>
              <p className="text-2xl font-bold text-white">{stats.activeJobs}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Applications</p>
              <p className="text-2xl font-bold text-white">{stats.totalApplications}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Budget</p>
              <p className="text-2xl font-bold text-white">₹{(stats.avgBudget / 1000).toFixed(0)}k</p>
            </div>
            <DollarSign className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search jobs or clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-48 bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full lg:w-48 bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Development">Development</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Writing">Writing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Jobs List */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Job Listings</h2>
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-gray-800 rounded-lg p-4 hover:bg-[#2a2a2a] transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">Client: {job.client}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {job.postedDate}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Clock className="w-4 h-4" />
                            {job.deadline}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {job.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">₹{(job.budget / 1000).toFixed(0)}k</p>
                        <Badge className={`${statusColors[job.status]} text-white mt-2`}>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 lg:mt-0">
                    <Button variant="outline" size="sm" className="text-gray-300">
                      View Applications ({job.applications})
                    </Button>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Edit
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
