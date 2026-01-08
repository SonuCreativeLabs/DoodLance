'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  AlertCircle, CheckCircle, XCircle, ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

type JobStatus = 'active' | 'closed' | 'draft';

const statusColors: Record<JobStatus, string> = {
  active: 'bg-green-500',
  closed: 'bg-gray-500',
  draft: 'bg-yellow-500',
};

interface EditJobModalProps {
  job: any;
  open: boolean;
  onClose: () => void;
  onSave: (jobId: string, data: any) => Promise<void>;
}

function EditJobModal({ job, open, onClose, onSave }: EditJobModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    budget: '',
    status: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        budget: job.budget ? job.budget.toString() : '',
        status: job.status || 'active',
        description: job.description || ''
      });
    }
  }, [job]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSave(job.id, {
        ...formData,
        budget: parseFloat(formData.budget) || 0
      });
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#1a1a1a] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Job</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update job details for {job.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-[#2a2a2a] border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Budget (₹)</Label>
            <Input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="bg-[#2a2a2a] border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Status</Label>
            <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
              <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-[#2a2a2a] border-gray-700 text-white"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<any>(null);
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

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: debouncedSearch,
        status: statusFilter,
        category: categoryFilter
      });
      const res = await fetch(`/api/admin/jobs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch, statusFilter, categoryFilter]);

  const handleUpdateJob = async (jobId: string, data: any) => {
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        fetchJobs();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to update job');
      }
    } catch (e) {
      console.error('Update job error:', e);
      alert('Failed to update job');
    }
  };

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'active').length,
    totalApplications: jobs.reduce((sum, j) => sum + (j.applications || 0), 0),
    avgBudget: jobs.length > 0 ? Math.round(jobs.reduce((sum, j) => sum + (j.budget || 0), 0) / jobs.length) : 0
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
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
            className="text-gray-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      {/* Jobs List */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Job Listings</h2>
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-400 text-center py-8">Loading jobs...</p>
            ) : jobs.map((job, index) => (
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
                          {job.skills && job.skills.map((skill: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">₹{(job.budget / 1000).toFixed(0)}k</p>
                        <Badge className={`${statusColors[job.status as JobStatus]} text-white mt-2`}>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 lg:mt-0">
                    <Button variant="outline" size="sm" className="text-gray-300">
                      View Applications ({job.applications})
                    </Button>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => {
                        setJobToEdit(job);
                        setEditModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
            {!loading && jobs.length === 0 && (
              <p className="text-gray-400 text-center py-8">No jobs found.</p>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-800">
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
        )}
      </Card>
      <EditJobModal
        job={jobToEdit}
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setJobToEdit(null);
        }}
        onSave={handleUpdateJob}
      />
    </div>
  );
}
