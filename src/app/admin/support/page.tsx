'use client';

import { useState } from 'react';
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
// import { ScrollArea } from '@/components/ui/scroll-area';
import { mockTickets } from '@/lib/mock/support-data';

const priorityColors: Record<string, string> = {
  low: 'bg-gray-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
};

const statusColors: Record<string, string> = {
  open: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  resolved: 'bg-green-500',
  closed: 'bg-gray-500'
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
            <DialogTitle className="text-white">Support Ticket #{ticket.id}</DialogTitle>
            <div className="flex items-center gap-2">
              <Badge className={`${priorityColors[ticket.priority]} text-white`}>
                {ticket.priority}
              </Badge>
              <Badge className={`${statusColors[ticket.status]} text-white`}>
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
                  {ticket.messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${
                        msg.senderType === 'admin'
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
                  <p className="text-white">{ticket.assignedTo || 'Unassigned'}</p>
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
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
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
  const [tickets, setTickets] = useState(mockTickets);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSendMessage = (ticketId: string, message: string) => {
    const newMessage = {
      id: `MSG${Date.now()}`,
      sender: 'Admin',
      senderType: 'admin',
      message,
      timestamp: new Date().toLocaleString()
    };

    setTickets(tickets.map(t => 
      t.id === ticketId 
        ? { ...t, messages: [...t.messages, newMessage], updatedAt: newMessage.timestamp }
        : t
    ));
  };

  const handleUpdateStatus = (ticketId: string, newStatus: string) => {
    setTickets(tickets.map(t => 
      t.id === ticketId 
        ? { 
            ...t, 
            status: newStatus,
            updatedAt: new Date().toLocaleString(),
            ...(newStatus === 'resolved' ? { resolvedAt: new Date().toLocaleString() } : {})
          }
        : t
    ));
  };

  // Stats
  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    urgentTickets: tickets.filter(t => t.priority === 'urgent').length,
    avgResponseTime: '2.5 hours'
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
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Open</p>
              <p className="text-2xl font-bold text-white">{stats.openTickets}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Resolved</p>
              <p className="text-2xl font-bold text-white">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Urgent</p>
              <p className="text-2xl font-bold text-white">{stats.urgentTickets}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Response</p>
              <p className="text-2xl font-bold text-white">{stats.avgResponseTime}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
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

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px] bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px] bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="dispute">Dispute</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="verification">Verification</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setPriorityFilter('all');
              setCategoryFilter('all');
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
              {paginatedTickets.map((ticket, index) => {
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
                      <span className="text-white font-mono">#{ticket.id}</span>
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
                        {ticket.priority === 'urgent' && <ArrowUp className="w-3 h-3 mr-1" />}
                        {ticket.priority === 'low' && <ArrowDown className="w-3 h-3 mr-1" />}
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
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-gray-800">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTicket(ticket);
                              setDetailsModalOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(ticket.id, 'in_progress');
                            }}
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Mark In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-green-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(ticket.id, 'resolved');
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Resolved
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(ticket.id, 'closed');
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Close Ticket
                          </DropdownMenuItem>
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
        <div className="flex items-center justify-between p-4 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTickets.length)} of {filteredTickets.length} tickets
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
            <DialogDescription className="text-gray-400">
              Create a new support ticket for customer assistance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Subject</Label>
              <Input
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                placeholder="Enter ticket subject"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">User Name</Label>
              <Input
                value={newTicket.userName}
                onChange={(e) => setNewTicket({ ...newTicket, userName: e.target.value })}
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                placeholder="Enter user name"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">User Email</Label>
              <Input
                type="email"
                value={newTicket.userEmail}
                onChange={(e) => setNewTicket({ ...newTicket, userEmail: e.target.value })}
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                placeholder="Enter user email"
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
                    <SelectItem value="booking">Booking</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="verification">Verification</SelectItem>
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
                placeholder="Describe the issue in detail"
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
              onClick={() => {
                const ticketId = `TK${String(tickets.length + 1).padStart(3, '0')}`;
                const now = new Date().toLocaleString();
                const ticket = {
                  id: ticketId,
                  ...newTicket,
                  status: 'open',
                  userId: `USR${Math.floor(Math.random() * 100)}`,
                  userRole: 'client',
                  assignedTo: 'Unassigned',
                  createdAt: now,
                  updatedAt: now,
                  messages: []
                };
                setTickets([ticket, ...tickets]);
                setShowCreateTicket(false);
                setNewTicket({
                  subject: '',
                  description: '',
                  category: 'general',
                  priority: 'medium',
                  userName: '',
                  userEmail: '',
                });
              }}
            >
              Create Ticket
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
