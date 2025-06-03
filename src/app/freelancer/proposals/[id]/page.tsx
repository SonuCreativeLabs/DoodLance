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
  XCircle,
  Phone,
  FileUp,
  FileDown,
  FileCheck2,
  FileX2,
  FileWarning,
  FileSearch,
  FileClock,
  FileBarChart2,
  FileInput,
  FileOutput,
  FileSpreadsheet,
  FileArchive,
  FileAudio2,
  FileVideo2,
  FileImage,
  FileCode2,
  FileJson,
  FileTextIcon,
  FileType2,
  FileSpreadsheetIcon,
  FileArchiveIcon,
  FileAudioIcon,
  FileVideoIcon,
  FileImageIcon,
  FileCodeIcon,
  FileJsonIcon,
  Eye,
  UploadCloud,
  PlusCircle
} from 'lucide-react';
import { Application, ApplicationStatus } from '@/components/freelancer/jobs/types';
import { mockApplications, mySkills } from '@/components/freelancer/jobs/mock-data';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

interface Proposal {
  coverLetter: string;
  proposedRate: number;
  estimatedDays: number;
  skills: string[];
  attachments: string[];
}

interface Attachment {
  name?: string;
  url: string;
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
    const fetchProposal = () => {
      setTimeout(() => {
        const foundProposal = mockApplications.find(app => app.id === id) || null;
        setProposal(foundProposal);
        setIsLoading(false);
      }, 300);
    };
    
