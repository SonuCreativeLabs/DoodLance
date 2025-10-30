import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, FileText, MessageCircle, Clock, CheckCircle, XCircle, User, Phone, X } from 'lucide-react';
import { IndianRupee } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Application, ApplicationStatus } from './types';
import { getStatusStyles } from './utils';
import { cn } from '@/lib/utils';
import { updateApplicationStatus } from './mock-data';
import { SuccessMessage } from '@/components/ui/success-message';

interface ApplicationCardProps {
  application: Application;
  index: number;
  onViewDetails?: () => void;
  onStatusChange?: (applicationId: string, newStatus: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, index, onViewDetails, onStatusChange }) => {
  const router = useRouter();
  const [isExpanded] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Success message state
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
  const showSuccessMessage = (message: string, description?: string, variant: 'success' | 'warning' | 'info' = 'success') => {
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

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      const response = await fetch(`/api/applications/${application["#"]}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();

        console.log('Withdrawal API response:', result);

        // Update the application status locally using the returned data
        if (result.application) {
          Object.assign(application, result.application);
        } else {
          // Fallback to local status update if no application data returned
          application.status = 'withdrawn';
        }

        // Update the shared mock data so other components see the change
        updateApplicationStatus(application["#"], 'withdrawn');

        // Notify parent component about status change
        if (onStatusChange) {
          onStatusChange(application["#"], 'withdrawn');
        }

        setShowWithdrawDialog(false);
        // Show success message
        showSuccessMessage(
          'Application Withdrawn!',
          'Your application has been successfully withdrawn.',
          'warning'
        );
      } else {
        console.error('Failed to withdraw application - Status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);

        // Show error message
        alert('Failed to withdraw application. Please try again.');
      }
    } catch (error) {
      console.error('Error withdrawing application:', error);
      // Show error message
      alert('Error withdrawing application. Please check your connection and try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };
  
  const statusStyles = getStatusStyles(application.status as ApplicationStatus);
  const isPending = application.status === 'pending';
  const isAccepted = application.status === 'accepted';
  const isRejected = application.status === 'rejected';
  const isWithdrawn = application.status === 'withdrawn';

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when dialog is open or withdrawing
    if (showWithdrawDialog || isWithdrawing) {
      e.stopPropagation();
      return;
    }

    e.stopPropagation();

    // Use the onViewDetails prop if provided, otherwise fallback to applications tab
    if (onViewDetails) {
      onViewDetails();
    } else {
      router.push('/freelancer/jobs?tab=applications');
    }
  };

  const handleEdit = () => {
    // Navigate to the specific application page for editing
    router.push(`/freelancer/proposals/${application["#"]}?edit=true`);
  };

  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle message button click
    console.log('Message button clicked for application:', application["#"]);
  };

  return (
    <motion.div
      key={application["#"]}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative w-full px-0 cursor-pointer"
      onClick={handleCardClick}
    >
      <motion.div
        className="p-5 rounded-xl bg-[#1E1E1E] border border-white/5 w-full shadow-lg"
      >
        <div className="space-y-4">
          {/* Status and Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "text-xs font-medium px-3 py-1 rounded-full border w-fit",
                statusStyles.bg,
                statusStyles.text,
                statusStyles.border
              )}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-white/60">
              <span className="font-mono text-xs">
                {application["#"]}
              </span>
            </div>
          </div>

          {/* Job Title and Client */}
          <div>
            <h3 className="text-base font-medium text-white line-clamp-2 mb-1">
              {application.jobTitle}
            </h3>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>{application.clientName || 'Client'}</span>
            </div>
          </div>

          {/* Job Meta */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2 text-white/60">
              <div className="flex-shrink-0 mt-0.5 flex flex-col items-center">
                <MapPin className="w-4 h-4 text-purple-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-white/40 mb-0.5">Location</div>
                <div className="text-sm text-white/90 line-clamp-1">
                  {application.location}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 text-white/60">
              <div className="flex-shrink-0 mt-0.5">
                <IndianRupee className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-xs text-white/40 mb-0.5">Proposed Rate</div>
                <div className="text-sm text-white/90">
                  ₹{application.proposal.proposedRate.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Expandable section */}
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                {/* Proposal details */}
                <div>
                  <h4 className="text-sm font-medium text-white/90 mb-2">Your Proposal</h4>
                  <p className="text-sm text-white/70 bg-white/5 p-3 rounded-lg">
                    {application.proposal.coverLetter}
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-xs text-white/60 mb-2">SKILLS SHOWCASED</p>
                  <div className="flex flex-wrap gap-2">
                    {application.proposal.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="text-xs bg-white/5 text-white/80 px-2.5 py-1 rounded-full border border-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Attachments */}
                {application.proposal.attachments?.length > 0 && (
                  <div>
                    <p className="text-xs text-white/60 mb-2">ATTACHMENTS</p>
                    <div className="space-y-2">
                      {application.proposal.attachments.map((file, i) => (
                        <div 
                          key={i} 
                          className="flex items-center text-sm text-white/70 hover:text-white/90 transition-colors cursor-pointer"
                        >
                          <FileText className="w-4 h-4 mr-2 text-purple-400" />
                          <span className="truncate">{file}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end pt-2">

            <div className="flex gap-2">
              {isPending && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs border-white/10 hover:bg-white/5 hover:border-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs text-red-400 border-red-400/20 hover:bg-red-400/10 hover:border-red-400/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowWithdrawDialog(true);
                    }}
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
                  </Button>
                </>
              )}
              
              {isAccepted && (
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="h-8 text-xs bg-purple-600 hover:bg-purple-700 flex-1"
                    onClick={handleMessageClick}
                  >
                    <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                    Message
                  </Button>
                  <Button 
                    variant="default"
                    size="sm" 
                    className="h-8 text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle call
                    }}
                  >
                    <Phone className="w-3.5 h-3.5 mr-1.5" />
                    Call
                  </Button>
                </div>
              )}
              
              {isWithdrawn && (
                <div className="text-xs text-gray-400 italic">
                  Withdrawn by you
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Withdraw Confirmation Dialog */}
      {showWithdrawDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg p-6 max-w-md w-full"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-400/5 rounded-full blur-xl"></div>

            {/* Dialog content */}
            <div className="relative text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10 mb-4">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Withdraw Application</h3>
              <p className="text-sm text-gray-400 mb-6">
                Are you sure you want to withdraw your application? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-[#1e1e1e] hover:text-gray-200"
                  onClick={() => setShowWithdrawDialog(false)}
                  disabled={isWithdrawing}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-500/10 hover:text-red-400"
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                >
                  {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Message */}
      <SuccessMessage
        message={successMessage.message}
        description={successMessage.description}
        isVisible={successMessage.isVisible}
        variant={successMessage.variant}
        onClose={() => setSuccessMessage(prev => ({ ...prev, isVisible: false }))}
      />
    </motion.div>
  );
};
