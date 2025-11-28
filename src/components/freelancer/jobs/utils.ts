import { format } from 'date-fns';
import { StatusType, Job } from './types';

// Category mapping for display
export const getCategoryDisplayName = (category: string) => {
  const categoryMap: Record<string, string> = {
    'Match Player': 'Match Player',
    'Net Bowler': 'Net Bowler',
    'Net Batsman': 'Net Batsman',
    'Sidearm': 'Sidearm',
    'Coach': 'Coach',
    'Sports Conditioning Trainer': 'Sports Conditioning Trainer',
    'Fitness Trainer': 'Fitness Trainer',
    'Analyst': 'Analyst',
    'Physio': 'Physio',
    'Scorer': 'Scorer',
    'Umpire': 'Umpire',
    'Cricket Photo / Videography': 'Cricket Photo / Videography',
    'Cricket Content Creator': 'Cricket Content Creator',
    'Commentator': 'Commentator',
    'OTHER': 'Other Services'
  };
  return categoryMap[category] || category;
};

// Function to format time in 12-hour format with AM/PM
export const formatTime12Hour = (timeString: string): string => {
  if (!timeString) return '';
  
  try {
    // Handle both 24h and 12h formats
    const [hours, minutes] = timeString.split(':');
    let h = parseInt(hours, 10);
    const m = parseInt(minutes, 10) || 0;
    const ampm = h >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    h = h % 12;
    h = h === 0 ? 12 : h; // Convert 0 to 12 for 12 AM
    
    // Format minutes with leading zero
    const formattedMinutes = m < 10 ? `0${m}` : m;
    
    return `${h}:${formattedMinutes} ${ampm}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString; // Return original if there's an error
  }
};

// Function to format time remaining
export const formatTimeRemaining = (dateTimeString: string) => {
  const now = new Date();
  const jobDate = new Date(dateTimeString);
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

export const calculateJobEarnings = (job: Job) => {
  const baseAmount = typeof job.payment === 'string' ? parseFloat(job.payment) : job.payment;

  // Default platform commission rate (10%)
  const commissionRate = 0.10;

  // GST rate (18% standard Indian rate)
  const gstRate = 0.18;

  // Calculate tips (could be from job data or default to 0)
  const tips = job.earnings?.tips || 0;

  // Calculate add-on services total
  const addOnServicesTotal = job.addOnServices?.reduce((total, service) => total + service.price, 0) || 0;

  // Calculate subtotal (base + tips + add-ons)
  const subtotal = baseAmount + tips + addOnServicesTotal;

  // Calculate platform commission (10% of subtotal including tips)
  const platformCommission = Math.round(subtotal * commissionRate);

  // Calculate GST on the subtotal (18% GST on total earnings)
  const gst = Math.round(subtotal * gstRate);

  // Calculate total earnings (subtotal - platform fee - GST)
  const totalEarnings = subtotal - platformCommission - gst;

  // Alternative GST calculation methods (commented out)
  // Method 1: GST on full amount before platform fee
  // const fullAmount = baseAmount + tips + addOnServicesTotal;
  // const altGST1 = Math.round(fullAmount * gstRate);
  // const altTotal1 = fullAmount - platformCommission + altGST1;

  // Method 2: GST calculated but shown as deduction (if user wants net after GST)
  // const gstDeduction = Math.round(subtotal * gstRate);
  // const altTotal2 = subtotal - gstDeduction;

  return {
    baseAmount,
    tips,
    addOnServices: addOnServicesTotal,
    platformCommission,
    gst,
    totalEarnings,
    commissionRate,
    gstRate,
    // Alternative calculations available:
    // altGST1, altTotal1, altTotal2,
    breakdown: {
      baseAmount,
      tips,
      addOnServices: job.addOnServices?.map(service => ({
        name: service.name,
        amount: service.price
      })) || [],
      platformCommission,
      gst,
      totalEarnings
    }
  };
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
  upcoming: { 
    bg: 'bg-amber-500/10', 
    text: 'text-amber-400', 
    border: 'border-amber-500/20',
    shadow: 'shadow-amber-500/10'
  },
  ongoing: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    shadow: 'shadow-blue-500/10'
  },
  started: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    border: 'border-green-500/20',
    shadow: 'shadow-green-500/10'
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
  withdrawn: { 
    bg: 'bg-gray-500/10', 
    text: 'text-gray-400', 
    border: 'border-gray-500/20',
    shadow: 'shadow-gray-500/10'
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
