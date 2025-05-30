import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { MapPin, FileText, XCircle } from 'lucide-react';
import { IndianRupee } from 'lucide-react';

import { Application, ApplicationStatus } from './types';
import { getStatusStyles } from './utils';

interface ApplicationCardProps {
  application: Application;
  index: number;
  onViewDetails?: () => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, index, onViewDetails }) => {
  return (
    <motion.div
      key={application.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 backdrop-blur-xl border-gray-800 hover:border-purple-500/30 transition-all duration-300 shadow-2xl shadow-black/50"
      >
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 border border-white/10">
                <span className="text-sm font-medium">
                  {application.clientName ? application.clientName.charAt(0).toUpperCase() : 'C'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors duration-300">
                  {application.jobTitle}
                </h3>
                <p className="text-sm text-white/60">
                  {application.clientName || 'Client'}
                </p>
              </div>
            </div>
            <div className={`${getStatusStyles(application.status as ApplicationStatus).bg} ${getStatusStyles(application.status as ApplicationStatus).text} text-xs font-medium px-3 py-1 rounded-full border ${getStatusStyles(application.status as ApplicationStatus).border} w-fit`}>
              {application.status === 'accepted' ? 'Accepted' : 
                application.status === 'rejected' ? 'Rejected' : 'Pending'}
            </div>
          </div>
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center text-white/60">
              <MapPin className="w-3.5 h-3.5 mr-1 text-purple-400" />
              {application.location}
            </div>
            <div className="text-white/30">•</div>
            <div className="text-white/60">
              Applied on {format(new Date(application.appliedDate), 'MMM d, yyyy')}
            </div>
            <div className="text-white/30">•</div>
            <div className="text-white/60">
              Posted {format(new Date(application.postedDate), 'MMM d, yyyy')}
            </div>
          </div>

          {/* Proposal Details */}
          <div className="space-y-3">
            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
              <h4 className="text-sm font-medium text-white/90 mb-2">Your Proposal</h4>
              <p className="text-sm text-white/80 mb-3">{application.proposal.coverLetter}</p>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/5 p-2 rounded">
                  <p className="text-white/60 text-xs">Proposed Rate</p>
                  <p className="text-white/90 font-medium">₹{application.proposal.proposedRate.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-2 rounded">
                  <p className="text-white/60 text-xs">Estimated Days</p>
                  <p className="text-white/90 font-medium">{application.proposal.estimatedDays} day{application.proposal.estimatedDays > 1 ? 's' : ''}</p>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-xs text-white/60 mb-1">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {application.proposal.skills.map((skill, i) => (
                    <span key={i} className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {application.proposal.attachments && application.proposal.attachments.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-white/60 mb-1">Attachments</p>
                  <div className="space-y-1">
                    {application.proposal.attachments.map((file, i) => (
                      <div key={i} className="flex items-center text-xs text-purple-400 hover:text-purple-300 cursor-pointer">
                        <FileText className="w-3 h-3 mr-1" />
                        {file}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center text-white/80">
              <IndianRupee className="w-4 h-4 mr-1 text-purple-400" />
              <span className="font-medium">
                ₹{application.budget.min.toLocaleString()}
                {application.budget.max > application.budget.min ? ` - ₹${application.budget.max.toLocaleString()}` : ''}
              </span>
              <span className="ml-1 text-white/60">/job</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-white/80 leading-relaxed">
            {application.description}
          </p>

          {/* Action Buttons */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-3 gap-3 w-full">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onViewDetails}
                className="h-10 w-full px-4 py-2 text-sm font-medium bg-purple-900/30 border border-purple-700 hover:bg-purple-800/50 hover:border-purple-500/50 text-white/90 transition-all duration-200 flex items-center justify-center"
              >
                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>View Details</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="h-10 w-full px-4 py-2 text-sm font-medium bg-black/30 border border-gray-700 hover:bg-gray-800/50 hover:border-purple-500/50 text-white/90 transition-all duration-200 flex items-center justify-center"
              >
                <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Edit Proposal</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="h-10 w-full px-4 py-2 text-sm font-medium bg-red-900/30 border border-red-800/50 hover:bg-red-800/50 hover:border-red-700/50 text-red-400 hover:text-red-300 transition-all duration-200 flex items-center justify-center"
              >
                <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>Withdraw</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
