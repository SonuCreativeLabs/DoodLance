'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  X, 
  MessageCircle, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock as ClockIcon, 
  IndianRupee, 
  FileText,
  Edit2,
  Trash2,
  AlertCircle,
  User,
  Star,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Application, ApplicationStatus } from '@/components/freelancer/jobs/types';
import { mockApplications, mySkills } from '@/components/freelancer/jobs/mock-data';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  children, 
  defaultOpen = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={`bg-[#111111] rounded-lg border border-gray-700 overflow-hidden ${className}`}>
      <button 
        className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-white">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-white/60" /> : <ChevronDown className="w-5 h-5 text-white/60" />}
      </button>
      {isOpen && (
        <div className="p-4 pt-0">
          {children}
        </div>
      )}
    </div>
  );
};

export default function ProposalDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [proposal, setProposal] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hasRated, setHasRated] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    // In a real app, you would fetch the proposal data here
    const fetchProposal = () => {
      // Simulate API call
      setTimeout(() => {
        const foundProposal = mockApplications.find(app => app.id === id) || null;
        setProposal(foundProposal);
        setIsLoading(false);
      }, 300);
    };

    fetchProposal();
  }, [id]);

  const handleWithdraw = () => {
    // Handle withdraw logic
    console.log('Withdrawing proposal:', id);
    setShowWithdrawConfirm(false);
    // In a real app, you would update the status and redirect
    router.push('/freelancer/proposals');
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-amber-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.back();
  };
  
  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle rating submission
    console.log('Rating submitted:', { rating, feedback });
    setHasRated(true);
    setShowRatingForm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] text-white">
        <div className="bg-[#111111] min-h-screen flex items-center justify-center">
          Loading proposal details...
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center p-4 z-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Proposal Not Found</h1>
          <p className="text-white/60 mb-6">The proposal you're looking for doesn't exist or has been removed.</p>
          <Button
            onClick={() => router.push('/freelancer/proposals')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Back to Proposals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#1e1e1e] overflow-y-auto z-50">
      <div className="min-h-screen bg-[#111111]">
        {/* Header */}
        <header className="border-b border-gray-700 sticky top-0 z-10 bg-[#1e1e1e]/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleBack}
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </Button>
                <h1 className="ml-2 text-lg font-medium text-white">
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)} Proposal
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                {proposal.status === 'accepted' && (
                  <Button 
                    variant="outline" 
                    className="border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                    onClick={() => console.log('Message client')}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message Client
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Status Timeline */}
        <div className="bg-[#111111]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-gray-700">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10"></div>
              
              {/* Timeline items */}
              <div className="space-y-8">
                {/* Submitted */}
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-500">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Proposal Submitted</p>
                    <p className="text-xs text-white/60">
                      {new Date(proposal.appliedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                
                {/* Viewed */}
                <div className="relative pl-10">
                  <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    ['accepted', 'rejected', 'completed', 'cancelled'].includes(proposal.status) ? 'bg-purple-500' : 'bg-white/10'
                  }`}>
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Viewed by Client</p>
                    {['accepted', 'rejected', 'completed', 'cancelled'].includes(proposal.status) ? (
                      <p className="text-xs text-white/60">
                        {new Date(new Date(proposal.appliedDate).getTime() + 3600000).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    ) : (
                      <p className="text-xs text-white/40">Waiting for client to view</p>
                    )}
                  </div>
                </div>
                
                {/* Status Update */}
                <div className="relative pl-10">
                  <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    ['accepted', 'rejected'].includes(proposal.status) ? 'bg-purple-500' : 
                    proposal.status === 'completed' ? 'bg-green-500' :
                    proposal.status === 'cancelled' ? 'bg-red-500' : 'bg-white/10'
                  }`}>
                    {proposal.status === 'accepted' ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : proposal.status === 'rejected' ? (
                      <XCircle className="w-4 h-4 text-white" />
                    ) : proposal.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : proposal.status === 'cancelled' ? (
                      <XCircle className="w-4 h-4 text-white" />
                    ) : (
                      <ClockIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {proposal.status === 'accepted' ? 'Proposal Accepted' :
                       proposal.status === 'rejected' ? 'Proposal Not Selected' :
                       proposal.status === 'completed' ? 'Job Completed' :
                       proposal.status === 'cancelled' ? 'Job Cancelled' : 'Awaiting Client Decision'}
                    </p>
                    {['accepted', 'rejected', 'completed', 'cancelled'].includes(proposal.status) ? (
                      <p className="text-xs text-white/60">
                        {new Date(new Date(proposal.appliedDate).getTime() + 86400000).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    ) : (
                      <p className="text-xs text-white/40">
                        {proposal.status === 'pending' ? 'Client is reviewing your proposal' : 'Waiting for update'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Details */}
            <div className="bg-[#111111] rounded-xl p-6 border border-gray-800/80">
              <h2 className="text-xl font-semibold mb-4">Job Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-gray-700/50">
                      <CalendarIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Applied On</p>
                      <p className="font-medium">
                        {new Date(proposal.appliedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-gray-700/50">
                      <MapPin className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Location</p>
                      <p className="font-medium">{proposal.location}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-700 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Job Description</h3>
                    <p className="text-gray-300">{proposal.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {proposal.proposal.skills?.map((skill: string, index: number) => {
                        const isMatching = mySkills.some((mySkill: string) => 
                          mySkill.toLowerCase().includes(skill.toLowerCase()) ||
                          skill.toLowerCase().includes(mySkill.toLowerCase())
                        );
                        
                        return (
                          <span 
                            key={index}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              isMatching 
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                                : 'bg-gray-700/50 text-gray-300 border border-gray-600/30'
                            }`}
                          >
                            {isMatching && (
                              <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                            )}
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Proposal */}
            <div className="bg-[#111111] rounded-xl p-6 border border-gray-800/80">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Your Proposal</h2>
                {proposal.status === 'pending' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
                    onClick={() => console.log('Edit proposal')}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Cover Letter</h3>
                  <div className="bg-[#111111] p-4 rounded-lg border border-gray-700">
                    <p className="whitespace-pre-line text-gray-300">{proposal.proposal.coverLetter}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Proposed Rate</h3>
                    <div className="flex items-center space-x-2 bg-[#111111] p-4 rounded-lg border border-gray-800/80">
                      <IndianRupee className="w-5 h-5 text-purple-400" />
                      <span className="text-lg font-medium">
                        {proposal.proposal.proposedRate.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400">/project</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Estimated Timeline</h3>
                    <div className="flex items-center space-x-2 bg-[#111111] p-4 rounded-lg border border-gray-800/80">
                      <ClockIcon className="w-5 h-5 text-purple-400" />
                      <span className="text-lg font-medium">
                        {proposal.proposal.estimatedDays} day{proposal.proposal.estimatedDays !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-400">Attachments</h3>
                    <Button 
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-purple-400 border-purple-500/30 hover:bg-purple-500/10 text-xs h-7"
                      onClick={handleUploadClick}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload Files'}
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      multiple
                    />
                  </div>
                  
                  <div className="space-y-2">
                    {/* Existing attachments */}
                    {proposal.proposal.attachments?.map((file, index) => (
                      <div 
                        key={`existing-${index}`}
                        className="flex items-center justify-between bg-[#111111] p-3 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <FileText className="w-5 h-5 text-purple-400 flex-shrink-0" />
                          <span className="truncate text-sm">{file}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gray-400 hover:text-white h-7 w-7 p-0"
                          onClick={() => console.log('Download', file)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </Button>
                      </div>
                    ))}
                    
                    {/* Newly uploaded files */}
                    {uploadedFiles.map((file, index) => (
                      <div 
                        key={`new-${index}`}
                        className="flex items-center justify-between bg-[#111111] p-3 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <FileText className="w-5 h-5 text-purple-400 flex-shrink-0" />
                          <span className="truncate text-sm">{file.name}</span>
                          <span className="text-xs text-purple-400/70">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-gray-400 hover:text-red-400 h-7 w-7 p-0"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right sidebar */}
              <div className="space-y-6">
                {/* Client Info */}
                <div className="bg-[#1e1e1e] rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Client Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Client Name</p>
                  <p className="font-medium">{proposal.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="font-medium">
                    {new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Jobs Posted</p>
                  <p className="font-medium">24+</p>
                </div>
                <div className="flex items-center">
                  <div className="flex -space-x-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i}
                        className="w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-700 flex items-center justify-center text-xs"
                      >
                        {i}
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-xs">
                      +12
                    </div>
                  </div>
                  <span className="ml-2 text-sm text-gray-400">Freelancers worked with</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {proposal.status === 'pending' && (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                    onClick={() => console.log('Edit proposal')}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Proposal
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={() => setShowWithdrawConfirm(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Withdraw Proposal
                  </Button>
                </>
              )}
              
              {proposal.status === 'accepted' && (
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => console.log('Message client')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Client
                </Button>
              )}
              
              {proposal.status === 'rejected' && (
                <div className="bg-red-900/20 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-red-300">Proposal Not Selected</h3>
                      <p className="text-sm text-red-400 mt-1">
                        The client has chosen to move forward with another freelancer for this project.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      </div>

      {/* Withdraw Confirmation Modal */}
      {showWithdrawConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10">
                <Trash2 className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-white">Withdraw Proposal</h3>
              <p className="mt-2 text-sm text-gray-400">
                Are you sure you want to withdraw your proposal? This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-center space-x-3">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setShowWithdrawConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleWithdraw}
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
