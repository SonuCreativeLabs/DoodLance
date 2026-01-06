'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  DialogFooter,
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
  MessageSquare, Search, Filter, MoreVertical, Eye,
  Clock, CheckCircle, AlertCircle, XCircle, Send,
  User, Calendar, Tag, RefreshCw, ChevronLeft,
  ChevronRight, MessageCircle, ArrowUp, ArrowDown,
  Inbox, Archive, Star, Plus, DollarSign, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

const priorityColors: Record<string, string> = {
  LOW: 'bg-gray-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  URGENT: 'bg-red-500'
};

const statusColors: Record<string, string> = {
  OPEN: 'bg-blue-500',
  IN_PROGRESS: 'bg-yellow-500',
  RESOLVED: 'bg-green-500',
  CLOSED: 'bg-gray-500'
};

const categoryIcons: Record<string, React.ElementType> = {
  payment: DollarSign,
  dispute: AlertCircle,
  general: MessageCircle,
  verification: Shield,
  bug: AlertCircle,
  feature: Star
};

interface TicketDetailsModalProps {
  ticket: any;
  open: boolean;
  onClose: () => void;
  onSendMessage: (ticketId: string, message: string) => void;
  onUpdateStatus: (ticketId: string, status: string) => void;
}

function TicketDetailsModal({ ticket, open, onClose, onSendMessage, onUpdateStatus }: TicketDetailsModalProps) {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(ticket?.status || '');

  // Update local status when ticket changes
  useEffect(() => {
    if (ticket) setStatus(ticket.status);
  }, [ticket]);

  if (!ticket) return null;

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(ticket.id, message);
      setMessage('');
    }
  };

  const handleStatusUpdate = () => {
    onUpdateStatus(ticket.id, status);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#1a1a1a] border-gray-800 max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white">Support Ticket #{ticket.ticketNumber || ticket.id.substring(0, 8)}</DialogTitle>
            <div className="flex items-center gap-2">
              <Badge className={`${priorityColors[ticket.priority] || 'bg-gray-500'} text-white`}>
                {ticket.priority}
              </Badge>
              <Badge className={`${statusColors[ticket.status] || 'bg-gray-500'} text-white`}>
                {ticket.status}
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-gray-400">
            {ticket.subject}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6">
          {/* Messages */}
          <div className="flex-1 space-y-4">
            <Card className="bg-[#2a2a2a] border-gray-700 p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Conversation</h3>
              <div className="h-[300px] overflow-y-auto">
                <div className="space-y-3">
                  {/* Original Description as first message */}
                  <div className="p-3 rounded-lg bg-[#1a1a1a] border border-gray-700 mr-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{ticket.userName} (Original Request)</span>
                      <span className="text-xs text-gray-400">{ticket.createdAt}</span>
                    </div>
                    <p className="text-sm text-gray-200">{ticket.description}</p>
                  </div>

                  {ticket.messages && ticket.messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${msg.senderType === 'admin'
                          ? 'bg-purple-600/20 border border-purple-600/50 ml-8'
                          : 'bg-[#1a1a1a] border border-gray-700 mr-8'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{msg.sender}</span>
                        <span className="text-xs text-gray-400">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-200">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="bg-[#1a1a1a] border-gray-700 text-white"
                  rows={3}
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Ticket Info */}
          <div className="w-[300px] space-y-4">
            <Card className="bg-[#2a2a2a] border-gray-700 p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Ticket Information</h3>
              <div className="space-y-3">
                <div>
                  <Label className="text-gray-400">User</Label>
                  <p className="text-white">{ticket.userName}</p>
                  <p className="text-xs text-gray-400">{ticket.userEmail}</p>
                  <Badge variant="secondary" className="mt-1">{ticket.userRole}</Badge>
                </div>
                <div>
                  <Label className="text-gray-400">Category</Label>
                  <p className="text-white capitalize">{ticket.category}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Assigned To</Label>
                  <p className="text-white">{ticket.assignedToId || 'Unassigned'}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Created</Label>
                  <p className="text-white text-sm">{ticket.createdAt}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Last Updated</Label>
                  <p className="text-white text-sm">{ticket.updatedAt}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-[#2a2a2a] border-gray-700 p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Update Status</h3>
              <div className="space-y-3">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleStatusUpdate}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Update Status
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium',
    userName: '',
    userEmail: '',
  });
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

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter
      });
      const res = await fetch(`/api/admin/support?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch, statusFilter, priorityFilter, categoryFilter]);

  const handleSendMessage = async (ticketId: string, message: string) => {
    try {
      const res = await fetch(`/api/admin/support/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sender: 'Admin', senderType: 'admin' })
      });
      if (res.ok) {
        const data = await res.json();
        // Update local state for immediate feedback
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket({
            ...selectedTicket,
            messages: data.messages
          });
        }
        fetchTickets(); // Refresh list to update timestamp
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/support/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchTickets();
        // Close modal if resolved/closed? Or keep open?
        // Optionally refresh selectedTicket if open
        if (selectedTicket && selectedTicket.id === ticketId) {
          const updated = await res.json();
          setSelectedTicket({ ...selectedTicket, status: updated.status });
        }
      }
    } catch (e) { console.error(e); }
  };

  const handleCreateTicket = async () => {
    try {
      const res = await fetch('/api/admin/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket)
      });
      if (res.ok) {
        setShowCreateTicket(false);
        fetchTickets();
        setNewTicket({
          subject: '',
          description: '',
          category: 'general',
          priority: 'medium',
          userName: '',
          userEmail: '',
        });
      }
    } catch (e) { console.error(e); }
  };

  // Stats (Fetch from API or calc from view)
  const stats = {
    totalTickets: tickets.length, // Should be total from API ideally
    openTickets: tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(t => t.status === 'RESOLVED').length,
    urgentTickets: tickets.filter(t => t.priority === 'URGENT').length,
    avgResponseTime: '2.5 hours' // Placeholder
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Support System</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage support tickets and customer queries</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setShowCreateTicket(true)}
            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Tickets</p>
              <p className="text-2xl font-bold text-white">{stats.totalTickets}</p>
            </div>
            <Inbox className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        {/* ... More stats cards ... */}
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Open</p>
              <p className="text-2xl font-bold text-white">{stats.openTickets}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-4">
        <div className="flex flex-wrap gap-4">
          {/* ... Inputs ... */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search tickets..."
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
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="text-gray-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      {/* Tickets Table */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr className="text-left">
                <th className="p-4 text-sm font-medium text-gray-400">Ticket ID</th>
                <th className="p-4 text-sm font-medium text-gray-400">Subject</th>
                <th className="p-4 text-sm font-medium text-gray-400">User</th>
                <th className="p-4 text-sm font-medium text-gray-400">Category</th>
                <th className="p-4 text-sm font-medium text-gray-400">Priority</th>
                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="p-4 text-sm font-medium text-gray-400">Updated</th>
                <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="p-4 text-center text-gray-400">Loading...</td></tr>
              ) : tickets.map((ticket, index) => {
                const CategoryIcon = categoryIcons[ticket.category] || MessageCircle;
                return (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setDetailsModalOpen(true);
                    }}
                  >
                    <td className="p-4">
                      <span className="text-white font-mono">#{ticket.ticketNumber || ticket.id.substring(0, 8)}</span>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium line-clamp-1">{ticket.subject}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{ticket.description}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white text-sm">{ticket.userName}</p>
                      <Badge variant="secondary" className="mt-1">{ticket.userRole}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-white text-sm capitalize">{ticket.category}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${priorityColors[ticket.priority]} text-white`}>
                        {ticket.priority === 'URGENT' && <ArrowUp className="w-3 h-3 mr-1" />}
                        {ticket.priority === 'LOW' && <ArrowDown className="w-3 h-3 mr-1" />}
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={`${statusColors[ticket.status]} text-white`}>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-400">{ticket.updatedAt}</p>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        {/* ... Actions ... */}
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-gray-800">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTicket(ticket);
                              setDetailsModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          {/* Add other status updates */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 p-4">
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
      </Card>

      {/* Ticket Details Modal */}
      <TicketDetailsModal
        ticket={selectedTicket}
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedTicket(null);
        }}
        onSendMessage={handleSendMessage}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Create Ticket Dialog */}
      <Dialog open={showCreateTicket} onOpenChange={setShowCreateTicket}>
        <DialogContent className="bg-[#1a1a1a] border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Support Ticket</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Subject</Label>
              <Input
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
              />
            </div>

            <div>
              <Label className="text-gray-300">User Email</Label>
              <Input
                type="email"
                value={newTicket.userEmail}
                onChange={(e) => setNewTicket({ ...newTicket, userEmail: e.target.value })}
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Category</Label>
                <Select value={newTicket.category} onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}>
                  <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Priority</Label>
                <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                  <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Description</Label>
              <Textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowCreateTicket(false)}>
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleCreateTicket}
            >
              Create Ticket
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
