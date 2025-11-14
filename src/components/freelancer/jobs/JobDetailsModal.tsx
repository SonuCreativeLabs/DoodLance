'use client';

import { X, MessageCircle, Phone, MapPin, CalendarIcon, ClockIcon, IndianRupee, ArrowLeft, AlertCircle, User, UserCheck, Star, ChevronDown, ChevronUp, CheckCircle, MessageSquare, AlertTriangle, TrendingUp, Info, XCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { calculateJobEarnings, getCategoryDisplayName } from './utils';
import { Job } from './types';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ClientProfile } from './ClientProfile';
import { SuccessMessage } from '@/components/ui/success-message';
import { CollapsibleTimeline, createTimelineItems } from './CollapsibleTimeline';
import { getJobDurationLabel, getWorkModeLabel } from '@/app/freelancer/feed/types';

// Experience level mapping for display
const getExperienceLevelDisplayName = (level: string) => {
  const levelMap: Record<string, string> = {
    'Beginner': 'Beginner',
    'Intermediate': 'Intermediate',
    'Expert': 'Expert',
    'Professional': 'Professional'
  };
  return levelMap[level] || level;
};

interface CancellationDetails {
  cancelledBy: 'client' | 'freelancer';
  cancelledAt: string;
  notes?: string;
}

interface ClientInfo {
  name: string;
  phoneNumber?: string;
  rating?: number;
  jobsCompleted?: number;
  experienceLevel?: string;
  image?: string;
  memberSince?: string;
  freelancerAvatars?: string[];
  freelancersWorked?: number;
  moneySpent?: number;
  location?: string;
}

