'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search, Filter, Download, MoreVertical, Eye, Edit, Ban,
  Shield, Mail, Phone, MapPin, Star, Calendar, DollarSign,
  CheckCircle, XCircle, AlertCircle, UserCheck, Users, ChevronLeft,
  ChevronRight, X, RefreshCw, FileText, Clock, TrendingUp,
  Trash2, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddUserModal } from '@/components/admin/users/AddUserModal';

const initialStats = {
  totalUsers: 0,
  activeUsers: 0,
  verifiedUsers: 0,
  freelancers: 0,
};

interface UserDetailsModalProps {
  user: any;
  open: boolean;
  onClose: () => void;
}

interface EditUserModalProps {
  user: any;
  open: boolean;
  onClose: () => void;
  onSave: (userId: string, data: any) => Promise<void>;
}

function EditUserModal({ user, open, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    role: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        role: user.role || 'client',
        status: user.status || 'active'
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSave(user.id, formData);
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#1a1a1a] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Edit User Profile</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update information for {user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Full Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-[#2a2a2a] border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Email</Label>
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-[#2a2a2a] border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Phone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-[#2a2a2a] border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Location</Label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-[#2a2a2a] border-gray-700 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Role</Label>
              <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="freelancer">Freelancer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Status</Label>
              <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

function UserDetailsModal({ user, open, onClose }: UserDetailsModalProps) {
  if (!user) return null;

  const isFreelancer = user.role === 'freelancer';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#1a1a1a] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">User Details</DialogTitle>
          <DialogDescription className="text-gray-400">
            Complete information about {user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{user.name}</h3>
              <div className="flex items-center gap-4 mt-1">
                <Badge variant={user.isVerified ? 'default' : 'secondary'}>
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </Badge>
                <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                  {user.status}
                </Badge>
                <span className="text-sm text-gray-400">
                  {user.role} ({user.currentRole})
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-gray-400">Email</Label>
              <div className="flex items-center gap-2 text-white">
                <Mail className="w-4 h-4 text-gray-400" />
                {user.email}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-gray-400">Phone</Label>
              <div className="flex items-center gap-2 text-white">
                <Phone className="w-4 h-4 text-gray-400" />
                {user.phone}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-gray-400">Location</Label>
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-4 h-4 text-gray-400" />
                {user.location}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-gray-400">Joined</Label>
              <div className="flex items-center gap-2 text-white">
                <Calendar className="w-4 h-4 text-gray-400" />
                {user.joinedAt}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          {isFreelancer ? (
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-[#2a2a2a] border-gray-700 p-4">
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <Star className="w-5 h-5" />
                  <span className="text-2xl font-bold">{user.rating}</span>
                </div>
                <p className="text-xs text-gray-400">Rating</p>
              </Card>
              <Card className="bg-[#2a2a2a] border-gray-700 p-4">
                <div className="flex items-center gap-2 text-green-500 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-2xl font-bold">{user.completedJobs}</span>
                </div>
                <p className="text-xs text-gray-400">Completed Jobs</p>
              </Card>
              <Card className="bg-[#2a2a2a] border-gray-700 p-4">
                <div className="flex items-center gap-2 text-purple-500 mb-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-2xl font-bold">₹{(user.totalEarnings / 1000).toFixed(1)}k</span>
                </div>
                <p className="text-xs text-gray-400">Total Earnings</p>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-[#2a2a2a] border-gray-700 p-4">
                <div className="flex items-center gap-2 text-purple-500 mb-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-2xl font-bold">₹{(user.totalSpent / 1000).toFixed(1)}k</span>
                </div>
                <p className="text-xs text-gray-400">Total Spent</p>
              </Card>
              <Card className="bg-[#2a2a2a] border-gray-700 p-4">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <FileText className="w-5 h-5" />
                  <span className="text-2xl font-bold">{user.projectsPosted}</span>
                </div>
                <p className="text-xs text-gray-400">Projects Posted</p>
              </Card>
            </div>
          )}

          {/* Services */}
          {isFreelancer && user.services && (
            <div>
              <Label className="text-gray-400 mb-2 block">Services Offered</Label>
              <div className="flex flex-wrap gap-2">
                {user.services.map((service: string) => (
                  <Badge key={service} variant="secondary" className="bg-purple-600/20 text-purple-400">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Activity */}
          <div className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
            <span className="text-sm text-gray-400">Last Active</span>
            <span className="text-sm text-white">{user.lastActive}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [userToEdit, setUserToEdit] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(initialStats);
  const itemsPerPage = 10;

  // Debounce search term
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on search change
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        role: roleFilter,
        status: statusFilter,
        verification: verificationFilter,
        search: debouncedSearch
      });

      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);

        // Update stats from API
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch, roleFilter, statusFilter, verificationFilter]);

  const handleUserAction = async (userId: string, action: string) => {
    console.log(`Performing ${action} on user ${userId}`);

    try {
      const res = await fetch(`/api/admin/users/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action })
      });

      if (res.ok) {
        // Refresh list
        fetchUsers();
        // TODO: Show success toast
      } else {
        // TODO: Show error toast
      }
    } catch (e) {
      console.error('Action failed:', e);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userToDelete.id,
          action: 'delete',
          reason: 'Admin deleted via dashboard'
        })
      });

      if (res.ok) {
        fetchUsers();
        setDeleteConfirmOpen(false);
        setUserToDelete(null);
        // TODO: Show success toast
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete user');
      }
    } catch (e) {
      console.error('Delete failed:', e);
      alert('Delete failed. Make sure you have applied the Cascade Delete SQL migration in Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, data: any) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        fetchUsers();
        // TODO: Success toast
      } else {
        const error = await res.json();
        console.error('Update failed:', error);
        alert(error.error || 'Failed to update user');
      }
    } catch (e) {
      console.error('Update error:', e);
      alert('An error occurred while updating capabilities');
    }
  };

  const handleExport = () => {
    // Define headers
    const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Total Spent', 'Total Earned', 'Joined At'];

    // Convert users to CSV rows
    const rows = users.map(user => [
      user.id,
      `"${user.name}"`, // Quote strings with potential commas
      user.email,
      user.role,
      user.status,
      user.totalSpent,
      user.totalEarnings,
      user.joinedAt
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
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <AddUserModal
        open={addUserModalOpen}
        onOpenChange={setAddUserModalOpen}
        onSuccess={() => {
          fetchUsers();
          // Add toast success here if available
        }}
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage all platform users and their profiles</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="text-gray-300 w-full sm:w-auto"
            onClick={handleExport}
            disabled={users.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            onClick={() => setAddUserModalOpen(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards - Static for now or fetch if needed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              {loading ? <Skeleton className="h-8 w-16 bg-gray-800" /> : (
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              )}
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Users</p>
              {loading ? <Skeleton className="h-8 w-16 bg-gray-800" /> : (
                <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
              )}
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Verified</p>
              {loading ? <Skeleton className="h-8 w-16 bg-gray-800" /> : (
                <p className="text-2xl font-bold text-white">{stats.verifiedUsers}</p>
              )}
            </div>
            <Shield className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Freelancers</p>
              {loading ? <Skeleton className="h-8 w-16 bg-gray-800" /> : (
                <p className="text-2xl font-bold text-white">{stats.freelancers}</p>
              )}
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
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
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#2a2a2a] border-gray-700 text-white"
              />
            </div>
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px] bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="freelancer">Freelancer</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Select value={verificationFilter} onValueChange={setVerificationFilter}>
            <SelectTrigger className="w-[150px] bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('all');
              setStatusFilter('all');
              setVerificationFilter('all');
            }}
            className="text-gray-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr className="text-left">
                <th className="p-4 text-sm font-medium text-gray-400">User</th>
                <th className="p-4 text-sm font-medium text-gray-400">Contact</th>
                <th className="p-4 text-sm font-medium text-gray-400">Role</th>
                <th className="p-4 text-sm font-medium text-gray-400">Referral Code</th>
                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="p-4 text-sm font-medium text-gray-400">Total Spent</th>
                <th className="p-4 text-sm font-medium text-gray-400">Total Earned</th>
                <th className="p-4 text-sm font-medium text-gray-400">Last Active</th>
                <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full bg-gray-800" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32 bg-gray-800" />
                          <Skeleton className="h-3 w-24 bg-gray-800" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40 bg-gray-800" />
                        <Skeleton className="h-3 w-24 bg-gray-800" />
                      </div>
                    </td>
                    <td className="p-4"><Skeleton className="h-5 w-20 rounded-full bg-gray-800" /></td>
                    <td className="p-4"><Skeleton className="h-5 w-20 rounded-full bg-gray-800" /></td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24 bg-gray-800" />
                        <Skeleton className="h-3 w-16 bg-gray-800" />
                      </div>
                    </td>
                    <td className="p-4"><Skeleton className="h-4 w-24 bg-gray-800" /></td>
                    <td className="p-4"><Skeleton className="h-8 w-8 rounded bg-gray-800" /></td>
                  </tr>
                ))
              ) : (
                <AnimatePresence>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover border border-gray-700"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <p className="text-white font-medium">{user.name}</p>
                              <p className="text-xs text-gray-400">{user.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-300">{user.email}</p>
                            <p className="text-sm text-gray-400">{user.phone}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <Badge
                              variant="secondary"
                              className={`capitalize ${user.role === 'both' ? 'bg-gradient-to-r from-purple-900 to-blue-900 text-white border-none' : ''
                                }`}
                            >
                              {user.role}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-300 font-mono">{user.referralCode}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={user.status === 'active' ? 'default' : 'destructive'}
                              className={user.status === 'active' ? 'bg-green-600' : ''}
                            >
                              {user.status}
                            </Badge>
                            {user.isVerified && (
                              <Badge variant="outline" className="border-purple-600 text-purple-400">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-white">₹{(user.totalSpent || 0).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-400">{user.projectsPosted || 0} projects</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            {user.role === 'freelancer' || user.role === 'both' ? (
                              <>
                                <DollarSign className="w-4 h-4 text-purple-500" />
                                <span className="text-sm text-white">₹{((user.totalEarnings || 0) / 1000).toFixed(1)}k</span>
                              </>
                            ) : (
                              <span className="text-sm text-gray-600">-</span>
                            )}
                          </div>
                          {(user.role === 'freelancer' || user.role === 'both') && (
                            <p className="text-xs text-gray-400">{user.completedJobs || 0} jobs</p>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-sm text-gray-400 whitespace-nowrap">
                            <Clock className="w-4 h-4" />
                            {user.lastActive}
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
                                  setSelectedUser(user);
                                  setDetailsModalOpen(true);
                                }}
                                className="cursor-pointer"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                  setUserToEdit(user);
                                  setEditModalOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => window.location.href = `/messages?userId=${user.id}`}
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              {!user.isVerified && (
                                <DropdownMenuItem
                                  onClick={() => handleUserAction(user.id, 'verify')}
                                  className="cursor-pointer"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Verify User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {user.status === 'active' ? (
                                <DropdownMenuItem
                                  onClick={() => handleUserAction(user.id, 'suspend')}
                                  className="cursor-pointer text-red-400"
                                >
                                  <Ban className="w-4 h-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => handleUserAction(user.id, 'activate')}
                                  className="cursor-pointer text-green-400"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setUserToDelete(user);
                                  setDeleteConfirmOpen(true);
                                }}
                                className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400">No users found.</td>
                    </tr>
                  )}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, users.length > 0 ? currentPage * itemsPerPage : 0)} of {users.length > 0 ? 'many' : 0} page results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="bg-[#2a2a2a] border-gray-700 text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                }
                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={currentPage === pageNum ? "bg-purple-600" : "bg-[#2a2a2a] border-gray-700 text-white"}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="bg-[#2a2a2a] border-gray-700 text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <UserDetailsModal
        user={selectedUser}
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
      />
      <EditUserModal
        user={userToEdit}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleUpdateUser}
      />
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-[#1a1a1a] border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Delete User?
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete <span className="font-bold text-white">{userToDelete?.name}</span>?
              <br /><br />
              <span className="text-red-400 font-medium">Warning:</span> This action cannot be undone. All data associated with this user (profile, wallet, messages) will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-2">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={loading}>Cancel</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteUser}
              disabled={loading}
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
