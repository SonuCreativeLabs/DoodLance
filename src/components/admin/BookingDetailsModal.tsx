'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
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
  Calendar, Clock, MapPin, DollarSign, User,
  CheckCircle, MessageSquare, Phone, Mail
} from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  CONFIRMED: 'bg-blue-500',
  IN_PROGRESS: 'bg-purple-500',
  COMPLETED: 'bg-green-500',
  CANCELLED: 'bg-gray-500',
  DISPUTED: 'bg-red-500',
  REFUNDED: 'bg-orange-500',
};

interface BookingDetailsModalProps {
  booking: any;
  open: boolean;
  onClose: () => void;
  onStatusChange: (bookingId: string, newStatus: string) => void;
}

export function BookingDetailsModal({ booking, open, onClose, onStatusChange }: BookingDetailsModalProps) {
  const [status, setStatus] = useState(booking?.status || '');
  const [resolution, setResolution] = useState('');

  if (!booking) return null;

  const handleStatusUpdate = () => {
    onStatusChange(booking.id, status);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-[#1a1a1a] border-gray-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white">Booking Details</DialogTitle>
            <Badge className={`${statusColors[booking.status]} text-white`}>
              {booking.status}
            </Badge>
          </div>
          <DialogDescription className="text-gray-400">
            Booking ID: {booking.id} | Created: {booking.createdAt}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Info */}
          <Card className="bg-[#2a2a2a] border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Service Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Service:</span>
                <span className="text-sm text-white font-medium">{booking.serviceTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Category:</span>
                <Badge variant="secondary">{booking.serviceCategory}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Price:</span>
                <span className="text-sm text-white">₹{booking.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Platform Fee:</span>
                <span className="text-sm text-purple-400">₹{booking.platformFee}</span>
              </div>
            </div>
          </Card>

          {/* Schedule & Location */}
          <Card className="bg-[#2a2a2a] border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Schedule & Location</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white">
                <Calendar className="w-4 h-4 text-gray-400" />
                {booking.scheduledAt}
              </div>
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-4 h-4 text-gray-400" />
                {booking.duration} minutes
              </div>
              <div className="flex items-center gap-2 text-white">
                <MapPin className="w-4 h-4 text-gray-400" />
                {booking.location}
              </div>
            </div>
          </Card>

          {/* Client & Freelancer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-[#2a2a2a] border-gray-700 p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Client Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <User className="w-4 h-4 text-gray-400" />
                  {booking.clientName}
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {booking.clientEmail}
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {booking.clientPhone}
                </div>
              </div>
            </Card>

            <Card className="bg-[#2a2a2a] border-gray-700 p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Freelancer Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <User className="w-4 h-4 text-gray-400" />
                  {booking.freelancerName}
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {booking.freelancerEmail}
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {booking.freelancerPhone}
                </div>
              </div>
            </Card>
          </div>

          {/* Progress */}
          {booking.progress > 0 && (
            <Card className="bg-[#2a2a2a] border-gray-700 p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Progress</h3>
              <Progress value={booking.progress} className="mb-2" />
              <p className="text-sm text-gray-400">{booking.progress}% Complete</p>

              {booking.milestones && (
                <div className="mt-4 space-y-2">
                  {booking.milestones.map((milestone: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      {milestone.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                      )}
                      <span className={`text-sm ${milestone.completed ? 'text-white' : 'text-gray-500'}`}>
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Notes */}
          {booking.notes && (
            <Card className="bg-[#2a2a2a] border-gray-700 p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Notes</h3>
              <p className="text-sm text-white">{booking.notes}</p>
            </Card>
          )}

          {/* Dispute Info */}
          {booking.status === 'DISPUTED' && (
            <Card className="bg-red-500/10 border-red-500/50 p-4">
              <h3 className="text-sm font-medium text-red-400 mb-3">Dispute Details</h3>
              <p className="text-sm text-white mb-2">{booking.disputeReason}</p>
              <p className="text-xs text-gray-400">Raised at: {booking.disputeRaisedAt}</p>

              <div className="mt-4 space-y-2">
                <Label className="text-gray-300">Resolution Notes</Label>
                <Textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Enter resolution details..."
                  className="bg-[#2a2a2a] border-gray-700 text-white"
                  rows={3}
                />
              </div>
            </Card>
          )}

          {/* Review */}
          {booking.status === 'COMPLETED' && booking.rating && (
            <Card className="bg-green-500/10 border-green-500/50 p-4">
              <h3 className="text-sm font-medium text-green-400 mb-3">Review</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < Math.floor(booking.rating) ? '★' : '☆'}</span>
                  ))}
                </div>
                <span className="text-white">{booking.rating}</span>
              </div>
              <p className="text-sm text-white">{booking.review}</p>
            </Card>
          )}

          {/* Status Update */}
          <Card className="bg-[#2a2a2a] border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Update Status</h3>
            <div className="flex gap-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="flex-1 bg-[#1a1a1a] border-gray-700 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleStatusUpdate}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Update
              </Button>
            </div>
          </Card>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Close</Button>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {booking.clientPhone && booking.clientPhone !== 'N/A' && (
              <Button
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                onClick={() => window.location.href = `tel:${booking.clientPhone}`}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Client
              </Button>
            )}

            {booking.freelancerPhone && booking.freelancerPhone !== 'N/A' && (
              <Button
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                onClick={() => window.location.href = `tel:${booking.freelancerPhone}`}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Freelancer
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
