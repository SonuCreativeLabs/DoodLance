'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  ChevronRight, X, RefreshCw, FileText, Clock, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'Rohit Sharma',
    email: 'rohit@example.com',
    phone: '+91 98765 43210',
    role: 'freelancer',
    currentRole: 'freelancer',
    location: 'Mumbai',
    isVerified: true,
    rating: 4.8,
    completedJobs: 156,
    totalEarnings: 234500,
    joinedAt: '2024-01-15',
    lastActive: '2 hours ago',
    status: 'active',
    avatar: null,
    services: ['Net Bowler', 'Coach'],
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '+91 87654 32109',
    role: 'client',
    currentRole: 'client',
    location: 'Delhi',
    isVerified: false,
    totalSpent: 45600,
    projectsPosted: 12,
    joinedAt: '2024-02-20',
    lastActive: '1 day ago',
    status: 'active',
    avatar: null,
  },
  {
    id: '3',
    name: 'Virat Singh',
    email: 'virat@example.com',
    phone: '+91 76543 21098',
    role: 'freelancer',
    currentRole: 'client',
    location: 'Bangalore',
    isVerified: true,
    rating: 4.5,
    completedJobs: 89,
    totalEarnings: 156780,
    joinedAt: '2023-12-10',
    lastActive: '5 minutes ago',
    status: 'active',
    avatar: null,
    services: ['Match Player', 'Trainer'],
  },
  {
    id: '4',
    name: 'Ananya Reddy',
    email: 'ananya@example.com',
    phone: '+91 65432 10987',
    role: 'freelancer',
    currentRole: 'freelancer',
    location: 'Hyderabad',
    isVerified: false,
    rating: 3.9,
    completedJobs: 23,
    totalEarnings: 34500,
    joinedAt: '2024-03-01',
    lastActive: '1 week ago',
    status: 'suspended',
    avatar: null,
    services: ['Physio'],
  },
];

interface UserDetailsModalProps {
  user: any;
  open: boolean;
  onClose: () => void;
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
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesVerification = verificationFilter === 'all' ||
                               (verificationFilter === 'verified' && user.isVerified) ||
                               (verificationFilter === 'unverified' && !user.isVerified);
    
    return matchesSearch && matchesRole && matchesStatus && matchesVerification;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUserAction = async (userId: string, action: string) => {
    // Mock API call
    console.log(`Performing ${action} on user ${userId}`);
    
    if (action === 'suspend') {
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'suspended' } : u));
    } else if (action === 'activate') {
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'active' } : u));
    } else if (action === 'verify') {
      setUsers(users.map(u => u.id === userId ? { ...u, isVerified: true } : u));
    }
  };

  // Stats
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    verifiedUsers: users.filter(u => u.isVerified).length,
    freelancers: users.filter(u => u.role === 'freelancer').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 mt-1">Manage all platform users and their profiles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Users className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Verified</p>
              <p className="text-2xl font-bold text-white">{stats.verifiedUsers}</p>
            </div>
            <Shield className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Freelancers</p>
              <p className="text-2xl font-bold text-white">{stats.freelancers}</p>
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
                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="p-4 text-sm font-medium text-gray-400">Performance</th>
                <th className="p-4 text-sm font-medium text-gray-400">Last Active</th>
                <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginatedUsers.map((user, index) => (
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
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
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
                        <Badge variant="secondary" className="capitalize">
                          {user.role}
                        </Badge>
                        {user.role !== user.currentRole && (
                          <p className="text-xs text-gray-400">as {user.currentRole}</p>
                        )}
                      </div>
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
                      {user.role === 'freelancer' ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-white">{user.rating}</span>
                            <span className="text-xs text-gray-400">({user.completedJobs} jobs)</span>
                          </div>
                          <p className="text-xs text-gray-400">₹{(user.totalEarnings / 1000).toFixed(1)}k earned</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-sm text-white">₹{(user.totalSpent / 1000).toFixed(1)}k spent</p>
                          <p className="text-xs text-gray-400">{user.projectsPosted} projects</p>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
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
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="text-gray-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'bg-purple-600' : 'text-gray-300'}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="text-gray-300"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}
