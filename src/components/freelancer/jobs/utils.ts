import { format } from 'date-fns';
import { StatusType } from './types';

// Function to format time remaining
export const formatTimeRemaining = (dateString: string) => {
  const now = new Date();
  const jobDate = new Date(dateString);
  const diffMs = jobDate.getTime() - now.getTime();
  
  if (diffMs <= 0) return '00:00:00';
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Format date
export const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM d, yyyy');
};

// Status colors mapping with modern design
export const statusColors = {
  // Job status colors
  pending: { 
    bg: 'bg-amber-500/10', 
    text: 'text-amber-400', 
    border: 'border-amber-500/20',
    shadow: 'shadow-amber-500/10'
  },
  confirmed: { 
    bg: 'bg-blue-500/10', 
    text: 'text-blue-400', 
    border: 'border-blue-500/20',
    shadow: 'shadow-blue-500/10'
  },
  completed: { 
    bg: 'bg-emerald-500/10', 
    text: 'text-emerald-400', 
    border: 'border-emerald-500/20',
    shadow: 'shadow-emerald-500/10'
  },
  cancelled: { 
    bg: 'bg-rose-500/10', 
    text: 'text-rose-400', 
    border: 'border-rose-500/20',
    shadow: 'shadow-rose-500/10'
  },
  // Application status colors
  accepted: { 
    bg: 'bg-emerald-500/10', 
    text: 'text-emerald-400', 
    border: 'border-emerald-500/20',
    shadow: 'shadow-emerald-500/10'
  },
  rejected: { 
    bg: 'bg-rose-500/10', 
    text: 'text-rose-400', 
    border: 'border-rose-500/20',
    shadow: 'shadow-rose-500/10'
  },
  // Transaction status colors
  paid: { 
    bg: 'bg-emerald-500/10', 
    text: 'text-emerald-400', 
    border: 'border-emerald-500/20',
    shadow: 'shadow-emerald-500/10'
  },
  failed: { 
    bg: 'bg-rose-500/10', 
    text: 'text-rose-400', 
    border: 'border-rose-500/20',
    shadow: 'shadow-rose-500/10'
  },
  pending_payment: { 
    bg: 'bg-amber-500/10', 
    text: 'text-amber-400', 
    border: 'border-amber-500/20',
    shadow: 'shadow-amber-500/10'
  }
} as const;

// Helper function to get status styles with fallback
type StatusKey = keyof typeof statusColors;

export const getStatusStyles = (status: StatusType) => {
  const statusKey = status as StatusKey;
  // All status keys now have the required properties, so we can safely access them
  return statusColors[statusKey] || statusColors.pending;
};
