'use client';

import { useState, useEffect } from 'react';
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

export default function KYCVerificationPage() {
  const [kycRequests, setKYCRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, rejected: 0 });
  const [confirmAction, setConfirmAction] = useState<{
    type: 'verify' | 'reject';
    requestId: string;
    userName: string;
    reason?: string;
  } | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Cricket Ball Spinner for Buttons
  const CricketBallSpinner = () => (
    <motion.div
      className="w-5 h-5 rounded-full bg-white relative flex items-center justify-center overflow-hidden shadow-inner mr-2"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute w-full h-[2px] bg-emerald-800" />
      <div className="absolute w-[2px] h-full bg-emerald-800" />
      <div className="absolute w-full h-full border-2 border-emerald-800/10 rounded-full" />
    </motion.div>
  );

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchKYCRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch, statusFilter]);

  const fetchKYCRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: debouncedSearch,
        status: statusFilter
      });
      const res = await fetch(`/api/admin/verification?${params}`);
      if (res.ok) {
        const data = await res.json();
        setKYCRequests(data.requests);
        if (data.stats) setStats(data.stats); // Use server-side stats
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching KYC requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!kycRequests || kycRequests.length === 0) {
      alert('No data to export');
      return;
    }

    // Convert to CSV
    const headers = ['User Name', 'Email', 'Role', 'Status', 'Submitted At', 'Verified By'];
    const csvContent = [
      headers.join(','),
      ...kycRequests.map(req => [
        `"${req.userName}"`,
        req.userEmail,
        req.userRole,
        req.status,
        req.submittedAt,
        req.verifiedBy || '-'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'kyc_requests.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const initiateVerify = (request: any) => {
    setConfirmAction({
      type: 'verify',
      requestId: request.id,
      userName: request.userName
    });
  };

  const initiateReject = (request: any, reason: string) => {
    setConfirmAction({
      type: 'reject',
      requestId: request.id,
      userName: request.userName,
      reason
    });
  };

  const executeAction = async () => {
    if (!confirmAction) return;
    setIsActionLoading(true);

    try {
      const body: any = { action: confirmAction.type };
      if (confirmAction.type === 'reject') {
        body.notes = confirmAction.reason;
      }

      const res = await fetch(`/api/admin/verification/${confirmAction.requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        await fetchKYCRequests();
        setConfirmAction(null);
        setDetailsModalOpen(false); // Close details if open
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Filter KYC requests (client-side filtering logic removed as API handles it)
  const currentItems = kycRequests;

  // Stats are now from server state 'stats', not local calculations


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">KYC Verification</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Review and verify user identity documents</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" className="text-gray-300 w-full sm:w-auto" onClick={fetchKYCRequests}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto" onClick={handleExport}>
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
                            onClick={() => initiateVerify(request)}
                            title="Verify"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => initiateReject(request, 'Documents not clear')}
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {request.status === 'verified' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => initiateReject(request, 'Verification Revoked')}
                          title="Revoke Verification"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                      {request.status === 'rejected' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-400 hover:text-green-300"
                          onClick={() => initiateVerify(request)}
                          title="Re-Verify"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
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
            Showing page {currentPage} of {totalPages}
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
              disabled={currentPage === totalPages || totalPages === 0}
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
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-purple-400 hover:text-purple-300"
                          onClick={() => window.open(doc.file, '_blank')}
                        >
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
                    onClick={() => initiateReject(selectedRequest, 'Documents not clear')}
                    className="text-red-400 border-red-400 hover:bg-red-400/20"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => initiateVerify(selectedRequest)}
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

      {/* Confirmation Dialog */}
      <Dialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <DialogContent className="bg-[#1a1a1a] border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              Confirm {confirmAction?.type === 'verify' ? 'Verification' : 'Rejection'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to {confirmAction?.type === 'verify' ? 'verify' : 'reject'} the documents for <span className="text-white font-medium">{confirmAction?.userName}</span>?
              {confirmAction?.type === 'reject' && (
                <p className="mt-2 text-red-400 text-sm">Reason: {confirmAction.reason}</p>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="ghost"
              onClick={() => setConfirmAction(null)}
              className="text-gray-400 hover:text-white"
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={executeAction}
              className={confirmAction?.type === 'verify' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              disabled={isActionLoading}
            >
              {isActionLoading ? <CricketBallSpinner /> : null}
              {isActionLoading ? 'Processing...' : `Confirm ${confirmAction?.type === 'verify' ? 'Verify' : 'Reject'}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
