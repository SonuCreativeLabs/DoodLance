'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MessageSquare, Plus, Clock, CheckCircle, XCircle, AlertCircle, Mail, Phone, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export default function ClientSupportPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Form state
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  useEffect(() => {
    if (user?.id) {
      fetchTickets();
    }
  }, [user?.id]);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`/api/support?userId=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!category || !subject || !description) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          category,
          subject,
          description,
          priority
        })
      });

      if (res.ok) {
        setShowCreateDialog(false);
        setCategory('');
        setSubject('');
        setDescription('');
        setPriority('MEDIUM');
        fetchTickets();
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'IN_PROGRESS':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'RESOLVED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'CLOSED':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'IN_PROGRESS':
        return 'bg-blue-500/20 text-blue-400';
      case 'RESOLVED':
        return 'bg-green-500/20 text-green-400';
      case 'CLOSED':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Support Tickets</h1>
            <p className="text-gray-400 mt-1">Get help from our support team</p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        {/* Contact Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#1a1a1a] border-gray-800 p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-full">
                <Mail className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email Us</p>
                <a href="mailto:connect.bails@gmail.com" className="text-white font-medium hover:text-purple-400 transition-colors">
                  connect.bails@gmail.com
                </a>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-white/10"
              onClick={() => copyToClipboard('connect.bails@gmail.com', 'Email')}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </Card>

          <Card className="bg-[#1a1a1a] border-gray-800 p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-full">
                <Phone className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Call Us</p>
                <a href="tel:6379496755" className="text-white font-medium hover:text-purple-400 transition-colors">
                  6379496755
                </a>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-white/10"
              onClick={() => copyToClipboard('6379496755', 'Phone number')}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </Card>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <Card className="bg-[#1a1a1a] border-gray-800 p-12 text-center">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Support Tickets</h3>
            <p className="text-gray-400 mb-6">You haven't created any support tickets yet</p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Create Your First Ticket
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="bg-[#1a1a1a] border-gray-800 p-6 hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{ticket.subject}</h3>
                        <Badge className={getStatusColor(ticket.status)}>
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1">{ticket.status}</span>
                        </Badge>
                        <Badge variant="outline" className="border-purple-600 text-purple-400">
                          {ticket.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Ticket #{ticket.ticketNumber.slice(0, 8)}</span>
                        <span>•</span>
                        <span>Priority: {ticket.priority}</span>
                        <span>•</span>
                        <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Ticket Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-[#1a1a1a] border-gray-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Create Support Ticket</DialogTitle>
              <DialogDescription className="text-gray-400">
                Describe your issue and our support team will assist you
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="text-white">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAYMENT_ISSUE">Payment Issue</SelectItem>
                    <SelectItem value="JOB_DISPUTE">Job Dispute</SelectItem>
                    <SelectItem value="ACCOUNT_ISSUE">Account Issue</SelectItem>
                    <SelectItem value="TECHNICAL_ISSUE">Technical Issue</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Subject</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of the issue"
                  className="bg-[#2a2a2a] border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed information about your issue"
                  className="bg-[#2a2a2a] border-gray-700 text-white min-h-[120px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTicket}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Create Ticket
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Ticket Dialog */}
        {selectedTicket && (
          <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
            <DialogContent className="bg-[#1a1a1a] border-gray-800 max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-white">{selectedTicket.subject}</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Ticket #{selectedTicket.ticketNumber.slice(0, 8)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedTicket.status)}>
                    {selectedTicket.status}
                  </Badge>
                  <Badge variant="outline">{selectedTicket.category}</Badge>
                  <Badge variant="secondary">Priority: {selectedTicket.priority}</Badge>
                </div>

                <div>
                  <Label className="text-gray-400">Description</Label>
                  <p className="text-white mt-2">{selectedTicket.description}</p>
                </div>

                {selectedTicket.resolution && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <Label className="text-green-400">Resolution</Label>
                    <p className="text-white mt-2">{selectedTicket.resolution}</p>
                  </div>
                )}

                <div className="text-xs text-gray-500 pt-4 border-t border-gray-800">
                  Created: {new Date(selectedTicket.createdAt).toLocaleString()}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