    fetchProposal();
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleWithdraw = () => {
    // Handle withdraw logic here
    console.log('Withdrawing proposal...');
    setShowWithdrawConfirm(false);
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
      <div className="min-h-screen bg-[#111111] flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#111111] border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleBack}
                className="h-10 w-10 text-gray-400 hover:text-white hover:bg-white/10 p-0"
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
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </Button>
              <h1 className="ml-2 text-lg font-medium text-white">
                {proposal.status === 'accepted' ? 'Accepted Proposal' :
                 proposal.status === 'rejected' ? 'Rejected Proposal' :
                 proposal.status === 'completed' ? 'Completed Job' :
                 proposal.status === 'cancelled' ? 'Cancelled Job' :
                 'Pending Proposal'}
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-[#111111] pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Timeline Section */}
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10"></div>
                  <div className="space-y-8">
                    {/* Timeline items */}
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
                    
                    {/* Viewed Status */}
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

                {/* Job Details */}
                <div className="bg-[#111111] rounded-xl p-6 border border-gray-800/80">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{proposal.jobTitle}</h2>
                      <div className="h-0.5 bg-gradient-to-r from-purple-500/20 to-transparent w-full my-4"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">Your Proposal</h2>
                      {proposal.rating && (
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-4 h-4 ${proposal.rating && star <= Math.round(proposal.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-400">
                            {proposal.rating ? `${proposal.rating.toFixed(1)}/5.0` : 'Not rated'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Cover Letter</h3>
                      <p className="text-gray-300">{proposal.proposal.coverLetter}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Your Rate</h3>
                      <div className="flex items-center space-x-2">
                        <IndianRupee className="w-4 h-4 text-purple-400" />
                        <span className="text-lg font-medium">{proposal.proposal.proposedRate}</span>
                        <span className="text-sm text-gray-400">/ project</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-400">Attachments</h3>
                        {proposal.status === 'pending' && (
                          <label className="p-1.5 text-gray-400 hover:text-purple-400 rounded-full hover:bg-purple-500/10 transition-colors cursor-pointer" title="Upload attachment">
                            <PlusCircle className="w-4 h-4" />
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={(e) => console.log('File selected', e.target.files)}
                              multiple
                            />
                          </label>
                        )}
                      </div>
                      <div className="space-y-2">
                        {proposal.proposal.attachments && proposal.proposal.attachments.length > 0 ? (
                          proposal.proposal.attachments.map((file, index) => (
                            <div key={index} className="group flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                              <div className="flex items-center space-x-3">
                                <div className="p-1.5 bg-purple-500/10 rounded-md">
                                  <FileText className="w-4 h-4 text-purple-400" />
                                </div>
                                <span className="text-sm text-gray-300 font-medium truncate max-w-[200px]">
                                  {file || `Attachment ${index + 1}`}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <a 
                                  href={`/attachments/${file}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-gray-400 hover:text-purple-400 rounded-full hover:bg-gray-700 transition-colors"
                                  title="View file"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                                <button 
                                  className="p-1.5 text-gray-400 hover:text-red-400 rounded-full hover:bg-red-500/10 transition-colors"
                                  onClick={() => console.log('Remove file', file)}
                                  title="Remove file"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/30">
                            <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />
                            <p className="text-sm text-gray-400">No attachments yet</p>
                            <p className="text-xs text-gray-500 mt-1">Upload files to support your proposal</p>
                          </div>
                        )}
                        

                      </div>
                    </div>
                    
                    {proposal.status === 'pending' && (
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400/50 transition-all hover:shadow-lg hover:shadow-purple-500/10" 
                          onClick={() => console.log('Edit proposal')}
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400/50 transition-all hover:shadow-lg hover:shadow-red-500/10" 
                          onClick={() => setShowWithdrawConfirm(true)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Withdraw
                        </Button>
                      </div>
                    )}
                    
                    {proposal.status === 'accepted' && (
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
                          onClick={() => console.log('Message client')}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
                          onClick={() => console.log('Call client')}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                      </div>
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
              
              {/* Right Column */}
              <div className="space-y-6">
                {/* Job Posting */}
                <div className="bg-[#111111] rounded-xl p-6 border border-gray-800/80">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="font-medium">{proposal.clientName || 'Unknown Client'}</h2>
                      <p className="text-sm text-gray-400">{proposal.location || 'Location not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-xs font-medium text-gray-400 mb-1">Job Posted</h3>
                        <p className="text-sm">
                          {new Date(proposal.postedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
          
                          })}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-400 mb-1">Member Since</h3>
                        <p className="text-sm">
                          {proposal.clientSince ? 
                            new Date(proposal.clientSince).getFullYear() : 
                            '2023'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-800">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-2">
                              {proposal.freelancerAvatars?.length ? (
                                proposal.freelancerAvatars.map((avatar, i) => (
                                  <img 
                                    key={i}
                                    src={avatar}
                                    alt={`Freelancer ${i + 1}`}
                                    className="w-7 h-7 rounded-full border-2 border-[#111111] object-cover"
                                  />
                                ))
                              ) : (
                                Array.from({ length: Math.min(3, proposal.freelancersWorked || 1) }).map((_, i) => (
                                  <div key={i} className="w-7 h-7 rounded-full bg-purple-500/20 border-2 border-[#111111] flex items-center justify-center">
                                    <User className="w-3.5 h-3.5 text-purple-300" />
                                  </div>
                                ))
                              )}
                              {proposal.freelancersWorked && proposal.freelancersWorked > 3 && (
                                <div className="w-7 h-7 rounded-full bg-purple-500/20 border-2 border-[#111111] flex items-center justify-center">
                                  <span className="text-xs font-medium text-purple-300">
                                    +{proposal.freelancersWorked - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-xs text-gray-300 font-medium">
                                {proposal.freelancersWorked || 1} Freelancers
                              </p>
                              <p className="text-xs text-gray-500">Worked with this client</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end">
                            <div className="flex items-center space-x-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3.5 h-3.5 ${i < Math.floor(proposal.clientRating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-medium text-white">
                                {proposal.clientRating?.toFixed(1) || '5.0'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">Client Rating</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-medium text-gray-400 mb-1">Money Spent</h3>
                          <p className="text-sm font-medium">
                            ₹{(proposal.moneySpent || 0).toLocaleString('en-IN')}+
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">On DoodLance</p>
                          <p className="text-xs text-green-400">
                            {proposal.projectsCompleted || 1} {proposal.projectsCompleted === 1 ? 'Project' : 'Projects'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-500/10 hover:text-red-400"
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
