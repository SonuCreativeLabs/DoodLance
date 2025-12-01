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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Shield, Search, Filter, MoreVertical, Eye,
  CheckCircle, XCircle, AlertCircle, Clock,
  FileText, User, CreditCard, Upload, Download,
  RefreshCw, ChevronLeft, ChevronRight, ShieldCheck, ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock KYC data
const mockKYCRequests = [
  {
    id: 'KYC001',
    userId: 'USR001',
    userName: 'Rohit Sharma',
    userEmail: 'rohit@example.com',
    userRole: 'freelancer',
    documents: {
      idProof: { type: 'Aadhar Card', status: 'verified', file: 'aadhar_rohit.pdf' },
      addressProof: { type: 'Utility Bill', status: 'verified', file: 'utility_rohit.pdf' },
      panCard: { type: 'PAN Card', status: 'verified', file: 'pan_rohit.pdf' },
    },
    status: 'verified',
    submittedAt: '2024-03-15 10:30 AM',
    verifiedAt: '2024-03-16 2:00 PM',
    verifiedBy: 'Admin',
    notes: 'All documents verified successfully'
  },
  {
    id: 'KYC002',
    userId: 'USR003',
    userName: 'Virat Singh',
    userEmail: 'virat@example.com',
    userRole: 'freelancer',
    documents: {
      idProof: { type: 'Passport', status: 'pending', file: 'passport_virat.pdf' },
      addressProof: { type: 'Bank Statement', status: 'pending', file: 'bank_virat.pdf' },
      panCard: { type: 'PAN Card', status: 'pending', file: 'pan_virat.pdf' },
    },
    status: 'pending',
    submittedAt: '2024-03-25 3:45 PM',
    verifiedAt: null,
    verifiedBy: null,
    notes: 'Awaiting review'
  },
  {
    id: 'KYC003',
    userId: 'USR004',
    userName: 'Ananya Reddy',
    userEmail: 'ananya@example.com',
    userRole: 'freelancer',
    documents: {
      idProof: { type: 'Voter ID', status: 'rejected', file: 'voter_ananya.pdf' },
      addressProof: { type: 'Rental Agreement', status: 'pending', file: 'rental_ananya.pdf' },
      panCard: { type: 'PAN Card', status: 'verified', file: 'pan_ananya.pdf' },
    },
    status: 'rejected',
    submittedAt: '2024-03-20 11:15 AM',
    verifiedAt: '2024-03-21 9:30 AM',
    verifiedBy: 'Support Team',
    notes: 'Voter ID image is not clear, please resubmit'
  },
];

export default function KYCVerificationPage() {
  const [kycRequests, setKYCRequests] = useState(mockKYCRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter KYC requests
  const filteredRequests = kycRequests.filter(request => {
    const matchesSearch = 
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handleVerify = (requestId: string) => {
    setKYCRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'verified', verifiedAt: new Date().toLocaleString(), verifiedBy: 'Admin' }
        : req
    ));
  };

  const handleReject = (requestId: string, reason: string) => {
    setKYCRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'rejected', notes: reason, verifiedAt: new Date().toLocaleString(), verifiedBy: 'Admin' }
        : req
    ));
  };

  const stats = {
    total: kycRequests.length,
    pending: kycRequests.filter(r => r.status === 'pending').length,
    verified: kycRequests.filter(r => r.status === 'verified').length,
    rejected: kycRequests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">KYC Verification</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Review and verify user identity documents</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" className="text-gray-300 w-full sm:w-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Requests</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-600" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Verified</p>
              <p className="text-2xl font-bold text-green-400">{stats.verified}</p>
            </div>
            <ShieldCheck className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
            </div>
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, or ID..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* KYC Requests Table */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr className="text-left">
                <th className="p-4 text-sm font-medium text-gray-400">User</th>
                <th className="p-4 text-sm font-medium text-gray-400">Documents</th>
                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="p-4 text-sm font-medium text-gray-400">Submitted</th>
                <th className="p-4 text-sm font-medium text-gray-400">Verified By</th>
                <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((request, index) => (
                <motion.tr 
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{request.userName}</p>
                      <p className="text-xs text-gray-400">{request.userEmail}</p>
                      <p className="text-xs text-gray-500">{request.userId}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {Object.entries(request.documents).map(([key, doc]: [string, any]) => (
                        <Badge 
                          key={key}
                          variant={doc.status === 'verified' ? 'default' : doc.status === 'pending' ? 'secondary' : 'destructive'}
                          className={
                            doc.status === 'verified' ? 'bg-green-500/20 text-green-400' :
                            doc.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }
                        >
                          {doc.type}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge 
                      variant={request.status === 'verified' ? 'default' : request.status === 'pending' ? 'secondary' : 'destructive'}
                      className={
                        request.status === 'verified' ? 'bg-green-500/20 text-green-400' :
                        request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }
                    >
                      {request.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-gray-300">{request.submittedAt}</td>
                  <td className="p-4 text-sm text-gray-300">{request.verifiedBy || '-'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                        onClick={() => {
                          setSelectedRequest(request);
                          setDetailsModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {request.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-400 hover:text-green-300"
                            onClick={() => handleVerify(request.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleReject(request.id, 'Documents not clear')}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRequests.length)} of {filteredRequests.length} requests
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
              <Button
                key={i + 1}
                size="sm"
                variant={currentPage === i + 1 ? 'default' : 'outline'}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? 'bg-purple-600' : ''}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="bg-[#1a1a1a] border-gray-800 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">KYC Verification Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              Review user documents and verification status
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">User Name</p>
                  <p className="text-white font-medium">{selectedRequest.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">User Email</p>
                  <p className="text-white">{selectedRequest.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">User ID</p>
                  <p className="text-white">{selectedRequest.userId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <Badge 
                    variant={selectedRequest.status === 'verified' ? 'default' : selectedRequest.status === 'pending' ? 'secondary' : 'destructive'}
                    className={
                      selectedRequest.status === 'verified' ? 'bg-green-500/20 text-green-400' :
                      selectedRequest.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }
                  >
                    {selectedRequest.status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Documents</p>
                <div className="space-y-2">
                  {Object.entries(selectedRequest.documents).map(([key, doc]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-white text-sm font-medium">{doc.type}</p>
                          <p className="text-xs text-gray-400">{doc.file}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={doc.status === 'verified' ? 'default' : doc.status === 'pending' ? 'secondary' : 'destructive'}
                          className={
                            doc.status === 'verified' ? 'bg-green-500/20 text-green-400' :
                            doc.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }
                        >
                          {doc.status}
                        </Badge>
                        <Button size="sm" variant="ghost" className="text-purple-400">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRequest.notes && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Notes</p>
                  <p className="text-white text-sm p-3 bg-[#2a2a2a] rounded-lg">{selectedRequest.notes}</p>
                </div>
              )}

              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-800">
                  <Button 
                    variant="outline" 
                    onClick={() => handleReject(selectedRequest.id, 'Documents not clear')}
                    className="text-red-400 border-red-400 hover:bg-red-400/20"
                  >
                    Reject
                  </Button>
                  <Button 
                    onClick={() => {
                      handleVerify(selectedRequest.id);
                      setDetailsModalOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Verify KYC
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