interface JobDetailsModalProps {
  job: Job;
  onClose?: () => void;
  onJobUpdate?: (jobId: string, newStatus: 'completed' | 'cancelled' | 'started', notes?: string, completionData?: {rating: number, review: string, feedbackChips: string[]}) => void;
  initialShowComplete?: boolean;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function JobDetailsModal({ job, onClose, onJobUpdate, initialShowComplete = false }: JobDetailsModalProps) {
  console.log('JobDetailsModal received job data:', {
    id: job.id,
    status: job.status,
    hasFreelancerRating: !!job.freelancerRating,
    freelancerRating: job.freelancerRating,
    completedAt: job.completedAt
  });
  const router = useRouter();
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(initialShowComplete);
  const [showStartJobDialog, setShowStartJobDialog] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [activeDigitIndex, setActiveDigitIndex] = useState(-1);
  const [jobStarted, setJobStarted] = useState(false);
  const [jobOtp, setJobOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [cancelNotes, setCancelNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [isEarningsExpanded, setIsEarningsExpanded] = useState(false);
  const [isClientProfileExpanded, setIsClientProfileExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [showFreelancerRating, setShowFreelancerRating] = useState(false);

  // Success message states
  const [successMessage, setSuccessMessage] = useState<{
    message: string;
    description?: string;
    variant?: 'success' | 'warning' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    description: '',
    variant: 'success',
    isVisible: false
  });

  // Helper function to show success messages
  const showSuccessMessage = (
    message: string,
    description?: string,
    variant: 'success' | 'warning' | 'info' = 'success'
  ) => {
    setSuccessMessage({
      message,
      description,
      variant,
      isVisible: true
    });

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setSuccessMessage(prev => ({ ...prev, isVisible: false }));
    }, 5000);
  };

  // Generate OTP when component loads or check for existing OTP
  useEffect(() => {
    // Check if job already has an OTP
    if (job.otp) {
      setJobOtp(job.otp);
    } else {
      // Use fixed OTP 1234 for testing (instead of random generation)
      const testOtp = '1234';
      setJobOtp(testOtp);
    }

    // Check if job is already started
    if (job.status === 'started' || job.startedAt) {
      setJobStarted(true);
    }
  }, [job]);

  // Initialize map when showMap changes
  useEffect(() => {
    if (!showMap || mapInstance.current || !mapRef.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      setMapError('Mapbox access token is not configured');
      return;
    }
    mapboxgl.accessToken = token;
    setMapLoading(true);
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [80.2707, 13.0827],
      zoom: 12,
      attributionControl: false
    });
    mapInstance.current = map;
    const onLoad = async () => {
      try {
        // Add common map controls
        const nav = new mapboxgl.NavigationControl({ showCompass: false, visualizePitch: false });
        map.addControl(nav, 'top-right');

        const fullscreen = new mapboxgl.FullscreenControl();
        map.addControl(fullscreen, 'top-right');

        const geolocate = new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
          showUserHeading: true,
          showUserLocation: true,
          fitBoundsOptions: { maxZoom: 15 }
        });
        map.addControl(geolocate, 'top-right');
        
        // Request geolocation when map loads
        geolocate.on('geolocate', (e: any) => {
          const { longitude, latitude } = e.coords;
          map.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            essential: true
          });
        });

        const scale = new mapboxgl.ScaleControl({ maxWidth: 120, unit: 'metric' });
        map.addControl(scale, 'bottom-left');
      } catch (e) {
        // Controls are non-critical; ignore control init errors
      }
      try {
        const resp = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(job.location)}.json?access_token=${token}&limit=1`);
        const data = await resp.json();
        const feature = data?.features?.[0];
        if (feature?.center && Array.isArray(feature.center)) {
          const [lng, lat] = feature.center;
          map.flyTo({ center: [lng, lat], zoom: 13, essential: true });
          new mapboxgl.Marker({ color: '#1d59eb' }).setLngLat([lng, lat]).addTo(map);
        }
      } catch (e) {
        setMapError('Failed to locate the address on the map');
      } finally {
        setMapLoading(false);
      }
    };
    map.on('load', onLoad);
    const onError = () => setMapLoading(false);
    map.on('error', onError);
    return () => {
      map.off('load', onLoad);
      map.off('error', onError);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [showMap, job.location]);

  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newDigits = [...otpDigits];
    newDigits[index] = value.replace(/[^0-9]/g, '');
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      nextInput?.focus();
    }

    // Update the combined OTP string
    setOtpInput(newDigits.join(''));
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpFocus = (index: number) => {
    setActiveDigitIndex(index);
  };

  const handleOtpBlur = () => {
    setActiveDigitIndex(-1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    const newDigits = paste.split('').concat(['', '', '', '']).slice(0, 4);
    setOtpDigits(newDigits);
    setOtpInput(paste);
  };

  // Helper function to check if 8 hours have passed since completion
  const isWithin8Hours = (completedAt?: string) => {
    if (!completedAt) return true;
    const completionTime = new Date(completedAt).getTime();
    const now = new Date().getTime();
    const eightHoursInMs = 8 * 60 * 60 * 1000;
    return (now - completionTime) < eightHoursInMs;
  };

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  // Handle button actions
  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to inbox with specific job chat selection
    router.push(`/freelancer/inbox?jobId=${job.id}`);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (job.client?.phoneNumber) {
      // Show phone number and allow user to call
      const phoneNumber = job.client.phoneNumber;
      if (confirm(`Call client at ${phoneNumber}?`)) {
        // In a real app, this would initiate a call
        // For demo purposes, we'll show the number
        alert(`Calling ${phoneNumber}\n\nIn a real application, this would initiate a phone call.`);
      }
    } else {
      alert('Phone number not available for this client.');
    }
  };

  const handleCancelJob = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Cancel button clicked'); // Debug log
    setShowCancelDialog(true);
  };

  const confirmCancelJob = async () => {
    if (!cancelNotes.trim()) {
      alert('Please provide a reason for cancellation.');
      return;
    }

    try {
      console.log('Attempting to cancel job:', job.id);
      console.log('API URL:', `http://localhost:3000/api/jobs/${job.id}`);

      const response = await fetch(`http://localhost:3000/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'cancelled',
          notes: cancelNotes,
          cancelledBy: 'freelancer',
          cancelledAt: new Date().toISOString()
        }),
      });

      console.log('Cancel API response status:', response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log('Cancel API success:', responseData);
        // Show success message
        showSuccessMessage(
          'Job Cancelled!',
          'The job has been cancelled successfully.',
          'warning'
        );
        if (onJobUpdate) onJobUpdate(job.id, 'cancelled', cancelNotes);
        setShowCancelDialog(false);
        setCancelNotes('');
      } else {
        const errorData = await response.json();
        console.error('Cancel API error response:', errorData);
        alert(`Failed to cancel job: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error cancelling job:', error);
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      alert(`Failed to cancel job: ${errorMessage}`);
    }
  };

  const handleStartJob = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Start job button clicked'); // Debug log
    setShowStartJobDialog(true);
  };

  const confirmStartJob = async () => {
    if (otpInput !== jobOtp) {
      setOtpError('Invalid verification code. Please try again.');
      setOtpInput('');
      setOtpDigits(['', '', '', '']);
      return;
    }

    // Clear any previous error
    setOtpError('');

    try {
      console.log('Starting job:', job.id);

      const response = await fetch(`http://localhost:3000/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'started',
          startedAt: new Date().toISOString(),
          otpVerified: true,
          otp: jobOtp, // Save the OTP to the job for reference
          originalJobData: job // Pass the complete original job data
        }),
      });

      if (response.ok) {
        console.log('Job started successfully');
        setJobStarted(true);
        setShowStartJobDialog(false);
        setOtpInput('');
        setOtpDigits(['', '', '', '']);

        // Save job status update to localStorage and update dashboard
        if (onJobUpdate) {
          onJobUpdate(job.id, 'started');
        }

        // Show success message
        showSuccessMessage(
          'Job Started!',
          'You can now proceed with the work.',
          'success'
        );
      } else {
        const errorData = await response.json();
        console.error('Start job error:', errorData);
        alert(`Failed to start job: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error starting job:', error);
      alert('Failed to start job. Please try again.');
    }
  };

  const handleMarkComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Mark complete button clicked'); // Debug log

    // Check if job is started
    if (!jobStarted) {
      alert('Please start the job first before marking it as complete.');
      return;
    }

    setShowCompleteDialog(true);
  };

  const confirmMarkComplete = async () => {

    try {
      console.log('Attempting to complete job:', job.id);
      console.log('API URL:', `http://localhost:3000/api/jobs/${job.id}`);

      const response = await fetch(`http://localhost:3000/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          freelancerRating: {
            stars: rating,
            review: review.trim(), // Keep only the review text, not the chips
            feedbackChips: selectedChips,
            date: new Date().toISOString()
          },
          originalJobData: job // Pass the complete original job data
        }),
      });

      console.log('Complete API response status:', response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log('Complete API success:', responseData);

        // Clear form data first
        setReview('');
        setRating(0);
        setSelectedChips([]);

        // Close modal AFTER data processing is complete
        setShowCompleteDialog(false);

        // Call the parent handler to update the job status
        if (onJobUpdate) {
          onJobUpdate(job.id, 'completed', undefined, {
            rating: rating,
            review: review.trim(), // Keep only the review text, not the chips
            feedbackChips: selectedChips
          });
        }

        // Show success message
        showSuccessMessage(
          'Job Completed!',
          'Payment will be processed shortly.',
          'success'
        );
      } else {
        const errorData = await response.json();
        console.error('Complete API error response:', errorData);
        alert(`Failed to complete job: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error completing job:', error);
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      alert(`Failed to complete job: ${errorMessage}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] z-[9999] w-screen h-screen overflow-y-auto">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-white/80" />
          </button>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base font-medium text-white">
              {jobStarted || job.status === 'started'
                ? 'Ongoing Job'
                : job.status === 'upcoming' || job.status === 'pending'
                  ? 'Upcoming Job'
                  : job.status === 'completed'
                    ? 'Completed Job'
                    : 'Cancelled Job'}
            </h2>
            <span className="text-xs font-medium text-white/60">
              {getCategoryDisplayName(job.category)}
            </span>
          </div>
        </div>
        <div className="text-xs font-mono text-white/60">{job.id}</div>
      </div>

      {/* Main Content */}
      <main className="pt-20 pb-32 px-4 w-full max-w-4xl mx-auto">
        {/* Client Rating Section - Show prominently at top */}
        {job.status === 'completed' && job.clientRating && (
          <div className="mb-6">
            {/* Rating Header */}
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-white">Client's Rating</h2>
              <p className="text-sm text-gray-400">What the client thought about your work</p>
            </div>

            {/* Stars in full width */}
            <div className="flex justify-center mb-2">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-14 h-14 ${star <= (job.clientRating?.stars || 0) ? 'text-yellow-400 fill-current' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    style={star <= (job.clientRating?.stars || 0) ? {} : { color: '#404040' }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Star count below */}
            <p className="text-center text-lg font-bold text-white mb-4">
              {job.clientRating?.stars} stars
            </p>

            {/* Client feedback */}
            {job.clientRating?.feedback && (
              <p className="text-center text-sm text-gray-300 mb-4 leading-relaxed max-w-2xl mx-auto">
                "{job.clientRating.feedback}"
              </p>
            )}

            {/* Client feedback chips */}
            {job.clientRating?.feedbackChips && job.clientRating.feedbackChips.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                {job.clientRating.feedbackChips.map((chip: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300 border border-purple-500/30"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cancellation Notes - Show for cancelled jobs */}
        {job.status === 'cancelled' && job.cancellationDetails && (
          <div className="mb-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-400 mb-2">Job Cancelled</h3>
                  <div className="space-y-2">
                    <div className="text-sm text-white/80">
                      <span className="font-medium">Reason:</span> {job.cancellationDetails.notes}
                    </div>
                    <div className="text-xs text-white/60">
                      Cancelled on {new Date(job.cancellationDetails.cancelledAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Separator - Between freelancer and client ratings */}
        {job.status === 'completed' && job.freelancerRating && job.clientRating && (
          <div className="relative flex items-center justify-center py-4 mb-4">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"></div>

            {/* Decorative Elements */}
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2">
              <div className="flex justify-center">
                <div className="w-32 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              </div>
            </div>

            {/* Cricket Ball Icon */}
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/30 border border-blue-500/40 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 border-2 border-white/20 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🤝</span>
                </div>
              </div>
            </div>

            {/* Side Decorations */}
            <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-blue-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        )}


        {/* Earnings Section - Moved above Job Title and Location */}
        {job.status === 'completed' && (
          <div className="mt-2 mb-2">
            {/* Calculate earnings preview for the job */}
            {(() => {
              const earningsPreview = calculateJobEarnings(job);

              return (
                <>
                  {/* Total Earnings */}
                  <div className="rounded-xl border border-white/10 overflow-hidden">
                    {/* Title Section - Black Background */}
                    <div className="bg-[#111111] p-3 border-b border-white/10 group">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-white" aria-label="Click the toggle button to see detailed earnings breakdown">Total Earnings</h2>
                        </div>
                        <button
                          onClick={() => setIsEarningsExpanded(!isEarningsExpanded)}
                          className="text-white/60 hover:text-white transition-colors"
                          aria-label={isEarningsExpanded ? "Collapse earnings breakdown" : "Expand to see detailed earnings breakdown"}
                        >
                          {isEarningsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Content Section - Green Background */}
                    <div className="bg-gradient-to-br from-green-900/20 via-green-800/10 to-emerald-900/20 p-3 relative">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-full blur-xl"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 bg-emerald-500/10 rounded-full blur-lg"></div>

                      <div className="relative">
                        {!isEarningsExpanded ? (
                          /* Collapsed Mode - Only Total */
                          <div className="text-center py-3">
                            <div className="text-4xl font-bold text-green-400 mb-2">
                              ₹{earningsPreview.totalEarnings.toLocaleString('en-IN')}
                            </div>
                            <p className="text-green-300 text-sm font-medium mb-1">💰 Money in the Bank!</p>
                            <p className="text-gray-400 text-xs">Click to see breakdown</p>
                          </div>
                        ) : (
                          /* Expanded Mode - Simple List with Descriptions */
                          <div className="space-y-2">
                            {/* Base Payment */}
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-800 group">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-300 font-medium">Base Payment</span>
                                  <div className="relative inline-block">
                                    <Info
                                      className="w-3 h-3 text-gray-400 hover:text-white transition-colors"
                                      onMouseEnter={(e) => {
                                        const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                        if (tooltip) tooltip.style.display = 'block';
                                      }}
                                      onMouseLeave={(e) => {
                                        const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                        if (tooltip) tooltip.style.display = 'none';
                                      }}
                                      aria-label="Information about base payment"
                                      role="button"
                                      tabIndex={0}
                                    />
                                    <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#111111] border border-gray-600 rounded-lg shadow-xl hidden tooltip-container"
                                         style={{ left: '50%', transform: 'translateX(-50%)' }}>
                                      <div className="text-xs text-gray-300 leading-relaxed text-center whitespace-nowrap">
                                        The agreed payment amount<br />for this job
                                      </div>
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#111111] border-r border-b border-gray-600 rotate-45 tooltip-arrow"></div>
                                    </div>
                                  </div>
                                </div>
                                <span className="text-white font-semibold">₹{job.payment?.toLocaleString('en-IN') || '0'}</span>
                              </div>

                            {/* Add-on Services */}
                            {earningsPreview.breakdown.addOnServices.length > 0 ? (
                              <div className="py-1.5 border-b border-gray-800">
                                  <div className="mb-2 flex items-center gap-2">
                                    <span className="text-gray-300 font-medium">Add-on Services</span>
                                    <div className="relative inline-block">
                                      <Info
                                        className="w-3 h-3 text-gray-400 hover:text-white transition-colors"
                                        onMouseEnter={(e) => {
                                          const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                          if (tooltip) tooltip.style.display = 'block';
                                        }}
                                        onMouseLeave={(e) => {
                                          const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                          if (tooltip) tooltip.style.display = 'none';
                                        }}
                                        aria-label="Information about add-on services"
                                        role="button"
                                        tabIndex={0}
                                      />
                                      <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#111111] border border-gray-600 rounded-lg shadow-xl hidden tooltip-container"
                                           style={{ left: '50%', transform: 'translateX(-50%)' }}>
                                        <div className="text-xs text-gray-300 leading-relaxed text-center whitespace-nowrap">
                                          Additional services requested<br />by the client beyond the original scope
                                        </div>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#111111] border-r border-b border-gray-600 rotate-45 tooltip-arrow"></div>
                                      </div>
                                    </div>
                                  </div>
                                <div className="space-y-1 ml-4">
                                  {earningsPreview.breakdown.addOnServices.map((addon: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between py-1">
                                      <span className="text-gray-300 text-sm">{addon.name}</span>
                                      <span className="text-white font-medium">+₹{addon.amount.toLocaleString('en-IN')}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between py-1.5 border-b border-gray-800 group">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-300 font-medium">Add-on Services</span>
                                  <div className="relative inline-block">
                                    <Info
                                      className="w-3 h-3 text-gray-400 hover:text-white transition-colors"
                                      onMouseEnter={(e) => {
                                        const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                        if (tooltip) tooltip.style.display = 'block';
                                      }}
                                      onMouseLeave={(e) => {
                                        const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                        if (tooltip) tooltip.style.display = 'none';
                                      }}
                                      aria-label="Information about add-on services"
                                      role="button"
                                      tabIndex={0}
                                    />
                                    <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#111111] border border-gray-600 rounded-lg shadow-xl hidden tooltip-container"
                                         style={{ left: '50%', transform: 'translateX(-50%)' }}>
                                      <div className="text-xs text-gray-300 leading-relaxed text-center whitespace-nowrap">
                                        Additional services requested<br />by the client beyond the original scope
                                      </div>
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#111111] border-r border-b border-gray-600 rotate-45 tooltip-arrow"></div>
                                    </div>
                                  </div>
                                </div>
                                <span className="text-white font-medium">₹{earningsPreview.addOnServices.toLocaleString('en-IN')}</span>
                              </div>
                            )}

                            {/* Tips */}
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-800 group">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-300 font-medium">Client Tips</span>
                                <div className="relative inline-block">
                                  <Info
                                    className="w-3 h-3 text-gray-400 hover:text-white transition-colors cursor-help"
                                    onMouseEnter={(e) => {
                                      const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (tooltip) tooltip.style.display = 'block';
                                    }}
                                    onMouseLeave={(e) => {
                                      const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (tooltip) tooltip.style.display = 'none';
                                    }}
                                    aria-label="Information about client tips"
                                    role="button"
                                    tabIndex={0}
                                  />
                                  <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#111111] border border-gray-600 rounded-lg shadow-xl hidden tooltip-container"
                                       style={{ left: '50%', transform: 'translateX(-50%)' }}>
                                    <div className="text-xs text-gray-300 leading-relaxed text-center whitespace-nowrap">
                                      Bonus payment for excellent<br />service beyond the agreed amount
                                    </div>
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#111111] border-r border-b border-gray-600 rotate-45 tooltip-arrow"></div>
                                  </div>
                                </div>
                              </div>
                              <span className="text-white font-medium">
                                {earningsPreview.tips > 0 ? '+' : ''}₹{earningsPreview.tips.toLocaleString('en-IN')}
                              </span>
                            </div>

                            {/* Platform Fee */}
                            <div className="flex items-center justify-between py-1.5 border-b border-gray-800 group">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-300 font-medium">Platform Fee</span>
                                <div className="relative inline-block">
                                  <Info
                                    className="w-3 h-3 text-gray-400 hover:text-white transition-colors cursor-help"
                                    onMouseEnter={(e) => {
                                      const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (tooltip) tooltip.style.display = 'block';
                                    }}
                                    onMouseLeave={(e) => {
                                      const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (tooltip) tooltip.style.display = 'none';
                                    }}
                                    aria-label="Information about platform fee"
                                    role="button"
                                    tabIndex={0}
                                  />
                                  <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#111111] border border-gray-600 rounded-lg shadow-xl hidden tooltip-container"
                                       style={{ left: '50%', transform: 'translateX(-50%)' }}>
                                    <div className="text-xs text-gray-300 leading-relaxed text-center whitespace-nowrap">
                                      Service charge deducted by<br />DoodLance platform (10% of earnings)
                                    </div>
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#111111] border-r border-b border-gray-600 rotate-45 tooltip-arrow"></div>
                                  </div>
                                </div>
                              </div>
                              <span className="text-white font-medium">-₹{earningsPreview.platformCommission.toLocaleString('en-IN')}</span>
                            </div>

                            {/* GST */}
                            <div className="flex items-center justify-between py-1.5 group">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-300 font-medium">GST</span>
                                <div className="relative inline-block">
                                  <Info
                                    className="w-3 h-3 text-gray-400 hover:text-white transition-colors cursor-help"
                                    onMouseEnter={(e) => {
                                      const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (tooltip) tooltip.style.display = 'block';
                                    }}
                                    onMouseLeave={(e) => {
                                      const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (tooltip) tooltip.style.display = 'none';
                                    }}
                                    aria-label="Information about GST"
                                    role="button"
                                    tabIndex={0}
                                  />
                                  <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#111111] border border-gray-600 rounded-lg shadow-xl hidden tooltip-container"
                                       style={{ left: '50%', transform: 'translateX(-50%)' }}>
                                    <div className="text-xs text-gray-300 leading-relaxed text-center whitespace-nowrap">
                                      Government service tax<br />(18% on earnings)
                                    </div>
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#111111] border-r border-b border-gray-600 rotate-45 tooltip-arrow"></div>
                                  </div>
                                </div>
                              </div>
                              <span className="text-white font-medium">-₹{earningsPreview.gst.toLocaleString('en-IN')}</span>
                            </div>

                            {/* Total Earnings */}
                            <div className="flex items-center justify-between py-2 border-t-2 border-gray-700 mt-3 group">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-semibold">Total Earnings</span>
                                <div className="relative inline-block">
                                  <Info
                                    className="w-3 h-3 text-gray-400 hover:text-white transition-colors cursor-help"
                                    onMouseEnter={(e) => {
                                      const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (tooltip) tooltip.style.display = 'block';
                                    }}
                                    onMouseLeave={(e) => {
                                      const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (tooltip) tooltip.style.display = 'none';
                                    }}
                                    aria-label="Information about total earnings"
                                    role="button"
                                    tabIndex={0}
                                  />
                                  <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#111111] border border-gray-600 rounded-lg shadow-xl hidden tooltip-container"
                                       style={{ left: '50%', transform: 'translateX(-50%)' }}>
                                    <div className="text-xs text-gray-300 leading-relaxed text-center whitespace-nowrap">
                                      Final amount after all fees<br />and taxes have been deducted
                                    </div>
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#111111] border-r border-b border-gray-600 rotate-45 tooltip-arrow"></div>
                                  </div>
                                </div>
                              </div>
                              <span className="text-xl font-bold text-green-400">₹{earningsPreview.totalEarnings.toLocaleString('en-IN')}</span>
                            </div>

                            {/* Processing Info */}
                            <div className="mt-3 p-2 rounded-xl bg-[#111111] border border-white/10">
                              <div className="text-xs text-gray-300">
                                <p className="font-medium text-gray-200">💳 Payment Processing</p>
                                <p>Earnings will be available in your wallet within 24 hours after job completion.</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Simple Separator Line - Below Ratings Section */}
        {job.status === 'completed' && (job.freelancerRating || job.clientRating) && (
          <div className="flex items-center justify-center py-6">
            <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
          </div>
        )}

        {/* Job Header */}
        <div className="mb-8">
          {/* Job Status Message - Enhanced Design */}
          {jobStarted && (
            <div className="mb-8">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-900/20 via-green-800/10 to-emerald-900/20 border border-green-500/30 shadow-lg shadow-green-500/5 animate-in fade-in slide-in-from-top-4 duration-500">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/5 rounded-full blur-xl"></div>

                {/* Content */}
                <div className="relative p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Left Section - Status Info */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Status Icon */}
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-lg animate-pulse"></div>
                        <div className="relative p-3 rounded-full bg-gradient-to-br from-green-500/10 to-green-600/20 border border-green-500/30">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                      </div>

                      {/* Status Details */}
                      <div className="flex-1 min-w-0">
                        {/* Status Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                          <h3 className="text-lg font-bold text-green-400">Job Started Successfully</h3>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-green-300 uppercase tracking-wide">Active</span>
                          </div>
                        </div>

                        {/* Status Description */}
                        <p className="text-green-300/80 text-sm leading-relaxed mb-4">
                          You're now working on this job. Complete it to receive payment.
                        </p>

                        {/* Job Started Time */}
                        <div className="pt-3 border-t border-green-500/20">
                          <div className="flex items-center gap-2 text-sm mb-1">
                            <ClockIcon className="w-4 h-4 text-green-300/70 flex-shrink-0" />
                            <span className="text-green-300/70">Started {new Date().toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Action Button */}
                    <div className="flex-shrink-0 lg:pt-0 pt-2">
                      <button
                        onClick={() => setShowCompleteDialog(true)}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-300 hover:text-green-200 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mark Complete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Job Title and Details */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {job.title}
              {job.workMode && (
                <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-white/80 bg-white/10 border border-white/20 rounded-full whitespace-nowrap ml-2 align-middle">
                  {getWorkModeLabel(job.workMode)}
                </span>
              )}
            </h1>
            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
            >
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="font-medium">{job.location}</span>
            </button>
          </div>
        </div>

        {/* Job Highlights */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                <span className="text-gray-400 text-lg leading-none">₹</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-400 mb-0.5">Payment</div>
                <div className="text-white font-medium leading-tight">
                  <span className="whitespace-nowrap">
                    ₹{job.payment ? job.payment.toLocaleString('en-IN') : '0'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-400">Duration</div>
                <div className="text-white font-medium capitalize">{getJobDurationLabel(job as any)}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-400">Scheduled</div>
                <div className="text-white font-medium">
                  {job.scheduledAt ? (() => {
                    const scheduled = new Date(job.scheduledAt);
                    const month = scheduled.toLocaleDateString('en-US', { month: 'short' });
                    const day = scheduled.getDate();
                    const year = scheduled.getFullYear();
                    const time = scheduled.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true
                    });
                    return (
                      <>
                        {`${month} ${day}, ${year}`}
                        <br />
                        at {time}
                      </>
                    );
                  })() : (() => {
                    // Hardcoded date for consistent demo: November 14, 2025 at 3:30 PM
                    const demoDate = new Date('2025-11-14T15:30:00.000Z');
                    const month = demoDate.toLocaleDateString('en-US', { month: 'short' });
                    const day = demoDate.getDate();
                    const year = demoDate.getFullYear();
                    const time = demoDate.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true
                    });
                    return (
                      <>
                        {`${month} ${day}, ${year}`}
                        <br />
                        at {time}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-400">Experience</div>
                <div className="text-white font-medium">{getExperienceLevelDisplayName(job.experienceLevel || job.experience || 'Expert')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About the Job with Skills */}
            <div className="relative overflow-hidden rounded-xl bg-[#111111] border border-gray-600/30 shadow-lg">

              {/* Card content */}
              <div className="relative p-5">
                <div className="text-left mb-2">
                  <div className="text-white/60 font-medium text-xs">
                    {job.postedAt ? (() => {
                      const posted = new Date(job.postedAt);
                      const now = new Date();
                      const diffTime = Math.abs(now.getTime() - posted.getTime());
                      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
                      const diffMinutes = Math.floor(diffTime / (1000 * 60));

                      if (diffMinutes < 60) {
                        return `${diffMinutes}m ago`;
                      } else if (diffHours < 24) {
                        return `${diffHours}h ago`;
                      } else if (diffDays < 7) {
                        return `${diffDays}d ago`;
                      } else if (diffDays < 30) {
                        const weeks = Math.floor(diffDays / 7);
                        return `${weeks}w ago`;
                      } else if (diffDays < 365) {
                        const months = Math.floor(diffDays / 30);
                        return `${months}mo ago`;
                      } else {
                        const years = Math.floor(diffDays / 365);
                        return `${years}y ago`;
                      }
                    })() : 'Date not specified'}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">About the Job</h2>
                </div>
                <div className="prose prose-invert max-w-none">
                  {job.description && (
                    <p className="text-white/80 leading-relaxed mb-6">
                      {job.description}
                    </p>
                  )}

                  {job.skills && job.skills.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <h3 className="text-md font-semibold text-white mb-3">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#2D2D2D] text-white/90 border border-white/5 hover:bg-[#3D3D3D] transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {job.status === 'completed' && (
              <div className="space-y-6">
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Freelancer Rating Dropdown - Above Client Profile */}
            {job.status === 'completed' && job.freelancerRating && (
              <div className="relative overflow-hidden rounded-xl bg-[#111111] border border-gray-600/30 shadow-lg">

                {/* Dropdown Arrow */}
                <button
                  onClick={() => setShowFreelancerRating(!showFreelancerRating)}
                  className="absolute top-3 right-3 z-10 p-1 rounded-full hover:bg-white/10 transition-colors"
                  aria-label={showFreelancerRating ? "Collapse rating details" : "Expand rating details"}
                >
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showFreelancerRating ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Card content */}
                <div className="relative p-4">
                  {/* Header with toggle */}
                  <button
                    onClick={() => setShowFreelancerRating(!showFreelancerRating)}
                    className="w-full text-center mb-3 group"
                  >
                    <div className="text-center text-sm text-white/70 font-medium mb-2">You rated the client</div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-8 h-8 ${star <= (job.freelancerRating?.stars || 0) ? 'text-yellow-400 fill-current' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            style={star <= (job.freelancerRating?.stars || 0) ? {} : { color: '#404040' }}
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </button>

                  {/* Collapsible Content */}
                  {showFreelancerRating && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      {/* Star count */}
                      <p className="text-center text-sm font-bold text-white mb-3">
                        {job.freelancerRating?.stars} stars
                      </p>

                      {/* Review */}
                      {job.freelancerRating?.review && (
                        <p className="text-center text-sm text-gray-300 mb-3 leading-relaxed">
                          "{job.freelancerRating.review}"
                        </p>
                      )}

                      {/* Feedback Chips */}
                      {job.freelancerRating?.feedbackChips && job.freelancerRating.feedbackChips.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1.5">
                          {job.freelancerRating.feedbackChips.map((chip: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300 border border-purple-500/30"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* About the Client */}
            <ClientProfile
              client={job.client ? {
                name: job.client.name,
                image: job.client.image,
                rating: job.client.rating,
                moneySpent: undefined,
                jobsCompleted: job.client.jobsCompleted,
                freelancersWorked: undefined,
                freelancerAvatars: undefined,
                experienceLevel: undefined
              } : null}
              location={job.location}
              showCommunicationButtons={true}
              onChat={() => handleChat({} as React.MouseEvent)}
              onCall={() => handleCall({} as React.MouseEvent)}
              defaultExpanded={isClientProfileExpanded}
            />

            {/* Safety Tips */}
            <div className="relative overflow-hidden rounded-xl bg-[#111111] border border-gray-600/30 shadow-lg">
              {/* Card content */}
              <div className="relative p-5">
                <h2 className="text-lg font-semibold text-white mb-4">Safety Tips</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/80">Verify ground facilities and equipment before starting</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/80">Discuss session duration and payment terms clearly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/80">Ensure weather conditions are suitable for outdoor activities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/80">Use proper protective gear during practice sessions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/80">Confirm participant fitness levels before intensive training</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-white/80">Follow proper warm-up and cool-down procedures</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Job Timeline */}
            <CollapsibleTimeline
              items={createTimelineItems('job', job)}
              title="Job Timeline"
              defaultExpanded={false}
            />

            {/* Action Buttons - Moved below safety tips */}
            {(job.status === 'upcoming' || job.status === 'pending') && !jobStarted && (
              <>
                <div className="text-xs text-white/50 text-center mb-3">
                  Get verification code from client on the field (💡 Test: 1234), then click "Start Job"
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleStartJob}
                    className="w-full py-3 px-6 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Start Job
                  </button>
                  <button
                    onClick={handleCancelJob}
                    className="w-full py-3 px-6 rounded-lg font-medium bg-transparent text-red-400 border border-red-500/30 hover:bg-red-500/10 hover:border-red-400/50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel Job
                  </button>
                </div>
              </>
            )}

          {/* Support Info for Started Jobs */}
          {jobStarted && (
            <div className="text-center mb-4">
              <p className="text-xs text-amber-400/80">
                If you encounter any issues during the job, please contact our support team immediately.
              </p>
            </div>
          )}

          {/* Cricket Icon Separator - Below Main Content */}
          <div className="relative flex items-center justify-center py-6 mt-0 mb-6">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent"></div>

            {/* Decorative Elements */}
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2">
              <div className="flex justify-center">
                <div className="w-32 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
              </div>
            </div>

            {/* Cricket Ball Icon */}
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/30 border border-green-500/40 flex items-center justify-center shadow-lg shadow-green-500/20">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-500 border-2 border-white/20 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🏏</span>
                </div>
              </div>
            </div>

            {/* Side Decorations */}
            <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-green-400/30 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-green-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
          </div>
        </div>
      </main>

      {/* Cancel Job Full Page */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#111111] to-[#0a0a0a] overflow-y-auto">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-[#111111]/95 backdrop-blur-sm border-b border-gray-800/80 p-4 flex items-center">
            <button
              onClick={() => {
                setShowCancelDialog(false);
                setCancelNotes('');
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-white/80" />
            </button>
            <div className="ml-4">
              <div className="text-sm font-medium text-white">Cancel Job</div>
              <div className="text-xs font-mono text-white/60">ID: {job.id}</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="min-h-[100dvh] w-full pt-20 pb-24">
            <div className="max-w-3xl mx-auto p-4 md:p-6">
              <div className="space-y-6">
                {/* Header Section */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg"></div>
                      <div className="relative p-4 rounded-full bg-gradient-to-br from-red-500/10 to-red-600/20 border border-red-500/30">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-xl font-bold text-white">Cancel Job</h1>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                      Are you sure you want to cancel this job? This action cannot be undone and may affect your rating.
                    </p>
                  </div>
                </div>

                {/* Job Summary */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-400/5 rounded-full blur-xl"></div>

                  {/* Card content */}
                  <div className="relative p-5">
                    {/* Header with status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-white/90">Job Overview</h2>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30 backdrop-blur-sm">
                        {job.status}
                      </span>
                    </div>

                    {/* Job details - Simplified */}
                    <div className="space-y-3">
                      <div className="text-center space-y-2">
                        <p className="text-sm text-gray-400">Project</p>
                        <p className="text-base font-medium text-white break-words">{job.title}</p>
                      </div>

                      <div className="border-t border-gray-600/30 pt-3">
                        <div className="text-center space-y-1">
                          <p className="text-sm text-gray-400">Payment</p>
                          <p className="text-xl font-bold text-green-400">₹{(() => {
                            const earningsPreview = calculateJobEarnings(job);
                            return earningsPreview.totalEarnings.toLocaleString('en-IN');
                          })()}</p>
                          <p className="text-xs text-green-300/70">Payment if completed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cancellation Reason */}
                <div className="space-y-3">
                  <Label htmlFor="cancel-notes" className="text-base font-medium text-white">
                    Reason for cancellation <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="cancel-notes"
                      value={cancelNotes}
                      onChange={(e) => setCancelNotes(e.target.value)}
                      placeholder="Please provide a detailed reason for cancelling this job..."
                      className="min-h-[120px] bg-[#111111] border-gray-600/50 text-white placeholder:text-gray-500 focus:border-red-500/50 focus:ring-red-500/20 resize-none"
                      maxLength={500}
                      required
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                      {cancelNotes.length}/500
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10 border-gray-600/50 text-white/90 hover:bg-[#111111] hover:text-white hover:border-gray-500/50 transition-all duration-200"
                    onClick={() => {
                      setShowCancelDialog(false);
                      setCancelNotes('');
                    }}
                  >
                    Keep Job Active
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="flex-1 h-10 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium shadow-lg shadow-red-600/25 hover:shadow-red-600/40 transition-all duration-200"
                    onClick={confirmCancelJob}
                    disabled={!cancelNotes.trim()}
                  >
                    Yes, Cancel Job
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Job OTP Dialog */}
      {showStartJobDialog && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#111111] to-[#0a0a0a] overflow-y-auto">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-[#111111]/95 backdrop-blur-sm border-b border-gray-800/80 p-4 flex items-center">
            <button
              onClick={() => {
                setShowStartJobDialog(false);
                setOtpInput('');
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-white/80" />
            </button>
            <div className="ml-4">
              <div className="text-sm font-medium text-white">Job Verification</div>
              <div className="text-xs font-mono text-white/60">ID: {job.id}</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="min-h-[100dvh] w-full pt-20 pb-24">
            <div className="max-w-3xl mx-auto p-4 md:p-6">
              <div className="space-y-6">
                {/* Header Section */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg"></div>
                      <div className="relative p-4 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/20 border border-blue-500/30">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-xl font-bold text-white">Job Verification</h1>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                      Get the 4-digit verification code from the client when you meet them on the field to start the job (💡 Test: 1234).
                    </p>
                  </div>
                </div>

                {/* Job Summary */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/5 rounded-full blur-xl"></div>

                  {/* Card content */}
                  <div className="relative p-5">
                    {/* Header with status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-white/90">Job Overview</h2>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30 backdrop-blur-sm">
                        {job.status}
                      </span>
                    </div>

                    {/* Job details - Simplified */}
                    <div className="space-y-3">
                      <div className="text-center space-y-2">
                        <p className="text-sm text-gray-400">Project</p>
                        <p className="text-base font-medium text-white break-words">{job.title}</p>
                      </div>

                      <div className="border-t border-gray-600/30 pt-3">
                        <div className="text-center space-y-1">
                          <p className="text-sm text-gray-400">Amount Booked</p>
                          <p className="text-xl font-bold text-blue-400">₹{typeof job.payment === 'string' ? job.payment : job.payment.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-blue-300/70">Base payment amount</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* OTP Input - 4 Mini Cards */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-white">
                    Enter Verification Code <span className="text-red-400">*</span>
                  </Label>
                  <div className="flex justify-center gap-2">
                    {otpDigits.map((digit, index) => (
                      <div key={index} className="relative">
                        <input
                          type="text"
                          id={`otp-digit-${index}`}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onFocus={() => handleOtpFocus(index)}
                          onBlur={handleOtpBlur}
                          onPaste={index === 0 ? handlePaste : undefined}
                          className={`w-12 h-12 text-center text-xl font-mono font-bold bg-[#111111] border text-white rounded-2xl focus:outline-none transition-all duration-200 ${
                            activeDigitIndex === index
                              ? 'border-blue-500/70 ring-2 ring-blue-500/20'
                              : digit
                                ? 'border-gray-500/50'
                                : 'border-gray-600/50 hover:border-gray-500/50'
                          }`}
                          maxLength={1}
                          autoComplete="off"
                        />
                        {digit && (
                          <div className="absolute inset-0 rounded-2xl bg-blue-500/20 animate-pulse"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">
                      Get the 4-digit verification code from the client on the field (💡 Test: 1234)
                    </p>
                  </div>

                  {/* OTP Error Message */}
                  {otpError && (
                    <div className="text-center">
                      <p className="text-xs text-red-400 font-medium animate-in fade-in slide-in-from-top-1 duration-300">
                        {otpError}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10 border-gray-600/50 text-white/90 hover:bg-[#111111] hover:text-white hover:border-gray-500/50 transition-all duration-200"
                    onClick={() => {
                      setShowStartJobDialog(false);
                      setOtpInput('');
                      setOtpDigits(['', '', '', '']);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-200"
                    onClick={confirmStartJob}
                    disabled={otpDigits.some(digit => digit === '')}
                  >
                    Start Job
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCompleteDialog && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#111111] to-[#0a0a0a] overflow-y-auto">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-[#111111]/95 backdrop-blur-sm border-b border-gray-800/80 p-4 flex items-center">
            <button
              onClick={() => {
                setShowCompleteDialog(false);
                setReview('');
                setRating(0);
                setSelectedChips([]);
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-white/80" />
            </button>
            <div className="ml-4">
              <div className="text-sm font-medium text-white">Mark Job Complete</div>
              <div className="text-xs font-mono text-white/60">ID: {job.id}</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="min-h-[100dvh] w-full pt-20 pb-24">
            <div className="max-w-3xl mx-auto p-4 md:p-6">
              <div className="space-y-6">
                {/* Header Section */}
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full blur-lg"></div>
                      <div className="relative p-4 rounded-full bg-gradient-to-br from-green-500/10 to-green-600/20 border border-green-500/30">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-xl font-bold text-white">Mark Job as Complete</h1>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                      Please rate your experience with the client and provide feedback before marking the job as complete.
                    </p>
                  </div>
                </div>

                {/* Job Summary */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-400/5 rounded-full blur-xl"></div>

                  {/* Card content */}
                  <div className="relative p-5">
                    {/* Header with status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-white/90">Job Overview</h2>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-400 border border-green-500/30 backdrop-blur-sm">
                        {job.status}
                      </span>
                    </div>

                    {/* Job details - Simplified */}
                    <div className="space-y-3">
                      <div className="text-center space-y-2">
                        <p className="text-sm text-gray-400">Project</p>
                        <p className="text-base font-medium text-white break-words">{job.title}</p>
                      </div>

                      <div className="border-t border-gray-600/30 pt-3">
                        <div className="text-center space-y-1">
                          <p className="text-sm text-gray-400">Payment</p>
                          <p className="text-xl font-bold text-green-400">₹{(() => {
                            const earningsPreview = calculateJobEarnings(job);
                            return earningsPreview.totalEarnings.toLocaleString('en-IN');
                          })()}</p>
                          <p className="text-xs text-green-300/70">After all fees & taxes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-white">
                    How would you rate the client? <span className="text-red-400">*</span>
                  </Label>
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className={`transition-all duration-200 ${
                            star <= rating
                              ? 'text-yellow-400 scale-110 drop-shadow-sm'
                              : 'hover:text-yellow-400/50 hover:scale-105'
                          }`}
                          style={star <= rating ? {} : { color: '#404040' }}
                        >
                          <Star className="w-12 h-12 fill-current" />
                        </button>
                      ))}
                    </div>
                    <div className="text-center">
                      {rating > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold tracking-wide ring-1 ring-gray-500/30 transition-all duration-200 text-gray-300 uppercase">
                          <span className="text-lg">
                            {rating === 1 ? '😞' : rating === 2 ? '😐' : rating === 3 ? '😊' : rating === 4 ? '😄' : '🤩'}
                          </span>
                          <span className={`font-bold text-sm tracking-wider ${
                            rating === 1 ? 'text-red-400' :
                            rating === 2 ? 'text-orange-400' :
                            rating === 3 ? 'text-yellow-400' :
                            rating === 4 ? 'text-blue-400' : 'text-green-400'
                          }`}>
                            {rating === 1 ? 'Poor' :
                             rating === 2 ? 'Fair' :
                             rating === 3 ? 'Good' :
                             rating === 4 ? 'Very Good' : 'Excellent'}
                          </span>
                        </div>
                      ) : (
                        <div className="text-white/60 text-xs italic ring-1 ring-gray-500/30 px-2 py-0.5 rounded-full transition-all duration-200">
                          Rate your experience
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Feedback Chips - Now Optional */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-white">
                    What did you appreciate about the client? <span className="text-gray-400">(Optional)</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      'Professional cricketer',
                      'Clear communication',
                      'Good sportsmanship',
                      'Punctual arrival',
                      'Positive attitude',
                      'Skilled player'
                    ].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => {
                          setSelectedChips(prev =>
                            prev.includes(chip)
                              ? prev.filter(c => c !== chip)
                              : [...prev, chip]
                          );
                        }}
                        className={`px-1.5 py-0.5 text-xs rounded-lg border transition-all duration-200 ${
                          selectedChips.includes(chip)
                            ? 'bg-purple-500/10 border-gray-500/50 text-purple-300'
                            : 'bg-[#111111] border-gray-500/50 text-gray-300 hover:bg-[#1E1E1E] hover:border-gray-400/50'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-3">
                  <Label htmlFor="review-text" className="text-base font-medium text-white">
                    Additional feedback <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="review-text"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Share your experience, what went well, and any suggestions for improvement..."
                      className="min-h-[100px] bg-[#111111] border-gray-600/50 text-white placeholder:text-gray-500 resize-none"
                      maxLength={500}
                      required
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                      {review.length}/500
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10 border-gray-600/50 text-white/90 hover:bg-[#111111] hover:text-white hover:border-gray-500/50 transition-all duration-200"
                    onClick={() => {
                      setShowCompleteDialog(false);
                      setReview('');
                      setRating(0);
                      setSelectedChips([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 h-10 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-lg shadow-green-600/25 hover:shadow-green-600/40 transition-all duration-200"
                    onClick={confirmMarkComplete}
                    disabled={rating === 0 || !review.trim()}
                  >
                    Mark as Complete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal - Full Page */}
      {showMap && (
        <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] w-screen h-screen overflow-hidden flex flex-col dl-map-modal">
          {/* Header (common style) */}
          <div className="fixed top-0 left-0 right-0 border-b border-white/10 bg-[#111111]/95 backdrop-blur-xl z-[100]">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="truncate">
                  <h2 className="text-base md:text-lg font-semibold text-white truncate">Job Location</h2>
                  <p className="text-xs md:text-sm text-white/60 truncate">{job.location}</p>
                </div>
              </div>
              <button
                onClick={() => setShowMap(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                aria-label="Close map"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Map Container - Full Page */}
          <div className="absolute top-16 left-0 right-0 bottom-0" style={{ perspective: '1000px' }}>
            {mapLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#111111] z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-400">Loading map...</p>
                </div>
              </div>
            )}
            
            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#111111] z-10">
                <div className="p-6 max-w-md w-full bg-[#1E1E1E] rounded-lg border border-red-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <h3 className="text-sm font-semibold text-red-400">Error Loading Map</h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">{mapError}</p>
                  <button
                    onClick={() => {
                      setMapError(null);
                      setShowMap(false);
                    }}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            
            <div
              ref={mapRef}
              className="w-full h-full"
              style={{ display: mapError ? 'none' : 'block' }}
            />
          </div>

          
          {/* Hide Mapbox attribution/logo and style controls within this modal only */}
          <style jsx global>{`
            .dl-map-modal .mapboxgl-ctrl-logo,
            .dl-map-modal .mapboxgl-ctrl-attrib,
            .dl-map-modal .mapbox-improve-map {
              display: none !important;
            }

            /* Control sizes adjusted smaller */
            .dl-map-modal .mapboxgl-ctrl button {
              width: 28px !important;
              height: 28px !important;
              font-size: 10px !important;
            }

            .dl-map-modal .mapboxgl-ctrl-group button {
              width: 28px !important;
              height: 28px !important;
              font-size: 10px !important;
            }

            /* Icon sizing for controls */
            .dl-map-modal .mapboxgl-ctrl button .mapboxgl-ctrl-icon,
            .dl-map-modal .mapboxgl-ctrl-group button .mapboxgl-ctrl-icon {
              width: 10px !important;
              height: 10px !important;
            }

            /* Increase zoom in/out icon sizes */
            .dl-map-modal .mapboxgl-ctrl-group button:nth-child(1) .mapboxgl-ctrl-icon,
            .dl-map-modal .mapboxgl-ctrl-group button:nth-child(2) .mapboxgl-ctrl-icon {
              width: 14px !important;
              height: 14px !important;
            }

            /* Push controls down by 5% */
            .dl-map-modal .mapboxgl-ctrl-top-right {
              top: 80px !important;
              right: 10px !important;
            }

            .dl-map-modal .mapboxgl-ctrl-bottom-left {
              bottom: 10px !important;
              left: 10px !important;
            }
          `}</style>
        </div>
      )}

      <SuccessMessage
        message={successMessage.message}
        description={successMessage.description}
        isVisible={successMessage.isVisible}
        variant={successMessage.variant}
        onClose={() => setSuccessMessage(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}
