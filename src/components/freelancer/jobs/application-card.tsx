import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MapPin, FileText, MessageCircle, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, User, Clock as ClockIcon, Phone } from 'lucide-react';
import { IndianRupee } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Application, ApplicationStatus } from './types';
import { getStatusStyles, formatTime12Hour } from './utils';
import { cn } from '@/lib/utils';

interface ApplicationCardProps {
  application: Application;
  index: number;
  onViewDetails?: () => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, index, onViewDetails }) => {
  const router = useRouter();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const statusStyles = getStatusStyles(application.status as ApplicationStatus);
  const isPending = application.status === 'pending';
  const isAccepted = application.status === 'accepted';
  const isRejected = application.status === 'rejected';

  const statusIcons: Record<ApplicationStatus, React.ReactNode> = {
    pending: <Clock className="w-3.5 h-3.5 mr-1.5" />,
    accepted: <CheckCircle className="w-3.5 h-3.5 mr-1.5" />,
    rejected: <XCircle className="w-3.5 h-3.5 mr-1.5" />,
    completed: <CheckCircle className="w-3.5 h-3.5 mr-1.5" />,
    cancelled: <XCircle className="w-3.5 h-3.5 mr-1.5" />
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/freelancer/proposals/${application.id}`);
  };

  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle message button click
    console.log('Message button clicked for application:', application.id);
  };

  return (
    <motion.div
      key={application.id}
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
              <span className="text-xs text-gray-400">ID:</span>
              <span className="font-mono text-xs">
                {application.id}
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
                      // Handle edit
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
                      // Handle withdraw
                    }}
                  >
                    Withdraw
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
              
              {isRejected && (
                <div className="text-xs text-gray-400 italic">
                  Not selected
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
