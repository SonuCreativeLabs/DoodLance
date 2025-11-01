'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  X, 
  MessageCircle, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock as ClockIcon, 
  FileText,
  Trash2,
  AlertCircle,
  User,
  Star,
  CheckCircle,
  XCircle,
  Phone,
  Eye,
  UploadCloud,
  PlusCircle,
  ArrowLeft
} from 'lucide-react';
import { Application } from '@/components/freelancer/jobs/types';
import { mySkills } from '@/components/freelancer/jobs/mock-data';
import { updateApplicationStatus } from '@/components/freelancer/jobs/mock-data';
import { ClientProfile } from '@/components/freelancer/jobs/ClientProfile';
import { FullScreenMap } from '@/components/freelancer/jobs/FullScreenMap';
import { SuccessMessage } from '@/components/ui/success-message';
import { getCategoryDisplayName } from '@/components/freelancer/jobs/utils';

export default function ProposalDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [proposal, setProposal] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapLocation, setMapLocation] = useState('');
  const yourProposalRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const loadApplication = async () => {
      setIsLoading(true);
      try {
        // Use mock data instead of API calls
        const { mockApplications } = await import('@/components/freelancer/jobs/mock-data');
        const applicationData = mockApplications.find(app => app["#"] === id);

        if (applicationData) {
          setProposal(applicationData);

          // Check if we should auto-enable edit mode (from card edit button)
          if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('edit') === 'true') {
              setIsEditing(true);
              setEditedProposal(applicationData);

              // Auto-scroll to Your Proposal section after a short delay to ensure DOM is updated
              setTimeout(() => {
                if (yourProposalRef.current) {
                  yourProposalRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              }, 500);
            }
          }
        } else {
          console.error('Proposal not found in mock data');
          setProposal(null);
        }
      } catch (error) {
        console.error('Error loading application:', error);
        setProposal(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadApplication();
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const [editedProposal, setEditedProposal] = useState<Application | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProposal(proposal);

    // Scroll to Your Proposal section after a short delay to ensure DOM is updated
    setTimeout(() => {
      if (yourProposalRef.current) {
        yourProposalRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleSaveEdit = async () => {
    if (!editedProposal) return;

    setIsWithdrawing(true);
    try {
      // Use mock data update instead of API call
      updateApplicationStatus(proposal?.["#"] || '', editedProposal.status, {
        coverLetter: editedProposal.proposal.coverLetter,
        proposedRate: editedProposal.proposal.proposedRate,
      });

      console.log('Proposal updated successfully');

      // Update local state
      setProposal(editedProposal);
      setIsEditing(false);

      alert('Proposal updated successfully!');
    } catch (error) {
      console.error('Error updating proposal:', error);
      alert('Error updating proposal. Please check your connection and try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleChat = () => {
    // TODO: Implement chat functionality - could open chat modal or navigate to messages
    alert('Chat functionality will be implemented soon!');
  };

  const handleCall = () => {
    // TODO: Implement call functionality - could initiate call or show contact options
    alert('Call functionality will be implemented soon!');
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
    const allowedTypes = ['application/pdf', 'image/jpeg'];
    const currentAttachments = editedProposal?.proposal.attachments || [];

    const newFiles: string[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Only PDF and JPG files are allowed`);
        return;
      }

      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: File size must be less than 10MB`);
        return;
      }

      // Check if file already exists
      if (currentAttachments.includes(file.name)) {
        errors.push(`${file.name}: File already exists`);
        return;
      }

      newFiles.push(file.name);
    });

    if (errors.length > 0) {
      alert(`Upload failed:\n${errors.join('\n')}`);
      return;
    }

    if (newFiles.length > 0) {
      setEditedProposal(prev => prev ? {
        ...prev,
        proposal: {
          ...prev.proposal,
          attachments: [...currentAttachments, ...newFiles]
        }
      } : null);

      alert(`Successfully added ${newFiles.length} file(s)!`);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProposal(null);
  };

  const handleRemoveFile = (fileName: string) => {
    setEditedProposal(prev => prev ? {
      ...prev,
      proposal: {
        ...prev.proposal,
        attachments: prev.proposal.attachments.filter(file => file !== fileName)
      }
    } : null);

    alert(`"${fileName}" has been removed from attachments.`);
  };

  const handleOpenMap = (location: string) => {
    setMapLocation(location);
    setShowMapModal(true);
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      console.log('Withdrawing proposal:', proposal?.["#"]);

      // Use mock data update instead of API call
      updateApplicationStatus(proposal?.["#"] || '', 'withdrawn');

      // Update local state by reloading from mock data to ensure all fields are preserved
      const { mockApplications } = await import('@/components/freelancer/jobs/mock-data');
      const updatedApplicationData = mockApplications.find(app => app["#"] === proposal?.["#"]);
      if (updatedApplicationData) {
        setProposal(updatedApplicationData);
      }

      // Close modal
      setShowWithdrawConfirm(false);

      // Show success message
      alert('Proposal withdrawn successfully!');

      // Navigate back to proposals page after a short delay
      setTimeout(() => {
        router.push('/freelancer/jobs?tab=applications&status=withdrawn');
      }, 1000);

    } catch (error) {
      console.error('Error withdrawing proposal:', error);
      alert('Error withdrawing proposal. Please check your connection and try again.');
    } finally {
      setIsWithdrawing(false);
    }
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
          <p className="text-white/60 mb-6">The proposal you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button
            onClick={() => router.push('/freelancer/jobs?tab=applications')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Back to Proposals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#111111] to-[#0a0a0a] overflow-y-auto">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#111111]/95 backdrop-blur-sm border-b border-gray-800/80 p-4 flex items-center justify-between">
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
              {proposal.status === 'accepted' ? 'Accepted Proposal' :
               proposal.status === 'rejected' ? 'Rejected Proposal' :
               proposal.status === 'completed' ? 'Completed Job' :
               proposal.status === 'cancelled' ? 'Cancelled Job' :
               proposal.status === 'withdrawn' ? 'Withdrawn Proposal' :
               'Pending Proposal'}
            </h2>
            <span className="text-xs font-medium text-white/60">
              {proposal.category ? getCategoryDisplayName(proposal.category) : 'Category not specified'}
            </span>
          </div>
        </div>
        <div className="text-xs font-mono text-white/60">{proposal["#"]}</div>
      </div>

      {/* Main Content */}
      <div className="min-h-[100dvh] w-full pt-20 pb-24">
        <div className="max-w-3xl mx-auto p-4 md:p-6">
          <div className="space-y-6">

            {/* Withdrawal Info - Show at very top of page for withdrawn proposals */}
            {proposal.status === 'withdrawn' && (
              <div className="rounded-xl bg-gray-500/10 border border-gray-500/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Proposal Withdrawn</h3>
                    <p className="text-sm text-gray-300/80 mb-2">
                      This proposal has been withdrawn and is no longer active. You can create a new proposal for this job if it's still available.
                    </p>
                    {proposal.category && (
                      <p className="text-xs text-gray-200/60">
                        Category: {getCategoryDisplayName(proposal.category)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Rejection Info - Show at very top of page for rejected proposals */}
            {proposal.status === 'rejected' && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-400 mb-1">Proposal Rejected</h3>
                    <p className="text-sm text-red-300/80 mb-2">
                      Unfortunately, your proposal was not selected for this job. You can improve your proposal and try again for similar opportunities.
                    </p>
                    {proposal.category && (
                      <p className="text-xs text-red-200/60">
                        Category: {getCategoryDisplayName(proposal.category)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Header Section */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-lg"></div>
                  <div className="relative p-4 rounded-full bg-gradient-to-br from-purple-500/10 to-purple-600/20 border border-purple-500/30">
                    <FileText className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-xl font-bold text-white">Proposal Details</h1>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                  Review your proposal submission and track its progress.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/5 rounded-full blur-xl"></div>

              {/* Card content */}
              <div className="relative p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-white/90">Timeline</h2>
                  </div>
                </div>

                <div className="relative">
                  <div className="space-y-6">
                    {/* Dynamic Timeline based on proposal status */}
                    {(() => {
                      const timelineItems = [
                        {
                          label: 'Proposal Submitted',
                          date: proposal.appliedDate,
                          completed: true,
                          icon: CheckCircle,
                          color: 'bg-purple-500'
                        }
                      ];

                      // Add timeline items based on status
                      if (['accepted', 'rejected', 'completed', 'cancelled', 'withdrawn', 'expired', 'archived'].includes(proposal.status)) {
                        timelineItems.push({
                          label: 'Viewed by Client',
                          date: new Date(new Date(proposal.appliedDate).getTime() + 3600000).toISOString(),
                          completed: true,
                          icon: CheckCircle,
                          color: 'bg-purple-500'
                        });
                      } else if (proposal.status === 'interview') {
                        timelineItems.push(
                          {
                            label: 'Viewed by Client',
                            date: new Date(new Date(proposal.appliedDate).getTime() + 3600000).toISOString(),
                            completed: true,
                            icon: CheckCircle,
                            color: 'bg-purple-500'
                          },
                          {
                            label: 'Interview Scheduled',
                            date: new Date(new Date(proposal.appliedDate).getTime() + 7200000).toISOString(),
                            completed: true,
                            icon: User,
                            color: 'bg-blue-500'
                          }
                        );
                      } else if (proposal.status === 'hired') {
                        timelineItems.push(
                          {
                            label: 'Viewed by Client',
                            date: new Date(new Date(proposal.appliedDate).getTime() + 3600000).toISOString(),
                            completed: true,
                            icon: CheckCircle,
                            color: 'bg-purple-500'
                          },
                          {
                            label: 'Interview Completed',
                            date: new Date(new Date(proposal.appliedDate).getTime() + 7200000).toISOString(),
                            completed: true,
                            icon: User,
                            color: 'bg-blue-500'
                          },
                          {
                            label: 'Hired for Job',
                            date: new Date(new Date(proposal.appliedDate).getTime() + 10800000).toISOString(),
                            completed: true,
                            icon: CheckCircle,
                            color: 'bg-green-500'
                          }
                        );
                      } else if (proposal.status === 'completed') {
                        timelineItems.push(
                          {
                            label: 'Viewed by Client',
                            date: new Date(new Date(proposal.appliedDate).getTime() + 3600000).toISOString(),
                            completed: true,
                            icon: CheckCircle,
                            color: 'bg-purple-500'
                          },
                          {
                            label: 'Hired for Job',
                            date: new Date(new Date(proposal.appliedDate).getTime() + 7200000).toISOString(),
                            completed: true,
                            icon: CheckCircle,
                            color: 'bg-green-500'
                          },
                          {
                            label: 'Job Completed',
                            date: new Date(new Date(proposal.appliedDate).getTime() + 86400000).toISOString(),
                            completed: true,
                            icon: CheckCircle,
                            color: 'bg-emerald-500'
                          }
                        );
                      } else {
                        // For pending status, show viewed as pending
                        timelineItems.push({
                          label: 'Viewed by Client',
                          date: null,
                          completed: false,
                          icon: CheckCircle,
                          color: 'bg-white/10'
                        });
                      }

                      // Add final status if applicable
                      if (['rejected', 'cancelled', 'withdrawn', 'expired'].includes(proposal.status)) {
                        const statusLabels = {
                          rejected: 'Proposal Rejected',
                          cancelled: 'Proposal Cancelled',
                          withdrawn: 'Proposal Withdrawn',
                          expired: 'Proposal Expired'
                        };
                        timelineItems.push({
                          label: statusLabels[proposal.status as keyof typeof statusLabels],
                          date: new Date().toISOString(),
                          completed: true,
                          icon: XCircle,
                          color: 'bg-red-500'
                        });
                      }

                      return timelineItems.map((item, index) => (
                        <div key={index} className="relative pl-10">
                          <div className={`absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center ${item.color}`}>
                            <item.icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{item.label}</p>
                            {item.date ? (
                              <p className="text-xs text-white/60">
                                {new Date(item.date).toLocaleDateString('en-US', {
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
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Client Profile */}
            <ClientProfile
              client={{
                name: proposal.clientName,
                image: proposal.clientImage,
                location: proposal.location,
                memberSince: proposal.clientSince,
                rating: proposal.clientRating,
                moneySpent: proposal.moneySpent,
                jobsCompleted: proposal.projectsCompleted,
                freelancersWorked: proposal.freelancersWorked,
                freelancerAvatars: proposal.freelancerAvatars,
                experienceLevel: proposal.experienceLevel
              }}
              location={proposal.location}
              showCommunicationButtons={proposal.status === 'accepted'}
              onChat={handleChat}
              onCall={handleCall}
            />

            {/* Job Details */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/5 rounded-full blur-xl"></div>

              {/* Card content */}
              <div className="relative p-5">
                {/* Header with status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-white/90">Job Details</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-400">Project</p>
                    <p className="text-base font-medium text-white break-words">{proposal.jobTitle}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center space-y-1">
                      <p className="text-sm text-gray-400">Posted on</p>
                      <p className="text-sm font-medium">
                        {new Date(proposal.appliedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm text-gray-400">Location</p>
                      <button
                        onClick={() => handleOpenMap(proposal.location)}
                        className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors underline decoration-purple-400/50 hover:decoration-purple-300"
                        title="View on map"
                      >
                        {proposal.location}
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-600/30 pt-4 space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Job Description</h3>
                      <p className="text-gray-300 text-sm">{proposal.description}</p>
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
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                isMatching
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-gray-700/50 text-gray-300 border border-gray-600/30'
                              }`}
                            >
                              {isMatching && (
                                <CheckCircle className="w-3 h-3 mr-1 text-purple-400" />
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
            </div>

            {/* Your Proposal */}
            <div ref={yourProposalRef} className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-400/5 rounded-full blur-xl"></div>

              {/* Card content */}
              <div className="relative p-5">

                {/* Header with status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-white/90">
                      {proposal.status === 'withdrawn' ? 'Withdrawn Proposal' : 'Your Proposal'}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {proposal.rating && (
                      <div className="flex items-center">
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
                    {proposal.status === 'pending' && !isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400/50 transition-all"
                        onClick={handleEdit}
                      >
                        Edit Proposal
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Cover Letter</h3>
                    {isEditing ? (
                      <textarea
                        value={editedProposal?.proposal.coverLetter || ''}
                        onChange={(e) => setEditedProposal(prev => prev ? {
                          ...prev,
                          proposal: { ...prev.proposal, coverLetter: e.target.value }
                        } : null)}
                        className="w-full p-3 bg-[#111111] border border-gray-600 rounded-xl text-white resize-none text-sm"
                        rows={4}
                        placeholder="Write your cover letter..."
                      />
                    ) : (
                      <p className="text-gray-300 text-sm">{proposal.proposal.coverLetter}</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Your Rate</h3>
                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedProposal?.proposal.proposedRate || ''}
                          onChange={(e) => setEditedProposal(prev => prev ? {
                            ...prev,
                            proposal: { ...prev.proposal, proposedRate: parseInt(e.target.value) || 0 }
                          } : null)}
                          className="bg-[#111111] border border-gray-600 rounded px-2 py-1 text-white w-20 text-sm"
                          placeholder="Rate"
                        />
                      ) : (
                        <span className="text-lg font-medium text-purple-400">₹{proposal.proposal.proposedRate}</span>
                      )}
                      <span className="text-sm text-gray-400">/ project</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-400">Attachments</h3>
                      {proposal.status === 'pending' && isEditing && (
                        <label className="p-1.5 text-gray-400 hover:text-purple-400 rounded-full hover:bg-purple-500/10 transition-colors cursor-pointer" title="Upload attachment">
                          <PlusCircle className="w-4 h-4" />
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileSelect(e.target.files)}
                            multiple
                            accept=".pdf,.jpg,.jpeg"
                          />
                        </label>
                      )}
                    </div>
                    <div className="space-y-2">
                      {(() => {
                        const attachments = isEditing ? editedProposal?.proposal.attachments : proposal?.proposal.attachments;
                        return attachments && attachments.length > 0 ? (
                          attachments.map((file, index) => (
                            <div key={index} className="group flex items-center justify-between p-3 bg-[#1e1e1e] rounded-lg hover:bg-gray-500/30 transition-colors">
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
                                  className="p-1 text-gray-400 hover:text-purple-400 rounded-full hover:bg-gray-700 transition-colors"
                                  title="View file"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </a>
                                {isEditing && (
                                  <button
                                    className="p-1 text-gray-400 hover:text-red-400 rounded-full hover:bg-red-500/10 transition-colors"
                                    onClick={() => handleRemoveFile(file)}
                                    title="Remove file"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/30">
                            <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />
                            <p className="text-sm text-gray-400">No attachments yet</p>
                            <p className="text-xs text-gray-500 mt-1">Upload files to support your proposal</p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {proposal.status === 'accepted' && (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
                        onClick={handleChat}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
                        onClick={handleCall}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing ? (
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-10 border-gray-600/50 text-white/90 hover:bg-[#111111] hover:text-white hover:border-gray-500/50 transition-all duration-200"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1 h-10 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-200"
                  onClick={handleSaveEdit}
                  disabled={isWithdrawing}
                >
                  {isWithdrawing ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            ) : proposal.status === 'pending' ? (
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400/50 transition-all hover:shadow-lg hover:shadow-red-500/10"
                  onClick={() => setShowWithdrawConfirm(true)}
                >
                  Withdraw Proposal
                </Button>
              </div>
            ) : null}
        </div>
        </div>
        </div>
      {showWithdrawConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg p-6 max-w-md w-full"
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
                  className="border-gray-600 text-gray-300 hover:bg-[#1e1e1e] hover:text-gray-200"
                  onClick={() => setShowWithdrawConfirm(false)}
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

      {/* Full Screen Map */}
      <FullScreenMap
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        location={mapLocation}
      />

      {/* Success Message */}
      <SuccessMessage
        message={successMessage.message}
        description={successMessage.description}
        isVisible={successMessage.isVisible}
        variant={successMessage.variant}
        position="center"
        onClose={() => setSuccessMessage(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
    </>
  );
}
